import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export abstract class ArbiterRunner {
  constructor(protected server: McpServer) { }

  abstract run(): Promise<void>;
}
