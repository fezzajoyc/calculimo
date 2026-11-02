import { describe, expect, it } from "vitest";
import {
  aspectFromOne, aspectFromOneSteps, baseOf, baseOfSteps, fmtNum, gcdInt, isWhatPctOf,
  isWhatPctOfSteps, pctAdd, pctAddSubSteps, pctChange, pctChangeSteps, pctOf, pctOfSteps,
  pctSub, reversePct, reversePctSteps, roundHalfUp, simplifyRatio, simplifyRatioSteps,
  solveProportion, solveProportionSteps, stackDiscounts, stackDiscountSteps, tipSplit,
  tipSplitSteps,
} from "@/tools/_lib/percent";

/**
 * 手算基准(全部可用纸笔复核):
 * - 15% of 80 = 12;12 是 80 的 15%。
 * - 80→100 = +25%,100→80 = −20%(同一差值 20,对较小基数占比更大——不对称)。
 * - +25% 后是 100,原值 = 100 ÷ 1.25 = 80(经典陷阱:不是 75)。
 * - 100 叠加 [20,10]:80 → 72,实际 28%,直加错觉 30%,多付 2。
 * - 85.50 @ 15% ÷ 3:小费 12.825,总额 98.325,人均 32.775,人均舍入后 32.78、整单 98.34。
 * - 16:12 = 4:3(gcd 4);2:3 = ?:9 → 6;16:9 宽 1920 → 高 1080。
 */
describe("roundHalfUp: display-time rounding, half away from zero", () => {
  it("rounds exact halves up, away from zero", () => {
    expect(roundHalfUp(0.125, 2)).toBe(0.13); // 0.125 是精确二进制小数,半进位
    expect(roundHalfUp(2.5, 0)).toBe(3);
    expect(roundHalfUp(-2.5, 0)).toBe(-3);
    expect(roundHalfUp(-0.125, 2)).toBe(-0.13);
  });

  it("fixes binary tail noise: 32.775 → 32.78, 2.675 → 2.68", () => {
    expect(roundHalfUp(32.775, 2)).toBe(32.78);
    expect(roundHalfUp(2.675, 2)).toBe(2.68);
    expect(roundHalfUp(98.325, 2)).toBe(98.33);
  });

  it("does not invent precision for values that are genuinely below the half (1.005 is 1.00499… in float64)", () => {
    expect(roundHalfUp(1.005, 2)).toBe(1);
  });

  it("keeps non-finite values as-is (callers guard)", () => {
    expect(roundHalfUp(NaN, 2)).toBeNaN();
    expect(roundHalfUp(Infinity, 2)).toBe(Infinity);
  });
});

describe("fmtNum: locale-neutral numbers with tail noise stripped", () => {
  it("strips trailing zeros and float noise", () => {
    expect(fmtNum(12)).toBe("12");
    expect(fmtNum(28.000000000000004)).toBe("28");
    expect(fmtNum(0.1 + 0.2)).toBe("0.3");
    expect(fmtNum(100 * 1.15)).toBe("115");
    expect(fmtNum(12.5)).toBe("12.5");
  });

  it("normalizes -0 and renders huge/small values in scientific notation", () => {
    expect(fmtNum(-0)).toBe("0");
    expect(fmtNum(1.5e21)).toBe("1.5e+21");
    expect(fmtNum(NaN)).toBe("—");
    expect(fmtNum(Infinity)).toBe("—");
  });
});

describe("pctOf: X% of Y", () => {
  it("computes the canonical 15% of 80 = 12", () => {
    expect(pctOf(15, 80)).toBe(12);
  });

  it("handles zero on either side", () => {
    expect(pctOf(0, 80)).toBe(0);
    expect(pctOf(15, 0)).toBe(0);
  });

  it("computes negative wholes honestly", () => {
    expect(pctOf(15, -80)).toBe(-12);
    expect(pctOf(-15, 80)).toBe(-12);
  });

  it("refuses non-finite input, accepts huge finite input", () => {
    expect(pctOf(NaN, 80)).toBeNull();
    expect(pctOf(15, Infinity)).toBeNull();
    expect(pctOf(15, 1e21)).toBe(1.5e20);
  });
});

