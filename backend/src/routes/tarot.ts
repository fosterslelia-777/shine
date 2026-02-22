import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import { gateway } from '@specific-dev/framework';
import { generateObject } from 'ai';
import { z } from 'zod';
import * as schema from '../db/schema.js';
import type { App } from '../index.js';

// Tarot deck with all 78 cards
const TAROT_DECK = [
  // Major Arcana
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
  'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
  'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
  'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
  'Judgement', 'The World',
  // Minor Arcana - Wands
  'Ace of Wands', 'Two of Wands', 'Three of Wands', 'Four of Wands', 'Five of Wands',
  'Six of Wands', 'Seven of Wands', 'Eight of Wands', 'Nine of Wands', 'Ten of Wands',
  'Page of Wands', 'Knight of Wands', 'Queen of Wands', 'King of Wands',
  // Minor Arcana - Cups
  'Ace of Cups', 'Two of Cups', 'Three of Cups', 'Four of Cups', 'Five of Cups',
  'Six of Cups', 'Seven of Cups', 'Eight of Cups', 'Nine of Cups', 'Ten of Cups',
  'Page of Cups', 'Knight of Cups', 'Queen of Cups', 'King of Cups',
  // Minor Arcana - Swords
  'Ace of Swords', 'Two of Swords', 'Three of Swords', 'Four of Swords', 'Five of Swords',
  'Six of Swords', 'Seven of Swords', 'Eight of Swords', 'Nine of Swords', 'Ten of Swords',
  'Page of Swords', 'Knight of Swords', 'Queen of Swords', 'King of Swords',
  // Minor Arcana - Pentacles
  'Ace of Pentacles', 'Two of Pentacles', 'Three of Pentacles', 'Four of Pentacles', 'Five of Pentacles',
  'Six of Pentacles', 'Seven of Pentacles', 'Eight of Pentacles', 'Nine of Pentacles', 'Ten of Pentacles',
  'Page of Pentacles', 'Knight of Pentacles', 'Queen of Pentacles', 'King of Pentacles',
];

interface Card {
  name: string;
  position: number;
  reversed: boolean;
}

interface PositionMeaning {
  position: number;
  card: string;
  reversed: boolean;
  meaning: string;
}

interface AdviceItem {
  theme: string;
  suggestion: string;
}

const aiResponseSchema = z.object({
  position_meanings: z.array(
    z.object({
      position: z.number(),
      card: z.string(),
      reversed: z.boolean(),
      meaning: z.string(),
    })
  ),
  integrated_summary: z.string(),
  advice: z.array(
    z.object({
      theme: z.string(),
      suggestion: z.string(),
    })
  ),
});

type AIResponse = z.infer<typeof aiResponseSchema>;

/**
 * Fisher-Yates shuffle with seed for reproducibility
 */
