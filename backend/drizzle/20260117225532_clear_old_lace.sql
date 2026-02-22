CREATE TABLE "pdf_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_name" text NOT NULL,
	"chunk_text" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tarot_spreads_v2" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"persona" text NOT NULL,
	"spread_type" text NOT NULL,
	"user_query" text,
	"cards" jsonb NOT NULL,
	"position_meanings" jsonb NOT NULL,
	"integrated_summary" text NOT NULL,
	"advice" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "card_name_idx" ON "pdf_chunks" USING btree ("card_name");