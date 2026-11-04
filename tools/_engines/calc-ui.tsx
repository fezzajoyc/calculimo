"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/site";
import type { Step, StepKey } from "../_lib/percent";

/** Calculimo 引擎共用的轻量 UI 原语与取词助手(全部客户端组件)。 */

/** 引擎内的每语言短文案:按 locale 取,缺省回退英文。 */
export function pick(locale: Locale, rec: Record<string, string>): string {
  return rec[locale] ?? rec.en;
}

/**
 * 结果/步骤数字展示:全精度值 → locale 无关的中性写法(点号小数、无分组)。
 * 与步骤行、MCP 输出完全一致,方便逐位核对。
 */
export function fmt(n: number, maxDp = 10): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: maxDp }).format(n);
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <span className="block text-[13px] font-medium text-[var(--color-sub)]">{label}</span>
      {children}
    </div>
  );
}

export function NumIn({
  value,
  onChange,
  aria,
  step = "any",
  min,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  aria: string;
  step?: string;
  min?: string;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      min={min}
      className="field mono"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={aria}
      placeholder={placeholder}
    />
  );
}

/** 大号只读结果(主答案位)。 */
export function BigOut({ children, label }: { children: ReactNode; label: string }) {
  return (
    <output
      aria-live="polite"
      aria-label={label}
      className="mono mt-5 block rounded-xl border hairline bg-[var(--color-surface)] px-4 py-3.5 text-lg font-semibold"
    >
      {children}
    </output>
  );
}

