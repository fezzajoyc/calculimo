"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ToolPanel } from "@/components/ui";
import { BigOut, Field, Formula, NumIn, Note, Stats, Steps, Tabs, fmt, pick } from "./calc-ui";
import {
  aspectFromOne, aspectFromOneSteps, simplifyRatio, simplifyRatioSteps,
  solveProportion, solveProportionSteps,
} from "../_lib/percent";

/**
 * 比率引擎:化简 A:B / 解比例 A:B = C:D / 纵横比推边。
 * 计算全部走 tools/_lib/percent.ts 的 simplifyRatio / solveProportion / aspectFromOne。
 */

const S = {
  simplify: { en: "Simplify A : B", zh: "化简 A : B", ja: "A : B を約分", es: "Simplificar A : B", pt: "Simplificar A : B" },
  proportion: { en: "A : B = C : D", zh: "A : B = C : D(解比例)", ja: "A : B = C : D の解法", es: "A : B = C : D", pt: "A : B = C : D" },
  aspect: { en: "Aspect ratio", zh: "纵横比", ja: "アスペクト比", es: "Relación de aspecto", pt: "Proporção" },
  a: { en: "A", zh: "A", ja: "A", es: "A", pt: "A" },
  b: { en: "B", zh: "B", ja: "B", es: "B", pt: "B" },
  c: { en: "C", zh: "C", ja: "C", es: "C", pt: "C" },
  d: { en: "D", zh: "D", ja: "D", es: "D", pt: "D" },
  unknown: { en: "Unknown", zh: "未知数", ja: "未知数", es: "Incógnita", pt: "Incógnita" },
  ratioWH: { en: "Ratio w : h", zh: "比率 w : h", ja: "比率 w : h", es: "Relación ancho : alto", pt: "Relação largura : altura" },
  knownSide: { en: "Known side", zh: "已知边", ja: "既知の辺", es: "Lado conocido", pt: "Lado conhecido" },
  width: { en: "Width (w)", zh: "宽(w)", ja: "幅(w)", es: "Ancho", pt: "Largura" },
  height: { en: "Height (h)", zh: "高(h)", ja: "高さ(h)", es: "Alto", pt: "Altura" },
  value: { en: "Known dimension", zh: "已知尺寸", ja: "既知の寸法", es: "Dimensión conocida", pt: "Dimensão conhecida" },
  simplified: { en: "Simplified", zh: "化简结果", ja: "約分の結果", es: "Simplificada", pt: "Simplificada" },
  asDecimal: { en: "As a decimal", zh: "小数形式", ja: "小数で", es: "Como decimal", pt: "Como decimal" },
  solved: { en: "Unknown value", zh: "未知数的值", ja: "未知数の値", es: "Valor de la incógnita", pt: "Valor da incógnita" },
  missingSide: { en: "Missing dimension", zh: "另一边的值", ja: "もう片方の寸法", es: "Dimensión que falta", pt: "Dimensão que falta" },
  steps: { en: "Worked steps", zh: "计算步骤", ja: "計算の過程", es: "Pasos del cálculo", pt: "Passos do cálculo" },
  formula: { en: "Formula", zh: "公式", ja: "式", es: "Fórmula", pt: "Fórmula" },
  pick: { en: "Enter numbers to see the result and every step of the math.", zh: "输入数字即可看到结果与完整计算步骤。", ja: "数値を入力すると結果と計算の過程が表示されます。", es: "Introduzca números para ver el resultado y todos los pasos.", pt: "Introduza números para ver o resultado e todos os passos." },
  notSimplifiable: {
    en: "These two numbers have no exact integer ratio (the decimal expansion does not terminate within 9 places) — try rounding the inputs first.",
    zh: "这两个数没有精确的整数比(小数在 9 位内除不尽)——先把输入四舍五入再试。",
    ja: "この 2 つの数に正確な整数比はありません(小数が 9 桁以内で有限になりません)。入力を丸めてからお試しください。",
    es: "Estos dos números no tienen razón entera exacta (el decimal no se termina en 9 cifras): pruebe a redondear las entradas.",
    pt: "Esses dois números não têm razão inteira exata (o decimal não termina em 9 casas) — tente arredondar as entradas.",
  },
  zeroWhole: {
    en: "A proportion needs a non-zero value in the denominator position — check which side you left as 0.",
    zh: "比例式中分母位置不能为 0——检查哪一边被留成了 0。",
    ja: "比例式では分母の位置を 0 にできません。どちらかが 0 になっていないか確認してください。",
    es: "Una proporción necesita un valor distinto de cero en el denominador: revise qué lado quedó en 0.",
    pt: "Uma proporção precisa de um valor diferente de zero no denominador — verifique qual lado ficou em 0.",
  },
};

