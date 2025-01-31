import { NextResponse } from 'next/server'
import { config } from '@/lib/config'

// Get all agents and their status
export async function GET() {
  try {
    const response = await fetch(`${config.apiUrl}/agents`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}