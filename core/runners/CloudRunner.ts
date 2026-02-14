import { randomUUID } from 'crypto';
import express, { NextFunction, Request, Response } from 'express';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import { ArbiterRunner } from './ArbiterRunner';
import { getConfiguration } from './environment';

const { port, authToken } = getConfiguration();

export class CloudRunner extends ArbiterRunner {
  private app: express.Express;
  private sessions: Map<string, StreamableHTTPServerTransport> = new Map();

  constructor(server: McpServer) {
    super(server);
    this.app = express();
  }

  async run(): Promise<void> {
    this.app.all(
      '/mcp',
      this.middleware(),
      async (req: Request, res: Response) => {
        const sessionId = req.headers['mcp-session-id'] as string | undefined;

        if (sessionId && this.sessions.has(sessionId)) {
          const transport = this.sessions.get(sessionId)!;

          await transport.handleRequest(req, res);

          return;
        }

        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (id) => {
            this.sessions.set(id, transport);
          },
        });

        transport.onclose = () => {
          if (transport.sessionId) this.sessions.delete(transport.sessionId);
        };

        await this.server.connect(transport);
        await transport.handleRequest(req, res);
      }
    );

    this.app.listen(port, () => this.initializeMessageHandler());
  }

  private middleware() {
    const authMiddleware = (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const auth = req.headers['authorization'];

      if (auth === `Bearer ${authToken}`) return next();

      res.status(401).json({ error: 'Invalid Token' });
    };

    return authMiddleware;
  }

  private initializeMessageHandler() {
    process.stderr.write(`🌐 MCP running in CLOUD mode (Port: ${port})\n`);
    process.stderr.write(`🔑 Access Token: ${authToken}\n`);
    process.stderr.write(`📡 Endpoint: http://localhost:${port}/mcp\n`);
    process.stderr.write(
      JSON.stringify(
        {
          mcpServers: {
            'arbiter-cloud': {
              serverUrl: `http://localhost:${port}/mcp`,
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          },
        },
        null,
        2,
      ) + '\n',
    );
  }
}
