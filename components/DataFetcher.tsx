'use client'

import { useEffect, useState } from 'react'

export default function DataFetcher() {
  const [salesData, setSalesData] = useState<any>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [revenueData, setRevenueData] = useState<any>(null)
  const [performanceData, setPerformanceData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sales, analytics, revenue, performance] = await Promise.all([
          fetch('/api/dashboard/sales').then(r => r.json()).catch(() => null),
          fetch('/api/dashboard/analytics').then(r => r.json()).catch(() => null),
          fetch('/api/dashboard/revenue').then(r => r.json()).catch(() => null),
          fetch('/api/dashboard/performance').then(r => r.json()).catch(() => null),
        ])

        setSalesData(sales)
        setAnalyticsData(analytics)
        setRevenueData(revenue)
        setPerformanceData(performance)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 p-4 bg-blue-50 rounded">
      <div className="bg-white p-4 rounded border">
        <h4 className="font-bold text-sm mb-2">Sales API Data:</h4>
        <pre className="text-xs whitespace-pre-wrap break-words">
          {salesData ? JSON.stringify(salesData, null, 2) : 'Loading...'}
        </pre>
      </div>
      <div className="bg-white p-4 rounded border">
        <h4 className="font-bold text-sm mb-2">Analytics API Data:</h4>
        <pre className="text-xs whitespace-pre-wrap break-words">
          {analyticsData ? JSON.stringify(analyticsData, null, 2) : 'Loading...'}
        </pre>
      </div>
      <div className="bg-white p-4 rounded border">
        <h4 className="font-bold text-sm mb-2">Revenue API Data:</h4>
        <pre className="text-xs whitespace-pre-wrap break-words">
          {revenueData ? JSON.stringify(revenueData, null, 2) : 'Loading...'}
        </pre>
      </div>
      <div className="bg-white p-4 rounded border">
        <h4 className="font-bold text-sm mb-2">Performance API Data:</h4>
        <pre className="text-xs whitespace-pre-wrap break-words">
          {performanceData ? JSON.stringify(performanceData, null, 2) : 'Loading...'}
        </pre>
      </div>
    </div>
  )
}
