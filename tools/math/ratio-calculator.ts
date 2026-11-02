import { defineTool } from "../_lib/types";
import { RatioEngine } from "../_engines/engine-ratio";

export default defineTool({
  slug: "ratio-calculator",
  category: "utility",
  icon: "ruler",
  engine: { component: RatioEngine },
  related: ["percentage-calculator", "reverse-percentage", "stacked-discount", "tip-splitter"],
  copy: {
    en: {
      name: "Ratio Calculator",
      tagline:
        "Simplify any ratio to whole numbers, solve the missing value in A : B = C : D by cross-multiplication, and scale an aspect ratio from one known side — each with gcd or cross-product steps shown.",
      intro: [
        "Ratios hide in recipes, screen sizes, map scales and mixing instructions, and they come in three jobs: clean a messy pair like 1920:1080 down to 16:9, complete a proportion when one member is missing, or scale a shape while keeping its proportions. Each job has a different tool — a greatest common divisor, a cross-multiplication, a linear scaling factor — and this calculator runs the right one for the job with every step visible.",
        "The simplification is exact, not approximate: decimal inputs are scaled to true integers first, then reduced by their gcd, so 2.5 : 5 correctly becomes 1 : 2. Pairs whose decimal expansion never terminates — a true third, for instance — are reported honestly instead of forced into a fake ratio. The proportion mode solves a × d = b × c for whichever member you mark unknown, and the aspect mode multiplies one known side by the simplified ratio to find the other.",
      ],
      steps: [
        "Pick the tab: simplify a pair, solve a proportion, or scale by aspect ratio.",
        "For simplification, enter both sides — decimals welcome — and read the reduced pair with its gcd line.",
        "For a proportion, fill three of the four boxes and tap which letter is the unknown; the cross-multiplication appears below.",
        "For aspect, enter w : h and one real dimension; the missing dimension appears with the scaling it used.",
      ],
      faqs: [
        {
          q: "How does 1920:1080 become 16:9?",
          a: "Both numbers are divided by their greatest common divisor, 120: 1920 ÷ 120 = 16 and 1080 ÷ 120 = 9. The gcd line in the worked steps shows the divisor, and dividing both sides by the same number never changes the ratio, only its size.",
        },
        {
          q: "How is the missing value in 2 : 3 = x : 9 found?",
          a: "By cross-multiplication: a × d = b × c, so 2 × 9 = 3 × x and x = 18 ÷ 3 = 6. The two steps shown — the cross-product and the division — are exactly what a textbook would write, with the unknown marked as “?” to stay language-neutral.",
        },
        {
          q: "Why can't some decimals be simplified?",
          a: "Simplification needs an exact integer ratio. One third (0.333…) never terminates, so no finite scaling turns 1/3 : 2/3 into small whole numbers; the tool says so rather than inventing a misleading pair. Typed values like 0.333333 (six places) do terminate and simplify cleanly to 1 : 2.",
        },
        {
          q: "Can I use it for image sizes?",
          a: "That is the aspect tab: enter 16 and 9 as the ratio, mark width as known, type 1920, and the height 1080 comes back with the arithmetic. The simplified ratio is also displayed, so you can name the format — 16:9, 4:3, 21:9 — in one glance.",
        },
      ],
    },
    zh: {
      name: "比例计算器",
      tagline: "把任意比例化成最简整数比、用交叉相乘解 A : B = C : D 的未知数、由一边推纵横比——gcd 与交叉相乘的步骤逐行可见。",
      intro: [
        "比例藏在食谱、屏幕尺寸、地图比例尺和调配说明里,它们只干三件事:把 1920:1080 这样的乱对化简成 16:9;比例式中缺一项时把它补上;缩放一个形状时保持比例不变。三件事各有各的工具——最大公约数、交叉相乘、线性缩放——本计算器按需调用正确的那个,并且每一步都可见。",
        "化简是精确的,不是近似:小数输入先化成真正的整数,再用 gcd 约分,所以 2.5 : 5 会正确地变成 1 : 2。小数永远除不尽的对(比如真正的三分之一)会被如实报告,而不是硬凑出一个假比例。比例模式对 unknown 项解 a × d = b × c;纵横比模式用已知的边乘化简后的比例求另一边。",
      ],
      steps: [
        "选择标签页:化简一组、解比例,或按纵横比缩放。",
        "化简:输入两边——支持小数——读取约分结果和 gcd 那一行。",
        "解比例:四个格子填三个,点选哪个字母是未知数;交叉相乘会出现在下方。",
        "纵横比:输入 w : h 和一个真实尺寸;缺的尺寸连同所用算法一起出现。",
      ],
      faqs: [
        {
          q: "1920:1080 是怎么变成 16:9 的?",
          a: "两个数同除以它们的最大公约数 120:1920 ÷ 120 = 16,1080 ÷ 120 = 9。步骤里的 gcd 行展示了这个除数;两边同除同一个数不改变比例,只改变大小。",
        },
        {
          q: "2 : 3 = x : 9 里的 x 是怎么求出来的?",
          a: "用交叉相乘:a × d = b × c,所以 2 × 9 = 3 × x,x = 18 ÷ 3 = 6。展示的两步——交叉相乘与除法——正是教科书会写的步骤,未知数记作“?”以保持语言中立。",
        },
        {
          q: "为什么有些小数不能化简?",
          a: "化简需要精确的整数比。三分之一(0.333…)永远除不尽,没有任何有限的缩放能把 1/3 : 2/3 变成小的整数;工具如实说明,而不是编出一个误导人的比例。手输的 0.333333(六位)是有限小数,能干净地化简成 1 : 2。",
        },
        {
          q: "能用来算图片尺寸吗?",
          a: "这正是纵横比标签页:输入 16 和 9 作为比率,选宽为已知,输入 1920,就得到高 1080 和它的算式。化简后的比例也会同时显示,一眼说出格式名——16:9、4:3、21:9。",
        },
      ],
    },
    ja: {
      name: "比率計算",
      tagline: "任意の比を整数比に約分、A : B = C : D の欠けた値をたすき掛けで求解、既知の一边からアスペクト比をスケール——gcd と交叉乗算の過程を表示します。",
      intro: [
        "比率はレシピ、画面サイズ、縮尺、配合指示に隠れていて、仕事は 3 つだけ:1920:1080 のような対を 16:9 に整える、比例式の欠けた項を補う、形を縮めるときに比率を保つ。それぞれに専用の道具——最大公約数、たすき掛け、線形スケール——があり、この計算機はその場に合うものを正しく動かし、全過程を見せます。",
        "約分は近似ではなく厳密です。小数入力はまず真の整数に拡大してから gcd で割るので、2.5 : 5 は正しく 1 : 2 になります。小数が有限にならない対(真の 1/3 など)は、偽の比をでっち上げる代わりに正直に報告します。比例モードは未知に印を付けた項について a × d = b × c を解き、アスペクトモードは既知の片方に約分後の比率を掛けてもう片方を出します。",
      ],
      steps: [
        "タブを選びます:対を約分する、比例を解く、アスペクト比で拡大縮小する。",
        "約分では両辺を入力します(小数も可)。約分結果と gcd の行が読めます。",
        "比例では 4 つの欄のうち 3 つを埋め、未知の文字をタップします。たすき掛けが下に現れます。",
        "アスペクトでは w : h と実寸法を 1 つ入力します。欠けた寸法とその算出に使った式が出ます。",
      ],
      faqs: [
        {
          q: "1920:1080 はどうやって 16:9 になりますか?",
          a: "両数を最大公約数 120 で割ります:1920 ÷ 120 = 16、1080 ÷ 120 = 9。過程の gcd 行がこの除数を示します。両辺を同じ数で割っても比は変わらず、大きさだけが変わります。",
        },
        {
          q: "2 : 3 = x : 9 の x はどう求めますか?",
          a: "たすき掛けです:a × d = b × c より 2 × 9 = 3 × x、x = 18 ÷ 3 = 6。表示される 2 行——交叉積と除算——は教科書が書くのとまったく同じ手順で、未知は言語に中立な「?」で示します。",
        },
        {
          q: "約分できない小数があるのはなぜですか?",
          a: "約分には正確な整数比が必要です。1/3(0.333…)は有限小数にならず、どんな有限の拡大でも 1/3 : 2/3 を小さな整数にできません。誤解を招く対を作る代わりにその旨を伝えます。手入力の 0.333333(6 桁)は有限なので 1 : 2 にきれいに約分できます。",
        },
        {
          q: "画像サイズにも使えますか?",
          a: "アスペクトタブがまさにそれです。比率に 16 と 9 を入れ、幅を既知にして 1920 を入力すると、高さ 1080 とその算式が返ります。約分後の比率も表示されるので、16:9・4:3・21:9 といった形式名がひと目で分かります。",
        },
      ],
    },
    es: {
      name: "Calculadora de proporciones",
      tagline:
        "Simplifique cualquier razón a números enteros, resuelva el valor que falta en A : B = C : D por multiplicación en cruz y escale una relación de aspecto desde un lado conocido — con los pasos del mcd y del producto cruzado a la vista.",
      intro: [
        "Las proporciones se esconden en recetas, tamaños de pantalla, escalas de mapas y mezclas, y hacen tres trabajos: limpiar un par sucio como 1920:1080 hasta 16:9, completar una proporción cuando falta un miembro, o escalar una forma conservando sus proporciones. Cada trabajo tiene su herramienta — un máximo común divisor, una multiplicación en cruz, un factor lineal — y esta calculadora usa la correcta con cada paso a la vista.",
        "La simplificación es exacta, no aproximada: las entradas decimales se escalan primero a enteros verdaderos y luego se reducen por su mcd, así que 2,5 : 5 se convierte correctamente en 1 : 2. Los pares cuyo decimal no termina jamás — un tercio real, por ejemplo — se informan con honestidad en lugar de forzar una falsa razón. El modo proporción despeja a × d = b × c para el miembro que marque como incógnita, y el modo aspecto multiplica el lado conocido por la razón simplificada para hallar el otro.",
      ],
      steps: [
        "Elija la pestaña: simplificar un par, resolver una proporción o escalar por relación de aspecto.",
        "Para simplificar, escriba ambos lados — con decimales si quiere — y lea el par reducido con su línea de mcd.",
        "Para una proporción, llene tres de las cuatro casillas y toque la letra incógnita; la multiplicación en cruz aparece abajo.",
        "Para el aspecto, introduzca w : h y una dimensión real; la que falta aparece con la aritmética que la produjo.",
      ],
      faqs: [
        {
          q: "¿Cómo pasa 1920:1080 a 16:9?",
          a: "Ambos números se dividen por su máximo común divisor, 120: 1920 ÷ 120 = 16 y 1080 ÷ 120 = 9. La línea del mcd muestra el divisor, y dividir los dos lados por el mismo número no cambia la razón, solo su tamaño.",
        },
        {
          q: "¿Cómo se halla el valor que falta en 2 : 3 = x : 9?",
          a: "Por multiplicación en cruz: a × d = b × c, o sea 2 × 9 = 3 × x y x = 18 ÷ 3 = 6. Los dos pasos mostrados — el producto cruzado y la división — son justo lo que escribiría un libro de texto, con la incógnita marcada como “?” para mantener el símbolo neutro.",
        },
        {
          q: "¿Por qué algunos decimales no se pueden simplificar?",
          a: "La simplificación exige una razón entera exacta. Un tercio (0,333…) nunca termina, así que ningún escalado finito convierte 1/3 : 2/3 en enteros pequeños; la herramienta lo dice en vez de inventar un par engañoso. Valores escritos como 0,333333 (seis cifras) sí terminan y se simplifican limpiamente a 1 : 2.",
        },
        {
          q: "¿Sirve para tamaños de imagen?",
          a: "Esa es la pestaña de aspecto: entre 16 y 9 como razón, marque el ancho como conocido, escriba 1920 y la altura 1080 vuelve con su aritmética. La razón simplificada también se muestra, para nombrar el formato — 16:9, 4:3, 21:9 — de un vistazo.",
        },
      ],
    },
    pt: {
      name: "Calculadora de proporção",
      tagline:
        "Simplifique qualquer razão para números inteiros, resolva o valor que falta em A : B = C : D por multiplicação em cruz e escale uma proporção a partir de um lado conhecido — com os passos do MDC e do produto cruzado visíveis.",
      intro: [
        "Proporções se escondem em receitas, tamanhos de tela, escalas de mapa e misturas, e fazem três trabalhos: limpar um par bagunçado como 1920:1080 até 16:9, completar uma proporção quando falta um membro, ou redimensionar uma forma mantendo suas proporções. Cada trabalho tem sua ferramenta — um máximo divisor comum, uma multiplicação em cruz, um fator linear — e esta calculadora aciona a certa com cada passo à vista.",
        "A simplificação é exata, não aproximada: entradas decimais são escaladas primeiro a inteiros verdadeiros e depois reduzidas pelo MDC, então 2,5 : 5 vira corretamente 1 : 2. Pares cujo decimal nunca termina — um terço verdadeiro, por exemplo — são relatados com honestidade em vez de forçar uma razão falsa. O modo proporção resolve a × d = b × c para o membro que você marcar como incógnito, e o modo proporção de tela multiplica o lado conhecido pela razão simplificada para achar o outro.",
      ],
      steps: [
        "Escolha a aba: simplificar um par, resolver uma proporção ou escalar pela proporção de tela.",
        "Para simplificar, digite os dois lados — decimais são bem-vindos — e leia o par reduzido com a linha do MDC.",
        "Para uma proporção, preencha três das quatro caixas e toque a letra incógnita; a multiplicação em cruz aparece abaixo.",
        "Para a proporção de tela, informe w : h e uma dimensão real; a que falta aparece com a aritmética que a produziu.",
      ],
      faqs: [
        {
          q: "Como 1920:1080 vira 16:9?",
          a: "Os dois números são divididos pelo máximo divisor comum, 120: 1920 ÷ 120 = 16 e 1080 ÷ 120 = 9. A linha do MDC nos passos mostra o divisor, e dividir os dois lados pelo mesmo número não muda a razão, só o tamanho.",
        },
        {
          q: "Como se acha o valor que falta em 2 : 3 = x : 9?",
          a: "Por multiplicação em cruz: a × d = b × c, então 2 × 9 = 3 × x e x = 18 ÷ 3 = 6. Os dois passos mostrados — o produto cruzado e a divisão — são exatamente o que um livro didático escreveria, com a incógnita marcada como “?” para ficar neutra.",
        },
        {
          q: "Por que alguns decimais não podem ser simplificados?",
          a: "A simplificação exige uma razão inteira exata. Um terço (0,333…) nunca termina, então nenhum escalonamento finito transforma 1/3 : 2/3 em inteiros pequenos; a ferramenta avisa em vez de inventar um par enganoso. Valores digitados como 0,333333 (seis casas) terminam e simplificam limpar para 1 : 2.",
        },
        {
          q: "Posso usar para tamanhos de imagem?",
          a: "Essa é a aba de proporção de tela: entre 16 e 9 como razão, marque a largura como conhecida, digite 1920, e a altura 1080 volta com a aritmética. A razão simplificada também aparece, para nomear o formato — 16:9, 4:3, 21:9 — de relance.",
        },
      ],
    },
  },
});
