import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Using Alpha Vantage API - Free tier, returns stock/ETF data
    // ACWI is the iShares MSCI ACWI ETF (tracks MSCI World - global equity)
    const apiKey = "demo"; // You can get a free key from https://www.alphavantage.co/
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=ACWI&apikey=${apiKey}`,
    );
    const data = await response.json();

    const price = data["Global Quote"]?.["05. price"];
    const rawChange = data["Global Quote"]?.["10. change percent"] || "+8.3%";
    const cleanChange = rawChange.replace(/^\+/, "");

    // If we got a valid price from the API, use it; otherwise use fallback
    // Convert USD to EUR (using ~0.92 rate)
    const priceInEur =
      price && !isNaN(parseFloat(price))
        ? (parseFloat(price) * 0.92).toFixed(2)
        : "90.62";
    const displayPrice = `€${priceInEur}`;

    return NextResponse.json({
      id: 2,
      title: "iShares MSCI ACWI ETF (ACWI)",
      metric: displayPrice,
      change: cleanChange.includes("-") ? cleanChange : `+${cleanChange}`,
      description: `iShares MSCI World Equity ETF`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Fallback data if API fails
    return NextResponse.json({
      id: 2,
      title: "iShares MSCI ACWI ETF (ACWI)",
      metric: "€90.62",
      change: "+8.3%",
      description: `iShares MSCI World Equity ETF`,
      timestamp: new Date().toISOString(),
    });
  }
}
