"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ToolPanel } from "@/components/ui";
import { Field, NumIn, Note, Stats, Steps, fmt, pick } from "./calc-ui";
import { stackDiscountSteps, stackDiscounts } from "../_lib/percent";

/**
 * 叠加折扣引擎:20% + 10% ≠ 30%,逐层应用并对比“直加错觉”。
 * 最多 5 层折扣;计算全部走 tools/_lib/percent.ts 的 stackDiscounts。
 */

const MAX_STACK = 5;

const S = {
  price: { en: "Original price", zh: "原价", ja: "元の価格", es: "Precio original", pt: "Preço original" },
  discounts: { en: "Discounts, applied in order", zh: "折扣(按顺序叠加)", ja: "割引(順に適用)", es: "Descuentos, en orden", pt: "Descontos, em ordem" },
  addRow: { en: "+ Add a discount", zh: "+ 加一层折扣", ja: "+ 割引を追加", es: "+ Añadir descuento", pt: "+ Adicionar desconto" },
  remove: { en: "Remove", zh: "移除", ja: "削除", es: "Quitar", pt: "Remover" },
  finalPrice: { en: "Final price", zh: "最终价", ja: "最終価格", es: "Precio final", pt: "Preço final" },
  effective: { en: "Effective discount", zh: "实际总折扣", ja: "実質割引率", es: "Descuento real", pt: "Desconto real" },
  saved: { en: "You save", zh: "共省下", ja: "節約額", es: "Ahorras", pt: "Você economiza" },
  naive: { en: "Naive sum of discounts", zh: "折扣直加的错觉", ja: "割引の単純合計", es: "Suma ingenua de descuentos", pt: "Soma ingênua dos descontos" },
  naivePrice: { en: "Price if they truly added up", zh: "若真能直加的价格", ja: "単純合計だった場合の価格", es: "Precio si se sumaran de verdad", pt: "Preço se realmente somassem" },
  delta: { en: "Stacking costs this much more", zh: "叠加比直加多付", ja: "積み重ねはこれだけ高く", es: "Apilar cuesta esto más", pt: "Empilhar custa isso a mais" },
  steps: { en: "Worked steps", zh: "计算步骤", ja: "計算の過程", es: "Pasos del cálculo", pt: "Passos do cálculo" },
  why: {
    en: "Why they differ: each percentage bites into what is left, not into the original price. 20% off 100 leaves 80; 10% then comes off 80, saving only 8 — total saving 28, not 30.",
    zh: "为什么会不同:每一层百分比都咬在“剩下的钱”上,而不是原价上。100 打 8 折剩 80;再打 9 折只省 8——总共省 28,不是 30。",
    ja: "理由:各パーセントは「残り」に効くのであって元の価格にではありません。100 から 20% 引くと 80。次の 10% は 80 から引かれるので 8 しか減らず、合計の節約は 28 で 30 ではありません。",
    es: "Por qué difieren: cada porcentaje muerde lo que queda, no el precio original. 20% sobre 100 deja 80; el 10% se aplica luego a 80 y solo ahorra 8: en total 28, no 30.",
    pt: "Por que diferem: cada porcentagem incide sobre o que sobra, não sobre o preço original. 20% em 100 deixa 80; os 10% incidem então sobre 80 e poupam só 8 — no total 28, não 30.",
  },
  pick: { en: "Enter a price and at least one discount.", zh: "输入原价和至少一层折扣。", ja: "価格と 1 つ以上の割引を入力してください。", es: "Introduzca un precio y al menos un descuento.", pt: "Introduza um preço e pelo menos um desconto." },
};

export function StackDiscountEngine() {
  const { locale } = useI18n();
  const [price, setPrice] = useState("100");
  const [pcts, setPcts] = useState<string[]>(["20", "10"]);

  const pn = Number(price);
  const pctsN = pcts.map((p) => Number(p));
  const valid = price !== "" && Number.isFinite(pn) && pcts.every((p) => p !== "" && Number.isFinite(Number(p)));
  const result = valid ? stackDiscounts(pn, pctsN) : null;
  const steps = valid ? stackDiscountSteps(pn, pctsN) : null;

  const setPct = (i: number, v: string) => setPcts((arr) => arr.map((p, j) => (j === i ? v : p)));
  const removeRow = (i: number) => setPcts((arr) => (arr.length > 1 ? arr.filter((_, j) => j !== i) : arr));

  return (
    <ToolPanel>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={pick(locale, S.price)}>
          <NumIn value={price} onChange={setPrice} aria={pick(locale, S.price)} min="0" />
        </Field>
      </div>

      <div className="mt-4">
        <span className="mb-1.5 block text-[13px] font-medium text-[var(--color-sub)]">{pick(locale, S.discounts)}</span>
        <div className="space-y-2">
          {pcts.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="mono w-7 flex-none text-[13px] text-[var(--color-sub)]">{i + 1}.</span>
              <div className="relative flex-1">
                <NumIn value={p} onChange={(v) => setPct(i, v)} aria={`${pick(locale, S.discounts)} ${i + 1}`} />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[13px] text-[var(--color-sub)]">%</span>
              </div>
              {pcts.length > 1 && (
                <button type="button" onClick={() => removeRow(i)} className="flex-none rounded-lg px-2.5 py-1.5 text-[12.5px] text-[var(--color-sub)] hover:bg-[var(--color-surface)]">
                  {pick(locale, S.remove)}
                </button>
              )}
            </div>
          ))}
        </div>
        {pcts.length < MAX_STACK && (
          <button type="button" onClick={() => setPcts((arr) => [...arr, ""])} className="mt-2.5 rounded-full border hairline px-3.5 py-1.5 text-[13px] font-medium hover:bg-[var(--color-surface)]">
            {pick(locale, S.addRow)}
          </button>
        )}
      </div>

      {result ? (
        <>
          <div className="mt-5">
            <Stats
              items={[
                { label: pick(locale, S.finalPrice), value: fmt(result.final), tone: "accent" },
                { label: pick(locale, S.effective), value: `${fmt(result.effectivePct)}%`, tone: "good" },
                { label: pick(locale, S.saved), value: fmt(result.saved) },
                { label: pick(locale, S.naive), value: `${fmt(result.naivePct)}%`, tone: "bad" },
                { label: pick(locale, S.naivePrice), value: fmt(result.naiveFinal) },
                { label: pick(locale, S.delta), value: fmt(result.naiveDelta) },
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
        <Note>{pick(locale, S.why)}</Note>
      </div>
    </ToolPanel>
  );
}
