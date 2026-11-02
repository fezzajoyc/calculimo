import { z } from "zod";
import {
  aspectFromOne, baseOf, fmtNum, isWhatPctOf, pctAdd, pctChange, pctOf, pctSub,
  reversePct, simplifyRatio, solveProportion, stackDiscounts, stackDiscountSteps,
  tipSplit, tipSplitSteps,
  baseOfSteps, isWhatPctOfSteps, pctAddSubSteps, pctChangeSteps, pctOfSteps,
  reversePctSteps, simplifyRatioSteps, solveProportionSteps, aspectFromOneSteps,
} from "../tools/_lib/percent";

/**
 * Calculimo MCP 工具注册表:把 tools/_lib/percent.ts 的纯函数暴露为 AI 可执行工具。
 * 站上的同名工具在浏览器里跑(交互式),这里跑同一份经过测试的实现——
 * 人和 AI 用同一套逻辑,而不是两套各写各的。
 */

const json = (v: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(v, null, 2) }] });
const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const bad = (t: string) => ({ content: [{ type: "text" as const, text: t }], isError: true as const });

/** 非有限结果(如 1e308 × 1e308 溢出成 Infinity)不能进 JSON——JSON.stringify 会把它静默变成 null。 */
const finite = (n: number, what: string) => (Number.isFinite(n) ? null : bad(`${what} overflows 64-bit floats with these inputs`));

export type McpToolDef = {
  name: string;
  title: string;
  description: string;
  schema: Record<string, any>;
  run: (args: any) => { content: { type: "text"; text: string }[]; isError?: boolean };
};

