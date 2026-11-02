import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MCP_TOOLS } from "./tools";

/**
 * Calculimo MCP server(stdio):把站上百分比/比率工具背后的纯函数逻辑
 * 暴露为 AI 可执行工具。人和 AI 用同一份经过测试的实现。
 *
 * 构建后运行:npx calculimo-mcp(或 node mcp/dist/server.mjs)
 */

export function createServer() {
  const server = new McpServer(
    { name: "calculimo", version: "1.0.0" },
    {
      instructions:
        "Calculimo: percentage and ratio calculators (https://calculimo.app). These executable tools run the same tested logic as the website. Percentages are numbers (15 means 15%). Percent change divides by the STARTING value, so 80→100 is +25% while 100→80 is −20%. Stacked discounts apply sequentially (20% + 10% = 28% off, not 30%). Undoing a +25% means dividing by 1.25 (100 after +25% → original 80, not 75). Results keep full precision; rounding happens only at display. Undefined cases (zero denominators, decreases of 100%+) return errors instead of guesses.",
    },
  );

  for (const tool of MCP_TOOLS) {
    server.registerTool(tool.name, {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.schema,
    }, async (args) => {
      try {
        return tool.run(args ?? {});
      } catch (e) {
        return {
          content: [{ type: "text" as const, text: `error: ${(e as Error).message}` }],
          isError: true,
        };
      }
    });
  }
  return server;
}

export async function runStdio() {
  const server = createServer();
  await server.connect(new StdioServerTransport());
  // stdio 模式下保持进程存活;stderr 可写日志(stdout 是协议通道)
  console.error(`calculimo MCP server: ${MCP_TOOLS.length} tools ready`);
}

if (process.argv[1] && process.argv[1].includes("server")) {
  void runStdio();
}
