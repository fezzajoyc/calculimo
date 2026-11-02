import { describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "@/mcp/server";

async function connect() {
  const server = createServer();
  const client = new Client({ name: "test", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

/**
 * 与 tests/percent.test.ts 同一套手算基准:
 * 15% of 80 = 12;80→100 = +25% 而 100→80 = −20%;+25% 后是 100,原值是 80(不是 75);
 * 100 叠加 [20,10] → 72、实际折扣 28%;85.50 @ 15% ÷ 3 人均舍入 = 每人 32.78;
 * 16:12 → 4:3;2:3 = ?:9 → 6;16:9 宽 1920 → 高 1080。
 */
describe("calculimo MCP server", () => {
  it("exposes exactly the five Calculimo tools", async () => {
    const client = await connect();
    const { tools } = await client.listTools();
    expect(tools.length).toBe(5);
    expect(new Set(tools.map((t) => t.name))).toEqual(
      new Set(["percentage_calc", "reverse_percentage", "stacked_discount", "tip_split", "ratio_calc"]),
    );
    // 每个工具都有 schema 与说明,AI 客户端靠它们路由
    for (const tool of tools) {
      expect(tool.description?.length ?? 0).toBeGreaterThan(20);
      expect(tool.inputSchema).toBeTruthy();
    }
    await client.close();
  });

  it("answers all five percentage modes with worked steps", async () => {
    const client = await connect();
    const of = await client.callTool({ name: "percentage_calc", arguments: { mode: "of", a: 15, b: 80 } });
    let parsed = JSON.parse((of.content as any)[0].text);
    expect(parsed.value).toBe(12);
    expect(parsed.steps.some((s: any) => s.math === "80 × 0.15 = 12")).toBe(true);

    const what = await client.callTool({ name: "percentage_calc", arguments: { mode: "is_what_percent_of", a: 12, b: 80 } });
    parsed = JSON.parse((what.content as any)[0].text);
    expect(parsed.value).toBe(15);

    const add = await client.callTool({ name: "percentage_calc", arguments: { mode: "add", a: 15, b: 80 } });
    parsed = JSON.parse((add.content as any)[0].text);
    expect(parsed.value).toBe(92);

    const sub = await client.callTool({ name: "percentage_calc", arguments: { mode: "subtract", a: 15, b: 80 } });
    parsed = JSON.parse((sub.content as any)[0].text);
    expect(parsed.value).toBe(68);
    await client.close();
  });

  it("keeps the percent-change asymmetry honest: 80→100 = +25%, 100→80 = −20%", async () => {
    const client = await connect();
    const up = await client.callTool({ name: "percentage_calc", arguments: { mode: "change", a: 80, b: 100 } });
    expect(JSON.parse((up.content as any)[0].text).value).toBe(25);
    const down = await client.callTool({ name: "percentage_calc", arguments: { mode: "change", a: 100, b: 80 } });
    expect(JSON.parse((down.content as any)[0].text).value).toBe(-20);
    await client.close();
  });

  it("recovers the original through the classic trap: 100 after +25% → 80, not 75", async () => {
    const client = await connect();
    const r = await client.callTool({
      name: "reverse_percentage",
      arguments: { mode: "original", final: 100, pct: 25, direction: "increase" },
    });
    const parsed = JSON.parse((r.content as any)[0].text);
    expect(parsed.value).toBe(80);
    expect(parsed.steps.some((s: any) => s.math === "100 ÷ 1.25 = 80")).toBe(true);

    // base 模式:12 是 80 的 15%
    const b = await client.callTool({ name: "reverse_percentage", arguments: { mode: "base", part: 12, pct: 15 } });
    expect(JSON.parse((b.content as any)[0].text).value).toBe(80);
    await client.close();
  });

  it("refuses undefined cases with honest errors (zero denominators, 100%+ decrease)", async () => {
    const client = await connect();
    const zeroWhole = await client.callTool({ name: "percentage_calc", arguments: { mode: "is_what_percent_of", a: 12, b: 0 } });
    expect((zeroWhole as any).isError).toBe(true);
    expect((zeroWhole.content as any)[0].text).toContain("denominator");

    const zeroFrom = await client.callTool({ name: "percentage_calc", arguments: { mode: "change", a: 0, b: 5 } });
    expect((zeroFrom as any).isError).toBe(true);

    const wiped = await client.callTool({
      name: "reverse_percentage",
      arguments: { mode: "original", final: 0, pct: 100, direction: "decrease" },
    });
    expect((wiped as any).isError).toBe(true);
    expect((wiped.content as any)[0].text).toContain("unrecoverable");
    await client.close();
  });

  it("stacks discounts sequentially: 100 with [20,10] → 72 final, 28% effective, not 30%", async () => {
    const client = await connect();
    const r = await client.callTool({ name: "stacked_discount", arguments: { price: 100, discounts: [20, 10] } });
    const parsed = JSON.parse((r.content as any)[0].text);
    expect(parsed.final).toBe(72);
    expect(parsed.effective_pct).toBeCloseTo(28, 6);
    expect(parsed.naive_sum_pct).toBe(30);
    expect(parsed.naive_final).toBe(70);
    expect(parsed.extra_cost_vs_naive).toBeCloseTo(2, 6);
    expect(parsed.after_each).toEqual([80, 72]);
    // 单层折扣:叠加与直加一致
    const single = await client.callTool({ name: "stacked_discount", arguments: { price: 50, discounts: [10] } });
    const p2 = JSON.parse((single.content as any)[0].text);
    expect(p2.final).toBe(45);
    expect(p2.effective_pct).toBe(10);
    await client.close();
  });

  it("splits a tip three ways with per-person rounding: 85.50 @ 15% → 32.78 each", async () => {
    const client = await connect();
    const r = await client.callTool({
      name: "tip_split",
      arguments: { bill: 85.5, tip_pct: 15, people: 3, rounding: "per_person" },
    });
    const parsed = JSON.parse((r.content as any)[0].text);
    expect(parsed.pay_per_person).toBe(32.78);
    expect(parsed.final_total).toBeCloseTo(98.34, 6);
    expect(parsed.final_tip).toBeCloseTo(12.84, 6);
    expect(parsed.exact_per_person).toBeCloseTo(32.775, 6);
    // total 模式:整单凑整到 98.33
    const t = await client.callTool({
      name: "tip_split",
      arguments: { bill: 85.5, tip_pct: 15, people: 3, rounding: "total" },
    });
    const p2 = JSON.parse((t.content as any)[0].text);
    expect(p2.final_total).toBe(98.33);
    // schema 层:人数为负被 zod 拒绝 → SDK 返回 isError 结果(不 throw)
    const schemaBad = await client.callTool({
      name: "tip_split",
      arguments: { bill: 85.5, tip_pct: 15, people: -3 },
    });
    expect((schemaBad as any).isError).toBe(true);
    expect((schemaBad.content as any)[0].text).toContain("-32602");
    await client.close();
  });

  it("handles all three ratio jobs: simplify 16:12 → 4:3, solve 2:3 = ?:9 → 6, aspect 16:9 w1920 → 1080", async () => {
    const client = await connect();
    const s = await client.callTool({ name: "ratio_calc", arguments: { mode: "simplify", a: 16, b: 12 } });
    let parsed = JSON.parse((s.content as any)[0].text);
    expect(parsed.ratio).toBe("4 : 3");
    expect(parsed.as_decimal).toBeCloseTo(4 / 3, 9);

    const p = await client.callTool({
      name: "ratio_calc", arguments: { mode: "proportion", a: 2, b: 3, d: 9, unknown: "c" },
    });
    parsed = JSON.parse((p.content as any)[0].text);
    expect(parsed.unknown).toBe("c");
    expect(parsed.value).toBe(6);
    expect(parsed.steps.some((st: any) => st.math === "? = 2 × 9 ÷ 3 = 6")).toBe(true);

    const asp = await client.callTool({
      name: "ratio_calc", arguments: { mode: "aspect", a: 16, b: 9, known: "w", value: 1920 },
    });
    parsed = JSON.parse((asp.content as any)[0].text);
    expect(parsed.value).toBe(1080);
    expect(parsed.aspect).toBe("16 : 9");

    // 1/3 : 2/3 这类除不尽的对被诚实拒绝
    const hard = await client.callTool({ name: "ratio_calc", arguments: { mode: "simplify", a: 1 / 3, b: 2 / 3 } });
    expect((hard as any).isError).toBe(true);
    await client.close();
  });
});
