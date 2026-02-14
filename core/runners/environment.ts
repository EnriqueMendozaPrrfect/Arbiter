export function getConfiguration(): {
  port: number;
  authToken: string;
} {
  if (!process.env.PORT) throw new Error('PORT environment variable is required');
  if (!process.env.MCP_TOKEN) throw new Error('MCP_TOKEN environment variable is required');

  return {
    port: Number(process.env.PORT),
    authToken: process.env.MCP_TOKEN,
  };
}
