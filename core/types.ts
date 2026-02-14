import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

export type Rule = {
  id: string;
  name: string;
  description: string;
  path: string;
};

export type Config = {
  rules: Rule[];
};

export interface ResourceDefinition {
  name: string;
  ruleId: string;
  template: ResourceTemplate;
  metadata: { description: string; mimeType: string };
  handler: (
    uri: { href: string },
    extra: any,
  ) => Promise<{ contents: { uri: string; mimeType: string; text: string }[] }>;
}
