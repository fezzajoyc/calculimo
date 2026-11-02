import { defineTool } from "../_lib/types";
import { StackDiscountEngine } from "../_engines/engine-stack-discount";

export default defineTool({
  slug: "stacked-discount",
  category: "utility",
  icon: "layers",
  engine: { component: StackDiscountEngine },
  related: ["percentage-calculator", "reverse-percentage", "tip-splitter", "ratio-calculator"],
  copy: {
    en: {
      name: "Stacked Discount Calculator",
      tagline:
        "Apply up to five discounts one after another and see the real total — 20% + 10% comes out 28% off, not 30% — with the sequential price after each layer and the gap versus the naive sum.",
      intro: [
        "Store signs say “extra 10% off already-reduced items”, checkout coupons stack on member prices, and almost everyone adds the percentages in their head. The truth is that each percentage bites into what is left, not into the original price: 20% off 100 leaves 80, and the extra 10% comes off 80, saving only 8 more. Two discounts of 20% and 10% are a single 28% reduction — and on a 100-dollar cart that difference is real money.",
        "This calculator applies up to five discounts strictly in order, shows the price after each layer, and puts the true effective percentage next to the naive sum so the gap is impossible to miss. It also tells you the money version: how much you actually save, how much the added-up illusion promised, and the exact amount between them. Negative rates work too, in case a “discount” is really a surcharge.",
      ],
      steps: [
        "Type the original price.",
        "Enter each discount in the order the checkout applies them — add rows up to five, remove the ones you don't need.",
        "Compare the effective total with the naive sum; both appear side by side in the results grid.",
        "Read the worked steps to see the price shrink layer by layer, each line a verifiable multiplication.",
      ],
      faqs: [
        {
          q: "Why is 20% + 10% not 30%?",
          a: "Because the second percentage applies to the reduced price, not the original. On 100: 20% off leaves 80; then 10% off 80 leaves 72. Total reduction 28. The naive sum 30 would only be true if both percentages took their cut of the original 100, which is not how sequential discounts work.",
        },
        {
          q: "Does the order of the discounts matter?",
          a: "No — multiplication commutes. 100 × 0.8 × 0.9 = 100 × 0.9 × 0.8 = 72, so applying 20% then 10% costs exactly the same as 10% then 20%. Order matters only when a coupon has a floor, a cap or a fixed amount, which this proportional model does not model.",
        },
        {
          q: "How do I convert a stack into one equivalent discount?",
          a: "Multiply the keep-rates together and subtract from 100%: (1 − 0.20) × (1 − 0.10) = 0.72, so the stack equals 28% off. The effective-discount figure in the results is exactly this single-number equivalent.",
        },
        {
          q: "What does the “naive” line mean?",
          a: "It is what the percentages would save if you could simply add them: on 100, a 30% illusion leaves 70, while the real stack leaves 72 — two more than the illusion promised. The delta line shows that gap in money for your own cart.",
        },
      ],
    },
    zh: {
      name: "折扣叠加计算器",
      tagline: "最多五层折扣逐层结算:20% + 10% 实际是 28% 而非 30%,给出每一层折后价、真实总折扣与“直加错觉”的差额。",
      intro: [
        "店招写着“折上再减 10%”,结账时优惠券叠在会员价上,而几乎所有人都在脑子里把百分比直接相加。真相是:每一层百分比都咬在“剩下的钱”上,而不是原价上——100 打 8 折剩 80,再来的 10% 只从 80 里省 8。20% 和 10% 两层折扣等于一次 28% 的削减;在 100 元的购物车里,这个差价是真金白银。",
        "本计算器把最多五层折扣严格按顺序结算,展示每层之后的价格,并把真实总折扣与直加错觉并排放,差距一目了然。它还给出钱的版本:你实际省了多少、“直加”承诺了多少、两者之间差多少。负费率也支持——万一那个“折扣”其实是加价。",
      ],
      steps: [
        "输入原价。",
        "按结账顺序输入每层折扣——最多加到五行,不需要的行可删除。",
        "对比实际总折扣与直加之和:两者并排出现在结果区。",
        "查看计算步骤,看价格一层层变小,每一行都是可手工复核的乘法。",
      ],
      faqs: [
        {
          q: "为什么 20% + 10% 不等于 30%?",
          a: "因为第二个百分比作用在折后价上,不是原价。以 100 为例:先减 20% 剩 80;再对 80 减 10% 剩 72。总共削减 28%。只有当两个百分比都从原价 100 里各取一份时,直加 30% 才成立——而顺序折扣不是这么运作的。",
        },
        {
          q: "折扣顺序有影响吗?",
          a: "没有——乘法可交换。100 × 0.8 × 0.9 = 100 × 0.9 × 0.8 = 72,先 20% 后 10% 与先 10% 后 20% 花费完全一样。只有当优惠券有保底、封顶或固定金额时顺序才重要,那种情况不属于本工具建模的比例折扣。",
        },
        {
          q: "怎么把多层折扣换算成一个等效折扣?",
          a: "把保留率相乘再用 100% 减:(1 − 0.20) × (1 − 0.10) = 0.72,所以叠加等于打 72 折,即减 28%。结果里的“实际总折扣”正是这个单一等效数字。",
        },
        {
          q: "“直加错觉”一行是什么意思?",
          a: "它是百分比可以简单相加时的错觉价:100 的 30% 错觉剩 70,而真实叠加剩 72——比错觉多付 2。“多付”一行用你自己的购物车金额把这个差距显示出来。",
        },
      ],
    },
    ja: {
      name: "重ね割引計算",
      tagline: "最大 5 つの割引を順に適用して実額を表示:20% + 10% は 30% ではなく 28%。各段階の価格と単純合計との差も見せます。",
      intro: [
        "店頭の看板は「さらに 10% 引」、レジではクーポンが会員価格に重なる——そしてほとんどの人が頭の中でパーセントを足し算します。実際は各パーセントが「残り」に効くのであって元の価格には効きません。100 から 20% 引くと 80、次の 10% は 80 からしか減らず、節約は 8。20% と 10% の 2 枚は実質 28% の値引きであり、100 円の買い物ならその差は現金です。",
        "この計算機は最大 5 つの割引を厳密に順に適用し、各段階後の価格を示し、実質割引率を単純合計の隣に並べて差を見えなくしません。金額版も出します:実際の節約額、足し算が約束した額、そして両者の差。負の率にも対応します——その「割引」が実は割り増しなら。",
      ],
      steps: [
        "元の価格を入力します。",
        "レジが適用する順に各割引を入力します。行は 5 まで追加でき、不要な行は削除できます。",
        "実質合計と単純合計を比較します。両者が結果グリッドに並んで表示されます。",
        "計算過程で価格が一層ずつ縮む様子を読みます。各行は検証可能な掛け算です。",
      ],
      faqs: [
        {
          q: "20% + 10% が 30% にならないのはなぜですか?",
          a: "2 つ目のパーセントは値引き後の価格に効くからです。100 から 20% 引くと 80。次に 80 の 10% を引くと 72。合計の値引きは 28 です。単純合計の 30 は、両方のパーセントが元の 100 から取るときだけ成立しますが、順次割引はそう働きません。",
        },
        {
          q: "割引の順番は結果に影響しますか?",
          a: "いいえ。掛け算は順序に影響されません。100 × 0.8 × 0.9 = 100 × 0.9 × 0.8 = 72 で、20% → 10% でも 10% → 20% でも同じです。順序が問題になるのは、下限・上限・固定額のあるクーポンだけで、この比例モデルの対象外です。",
        },
        {
          q: "複数の割引を 1 つの割引率にまとめるには?",
          a: "残りの率を掛けて 100% から引きます:(1 − 0.20) × (1 − 0.10) = 0.72。つまり重ね割引は 28% 引きと同じです。結果の「実質割引率」がこの 1 つの数字そのものです。",
        },
        {
          q: "「単純合計」の行は何を意味しますか?",
          a: "パーセントを単純に足せるなら、という幻の価格です。100 なら 30% の幻想は 70 を残しますが、実際の重ね割引は 72——幻より 2 多く払います。「差」の行がその差をあなたの買い物かごの金額で示します。",
        },
      ],
    },
    es: {
      name: "Calculadora de descuentos acumulados",
      tagline:
        "Aplica hasta cinco descuentos uno tras otro y ve el total real — 20% + 10% es un 28%, no un 30% — con el precio tras cada capa y la diferencia frente a la suma ingenua.",
      intro: [
        "Los carteles dicen “10% extra sobre lo ya rebajado”, en la caja los cupones se apilan sobre el precio de socio, y casi todo el mundo suma los porcentajes de cabeza. La verdad es que cada porcentaje muerde lo que queda, no el precio original: el 20% sobre 100 deja 80, y el 10% extra se quita de 80, ahorrando solo 8 más. Dos descuentos del 20% y el 10% son una sola rebaja del 28% — y en un carrito de 100 esa diferencia es dinero real.",
        "Esta calculadora aplica hasta cinco descuentos estrictamente en orden, muestra el precio tras cada capa y coloca el porcentaje real junto a la suma ingenua para que la brecha sea imposible de ignorar. También da la versión en dinero: cuánto ahorras de verdad, cuánto prometía la suma ilusoria y la cantidad exacta entre ambas. Las tasas negativas también valen, por si el “descuento” es en realidad un recargo.",
      ],
      steps: [
        "Escriba el precio original.",
        "Introduzca cada descuento en el orden en que la caja los aplica — añada filas hasta cinco y quite las que sobren.",
        "Compare el total real con la suma ingenua; ambos aparecen lado a lado en la rejilla de resultados.",
        "Lea los pasos para ver el precio encoger capa a capa, cada línea una multiplicación verificable.",
      ],
      faqs: [
        {
          q: "¿Por qué 20% + 10% no es 30%?",
          a: "Porque el segundo porcentaje se aplica sobre el precio rebajado, no sobre el original. Sobre 100: quitar 20% deja 80; luego quitar 10% de 80 deja 72. Reducción total: 28. La suma ingenua 30 solo sería cierta si ambos porcentajes recortaran del 100 original, y los descuentos secuenciales no funcionan así.",
        },
        {
          q: "¿Importa el orden de los descuentos?",
          a: "No — la multiplicación conmuta. 100 × 0.8 × 0.9 = 100 × 0.9 × 0.8 = 72, así que 20% y luego 10% cuesta exactamente lo mismo que 10% y luego 20%. El orden importa solo si un cupón tiene suelo, tope o importe fijo, algo que este modelo proporcional no contempla.",
        },
        {
          q: "¿Cómo convierto una pila en un descuento equivalente?",
          a: "Multiplica las tasas de lo que se conserva y réstalo de 100%: (1 − 0.20) × (1 − 0.10) = 0.72, o sea que la pila equivale a un 28% de descuento. La cifra de descuento real de los resultados es exactamente ese número único.",
        },
        {
          q: "¿Qué significa la línea “ingenua”?",
          a: "Es lo que ahorrarían los porcentajes si se pudieran sumar sin más: sobre 100, la ilusión del 30% deja 70, mientras que la pila real deja 72 — dos más de lo prometido. La línea de diferencia muestra ese hueco en dinero para tu propio carrito.",
        },
      ],
    },
    pt: {
      name: "Calculadora de descontos acumulados",
      tagline:
        "Aplique até cinco descontos em sequência e veja o total real — 20% + 10% dá 28%, não 30% — com o preço após cada camada e a diferença frente à soma ingênua.",
      intro: [
        "As plaças dizem “mais 10% sobre o já reduzido”, no caixa os cupons se empilham sobre o preço de sócio, e quase todo mundo soma os percentuais de cabeça. A verdade é que cada porcentagem morde o que sobra, não o preço original: 20% em 100 deixa 80, e os 10% extras incidem sobre 80, poupando só 8 a mais. Dois descontos de 20% e 10% são uma única redução de 28% — e num carrinho de 100 essa diferença é dinheiro de verdade.",
        "Esta calculadora aplica até cinco descontos estritamente em ordem, mostra o preço após cada camada e põe o percentual real ao lado da soma ingênua para que a diferença seja impossível de ignorar. Também entrega a versão em dinheiro: quanto você economiza de verdade, quanto a soma ilusória prometia e o valor exato entre elas. Taxas negativas também funcionam, caso o “desconto” seja na verdade uma taxa extra.",
      ],
      steps: [
        "Digite o preço original.",
        "Informe cada desconto na ordem em que o caixa aplica — adicione linhas até cinco e remova as que sobrarem.",
        "Compare o total real com a soma ingênua; ambos aparecem lado a lado na grade de resultados.",
        "Leia os passos para ver o preço encolher camada por camada, cada linha uma multiplicação verificável.",
      ],
      faqs: [
        {
          q: "Por que 20% + 10% não é 30%?",
          a: "Porque o segundo percentual incide sobre o preço reduzido, não sobre o original. Em 100: tirar 20% deixa 80; depois tirar 10% de 80 deixa 72. Redução total: 28. A soma ingênua 30 só seria verdade se os dois percentuais recortassem do 100 original, e descontos sequenciais não funcionam assim.",
        },
        {
          q: "A ordem dos descontos importa?",
          a: "Não — a multiplicação comuta. 100 × 0.8 × 0.9 = 100 × 0.9 × 0.8 = 72, então 20% e depois 10% custa exatamente o mesmo que 10% e depois 20%. A ordem importa só quando um cupom tem piso, teto ou valor fixo, o que este modelo proporcional não cobre.",
        },
        {
          q: "Como transformo uma pilha em um desconto equivalente?",
          a: "Multiplique as taxas de conservação e subtraia de 100%: (1 − 0.20) × (1 − 0.10) = 0.72, ou seja, a pilha equivale a 28% de desconto. O número de desconto real nos resultados é exatamente esse equivalente único.",
        },
        {
          q: "O que significa a linha “ingênua”?",
          a: "É o que os percentuais poupariam se pudéssemos simplesmente somá-los: em 100, a ilusão de 30% deixa 70, enquanto a pilha real deixa 72 — dois a mais que a promessa. A linha de diferença mostra essa lacuna em dinheiro para o seu carrinho.",
        },
      ],
    },
  },
});
