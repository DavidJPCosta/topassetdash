# Dashboard Application

A modern Next.js dashboard with mockup API endpoints ready for backend integration.

## ✨ Features

- **4 Dashboard Panels**: Display key metrics with real-time data fetching
  - Sales Overview
  - User Analytics
  - Revenue Trends
  - Performance Metrics
  
- **Top Navigation Bar**: Dynamic menu links fetched from API
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Mockup API Endpoints**: Ready to be replaced with real backend APIs
- **TypeScript**: Full type safety
- **Error Handling**: Graceful error states and loading indicators

## 📁 Project Structure

```
dashboard/
├── app/
│   ├── api/
│   │   ├── dashboard/
│   │   │   ├── sales/route.ts
│   │   │   ├── analytics/route.ts
│   │   │   ├── revenue/route.ts
│   │   │   └── performance/route.ts
│   │   └── navigation/
│   │       └── links/route.ts
│   ├── test/page.tsx (simple test page)
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx (main dashboard)
├── components/
│   ├── Navbar.tsx (reusable navbar component)
│   └── DashboardPanel.tsx (reusable panel component)
├── lib/
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to view the dashboard.

### Production Build

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Dashboard Data Endpoints

All endpoints return JSON with the following structure:

```json
{
  "id": 1,
  "title": "Sales Overview",
  "metric": "$45,231",
  "change": "+12.5%",
  "description": "Total sales for this month",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Available Endpoints:**

- `GET /api/dashboard/sales` - Sales Overview
- `GET /api/dashboard/analytics` - User Analytics
- `GET /api/dashboard/revenue` - Revenue Trends
- `GET /api/dashboard/performance` - Performance Metrics

### Navigation Endpoints

- `GET /api/navigation/links` - Returns array of navigation links

```json
[
  {
    "id": 1,
    "label": "Overview",
    "href": "/overview"
  },
  ...
]
```

## 🛠️ Customization

### Adding a New Dashboard Panel

1. Create a new API endpoint in `app/api/dashboard/[name]/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  const data = {
    id: 5,
    title: 'New Panel',
    metric: '123',
    change: '+10%',
    description: 'Description here',
    timestamp: new Date().toISOString(),
  }
  return NextResponse.json(data)
}
```

2. Add the panel to `app/page.tsx` with the endpoint and color

### Updating Navigation Links

Edit `app/api/navigation/links/route.ts` to modify the menu structure.

## 🔗 Backend Integration

### Steps to Connect to a Real Backend

1. **Set Environment Variables** - Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

2. **Update API Calls** - Modify fetch URLs in components:

```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/sales`)
```

3. **Update Response Types** - Modify interfaces if backend returns different structure:

```typescript
interface PanelData {
  id: number
  title: string
  metric: string
  change: string
  description: string
  // Add any additional fields your backend returns
}
```

4. **Replace Mockup Endpoints** - Delete or repurpose `app/api/` route files once backend is ready

## 📱 Pages

- `/` - Main dashboard with 4 panels and navbar
- `/test` - Simple test page to verify styling

## 🎨 Styling

All styling uses **Tailwind CSS**. Key customization points:

- `tailwind.config.js` - Theme configuration
- `app/globals.css` - Global styles
- Component classNames - Inline Tailwind utilities

## 🧪 Testing

Visit `/test` page for a simple non-interactive version to verify styling and layout.

## 📝 Notes

- All API endpoints currently return mockup data
- The dashboard fetches all data on page load (consider pagination for production)
- Hydration checks prevent client-side hydration errors
- No authentication implemented (add when connecting to backend)

## 📄 License

MIT
