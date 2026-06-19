import { NextRequest, NextResponse } from "next/server";

// Static fallback prices for common symbols (in EUR)
const STATIC_PRICES: Record<string, { price: string; change: string }> = {
  // ETFs
  IVV: { price: "€377.50", change: "+2.5%" },
  SPY: { price: "€375.80", change: "+2.3%" },
  ACWI: { price: "€90.62", change: "+8.3%" },
  VTI: { price: "€210.45", change: "+1.8%" },
  QQQ: { price: "€380.20", change: "+3.1%" },
  BND: { price: "€68.90", change: "-0.2%" },
  VWO: { price: "€38.50", change: "+1.2%" },
  VNQ: { price: "€82.30", change: "+0.9%" },
  GLD: { price: "€185.40", change: "+0.5%" },
  EEM: { price: "€36.80", change: "+1.5%" },
  EFA: { price: "€72.10", change: "+1.1%" },
  XLF: { price: "€34.60", change: "+0.8%" },
  XLK: { price: "€195.30", change: "+2.7%" },
  XLE: { price: "€82.40", change: "-0.3%" },
  XLV: { price: "€132.50", change: "+0.6%" },
  EUNL: { price: "€62.35", change: "+1.4%" },
  "EUNL.DE": { price: "€62.35", change: "+1.4%" },
  SXR8: { price: "€468.20", change: "+2.2%" },
  "SXR8.DE": { price: "€468.20", change: "+2.2%" },
  IS3N: { price: "€5.82", change: "+1.1%" },
  "IS3N.DE": { price: "€5.82", change: "+1.1%" },
  IUSN: { price: "€4.95", change: "+0.7%" },
  "IUSN.DE": { price: "€4.95", change: "+0.7%" },
  LYX0Q: { price: "€424.50", change: "+2.0%" },
  "LYX0Q.DE": { price: "€424.50", change: "+2.0%" },

  // Stocks
  AAPL: { price: "€175.30", change: "+1.2%" },
  MSFT: { price: "€340.80", change: "+2.0%" },
  GOOGL: { price: "€138.50", change: "+0.9%" },
  AMZN: { price: "€178.20", change: "+1.5%" },
  NVDA: { price: "€785.60", change: "+4.2%" },
  META: { price: "€475.30", change: "+2.1%" },
  TSLA: { price: "€198.70", change: "-0.8%" },
  JPM: { price: "€165.40", change: "+0.7%" },
  V: { price: "€258.90", change: "+0.4%" },
  JNJ: { price: "€146.20", change: "+0.3%" },

  // European Stocks
  "SAP.DE": { price: "€168.50", change: "+1.3%" },
  "SIE.DE": { price: "€175.20", change: "+0.8%" },
  "MC.PA": { price: "€725.40", change: "+1.9%" },
  "SAN.MC": { price: "€4.85", change: "+0.5%" },
  "BBVA.MC": { price: "€9.72", change: "+1.1%" },
  "TEF.MC": { price: "€3.92", change: "-0.2%" },
  "ITX.MC": { price: "€41.60", change: "+1.4%" },
  "ENGI.PA": { price: "€14.85", change: "+0.6%" },

  // Indexes (mock values, indexes aren't tradeable but shown for reference)
  SPX: { price: "€4,950", change: "+1.8%" },
  IXIC: { price: "€15,800", change: "+2.3%" },
  DJI: { price: "€36,200", change: "+1.5%" },
  STOXX50E: { price: "€4,850", change: "+1.1%" },
  DAX: { price: "€18,200", change: "+0.9%" },
  IBEX: { price: "€11,400", change: "+0.7%" },
  PSI20: { price: "€6,350", change: "+0.4%" },
};

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "Symbol required" }, { status: 400 });
  }

  // Normalize symbol for lookup
  const upperSymbol = symbol.toUpperCase();

  try {
    const apiKey = "demo";
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(upperSymbol)}&apikey=${apiKey}`,
    );
    const data = await response.json();

    const quote = data["Global Quote"] || {};
    const price = quote["05. price"];
    let changePercent = quote["10. change percent"] || "";

    // If we got valid data from the API
    if (price && !isNaN(parseFloat(price))) {
      const displayPrice = `€${(parseFloat(price) * 0.92).toFixed(2)}`;
      const cleanChange = changePercent.replace("%", "").trim();
      const prefix = cleanChange.startsWith("-") ? "" : "+";

      return NextResponse.json({
        symbol: upperSymbol,
        metric: displayPrice,
        change: `${prefix}${cleanChange}%`,
        timestamp: new Date().toISOString(),
      });
    }

    // Fall back to static data
    throw new Error("Using static data");
  } catch {
    const staticData = STATIC_PRICES[upperSymbol];
    if (staticData) {
      return NextResponse.json({
        symbol: upperSymbol,
        metric: staticData.price,
        change: staticData.change,
        timestamp: new Date().toISOString(),
      });
    }

    // Generic fallback for unknown symbols
    return NextResponse.json({
      symbol: upperSymbol,
      metric: "€---",
      change: "+0.0%",
      timestamp: new Date().toISOString(),
    });
  }
}
