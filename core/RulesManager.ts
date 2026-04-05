import { constants } from 'fs';
import fs from 'fs/promises';
import path from 'path';

import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

import { Config, ResourceDefinition, Rule } from './types';


export class RulesManager {
  private rulesCache = new Map<string, string>();
  private config: Config | null = null;
  private rootDir: string;

  constructor() {
    this.rootDir = path.resolve(__dirname, '..');
  }

  async initialize(): Promise<ResourceDefinition[]> {
    try {
      const configPath = path.join(this.rootDir, 'config.json');
      const configData = await fs.readFile(configPath, 'utf-8');
      this.config = JSON.parse(configData);

      if (!this.config) throw new Error('Configuration not loaded.');

      process.stderr.write(`🔍 Validating rules files (Root: ${this.rootDir})...\n`);

      for (const rule of this.config.rules) {
        const rulePath = path.join(this.rootDir, 'rules', rule.path);

        await fs.access(rulePath, constants.R_OK);

        process.stderr.write(`[OK] ${rule.name} -> ${rule.path}\n`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        process.stderr.write(
          `❌ Critical Error: Could not validate configuration or files.\n${err.message}\n`
        );
      } else {
        process.stderr.write(
          `❌ Critical Error: Could not validate configuration or files.\n${String(err)}\n`
        );
      }

      process.exit(1);
    }

    const resources: ResourceDefinition[] = [];

    for (const rule of this.config.rules) {
      resources.push({
        name: rule.name,
        ruleId: rule.id,
        metadata: { description: rule.description, mimeType: 'text/markdown' },
        handler: this.createRuleHandler(rule),
        template: new ResourceTemplate(`rules://${rule.id}`, {
          list: undefined,
        })
      });
    }

    return resources;
  }

  private createRuleHandler(rule: Rule) {
    return async (uri: { href: string }) => {
      const href = uri.href;

      if (this.rulesCache.has(href)) {
        return {
          contents: [this.createContentObject(href, this.rulesCache.get(href)!)],
        };
      }

      const rulePath = path.join(this.rootDir, 'rules', rule.path);
      const content = await fs.readFile(rulePath, 'utf-8');

      this.rulesCache.set(href, content);

      process.stderr.write(`[INFO] Cached rule: ${rule.id}\n`);

      return {
        contents: [this.createContentObject(href, content)],
      };
    };
  }

  private createContentObject(uri: string, content: string) {
    return {
      uri,
      mimeType: 'text/markdown',
      text: content
    };
  }
}
