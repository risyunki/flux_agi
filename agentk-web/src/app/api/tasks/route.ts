import { NextResponse } from 'next/server'

// Get all tasks
export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/tasks')
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
    const response = await fetch('http://localhost:8000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Failed to create task:', err)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
} 