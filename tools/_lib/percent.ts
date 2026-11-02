/**
 * Calculimo 百分比与比率纯逻辑核心(浏览器引擎与 MCP server 共用,Node 可测,无 DOM)。
 *
 * 设计约定(全站标准,见 site-engineering skill §1/§2):
 * - 全精度只在数学层保留;任何舍入都发生在展示层(roundHalfUp / fmtNum),半进位、远离零。
 * - 非法输入 → 返回 null(文档化行为,绝不抛异常):非有限数、除零、空数组、
 *   不可逆的还原(降幅 ≥ 100%)等。调用方负责把 null 呈现为诚实提示。
 * - steps 构造器输出"纯数学行"(数字 + 中缀运算符 + %,locale 无关),
 *   每行带稳定 key;引擎(或 MCP 调用方)按语言给每行配标签。数字一律经 fmtNum,
 *   已消除浮点尾差(28.000000000000004 → "28"),每行都是真实成立的等式。
 * - 百分比变化用带符号的原值作分母((to − from) ÷ from):负基准时的符号是代数一致的,
 *   已在文案中披露;from = 0 → null(0 → 任意非零值的百分比变化无定义)。
 */

// ────────────────────────────── 展示层格式化 ──────────────────────────────

/**
 * 展示层舍入:保留 dp 位小数,半进位且远离零(0.5 永远进位)。
 * 加 Number.EPSILON 修正二进制尾差(32.775 → 32.78 而不是 32.77)。
 * 1.005 这类在 float64 里本就略小于真值的数(1.00499…)会得到 1.01 之下的诚实结果——
 * 这是浮点表示的固有属性,不做字符串补偿。
 */
export function roundHalfUp(n: number, dp = 2): number {
  if (!Number.isFinite(n)) return n;
  const f = 10 ** dp;
  const scaled = n * f;
  const r = Math.sign(scaled) * Math.round(Math.abs(scaled) + Number.EPSILON);
  return r / f;
}

/** 步骤/结果数字格式:全精度值 → 最多 maxDp 位小数,去尾零;−0 归一;极大极小走科学计数。 */
export function fmtNum(n: number, maxDp = 10): string {
  if (!Number.isFinite(n)) return "—";
  const r = roundHalfUp(n, maxDp);
  let s = String(r);
  if (s.includes("e") || s.includes("E")) return s;
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return s === "-0" ? "0" : s;
}

// ────────────────────────────── 步骤(worked steps) ──────────────────────────────

/** 每行步骤的稳定 key;引擎按 key 配 localized 标签,math 行本身 locale 无关。 */
export type StepKey =
  | "decimal" // X% ÷ 100
  | "apply" // 主式代入:whole × decimal
  | "quotient" // part ÷ whole
  | "percentify" // × 100 → %
  | "diff" // to − from
  | "ratio" // diff ÷ base
  | "factor" // 1 ± pct ÷ 100
  | "restore" // 还原:final ÷ factor / part ÷ decimal
  | "stack" // price × (1 − d ÷ 100)
  | "effective" // (orig − final) ÷ orig
  | "naiveSum" // d1 + d2 + …(直加错觉)
  | "tipAmount" // bill × pct ÷ 100
  | "grand" // bill + tip
  | "perHead" // total ÷ people
  | "gcd" // gcd(a, b)
  | "divide" // 两边同除 gcd
  | "cross" // 交叉相乘
  | "solve" // 解出 ?
  | "aspect"; // value × h ÷ w

export type Step = { key: StepKey; math: string };

// ────────────────────────────── 基础五式 ──────────────────────────────

/** X% of Y = Y × X ÷ 100。非法输入 → null。 */
export function pctOf(x: number, y: number): number | null {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return (y * x) / 100;
}

/** X is what % of Y = X ÷ Y × 100。Y = 0 或非法 → null。 */
export function isWhatPctOf(part: number, whole: number): number | null {
  if (!Number.isFinite(part) || !Number.isFinite(whole) || whole === 0) return null;
  return (part / whole) * 100;
}

/**
 * 从 from 到 to 的百分比变化 = (to − from) ÷ from × 100。
 * 标准定义,分母带符号:80→100 = +25,100→80 = −20(同一 20 的差,幅度不对称)。
 * from = 0 → null(分母为零,百分比变化无定义);负基准按代数式照算,符号已在文档披露。
 */
export function pctChange(from: number, to: number): number | null {
  if (!Number.isFinite(from) || !Number.isFinite(to) || from === 0) return null;
  return ((to - from) / from) * 100;
}

