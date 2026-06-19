"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface NavLink {
  id: number;
  label: string;
  href: string;
}

export default function Navbar() {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchLinks = async () => {
      try {
        const response = await fetch("/api/navigation/links");
        if (!response.ok) throw new Error("Failed to fetch links");
        const data = await response.json();
        setLinks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch links");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  if (!mounted) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Dashboard</span>
          </div>

          <div className="flex space-x-8">
            {loading ? (
              <span className="text-gray-500">Loading...</span>
            ) : error ? (
              <span className="text-red-500">Error</span>
            ) : links.length > 0 ? (
              links.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))
            ) : (
              <span className="text-gray-500">No links</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
