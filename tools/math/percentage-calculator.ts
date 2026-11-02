import { defineTool } from "../_lib/types";
import { PercentageEngine } from "../_engines/engine-percentage";

export default defineTool({
  slug: "percentage-calculator",
  category: "utility",
  icon: "calc",
  featured: true,
  engine: { component: PercentageEngine },
  related: ["reverse-percentage", "stacked-discount", "tip-splitter", "ratio-calculator"],
  copy: {
    en: {
      name: "Percentage Calculator",
      tagline:
        "Every percentage question in one place — X% of Y, what percent X is of Y, change between two values, and adding or removing a percent, each with the formula and worked steps shown.",
      intro: [
        "Percentages trip people up because the same three numbers hide five different questions. “What is 15% of 80”, “12 is what percent of 80”, “what happened between 80 and 100”, “add 15% to 80” and “take 15% off 80” all sound alike, yet each has its own formula — and mixing them up is how receipts, grades and discounts go wrong. This calculator keeps all five modes in one tabbed tool, states the formula for the mode you picked, and shows every intermediate step with the numbers already substituted.",
        "The math is honest, not cosmetic. Percent change divides by the starting value, so going from 80 to 100 is a 25% rise while 100 back to 80 is only a 20% fall — the asymmetry everyone forgets. Division by zero is flagged instead of guessed, results keep full precision until the final display, and every step line is a true equation you can check by hand.",
      ],
      steps: [
        "Pick the mode that matches your question — of, what-percent, change, add or subtract.",
        "Type the two numbers into the labeled fields; the labels change with the mode so you always know which value goes where.",
        "Read the highlighted result, then check the formula line and the worked steps below it to see exactly how the answer was built.",
        "Switch tabs to re-ask the same numbers a different way — handy for checking a store discount against a price tag.",
      ],
      faqs: [
        {
          q: "Why did my percent change come out as +25% one way and −20% the other?",
          a: "Percent change always divides by the starting value. Going from 80 to 100 is 20 ÷ 80 = +25%; going from 100 back to 80 is −20 ÷ 100 = −20%. The same gap of 20 is a bigger fraction of the smaller base, so up and down are never symmetric.",
        },
        {
          q: "How do I add 15% to a price and then remove it again?",
          a: "Adding uses multiplication: 80 × 1.15 = 92. Removing that increase means dividing by 1.15, not subtracting 15%: 92 × 0.85 = 78.2, which is less than the 80 you started with. To get back exactly, use the reverse-percentage tool, which divides by the change factor.",
        },
        {
          q: "What happens when I enter zero or negative numbers?",
          a: "Zero as a whole in “X is what % of Y” is refused, because dividing by zero has no answer. Zero as a base for percent change is also refused. Negative numbers are computed honestly with the standard formulas — for example 15% of −80 is −12 — and the steps show the signed arithmetic.",
        },
        {
          q: "Are the results rounded?",
          a: "Only for display, and only at the very end. The math keeps full floating-point precision while it works, and each step line shows a value rounded to at most ten decimals with trailing zeros stripped, so what you see is a clean but faithful version of the true equation.",
        },
      ],
    },
    zh: {
      name: "百分比计算器",
      tagline: "五问一屏:X% 乘 Y、X 占 Y 几成、两值变化率、增减百分点——每个模式都给出公式与逐行代入的步骤。",
      intro: [
        "百分比容易出错,是因为同样的三个数字藏着五个不同的问题:“15% 的 80 是多少”“12 占 80 的百分之几”“从 80 到 100 变化了多少”“80 加 15% 是多少”“80 打 85 折是多少”——听起来差不多,公式却各不相同,混用正是小票、成绩和折扣算错的原因。本工具把五种模式放进一个标签页,先声明你所选模式的公式,再逐行展示数字已代入的计算步骤。",
        "数学是诚实的,不是装饰。变化率除以起始值:80 → 100 是 +25%,100 → 80 只有 −20%——这种不对称最常被忘记。除以零会被明确指出而不是硬猜;结果在最终显示前一直保留全精度;每一行步骤都是可以手算复核的真实等式。",
      ],
      steps: [
        "选择与问题匹配的模式:乘、占比、变化率、增加或减少。",
        "在带标签的输入框里填两个数——标签随模式变化,你始终知道哪个数放哪里。",
        "读取高亮结果,再看公式行和下方的计算步骤,确认答案是怎么一步步得出的。",
        "切换标签页,用同一组数字换一种问法——核对商店折扣和价签时特别方便。",
      ],
      faqs: [
        {
          q: "为什么变化率一个方向是 +25%,反方向只有 −20%?",
          a: "变化率永远除以起始值。80 → 100 是 20 ÷ 80 = +25%;100 → 80 是 −20 ÷ 100 = −20%。同样的 20 差值,对较小的基数是更大的比例,所以涨跌从来不对称。",
        },
        {
          q: "怎么把一个价格先加 15% 再去掉?",
          a: "加法用乘:80 × 1.15 = 92。撤销这次上涨要除以 1.15,而不是再减 15%:92 × 0.85 = 78.2,比最初的 80 还少。要精确还原,请用逆向百分比工具,它直接除以变化系数。",
        },
        {
          q: "输入 0 或负数会怎样?",
          a: "“X 是 Y 的百分之几”里 Y 为 0 会被拒绝——除以 0 没有答案;变化率为 0 基数同样拒绝。负数按标准公式诚实计算,例如 15% 的 −80 是 −12,步骤里会展示带符号的算术。",
        },
        {
          q: "结果有舍入吗?",
          a: "只在最终显示时舍,且计算全程保留完整浮点精度。每行步骤最多显示 10 位小数并去掉尾零,你看到的是真实等式的干净版本,不是被修饰过的答案。",
        },
      ],
    },
    ja: {
      name: "パーセント計算",
      tagline: "百分率の 5 つの問いを 1 つに:X% of Y・X は Y の何%・変化率・加算・減算。どのモードも式と途中過程を表示します。",
      intro: [
        "パーセントの計算でつまずくのは、同じ 3 つの数字が 5 つの別々の問いを隠しているからです。「80 の 15% は?」「12 は 80 の何%?」「80 から 100 への変化は?」「80 に 15% 上乗せすると?」「80 から 15% 引くと?」——似ているのに式はそれぞれ違い、混ぜると領収書や成績、割引の計算を間違えます。この計算機は 5 モードをタブで 1 つにまとめ、選んだモードの式を明示し、数字を代入した途中過程をすべて表示します。",
        "計算は飾りではなく正直そのもの。変化率は開始値で割るので、80 → 100 は +25% でも 100 → 80 は −20% にとどまります——誰もが忘れる非対称性です。0 による除算は推測ではなく明確に警告し、結果は最終表示まで全精度を保ち、各行は手計算で検証できる真の等式です。",
      ],
      steps: [
        "質問に合うモードを選択します(of・何%・変化率・加算・減算)。",
        "ラベル付きの欄に 2 つの数値を入力します。ラベルはモードに応じて変わるので、どの値をどこへ入れるか迷いません。",
        "強調された結果を読み、式の行とその下の計算過程で答えがどう組み立てられたかを確認します。",
        "タブを切り替えて、同じ数値を別の聞き方で試します。店頭の割引と値札の照合に便利です。",
      ],
      faqs: [
        {
          q: "変化率が片方向は +25%、逆は −20% になるのはなぜですか?",
          a: "変化率は常に開始値で割ります。80 → 100 は 20 ÷ 80 = +25%。100 → 80 は −20 ÷ 100 = −20% です。同じ差 20 でも小さい方の基数に対しては大きな割合になるため、上と下は対称になりません。",
        },
        {
          q: "価格に 15% を加えてから、また取り消すには?",
          a: "加算は掛け算です:80 × 1.15 = 92。この値上げを取り消すには 15% を引くのではなく 1.15 で割ります。92 × 0.85 = 78.2 となり、最初の 80 より少なくなります。正確に戻すには、変化の倍率で割る逆算ツールを使ってください。",
        },
        {
          q: "0 や負の数を入力するとどうなりますか?",
          a: "「X は Y の何%」で Y が 0 の場合は拒否されます(0 による除算に答えはないため)。変化率の開始値が 0 の場合も同様です。負の数は標準式で正直に計算されます(例:−80 の 15% は −12)。過程には符号付きの計算が表示されます。",
        },
        {
          q: "結果は丸められていますか?",
          a: "表示の最後にのみ丸めます。計算中は浮動小数点の全精度を保ち、各行は最大 10 桁・末尾の 0 を削除して表示します。見えているのは等式の整った姿であり、改変された答えではありません。",
        },
      ],
    },
    es: {
      name: "Calculadora de porcentajes",
      tagline:
        "Las cinco preguntas porcentuales en una sola herramienta: X% de Y, qué porcentaje es X de Y, variación entre dos valores y sumar o quitar un porcentaje — cada modo con su fórmula y los pasos ya sustituidos.",
      intro: [
        "Los porcentajes confunden porque los mismos tres números esconden cinco preguntas distintas. «Cuánto es el 15% de 80», «12 es qué porcentaje de 80», «qué pasó entre 80 y 100», «añadir el 15% a 80» y «quitar el 15% a 80» suenan parecido, pero cada una tiene su propia fórmula — y mezclarlas es como se estropean recibos, notas y descuentos. Esta calculadora reúne los cinco modos en una herramienta con pestañas, declara la fórmula del modo elegido y muestra cada paso intermedio con los números ya sustituidos.",
        "La matemática es honesta, no decorativa. La variación porcentual divide entre el valor inicial, así que de 80 a 100 hay una subida del 25%, mientras que de 100 a 80 la caída es solo del 20% — la asimetría que todos olvidan. La división por cero se avisa en vez de inventarse, los resultados guardan precisión completa hasta la pantalla final y cada línea es una ecuación verdadera que puedes comprobar a mano.",
      ],
      steps: [
        "Elija el modo que corresponda a su pregunta: de, qué-porcentaje, variación, sumar o restar.",
        "Escriba los dos números en los campos etiquetados; las etiquetas cambian con el modo y siempre sabrá qué valor va dónde.",
        "Lea el resultado destacado y revise la línea de fórmula y los pasos de abajo para ver cómo se construyó la respuesta.",
        "Cambie de pestaña para plantear los mismos números de otra manera — útil para cotejar un descuento con la etiqueta del precio.",
      ],
      faqs: [
        {
          q: "¿Por qué la variación es +25% en un sentido y −20% en el otro?",
          a: "La variación porcentual siempre divide entre el valor inicial. De 80 a 100 es 20 ÷ 80 = +25%; de 100 de vuelta a 80 es −20 ÷ 100 = −20%. La misma diferencia de 20 es una fracción mayor de la base más pequeña, así que subir y bajar nunca son simétricos.",
        },
        {
          q: "¿Cómo añado un 15% a un precio y luego lo quito?",
          a: "Añadir es multiplicar: 80 × 1.15 = 92. Deshacer esa subida exige dividir entre 1.15, no restar otro 15%: 92 × 0.85 = 78.2, menos que los 80 originales. Para volver exactamente, use la herramienta de porcentaje inverso, que divide entre el factor de cambio.",
        },
        {
          q: "¿Qué pasa si pongo cero o números negativos?",
          a: "Un total de cero en «X es qué % de Y» se rechaza, porque dividir por cero no tiene respuesta. Una base de cero en la variación también se rechaza. Los negativos se calculan honestamente con las fórmulas estándar — el 15% de −80 es −12 — y los pasos muestran la aritmética con signo.",
        },
        {
          q: "¿Se redondean los resultados?",
          a: "Solo al mostrarlos, y al final. El cálculo conserva toda la precisión de punto flotante mientras trabaja, y cada línea muestra un valor con diez decimales como máximo y sin ceros finales: lo que ve es la versión limpia y fiel de la ecuación verdadera.",
        },
      ],
    },
    pt: {
      name: "Calculadora de porcentagem",
      tagline:
        "As cinco perguntas de porcentagem em um só lugar: X% de Y, qual porcentagem X é de Y, variação entre dois valores e somar ou tirar um percentual — cada modo com a fórmula e os passos já substituídos.",
      intro: [
        "Porcentagens confundem porque os mesmos três números escondem cinco perguntas diferentes. “Quanto é 15% de 80”, “12 é qual porcentagem de 80”, “o que aconteceu entre 80 e 100”, “somar 15% a 80” e “tirar 15% de 80” parecem parecidas, mas cada uma tem a própria fórmula — e misturá-las é assim que recibos, notas e descontos dão errado. Esta calculadora reúne os cinco modos em uma ferramenta com abas, declara a fórmula do modo escolhido e mostra cada passo intermediário com os números já substituídos.",
        "A matemática é honesta, não decorativa. A variação percentual divide pelo valor inicial, então de 80 para 100 é um aumento de 25%, enquanto de 100 para 80 a queda é de apenas 20% — a assimetria que todo mundo esquece. Divisão por zero é sinalizada em vez de chutada, os resultados guardam precisão total até a exibição final e cada linha é uma equação verdadeira que você pode conferir no papel.",
      ],
      steps: [
        "Escolha o modo que combina com a pergunta: de, qual-porcentagem, variação, somar ou subtrair.",
        "Digite os dois números nos campos rotulados; os rótulos mudam com o modo, então você sempre sabe onde cada valor entra.",
        "Leia o resultado destacado e confira a linha da fórmula e os passos abaixo para ver como a resposta foi construída.",
        "Troque de aba para fazer a mesma pergunta de outro jeito — útil para conferir um desconto contra a etiqueta de preço.",
      ],
      faqs: [
        {
          q: "Por que a variação dá +25% num sentido e −20% no outro?",
          a: "A variação percentual sempre divide pelo valor inicial. De 80 para 100 é 20 ÷ 80 = +25%; de 100 de volta a 80 é −20 ÷ 100 = −20%. A mesma diferença de 20 é uma fração maior da base menor, então subir e descer nunca são simétricos.",
        },
        {
          q: "Como somo 15% a um preço e depois desfaço?",
          a: "Somar é multiplicar: 80 × 1.15 = 92. Desfazer esse aumento exige dividir por 1.15, não subtrair outros 15%: 92 × 0.85 = 78.2, menos que os 80 originais. Para voltar exatamente, use a ferramenta de porcentagem reversa, que divide pelo fator de mudança.",
        },
        {
          q: "O que acontece se eu digitar zero ou números negativos?",
          a: "Um total de zero em “X é qual % de Y” é recusado, porque dividir por zero não tem resposta. Uma base de zero na variação também é recusada. Negativos são calculados honestamente com as fórmulas padrão — 15% de −80 é −12 — e os passos mostram a aritmética com sinal.",
        },
        {
          q: "Os resultados são arredondados?",
          a: "Só na exibição, e só no fim. O cálculo mantém toda a precisão de ponto flutuante enquanto trabalha, e cada linha mostra um valor com no máximo dez decimais, sem zeros à direita: o que você vê é a versão limpa e fiel da equação verdadeira.",
        },
      ],
    },
  },
});
