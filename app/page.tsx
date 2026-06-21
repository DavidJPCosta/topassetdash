"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { LOCALES } from "../lib/i18n/translations";
import type { Locale } from "../lib/i18n/translations";

interface PanelData {
  id: number;
  title: string;
  metric: string;
  change: string;
  description: string;
}

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
}

interface PanelColor {
  bg: string;
  border: string;
  hoverBorder: string;
  text: string;
  textLight: string;
  badge: string;
  badgeBorder: string;
}

interface AddedPanel {
  id: string;
  symbol: string;
  name: string;
  type: string;
  loading: boolean;
  metric: string;
  change: string;
  color: PanelColor;
}

const TYPE_COLORS: Record<string, PanelColor> = {
  ETF: {
    bg: "bg-slate-700/30",
    border: "border-blue-800/30",
    hoverBorder: "hover:border-blue-700/50",
    text: "text-blue-300",
    textLight: "text-blue-200",
    badge: "bg-blue-800/30",
    badgeBorder: "border-blue-700/40",
  },
  Stock: {
    bg: "bg-slate-700/30",
    border: "border-violet-800/30",
    hoverBorder: "hover:border-violet-700/50",
    text: "text-violet-300",
    textLight: "text-violet-200",
    badge: "bg-violet-800/30",
    badgeBorder: "border-violet-700/40",
  },
  Index: {
    bg: "bg-slate-700/30",
    border: "border-emerald-800/30",
    hoverBorder: "hover:border-emerald-700/50",
    text: "text-emerald-300",
    textLight: "text-emerald-200",
    badge: "bg-emerald-800/30",
    badgeBorder: "border-emerald-700/40",
  },
  Certificate: {
    bg: "bg-slate-700/30",
    border: "border-amber-800/30",
    hoverBorder: "hover:border-amber-700/50",
    text: "text-amber-300",
    textLight: "text-amber-200",
    badge: "bg-amber-800/30",
    badgeBorder: "border-amber-700/40",
  },
  Interest: {
    bg: "bg-slate-700/30",
    border: "border-teal-800/30",
    hoverBorder: "hover:border-teal-700/50",
    text: "text-teal-300",
    textLight: "text-teal-200",
    badge: "bg-teal-800/30",
    badgeBorder: "border-teal-700/40",
  },
};

const PANEL_COLORS: PanelColor[] = [
  {
    bg: "bg-slate-700/30",
    border: "border-cyan-800/30",
    hoverBorder: "hover:border-cyan-700/50",
    text: "text-cyan-300",
    textLight: "text-cyan-200",
    badge: "bg-cyan-800/30",
    badgeBorder: "border-cyan-700/40",
  },
  {
    bg: "bg-slate-700/30",
    border: "border-rose-800/30",
    hoverBorder: "hover:border-rose-700/50",
    text: "text-rose-300",
    textLight: "text-rose-200",
    badge: "bg-rose-800/30",
    badgeBorder: "border-rose-700/40",
  },
  {
    bg: "bg-slate-700/30",
    border: "border-sky-800/30",
    hoverBorder: "hover:border-sky-700/50",
    text: "text-sky-300",
    textLight: "text-sky-200",
    badge: "bg-sky-800/30",
    badgeBorder: "border-sky-700/40",
  },
  {
    bg: "bg-slate-700/30",
    border: "border-lime-800/30",
    hoverBorder: "hover:border-lime-700/50",
    text: "text-lime-300",
    textLight: "text-lime-200",
    badge: "bg-lime-800/30",
    badgeBorder: "border-lime-700/40",
  },
  {
    bg: "bg-slate-700/30",
    border: "border-yellow-800/30",
    hoverBorder: "hover:border-yellow-700/50",
    text: "text-yellow-300",
    textLight: "text-yellow-200",
    badge: "bg-yellow-800/30",
    badgeBorder: "border-yellow-700/40",
  },
  {
    bg: "bg-slate-700/30",
    border: "border-pink-800/30",
    hoverBorder: "hover:border-pink-700/50",
    text: "text-pink-300",
    textLight: "text-pink-200",
    badge: "bg-pink-800/30",
    badgeBorder: "border-pink-700/40",
  },
];

const CURRENCIES = [
  { code: "EUR", symbol: "\u20AC", label: "Euro" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "GBP", symbol: "\u00A3", label: "Pound" },
  { code: "JPY", symbol: "\u00A5", label: "Yen" },
  { code: "CHF", symbol: "CHF", label: "Franc" },
];

const EXCHANGE_RATES: Record<string, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
  JPY: 162.5,
  CHF: 0.96,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  JPY: "¥",
  CHF: "Fr",
};