export const MCP_TOOLS: McpToolDef[] = [
  {
    name: "percentage_calc",
    title: "Percentage calculator (5 modes)",
    description:
      "All everyday percentage questions in one tool. Modes: 'of' (X% of Y), 'is_what_percent_of' (X is what % of Y), 'change' (percent change from X to Y, divided by the STARTING value: 80→100 = +25% but 100→80 = −20%), 'add' (Y increased by X%), 'subtract' (Y decreased by X%). Returns the value, the formula and worked steps (locale-neutral math lines). Zero denominators return an error instead of a guess.",
    schema: {
      mode: z.enum(["of", "is_what_percent_of", "change", "add", "subtract"]).describe("which of the five percentage questions to answer"),
      a: z.number().describe("mode-dependent first number: of→the percent (15 means 15%); is_what_percent_of→the part; change→the starting value; add/subtract→the percent X"),
      b: z.number().describe("mode-dependent second number: of/is_what_percent_of→the whole Y; change→the ending value; add/subtract→the base value Y"),
    },
    run: (a) => {
      let value: number | null;
      let steps: { key: string; math: string }[];
      let what: string;
      switch (a.mode) {
        case "of":
          value = pctOf(a.a, a.b);
          steps = value === null ? [] : pctOfSteps(a.a, a.b);
          what = `${fmtNum(a.a)}% of ${fmtNum(a.b)}`;
          break;
        case "is_what_percent_of":
          value = isWhatPctOf(a.a, a.b);
          steps = value === null ? [] : isWhatPctOfSteps(a.a, a.b);
          what = `${fmtNum(a.a)} as % of ${fmtNum(a.b)}`;
          break;
        case "change":
          value = pctChange(a.a, a.b);
          steps = value === null ? [] : pctChangeSteps(a.a, a.b);
          what = `change from ${fmtNum(a.a)} to ${fmtNum(a.b)}`;
          break;
        case "add":
          value = pctAdd(a.b, a.a);
          steps = value === null ? [] : pctAddSubSteps(a.b, a.a, "add");
          what = `${fmtNum(a.b)} + ${fmtNum(a.a)}%`;
          break;
        case "subtract":
          value = pctSub(a.b, a.a);
          steps = value === null ? [] : pctAddSubSteps(a.b, a.a, "sub");
          what = `${fmtNum(a.b)} − ${fmtNum(a.a)}%`;
          break;
        default:
          return bad(`unknown mode: ${a.mode}`);
      }
      if (value === null) {
        return bad(`${what}: undefined — a denominator is zero here (percent change from 0, or 'is what percent of' a whole of 0 has no answer)`);
      }
      const overflow = finite(value, what);
      if (overflow) return overflow;
      return json({ mode: a.mode, what, value, steps });
    },
  },
  {
    name: "reverse_percentage",
    title: "Reverse percentage (find the original)",
    description:
      "Work backwards from a changed value. mode 'original': a value went up or down by X% and now reads final — recover the original by DIVIDING by the factor (after +25%, 100 → 100/1.25 = 80, NOT 75; undoing +25% is not applying −25%). mode 'base': part is X% of an unknown whole — recover the whole (12 is 15% of what → 80). A decrease of 100%+ is refused: the base is unrecoverable.",
    schema: {
      mode: z.enum(["original", "base"]).default("original"),
      final: z.number().optional().describe("original mode: the value AFTER the change"),
      pct: z.number().describe("the percentage (25 means 25%)"),
      direction: z.enum(["increase", "decrease"]).default("increase").describe("original mode: did the value increase or decrease"),
      part: z.number().optional().describe("base mode: the known part"),
    },
    run: (a) => {
      if (a.mode === "base") {
        if (a.part === undefined) return bad("base mode needs 'part' (the known part of the unknown whole)");
        const value = baseOf(a.part, a.pct);
        if (value === null) return bad("base is undefined: a percentage of 0 carries no information about the whole");
        const overflow = finite(value, "base");
        if (overflow) return overflow;
        return json({ mode: "base", value, steps: baseOfSteps(a.part, a.pct) });
      }
      if (a.final === undefined) return bad("original mode needs 'final' (the value after the change)");
      const value = reversePct(a.final, a.pct, a.direction);
      if (value === null) {
        return bad(`original is unrecoverable: a ${a.direction} of ${fmtNum(a.pct)}% zeroes or negates the base, so every original maps to the same result`);
      }
      const overflow = finite(value, "original");
      if (overflow) return overflow;
      return json({ mode: "original", direction: a.direction, value, steps: reversePctSteps(a.final, a.pct, a.direction) });
    },
  },
  {
    name: "stacked_discount",
    title: "Stacked discount",
    description:
      "Apply up to 5 discounts SEQUENTIALLY — 20% + 10% is 28% off, not 30%, because each percentage bites into what is left. Returns the price after each layer, the final price, the effective total discount, the naive sum for contrast and the money gap between them. Each discount is a percent; negative values act as surcharges.",
    schema: {
      price: z.number().min(0).describe("original price, ≥ 0"),
      discounts: z.array(z.number()).min(1).max(5).describe("discounts in application order, e.g. [20, 10] for 20% then 10%"),
    },
    run: (a) => {
      const r = stackDiscounts(a.price, a.discounts);
      if (!r) return bad("invalid input: price and every discount must be finite numbers, with at least one discount");
      const overflow = finite(r.final, "final price");
      if (overflow) return overflow;
      const steps = stackDiscountSteps(a.price, a.discounts) ?? [];
      // 展示口径清理到 1e-9:消掉 100×0.8 之类的二进制尾差,巨值不受影响
      const clean = (n: number) => Math.round(n * 1e9) / 1e9;
      return json({
        original: r.original,
        final: clean(r.final),
        effective_pct: Math.round(r.effectivePct * 1e6) / 1e6,
        naive_sum_pct: Math.round(r.naivePct * 1e6) / 1e6,
        saved: clean(r.saved),
        naive_final: clean(r.naiveFinal),
        extra_cost_vs_naive: clean(r.naiveDelta),
        after_each: r.steps.map((s) => clean(s.after)),
        steps,
      });
    },
  },
  {
    name: "tip_split",
    title: "Tip and bill splitter",
    description:
      "Split a bill with tip N ways. Returns tip, grand total, exact per-person share and the rounding outcome for the chosen convention: 'per_person' rounds each share to the cent (table may leave slightly more tip), 'total' rounds the grand total once, 'none' keeps full precision for cent-exact payment apps. Rounding is half-up at display time only.",
    schema: {
      bill: z.number().min(0).describe("bill amount before tip, ≥ 0"),
      tip_pct: z.number().min(0).default(15).describe("tip percentage (15 means 15%)"),
      people: z.number().int().min(1).max(10000).default(1).describe("number of shares to split between"),
      rounding: z.enum(["none", "per_person", "total"]).default("none").describe("where the cent rounding happens"),
    },
    run: (a) => {
      const rounding = a.rounding === "per_person" ? "per-person" : a.rounding === "total" ? "total" : "none";
      const r = tipSplit(a.bill, a.tip_pct, a.people, rounding);
      if (!r) return bad("invalid input: bill ≥ 0, tip_pct ≥ 0 and people an integer 1–10000 are required");
      const overflow = finite(r.finalTotal, "total");
      if (overflow) return overflow;
      const steps = tipSplitSteps(a.bill, a.tip_pct, a.people) ?? [];
      return json({
        bill: r.bill,
        tip: Math.round(r.tip * 1e6) / 1e6,
        total: Math.round(r.total * 1e6) / 1e6,
        exact_per_person: Math.round(r.exactPerPerson * 1e6) / 1e6,
        tip_per_person: Math.round(r.tipPerPerson * 1e6) / 1e6,
        rounding: a.rounding,
        pay_per_person: Math.round(r.payPerPerson * 1e6) / 1e6,
        final_total: Math.round(r.finalTotal * 1e6) / 1e6,
        final_tip: Math.round(r.finalTip * 1e6) / 1e6,
        steps,
      });
    },
  },
  {
    name: "ratio_calc",
    title: "Ratio calculator (simplify, proportion, aspect)",
    description:
      "Three ratio jobs. 'simplify': reduce A:B to smallest whole numbers via gcd (1920:1080 → 16:9); decimals that scale to integers are fine, non-terminating ones are refused honestly. 'proportion': solve A:B = C:D by cross-multiplication for the member marked unknown. 'aspect': given ratio w:h and one real dimension, find the other (16:9, width 1920 → height 1080).",
    schema: {
      mode: z.enum(["simplify", "proportion", "aspect"]),
      a: z.number().describe("simplify/proportion: side A; aspect: ratio width w"),
      b: z.number().describe("simplify/proportion: side B; aspect: ratio height h"),
      c: z.number().nullable().optional().describe("proportion only: side C, or omit/null when C is the unknown"),
      d: z.number().nullable().optional().describe("proportion only: side D, or omit/null when D is the unknown"),
      unknown: z.enum(["a", "b", "c", "d"]).default("c").describe("proportion only: which member is the unknown"),
      known: z.enum(["w", "h"]).default("w").describe("aspect only: which dimension 'value' refers to"),
      value: z.number().optional().describe("aspect only: the known real dimension"),
    },
    run: (a) => {
      if (a.mode === "simplify") {
        const r = simplifyRatio(a.a, a.b);
        if (!r) return bad("cannot simplify exactly: both sides zero, or the decimal expansion does not terminate within 9 places — round the inputs first");
        // r.b = 0(如 5:0)时除法溢出,显式置 null,避免 JSON.stringify 把 Infinity 静默变 null
        const dec = r.b === 0 ? null : Math.round((r.a / r.b) * 1e9) / 1e9;
        return json({ mode: "simplify", ratio: `${r.a} : ${r.b}`, as_decimal: dec, steps: simplifyRatioSteps(a.a, a.b) ?? [] });
      }
      if (a.mode === "proportion") {
        const u = a.unknown as "a" | "b" | "c" | "d";
        const vals = { a: a.a, b: a.b, c: a.c, d: a.d } as Record<string, number | null>;
        vals[u] = null;
        const value = solveProportion(vals.a, vals.b, vals.c, vals.d);
        if (value === null) {
          return bad("proportion is undefined: exactly one unknown is required, the three known members must be finite, and the denominator opposite the unknown must be non-zero");
        }
        const overflow = finite(value, "unknown");
        if (overflow) return overflow;
        return json({ mode: "proportion", unknown: u, value, steps: solveProportionSteps(vals.a, vals.b, vals.c, vals.d) ?? [] });
      }
      // aspect
      if (a.value === undefined) return bad("aspect mode needs 'value' (the known real dimension)");
      const known = a.known as "w" | "h";
      const other = aspectFromOne(a.a, a.b, known, a.value);
      if (other === null) return bad("aspect is undefined: the known ratio side is 0 or an input is not finite");
      const overflow = finite(other, "other side");
      if (overflow) return overflow;
      const aspect = simplifyRatio(a.a, a.b);
      return json({
        mode: "aspect",
        aspect: aspect ? `${aspect.a} : ${aspect.b}` : null,
        solved_side: known === "w" ? "h" : "w",
        value: other,
        steps: aspectFromOneSteps(a.a, a.b, known, a.value) ?? [],
      });
    },
  },
];
