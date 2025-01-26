import { config } from '@/lib/config'

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
    if (!response.ok) throw new Error('Failed to create task')
    const data = await response.json()
    return Response.json(data)
  } catch {
    return Response.json({ error: 'Failed to create task' }, { status: 500 })
  }
}