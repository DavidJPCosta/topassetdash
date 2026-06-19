"use client";

import { useEffect, useState } from "react";

interface PanelData {
  id: number;
  title: string;
  metric: string;
  change: string;
  description: string;
  timestamp: string;
}

interface DashboardPanelProps {
  endpoint: string;
  color: "blue" | "green" | "purple" | "orange";
}

const colorClasses = {
  blue: "border-l-4 border-l-blue-500 bg-blue-50",
  green: "border-l-4 border-l-green-500 bg-green-50",
  purple: "border-l-4 border-l-purple-500 bg-purple-50",
  orange: "border-l-4 border-l-orange-500 bg-orange-50",
};

const metricColorClasses = {
  blue: "text-blue-700",
  green: "text-green-700",
  purple: "text-purple-700",
  orange: "text-orange-700",
};

const changeColorClasses = {
  blue: "text-blue-600",
  green: "text-green-600",
  purple: "text-purple-600",
  orange: "text-orange-600",
};

export default function DashboardPanel({
  endpoint,
  color,
}: DashboardPanelProps) {
  const [data, setData] = useState<PanelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchData = async () => {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch data");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className={`rounded-lg shadow p-6 ${colorClasses[color]}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-lg shadow p-6 ${colorClasses[color]}`}>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Error</h3>
        <p className="text-red-600 text-sm">Failed to load</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`rounded-lg shadow p-6 ${colorClasses[color]}`}>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow p-6 ${colorClasses[color]}`}>
      <h3 className="text-sm font-medium text-gray-700 mb-2">{data.title}</h3>
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-3xl font-bold ${metricColorClasses[color]}`}>
            {data.metric}
          </p>
          <p className="text-xs text-gray-600 mt-1">{data.description}</p>
        </div>
        <div className={`text-sm font-semibold ${changeColorClasses[color]}`}>
          {data.change}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Last updated: {new Date(data.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
}
