# Quick Start Guide

## 🚀 Running the Dashboard

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at:
- **Main Dashboard**: http://localhost:3000
- **Test Page**: http://localhost:3000/test (if using port 3000)

> Note: If port 3000 is in use, Next.js will automatically use port 3001

## 📊 What You'll See

### Main Dashboard (`/`)
- **Top Navbar** with 4 menu links (Overview, Analytics, Reports, Settings)
- **4 Dashboard Panels** showing:
  1. Sales Overview - $45,231 (+12.5%)
  2. User Analytics - 8,432 (+5.3%)
  3. Revenue Trends - $234,567 (+18.2%)
  4. Performance Metrics - 94.2% (+2.1%)

### Test Page (`/test`)
- Static version of panels without API fetching
- Use this to verify styling and layout

## 🔌 API Mockup Endpoints

All endpoints are working and return JSON:

```bash
# Get sales data
curl http://localhost:3000/api/dashboard/sales

# Get analytics data
curl http://localhost:3000/api/dashboard/analytics

# Get revenue data
curl http://localhost:3000/api/dashboard/revenue

# Get performance data
curl http://localhost:3000/api/dashboard/performance

# Get navigation links
curl http://localhost:3000/api/navigation/links
```

## 📝 Next Steps

### To Connect to a Real Backend

1. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://your-api.com
```

2. Update API calls in `app/page.tsx`:
```typescript
const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
const response = await fetch(`${baseUrl}/api/dashboard/sales`)
```

3. Update your API endpoint responses to match the expected format

### To Add New Panels

1. Create a new route: `app/api/dashboard/[name]/route.ts`
2. Add it to the fetch calls in `app/page.tsx`
3. Add a new panel section in the grid

## 🎨 Customizing Colors

Edit the `colorClasses` object in `app/page.tsx`:
- `blue` - Blue theme
- `green` - Green theme  
- `purple` - Purple theme
- `orange` - Orange theme

## 📚 Project Files

Key files to understand:

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main dashboard page with data fetching |
| `app/test/page.tsx` | Static test page for styling verification |
| `app/api/dashboard/*/route.ts` | Mockup API endpoints |
| `app/api/navigation/links/route.ts` | Navigation links endpoint |
| `components/Navbar.tsx` | Reusable navbar component |
| `components/DashboardPanel.tsx` | Reusable panel component |
| `tailwind.config.js` | Tailwind CSS configuration |

## ✅ Verification Checklist

- [ ] Server starts without errors
- [ ] Main dashboard loads at `/`
- [ ] Test page displays at `/test`
- [ ] 4 panels show with data
- [ ] Navigation bar shows menu links
- [ ] API endpoints return data via curl
- [ ] Responsive design works on mobile

## 🐛 Troubleshooting

### Blank Screen
- Check browser console (F12) for errors
- Verify port is correct (3000 or 3001)
- Try `/test` page instead

### API Errors
- Check network tab in DevTools
- Verify all API routes exist
- Check console for fetch error messages

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server
- Check tailwind.config.js syntax

## 📞 Support

For more details, see `README.md`
