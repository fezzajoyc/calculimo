// it: dizionario UI italiano — forma chiavi identica a en (tests/seo.test.ts fa un confronto ricorsivo).
// Registro informale ("tu"), coerente con il resto del sito. "Calculimo" e i segnaposto {n}/{count}/{query}/{category} restano intatti.
const it = {
  brand: "Calculimo",
  tagline: "Ogni percentuale si calcola nel tuo browser.",
  metaDesc:
    "Calcolatori gratuiti di percentuali e proporzioni: X% di Y, variazione, percentuali inverse, sconti cumulati, mancia e rapporti. Tutto nel browser — i tuoi numeri non lasciano mai il dispositivo.",

  nav: {
    tools: "Tutti gli strumenti",
    categories: "Categorie",
    about: "Chi siamo",
    menu: "Menu",
    language: "Lingua",
  },

  home: {
    heroTitle: "Ogni domanda sulla percentuale, con il calcolo mostrato",
    heroSub:
      "Calculimo è un insieme di calcolatori di percentuali e proporzioni: percentuale di, variazione, percentuale inversa, sconti cumulati, mancia e proporzioni. Tutto nel tuo browser — veloce, gratis, senza registrazione, nessun invio.",
    browseAll: "Sfoglia tutti gli strumenti",
    categoriesTitle: "Categorie",
    featuredTitle: "Strumenti popolari",
    trustLocal: "I file restano sul tuo dispositivo",
    trustFree: "Gratis, senza account",
    trustFast: "Istantaneo, funziona offline",
    rotating: [
      "Il 15% di 80? È 12 — con ogni passaggio del calcolo sullo schermo",
      "Sconti cumulati: 20% + 10% fa 28%, non 30% — capisci perché",
      "Dopo un +25% costa 100? L'originale era 80, non 75",
      "Dividi il conto con la mancia in tre, al centesimo",
    ],
    statsLabels: { tools: "strumenti", languages: "lingue", uploads: "upload", accounts: "account" },
    eyebrow: "Gratis per sempre",
    heroCtaSecondary: "Come funziona",
    statsTools: "{n} strumenti",
    statsLanguages: "{n} lingue",
    statsUploads: "0 upload",
    statsAccounts: "0 account",
    categoriesSub: "Calcolatori di percentuali e proporzioni, tutti sul tuo dispositivo.",
    popularSub: "Gli strumenti che le persone aprono più spesso.",
    privacyTitle: "I tuoi file non lasciano mai il tuo dispositivo.",
    privacySub:
      "Non esiste un passaggio di upload. Gli strumenti sono JavaScript in esecuzione nel tuo browser: non è una promessa in una privacy policy, è come sono costruiti.",
    privacyPoint1T: "Elaborazione locale",
    privacyPoint1D:
      "I file vengono letti con la File API del browser ed elaborati in memoria. Nulla viene trasmesso, da nessuna parte.",
    privacyPoint2T: "Nessun account",
    privacyPoint2D: "Niente registrazione, niente email, niente cronologia salvata. Apri uno strumento e usalo.",
    privacyPoint3T: "Onesti per costruzione",
    privacyPoint3D:
      "Se qualcosa non si può davvero fare nel browser, lo diciamo invece di fingere il contrario.",
    privacyLink: "Leggi la nota privacy completa",
    endTitle: "Scegli uno strumento. Funziona, e basta.",
    endSub: "Quindici lingue, zero invii, nulla da installare.",
  },

  tools: {
    title: "Tutti gli strumenti",
    subtitle: "Cerca tra {count} strumenti gratuiti nel browser. Nessun upload, nessuna registrazione.",
    filterPlaceholder: "Cerca strumenti…",
    count: "{count} strumenti",
    empty: "Nessuno strumento corrisponde a “{query}”.",
  },

  categories: {
    pdf: { name: "PDF", desc: "Unisci, dividi, converti e modifica file PDF senza caricarli da nessuna parte." },
    image: { name: "Immagini", desc: "Comprimi, ridimensiona, ritaglia e converti immagini direttamente nel tuo browser." },
    text: { name: "Testo", desc: "Conta, pulisci, ordina e trasforma il testo all'istante, mentre scrivi." },
    developer: { name: "Sviluppo", desc: "Formattatori, codificatori, decodificatori e generatori per il lavoro di ogni giorno." },
    seo: { name: "SEO", desc: "Meta tag, markup schema, anteprima SERP e altri aiuti per la SEO on-page." },
    security: { name: "Sicurezza", desc: "Password, hash e ricerche — generati e verificati sul tuo dispositivo." },
    utility: { name: "Percentuali e proporzioni", desc: "Percentuale di un valore, variazione, percentuali inverse, sconti cumulati, mancia e rapporti per i numeri di ogni giorno." },
  },

  tool: {
    howTo: "Come si usa",
    faq: "Domande frequenti",
    related: "Strumenti correlati",
    privacyNote:
      "Questo strumento gira interamente nel tuo browser. I tuoi dati non lasciano mai il dispositivo: non vengono caricati su nessun server.",
    inCategory: "Altri in {category}",
    backToCategory: "Tutti gli strumenti {category}",
  },

  common: {
    copy: "Copia",
    copied: "Copiato",
    download: "Scarica",
    reset: "Reimposta",
    swap: "Inverti",
    clear: "Svuota",
    error: "Qualcosa è andato storto. Controlla i dati inseriti e riprova.",
    input: "Input",
    output: "Risultato",
    settings: "Opzioni",
    dropFiles: "Trascina qui i file o clicca per sceglierli",
    dropFile: "Trascina qui un file o clicca per sceglierlo",
    processing: "Elaborazione…",
    fileSize: "Dimensione",
    sample: "Prova un esempio",
    uppercase: "MAIUSCOLO",
  },

  unit: {
    from: "Da",
    to: "A",
    amount: "Quantità",
    result: "Risultato",
    common: "Conversioni comuni",
    formula: "Formula",
    allUnits: "Tutte le unità",
  },

  text: {
    stats: {
      words: "Parole",
      characters: "Caratteri",
      charsNoSpaces: "Senza spazi",
      sentences: "Frasi",
      paragraphs: "Paragrafi",
      lines: "Righe",
      readingTime: "Tempo di lettura",
      readingMinutes: "{n} min di lettura",
    },
  },

  footer: {
    line: "Calcolatori di percentuali e proporzioni. Niente di ciò che inserisci lascia il tuo dispositivo.",
    privacy: "Privacy",
    terms: "Termini",
    about: "Chi siamo",
    badges: "Badge",
    language: "Lingua",
  },

  badge: {
    title: "Badge Calculimo",
    desc: "Metti un badge Calculimo sul tuo sito, README o documentazione. Rimanda qui e racconta che i calcolatori dietro girano interamente nel browser.",
    voluntary: "L'incorporamento è del tutto volontario: scegli un badge se il progetto ti piace. Non serve alcun permesso.",
    md: "Markdown (README)",
    html: "HTML (sito web)",
    thanks: "Grazie per spargere la voce: ogni incorporamento aiuta più persone a scoprire strumenti che rispettano i loro file.",
  },

    embed: {
    title: "Incorpora questo strumento",
    desc: "Metti questo strumento sul tuo sito con una riga: gira nel browser del visitatore.",
  },

    mcp: {
    title: "Server MCP — strumenti accessibili all'IA",
    desc1:
      "Calculimo include un server MCP (Model Context Protocol): assistenti IA come Claude o Cursor possono eseguire gli stessi calcolatori di percentuali e proporzioni che vedi su questo sito — stessa logica testata, nessuna reimplementazione.",
    desc2:
      "Gli strumenti eseguono le funzioni pure del sito stesso: percentuale di, variazione, percentuali inverse, sconti cumulati, mancia e rapporti. L'esecuzione avviene sulla macchina del client IA via npx — nulla viene inviato ai nostri server.",
    toolsTitle: "Strumenti eseguibili ({n})",
    requiresNode: "Richiede Node.js 18+. Il server gira localmente via stdio; solo le chiamate che fai vengono calcolate sulla tua macchina.",
    privacy: "Richiede Node.js 18+. Il server gira localmente via stdio; solo le chiamate che fai vengono calcolate sulla tua macchina.",
  },

    notFound: {
    title: "Pagina non trovata",
    body: "Lo strumento che cerchi non esiste. Sfoglia invece tutti gli strumenti.",
    home: "Vai alla homepage",
  },
};

export default it;