describe("isWhatPctOf: part ÷ whole × 100", () => {
  it("computes the canonical 12 is 15% of 80", () => {
    expect(isWhatPctOf(12, 80)).toBe(15);
  });

  it("gives 0 for a zero part and negatives for negative parts", () => {
    expect(isWhatPctOf(0, 80)).toBe(0);
    expect(isWhatPctOf(-12, 80)).toBe(-15);
  });

  it("refuses a zero or non-finite whole", () => {
    expect(isWhatPctOf(12, 0)).toBeNull();
    expect(isWhatPctOf(NaN, 80)).toBeNull();
    expect(isWhatPctOf(12, Infinity)).toBeNull();
  });
});

describe("pctChange: (to − from) ÷ from × 100 — the asymmetry is the point", () => {
  it("80 → 100 is +25%", () => {
    expect(pctChange(80, 100)).toBe(25);
  });

  it("100 → 80 is −20%: same gap of 20, different base — NOT −25%", () => {
    expect(pctChange(100, 80)).toBe(-20);
    expect(pctChange(100, 80)).not.toBe(-25);
  });

  it("no change gives 0", () => {
    expect(pctChange(5, 5)).toBe(0);
  });

  it("a zero starting value is undefined (no base to divide by)", () => {
    expect(pctChange(0, 5)).toBeNull();
    expect(pctChange(0, 0)).toBeNull();
  });

  it("negative bases follow the algebraic formula, documented", () => {
    // (−75 − (−50)) ÷ (−50) = −25 ÷ −50 = +0.5
    expect(pctChange(-50, -75)).toBe(50);
  });

  it("refuses non-finite input", () => {
    expect(pctChange(NaN, 5)).toBeNull();
    expect(pctChange(5, Infinity)).toBeNull();
  });
});

describe("pctAdd / pctSub: Y × (1 ± X ÷ 100)", () => {
  it("adds and subtracts the canonical 15% on 80", () => {
    expect(pctAdd(80, 15)).toBe(92);
    expect(pctSub(80, 15)).toBe(68);
  });

  it("a 0% change is the identity", () => {
    expect(pctAdd(80, 0)).toBe(80);
    expect(pctSub(80, 0)).toBe(80);
  });

  it("subtracting 100% gives zero, subtracting more goes negative — honest", () => {
    expect(pctSub(80, 100)).toBe(0);
    expect(pctSub(80, 200)).toBe(-80);
  });

  it("subtracting a negative is an increase", () => {
    expect(pctSub(80, -20)).toBe(96);
    expect(pctAdd(80, -20)).toBe(64);
  });

  it("refuses non-finite input", () => {
    expect(pctAdd(NaN, 10)).toBeNull();
    expect(pctSub(80, NaN)).toBeNull();
  });
});

describe("reversePct: final ÷ (1 ± pct ÷ 100) — the classic trap", () => {
  it("100 after +25% came from 80, NOT 75", () => {
    expect(reversePct(100, 25, "increase")).toBe(80);
    expect(reversePct(100, 25, "increase")).not.toBe(75);
  });

  it("100 after a 25% decrease came from 133.33… (asymmetry again)", () => {
    expect(reversePct(100, 25, "decrease")).toBeCloseTo(133.33333333333334, 12);
  });

  it("75 after a 25% decrease is exactly 100", () => {
    expect(reversePct(75, 25, "decrease")).toBe(100);
  });

  it("a zero final with a real factor maps to a zero original", () => {
    expect(reversePct(0, 25, "increase")).toBe(0);
  });

  it("refuses decreases of 100% or more — the base is wiped out", () => {
    expect(reversePct(100, 100, "decrease")).toBeNull();
    expect(reversePct(100, 150, "decrease")).toBeNull();
  });

  it("refuses non-finite input; negative increase rates still need a positive factor", () => {
    expect(reversePct(NaN, 25, "increase")).toBeNull();
    // increase by −100% = factor 0 → unrecoverable
    expect(reversePct(100, -100, "increase")).toBeNull();
    // increase by −20% is just a 20% decrease: 96 after −20% → 120
    expect(reversePct(96, -20, "increase")).toBe(120);
  });
});

