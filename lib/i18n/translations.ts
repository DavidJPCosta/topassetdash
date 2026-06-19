export type Locale = "en" | "pt" | "es" | "fr" | "de";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English (US)", flag: "🇺🇸" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

export type TranslationKey =
  // Search
  | "search.placeholder"
  | "search.noResults"
  // Dashboard
  | "dashboard.title"
  | "customAssets.title"
  // Panel status
  | "panel.loading"
  | "panel.liveQuote"
  | "panel.loadingText"
  // Panel metric
  | "panel.at"
  | "panel.perMonth"
  | "panel.perYear"
  | "panel.cttTitle"
  // Custom assets count
  | "customAssets.count"
  // Data Sources
  | "datasources.title"
  | "datasources.description"
  | "datasources.ivv.name"
  | "datasources.ivv.desc"
  | "datasources.acwi.name"
  | "datasources.acwi.desc"
  | "datasources.ctt.name"
  | "datasources.ctt.desc"
  | "datasources.euribor.name"
  | "datasources.euribor.desc"
  | "datasources.custom.desc"
  | "datasources.note";

type Translations = Record<TranslationKey, string>;

const en: Translations = {
  "search.placeholder": "Search ETFs, stocks, indexes...",
  "search.noResults": 'No results found for "{query}"',
  "dashboard.title": "Top Assets",
  "customAssets.title": "Custom Assets",
  "customAssets.count": "{count} custom panel(s)",
  "panel.loading": "...",
  "panel.liveQuote": "Live Quote",
  "panel.loadingText": "Loading...",
  "panel.at": " at ",
  "panel.perMonth": " Monthly",
  "panel.perYear": " per year",
  "panel.cttTitle": "CTT Savings Certificates",
  "datasources.title": "Data Sources",
  "datasources.description":
    "This dashboard connects to real public APIs and displays all data in {currency}:",
  "datasources.ivv.name": "iShares Core S&P 500 ETF (IVV)",
  "datasources.ivv.desc":
    "iShares S&P 500 ETF tracking US large-cap equities. Converted to {currency}.",
  "datasources.acwi.name": "iShares MSCI ACWI ETF (Global)",
  "datasources.acwi.desc":
    "MSCI All Country World Index ETF covering developed and emerging markets globally.",
  "datasources.ctt.name": "CTT Savings Certificates",
  "datasources.ctt.desc":
    "Portuguese government savings certificates offered by CTT. Current annual rate ~4.75%.",
  "datasources.euribor.name": "EURIBOR Interest Rates",
  "datasources.euribor.desc":
    "Euro Interbank Offered Rate reference rates (3-month, 6-month, 12-month terms).",
  "datasources.custom.desc":
    "Custom asset added via search. Market data in {currency} via public APIs.",
  "datasources.note":
    "The default panels use iShares ETFs (IVV, ACWI) and European financial data (CTT, EURIBOR). Use the search bar to add any ETF, stock, or index as a custom panel. All prices are displayed in {currency}. Data updates every 30 seconds.",
};