export default function Home() {
  const [sales, setSales] = useState<PanelData | null>(null);
  const [analytics, setAnalytics] = useState<PanelData | null>(null);
  const [revenue, setRevenue] = useState<PanelData | null>(null);
  const [performance, setPerformance] = useState<PanelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedPanels, setAddedPanels] = useState<AddedPanel[]>([]);
  const [addedDataSources, setAddedDataSources] = useState<
    { name: string; symbol: string; color: PanelColor }[]
  >([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showCurrDropdown, setShowCurrDropdown] = useState(false);
  const [currency, setCurrency] = useState("EUR");

  // Load custom panels from localStorage after hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dashboard_panels");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setAddedPanels(parsed);
      }
      const dsStored = localStorage.getItem("dashboard_datasources");
      if (dsStored) {
        const parsed = JSON.parse(dsStored);
        if (Array.isArray(parsed)) setAddedDataSources(parsed);
      }
    } catch {}
  }, []);

  const searchTimer = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);

  const { _t, locale, setLocale } = useLanguage();

  const currSymbol =
    CURRENCIES.find((c) => c.code === currency)?.symbol || "\u20AC";
  const rate = EXCHANGE_RATES[currency] || 1;

  const getChangeStyle = (change: string | undefined) => {
    if (!change || change === "..." || change === "---") {
      return {
        text: "text-amber-300",
        bg: "bg-amber-800/30",
        border: "border-amber-700/40",
      };
    }
    const cleaned = change.replace(/^\+*/, "");
    const num = parseFloat(cleaned);
    if (isNaN(num) || num === 0) {
      return {
        text: "text-amber-300",
        bg: "bg-amber-800/30",
        border: "border-amber-700/40",
      };
    }
    if (num > 0) {
      return {
        text: "text-green-400",
        bg: "bg-green-700/30",
        border: "border-green-600/40",
      };
    }
    return {
      text: "text-red-300",
      bg: "bg-red-800/30",
      border: "border-red-700/40",
    };
  };

  // Convert a metric string from EUR to the selected currency
  const convertMetric = useCallback(
    (metric: string): string => {
      if (!metric || metric === "..." || metric.startsWith("..."))
        return metric;
      // Replace the first number and the EUR symbol
      return metric
        .replace(/^[\u20AC]/, currSymbol)
        .replace(/([\d,]+\.?\d*)/, (match) => {
          const num = parseFloat(match.replace(/,/g, ""));
          if (isNaN(num)) return match;
          const converted = num * rate;
          // Use fewer decimals for large numbers (JPY etc)
          const decimals = rate >= 100 ? 0 : 2;
          return converted.toFixed(decimals);
        });
    },
    [currency, rate, currSymbol],
  );

  // Translate @ /mÃªs /ano suffixes based on locale
  const translateSuffixes = useCallback(
    (text: string): string => {
      return text
        .replace(" @ ", _t("panel.at"))
        .replace(/\/m[eê]s/, _t("panel.perMonth"))
        .replace("/ano", _t("panel.perYear"));
    },
    [_t],
  );

  // Generate mock 1d, 1m, 1y time periods from a change value
  const getTimePeriods = useCallback((change: string | undefined) => {
    if (!change || change === "..." || change === "---") return null;
    const cleaned = change.replace(/^\+*/, "").replace("%", "");
    const num = parseFloat(cleaned);
    if (isNaN(num)) return null;
    const abs = Math.abs(num);
    const sign = num >= 0 ? "+" : "";
    return {
      d1: `${sign}${(abs * 0.1 + 0.1).toFixed(1)}%`,
      m1: `${sign}${(abs * 0.6 + 0.2).toFixed(1)}%`,
      y1: `${sign}${(abs * 1.2 + 0.5).toFixed(1)}%`,
    };
  }, []);

  // Sparkline data cache
  const sparklineCache = useRef<Record<string, number[]>>({});
  const getSparklineData = useCallback(
    (key: string, baseValue: number): number[] => {
      if (sparklineCache.current[key]) return sparklineCache.current[key];
      const data: number[] = [];
      let current = baseValue || 100;
      for (let i = 0; i < 24; i++) {
        current += current * (Math.random() - 0.48) * 0.025;
        data.push(current);
      }
      sparklineCache.current[key] = data;
      return data;
    },
    [],
  );

  // Build SVG path for a sparkline
  const buildSparklinePath = useCallback(
    (data: number[], w: number, h: number): string => {
      if (!data.length) return "";
      const min = Math.min(...data);
      const max = Math.max(...data);
      const range = max - min || 1;
      return data
        .map((v, i) => {
          const x = (i / (data.length - 1)) * w;
          const y = h - ((v - min) / range) * h;
          return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");
    },
    [],
  );

  // Tooltip state
  const [tooltipInfo, setTooltipInfo] = useState<{
    id: string;
    title: string;
    metric: string;
    change: string;
    baseValue: number;
    color: PanelColor;
  } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const panelGridRef = useRef<HTMLDivElement>(null);

  const handlePanelEnter = useCallback(
    (
      id: string,
      title: string,
      metric: string,
      change: string,
      baseValue: number,
      color: PanelColor,
      e: React.MouseEvent,
    ) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      // Position tooltip diagonally up-right from panel center-bottom
      setTooltipPos({
        x: rect.left + rect.width * 0.1,
        y: rect.top - rect.height * 1.2,
      });
      setTooltipInfo({ id, title, metric, change, baseValue, color });
    },
    [],
  );

  const handlePanelLeave = useCallback(() => {
    setTooltipInfo(null);
  }, []);

  // Extract numeric value from a metric string for sparkline
  const extractValue = useCallback((metric: string | undefined): number => {
    if (!metric || metric === "...") return 100;
    const match = metric.match(/[\d,.]+/);
    if (!match) return 100;
    return parseFloat(match[0].replace(/,/g, "")) || 100;
  }, []);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangDropdown(false);
      }
      if (currRef.current && !currRef.current.contains(e.target as Node)) {
        setShowCurrDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch default panel data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, analyticsRes, revenueRes, perfRes] = await Promise.all(
          [
            fetch("/api/dashboard/sales"),
            fetch("/api/dashboard/analytics"),
            fetch("/api/dashboard/revenue"),
            fetch("/api/dashboard/performance"),
          ],
        );

        if (salesRes.ok) setSales(await salesRes.json());
        if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
        if (revenueRes.ok) setRevenue(await revenueRes.json());
        if (perfRes.ok) setPerformance(await perfRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Debounced search
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (value.trim().length < 1) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSearchResults(data.results || []);
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  // Add a panel from search result
  const addPanel = useCallback(
    (result: SearchResult) => {
      const typeColor = TYPE_COLORS[result.type];
      const newPanel: AddedPanel = {
        id: `${result.symbol}-${Date.now()}`,
        symbol: result.symbol,
        name: result.name,
        type: result.type,
        loading: true,
        metric: "â‚¬...",
        change: "...",
        color:
          typeColor || PANEL_COLORS[addedPanels.length % PANEL_COLORS.length],
      };

      setAddedPanels((prev) => {
        const next = [...prev, newPanel];
        localStorage.setItem("dashboard_panels", JSON.stringify(next));
        return next;
      });
      setAddedDataSources((prev) => {
        const next = [
          ...prev,
          {
            name: result.name,
            symbol: result.symbol,
            color: newPanel.color,
          },
        ];
        localStorage.setItem("dashboard_datasources", JSON.stringify(next));
        return next;
      });
      setShowDropdown(false);
      setSearchQuery("");

      // Fetch data for the new panel
      fetch(`/api/dashboard/quote?symbol=${result.symbol}`)
        .then((res) => res.json())
        .then((data) => {
          setAddedPanels((prev) => {
            const next = prev.map((p) =>
              p.id === newPanel.id
                ? {
                    ...p,
                    loading: false,
                    metric: data.metric,
                    change: data.change,
                  }
                : p,
            );
            localStorage.setItem("dashboard_panels", JSON.stringify(next));
            return next;
          });
        })
        .catch(() => {
          setAddedPanels((prev) => {
            const next = prev.map((p) =>
              p.id === newPanel.id
                ? {
                    ...p,
                    loading: false,
                    metric: "â‚¬---",
                    change: "+0.0%",
                  }
                : p,
            );
            localStorage.setItem("dashboard_panels", JSON.stringify(next));
            return next;
          });
        });
    },
    [addedPanels.length],
  );

  // Remove a panel
  const removePanel = useCallback((id: string, symbol: string) => {
    setAddedPanels((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem("dashboard_panels", JSON.stringify(next));
      return next;
    });
    setAddedDataSources((prev) => {
      const next = prev.filter((ds) => ds.symbol !== symbol);
      localStorage.setItem("dashboard_datasources", JSON.stringify(next));
      return next;
    });
  }, []);

  // Clear all custom panels
  const clearAllPanels = useCallback(() => {
    setAddedPanels([]);
    setAddedDataSources([]);
    localStorage.removeItem("dashboard_panels");
    localStorage.removeItem("dashboard_datasources");
  }, []);

  const defaultPanels = [
    {
      data: sales,
      color: "blue",
      title: "iShares Core S&P 500 ETF (IVV)",
      metric: "â‚¬377.50",
      desc: "iShares Core S&P 500 ETF",
    },
    {
      data: analytics,
      color: "green",
      title: "iShares MSCI ACWI ETF (ACWI)",
      metric: "â‚¬90.62",
      desc: "iShares MSCI World ETF",
    },
    {
      data: revenue,
      color: "amber",
      title: "CTT Certificados de Aforro",
      metric: "â‚¬100 @ 0.40%/mÃªs",
      desc: "Portuguese Savings Rate",
    },
    {
      data: performance,
      color: "yellow",
      title: "EURIBOR Interest Rates",
      metric: "€ 4.15% (12M)",
      desc: "Reference Interest Rate",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <nav className="bg-slate-800 shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo */}
            <a href="#" className="flex items-center group">
              <svg
                width="48"
                height="48"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M20 2L34 10V20C34 28.5 27.5 36 20 38C12.5 36 6 28.5 6 20V10L20 2Z"
                  fill="#1E293B"
                  stroke="#475569"
                  strokeWidth="1.2"
                />
                <path
                  d="M12 24L18 17L22 20L28 12"
                  stroke="#EAB308"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M28 12H24M28 12V16"
                  stroke="#EAB308"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text
                  x="20"
                  y="23"
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  &euro;
                </text>
              </svg>
            </a>

            {/* Search */}
            <div ref={searchRef} className="relative max-w-2xl mx-auto w-full">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder={_t("search.placeholder")}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 text-sm transition-colors"
                />
                {searching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-yellow-400 rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Search dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-2xl max-h-80 overflow-y-auto z-50">
                  {searchResults.map((result) => (
                    <button
                      key={result.symbol}
                      onClick={() => addPanel(result)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0 flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-200 truncate">
                          {result.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {result.symbol}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0 ml-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            result.type === "ETF"
                              ? "bg-blue-800/30 text-blue-300"
                              : result.type === "Stock"
                                ? "bg-violet-800/30 text-violet-300"
                                : result.type === "Index"
                                  ? "bg-emerald-800/30 text-emerald-300"
                                  : "bg-slate-700/50 text-slate-400"
                          }`}
                        >
                          {result.type || "N/A"}
                        </span>
                        <svg
                          className="w-4 h-4 text-slate-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {showDropdown &&
                searchQuery.trim().length >= 1 &&
                !searching &&
                searchResults.length === 0 && (
                  <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50">
                    <div className="px-4 py-6 text-center text-slate-400 text-sm">
                      {_t("search.noResults", { query: searchQuery })}
                    </div>
                  </div>
                )}
            </div>

            <div className="flex items-center ml-auto space-x-1.5">
              {/* Language Switcher */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 hover:text-slate-100 hover:border-slate-500 transition-colors text-sm"
                  title="Switch language"
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
                    />
                  </svg>
                  <span className="text-sm leading-none">
                    {LOCALES.find((l) => l.code === locale)?.flag}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      showLangDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showLangDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50 overflow-hidden">
                    {LOCALES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLocale(lang.code as Locale);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-center space-x-3 transition-colors text-sm ${
                          locale === lang.code
                            ? "bg-cyan-500/20 text-cyan-300"
                            : "text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        <span className="text-sm leading-none">
                          {lang.flag}
                        </span>
                        <span className="font-medium text-sm">
                          {lang.label}
                        </span>
                        {locale === lang.code && (
                          <svg
                            className="w-4 h-4 ml-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Currency Switcher */}
              <div ref={currRef} className="relative">
                <button
                  onClick={() => setShowCurrDropdown(!showCurrDropdown)}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 hover:text-slate-100 hover:border-slate-500 transition-colors text-sm"
                  title="Switch currency"
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    />
                    <text
                      x="12"
                      y="16.5"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill="currentColor"
                    >
                      {CURRENCY_SYMBOLS[currency] || "€"}
                    </text>
                  </svg>
                  <span className="text-sm">{currency}</span>
                  <svg
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      showCurrDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showCurrDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50 overflow-hidden">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code);
                          setShowCurrDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-center space-x-3 transition-colors text-sm ${
                          currency === c.code
                            ? "bg-cyan-500/20 text-cyan-300"
                            : "text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        <svg
                          className="w-4 h-4 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          />
                          <text
                            x="12"
                            y="16.5"
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="700"
                            fill="currentColor"
                          >
                            {CURRENCY_SYMBOLS[c.code] || "€"}
                          </text>
                        </svg>
                        <span className="font-medium text-sm">{c.label}</span>
                        <span className="text-sm text-slate-500 ml-auto">
                          {c.code}
                        </span>
                        {currency === c.code && (
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-200">
            {_t("dashboard.title")}
          </h1>
          {addedPanels.length > 0 && (
            <span className="text-sm text-slate-400">
              {_t("customAssets.count", { count: String(addedPanels.length) })}
            </span>
          )}
        </div>

        {/* Default Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Sales Panel — ETF */}
          <div
            className="bg-slate-700/30 rounded-xl shadow-lg p-5 border-t-[3px] border-blue-500/60 hover:shadow-xl transition-shadow hover:border-t-blue-400 cursor-pointer relative overflow-visible"
            onMouseEnter={(e) =>
              handlePanelEnter(
                "sales",
                sales?.title || "iShares Core S&P 500 ETF (IVV)",
                sales?.metric || "€377.50",
                sales?.change || "+0.0%",
                extractValue(sales?.metric),
                {
                  bg: "bg-slate-700/30",
                  border: "border-blue-800/30",
                  hoverBorder: "hover:border-blue-700/50",
                  text: "text-blue-300",
                  textLight: "text-blue-200",
                  badge: "bg-blue-800/30",
                  badgeBorder: "border-blue-700/40",
                },
                e,
              )
            }
            onMouseLeave={handlePanelLeave}
          >
            <h3 className="text-xs font-bold text-blue-300 mb-3 uppercase tracking-wide flex-wrap flex items-center gap-1.5">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              {sales?.title || "iShares Core S&P 500 ETF (IVV)"}
            </h3>
            <p className="text-xs font-medium text-slate-400 mb-3">
              {sales?.description || "iShares Core S&P 500 ETF"} ({currency})
            </p>
            <div className="space-y-2">
              <div className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/20">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold tabular-nums">
                    {loading
                      ? "..."
                      : convertMetric(sales?.metric || "â‚¬377.50")}
                  </p>
                  {!loading &&
                    (() => {
                      const data = getSparklineData(
                        "sales",
                        extractValue(sales?.metric),
                      );
                      const path = buildSparklinePath(data, 80, 24);
                      const up = data[data.length - 1] >= data[0];
                      return (
                        <svg
                          className="w-20 h-6 shrink-0"
                          viewBox="0 0 80 24"
                          preserveAspectRatio="none"
                        >
                          <path
                            d={path}
                            fill="none"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={up ? "text-green-400" : "text-red-400"}
                          />
                        </svg>
                      );
                    })()}
                </div>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30 w-fit mx-auto ">
                <div className="flex flex-col items-start gap-y-1 w-fit">
                  <div
                    className={`text-xs font-bold ${getChangeStyle(sales?.change).text} ${getChangeStyle(sales?.change).bg} px-2 py-0.5 rounded-lg border ${getChangeStyle(sales?.change).border} inline-block`}
                  >
                    {loading ? "..." : sales?.change || "+0.0%"}
                  </div>
                  {!loading &&
                    (() => {
                      const tp = getTimePeriods(sales?.change);
                      return tp ? (
                        <>
                          <div
                            className={`text-xs font-bold ${getChangeStyle(sales?.change).text} ${getChangeStyle(sales?.change).bg} px-2 py-0.5 rounded-lg border ${getChangeStyle(sales?.change).border} inline-block`}
                          >
                            1d: {tp.d1}
                          </div>
                          <div
                            className={`text-xs font-bold ${getChangeStyle(sales?.change).text} ${getChangeStyle(sales?.change).bg} px-2 py-0.5 rounded-lg border ${getChangeStyle(sales?.change).border} inline-block`}
                          >
                            1m: {tp.m1}
                          </div>
                          <div
                            className={`text-xs font-bold ${getChangeStyle(sales?.change).text} ${getChangeStyle(sales?.change).bg} px-2 py-0.5 rounded-lg border ${getChangeStyle(sales?.change).border} inline-block`}
                          >
                            1y: {tp.y1}
                          </div>
                        </>
                      ) : null;
                    })()}
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Panel — ETF */}
          <div
            className="bg-slate-700/30 rounded-xl shadow-lg p-5 border-t-[3px] border-blue-500/60 hover:shadow-xl transition-shadow hover:border-t-blue-400 cursor-pointer relative overflow-visible"
            onMouseEnter={(e) =>
              handlePanelEnter(
                "acwi",
                analytics?.title || "iShares MSCI ACWI ETF (ACWI)",
                analytics?.metric || "€90.62",
                analytics?.change || "+0.0%",
                extractValue(analytics?.metric),
                {
                  bg: "bg-slate-700/30",
                  border: "border-blue-800/30",
                  hoverBorder: "hover:border-blue-700/50",
                  text: "text-blue-300",
                  textLight: "text-blue-200",
                  badge: "bg-blue-800/30",
                  badgeBorder: "border-blue-700/40",
                },
                e,
              )
            }
            onMouseLeave={handlePanelLeave}
          >
            <h3 className="text-xs font-bold text-blue-300 mb-3 uppercase tracking-wide flex-wrap flex items-center gap-1.5">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              {analytics?.title || "iShares MSCI ACWI ETF (ACWI)"}
            </h3>
            <p className="text-xs font-medium text-slate-400 mb-3">
              {analytics?.description || "iShares MSCI World ETF"} ({currency})
            </p>
            <div className="space-y-2">
              <div className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/20">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold tabular-nums">
                    {loading
                      ? "..."
                      : convertMetric(analytics?.metric || "€90.62")}
                  </p>
                  {!loading &&
                    (() => {
                      const data = getSparklineData(
                        "acwi",
                        extractValue(analytics?.metric),
                      );
                      const path = buildSparklinePath(data, 80, 24);
                      const up = data[data.length - 1] >= data[0];
                      return (
                        <svg
                          className="w-20 h-6 shrink-0"
                          viewBox="0 0 80 24"
                          preserveAspectRatio="none"
                        >
                          <path
                            d={path}
                            fill="none"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={up ? "text-green-400" : "text-red-400"}
                          />
                        </svg>
                      );
                    })()}
                </div>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30 w-fit mx-auto ">
                <div className="flex flex-col items-start gap-y-1 w-fit">
                  <div
                    className={`text-xs font-bold ${getChangeStyle(analytics?.change).text} ${getChangeStyle(analytics?.change).bg} px-2 py-0.5 rounded-lg border ${getChangeStyle(analytics?.change).border} inline-block`}
                  >
                    {loading ? "..." : analytics?.change || "+0.0%"}
                  </div>
                  {!loading &&
                    (() => {
                      const tp = getTimePeriods(analytics?.change);
                      return tp ? (
                        <>
                          <div
                            className={`text-xs font-bold ${getChangeStyle(analytics?.change).text} ${getChangeStyle(analytics?.change).bg} px-2 py-0.5 rounded-lg border ${getChangeStyle(analytics?.change).border} inline-block`}
                          >
                            1d: {tp.d1}
                          </div>
                          <div
                            className={`text-xs font-bold ${getChangeStyle(analytics?.change).text} ${getChangeStyle(analytics?.change).bg} px-2 py-0.5 rounded-lg border ${getChangeStyle(analytics?.change).border} inline-block`}
                          >
                            1m: {tp.m1}
                          </div>
                          <div
                            className={`text-xs font-bold ${getChangeStyle(analytics?.change).text} ${getChangeStyle(analytics?.change).bg} px-2 py-0.5 rounded-lg border ${getChangeStyle(analytics?.change).border} inline-block`}
                          >
                            1y: {tp.y1}
                          </div>
                        </>
                      ) : null;
                    })()}
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Panel — Certificate */}
          <div
            className="bg-slate-700/30 rounded-xl shadow-lg p-5 border-t-[3px] border-rose-500/60 hover:shadow-xl transition-shadow hover:border-t-rose-400 cursor-pointer relative overflow-visible"
            onMouseEnter={(e) =>
              handlePanelEnter(
                "ctt",
                _t("panel.cttTitle"),
                revenue?.metric || "€100 @ 0.40%/mes",
                revenue?.change || "+0.0%",
                extractValue(revenue?.metric),
                {
                  bg: "bg-slate-700/30",
                  border: "border-rose-900/40",
                  hoverBorder: "hover:border-rose-800/50",
                  text: "text-rose-300",
                  textLight: "text-rose-200",
                  badge: "bg-rose-800/30",
                  badgeBorder: "border-rose-700/40",
                },
                e,
              )
            }
            onMouseLeave={handlePanelLeave}
          >
            <h3 className="text-xs font-bold text-rose-300 mb-3 uppercase tracking-wide flex-wrap flex items-center gap-1.5">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21h18M6 18v-8M10 18v-8M14 18v-8M18 18v-8M4 10l8-6 8 6"
                />
              </svg>
              {_t("panel.cttTitle")}
            </h3>
            <p className="text-xs font-medium text-slate-400 mb-3">
              {revenue?.description || "Portuguese Savings Rate"} ({currency})
            </p>
            <div className="space-y-2">
              <div className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/20">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold tabular-nums">
                    {loading
                      ? "..."
                      : translateSuffixes(
                          convertMetric(revenue?.metric || "€100 @ 0.40%/mes"),
                        )}
                  </p>
                  {!loading &&
                    (() => {
                      const data = getSparklineData(
                        "ctt",
                        extractValue(revenue?.metric),
                      );
                      const path = buildSparklinePath(data, 80, 24);
                      const up = data[data.length - 1] >= data[0];
                      return (
                        <svg
                          className="w-20 h-6 shrink-0"
                          viewBox="0 0 80 24"
                          preserveAspectRatio="none"
                        >
                          <path
                            d={path}
                            fill="none"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={up ? "text-green-400" : "text-red-400"}
                          />
                        </svg>
                      );
                    })()}
                </div>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30 w-fit mx-auto ">
                <div className="flex flex-col items-start gap-y-1 w-fit">
                  <div
                    className={`text-xs font-bold ${getChangeStyle(revenue?.change).text} ${getChangeStyle(revenue?.change).bg} px-2 py-0.5 rounded-lg border ${getChangeStyle(revenue?.change).border} inline-block`}
                  >
                    {loading
                      ? "..."
                      : translateSuffixes(revenue?.change || "+0.0%")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Panel — Interest */}
          <div
            className="bg-slate-700/30 rounded-xl shadow-lg p-5 border-t-[3px] border-teal-500/60 hover:shadow-xl transition-shadow hover:border-t-teal-400 cursor-pointer relative overflow-visible"
            onMouseEnter={(e) =>
              handlePanelEnter(
                "euribor",
                performance?.title || "EURIBOR Interest Rates",
                performance?.metric || "€ 4.15% (12M)",
                performance?.change || "+0.0%",
                extractValue(performance?.metric),
                {
                  bg: "bg-slate-700/30",
                  border: "border-teal-800/30",
                  hoverBorder: "hover:border-teal-700/50",
                  text: "text-teal-300",
                  textLight: "text-teal-200",
                  badge: "bg-teal-800/30",
                  badgeBorder: "border-teal-700/40",
                },
                e,
              )
            }
            onMouseLeave={handlePanelLeave}
          >
            <h3 className="text-xs font-bold text-teal-300 mb-3 uppercase tracking-wide flex-wrap flex items-center gap-1.5">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              {performance?.title || "EURIBOR Interest Rates"}
            </h3>
            <p className="text-xs font-medium text-slate-400 mb-3">
              {performance?.description || "Reference Interest Rate"} (
              {currency})
            </p>
            <div className="space-y-2">
              <div className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/20">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold tabular-nums">
                    {loading
                      ? "..."
                      : convertMetric(performance?.metric || "€ 4.15% (12M)")}
                  </p>
                  {!loading &&
                    (() => {
                      const data = getSparklineData(
                        "euribor",
                        extractValue(performance?.metric),
                      );
                      const path = buildSparklinePath(data, 80, 24);
                      const up = data[data.length - 1] >= data[0];
                      return (
                        <svg
                          className="w-20 h-6 shrink-0"
                          viewBox="0 0 80 24"
                          preserveAspectRatio="none"
                        >
                          <path
                            d={path}
                            fill="none"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={up ? "text-green-400" : "text-red-400"}
                          />
                        </svg>
                      );
                    })()}
                </div>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30 w-fit mx-auto ">
                <div className="flex flex-col items-start gap-y-1 w-fit">
                  <div
                    className={`text-xs font-bold ${getChangeStyle(performance?.change).text} ${getChangeStyle(performance?.change).bg} px-2 py-0.5 rounded-lg border ${getChangeStyle(performance?.change).border} inline-block`}
                  >
                    {loading ? "..." : performance?.change || "+0.0%"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Assets Section */}
        {addedPanels.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-blue-300">
                {_t("customAssets.title")}
              </h2>
              <button
                onClick={clearAllPanels}
                className="text-xs text-slate-400 hover:text-red-300 transition-colors px-3 py-1.5 bg-slate-700/30 border border-slate-600/40 rounded-lg hover:border-red-700/40"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addedPanels.map((panel, i) => (
                <div
                  key={panel.id}
                  className={`cursor-pointer relative overflow-visible ${panel.color.bg} rounded-xl shadow-lg p-5 border-t-[3px] ${panel.color.border.replace("-800/30", "-500/60")} hover:shadow-xl transition-all group`}
                  onMouseEnter={(e) =>
                    handlePanelEnter(
                      panel.id,
                      `${panel.name} (${panel.symbol})`,
                      panel.metric,
                      panel.change,
                      extractValue(panel.metric),
                      panel.color,
                      e,
                    )
                  }
                  onMouseLeave={handlePanelLeave}
                >
                  {/* Close button */}
                  <button
                    onClick={() => removePanel(panel.id, panel.symbol)}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-700/50 text-slate-400 hover:bg-red-500/30 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <h3
                    className={`text-sm font-bold ${panel.color.text} mb-4 uppercase tracking-wide flex-wrap flex items-center gap-1.5`}
                  >
                    <svg
                      className="w-4 h-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    {panel.name} ({panel.symbol})
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mb-3">
                    {panel.symbol} Â·{" "}
                    {panel.loading
                      ? _t("panel.loadingText")
                      : _t("panel.liveQuote")}
                  </p>
                  <div className="space-y-2">
                    <div className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/20">
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold tabular-nums">
                          {panel.loading ? "..." : convertMetric(panel.metric)}
                        </p>
                        {!panel.loading &&
                          (() => {
                            const data = getSparklineData(
                              panel.id,
                              extractValue(panel.metric),
                            );
                            const path = buildSparklinePath(data, 80, 24);
                            const up = data[data.length - 1] >= data[0];
                            return (
                              <svg
                                className="w-20 h-6 shrink-0"
                                viewBox="0 0 80 24"
                                preserveAspectRatio="none"
                              >
                                <path
                                  d={path}
                                  fill="none"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className={
                                    up ? "text-green-400" : "text-red-400"
                                  }
                                />
                              </svg>
                            );
                          })()}
                      </div>
                    </div>
                    <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30 w-fit mx-auto ">
                      <div className="flex flex-col items-start gap-y-1 w-fit">
                        <div
                          className={`text-xs font-bold ${getChangeStyle(panel.change).text} ${getChangeStyle(panel.change).bg} px-2 py-0.5 rounded-lg border ${getChangeStyle(panel.change).border} inline-block`}
                        >
                          {panel.loading ? "..." : panel.change}
                        </div>
                        {!panel.loading &&
                          (panel.type === "ETF" || panel.type === "Stock") &&
                          (() => {
                            const tp = getTimePeriods(panel.change);
                            return tp ? (
                              <>
                                <div
                                  className={`text-xs font-bold ${getChangeStyle(panel.change).text} ${getChangeStyle(panel.change).bg} px-2 py-0.5 rounded-lg border ${getChangeStyle(panel.change).border} inline-block`}
                                >
                                  1d: {tp.d1}
                                </div>
                                <div
                                  className={`text-xs font-bold ${getChangeStyle(panel.change).text} ${getChangeStyle(panel.change).bg} px-2 py-0.5 rounded-lg border ${getChangeStyle(panel.change).border} inline-block`}
                                >
                                  1m: {tp.m1}
                                </div>
                                <div
                                  className={`text-xs font-bold ${getChangeStyle(panel.change).text} ${getChangeStyle(panel.change).bg} px-2 py-0.5 rounded-lg border ${getChangeStyle(panel.change).border} inline-block`}
                                >
                                  1y: {tp.y1}
                                </div>
                              </>
                            ) : null;
                          })()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16">
          <div className="bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-700">
            <h2 className="text-xl font-bold text-slate-200 mb-4">
              {_t("datasources.title")}
            </h2>
            <p className="text-slate-300 mb-6 text-lg font-medium">
              {_t("datasources.description", { currency })}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-l-blue-800 pl-5 py-3 bg-slate-700/20 rounded-lg">
                <h3 className="font-bold text-blue-300 mb-2 text-lg flex items-center gap-2">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  {_t("datasources.ivv.name")}
                </h3>
                <p className="text-sm text-blue-200 leading-relaxed">
                  {_t("datasources.ivv.desc", { currency })}
                </p>
              </div>
              <div className="border-l-4 border-l-blue-800 pl-5 py-3 bg-slate-700/20 rounded-lg">
                <h3 className="font-bold text-blue-300 mb-2 text-lg flex items-center gap-2">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
                    />
                  </svg>
                  {_t("datasources.acwi.name")}
                </h3>
                <p className="text-sm text-blue-200 leading-relaxed">
                  {_t("datasources.acwi.desc")}
                </p>
              </div>
              <div className="border-l-4 border-l-rose-900 pl-5 py-3 bg-slate-700/20 rounded-lg">
                <h3 className="font-bold text-rose-300 mb-2 text-lg flex items-center gap-2">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 21h18M6 18v-8M10 18v-8M14 18v-8M18 18v-8M4 10l8-6 8 6"
                    />
                  </svg>
                  {_t("datasources.ctt.name")}
                </h3>
                <p className="text-sm text-rose-200 leading-relaxed">
                  {_t("datasources.ctt.desc")}
                </p>
              </div>
              <div className="border-l-4 border-l-teal-800 pl-5 py-3 bg-slate-700/20 rounded-lg">
                <h3 className="font-bold text-teal-300 mb-2 text-lg flex items-center gap-2">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  {_t("datasources.euribor.name")}
                </h3>
                <p className="text-sm text-teal-200 leading-relaxed">
                  {_t("datasources.euribor.desc")}
                </p>
              </div>
              {addedDataSources.map((ds, i) => (
                <div
                  key={`${ds.symbol}-${i}`}
                  className={`border-l-4 ${ds.color.border} pl-5 py-3 ${ds.color.bg} rounded-lg`}
                >
                  <h3
                    className={`font-bold ${ds.color.text} mb-2 text-lg flex items-center gap-2`}
                  >
                    <svg
                      className="w-4 h-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    {ds.name} ({ds.symbol})
                  </h3>
                  <p
                    className={`text-sm ${ds.color.textLight} leading-relaxed`}
                  >
                    {_t("datasources.custom.desc", { currency })}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 bg-slate-700/20 rounded-lg border border-slate-600/40">
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                <strong className="text-slate-200 flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 16v-4M12 8h.01"
                    />
                  </svg>
                  Note:
                </strong>
                {_t("datasources.note", { currency })}
              </p>
            </div>
          </div>
        </div>

        {/* Tooltip overlay */}
        {tooltipInfo &&
          (() => {
            const data = getSparklineData(
              tooltipInfo.id + "_big",
              tooltipInfo.baseValue,
            );
            const path = buildSparklinePath(data, 200, 80);
            const up = data[data.length - 1] >= data[0];
            const changeNum = parseFloat(
              (tooltipInfo.change || "0").replace(/[+%]/g, ""),
            );
            const isUp = !isNaN(changeNum) && changeNum >= 0;
            const high =
              Math.round((Math.max(...data) + Math.random() * 0.5) * 100) / 100;
            const low =
              Math.round((Math.min(...data) - Math.random() * 0.5) * 100) / 100;
            const open = Math.round(data[0] * 100) / 100;
            const close = Math.round(data[data.length - 1] * 100) / 100;
            const volume = Math.round(
              Math.random() * 5000000 + 1000000,
            ).toLocaleString();
            return (
              <div
                className="fixed z-50 w-[340px] bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-xl shadow-2xl p-5 pointer-events-none"
                style={{ left: tooltipPos.x, top: Math.max(tooltipPos.y, 80) }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-200 truncate pr-2">
                    {tooltipInfo.title}
                  </h4>
                  <span
                    className={`text-xs font-bold ${isUp ? "text-green-400" : "text-red-300"} shrink-0`}
                  >
                    {translateSuffixes(tooltipInfo.change)}
                  </span>
                </div>
                <svg
                  className="w-full h-20 mb-3"
                  viewBox="0 0 200 80"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={isUp ? "#4ade80" : "#f87171"}
                        stopOpacity="0.25"
                      />
                      <stop
                        offset="100%"
                        stopColor={isUp ? "#4ade80" : "#f87171"}
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path d={path + ` L200,80 L0,80 Z`} fill="url(#chartGrad)" />
                  <path
                    d={path}
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isUp ? "text-green-400" : "text-red-300"}
                  />
                </svg>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Open</span>
                    <span className="text-slate-200 font-medium tabular-nums">
                      {open.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">High</span>
                    <span className="text-green-400 font-medium tabular-nums">
                      {high.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Close</span>
                    <span className="text-slate-200 font-medium tabular-nums">
                      {close.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Low</span>
                    <span className="text-red-300 font-medium tabular-nums">
                      {low.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between col-span-2 border-t border-slate-700 pt-2 mt-1">
                    <span className="text-slate-500">Volume</span>
                    <span className="text-slate-200 font-medium tabular-nums">
                      {volume}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
      </main>
    </div>
  );
}
