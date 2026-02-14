import 'dotenv/config';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { ResourcesManager } from './ResourcesManager';
import { RulesManager } from './RulesManager';
import { RunnerFactory } from './runners/RunnerFactory';

async function start() {
  process.stderr.write(`
    _   ___ ___ ___ _____ ___ ___ 
   /_\\ | _ \\ _ )_ _|_   _| __| _ \\
  / _ \\|   / _ \\| |  | | | _||   /
 /_/ \\_\\_|_\\___/___| |_| |___|_|_\\
                                  
 >>> MCP Rules Engine Initializing <<<
  \n`);

  const server = new McpServer({
    name: 'Arbiter',
    version: '0.1.0',
  });

  const rulesManager = new RulesManager();
  const resources = await rulesManager.initialize();

  const resourcesManager = new ResourcesManager(resources);
  await resourcesManager.execute(server);

  const runner = await RunnerFactory.createRunner(server);
  await runner.run();
}

start();