describe("baseOf: part ÷ (pct ÷ 100)", () => {
  it("12 is 15% of 80", () => {
    expect(baseOf(12, 15)).toBe(80);
  });

  it("a zero part with a real percentage maps to a zero base", () => {
    expect(baseOf(0, 15)).toBe(0);
  });

  it("refuses a zero percentage — no information about the base", () => {
    expect(baseOf(12, 0)).toBeNull();
  });

  it("handles shares above 100% and negatives honestly", () => {
    expect(baseOf(50, 200)).toBe(25);
    expect(baseOf(-12, 15)).toBe(-80);
  });
});

describe("stackDiscounts: sequential application, 20% + 10% ≠ 30%", () => {
  it("100 with [20,10] → 80 then 72; effective 28%, not 30%", () => {
    const r = stackDiscounts(100, [20, 10])!;
    expect(r).not.toBeNull();
    expect(r.final).toBe(72);
    expect(r.steps).toEqual([
      { pct: 20, after: 80 },
      { pct: 10, after: 72 },
    ]);
    expect(r.effectivePct).toBeCloseTo(28, 9);
    expect(r.naivePct).toBe(30);
    expect(r.saved).toBe(28);
  });

  it("the naive illusion promises 70 on 100 — stacking costs 2 more than the sum", () => {
    const r = stackDiscounts(100, [20, 10])!;
    expect(r.naiveFinal).toBe(70);
    expect(r.naiveDelta).toBeCloseTo(2, 9);
  });

  it("three layers: [20,10,5] on 100 → 68.4, effective 31.6 vs naive 35", () => {
    const r = stackDiscounts(100, [20, 10, 5])!;
    expect(r.final).toBeCloseTo(68.4, 9);
    expect(r.effectivePct).toBeCloseTo(31.6, 9);
    expect(r.naivePct).toBe(35);
  });

  it("a single discount equals its own sum: [10] on 50 → 45, delta 0", () => {
    const r = stackDiscounts(50, [10])!;
    expect(r.final).toBe(45);
    expect(r.effectivePct).toBe(10);
    expect(r.naivePct).toBe(10);
    expect(r.naiveDelta).toBe(0);
  });

  it("works on any base: [20,10] on 80 → 64 then 57.6", () => {
    const r = stackDiscounts(80, [20, 10])!;
    expect(r.steps[0].after).toBeCloseTo(64, 9);
    expect(r.final).toBeCloseTo(57.6, 9);
  });

  it("a zero price stays zero throughout", () => {
    const r = stackDiscounts(0, [20, 10])!;
    expect(r.final).toBe(0);
    expect(r.effectivePct).toBe(0);
  });

  it("a single discount over 100% flips the price negative — honest, not clamped", () => {
    const r = stackDiscounts(100, [120])!;
    expect(r.final).toBeCloseTo(-20, 9);
    expect(r.effectivePct).toBeCloseTo(120, 9);
  });

  it("refuses empty, non-finite or non-finite-member inputs", () => {
    expect(stackDiscounts(100, [])).toBeNull();
    expect(stackDiscounts(NaN, [10])).toBeNull();
    expect(stackDiscounts(100, [NaN])).toBeNull();
    expect(stackDiscounts(100, [20, NaN])).toBeNull();
  });
});