const pt: Translations = {
  "search.placeholder": "Pesquisar ETFs, ações, índices...",
  "search.noResults": 'Nenhum resultado encontrado para "{query}"',
  "dashboard.title": "Ativos em Destaque",
  "customAssets.title": "Ativos Personalizados",
  "customAssets.count": "{count} painel(ns) personalizado(s)",
  "panel.loading": "...",
  "panel.liveQuote": "Cotação em Tempo Real",
  "panel.loadingText": "A carregar...",
  "panel.at": " a ",
  "panel.perMonth": " Mensal",
  "panel.perYear": "/ano",
  "panel.cttTitle": "CTT Certificados de Aforro",
  "datasources.title": "Fontes de Dados",
  "datasources.description":
    "Este painel liga-se a APIs públicas reais e apresenta todos os dados em {currency}:",
  "datasources.ivv.name": "iShares Core S&P 500 ETF (IVV)",
  "datasources.ivv.desc":
    "ETF iShares S&P 500 que segue empresas americanas de grande capitalização. Convertido para {currency}.",
  "datasources.acwi.name": "iShares MSCI ACWI ETF (Global)",
  "datasources.acwi.desc":
    "ETF MSCI All Country World Index que cobre mercados desenvolvidos e emergentes globalmente.",
  "datasources.ctt.name": "CTT Certificados de Aforro",
  "datasources.ctt.desc":
    "Certificados de Aforro portugueses oferecidos pelos CTT. Taxa anual atual ~4,75%.",
  "datasources.euribor.name": "Taxas de Juro EURIBOR",
  "datasources.euribor.desc":
    "Taxas de referência EURIBOR (prazo 3, 6 e 12 meses).",
  "datasources.custom.desc":
    "Ativo personalizado adicionado via pesquisa. Dados de mercado em {currency} através de APIs públicas.",
  "datasources.note":
    "Os painéis padrão usam ETFs iShares (IVV, ACWI) e dados financeiros europeus (CTT, EURIBOR). Use a barra de pesquisa para adicionar qualquer ETF, ação ou índice como painel personalizado. Todos os preços são apresentados em {currency}. Os dados atualizam a cada 30 segundos.",
};

const es: Translations = {
  "search.placeholder": "Buscar ETFs, acciones, índices...",
  "search.noResults": 'No se encontraron resultados para "{query}"',
  "dashboard.title": "Activos Destacados",
  "customAssets.title": "Activos Personalizados",
  "customAssets.count": "{count} panel(es) personalizado(s)",
  "panel.loading": "...",
  "panel.liveQuote": "Cotización en Vivo",
  "panel.loadingText": "Cargando...",
  "panel.at": " a ",
  "panel.perMonth": " Mensual",
  "panel.perYear": " por año",
  "panel.cttTitle": "CTT Certificados de Aforro",
  "datasources.title": "Fuentes de Datos",
  "datasources.description":
    "Este panel se conecta a APIs públicas reales y muestra todos los datos en {currency}:",
  "datasources.ivv.name": "iShares Core S&P 500 ETF (IVV)",
  "datasources.ivv.desc":
    "ETF iShares S&P 500 que sigue empresas estadounidenses de gran capitalización. Convertido a {currency}.",
  "datasources.acwi.name": "iShares MSCI ACWI ETF (Global)",
  "datasources.acwi.desc":
    "ETF MSCI All Country World Index que cubre mercados desarrollados y emergentes globalmente.",
  "datasources.ctt.name": "CTT Certificados de Aforro",
  "datasources.ctt.desc":
    "Certificados de ahorro portugueses ofrecidos por CTT. Tasa anual actual ~4,75%.",
  "datasources.euribor.name": "Tipos de Interés EURIBOR",
  "datasources.euribor.desc":
    "Tipos de referencia EURIBOR (plazos 3, 6 y 12 meses).",
  "datasources.custom.desc":
    "Activo personalizado añadido mediante búsqueda. Datos de mercado en {currency} a través de APIs públicas.",
  "datasources.note":
    "Los paneles predeterminados usan ETFs iShares (IVV, ACWI) y datos financieros europeos (CTT, EURIBOR). Use la barra de búsqueda para añadir cualquier ETF, acción o índice como panel personalizado. Todos los precios se muestran en {currency}. Los datos se actualizan cada 30 segundos.",
};

