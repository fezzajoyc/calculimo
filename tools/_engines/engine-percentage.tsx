"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ToolPanel } from "@/components/ui";
import { BigOut, Field, Formula, NumIn, Note, Steps, Tabs, fmt, pick } from "./calc-ui";
import {
  isWhatPctOf, isWhatPctOfSteps, pctAdd, pctAddSubSteps, pctChange, pctChangeSteps,
  pctOf, pctOfSteps, pctSub,
} from "../_lib/percent";

/**
 * 百分比五式引擎:一个引擎覆盖 X% of Y / X 是 Y 的百分之几 / 变化率 / 加 X% / 减 X%。
 * 计算与步骤全部走 tools/_lib/percent.ts;组件只做输入与呈现。
 */

const S = {
  of: { en: "X% of Y", zh: "X% of Y(X% 乘 Y)", ja: "X% of Y", es: "X% de Y", pt: "X% de Y" },
  what: { en: "X is what % of Y", zh: "X 是 Y 的百分之几", ja: "X は Y の何%", es: "X es qué % de Y", pt: "X é que % de Y" },
  change: { en: "% change X → Y", zh: "从 X 到 Y 的变化率", ja: "X → Y の変化率", es: "Cambio % de X a Y", pt: "Variação % de X a Y" },
  add: { en: "Add X% to Y", zh: "Y 增加 X%", ja: "Y に X% 加算", es: "Sumar X% a Y", pt: "Somar X% a Y" },
  sub: { en: "Subtract X% from Y", zh: "Y 减少 X%", ja: "Y から X% 減算", es: "Restar X% a Y", pt: "Subtrair X% de Y" },
  xPct: { en: "Percent (X)", zh: "百分比(X)", ja: "パーセント(X)", es: "Porcentaje (X)", pt: "Porcentagem (X)" },
  whole: { en: "Whole (Y)", zh: "总量(Y)", ja: "全体(Y)", es: "Total (Y)", pt: "Total (Y)" },
  part: { en: "Part (X)", zh: "部分(X)", ja: "部分(X)", es: "Parte (X)", pt: "Parte (X)" },
  from: { en: "From (X)", zh: "起始值(X)", ja: "開始値(X)", es: "Desde (X)", pt: "De (X)" },
  to: { en: "To (Y)", zh: "结束值(Y)", ja: "終了値(Y)", es: "Hasta (Y)", pt: "Para (Y)" },
  base: { en: "Value (Y)", zh: "数值(Y)", ja: "値(Y)", es: "Valor (Y)", pt: "Valor (Y)" },
  steps: { en: "Worked steps", zh: "计算步骤", ja: "計算の過程", es: "Pasos del cálculo", pt: "Passos do cálculo" },
  formula: { en: "Formula", zh: "公式", ja: "式", es: "Fórmula", pt: "Fórmula" },
  resultOf: { en: "X% of Y", zh: "X% of Y", ja: "X% of Y", es: "X% de Y", pt: "X% de Y" },
  resultWhat: { en: "X as % of Y", zh: "X 占 Y 的", ja: "Y に占める X", es: "X como % de Y", pt: "X como % de Y" },
  resultChange: { en: "Change from X to Y", zh: "X → Y 变化", ja: "X → Y の変化", es: "Cambio de X a Y", pt: "Mudança de X a Y" },
  resultAdd: { en: "Y + X%", zh: "Y + X%", ja: "Y + X%", es: "Y + X%", pt: "Y + X%" },
  resultSub: { en: "Y − X%", zh: "Y − X%", ja: "Y − X%", es: "Y − X%", pt: "Y − X%" },
  zeroBase: {
    en: "A percentage change from zero is undefined — there is no base to compare against. Enter a non-zero starting value.",
    zh: "从 0 出发的百分比变化没有定义——没有可比的基准。请输入非零的起始值。",
    ja: "0 から始まる変化率は定義できません(比較する基準がないため)。0 以外の開始値を入力してください。",
    es: "Un cambio porcentual desde cero no está definido: no hay base con la que comparar. Introduzca un valor inicial distinto de cero.",
    pt: "Uma variação percentual a partir de zero não tem definição — não há base de comparação. Introduza um valor inicial diferente de zero.",
  },
  zeroWhole: {
    en: "“X is what % of Y” needs a non-zero whole — dividing by zero has no answer.",
    zh: "“X 是 Y 的百分之几”要求 Y 不为 0——除以 0 没有答案。",
    ja: "「X は Y の何%」では Y に 0 以外を入力してください。0 で割る答えは存在しません。",
    es: "«X es qué % de Y» necesita un total distinto de cero: dividir por cero no tiene respuesta.",
    pt: "«X é que % de Y» precisa de um total diferente de zero — dividir por zero não tem resposta.",
  },
  pick: { en: "Enter numbers to see the result and every step of the math.", zh: "输入数字即可看到结果与完整计算步骤。", ja: "数値を入力すると結果と計算の過程が表示されます。", es: "Introduzca números para ver el resultado y todos los pasos.", pt: "Introduza números para ver o resultado e todos os passos." },
};