describe("tipSplit: 85.50 @ 15% ÷ 3 and the rounding conventions", () => {
  const bill = 85.5, pct = 15, people = 3;

  it("nominal values before any rounding: tip 12.825, total 98.325, per person 32.775", () => {
    const r = tipSplit(bill, pct, people, "none")!;
    expect(r.tip).toBeCloseTo(12.825, 9);
    expect(r.total).toBeCloseTo(98.325, 9);
    expect(r.exactPerPerson).toBeCloseTo(32.775, 9);
    expect(r.tipPerPerson).toBeCloseTo(4.275, 9);
  });

  it("per-person rounding: each pays 32.78, table total 98.34, effective tip 12.84", () => {
    const r = tipSplit(bill, pct, people, "per-person")!;
    expect(r.payPerPerson).toBe(32.78);
    expect(r.finalTotal).toBeCloseTo(98.34, 9);
    expect(r.finalTip).toBeCloseTo(12.84, 9);
  });

  it("whole-bill rounding: grand total 98.33 once, shares may keep decimals", () => {
    const r = tipSplit(bill, pct, people, "total")!;
    expect(r.finalTotal).toBe(98.33);
    expect(r.payPerPerson).toBeCloseTo(98.33 / 3, 9);
    expect(r.finalTip).toBeCloseTo(12.83, 9);
  });

  it("no rounding leaves exact decimals for cent-exact payment apps", () => {
    const r = tipSplit(bill, pct, people, "none")!;
    expect(r.payPerPerson).toBeCloseTo(32.775, 9);
    expect(r.finalTip).toBeCloseTo(12.825, 9);
  });

  it("a single person pays bill + tip", () => {
    const r = tipSplit(50, 20, 1, "none")!;
    expect(r.tip).toBe(10);
    expect(r.payPerPerson).toBe(60);
  });

  it("a zero bill and a zero tip are valid edge cases", () => {
    const z = tipSplit(0, 15, 3, "per-person")!;
    expect(z.payPerPerson).toBe(0);
    expect(z.finalTip).toBe(0);
    const nt = tipSplit(60, 0, 4, "total")!;
    expect(nt.tip).toBe(0);
    expect(nt.finalTotal).toBe(60);
  });

  it("refuses negative bills/tips and non-integer or out-of-range people", () => {
    expect(tipSplit(-1, 15, 3, "none")).toBeNull();
    expect(tipSplit(85.5, -5, 3, "none")).toBeNull();
    expect(tipSplit(85.5, 15, 0, "none")).toBeNull();
    expect(tipSplit(85.5, 15, 2.5, "none")).toBeNull();
    expect(tipSplit(85.5, 15, NaN, "none")).toBeNull();
    expect(tipSplit(85.5, 15, 10001, "none")).toBeNull();
  });
});

describe("gcdInt", () => {
  it("classic gcds including gcd(x, 0)", () => {
    expect(gcdInt(16, 12)).toBe(4);
    expect(gcdInt(1920, 1080)).toBe(120);
    expect(gcdInt(7, 13)).toBe(1);
    expect(gcdInt(0, 5)).toBe(5);
    expect(gcdInt(5, 0)).toBe(5);
  });
});

describe("simplifyRatio: exact integer reduction via gcd", () => {
  it("16:12 → 4:3 and 1920:1080 → 16:9", () => {
    expect(simplifyRatio(16, 12)).toEqual({ a: 4, b: 3 });
    expect(simplifyRatio(1920, 1080)).toEqual({ a: 16, b: 9 });
  });

  it("coprime pairs stay put; 100:25 → 4:1", () => {
    expect(simplifyRatio(7, 13)).toEqual({ a: 7, b: 13 });
    expect(simplifyRatio(100, 25)).toEqual({ a: 4, b: 1 });
  });

  it("decimal pairs scale to exact integers first: 2.5:5 → 1:2, 0.333333:0.666666 → 1:2", () => {
    expect(simplifyRatio(2.5, 5)).toEqual({ a: 1, b: 2 });
    expect(simplifyRatio(0.333333, 0.666666)).toEqual({ a: 1, b: 2 });
    expect(simplifyRatio(1.25, 3.75)).toEqual({ a: 1, b: 3 });
  });

  it("signs survive: −16:12 → −4:3", () => {
    expect(simplifyRatio(-16, 12)).toEqual({ a: -4, b: 3 });
  });

  it("zero on one side normalizes, both sides zero is refused", () => {
    expect(simplifyRatio(0, 5)).toEqual({ a: 0, b: 1 });
    expect(simplifyRatio(5, 0)).toEqual({ a: 1, b: 0 });
    expect(simplifyRatio(0, 0)).toBeNull();
  });

  it("non-terminating decimals are refused honestly (1/3 : 2/3)", () => {
    expect(simplifyRatio(1 / 3, 2 / 3)).toBeNull();
    expect(simplifyRatio(NaN, 2)).toBeNull();
    expect(simplifyRatio(1, Infinity)).toBeNull();
  });
});