/** Y 加上 X%:Y × (1 + X ÷ 100)。 */
export function pctAdd(y: number, x: number): number | null {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return y * (1 + x / 100);
}

/** Y 减去 X%:Y × (1 − X ÷ 100)。X > 100 时结果为负——诚实呈现,不拦。 */
export function pctSub(y: number, x: number): number | null {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return y * (1 - x / 100);
}

// ────────────────────────────── 逆向还原 ──────────────────────────────

export type ReverseDir = "increase" | "decrease";

/**
 * 已知变化后的值 final 与变化率 pct,求原值:orig = final ÷ (1 ± pct ÷ 100)。
 * 经典陷阱:+25% 后是 100,原值是 80(100 ÷ 1.25),不是 75——减 25% 不回头。
 * 降幅 ≥ 100% 时因子 ≤ 0,原值信息已被抹掉 → null(诚实:数学上不可逆)。
 * pct 为负(如 increase −20)= 反向变化,因子仍须 > 0,照算不拦。
 */
export function reversePct(final: number, pct: number, dir: ReverseDir): number | null {
  if (!Number.isFinite(final) || !Number.isFinite(pct)) return null;
  const factor = dir === "increase" ? 1 + pct / 100 : 1 - pct / 100;
  if (factor <= 0) return null;
  return final / factor;
}

/** X 是 Y% 的多少(求基数):base = part ÷ (Y ÷ 100)。Y = 0 → null。 */
export function baseOf(part: number, pct: number): number | null {
  if (!Number.isFinite(part) || !Number.isFinite(pct) || pct === 0) return null;
  return part / (pct / 100);
}

// ────────────────────────────── 折扣叠加 ──────────────────────────────

export type StackDiscountResult = {
  original: number;
  /** 逐层折后价,与 pcts 一一对应 */
  steps: { pct: number; after: number }[];
  /** 最终价(全精度) */
  final: number;
  /** 共省下:original − final */
  saved: number;
  /** 实际总折扣 % = saved ÷ original × 100 */
  effectivePct: number;
  /** 直加错觉:各折扣率简单相加 */
  naivePct: number;
  /** 按 naivePct 直加的错觉价 = original × (1 − naivePct ÷ 100),可能为负(>100% 时),诚实呈现 */
  naiveFinal: number;
  /** final − naiveFinal:正 = 叠加比直加少省的金额 */
  naiveDelta: number;
};

/**
 * 叠加折扣:20% 再 10% ≠ 30%,是 1 − 0.8 × 0.9 = 28%。
 * price 与每个折扣须为有限数;pcts 不得为空;否则 null。
 * 折扣为正 = 减;为负 = 加价(数学一致);单层折扣时 effective = naive(delta = 0)。
 */
export function stackDiscounts(price: number, pcts: number[]): StackDiscountResult | null {
  if (!Number.isFinite(price) || !Array.isArray(pcts) || pcts.length === 0) return null;
  if (!pcts.every((p) => Number.isFinite(p))) return null;

  const steps: { pct: number; after: number }[] = [];
  let cur = price;
  let naivePct = 0;
  for (const pct of pcts) {
    cur = cur * (1 - pct / 100);
    naivePct += pct;
    steps.push({ pct, after: cur });
  }
  const saved = price - cur;
  const effectivePct = price === 0 ? 0 : (saved / price) * 100;
  const naiveFinal = price * (1 - naivePct / 100);
  return {
    original: price,
    steps,
    final: cur,
    saved,
    effectivePct,
    naivePct,
    naiveFinal,
    naiveDelta: cur - naiveFinal,
  };
}

// ────────────────────────────── 小费分摊 ──────────────────────────────

export type TipRounding = "none" | "per-person" | "total";

export type TipSplitResult = {
  bill: number;
  /** 名义小费 = bill × pct ÷ 100(未舍入) */
  tip: number;
  /** 名义总额 = bill + tip(未舍入) */
  total: number;
  /** 名义人均(未舍入) */
  exactPerPerson: number;
  /** 名义人均小费(未舍入) */
  tipPerPerson: number;
  rounding: TipRounding;
  /** 按舍入口径每人实付 */
  payPerPerson: number;
  /** 按口径实付总额 */
  finalTotal: number;
  /** 按口径实际小费(可能与名义小费差几分的舍入差) */
  finalTip: number;
};

