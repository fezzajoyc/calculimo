"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ToolPanel } from "@/components/ui";
import { BigOut, Field, Formula, NumIn, Note, Steps, Tabs, fmt, pick } from "./calc-ui";
import { baseOf, baseOfSteps, reversePct, reversePctSteps, type ReverseDir } from "../_lib/percent";

/**
 * 逆向百分比引擎:已知变化后的值与变化率,还原原值;或已知“部分 + 百分比”求基数。
 * 全部走 tools/_lib/percent.ts 的 reversePct / baseOf。
 */

const S = {
  original: { en: "Find the original", zh: "求原值", ja: "元の値を求める", es: "Hallar el original", pt: "Descobrir o original" },
  base: { en: "X is Y% of what", zh: "X 是 Y% 的多少", ja: "X は Y% のいくつ", es: "X es el Y% de qué", pt: "X é Y% de quê" },
  final: { en: "Value after the change", zh: "变化后的值", ja: "変化後の値", es: "Valor tras el cambio", pt: "Valor após a mudança" },
  pct: { en: "Percent (Y)", zh: "百分比(Y)", ja: "パーセント(Y)", es: "Porcentaje (Y)", pt: "Porcentagem (Y)" },
  dir: { en: "Direction", zh: "变化方向", ja: "方向", es: "Dirección", pt: "Direção" },
  inc: { en: "after an increase", zh: "增加之后", ja: "増加後", es: "tras un aumento", pt: "após um aumento" },
  dec: { en: "after a decrease", zh: "减少之后", ja: "減少後", es: "tras una disminución", pt: "após uma diminuição" },
  part: { en: "Part (X)", zh: "部分(X)", ja: "部分(X)", es: "Parte (X)", pt: "Parte (X)" },
  steps: { en: "Worked steps", zh: "计算步骤", ja: "計算の過程", es: "Pasos del cálculo", pt: "Passos do cálculo" },
  formula: { en: "Formula", zh: "公式", ja: "式", es: "Fórmula", pt: "Fórmula" },
  originalOut: { en: "Original value", zh: "原值", ja: "元の値", es: "Valor original", pt: "Valor original" },
  baseOut: { en: "Base number", zh: "基数", ja: "基数", es: "Número base", pt: "Número base" },
  pick: { en: "Enter numbers to see the result and every step of the math.", zh: "输入数字即可看到结果与完整计算步骤。", ja: "数値を入力すると結果と計算の過程が表示されます。", es: "Introduzca números para ver el resultado y todos los pasos.", pt: "Introduza números para ver o resultado e todos os passos." },
  irreversible: {
    en: "The change factor is zero or negative here (a decrease of 100%+ or an increase below −100%) — the base is wiped out and the original value cannot be recovered.",
    zh: "此时变化系数为零或负(降幅 ≥ 100%,或涨幅 ≤ −100%)——基数已被抹掉,无法从结果还原原值。",
    ja: "この条件では変化の倍率が 0 以下になり(100% 以上の減少、または −100% 以下の増加)、元の値の情報が失われて復元できません。",
    es: "Aquí el factor de cambio es cero o negativo (una disminución del 100% o más, o un aumento de −100% o menos): la base queda borrada y el valor original no se puede recuperar.",
    pt: "Aqui o fator de mudança é zero ou negativo (uma diminuição de 100% ou mais, ou um aumento de −100% ou menos) — a base é apagada e o valor original não pode ser recuperado.",
  },
  zeroPct: {
    en: "A percentage of 0 gives no information about the base — the answer could be any number.",
    zh: "百分比为 0 时不含任何基数信息——答案可以是任何数。",
    ja: "0% では基数の情報が得られず、答えは任意の数になってしまいます。",
    es: "Un porcentaje de 0 no da información sobre la base: la respuesta podría ser cualquier número.",
    pt: "Uma porcentagem de 0 não dá informação sobre a base — a resposta poderia ser qualquer número.",
  },
  trap: {
    en: "Watch the classic trap: if a price rose 25% and is now 100, the original was 100 ÷ 1.25 = 80 — not 75. Undoing a +25% is not the same as applying −25%.",
    zh: "小心经典陷阱:涨价 25% 后是 100,原价是 100 ÷ 1.25 = 80,而不是 75。撤销 +25% 不等于执行 −25%。",
    ja: "典型の落とし穴に注意:25% 値上げして 100 になったなら、元は 100 ÷ 1.25 = 80 であり 75 ではありません。+25% の取り消しは −25% の適用と同じではありません。",
    es: "Ojo con la trampa clásica: si un precio subió 25% y ahora es 100, el original era 100 ÷ 1.25 = 80, no 75. Deshacer un +25% no es aplicar un −25%.",
    pt: "Atenção à armadilha clássica: se um preço subiu 25% e agora é 100, o original era 100 ÷ 1.25 = 80 — não 75. Desfazer +25% não é o mesmo que aplicar −25%.",
  },
};

