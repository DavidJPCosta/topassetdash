import { NextResponse } from 'next/server'

export async function GET() {
  // Mockup endpoint - replace with real backend later
  const links = [
    { id: 1, label: 'Overview', href: '/overview' },
    { id: 2, label: 'Analytics', href: '/analytics' },
    { id: 3, label: 'Reports', href: '/reports' },
    { id: 4, label: 'Settings', href: '/settings' },
  ]

  return NextResponse.json(links)
}