/**
 * 小费分摊。bill ≥ 0、tipPct ≥ 0、people 为 1–10000 的整数;否则 null。
 * 舍入口径(半进位到分,只在展示口径上舍):
 * - "none":全按未舍入值。
 * - "per-person":每人付 roundHalfUp(人均, 2),总额 = 人均 × 人数,小费 = 总额 − 账单。
 * - "total":整单 roundHalfUp(总额, 2),人均 = 整单 ÷ 人数(可能仍带小数)。
 */
export function tipSplit(
  bill: number,
  tipPct: number,
  people: number,
  rounding: TipRounding,
): TipSplitResult | null {
  if (!Number.isFinite(bill) || bill < 0) return null;
  if (!Number.isFinite(tipPct) || tipPct < 0) return null;
  if (!Number.isInteger(people) || people < 1 || people > 10000) return null;

  const tip = (bill * tipPct) / 100;
  const total = bill + tip;
  const exactPerPerson = total / people;
  const tipPerPerson = tip / people;

  if (rounding === "per-person") {
    const pay = roundHalfUp(exactPerPerson, 2);
    const finalTotal = pay * people;
    return { bill, tip, total, exactPerPerson, tipPerPerson, rounding, payPerPerson: pay, finalTotal, finalTip: finalTotal - bill };
  }
  if (rounding === "total") {
    const finalTotal = roundHalfUp(total, 2);
    return { bill, tip, total, exactPerPerson, tipPerPerson, rounding, payPerPerson: finalTotal / people, finalTotal, finalTip: finalTotal - bill };
  }
  return { bill, tip, total, exactPerPerson, tipPerPerson, rounding, payPerPerson: exactPerPerson, finalTotal: total, finalTip: tip };
}

// ────────────────────────────── 比率 ──────────────────────────────

