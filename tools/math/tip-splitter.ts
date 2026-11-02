import { defineTool } from "../_lib/types";
import { TipSplitterEngine } from "../_engines/engine-tip-splitter";

export default defineTool({
  slug: "tip-splitter",
  category: "utility",
  icon: "shuffle",
  engine: { component: TipSplitterEngine },
  related: ["percentage-calculator", "stacked-discount", "reverse-percentage", "ratio-calculator"],
  copy: {
    en: {
      name: "Tip Split Calculator",
      tagline:
        "Split a restaurant bill with tip fairly among any number of people — presets for 10–20%, rounding to the cent per person or on the whole bill, and a clear line for what each person actually owes.",
      intro: [
        "The end of a group meal is where arithmetic fails: one bill, a tip percentage everyone half-agrees on, and five people holding cards. This calculator takes the bill, a tip rate (with quick presets for 10, 15, 18 and 20 percent) and the number of ways to split, then does the part nobody enjoys — including the rounding that decides whether the table overpays by cents or comes up short at the register.",
        "Three rounding conventions cover every real situation. Per-person rounding nudges each share to a payable amount, which is what most tables want; whole-bill rounding rounds the grand total once and divides from there; no rounding leaves the exact decimals for payment apps that split to the cent. The result grid shows the nominal tip and total next to what is actually collected, so the few cents the rounding added never come as a surprise.",
      ],
      steps: [
        "Enter the bill amount before tip.",
        "Pick a tip preset or type your own percentage — the presets cover the usual 10–20% etiquette range.",
        "Set how many people are splitting; one person works too if you just want the tip added up.",
        "Choose a rounding style and read who owes what — the effective-tip line shows what the table really leaves.",
      ],
      faqs: [
        {
          q: "How is the tip per person computed?",
          a: "The tip is bill × percent ÷ 100, the grand total is bill + tip, and each person's share is the total divided by the number of people. With 85.50 at 15% split three ways: tip 12.83, total 98.33, about 32.78 each before any rounding choice.",
        },
        {
          q: "Why does per-person rounding change the tip?",
          a: "Each share is rounded to a payable amount first, so the table total is the rounded share times the number of people — 32.775 becomes 32.78 and three people leave 98.34 instead of 98.325. The extra pennies are extra tip, and the effective-tip line states exactly how much landed.",
        },
        {
          q: "Should I tip on tax?",
          a: "That is a custom question, not a math one — the calculator computes on whatever bill amount you enter. If you tip on the pre-tax amount, enter that number; if your local custom tips on the total, enter the total. The formulas are identical either way.",
        },
        {
          q: "Can one person pay for two?",
          a: "Splitting is just division: set the number of people to the number of shares, not the number of humans. Seven people where one covers two is still 7 shares — or run it once with 6 and add the extra share manually if the couple prefers a single card.",
        },
      ],
    },
    zh: {
      name: "小费分摊计算器",
      tagline: "聚餐账单加小费按人头公平分摊:10–20% 一键预设,支持人均到分、整单到分与不舍入三种口径,谁付多少一目了然。",
      intro: [
        "聚餐收尾最考验算术:一张账单、一个半推半就的小费比例、五张等着刷的卡。本计算器输入账单、小费比例(10%、15%、18%、20% 一键预设)和分摊人数,替你做没人愿意做的那部分——包括决定全桌是多吃几毛还是收银台差钱的舍入。",
        "三种舍入口径覆盖所有真实场景。按人均舍入把每份凑成可支付的金额,是大多数饭桌的选择;按整单舍入先凑整总额再除;不舍入则保留精确小数,交给能分到分的支付应用。结果区把名义小费、名义总额与实际收上来的数字并排显示,舍入多出来的几分钱绝不会吓你一跳。",
      ],
      steps: [
        "输入未含小费的账单金额。",
        "选择小费预设或自行输入比例——预设覆盖常见的 10–20% 礼仪区间。",
        "设置分摊人数;只想算小费总额时填 1 也行。",
        "选择舍入方式,查看每人应付——“实际小费”一行显示全桌真正留下的金额。",
      ],
      faqs: [
        {
          q: "人均小费是怎么算的?",
          a: "小费 = 账单 × 比例 ÷ 100,含小费总额 = 账单 + 小费,人均 = 总额 ÷ 人数。85.50 按 15% 三人分摊:小费 12.83,总额 98.33,舍入前人均约 32.78。",
        },
        {
          q: "为什么按人均舍入会改变小费?",
          a: "先把每份舍入成可支付的金额,全桌总额 = 舍入后人均 × 人数——32.775 变成 32.78,三人共付 98.34 而不是 98.325。多出的几分钱就是多给的小费,“实际小费”一行会写清楚到底落了多少。",
        },
        {
          q: "要按含税金额给小费吗?",
          a: "这是习俗问题,不是数学问题——计算器只对你输入的金额负责。按税前给就填税前金额,当地习惯按总额给就填总额。两种情况下公式完全一样。",
        },
        {
          q: "一个人能替两个人付吗?",
          a: "分摊本质是除法:把人数设成“份数”而不是“人头”。七个人里一人包两份,仍按 7 份算——或者按 6 人算一次,想让情侣一起刷卡时手动补上那一份。",
        },
      ],
    },
    ja: {
      name: "チップ割り勘計算",
      tagline: "レストランの会計にチップを足して人数で公平に分割:10–20% のプリセット、一人あたり・会計全体・丸めなしの 3 方式に対応します。",
      intro: [
        "会食の締めで算数が破綻します:請求書 1 枚、曖昧に同意したチップ率、カードを出す 5 人。この計算機は会計額・チップ率(10・15・18・20% のクイックプリセット付き)・割る人数を受け取り、誰もやりたがらない部分を代行します——テーブルが数セント余分に払うか、レジで足りなくなるかを決める丸めも含めて。",
        "3 つの丸め方式が実情をすべてカバーします。一人あたりの丸めは支払える金額に各取り分を寄せます(多くのテーブルの選択)。会計全体の丸めは合計を一度だけ四捨五入してから割ります。丸めなしはセント単位で分割する決済アプリ向けに正確な小数を残します。結果グリッドは名目のチップと合計の隣に実際に集まる額を並べるので、丸めで増えた数セントに驚くことはありません。",
      ],
      steps: [
        "チップ前の会計額を入力します。",
        "チップのプリセットを選ぶか、自分の率を入力します。プリセットは一般的な 10–20% を押さえています。",
        "割る人数を設定します。チップの合計だけ知りたいなら 1 人でも構いません。",
        "丸め方式を選び、各自の支払額を読みます。「実チップ」行がテーブルが本当に残す額です。",
      ],
      faqs: [
        {
          q: "一人あたりのチップはどう計算しますか?",
          a: "チップ = 会計 × 率 ÷ 100、合計 = 会計 + チップ、一人あたり = 合計 ÷ 人数です。85.50 を 15% で 3 人に分けると:チップ 12.83、合計 98.33、丸め前は一人約 32.78。",
        },
        {
          q: "一人あたりの丸めでチップが変わるのはなぜですか?",
          a: "先に各取り分を支払可能額に丸めるため、テーブル合計は丸めた取り分 × 人数になります。32.775 は 32.78 となり、3 人で 98.325 ではなく 98.34 を残します。増えた数ペニーは追加のチップで、「実チップ」行が正確な着地額を示します。",
        },
        {
          q: "税込みにチップを乗せるべきですか?",
          a: "それは慣習の問題であり数学の問題ではありません——計算機は入力された金額に対してのみ計算します。税抜に乗せるなら税抜額を、地域の慣習が合計に乗せるなら合計を入力してください。どちらでも式は同じです。",
        },
        {
          q: "一人が二人分を払えますか?",
          a: "割り勘は単純な除法です。人数は「人数」ではなく「取り分の数」に設定します。7 人のうち 1 人が 2 人分を払うなら 7 取り分のまま——または 6 人で計算して、カップルが 1 枚で払うならその 1 取り分を手動で足します。",
        },
      ],
    },
    es: {
      name: "Calculadora para dividir la propina",
      tagline:
        "Divida la cuenta del restaurante con propina entre cuantas personas haga falta — con presets del 10 al 20%, redondeo al céntimo por persona o de toda la cuenta, y una línea clara de lo que debe cada uno.",
      intro: [
        "El final de una comida en grupo es donde fracasa la aritmética: una cuenta, un porcentaje de propina que todos aceptan a medias y cinco personas con la tarjeta en la mano. Esta calculadora toma la cuenta, una tasa de propina (con presets rápidos del 10, 15, 18 y 20 por ciento) y el número de partes, y hace la parte que nadie disfruta — incluido el redondeo que decide si la mesa paga unos céntimos de más o llega corta a la caja.",
        "Tres convenciones de redondeo cubren cada situación real. El redondeo por persona ajusta cada parte a un importe pagable, que es lo que quieren la mayoría de las mesas; el de la cuenta completa redondea el total una vez y divide desde ahí; sin redondeo deja los decimales exactos para las apps de pago que parten al céntimo. La rejilla muestra la propina y el total nominales junto a lo que realmente se recauda, para que los céntimos del redondeo nunca sorprendan.",
      ],
      steps: [
        "Introduzca la cuenta antes de la propina.",
        "Elija un preset de propina o escriba su propio porcentaje — los presets cubren el rango habitual del 10 al 20%.",
        "Fije entre cuántas personas se reparte; con una sola sirve si solo quiere la propina añadida.",
        "Elija el estilo de redondeo y lea quién debe qué — la línea de propina efectiva muestra lo que la mesa deja de verdad.",
      ],
      faqs: [
        {
          q: "¿Cómo se calcula la propina por persona?",
          a: "La propina es cuenta × porcentaje ÷ 100, el total es cuenta + propina, y la parte de cada uno es el total dividido por las personas. Con 85,50 al 15% entre tres: propina 12,83, total 98,33 y unos 32,78 por cabeza antes de redondear.",
        },
        {
          q: "¿Por qué el redondeo por persona cambia la propina?",
          a: "Cada parte se redondea primero a un importe pagable, así que el total de la mesa es la parte redondeada por el número de personas — 32,775 se convierte en 32,78 y tres personas dejan 98,34 en vez de 98,325. Los céntimos extra son propina extra, y la línea de propina efectiva dice exactamente cuánto cayó.",
        },
        {
          q: "¿Dejo propina sobre los impuestos?",
          a: "Es una cuestión de costumbre, no de matemáticas — la calculadora opera sobre el importe que usted introduzca. Si da propina sobre el importe sin impuestos, introduzca ese número; si su costumbre local es sobre el total, el total. Las fórmulas son idénticas en ambos casos.",
        },
        {
          q: "¿Puede una persona pagar por dos?",
          a: "Repartir es solo dividir: ponga como número de personas el número de partes, no el de humanos. Siete comensales donde uno cubre a dos siguen siendo 7 partes — o calcule con 6 y sume esa parte a mano si la pareja prefiere una sola tarjeta.",
        },
      ],
    },
    pt: {
      name: "Calculadora de gorjeta dividida",
      tagline:
        "Divida a conta do restaurante com gorjeta entre quantas pessoas precisar — presets de 10 a 20%, arredondamento ao centavo por pessoa ou na conta inteira, e uma linha clara do que cada um deve.",
      intro: [
        "O fim de uma refeição em grupo é onde a aritmética falha: uma conta, um percentual de gorjeta que todos aceitam pela metade e cinco pessoas segurando cartões. Esta calculadora recebe a conta, uma taxa de gorjeta (com presets rápidos de 10, 15, 18 e 20 por cento) e o número de partes, e faz a parte que ninguém gosta — incluindo o arredondamento que decide se a mesa paga centavos a mais ou chega curta no caixa.",
        "Três convenções de arredondamento cobrem toda situação real. O por-pessoa ajusta cada parte a um valor pagável, o que a maioria das mesas quer; o da conta inteira arredonda o total uma vez e divide a partir daí; o sem arredondamento deixa os decimais exatos para apps de pagamento que dividem ao centavo. A grade mostra a gorjeta e o totais nominais ao lado do que realmente é arrecadado, para os centavos do arredondamento nunca surpreenderem.",
      ],
      steps: [
        "Digite o valor da conta antes da gorjeta.",
        "Escolha um preset de gorjeta ou digite o seu percentual — os presets cobrem a faixa usual de 10 a 20%.",
        "Defina entre quantas pessoas a conta é dividida; uma pessoa serve se você só quer somar a gorjeta.",
        "Escolha o estilo de arredondamento e leia quem deve o quê — a linha de gorjeta efetiva mostra o que a mesa realmente deixa.",
      ],
      faqs: [
        {
          q: "Como a gorjeta por pessoa é calculada?",
          a: "A gorjeta é conta × percentual ÷ 100, o total é conta + gorjeta, e a parte de cada um é o total dividido pelo número de pessoas. Com 85,50 a 15% dividido por três: gorjeta 12,83, total 98,33 e cerca de 32,78 por cabeça antes do arredondamento.",
        },
        {
          q: "Por que o arredondamento por pessoa muda a gorjeta?",
          a: "Cada parte é arredondada primeiro a um valor pagável, então o total da mesa é a parte arredondada vezes o número de pessoas — 32,775 vira 32,78 e três pessoas deixam 98,34 em vez de 98,325. Os centavos extras são gorjeta extra, e a linha de gorjeta efetiva diz exatamente quanto caiu.",
        },
        {
          q: "Devo dar gorjeta sobre o imposto?",
          a: "Essa é uma questão de costume, não de matemática — a calculadora opera sobre o valor que você digitar. Se a gorjeta é sobre o valor sem imposto, digite esse número; se o costume local é sobre o total, o total. As fórmulas são idênticas nos dois casos.",
        },
        {
          q: "Uma pessoa pode pagar por duas?",
          a: "Dividir é só dividir: defina o número de pessoas como o número de partes, não de humanos. Sete pessoas onde uma cobre duas continuam sendo 7 partes — ou calcule com 6 e some a parte extra à mão se o casal prefere um único cartão.",
        },
      ],
    },
  },
});
