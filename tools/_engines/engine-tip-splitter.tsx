"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ToolPanel } from "@/components/ui";
import { Field, NumIn, Note, Stats, Steps, fmt, pick } from "./calc-ui";
import { tipSplit, tipSplitSteps, type TipRounding } from "../_lib/percent";

/**
 * 小费分摊引擎:账单 × 小费% ÷ 人数,支持三种舍入口径(人均 / 整单 / 不舍)。
 * 计算全部走 tools/_lib/percent.ts 的 tipSplit。
 */

const PRESETS = [10, 15, 18, 20];

const S = {
  bill: { en: "Bill amount", zh: "账单金额", ja: "会計金額", es: "Importe de la cuenta", pt: "Valor da conta" },
  tipPct: { en: "Tip percentage", zh: "小费比例", ja: "チップ率", es: "Porcentaje de propina", pt: "Porcentagem de gorjeta" },
  people: { en: "Split between", zh: "分摊人数", ja: "割り勘の人数", es: "Dividir entre", pt: "Dividir entre" },
  peopleUnit: { en: "people", zh: "人", ja: "人", es: "personas", pt: "pessoas" },
  rounding: { en: "Rounding", zh: "舍入方式", ja: "丸め", es: "Redondeo", pt: "Arredondamento" },
  rNone: { en: "No rounding", zh: "不舍入", ja: "丸めなし", es: "Sin redondeo", pt: "Sem arredondamento" },
  rPerson: { en: "Per person (to the cent)", zh: "按人均(到分)", ja: "一人あたり(セント単位)", es: "Por persona (al céntimo)", pt: "Por pessoa (ao centavo)" },
  rTotal: { en: "Whole bill (to the cent)", zh: "按整单(到分)", ja: "会計全体(セント単位)", es: "Cuenta completa (al céntimo)", pt: "Conta inteira (ao centavo)" },
  perPerson: { en: "Each person pays", zh: "每人应付", ja: "一人あたり支払額", es: "Cada persona paga", pt: "Cada pessoa paga" },
  tip: { en: "Tip", zh: "小费", ja: "チップ", es: "Propina", pt: "Gorjeta" },
  tipPer: { en: "Tip per person", zh: "人均小费", ja: "一人あたりのチップ", es: "Propina por persona", pt: "Gorjeta por pessoa" },
  total: { en: "Total with tip", zh: "含小费总额", ja: "チップ込み合計", es: "Total con propina", pt: "Total com gorjeta" },
  exactPer: { en: "Exact share before rounding", zh: "舍入前的精确人均", ja: "丸め前の正確な一人あたり", es: "Parte exacta antes de redondear", pt: "Parte exata antes de arredondar" },
  paidTip: { en: "Effective tip", zh: "实际小费", ja: "実チップ", es: "Propina efectiva", pt: "Gorjeta efetiva" },
  steps: { en: "Worked steps", zh: "计算步骤", ja: "計算の過程", es: "Pasos del cálculo", pt: "Passos do cálculo" },
  noteRounding: {
    en: "Per-person rounding nudges every share to a payable amount, so the table may leave a few cents more tip than the raw percentage. The “effective tip” line shows exactly what lands.",
    zh: "按人均舍入会把每份凑成可支付的整数分,全桌实际留下的小费可能比原始比例多几分。“实际小费”一行显示的正是真实落袋的数字。",
    ja: "一人あたりの丸めでは支払い可能な金額に合わせるため、卓全体で残るチップが素の割合より数セント多くなることがあります。「実チップ」の行が実際の額です。",
    es: "El redondeo por persona ajusta cada parte a un importe pagable, así que la mesa puede dejar unos céntimos más de propina que el porcentaje puro. La línea «Propina efectiva» muestra lo que de verdad queda.",
    pt: "O arredondamento por pessoa ajusta cada parte a um valor pagável, então a mesa pode deixar alguns centavos a mais de gorjeta que a porcentagem pura. A linha «Gorjeta efetiva» mostra o que realmente fica.",
  },
  pick: { en: "Enter a bill amount to split.", zh: "输入账单金额即可开始分摊。", ja: "会計金額を入力してください。", es: "Introduzca el importe de la cuenta.", pt: "Introduza o valor da conta." },
};