function seededShuffle(array: string[], seed: number): string[] {
  const result = [...array];
  let random = seed;

  const pseudoRandom = () => {
    const x = Math.sin(random++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(pseudoRandom() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Generate random reversed flags for cards
 */
function generateReversedFlags(cardCount: number, seed: number): boolean[] {
  let random = seed;

  const pseudoRandom = () => {
    const x = Math.sin(random++) * 10000;
    return x - Math.floor(x);
  };

  const reversed: boolean[] = [];
  for (let i = 0; i < cardCount; i++) {
    reversed.push(pseudoRandom() > 0.5);
  }

  return reversed;
}

export function register(app: App, fastify: FastifyInstance) {
  const requireAuth = app.requireAuth();

  /**
   * POST /api/tarot/reading - Create new tarot reading
   */
  fastify.post('/api/tarot/reading', async (
    request: FastifyRequest<{
      Body: {
        persona: string;
        spread_type: string;
        user_query?: string;
      };
    }>,
    reply: FastifyReply
  ): Promise<{
    spread_id: string;
    position_meanings: PositionMeaning[];
    integrated_summary: string;
    advice: AdviceItem[];
    cards: Card[];
  }> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const { persona, spread_type, user_query } = request.body;
    const userId = session.user.id;

    app.logger.info(
      { userId, persona, spread_type, query: user_query },
      'Creating tarot reading'
    );

    try {
      // Determine number of cards based on spread type
      let cardCount = 3;
      if (spread_type.toLowerCase() === 'celtic cross') cardCount = 10;
      else if (spread_type.toLowerCase() === 'three card') cardCount = 3;
      else if (spread_type.toLowerCase() === 'five card') cardCount = 5;
      else if (spread_type.toLowerCase() === 'seven card') cardCount = 7;

      // Shuffle deck with seed (using current timestamp)
      const seed = Date.now();
      const shuffledDeck = seededShuffle(TAROT_DECK, seed);
      const selectedCards = shuffledDeck.slice(0, cardCount);

      // Generate reversed flags
      const reversedFlags = generateReversedFlags(cardCount, seed * 2);

      // Create card objects
      const cards: Card[] = selectedCards.map((name, index) => ({
        name,
        position: index + 1,
        reversed: reversedFlags[index],
      }));

      // Get evidence for each card from pdf_chunks
      const cardEvidenceMap: Record<string, string> = {};
      for (const card of cards) {
        const chunks = await app.db
          .select()
          .from(schema.pdfChunks)
          .where(eq(schema.pdfChunks.cardName, card.name))
          .limit(2);

        if (chunks.length > 0) {
          cardEvidenceMap[card.name] = chunks.map((c) => c.chunkText).join('\n');
        }
      }

      // Build context for AI
      const cardsContext = cards
        .map(
          (c) =>
            `Position ${c.position}: ${c.name}${c.reversed ? ' (Reversed)' : ''}\n${cardEvidenceMap[c.name] || 'No additional context available.'}`
        )
        .join('\n\n');

      const systemPrompt = `You are an experienced tarot reader with deep knowledge of tarot symbolism and interpretation. You adopt the persona of "${persona}" when providing readings.
Your role is to provide insightful, thoughtful, and meaningful tarot interpretations.`;

      const userPrompt = `Please provide a tarot reading based on the following:

Spread Type: ${spread_type}
${user_query ? `Question/Context: ${user_query}` : ''}

Cards drawn:
${cardsContext}

Please provide your response as a JSON object with the following structure:
{
  "position_meanings": [
    {
      "position": number,
      "card": "card name",
      "reversed": boolean,
      "meaning": "interpretation of this card in this position"
    }
  ],
  "integrated_summary": "overall summary of the reading considering all cards",
  "advice": [
    {
      "theme": "theme title",
      "suggestion": "actionable advice"
    }
  ]
}`;

      app.logger.info(
        { cardCount, cardNames: cards.map((c) => c.name) },
        'Calling AI model for tarot interpretation'
      );

      const { object } = await generateObject({
        model: gateway('google/gemini-2.5-flash'),
        schema: aiResponseSchema,
        schemaName: 'TarotReading',
        schemaDescription: 'Tarot reading with position meanings, summary, and advice',
        system: systemPrompt,
        prompt: userPrompt,
      });

      // Save to database
      const reading = await app.db
        .insert(schema.tarotSpreadsV2)
        .values({
          userId,
          persona,
          spreadType: spread_type,
          userQuery: user_query || null,
          cards: JSON.stringify(cards),
          positionMeanings: JSON.stringify(object.position_meanings),
          integratedSummary: object.integrated_summary,
          advice: JSON.stringify(object.advice),
        })
        .returning();

      const spreadId = reading[0].id;

      app.logger.info(
        { spreadId, userId, cardCount },
        'Tarot reading created successfully'
      );

      return {
        spread_id: spreadId,
        position_meanings: object.position_meanings,
        integrated_summary: object.integrated_summary,
        advice: object.advice,
        cards,
      };
    } catch (error) {
      app.logger.error(
        { err: error, userId, persona, spread_type },
        'Failed to create tarot reading'
      );
      throw error;
    }
  });

  /**
   * GET /api/tarot/readings - Get current user's readings
   */
  fastify.get('/api/tarot/readings', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<
    {
      id: string;
      persona: string;
      spread_type: string;
      created_at: Date;
      integrated_summary: string;
    }[]
  > => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const userId = session.user.id;

    app.logger.info({ userId }, 'Fetching user tarot readings');

    try {
      const readings = await app.db
        .select({
          id: schema.tarotSpreadsV2.id,
          persona: schema.tarotSpreadsV2.persona,
          spread_type: schema.tarotSpreadsV2.spreadType,
          created_at: schema.tarotSpreadsV2.createdAt,
          integrated_summary: schema.tarotSpreadsV2.integratedSummary,
        })
        .from(schema.tarotSpreadsV2)
        .where(eq(schema.tarotSpreadsV2.userId, userId))
        .orderBy(schema.tarotSpreadsV2.createdAt);

      app.logger.info(
        { userId, count: readings.length },
        'Tarot readings fetched successfully'
      );

      return readings;
    } catch (error) {
      app.logger.error({ err: error, userId }, 'Failed to fetch tarot readings');
      throw error;
    }
  });

  /**
   * GET /api/tarot/reading/:id - Get specific reading
   */
  fastify.get('/api/tarot/reading/:id', async (
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply
  ): Promise<any> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const { id } = request.params;
    const userId = session.user.id;

    app.logger.info({ userId, spreadId: id }, 'Fetching tarot reading');

    try {
      const reading = await app.db
        .select()
        .from(schema.tarotSpreadsV2)
        .where(eq(schema.tarotSpreadsV2.id, id))
        .limit(1);

      if (reading.length === 0) {
        app.logger.warn({ userId, spreadId: id }, 'Tarot reading not found');
        return reply.status(404).send({ error: 'Reading not found' });
      }

      const spread = reading[0];

      // Verify ownership
      if (spread.userId !== userId) {
        app.logger.warn(
          { userId, spreadId: id, ownerId: spread.userId },
          'Unauthorized access to tarot reading'
        );
        return reply.status(403).send({ error: 'Unauthorized' });
      }

      app.logger.info({ userId, spreadId: id }, 'Tarot reading fetched successfully');

      return {
        id: spread.id,
        persona: spread.persona,
        spread_type: spread.spreadType,
        user_query: spread.userQuery,
        cards: JSON.parse(spread.cards as string),
        position_meanings: JSON.parse(spread.positionMeanings as string),
        integrated_summary: spread.integratedSummary,
        advice: JSON.parse(spread.advice as string),
        created_at: spread.createdAt,
      };
    } catch (error) {
      app.logger.error({ err: error, userId, spreadId: id }, 'Failed to fetch tarot reading');
      throw error;
    }
  });
}
