'use client'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard Test Page</h1>
        <p className="text-lg text-gray-600 mb-8">If you see this, the app is working!</p>

        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-l-blue-500 mb-6">
          <h2 className="text-xl font-bold text-blue-900 mb-2">Dashboard Loaded</h2>
          <p className="text-blue-800">The Next.js dashboard is running successfully.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-l-green-500">
            <h3 className="text-lg font-bold text-green-900 mb-2">Sales Overview</h3>
            <p className="text-3xl font-bold text-green-700">$45,231</p>
            <p className="text-sm text-green-600 mt-2">+12.5%</p>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-l-purple-500">
            <h3 className="text-lg font-bold text-purple-900 mb-2">User Analytics</h3>
            <p className="text-3xl font-bold text-purple-700">8,432</p>
            <p className="text-sm text-purple-600 mt-2">+5.3%</p>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-l-orange-500">
            <h3 className="text-lg font-bold text-orange-900 mb-2">Revenue Trends</h3>
            <p className="text-3xl font-bold text-orange-700">$234,567</p>
            <p className="text-sm text-orange-600 mt-2">+18.2%</p>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border-l-4 border-l-red-500">
            <h3 className="text-lg font-bold text-red-900 mb-2">Performance</h3>
            <p className="text-3xl font-bold text-red-700">94.2%</p>
            <p className="text-sm text-red-600 mt-2">+2.1%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