export function TipSplitterEngine() {
  const { locale } = useI18n();
  const [bill, setBill] = useState("85.50");
  const [tipPct, setTipPct] = useState("15");
  const [people, setPeople] = useState("3");
  const [rounding, setRounding] = useState<TipRounding>("per-person");

  const bn = Number(bill);
  const tn = Number(tipPct);
  const ppl = Number(people);
  const valid =
    bill !== "" && Number.isFinite(bn) && bn >= 0 &&
    tipPct !== "" && Number.isFinite(tn) && tn >= 0 &&
    Number.isInteger(ppl) && ppl >= 1 && ppl <= 10000;

  const result = valid ? tipSplit(bn, tn, ppl, rounding) : null;
  const steps = valid ? tipSplitSteps(bn, tn, ppl) : null;
  const money = (n: number) => fmt(n, 2);

  const roundOpts: { id: TipRounding; label: string }[] = [
    { id: "per-person", label: pick(locale, S.rPerson) },
    { id: "total", label: pick(locale, S.rTotal) },
    { id: "none", label: pick(locale, S.rNone) },
  ];

  return (
    <ToolPanel>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={pick(locale, S.bill)}>
          <NumIn value={bill} onChange={setBill} aria={pick(locale, S.bill)} min="0" />
        </Field>
        <Field label={pick(locale, S.people)}>
          <div className="flex items-center gap-2">
            <NumIn value={people} onChange={setPeople} aria={pick(locale, S.people)} step="1" min="1" />
            <span className="flex-none text-[13px] text-[var(--color-sub)]">{pick(locale, S.peopleUnit)}</span>
          </div>
        </Field>
      </div>

      <div className="mt-4">
        <Field label={pick(locale, S.tipPct)}>
          <div className="flex flex-wrap items-center gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={tipPct === String(p)}
                onClick={() => setTipPct(String(p))}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium ${tipPct === String(p) ? "border-transparent bg-[var(--color-ink)] text-white" : "hairline hover:bg-[var(--color-surface)]"}`}
              >
                {p}%
              </button>
            ))}
            <div className="w-24">
              <NumIn value={tipPct} onChange={setTipPct} aria={pick(locale, S.tipPct)} min="0" />
            </div>
          </div>
        </Field>
      </div>

      <div className="mt-4">
        <Field label={pick(locale, S.rounding)}>
          <div className="flex flex-wrap gap-2">
            {roundOpts.map((o) => (
              <button
                key={o.id}
                type="button"
                role="tab"
                aria-selected={rounding === o.id}
                onClick={() => setRounding(o.id)}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium ${rounding === o.id ? "border-transparent bg-[var(--color-ink)] text-white" : "hairline hover:bg-[var(--color-surface)]"}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Field>
      </div>

      {result ? (
        <>
          <div className="mt-5">
            <Stats
              items={[
                { label: pick(locale, S.perPerson), value: money(result.payPerPerson), tone: "accent" },
                { label: pick(locale, S.total), value: money(result.finalTotal) },
                { label: pick(locale, S.exactPer), value: money(result.exactPerPerson) },
                { label: pick(locale, S.tipPer), value: money(result.tipPerPerson) },
                { label: pick(locale, S.tip), value: money(result.tip) },
                { label: pick(locale, S.paidTip), value: money(result.finalTip), tone: "good" },
              ]}
            />
          </div>
          {steps && <Steps steps={steps} title={pick(locale, S.steps)} locale={locale} />}
        </>
      ) : (
        <div className="mt-5">
          <Note>{pick(locale, S.pick)}</Note>
        </div>
      )}

      <div className="mt-3">
        <Note>{pick(locale, S.noteRounding)}</Note>
      </div>
    </ToolPanel>
  );
}
