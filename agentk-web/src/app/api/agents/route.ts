// Get all agents and their status
export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/agents')
    if (!response.ok) throw new Error('Failed to fetch agents')
    const data = await response.json()
    return Response.json(data)
  } catch {
    return Response.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
} 