const fr: Translations = {
  "search.placeholder": "Rechercher ETFs, actions, indices...",
  "search.noResults": 'Aucun résultat trouvé pour "{query}"',
  "dashboard.title": "Actifs en Vedette",
  "customAssets.title": "Actifs Personnalisés",
  "customAssets.count": "{count} panneau(x) personnalisé(s)",
  "panel.loading": "...",
  "panel.liveQuote": "Cotation en Direct",
  "panel.loadingText": "Chargement...",
  "panel.at": " à ",
  "panel.perMonth": " Mensuel",
  "panel.perYear": " par an",
  "panel.cttTitle": "CTT Certificados de Aforro",
  "datasources.title": "Sources de Données",
  "datasources.description":
    "Ce tableau de bord se connecte à des API publiques réelles et affiche toutes les données en {currency} :",
  "datasources.ivv.name": "iShares Core S&P 500 ETF (IVV)",
  "datasources.ivv.desc":
    "ETF iShares S&P 500 suivant les grandes capitalisations américaines. Converti en {currency}.",
  "datasources.acwi.name": "iShares MSCI ACWI ETF (Global)",
  "datasources.acwi.desc":
    "ETF MSCI All Country World Index couvrant les marchés développés et émergents mondiaux.",
  "datasources.ctt.name": "CTT Certificados de Aforro",
  "datasources.ctt.desc":
    "Certificats d'épargne portugais proposés par CTT. Taux annuel actuel ~4,75%.",
  "datasources.euribor.name": "Taux d'Intérêt EURIBOR",
  "datasources.euribor.desc":
    "Taux de référence EURIBOR (échéances 3, 6 et 12 mois).",
  "datasources.custom.desc":
    "Actif personnalisé ajouté via la recherche. Données de marché en {currency} via des API publiques.",
  "datasources.note":
    "Les panneaux par défaut utilisent les ETFs iShares (IVV, ACWI) et les données financières européennes (CTT, EURIBOR). Utilisez la barre de recherche pour ajouter tout ETF, action ou indice en tant que panneau personnalisé. Tous les prix sont affichés en {currency}. Les données sont mises à jour toutes les 30 secondes.",
};

const de: Translations = {
  "search.placeholder": "ETFs, Aktien, Indizes suchen...",
  "search.noResults": 'Keine Ergebnisse gefunden für "{query}"',
  "dashboard.title": "Top-Anlagen",
  "customAssets.title": "Benutzerdefinierte Assets",
  "customAssets.count": "{count} benutzerdefinierte(s) Panel(s)",
  "panel.loading": "...",
  "panel.liveQuote": "Live-Kurs",
  "panel.loadingText": "Wird geladen...",
  "panel.at": " zu ",
  "panel.perMonth": " Monatlich",
  "panel.perYear": " pro Jahr",
  "panel.cttTitle": "CTT Certificados de Aforro",
  "datasources.title": "Datenquellen",
  "datasources.description":
    "Dieses Dashboard verbindet sich mit echten öffentlichen APIs und zeigt alle Daten in {currency} an:",
  "datasources.ivv.name": "iShares Core S&P 500 ETF (IVV)",
  "datasources.ivv.desc":
    "iShares S&P 500 ETF, der US-amerikanische Large-Cap-Aktien abbildet. Umgerechnet in {currency}.",
  "datasources.acwi.name": "iShares MSCI ACWI ETF (Global)",
  "datasources.acwi.desc":
    "MSCI All Country World Index ETF, der entwickelte und aufstrebende Märkte weltweit abdeckt.",
  "datasources.ctt.name": "CTT Certificados de Aforro",
  "datasources.ctt.desc":
    "Portugiesische Sparzertifikate, angeboten von CTT. Aktueller Jahreszins ~4,75%.",
  "datasources.euribor.name": "EURIBOR-Zinssätze",
  "datasources.euribor.desc":
    "EURIBOR-Referenzzinssätze (3, 6 und 12 Monate Laufzeit).",
  "datasources.custom.desc":
    "Benutzerdefiniertes Asset über Suche hinzugefügt. Marktdaten in {currency} über öffentliche APIs.",
  "datasources.note":
    "Die Standard-Panels verwenden iShares ETFs (IVV, ACWI) und europäische Finanzdaten (CTT, EURIBOR). Nutzen Sie die Suchleiste, um beliebige ETFs, Aktien oder Indizes als benutzerdefinierte Panels hinzuzufügen. Alle Preise werden in {currency} angezeigt. Daten aktualisieren alle 30 Sekunden.",
};

export const translations: Record<Locale, Translations> = {
  en,
  pt,
  es,
  fr,
  de,
};

export function t(
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string>,
): string {
  const text = translations[locale][key];
  if (!vars) return text;

  let result = text;
  for (const [k, v] of Object.entries(vars)) {
    result = result.replace(`{${k}}`, v);
  }
  return result;
}