/** 非负整数最大公约数,gcd(0, n) = n。输入先取绝对值、取整。 */
export function gcdInt(a: number, b: number): number {
  let x = Math.floor(Math.abs(a));
  let y = Math.floor(Math.abs(b));
  while (y) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

/**
 * 化简 A:B → 最简整数比。两值先乘 10^k(k = 0…9)化成整数(须精确回代,容差 1e-12 相对),
 * 再同除 gcd。十进制在 9 位内除不尽(如 1/3 本身)→ null(诚实:没有精确整数比)。
 * 两边同为 0 → null;一边为 0 → 另一边归一(0:5 → 0:1,5:0 → 1:0)。
 */
export function simplifyRatio(a: number, b: number): { a: number; b: number } | null {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  if (a === 0 && b === 0) return null;
  for (let k = 0; k <= 9; k++) {
    const f = 10 ** k;
    const ra = a * f;
    const rb = b * f;
    const ia = Math.round(ra);
    const ib = Math.round(rb);
    if (Math.abs(ia) > Number.MAX_SAFE_INTEGER || Math.abs(ib) > Number.MAX_SAFE_INTEGER) return null;
    // 精确回代校验:四舍五入后的整数除回去,必须还原出原值(相对容差 1e-12)
    const tolA = 1e-12 * Math.max(1, Math.abs(a));
    const tolB = 1e-12 * Math.max(1, Math.abs(b));
    if (Math.abs(ia / f - a) > tolA || Math.abs(ib / f - b) > tolB) continue;
    const g = gcdInt(ia, ib);
    if (g === 0) return null;
    return { a: ia / g, b: ib / g };
  }
  return null;
}

/**
 * 解比例 A:B = C:D(交叉相乘 a×d = b×c)。恰好一个参数传 null(未知数),其余须为有限数。
 * 解出的分母为 0(如 b = 0 时求 c)→ null;结果非有限 → null。
 */
export function solveProportion(
  a: number | null,
  b: number | null,
  c: number | null,
  d: number | null,
): number | null {
  const vals = [a, b, c, d];
  const unknowns = vals.filter((v) => v === null).length;
  if (unknowns !== 1) return null;
  const ok = (v: number | null): v is number => v !== null && Number.isFinite(v);
  if (!vals.every((v) => v === null || ok(v))) return null;

  if (a === null) {
    if (!ok(b) || !ok(c) || !ok(d) || d === 0) return null;
    return (b * c) / d;
  }
  if (b === null) {
    if (!ok(a) || !ok(c) || !ok(d) || c === 0) return null;
    return (a * d) / c;
  }
  if (c === null) {
    if (!ok(a) || !ok(b) || !ok(d) || b === 0) return null;
    return (a * d) / b;
  }
  // d 未知
  if (!ok(a) || !ok(b) || !ok(c) || a === 0) return null;
  return (b * c) / a;
}

/**
 * 纵横比模式:已知比率 w:h 与其中一边,推另一边。
 * known = "w" → other = value × h ÷ w(w ≠ 0);known = "h" → other = value × w ÷ h。
 */
export function aspectFromOne(
  w: number,
  h: number,
  known: "w" | "h",
  value: number,
): number | null {
  if (!Number.isFinite(w) || !Number.isFinite(h) || !Number.isFinite(value)) return null;
  if (known === "w") return w === 0 ? null : (value * h) / w;
  return h === 0 ? null : (value * w) / h;
}

// ────────────────────────────── steps 构造器 ──────────────────────────────
// 每行都是真实成立的等式(数字已代入,浮点尾差经 fmtNum 消除)。
// 引擎保证只在核心函数返回非 null 时调用,这里用 ! 断言是契约的一部分。

/** X% of Y 的两行:化小数、代入。 */
export function pctOfSteps(x: number, y: number): Step[] {
  const d = x / 100;
  return [
    { key: "decimal", math: `${fmtNum(x)} ÷ 100 = ${fmtNum(d)}` },
    { key: "apply", math: `${fmtNum(y)} × ${fmtNum(d)} = ${fmtNum(pctOf(x, y)!)}` },
  ];
}

/** X is what % of Y:先商,再百分化。 */
export function isWhatPctOfSteps(part: number, whole: number): Step[] {
  const q = part / whole;
  return [
    { key: "quotient", math: `${fmtNum(part)} ÷ ${fmtNum(whole)} = ${fmtNum(q)}` },
    { key: "percentify", math: `${fmtNum(q)} × 100 = ${fmtNum(isWhatPctOf(part, whole)!)}%` },
  ];
}

/** 百分比变化三行:差、除以基准、百分化。 */
export function pctChangeSteps(from: number, to: number): Step[] {
  const diff = to - from;
  const r = diff / from;
  return [
    { key: "diff", math: `${fmtNum(to)} - ${fmtNum(from)} = ${fmtNum(diff)}` },
    { key: "ratio", math: `${fmtNum(diff)} ÷ ${fmtNum(from)} = ${fmtNum(r)}` },
    { key: "percentify", math: `${fmtNum(r)} × 100 = ${fmtNum(pctChange(from, to)!)}%` },
  ];
}

/** 加/减 X%:系数行 + 代入行。 */
export function pctAddSubSteps(y: number, x: number, op: "add" | "sub"): Step[] {
  const factor = op === "add" ? 1 + x / 100 : 1 - x / 100;
  const sign = op === "add" ? "+" : "-";
  const r = op === "add" ? pctAdd(y, x)! : pctSub(y, x)!;
  return [
    { key: "factor", math: `1 ${sign} ${fmtNum(x)} ÷ 100 = ${fmtNum(factor)}` },
    { key: "apply", math: `${fmtNum(y)} × ${fmtNum(factor)} = ${fmtNum(r)}` },
  ];
}

/** 逆向还原:系数行 + 还原行。 */
export function reversePctSteps(final: number, pct: number, dir: ReverseDir): Step[] {
  const factor = dir === "increase" ? 1 + pct / 100 : 1 - pct / 100;
  const sign = dir === "increase" ? "+" : "-";
  return [
    { key: "factor", math: `1 ${sign} ${fmtNum(pct)} ÷ 100 = ${fmtNum(factor)}` },
    { key: "restore", math: `${fmtNum(final)} ÷ ${fmtNum(factor)} = ${fmtNum(reversePct(final, pct, dir)!)}` },
  ];
}

/** 求基数:化小数 + 还原。 */
export function baseOfSteps(part: number, pct: number): Step[] {
  const d = pct / 100;
  return [
    { key: "decimal", math: `${fmtNum(pct)} ÷ 100 = ${fmtNum(d)}` },
    { key: "restore", math: `${fmtNum(part)} ÷ ${fmtNum(d)} = ${fmtNum(baseOf(part, pct)!)}` },
  ];
}

/** 叠加折扣:逐层折后、实际总折扣、直加错觉。非法输入 → null。 */
export function stackDiscountSteps(price: number, pcts: number[]): Step[] | null {
  const r = stackDiscounts(price, pcts);
  if (!r) return null;
  const steps: Step[] = [];
  let prev = price;
  for (const s of r.steps) {
    steps.push({ key: "stack", math: `${fmtNum(prev)} × (1 - ${fmtNum(s.pct)} ÷ 100) = ${fmtNum(s.after)}` });
    prev = s.after;
  }
  steps.push({ key: "effective", math: `(${fmtNum(price)} - ${fmtNum(r.final)}) ÷ ${fmtNum(price)} = ${fmtNum(r.effectivePct / 100)}` });
  steps.push({ key: "percentify", math: `${fmtNum(r.effectivePct / 100)} × 100 = ${fmtNum(r.effectivePct)}%` });
  steps.push({ key: "naiveSum", math: `${pcts.map((p) => fmtNum(p)).join(" + ")} = ${fmtNum(r.naivePct)}%` });
  return steps;
}

/** 小费分摊三行:小费、总额、人均。非法输入 → null。 */
export function tipSplitSteps(bill: number, tipPct: number, people: number): Step[] | null {
  const r = tipSplit(bill, tipPct, people, "none");
  if (!r) return null;
  return [
    { key: "tipAmount", math: `${fmtNum(bill)} × ${fmtNum(tipPct)} ÷ 100 = ${fmtNum(r.tip)}` },
    { key: "grand", math: `${fmtNum(bill)} + ${fmtNum(r.tip)} = ${fmtNum(r.total)}` },
    { key: "perHead", math: `${fmtNum(r.total)} ÷ ${fmtNum(people)} = ${fmtNum(r.exactPerPerson)}` },
  ];
}

/** 化简比:gcd 行 + 同除行。非法输入 → null。 */
export function simplifyRatioSteps(a: number, b: number): Step[] | null {
  const r = simplifyRatio(a, b);
  if (!r) return null;
  // gcd 作用在化整后的值上;从结果反推展示用整数(与 simplifyRatio 同一缩放)
  let ia = a;
  let ib = b;
  for (let k = 0; k <= 9; k++) {
    const f = 10 ** k;
    if (Math.abs(Math.round(a * f) / f - a) <= 1e-12 * Math.max(1, Math.abs(a)) &&
        Math.abs(Math.round(b * f) / f - b) <= 1e-12 * Math.max(1, Math.abs(b))) {
      ia = Math.round(a * f);
      ib = Math.round(b * f);
      break;
    }
  }
  const g = gcdInt(ia, ib);
  return [
    { key: "gcd", math: `gcd(${fmtNum(ia)}, ${fmtNum(ib)}) = ${fmtNum(g)}` },
    { key: "divide", math: `${fmtNum(ia)} ÷ ${fmtNum(g)} : ${fmtNum(ib)} ÷ ${fmtNum(g)} = ${fmtNum(r.a)} : ${fmtNum(r.b)}` },
  ];
}

/** 解比例:交叉相乘行 + 求解行(未知数一律记作 "?",locale 无关)。 */
export function solveProportionSteps(
  a: number | null,
  b: number | null,
  c: number | null,
  d: number | null,
): Step[] | null {
  const r = solveProportion(a, b, c, d);
  if (r === null) return null;
  const s = (v: number | null) => (v === null ? "?" : fmtNum(v));
  let cross: string;
  let solve: string;
  if (a === null) {
    cross = `${s(a)} × ${s(d)} = ${s(b)} × ${s(c)}`;
    solve = `? = ${s(b)} × ${s(c)} ÷ ${s(d)} = ${fmtNum(r)}`;
  } else if (b === null) {
    cross = `${s(a)} × ${s(d)} = ${s(b)} × ${s(c)}`;
    solve = `? = ${s(a)} × ${s(d)} ÷ ${s(c)} = ${fmtNum(r)}`;
  } else if (c === null) {
    cross = `${s(a)} × ${s(d)} = ${s(b)} × ${s(c)}`;
    solve = `? = ${s(a)} × ${s(d)} ÷ ${s(b)} = ${fmtNum(r)}`;
  } else {
    cross = `${s(a)} × ${s(d)} = ${s(b)} × ${s(c)}`;
    solve = `? = ${s(b)} × ${s(c)} ÷ ${s(a)} = ${fmtNum(r)}`;
  }
  return [
    { key: "cross", math: cross },
    { key: "solve", math: solve },
  ];
}

/** 纵横比推边:一行代入。非法输入 → null。 */
export function aspectFromOneSteps(w: number, h: number, known: "w" | "h", value: number): Step[] | null {
  const r = aspectFromOne(w, h, known, value);
  if (r === null) return null;
  const math =
    known === "w"
      ? `${fmtNum(value)} × ${fmtNum(h)} ÷ ${fmtNum(w)} = ${fmtNum(r)}`
      : `${fmtNum(value)} × ${fmtNum(w)} ÷ ${fmtNum(h)} = ${fmtNum(r)}`;
  return [{ key: "aspect", math }];
}