type Mode = "original" | "base";

export function ReverseEngine() {
  const { locale } = useI18n();
  const [mode, setMode] = useState<Mode>("original");
  const [final, setFinal] = useState("100");
  const [pct, setPct] = useState("25");
  const [dir, setDir] = useState<ReverseDir>("increase");
  const [part, setPart] = useState("12");
  const [basePct, setBasePct] = useState("15");

  const fn = Number(final);
  const pn = Number(pct);
  const partn = Number(part);
  const bp = Number(basePct);

  let result: number | null = null;
  let steps: ReturnType<typeof reversePctSteps> = [];
  let note: string | null = null;
  if (mode === "original" && final !== "" && pct !== "" && Number.isFinite(fn) && Number.isFinite(pn)) {
    result = reversePct(fn, pn, dir);
    if (result === null) note = pick(locale, S.irreversible);
    steps = result === null ? [] : reversePctSteps(fn, pn, dir);
  } else if (mode === "base" && part !== "" && basePct !== "" && Number.isFinite(partn) && Number.isFinite(bp)) {
    result = baseOf(partn, bp);
    if (result === null && bp === 0) note = pick(locale, S.zeroPct);
    steps = result === null ? [] : baseOfSteps(partn, bp);
  }

  const formula = mode === "original" ? "original = final ÷ (1 ± Y ÷ 100)" : "base = X ÷ (Y ÷ 100)";

  return (
    <ToolPanel>
      <Tabs
        options={[
          { id: "original", label: pick(locale, S.original) },
          { id: "base", label: pick(locale, S.base) },
        ]}
        value={mode}
        onChange={(id) => setMode(id as Mode)}
      />

      {mode === "original" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={pick(locale, S.final)}>
            <NumIn value={final} onChange={setFinal} aria={pick(locale, S.final)} />
          </Field>
          <Field label={pick(locale, S.pct)}>
            <NumIn value={pct} onChange={setPct} aria={pick(locale, S.pct)} />
          </Field>
          <Field label={pick(locale, S.dir)}>
            <div className="flex gap-2">
              <button
                type="button"
                aria-pressed={dir === "increase"}
                onClick={() => setDir("increase")}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium ${dir === "increase" ? "border-transparent bg-[var(--color-ink)] text-white dark:bg-white dark:text-[#1d1d1f]" : "hairline"}`}
              >
                ↗ {pick(locale, S.inc)}
              </button>
              <button
                type="button"
                aria-pressed={dir === "decrease"}
                onClick={() => setDir("decrease")}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium ${dir === "decrease" ? "border-transparent bg-[var(--color-ink)] text-white dark:bg-white dark:text-[#1d1d1f]" : "hairline"}`}
              >
                ↘ {pick(locale, S.dec)}
              </button>
            </div>
          </Field>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={pick(locale, S.part)}>
            <NumIn value={part} onChange={setPart} aria={pick(locale, S.part)} />
          </Field>
          <Field label={pick(locale, S.pct)}>
            <NumIn value={basePct} onChange={setBasePct} aria={pick(locale, S.pct)} />
          </Field>
        </div>
      )}

      {result !== null ? (
        <>
          <Formula label={pick(locale, S.formula)}>{formula}</Formula>
          <BigOut label={pick(locale, mode === "original" ? S.originalOut : S.baseOut)}>{fmt(result)}</BigOut>
          <Steps steps={steps} title={pick(locale, S.steps)} locale={locale} />
        </>
      ) : (
        <div className="mt-5">
          <Note>{note ?? pick(locale, S.pick)}</Note>
        </div>
      )}

      <div className="mt-3">
        <Note>{pick(locale, S.trap)}</Note>
      </div>
    </ToolPanel>
  );
}
