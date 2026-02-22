import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema.js';
import type { App } from '../index.js';

export function register(app: App, fastify: FastifyInstance) {
  /**
   * GET /api/projects - Get all projects
   */
  fastify.get('/api/projects', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<
    {
      id: string;
      name: string;
      description: string | null;
      type: string | null;
      lastModified: Date | null;
    }[]
  > => {
    app.logger.info({}, 'Fetching all projects');

    try {
      const projects = await app.db
        .select({
          id: schema.projects.id,
          name: schema.projects.name,
          description: schema.projects.description,
          type: schema.projects.type,
          lastModified: schema.projects.lastModified,
        })
        .from(schema.projects);

      app.logger.info({ count: projects.length }, 'Projects fetched successfully');

      return projects;
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to fetch projects');
      throw error;
    }
  });

  /**
   * GET /api/projects/:id - Get single project details
   */
  fastify.get('/api/projects/:id', async (
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply
  ): Promise<any> => {
    const { id } = request.params;

    app.logger.info({ projectId: id }, 'Fetching project details');

    try {
      const project = await app.db
        .select()
        .from(schema.projects)
        .where(eq(schema.projects.id, id))
        .limit(1);

      if (project.length === 0) {
        app.logger.warn({ projectId: id }, 'Project not found');
        return reply.status(404).send({ error: 'Project not found' });
      }

      const proj = project[0];

      app.logger.info({ projectId: id }, 'Project details fetched successfully');

      return {
        id: proj.id,
        name: proj.name,
        description: proj.description,
        type: proj.type,
        lastModified: proj.lastModified,
        createdAt: proj.createdAt,
      };
    } catch (error) {
      app.logger.error({ err: error, projectId: id }, 'Failed to fetch project details');
      throw error;
    }
  });
}
