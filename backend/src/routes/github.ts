import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import { Octokit } from 'octokit';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as schema from '../db/schema.js';
import type { App } from '../index.js';

interface GitHubSetupBody {
  githubToken: string;
  repoOwner: string;
  repoName: string;
  autoSync: boolean;
}

interface SyncResponse {
  success: boolean;
  filesSynced?: number;
  filesFailed?: number;
  message: string;
}

/**
 * Test GitHub connection with provided token
 */
async function testGitHubConnection(token: string, owner: string, repo: string): Promise<boolean> {
  try {
    const octokit = new Octokit({ auth: token });
    await octokit.rest.repos.get({
      owner,
      repo,
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get list of files from filesystem to sync to GitHub
 */
async function getProjectFiles(): Promise<
  {
    name: string;
    content: string;
    path: string;
  }[]
> {
  const files: {
    name: string;
    content: string;
    path: string;
  }[] = [];

  // File patterns to include
  const includePatterns = [
    /\.(tsx?|jsx?)$/,  // TypeScript/JavaScript files
    /^package\.json$/,
    /^app\.json$/,
    /^tsconfig\.json$/,
    /^README\.md$/,
    /^\.env\.example$/,
    /^\.gitignore$/,
    /^drizzle\.config\.ts$/,
  ];

  // Directories to scan
  const dirsToScan = [
    'app',
    'components',
    'utils',
    'contexts',
    'lib',
    'styles',
    'constants',
    'src',
  ];

  // Get the project root (parent of backend directory)
  const backendDir = process.cwd();
  const projectRoot = path.dirname(backendDir);

  /**
   * Recursively scan directory for files
   */
  const scanDirectory = async (dir: string, relativeTo: string = '') => {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        // Skip node_modules, .git, dist, build, etc.
        if (['node_modules', '.git', 'dist', 'build', '.next', 'out'].includes(entry.name)) {
          continue;
        }

        const fullPath = path.join(dir, entry.name);
        const relPath = relativeTo ? path.join(relativeTo, entry.name) : entry.name;

        if (entry.isDirectory()) {
          await scanDirectory(fullPath, relPath);
        } else if (entry.isFile()) {
          // Check if file matches include patterns
          const shouldInclude = includePatterns.some((pattern) => pattern.test(entry.name));

          if (shouldInclude) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8');
              files.push({
                name: entry.name,
                content,
                path: relPath,
              });
            } catch (error) {
              // Skip files that can't be read
              console.error(`Failed to read file ${fullPath}:`, error);
            }
          }
        }
      }
    } catch (error) {
      // Skip directories that can't be read
      console.error(`Failed to read directory ${dir}:`, error);
    }
  };

  // Scan root level files first
  try {
    const rootEntries = await fs.readdir(projectRoot, { withFileTypes: true });
    for (const entry of rootEntries) {
      if (entry.isFile()) {
        const shouldInclude = includePatterns.some((pattern) => pattern.test(entry.name));
        if (shouldInclude) {
          try {
            const fullPath = path.join(projectRoot, entry.name);
            const content = await fs.readFile(fullPath, 'utf-8');
            files.push({
              name: entry.name,
              content,
              path: entry.name,
            });
          } catch (error) {
            console.error(`Failed to read file ${entry.name}:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Failed to read project root:`, error);
  }

  // Scan specified directories
  for (const dir of dirsToScan) {
    const fullPath = path.join(projectRoot, dir);
    try {
      const stats = await fs.stat(fullPath);
      if (stats.isDirectory()) {
        await scanDirectory(fullPath, dir);
      }
    } catch (error) {
      // Directory might not exist, which is fine
    }
  }

  return files;
}

/**
 * Sync files to GitHub repository
 */
async function syncFilesToGitHub(
  app: App,
  token: string,
  owner: string,
  repo: string,
  files: {
    path: string;
    name: string;
    content: string;
  }[]
): Promise<{ synced: number; failed: number }> {
  const octokit = new Octokit({ auth: token });
  let synced = 0;
  let failed = 0;

  app.logger.info({ fileCount: files.length }, 'Starting file sync to GitHub');

  for (const file of files) {
    try {
      const fileContent = Buffer.from(file.content).toString('base64');

      // Check if file exists to get its SHA for updates
      let sha: string | undefined;
      try {
        const existingFile = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.path,
        });
        if ('sha' in existingFile.data) {
          sha = existingFile.data.sha;
        }
      } catch {
        // File doesn't exist, which is fine
      }

      // Create or update file
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: file.path,
        message: `Update ${file.name}`,
        content: fileContent,
        ...(sha && { sha }),
      });

      synced++;
      app.logger.debug({ filePath: file.path }, 'File synced successfully');
    } catch (error) {
      app.logger.warn({ err: error, filePath: file.path }, 'Failed to sync file to GitHub');
      failed++;
    }
  }

  app.logger.info({ synced, failed }, 'File sync to GitHub completed');
  return { synced, failed };
}