describe("solveProportion: cross-multiplication a×d = b×c", () => {
  it("2:3 = x:9 → 6", () => {
    expect(solveProportion(2, 3, null, 9)).toBe(6);
  });

  it("solves whichever member is null", () => {
    expect(solveProportion(null, 3, 6, 9)).toBe(2);
    expect(solveProportion(2, null, 6, 9)).toBe(3);
    expect(solveProportion(2, 3, 6, null)).toBe(9);
  });

  it("refuses zero or two unknowns", () => {
    expect(solveProportion(2, 3, 6, 9)).toBeNull();
    expect(solveProportion(null, 3, null, 9)).toBeNull();
  });

  it("refuses a zero denominator opposite the unknown", () => {
    // c unknown with b = 0: c = a×d ÷ 0
    expect(solveProportion(2, 0, null, 9)).toBeNull();
    // d unknown with a = 0
    expect(solveProportion(0, 3, 6, null)).toBeNull();
  });

  it("zero numerators are fine", () => {
    expect(solveProportion(0, 3, null, 9)).toBe(0);
    expect(solveProportion(2, 3, null, 0)).toBe(0);
  });

  it("refuses non-finite knowns", () => {
    expect(solveProportion(NaN, 3, null, 9)).toBeNull();
    expect(solveProportion(2, 3, null, Infinity)).toBeNull();
  });
});

describe("aspectFromOne: w:h with one real dimension", () => {
  it("16:9 with width 1920 → height 1080", () => {
    expect(aspectFromOne(16, 9, "w", 1920)).toBe(1080);
  });

  it("16:9 with height 1080 → width 1920", () => {
    expect(aspectFromOne(16, 9, "h", 1080)).toBe(1920);
  });

  it("4:3 with width 800 → height 600", () => {
    expect(aspectFromOne(4, 3, "w", 800)).toBe(600);
  });

  it("refuses a zero ratio side or non-finite input", () => {
    expect(aspectFromOne(16, 0, "h", 100)).toBeNull();
    expect(aspectFromOne(0, 9, "w", 100)).toBeNull();
    expect(aspectFromOne(16, 9, "w", NaN)).toBeNull();
  });
});

