import { createApplication } from "@specific-dev/framework";
import * as schema from './db/schema.js';
import * as tarotRoutes from './routes/tarot.js';
import * as projectsRoutes from './routes/projects.js';
import * as githubRoutes from './routes/github.js';

// Create application with schema for full database type support
export const app = await createApplication(schema);

// Export App type for use in route files
export type App = typeof app;

// Enable authentication
app.withAuth();

// Register routes - add your route modules here
// IMPORTANT: Always use registration functions to avoid circular dependency issues
tarotRoutes.register(app, app.fastify);
projectsRoutes.register(app, app.fastify);
githubRoutes.register(app, app.fastify);

await app.run();
app.logger.info('Application running');
