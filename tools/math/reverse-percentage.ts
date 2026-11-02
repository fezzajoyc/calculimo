import { defineTool } from "../_lib/types";
import { ReverseEngine } from "../_engines/engine-reverse";

export default defineTool({
  slug: "reverse-percentage",
  category: "utility",
  icon: "rotate",
  engine: { component: ReverseEngine },
  related: ["percentage-calculator", "stacked-discount", "ratio-calculator", "tip-splitter"],
  copy: {
    en: {
      name: "Reverse Percentage Calculator",
      tagline:
        "Work backwards from a changed value: find the original before a known increase or decrease, or the base a part is a given percent of — with the division that undoing a percentage really takes.",
      intro: [
        "The most-searched hard percentage question is not “what is 20% of 50” — it is the reverse: “the bill came to 96 after a 20% service charge; what was the original?” Undoing a percentage is division, not the opposite percentage, and that single fact defeats most mental arithmetic. After a 25% rise a price of 100 means the original was 100 ÷ 1.25 = 80, not 75 — applying −25% would land you at 75 and quietly steal 5.",
        "This tool handles both reverse forms. “Find the original” takes the final value, the rate and the direction, and divides by the exact change factor. “X is Y% of what” takes a part and its share and recovers the whole — 12 is 15% of 80. A decrease of 100% or more is refused with an explanation, because the base is genuinely unrecoverable: every original maps to the same result.",
      ],
      steps: [
        "Choose “find the original” or “X is Y% of what” — the fields relabel to match.",
        "For the original: enter the value after the change, the percent, and whether it rose or fell.",
        "For the base: enter the known part and the percent it represents of the unknown whole.",
        "Read the result and the two-line worked steps: the change factor first, then the division that undoes it.",
      ],
      faqs: [
        {
          q: "Why isn't undoing +25% the same as applying −25%?",
          a: "Because the two percentages have different bases. Rising 25% multiplies by 1.25; undoing it divides by 1.25. If you subtract 25% instead, you multiply by 0.75, and 100 × 0.75 = 75 — five short of the true original 80, because 25% of the larger number is more than 25% of the smaller one.",
        },
        {
          q: "A receipt total is 96 including 20% service. What was the pre-service amount?",
          a: "Enter 96 as the value after the change, 20 as the percent, direction “after an increase”. The tool computes 96 ÷ 1.2 = 80. Check it: 80 plus 20% of 80 is 80 + 16 = 96.",
        },
        {
          q: "Why is a 100% decrease refused?",
          a: "After a 100% decrease every starting value becomes 0, so the result carries no information about the original — infinitely many histories produce the same number. The tool says so instead of inventing an answer; anything below a 100% decrease is still recoverable.",
        },
        {
          q: "Can I use this for VAT, sales tax or markdowns?",
          a: "Yes — any proportional add-on or reduction works the same way. A price “after tax” is an increase, a markdown is a decrease, and “X is Y% of what” answers questions like “48 is 40% of the budget — what is the budget?” (48 ÷ 0.4 = 120).",
        },
      ],
    },
    zh: {
      name: "逆向百分比计算器",
      tagline: "从变化后的数字倒推:已知涨幅或降幅还原原值,或由部分与占比求基数——每一步都给出真正需要的除法。",
      intro: [
        "搜索量最大的高难度百分比问题不是“50 的 20% 是多少”,而是反过来的:“加了 20% 服务费后是 96,原价多少?”撤销一个百分比用的是除法,而不是相反的百分比——仅这一点就难倒了大多数心算。上涨 25% 后是 100,原值是 100 ÷ 1.25 = 80,不是 75:直接减 25% 会落到 75,悄悄少算 5。",
        "本工具处理两种逆向形态。“求原值”输入变化后的值、比率和方向,除以精确的变化系数。“X 是 Y% 的多少”输入部分与占比,还原整体——12 是 80 的 15%。降幅达到 100% 或更多时会被明确拒绝:所有原值都映射到同一个结果,基数信息真的找不回来了。",
      ],
      steps: [
        "选择“求原值”或“X 是 Y% 的多少”——输入框标签会随之变化。",
        "求原值:输入变化后的值、百分比,并指明是涨了还是跌了。",
        "求基数:输入已知的部分,以及它占未知整体的百分比。",
        "读取结果和两行计算步骤:先算变化系数,再做撤销它的除法。",
      ],
      faqs: [
        {
          q: "为什么撤销 +25% 不等于执行 −25%?",
          a: "因为两个百分比的基数不同。上涨 25% 是乘以 1.25;撤销它是除以 1.25。如果改成减 25%,就是乘以 0.75:100 × 0.75 = 75,比真正的原值 80 少 5——大数的 25% 比小数的 25% 要多。",
        },
        {
          q: "小票总额 96 含 20% 服务费,服务费前是多少?",
          a: "把 96 作为变化后的值、20 作为百分比、方向选“增加之后”。工具算出 96 ÷ 1.2 = 80。验证:80 加上 80 的 20% 是 80 + 16 = 96。",
        },
        {
          q: "为什么降幅 100% 会被拒绝?",
          a: "降幅 100% 后任何起始值都变成 0,结果里不含关于原值的任何信息——无穷多种历史得到同一个数字。工具如实说明而不是编一个答案;小于 100% 的降幅都还能还原。",
        },
        {
          q: "能用来算增值税、消费税或降价吗?",
          a: "可以——任何成比例的加成或折减都一样。“税后价”是增加,降价是减少;“X 是 Y% 的多少”还能回答“48 是预算的 40%,预算多少?”(48 ÷ 0.4 = 120)。",
        },
      ],
    },
    ja: {
      name: "逆パーセント計算",
      tagline: "変化後の値から逆算:増減率が分かれば元の値を復元、部分と割合から全体を復元。取り消しに必要な「割り算」を表示します。",
      intro: [
        "検索される難問の代表は「50 の 20% は?」ではなくその逆、「20% のサービス料を足したら 96 になった。元はいくら?」です。パーセントの取り消しは逆のパーセントではなく割り算——この事実だけで大部分の暗算がつまずきます。25% の値上げで 100 になったなら、元は 100 ÷ 1.25 = 80 であり 75 ではありません。−25% を適用すると 75 に着地し、静かに 5 を失います。",
        "このツールは 2 つの逆算形を扱います。「元の値を求める」は変化後の値・率・方向を受け取り、正確な変化の倍率で割ります。「X は Y% のいくつ」は部分とその割合から全体を復元します——12 は 80 の 15% です。100% 以上の減少は根拠とともに拒否されます。すべての元の値が同じ結果に写るため、基数は本当に復元できないからです。",
      ],
      steps: [
        "「元の値を求める」か「X は Y% のいくつ」を選びます。欄のラベルがそれに合わせて変わります。",
        "元の値:変化後の値・パーセント・上がったか下がったかを入力します。",
        "基数:既知の部分と、未知の全体に占める割合を入力します。",
        "結果と 2 行の計算過程を読みます。まず変化の倍率、次にそれを取り消す割り算です。",
      ],
      faqs: [
        {
          q: "+25% の取り消しが −25% の適用と同じでないのはなぜですか?",
          a: "2 つのパーセントの基数が違うからです。25% の上昇は 1.25 倍、取り消しは 1.25 での割り算です。代わりに 25% を引くと 0.75 倍になり、100 × 0.75 = 75。真の元値 80 より 5 少ない。大きい数の 25% は小さい数の 25% より多いからです。",
        },
        {
          q: "サービス料 20% 込みで合計 96。料金前の金額は?",
          a: "変化後の値に 96、パーセントに 20、方向は「増加後」を入力します。96 ÷ 1.2 = 80。検算:80 + 80 の 20% = 80 + 16 = 96 で合います。",
        },
        {
          q: "100% の減少が拒否されるのはなぜですか?",
          a: "100% の減少後、どの初期値も 0 になります。結果には元の値の情報が一切残らず、無限の経歴が同じ数字を生みます。答えをでっち上げる代わりにその旨を伝えます。100% 未満の減少なら復元できます。",
        },
        {
          q: "消費税や値引きにも使えますか?",
          a: "使えます。比例的な上乗せや値引きはすべて同じ仕組みです。「税込価格」は増加、値引きは減少。「X は Y% のいくつ」は「48 は予算の 40%——予算は?」(48 ÷ 0.4 = 120)のような問いにも答えます。",
        },
      ],
    },
    es: {
      name: "Calculadora de porcentaje inverso",
      tagline:
        "Retroceda desde un valor cambiado: halle el original antes de una subida o bajada conocida, o la base de la que una parte es cierto porcentaje — con la división que deshacer un porcentaje exige de verdad.",
      intro: [
        "La pregunta porcentual difícil más buscada no es “cuánto es el 20% de 50”, sino la inversa: “la cuenta dio 96 tras un 20% de servicio, ¿cuál era el original?” Deshacer un porcentaje es dividir, no aplicar el porcentaje contrario, y con solo ese dato se descaba la mayoría del cálculo mental. Tras una subida del 25%, un precio de 100 significa que el original era 100 ÷ 1.25 = 80, no 75: aplicar −25% lo lleva a 75 y le roba 5 sin ruido.",
        "Esta herramienta cubre las dos formas inversas. “Hallar el original” toma el valor final, la tasa y la dirección, y divide entre el factor de cambio exacto. “X es el Y% de qué” toma una parte y su proporción y recupera el total — 12 es el 15% de 80. Una bajada del 100% o más se rechaza con su explicación: la base es realmente irrecuperable, porque todos los originales acaban en el mismo resultado.",
      ],
      steps: [
        "Elija “hallar el original” o “X es el Y% de qué” — las etiquetas de los campos se ajustan.",
        "Para el original: introduzca el valor tras el cambio, el porcentaje y si subió o bajó.",
        "Para la base: introduzca la parte conocida y el porcentaje que representa del total desconocido.",
        "Lea el resultado y los dos pasos: primero el factor de cambio, luego la división que lo deshace.",
      ],
      faqs: [
        {
          q: "¿Por qué deshacer un +25% no es aplicar un −25%?",
          a: "Porque los dos porcentajes tienen bases distintas. Subir un 25% multiplica por 1.25; deshacerlo divide entre 1.25. Si resta 25%, multiplica por 0.75 y 100 × 0.75 = 75 — cinco menos que el original verdadero 80, porque el 25% del número mayor pesa más que el 25% del menor.",
        },
        {
          q: "El total de la cuenta es 96 con el 20% de servicio incluido. ¿Cuánto era sin él?",
          a: "Introduzca 96 como valor tras el cambio, 20 como porcentaje y dirección “tras un aumento”. La herramienta calcula 96 ÷ 1.2 = 80. Compruébelo: 80 más el 20% de 80 es 80 + 16 = 96.",
        },
        {
          q: "¿Por qué se rechaza una bajada del 100%?",
          a: "Tras una bajada del 100% todo valor inicial se convierte en 0, así que el resultado no guarda información del original: infinitos historiales producen el mismo número. La herramienta lo dice en vez de inventar una respuesta; cualquier bajada menor al 100% sigue siendo recuperable.",
        },
        {
          q: "¿Sirve para IVA, impuestos o rebajas?",
          a: "Sí: cualquier recargo o reducción proporcional funciona igual. Un precio “con impuestos” es un aumento, una rebaja es una bajada, y “X es el Y% de qué” responde cosas como “48 es el 40% del presupuesto, ¿cuánto es el presupuesto?” (48 ÷ 0.4 = 120).",
        },
      ],
    },
    pt: {
      name: "Calculadora de porcentagem reversa",
      tagline:
        "Volte do valor alterado para o original: descubra o número antes de um aumento ou queda conhecida, ou a base da qual uma parte é certo percentual — com a divisão que desfazer uma porcentagem realmente exige.",
      intro: [
        "A pergunta percentual difícil mais procurada não é “quanto é 20% de 50”, e sim o inverso: “a conta deu 96 depois de 20% de serviço; qual era o original?” Desfazer uma porcentagem é divisão, não a porcentagem oposta, e só esse fato derruba a maior parte do cálculo mental. Depois de uma alta de 25%, um preço de 100 significa que o original era 100 ÷ 1.25 = 80, não 75 — aplicar −25% leva a 75 e rouba 5 em silêncio.",
        "Esta ferramenta cobre as duas formas reversas. “Descobrir o original” recebe o valor final, a taxa e a direção, e divide pelo fator de mudança exato. “X é Y% de quê” recebe uma parte e sua fatia e recupera o todo — 12 é 15% de 80. Uma queda de 100% ou mais é recusada com explicação: a base é realmente irrecuperável, porque todos os originais viram o mesmo resultado.",
      ],
      steps: [
        "Escolha “descobrir o original” ou “X é Y% de quê” — os rótulos dos campos se ajustam.",
        "Para o original: informe o valor depois da mudança, o percentual e se subiu ou caiu.",
        "Para a base: informe a parte conhecida e o percentual que ela representa do todo desconhecido.",
        "Leia o resultado e os dois passos: primeiro o fator de mudança, depois a divisão que o desfaz.",
      ],
      faqs: [
        {
          q: "Por que desfazer +25% não é o mesmo que aplicar −25%?",
          a: "Porque os dois percentuais têm bases diferentes. Subir 25% multiplica por 1.25; desfazer divide por 1.25. Se você subtrai 25%, multiplica por 0.75 e 100 × 0.75 = 75 — cinco a menos que o original verdadeiro 80, porque 25% do número maior vale mais que 25% do menor.",
        },
        {
          q: "O total da conta é 96 incluindo 20% de serviço. Quanto era sem ele?",
          a: "Digite 96 como valor depois da mudança, 20 como percentual e direção “após um aumento”. A ferramenta calcula 96 ÷ 1.2 = 80. Confira: 80 mais 20% de 80 é 80 + 16 = 96.",
        },
        {
          q: "Por que uma queda de 100% é recusada?",
          a: "Depois de uma queda de 100% todo valor inicial vira 0, então o resultado não carrega informação nenhuma sobre o original — infinitas histórias produzem o mesmo número. A ferramenta avisa isso em vez de inventar uma resposta; qualquer queda abaixo de 100% ainda é recuperável.",
        },
        {
          q: "Posso usar para impostos ou descontos?",
          a: "Sim — qualquer acréscimo ou redução proporcional funciona do mesmo jeito. Um preço “com imposto” é um aumento, um desconto é uma queda, e “X é Y% de quê” responde coisas como “48 é 40% do orçamento; qual é o orçamento?” (48 ÷ 0.4 = 120).",
        },
      ],
    },
  },
});
