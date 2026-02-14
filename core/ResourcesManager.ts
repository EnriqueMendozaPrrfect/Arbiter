import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { ResourceDefinition } from './types';

export class ResourcesManager {
  private resources: ResourceDefinition[];

  constructor(resources: ResourceDefinition[]) {
    this.resources = resources;
  }

  async execute(server: McpServer) {
    this.resources.forEach((resource) => {
      server.registerResource(
        resource.name,
        resource.template,
        resource.metadata,
        resource.handler,
      );

      const toolName = `get_${resource.ruleId.replace(/\s+/g, '_')}`;

      server.registerTool(toolName, {}, async () => {
        const uri = `rules://${resource.ruleId}`;
        const result = await resource.handler({ href: uri }, {});

        return {
          content: result.contents.map((c) => ({
            type: 'text' as const,
            text: c.text,
          })),
        };
      });
    });
  }
}