export function register(app: App, fastify: FastifyInstance) {
  /**
   * GET /api/github/setup - Get current GitHub settings
   */
  fastify.get('/api/github/setup', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any> => {
    app.logger.info({}, 'Fetching GitHub settings');

    try {
      // Get the first (and typically only) GitHub settings record
      const settings = await app.db
        .select()
        .from(schema.githubSettings)
        .limit(1);

      if (settings.length === 0) {
        app.logger.info({}, 'No GitHub settings found, returning defaults');
        return {
          githubToken: '',
          repoOwner: 'r73723189-alt',
          repoName: 'Gnosis-',
          autoSync: false,
          lastSync: null,
        };
      }

      const setting = settings[0];

      app.logger.info({}, 'GitHub settings fetched successfully');

      return {
        githubToken: setting.githubToken ? '****' : '', // Don't expose full token
        repoOwner: setting.repoOwner,
        repoName: setting.repoName,
        autoSync: setting.autoSync === 'true',
        lastSync: setting.lastSync,
      };
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to fetch GitHub settings');
      throw error;
    }
  });

  /**
   * POST /api/github/setup - Save/update GitHub configuration
   */
  fastify.post('/api/github/setup', async (
    request: FastifyRequest<{
      Body: GitHubSetupBody;
    }>,
    reply: FastifyReply
  ): Promise<{ success: boolean; message: string }> => {
    const { githubToken, repoOwner, repoName, autoSync } = request.body;

    app.logger.info({ repoOwner, repoName }, 'Saving GitHub settings');

    try {
      // Test connection to GitHub
      const isConnected = await testGitHubConnection(githubToken, repoOwner, repoName);

      if (!isConnected) {
        app.logger.warn(
          { repoOwner, repoName },
          'GitHub connection test failed'
        );
        return reply.status(400).send({
          success: false,
          message: 'Failed to connect to GitHub repository. Check token and repository details.',
        });
      }

      // Check if settings exist
      const existingSettings = await app.db
        .select()
        .from(schema.githubSettings)
        .limit(1);

      if (existingSettings.length > 0) {
        // Update existing settings (use the first record)
        const setting = existingSettings[0];
        await app.db
          .update(schema.githubSettings)
          .set({
            githubToken,
            repoOwner,
            repoName,
            autoSync: autoSync.toString(),
            updatedAt: new Date(),
          })
          .where(eq(schema.githubSettings.id, setting.id));

        app.logger.info(
          { repoOwner, repoName },
          'GitHub settings updated successfully'
        );
      } else {
        // Create new settings with a placeholder userId
        await app.db.insert(schema.githubSettings).values({
          userId: '00000000-0000-0000-0000-000000000000' as any,
          githubToken,
          repoOwner,
          repoName,
          autoSync: autoSync.toString(),
        });

        app.logger.info(
          { repoOwner, repoName },
          'GitHub settings created successfully'
        );
      }

      return {
        success: true,
        message: 'GitHub connected successfully',
      };
    } catch (error) {
      app.logger.error({ err: error, repoOwner, repoName }, 'Failed to save GitHub settings');
      throw error;
    }
  });

  /**
   * GET /api/github/get-files - Get list of files to be synced
   */
  fastify.get('/api/github/get-files', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<
    {
      path: string;
      name: string;
      size: number;
    }[]
  > => {
    app.logger.info({}, 'Fetching files for sync');

    try {
      const files = await getProjectFiles();

      const fileList = files.map((file) => ({
        path: file.path,
        name: file.name,
        size: file.content.length,
      }));

      app.logger.info({ count: fileList.length }, 'Files fetched for sync');

      return fileList;
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to fetch files for sync');
      throw error;
    }
  });

  /**
   * POST /api/github/sync - Sync project files to GitHub
   */
  fastify.post('/api/github/sync', async (
    request: FastifyRequest<{
      Body: Record<string, never>;
    }>,
    reply: FastifyReply
  ): Promise<SyncResponse> => {
    app.logger.info({}, 'Starting GitHub sync');

    try {
      // Get GitHub settings
      const settings = await app.db
        .select()
        .from(schema.githubSettings)
        .limit(1);

      if (settings.length === 0) {
        app.logger.warn({}, 'GitHub settings not configured');
        return reply.status(400).send({
          success: false,
          filesSynced: 0,
          filesFailed: 0,
          message: 'GitHub settings not configured. Please set up GitHub integration first.',
        });
      }

      const setting = settings[0];

      // Get project files from filesystem
      const files = await getProjectFiles();

      if (files.length === 0) {
        app.logger.info({}, 'No files to sync');
        return {
          success: true,
          filesSynced: 0,
          filesFailed: 0,
          message: 'No files to sync',
        };
      }

      app.logger.info({ fileCount: files.length }, 'Files to sync found');

      // Sync files to GitHub
      const { synced, failed } = await syncFilesToGitHub(
        app,
        setting.githubToken,
        setting.repoOwner,
        setting.repoName,
        files
      );

      // Only update last sync timestamp if sync was successful or had partial success
      if (synced > 0) {
        await app.db
          .update(schema.githubSettings)
          .set({
            lastSync: new Date(),
          })
          .where(eq(schema.githubSettings.id, setting.id));

        app.logger.info(
          { synced, failed },
          'GitHub sync timestamp updated'
        );
      }

      if (failed > 0) {
        return {
          success: false,
          filesSynced: synced,
          filesFailed: failed,
          message: `Synced ${synced} files, ${failed} failed`,
        };
      }

      return {
        success: true,
        filesSynced: synced,
        filesFailed: 0,
        message: `Successfully synced ${synced} files`,
      };
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to sync to GitHub');
      return {
        success: false,
        filesSynced: 0,
        filesFailed: 0,
        message: `GitHub sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  });
}