describe("worked steps: every line is a true equation", () => {
  it("pctOfSteps(15, 80)", () => {
    expect(pctOfSteps(15, 80)).toEqual([
      { key: "decimal", math: "15 ÷ 100 = 0.15" },
      { key: "apply", math: "80 × 0.15 = 12" },
    ]);
  });

  it("isWhatPctOfSteps(12, 80)", () => {
    expect(isWhatPctOfSteps(12, 80)).toEqual([
      { key: "quotient", math: "12 ÷ 80 = 0.15" },
      { key: "percentify", math: "0.15 × 100 = 15%" },
    ]);
  });

  it("pctChangeSteps(80, 100) shows the +25% chain", () => {
    expect(pctChangeSteps(80, 100)).toEqual([
      { key: "diff", math: "100 - 80 = 20" },
      { key: "ratio", math: "20 ÷ 80 = 0.25" },
      { key: "percentify", math: "0.25 × 100 = 25%" },
    ]);
  });

  it("pctChangeSteps(100, 80) shows the −20% chain", () => {
    expect(pctChangeSteps(100, 80)).toEqual([
      { key: "diff", math: "80 - 100 = -20" },
      { key: "ratio", math: "-20 ÷ 100 = -0.2" },
      { key: "percentify", math: "-0.2 × 100 = -20%" },
    ]);
  });

  it("pctAddSubSteps for add and subtract", () => {
    expect(pctAddSubSteps(80, 15, "add")).toEqual([
      { key: "factor", math: "1 + 15 ÷ 100 = 1.15" },
      { key: "apply", math: "80 × 1.15 = 92" },
    ]);
    expect(pctAddSubSteps(80, 15, "sub")).toEqual([
      { key: "factor", math: "1 - 15 ÷ 100 = 0.85" },
      { key: "apply", math: "80 × 0.85 = 68" },
    ]);
  });

  it("reversePctSteps(100, 25, increase) is the trap-buster", () => {
    expect(reversePctSteps(100, 25, "increase")).toEqual([
      { key: "factor", math: "1 + 25 ÷ 100 = 1.25" },
      { key: "restore", math: "100 ÷ 1.25 = 80" },
    ]);
  });

  it("baseOfSteps(12, 15)", () => {
    expect(baseOfSteps(12, 15)).toEqual([
      { key: "decimal", math: "15 ÷ 100 = 0.15" },
      { key: "restore", math: "12 ÷ 0.15 = 80" },
    ]);
  });

  it("stackDiscountSteps(100, [20,10]) walks the layers and exposes the naive sum", () => {
    expect(stackDiscountSteps(100, [20, 10])).toEqual([
      { key: "stack", math: "100 × (1 - 20 ÷ 100) = 80" },
      { key: "stack", math: "80 × (1 - 10 ÷ 100) = 72" },
      { key: "effective", math: "(100 - 72) ÷ 100 = 0.28" },
      { key: "percentify", math: "0.28 × 100 = 28%" },
      { key: "naiveSum", math: "20 + 10 = 30%" },
    ]);
  });

  it("tipSplitSteps(85.5, 15, 3)", () => {
    expect(tipSplitSteps(85.5, 15, 3)).toEqual([
      { key: "tipAmount", math: "85.5 × 15 ÷ 100 = 12.825" },
      { key: "grand", math: "85.5 + 12.825 = 98.325" },
      { key: "perHead", math: "98.325 ÷ 3 = 32.775" },
    ]);
  });

  it("simplifyRatioSteps(16, 12)", () => {
    expect(simplifyRatioSteps(16, 12)).toEqual([
      { key: "gcd", math: "gcd(16, 12) = 4" },
      { key: "divide", math: "16 ÷ 4 : 12 ÷ 4 = 4 : 3" },
    ]);
  });

  it("solveProportionSteps(2, 3, null, 9) marks the unknown as ?", () => {
    expect(solveProportionSteps(2, 3, null, 9)).toEqual([
      { key: "cross", math: "2 × 9 = 3 × ?" },
      { key: "solve", math: "? = 2 × 9 ÷ 3 = 6" },
    ]);
  });

  it("aspectFromOneSteps(16, 9, w, 1920)", () => {
    expect(aspectFromOneSteps(16, 9, "w", 1920)).toEqual([
      { key: "aspect", math: "1920 × 9 ÷ 16 = 1080" },
    ]);
  });

  it("step builders refuse invalid input the same way the core does", () => {
    expect(stackDiscountSteps(100, [])).toBeNull();
    expect(tipSplitSteps(85.5, 15, 0)).toBeNull();
    expect(simplifyRatioSteps(0, 0)).toBeNull();
    expect(solveProportionSteps(2, 3, 6, 9)).toBeNull();
    expect(aspectFromOneSteps(0, 9, "w", 100)).toBeNull();
  });
});