const F = {
  of: "result = Y × X ÷ 100",
  what: "result = X ÷ Y × 100",
  change: "result = (Y − X) ÷ X × 100",
  add: "result = Y × (1 + X ÷ 100)",
  sub: "result = Y × (1 − X ÷ 100)",
};

type Mode = "of" | "what" | "change" | "add" | "sub";

export function PercentageEngine() {
  const { locale } = useI18n();
  const [mode, setMode] = useState<Mode>("of");
  const [x, setX] = useState("15");
  const [y, setY] = useState("80");

  const xn = Number(x);
  const yn = Number(y);
  const ready = x !== "" && y !== "" && Number.isFinite(xn) && Number.isFinite(yn);

  let result: number | null = null;
  let steps: ReturnType<typeof pctOfSteps> = [];
  let zeroNote: string | null = null;
  if (ready) {
    if (mode === "of") {
      result = pctOf(xn, yn);
      steps = result === null ? [] : pctOfSteps(xn, yn);
    } else if (mode === "what") {
      result = isWhatPctOf(xn, yn);
      if (result === null && yn === 0) zeroNote = pick(locale, S.zeroWhole);
      steps = result === null ? [] : isWhatPctOfSteps(xn, yn);
    } else if (mode === "change") {
      result = pctChange(xn, yn);
      if (result === null && xn === 0) zeroNote = pick(locale, S.zeroBase);
      steps = result === null ? [] : pctChangeSteps(xn, yn);
    } else if (mode === "add") {
      result = pctAdd(yn, xn);
      steps = result === null ? [] : pctAddSubSteps(yn, xn, "add");
    } else {
      result = pctSub(yn, xn);
      steps = result === null ? [] : pctAddSubSteps(yn, xn, "sub");
    }
  }

  const resultLabel = pick(locale, S[mode === "of" ? "resultOf" : mode === "what" ? "resultWhat" : mode === "change" ? "resultChange" : mode === "add" ? "resultAdd" : "resultSub"]);
  const sign = mode === "change" && result !== null && result > 0 ? "+" : "";

  return (
    <ToolPanel>
      <Tabs
        options={[
          { id: "of", label: pick(locale, S.of) },
          { id: "what", label: pick(locale, S.what) },
          { id: "change", label: pick(locale, S.change) },
          { id: "add", label: pick(locale, S.add) },
          { id: "sub", label: pick(locale, S.sub) },
        ]}
        value={mode}
        onChange={(id) => setMode(id as Mode)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {mode === "of" || mode === "what" ? (
          <>
            <Field label={mode === "of" ? pick(locale, S.xPct) : pick(locale, S.part)}>
              <NumIn value={x} onChange={setX} aria={mode === "of" ? pick(locale, S.xPct) : pick(locale, S.part)} />
            </Field>
            <Field label={pick(locale, S.whole)}>
              <NumIn value={y} onChange={setY} aria={pick(locale, S.whole)} />
            </Field>
          </>
        ) : mode === "change" ? (
          <>
            <Field label={pick(locale, S.from)}>
              <NumIn value={x} onChange={setX} aria={pick(locale, S.from)} />
            </Field>
            <Field label={pick(locale, S.to)}>
              <NumIn value={y} onChange={setY} aria={pick(locale, S.to)} />
            </Field>
          </>
        ) : (
          <>
            <Field label={pick(locale, S.base)}>
              <NumIn value={y} onChange={setY} aria={pick(locale, S.base)} />
            </Field>
            <Field label={pick(locale, S.xPct)}>
              <NumIn value={x} onChange={setX} aria={pick(locale, S.xPct)} />
            </Field>
          </>
        )}
      </div>

      {result !== null ? (
        <>
          <Formula label={pick(locale, S.formula)}>{F[mode]}</Formula>
          <BigOut label={resultLabel}>
            {sign}
            {fmt(result)}
            {mode === "what" ? "%" : mode === "change" ? " %" : ""}
          </BigOut>
          <Steps steps={steps} title={pick(locale, S.steps)} locale={locale} />
        </>
      ) : (
        <div className="mt-5">
          <Note>{zeroNote ?? pick(locale, S.pick)}</Note>
        </div>
      )}
    </ToolPanel>
  );
}
