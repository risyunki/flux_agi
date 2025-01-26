import { NextResponse } from 'next/server'
import { config } from '@/lib/config'

// Get all tasks
export async function GET() {
  try {
    const response = await fetch(`${config.apiUrl}/tasks`)
    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Failed to fetch tasks:', err)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// Create a new task
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const response = await fetch(`${config.apiUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      throw new Error('Failed to create task')
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Failed to create task:', err)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}