import type { CategoryId, Locale } from "@/lib/site";
import type { ToolCopy } from "./types";

/**
 * 类目 FAQ 池:工具页 FAQ 不足 6 条时按类目补齐(JSON-LD 同源走 toolCopy)。
 * 内容写"这个类目共同的真问题"(隐私/收费/格式/精度/浏览器支持),不是凑数占位。
 * 只写核心 5 语(en/zh/ja/es/pt);其他 locale toolCopy 本来就走 overlay 或回退 en。
 */
type Faq = { q: string; a: string };

const GLOBAL: Partial<Record<Locale, Faq[]>> = {
  en: [
    { q: "Do I need an account to use Calculimo?", a: "No — Calculimo is free with no signup. Every calculation about percentage and discount math runs right in your browser and nothing about you is stored." },
    { q: "How are the results calculated?", a: "All Calculimo tools apply the standard formulas shown on each page to the numbers you type. Nothing comes from a cached database, so the result is exactly as current as your inputs." },
    { q: "Does Calculimo keep my financial data?", a: "No. percentage and discount math math happens locally in JavaScript and is never transmitted — close the tab and it is gone." },
  ],
  zh: [
    { q: "使用Calculimo需要注册吗?", a: "不需要 — Calculimo完全免费、无需注册。所有关于百分比与折扣的计算都在浏览器内完成,不会存储你的任何信息。" },
    { q: "计算结果是怎么来的?", a: "Calculimo的每个工具都把页面上给出的标准公式应用到你输入的数字上,不读取任何缓存数据库,结果只取决于你的输入。" },
    { q: "我的财务数据会被保存吗?", a: "不会。百分比与折扣计算全部在本地 JavaScript 中进行,数据不会发出——关掉页面即消失。" },
  ],
  ja: [
    { q: "Calculimoの利用にアカウントは必要ですか?", a: "不要です。Calculimoは登録不要で完全無料。percentage and discount mathに関する計算はすべてブラウザ内で実行され、入力情報は保存されません。" },
    { q: "計算結果はどう算出されますか?", a: "各ページに明示された標準的な計算式を、入力した数値にそのまま適用しています。キャッシュされたデータベースには依存せず、結果は入力値のみで決まります。" },
    { q: "入力した金額データは保存されますか?", a: "保存されません。percentage and discount mathの計算はローカルの JavaScript で行われ、送信も保存もありません。タブを閉じれば消えます。" },
  ],
  es: [
    { q: "¿Necesito una cuenta para usar Calculimo?", a: "No — Calculimo es gratis y sin registro. Todos los cálculos sobre percentage and discount math se ejecutan en tu navegador y no se guarda nada sobre ti." },
    { q: "¿Cómo se calculan los resultados?", a: "Las herramientas de Calculimo aplican las fórmulas estándar de cada página a los números que introduces. Nada proviene de una base de datos cacheada: el resultado depende solo de tus datos." },
    { q: "¿Se guardan mis datos financieros?", a: "No. El cálculo de percentage and discount math ocurre localmente en JavaScript y nunca se transmite — cierra la pestaña y desaparece." },
  ],
  pt: [
    { q: "Preciso de uma conta para usar o Calculimo?", a: "Não — o Calculimo é gratuito e sem cadastro. Todos os cálculos sobre percentage and discount math rodam no seu navegador e nada sobre você é armazenado." },
    { q: "Como os resultados são calculados?", a: "As ferramentas do Calculimo aplicam as fórmulas padrão de cada página aos números que você digita. Nada vem de um banco de dados em cache — o resultado depende só das suas entradas." },
    { q: "Meus dados financeiros ficam salvos?", a: "Não. O cálculo de percentage and discount math acontece localmente em JavaScript e nunca é transmitido — feche a aba e tudo desaparece." },
  ],
};

const BY_CATEGORY: Partial<Record<CategoryId, Partial<Record<Locale, Faq[]>>>> = {

};

/** 取某类目的补充 FAQ 池(global 池 + 类目池,en 缺省回退) */
export function categoryFaqPool(category: CategoryId, locale: Locale): Faq[] {
  const extra = BY_CATEGORY[category]?.[locale] ?? BY_CATEGORY[category]?.en ?? [];
  const global = GLOBAL[locale] ?? GLOBAL.en ?? [];
  return [...extra, ...global];
}
