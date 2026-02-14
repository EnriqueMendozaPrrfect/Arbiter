import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { ArbiterRunner } from './ArbiterRunner';

export class LocalRunner extends ArbiterRunner {
  constructor(server: McpServer) {
    super(server);
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();

    await this.server.connect(transport);

    process.stderr.write('🚀 MCP running in LOCAL mode (Stdio)\n');
    process.stderr.write(
      'To add this server to your MCP configuration, use:\n',
    );
    process.stderr.write(
      JSON.stringify(
        {
          mcpServers: {
            arbiter: {
              command: 'node',
              args: [process.argv[1], '--local'],
            },
          },
        },
        null,
        2,
      ) + '\n',
    );
    process.stderr.write(`if you are using homebrew: "command": "/opt/homebrew/bin/node"`);
  }
}
