import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { ArbiterRunner } from './ArbiterRunner';
import { LocalRunner } from './LocalRunner';

export class RunnerFactory {
  static async createRunner(server: McpServer): Promise<ArbiterRunner> {
    const isLocal = process.argv.includes('--local');

    if (isLocal) return new LocalRunner(server);

    const { CloudRunner } = await import('./CloudRunner');

    return new CloudRunner(server);
  }
}