type Mode = "simplify" | "proportion" | "aspect";
type Unknown = "a" | "b" | "c" | "d";

export function RatioEngine() {
  const { locale } = useI18n();
  const [mode, setMode] = useState<Mode>("simplify");

  // simplify
  const [sa, setSa] = useState("16");
  const [sb, setSb] = useState("12");
  // proportion
  const [pa, setPa] = useState("2");
  const [pb, setPb] = useState("3");
  const [pc, setPc] = useState("");
  const [pd, setPd] = useState("9");
  const [unknown, setUnknown] = useState<Unknown>("c");
  // aspect
  const [aw, setAw] = useState("16");
  const [ah, setAh] = useState("9");
  const [known, setKnown] = useState<"w" | "h">("w");
  const [value, setValue] = useState("1920");

  const nOr = (s: string, unk: boolean) => (unk ? null : s === "" || !Number.isFinite(Number(s)) ? NaN : Number(s));
  const pVals = { a: nOr(pa, unknown === "a"), b: nOr(pb, unknown === "b"), c: nOr(pc, unknown === "c"), d: nOr(pd, unknown === "d") };

  const san = Number(sa);
  const sbn = Number(sb);
  const simplified = sa !== "" && sb !== "" && Number.isFinite(san) && Number.isFinite(sbn) ? simplifyRatio(san, sbn) : null;
  const simplifyStepList = simplified ? simplifyRatioSteps(san, sbn) : null;

  const proportionVals = [pVals.a, pVals.b, pVals.c, pVals.d];
  const proportionReady = proportionVals.filter((v) => v === null).length === 1 && proportionVals.every((v) => v === null || Number.isFinite(v));
  const solved = proportionReady ? solveProportion(pVals.a, pVals.b, pVals.c, pVals.d) : null;
  const proportionStepList = solved !== null ? solveProportionSteps(pVals.a, pVals.b, pVals.c, pVals.d) : null;
  const proportionZero = proportionReady && solved === null;

  const wan = Number(aw);
  const han = Number(ah);
  const vn = Number(value);
  const aspectReady = aw !== "" && ah !== "" && value !== "" && Number.isFinite(wan) && Number.isFinite(han) && Number.isFinite(vn);
  const otherSide = aspectReady ? aspectFromOne(wan, han, known, vn) : null;
  const aspectSteps = otherSide !== null ? aspectFromOneSteps(wan, han, known, vn) : null;
  const aspectSimplified = aspectReady ? simplifyRatio(wan, han) : null;

  const dec = simplified ? fmt(simplified.a / simplified.b) : null;

  const unknownOpts: { id: Unknown; label: string }[] = [
    { id: "a", label: "A" }, { id: "b", label: "B" }, { id: "c", label: "C" }, { id: "d", label: "D" },
  ];

  return (
    <ToolPanel>
      <Tabs
        options={[
          { id: "simplify", label: pick(locale, S.simplify) },
          { id: "proportion", label: pick(locale, S.proportion) },
          { id: "aspect", label: pick(locale, S.aspect) },
        ]}
        value={mode}
        onChange={(id) => setMode(id as Mode)}
      />

      {mode === "simplify" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={pick(locale, S.a)}>
              <NumIn value={sa} onChange={setSa} aria={pick(locale, S.a)} />
            </Field>
            <Field label={pick(locale, S.b)}>
              <NumIn value={sb} onChange={setSb} aria={pick(locale, S.b)} />
            </Field>
          </div>
          {simplified ? (
            <>
              <Formula label={pick(locale, S.formula)}>A : B = (A ÷ gcd) : (B ÷ gcd)</Formula>
              <div className="mt-5">
                <Stats
                  items={[
                    { label: pick(locale, S.simplified), value: `${simplified.a} : ${simplified.b}`, tone: "accent" },
                    { label: pick(locale, S.asDecimal), value: dec ?? "—" },
                  ]}
                />
              </div>
              {simplifyStepList && <Steps steps={simplifyStepList} title={pick(locale, S.steps)} locale={locale} />}
            </>
          ) : (
            <div className="mt-5">
              <Note>{sa === "" || sb === "" ? pick(locale, S.pick) : pick(locale, S.notSimplifiable)}</Note>
            </div>
          )}
        </>
      )}

      {mode === "proportion" && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(["a", "b", "c", "d"] as const).map((k) => {
              const val = k === "a" ? pa : k === "b" ? pb : k === "c" ? pc : pd;
              const set = k === "a" ? setPa : k === "b" ? setPb : k === "c" ? setPc : setPd;
              return (
                <Field key={k} label={k}>
                  <NumIn value={val} onChange={set} aria={k} placeholder={unknown === k ? "?" : undefined} />
                </Field>
              );
            })}
          </div>
          <div className="mt-4">
            <Field label={pick(locale, S.unknown)}>
              <div className="flex flex-wrap gap-2">
                {unknownOpts.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={unknown === o.id}
                    onClick={() => setUnknown(o.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium ${unknown === o.id ? "border-transparent bg-[var(--color-ink)] text-white dark:bg-white dark:text-[#1d1d1f]" : "hairline hover:bg-[var(--color-surface)]"}`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          {solved !== null ? (
            <>
              <Formula label={pick(locale, S.formula)}>A × D = B × C</Formula>
              <BigOut label={pick(locale, S.solved)}>{fmt(solved)}</BigOut>
              {proportionStepList && <Steps steps={proportionStepList} title={pick(locale, S.steps)} locale={locale} />}
            </>
          ) : (
            <div className="mt-5">
              <Note>{proportionZero ? pick(locale, S.zeroWhole) : pick(locale, S.pick)}</Note>
            </div>
          )}
        </>
      )}

      {mode === "aspect" && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={pick(locale, S.ratioWH)}>
              <div className="flex items-center gap-2">
                <NumIn value={aw} onChange={setAw} aria={pick(locale, S.width)} />
                <span className="flex-none text-[13px] text-[var(--color-sub)]">:</span>
                <NumIn value={ah} onChange={setAh} aria={pick(locale, S.height)} />
              </div>
            </Field>
            <Field label={pick(locale, S.knownSide)}>
              <div className="flex gap-2">
                <button type="button" aria-pressed={known === "w"} onClick={() => setKnown("w")} className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium ${known === "w" ? "border-transparent bg-[var(--color-ink)] text-white dark:bg-white dark:text-[#1d1d1f]" : "hairline"}`}>
                  {pick(locale, S.width)}
                </button>
                <button type="button" aria-pressed={known === "h"} onClick={() => setKnown("h")} className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium ${known === "h" ? "border-transparent bg-[var(--color-ink)] text-white dark:bg-white dark:text-[#1d1d1f]" : "hairline"}`}>
                  {pick(locale, S.height)}
                </button>
              </div>
            </Field>
            <Field label={pick(locale, S.value)}>
              <NumIn value={value} onChange={setValue} aria={pick(locale, S.value)} />
            </Field>
          </div>
          {otherSide !== null ? (
            <>
              <BigOut label={pick(locale, S.missingSide)}>{fmt(otherSide)}</BigOut>
              <div className="mt-4">
                <Stats
                  items={[
                    { label: pick(locale, S.simplified), value: aspectSimplified ? `${aspectSimplified.a} : ${aspectSimplified.b}` : "—", tone: "accent" },
                  ]}
                  cols="sm:grid-cols-1"
                />
              </div>
              {aspectSteps && <Steps steps={aspectSteps} title={pick(locale, S.steps)} locale={locale} />}
            </>
          ) : (
            <div className="mt-5">
              <Note>{pick(locale, S.pick)}</Note>
            </div>
          )}
        </>
      )}
    </ToolPanel>
  );
}
