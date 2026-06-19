import { NextRequest, NextResponse } from "next/server";

// Static dataset of common ETFs, stocks, and indexes for demo mode
const STATIC_ASSETS = [
  // Major ETFs
  {
    symbol: "IVV",
    name: "iShares Core S&P 500 ETF",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "ACWI",
    name: "iShares MSCI ACWI ETF",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "QQQ",
    name: "Invesco QQQ Trust (Nasdaq)",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "BND",
    name: "Vanguard Total Bond Market ETF",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "VWO",
    name: "Vanguard FTSE Emerging Markets ETF",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "VNQ",
    name: "Vanguard Real Estate ETF",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "GLD",
    name: "SPDR Gold Shares",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "EEM",
    name: "iShares MSCI Emerging Markets ETF",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "EFA",
    name: "iShares MSCI EAFE ETF",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "XLF",
    name: "Financial Select Sector SPDR Fund",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "XLK",
    name: "Technology Select Sector SPDR Fund",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "XLE",
    name: "Energy Select Sector SPDR Fund",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "XLV",
    name: "Health Care Select Sector SPDR Fund",
    type: "ETF",
    region: "USA",
    currency: "USD",
  },

  // European ETFs
  {
    symbol: "EUNL.DE",
    name: "iShares Core MSCI World UCITS ETF",
    type: "ETF",
    region: "Europe",
    currency: "EUR",
  },
  {
    symbol: "SXR8.DE",
    name: "iShares Core S&P 500 UCITS ETF",
    type: "ETF",
    region: "Europe",
    currency: "EUR",
  },
  {
    symbol: "IS3N.DE",
    name: "iShares MSCI Emerging Markets UCITS ETF",
    type: "ETF",
    region: "Europe",
    currency: "EUR",
  },
  {
    symbol: "IUSN.DE",
    name: "iShares MSCI World Small Cap UCITS ETF",
    type: "ETF",
    region: "Europe",
    currency: "EUR",
  },
  {
    symbol: "LYX0Q.DE",
    name: "Amundi MSCI World UCITS ETF",
    type: "ETF",
    region: "Europe",
    currency: "EUR",
  },

  // Popular Stocks
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "Stock",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    type: "Stock",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    type: "Stock",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    type: "Stock",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    type: "Stock",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    type: "Stock",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    type: "Stock",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    type: "Stock",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    type: "Stock",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    type: "Stock",
    region: "USA",
    currency: "USD",
  },

  // European Stocks
  {
    symbol: "SAP.DE",
    name: "SAP SE",
    type: "Stock",
    region: "Europe",
    currency: "EUR",
  },
  {
    symbol: "SIE.DE",
    name: "Siemens AG",
    type: "Stock",
    region: "Europe",
    currency: "EUR",
  },
  {
    symbol: "MC.PA",
    name: "LVMH Moët Hennessy",
    type: "Stock",
    region: "Europe",
    currency: "EUR",
  },
  {
    symbol: "SAN.MC",
    name: "Banco Santander",
    type: "Stock",
    region: "Europe",
    currency: "EUR",
  },
  {
    symbol: "BBVA.MC",
    name: "Banco Bilbao Vizcaya Argentaria",
    type: "Stock",
    region: "Europe",
    currency: "EUR",
  },
  {
    symbol: "TEF.MC",
    name: "Telefónica",
    type: "Stock",
    region: "Europe",
    currency: "EUR",
  },
  {
    symbol: "ITX.MC",
    name: "Inditex (Zara)",
    type: "Stock",
    region: "Europe",
    currency: "EUR",
  },
  {
    symbol: "ENGI.PA",
    name: "Engie SA",
    type: "Stock",
    region: "Europe",
    currency: "EUR",
  },

  // Indexes
  {
    symbol: "SPX",
    name: "S&P 500 Index",
    type: "Index",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "IXIC",
    name: "Nasdaq Composite Index",
    type: "Index",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "DJI",
    name: "Dow Jones Industrial Average",
    type: "Index",
    region: "USA",
    currency: "USD",
  },
  {
    symbol: "STOXX50E",
    name: "Euro STOXX 50 Index",
    type: "Index",
    region: "Europe",
    currency: "EUR",
  },
  {
    symbol: "DAX",
    name: "DAX Performance-Index",
    type: "Index",
    region: "Europe",
    currency: "EUR",
  },
  {
    symbol: "IBEX",
    name: "IBEX 35 Index",
    type: "Index",
    region: "Europe",
    currency: "EUR",
  },
  {
    symbol: "PSI20",
    name: "PSI-20 Index (Portugal)",
    type: "Index",
    region: "Europe",
    currency: "EUR",
  },
];

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query || query.trim().length < 1) {
    return NextResponse.json({ results: [] });
  }

  const q = query.trim().toLowerCase();

  try {
    // Try live API first
    const apiKey = "demo"; // Get a free key from https://www.alphavantage.co/
    const response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(q)}&apikey=${apiKey}`,
    );
    const data = await response.json();

    // If live API returned results, use them
    if (data.bestMatches && data.bestMatches.length > 0) {
      const results = data.bestMatches.map((match: any) => ({
        symbol: match["1. symbol"],
        name: match["2. name"],
        type: match["3. type"],
        region: match["4. region"],
        currency: match["8. currency"],
      }));
      return NextResponse.json({ results });
    }

    // If live API failed (demo key limitation), fall back to static dataset
    throw new Error("API limit reached, using static data");
  } catch {
    // Static search fallback
    const results = STATIC_ASSETS.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(q) ||
        asset.name.toLowerCase().includes(q) ||
        asset.type.toLowerCase().includes(q),
    ).slice(0, 20);

    return NextResponse.json({ results });
  }
}