/** 分段胶囊切换。 */
export function Tabs({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2" role="tablist">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
            value === o.id
              ? "border-transparent bg-[var(--color-ink)] text-white dark:bg-white dark:text-[#1d1d1f]"
              : "hairline hover:bg-[var(--color-surface)]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Stats({
  items,
  cols = "sm:grid-cols-2",
}: {
  items: { label: string; value: string; tone?: "good" | "bad" | "accent" }[];
  cols?: string;
}) {
  const tone = (t?: string) =>
    t === "good"
      ? "text-[var(--color-good)]"
      : t === "bad"
        ? "text-[var(--color-bad)]"
        : t === "accent"
          ? "text-[var(--color-accent-strong)]"
          : "text-[var(--color-ink)]";
  return (
    <div className={`grid grid-cols-2 gap-3 ${cols}`}>
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border hairline px-3.5 py-3">
          <div className="text-[12.5px] font-medium text-[var(--color-sub)]">{it.label}</div>
          <div className={`mono mt-1 text-[17px] font-semibold leading-6 ${tone(it.tone)}`} aria-live="polite">
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="text-[13px] leading-5 text-[var(--color-sub)]">{children}</p>;
}

/** 计算公式行(如 "X% × Y"):mono 展示在结果上方。 */
export function Formula({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="mt-5 flex items-baseline gap-2 text-[13px]">
      <span className="flex-none font-medium text-[var(--color-sub)]">{label}</span>
      <code className="mono rounded-lg bg-[var(--color-surface)] px-2 py-1 text-[13px]">{children}</code>
    </div>
  );
}

/** 步骤行的 localized 标签:math 行本身 locale 无关,标签按语言。 */
const STEP_LABELS: Record<StepKey, Record<string, string>> = {
  decimal: {
    en: "Percent to decimal", zh: "百分比化小数", ja: "パーセントを小数に", es: "Porcentaje a decimal", pt: "Porcentagem para decimal",
    fr: "Pourcentage en décimal", de: "Prozent in Dezimalzahl", ru: "Процент в десятичную", it: "Percentuale a decimale",
    tr: "Yüzdeyi ondalığa", ko: "백분율을 소수로", ar: "النسبة إلى عشري", hi: "प्रतिशत से दशमलव", id: "Persen ke desimal", vi: "Phần trăm sang thập phân",
  },
  apply: {
    en: "Apply", zh: "代入计算", ja: "計算", es: "Aplicar", pt: "Aplicar",
    fr: "Appliquer", de: "Anwenden", ru: "Подставить", it: "Applica",
    tr: "Uygula", ko: "계산", ar: "التطبيق", hi: "लागू करें", id: "Terapkan", vi: "Áp dụng",
  },
  quotient: {
    en: "Divide", zh: "相除", ja: "割り算", es: "Dividir", pt: "Dividir",
    fr: "Diviser", de: "Dividieren", ru: "Разделить", it: "Dividere",
    tr: "Böl", ko: "나누기", ar: "القسمة", hi: "भाग दें", id: "Bagi", vi: "Chia",
  },
  percentify: {
    en: "Times 100", zh: "乘以 100", ja: "100 を掛ける", es: "Por 100", pt: "Vezes 100",
    fr: "Fois 100", de: "Mal 100", ru: "Умножить на 100", it: "Per 100",
    tr: "100 ile çarp", ko: "100 곱하기", ar: "في 100", hi: "100 से गुणा", id: "Kali 100", vi: "Nhân 100",
  },
  diff: {
    en: "Difference", zh: "差值", ja: "差", es: "Diferencia", pt: "Diferença",
    fr: "Différence", de: "Differenz", ru: "Разность", it: "Differenza",
    tr: "Fark", ko: "차이", ar: "الفرق", hi: "अंतर", id: "Selisih", vi: "Hiệu",
  },
  ratio: {
    en: "Divide by the base", zh: "除以基准值", ja: "基準値で割る", es: "Dividir entre la base", pt: "Dividir pela base",
    fr: "Diviser par la base", de: "Durch den Basiswert teilen", ru: "Разделить на базу", it: "Dividere per la base",
    tr: "Tabana böl", ko: "기준값으로 나누기", ar: "القسمة على الأساس", hi: "आधार से भाग दें", id: "Bagi dengan dasar", vi: "Chia cho gốc",
  },
  factor: {
    en: "Multiplier", zh: "变化系数", ja: "倍率", es: "Factor", pt: "Fator",
    fr: "Coefficient", de: "Faktor", ru: "Множитель", it: "Fattore",
    tr: "Çarpan", ko: "배율", ar: "المعامل", hi: "गुणक", id: "Faktor", vi: "Hệ số",
  },
  restore: {
    en: "Undo the change", zh: "还原变化", ja: "変化を元に戻す", es: "Deshacer el cambio", pt: "Desfazer a mudança",
    fr: "Annuler le changement", de: "Änderung zurücknehmen", ru: "Отменить изменение", it: "Annulla la variazione",
    tr: "Değişimi geri al", ko: "변화 되돌리기", ar: "التراجع عن التغيير", hi: "बदलाव वापस लें", id: "Batalkan perubahan", vi: "Hoàn tác",
  },
  stack: {
    en: "Apply discount", zh: "逐层折后", ja: "割引を適用", es: "Aplicar descuento", pt: "Aplicar desconto",
    fr: "Appliquer la remise", de: "Rabatt anwenden", ru: "Применить скидку", it: "Applica lo sconto",
    tr: "İndirim uygula", ko: "할인 적용", ar: "تطبيق الخصم", hi: "छूट लागू करें", id: "Terapkan diskon", vi: "Áp dụng giảm giá",
  },
  effective: {
    en: "Effective total", zh: "实际总折扣", ja: "実質合計", es: "Total real", pt: "Total real",
    fr: "Total réel", de: "Tatsächlich gesamt", ru: "Фактический итог", it: "Totale effettivo",
    tr: "Gerçek toplam", ko: "실질 합계", ar: "الإجمالي الفعلي", hi: "वास्तविक कुल", id: "Total efektif", vi: "Tổng thực tế",
  },
  naiveSum: {
    en: "If you just add them", zh: "若直接相加", ja: "単純に足すと", es: "Si se suman", pt: "Se apenas somar",
    fr: "Si on les additionne", de: "Wenn man einfach addiert", ru: "Если просто сложить", it: "Se si sommano",
    tr: "Sadece toplanırsa", ko: "단순 합산하면", ar: "لو جُمعت مباشرة", hi: "यदि सीधे जोड़ें", id: "Jika dijumlah langsung", vi: "Nếu cộng thẳng",
  },
  tipAmount: {
    en: "Tip", zh: "小费", ja: "チップ", es: "Propina", pt: "Gorjeta",
    fr: "Pourboire", de: "Trinkgeld", ru: "Чаевые", it: "Mancia",
    tr: "Bahşiş", ko: "팁", ar: "الإكرامية", hi: "टिप", id: "Tip", vi: "Tiền tip",
  },
  grand: {
    en: "Bill + tip", zh: "账单 + 小费", ja: "会計 + チップ", es: "Cuenta + propina", pt: "Conta + gorjeta",
    fr: "Addition + pourboire", de: "Rechnung + Trinkgeld", ru: "Счёт + чаевые", it: "Conto + mancia",
    tr: "Hesap + bahşiş", ko: "계산서 + 팁", ar: "الفاتورة + الإكرامية", hi: "बिल + टिप", id: "Tagihan + tip", vi: "Hóa đơn + tip",
  },
  perHead: {
    en: "Per person", zh: "人均", ja: "一人あたり", es: "Por persona", pt: "Por pessoa",
    fr: "Par personne", de: "Pro Person", ru: "На человека", it: "Per persona",
    tr: "Kişi başı", ko: "1인당", ar: "لكل شخص", hi: "प्रति व्यक्ति", id: "Per orang", vi: "Mỗi người",
  },
  gcd: {
    en: "Greatest common divisor", zh: "最大公约数", ja: "最大公約数", es: "Máximo común divisor", pt: "Máximo divisor comum",
    fr: "Plus grand commun diviseur", de: "Größter gemeinsamer Teiler", ru: "Наибольший общий делитель", it: "Massimo comune divisore",
    tr: "En büyük ortak bölen", ko: "최대공약수", ar: "أكبر قاسم مشترك", hi: "महत्तम समापवर्तक", id: "Faktor persekutuan terbesar", vi: "Ước chung lớn nhất",
  },
  divide: {
    en: "Divide both sides", zh: "两边同除", ja: "両辺を割る", es: "Dividir ambos lados", pt: "Dividir ambos os lados",
    fr: "Diviser les deux côtés", de: "Beide Seiten teilen", ru: "Разделить обе части", it: "Dividi entrambi i lati",
    tr: "Her iki tarafı böl", ko: "양변을 나누기", ar: "قسمة الطرفين", hi: "दोनों पक्षों को भाग दें", id: "Bagi kedua sisi", vi: "Chia hai vế",
  },
  cross: {
    en: "Cross-multiply", zh: "交叉相乘", ja: "たすき掛け", es: "Multiplicar en cruz", pt: "Multiplicar em cruz",
    fr: "Produit en croix", de: "Über-Kreuz multiplizieren", ru: "Перекрёстное умножение", it: "Moltiplicazione incrociata",
    tr: "Çapraz çarpım", ko: "교차 곱셈", ar: "الضرب التبادلي", hi: "क्रॉस गुणा", id: "Kali silang", vi: "Nhân chéo",
  },
  solve: {
    en: "Solve", zh: "求解", ja: "解く", es: "Despejar", pt: "Isolar",
    fr: "Résoudre", de: "Auflösen", ru: "Решить", it: "Risolvi",
    tr: "Çöz", ko: "풀기", ar: "إيجاد الحل", hi: "हल करें", id: "Selesaikan", vi: "Giải",
  },
  aspect: {
    en: "Scale the other side", zh: "推另一边", ja: "もう片方を算出", es: "Calcular el otro lado", pt: "Calcular o outro lado",
    fr: "Déduire l'autre côté", de: "Andere Seite berechnen", ru: "Найти другую сторону", it: "Calcola l'altro lato",
    tr: "Diğer tarafı hesapla", ko: "다른 변 계산", ar: "إيجاد الضلع الآخر", hi: "दूसरा पक्ष निकालें", id: "Hitung sisi lain", vi: "Tính cạnh còn lại",
  },
};

/** worked steps 区块:每行 = localized 标签 + 中性数学等式。 */
export function Steps({
  steps,
  title,
  locale,
}: {
  steps: Step[];
  title: string;
  locale: Locale;
}) {
  return (
    <div className="mt-5 rounded-xl border hairline px-4 py-3.5">
      <div className="text-[13px] font-medium text-[var(--color-sub)]">{title}</div>
      <ol className="mt-2 space-y-1.5">
        {steps.map((s, i) => (
          <li key={i} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13.5px]">
            <span className="text-[12px] text-[var(--color-sub)]">{STEP_LABELS[s.key][locale] ?? STEP_LABELS[s.key].en}</span>
            <code className="mono">{s.math}</code>
          </li>
        ))}
      </ol>
    </div>
  );
}
