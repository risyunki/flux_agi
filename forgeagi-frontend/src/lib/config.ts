export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://forgelabs-production.up.railway.app',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'wss://forgelabs-production.up.railway.app/ws'
} as const