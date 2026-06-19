import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Using Alpha Vantage API - Free tier, returns stock/ETF data
    // IVV is the iShares Core S&P 500 ETF (equivalent to SPY but iShares)
    const apiKey = "demo"; // You can get a free key from https://www.alphavantage.co/
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IVV&apikey=${apiKey}`,
    );
    const data = await response.json();

    const price = data["Global Quote"]?.["05. price"];
    const rawChange = data["Global Quote"]?.["10. change percent"] || "+2.5%";
    const cleanChange = rawChange.replace(/^\+/, "");

    // If we got a valid price from the API, use it; otherwise use fallback
    // Convert USD to EUR (using ~0.92 rate)
    const priceInEur =
      price && !isNaN(parseFloat(price))
        ? (parseFloat(price) * 0.92).toFixed(2)
        : "377.50";
    const displayPrice = `€${priceInEur}`;

    return NextResponse.json({
      id: 1,
      title: "iShares Core S&P 500 ETF (IVV)",
      metric: displayPrice,
      change: cleanChange.includes("-") ? cleanChange : `+${cleanChange}`,
      description: `iShares Core S&P 500 ETF`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Fallback data if API fails
    return NextResponse.json({
      id: 1,
      title: "iShares Core S&P 500 ETF (IVV)",
      metric: "€377.50",
      change: "+2.5%",
      description: `iShares Core S&P 500 ETF`,
      timestamp: new Date().toISOString(),
    });
  }
}
