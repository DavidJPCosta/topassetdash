# ETF Dashboard - Real API Integration

## 🚀 Live Data Sources

This dashboard now connects to **real public APIs** that provide live financial data. No authentication required!

### Panel 1: SPY ETF (Stock Market)
**API:** Alpha Vantage (Free Tier)  
**URL:** https://www.alphavantage.co/  
**Data:** SPY - S&P 500 ETF Trading Price  
**Updates:** Real-time stock quote data

```
GET /api/dashboard/sales
Returns: SPY ETF current price and daily change
```

**Features:**
- Live stock price quotes
- Daily percentage change
- 500+ stocks/ETFs supported
- Free tier: 5 calls/minute

**To upgrade:** Get a free API key at https://www.alphavantage.co/

---

### Panel 2: Ethereum (Cryptocurrency)
**API:** CoinGecko (Free, No Auth)  
**URL:** https://coingecko.com/  
**Data:** Ethereum Price in USD  
**Updates:** Every minute

```
GET /api/dashboard/analytics
Returns: Ethereum current price (24h data)
```

**Features:**
- No API key required
- Cryptocurrency prices
- Market cap data available
- Highly reliable and fast

**Example:** `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`

---

### Panel 3: Forex Volume (Currency Exchange)
**API:** Open Exchange Rates (Free Tier)  
**URL:** https://open.er-api.com/  
**Data:** EUR/USD Exchange Rate  
**Updates:** Multiple times daily

```
GET /api/dashboard/revenue
Returns: Exchange rate and calculated volume
```

**Features:**
- Multiple currency pairs
- Historical rates available
- No authentication needed
- Reliable currency data

**Example:** `https://open.er-api.com/v6/latest/USD`

---

### Panel 4: Bitcoin (Major Cryptocurrency)
**API:** CoinGecko (Free, No Auth)  
**URL:** https://coingecko.com/  
**Data:** Bitcoin Price in USD  
**Updates:** Every minute

```
GET /api/dashboard/performance
Returns: Bitcoin current price and performance
```

**Features:**
- Real-time BTC price
- 24h high/low available
- Market dominance data
- No rate limiting for free users

**Example:** `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`

---

## 📊 Data Refresh

- **Automatic Refresh:** Every 30 seconds
- **Loading State:** Shows "..." while fetching
- **Fallback Data:** If API fails, shows last known values
- **Error Handling:** Graceful degradation with default values

---

## 🔄 API Endpoints

Your dashboard backend APIs:

| Endpoint | Source | Frequency |
|----------|--------|-----------|
| `/api/dashboard/sales` | Alpha Vantage | Real-time |
| `/api/dashboard/analytics` | CoinGecko | Minute |
| `/api/dashboard/revenue` | Open Exchange Rates | Hourly |
| `/api/dashboard/performance` | CoinGecko | Minute |

---

## 🛠️ Using These APIs Directly

You can call these public APIs directly from your applications:

### Alpha Vantage
```bash
curl "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=demo"
```

### CoinGecko
```bash
curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
```

### Open Exchange Rates
```bash
curl "https://open.er-api.com/v6/latest/USD"
```

---

## 📝 Rate Limits

| API | Free Tier Limit | Notes |
|-----|-----------------|-------|
| Alpha Vantage | 5 req/min | Stock data |
| CoinGecko | Unlimited | Crypto data |
| Open Exchange Rates | 1500/month | Currency data |

---

## 🔐 Security Notes

- ✅ All APIs are public and safe to use
- ✅ CoinGecko requires no authentication
- ✅ Open Exchange Rates requires no authentication
- ⚠️ Alpha Vantage demo key has limits (upgrade for production)
- ✅ API calls are made server-side (from Next.js backend)
- ✅ No sensitive data is exposed to frontend

---

## 🚀 To Use Production API Keys

### Alpha Vantage (For SPY/Stock Data)
1. Visit https://www.alphavantage.co/
2. Get your free API key
3. Replace `demo` in `/app/api/dashboard/sales/route.ts`:

```typescript
const apiKey = 'YOUR_KEY_HERE'
```

### Other APIs
- CoinGecko: No key needed (already unlimited)
- Open Exchange Rates: No key needed for basic tier

---

## 📚 Documentation Links

- **Alpha Vantage:** https://www.alphavantage.co/documentation/
- **CoinGecko:** https://docs.coingecko.com/reference/introduction
- **Open Exchange Rates:** https://open.er-api.com/docs

---

## 💡 Example: Adding More ETFs

To track additional ETFs, create new endpoints:

```typescript
// app/api/dashboard/bonds/route.ts
export async function GET() {
  const response = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=BND&apikey=YOUR_KEY`
  )
  const data = await response.json()
  // Process and return data
}
```

Then add to main page and reference it.

---

## ✅ Testing the APIs

Visit these URLs in your browser to see raw data:

- SPY: http://localhost:3000/api/dashboard/sales
- ETH: http://localhost:3000/api/dashboard/analytics  
- Forex: http://localhost:3000/api/dashboard/revenue
- BTC: http://localhost:3000/api/dashboard/performance

---

**Status:** ✅ All APIs working and returning real data!
