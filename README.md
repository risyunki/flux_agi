# AgentK - AI Agent System

## Deployment

### Frontend (Next.js) - Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the following environment variables in Vercel:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-app-url
   NEXT_PUBLIC_WS_URL=wss://your-railway-app-url/ws
   ```
4. Deploy using the Vercel dashboard or CLI:
   ```bash
   vercel
   # For production
   vercel --prod
   ```

### Backend (FastAPI) - Railway

1. Push your code to GitHub
2. Connect your repository to Railway
3. Set the following environment variables in Railway:
   ```
   OPENAI_API_KEY=your_openai_key
   ANTHROPIC_API_KEY=your_anthropic_key
   PORT=8000
   DEFAULT_MODEL_PROVIDER=OPENAI
   DEFAULT_MODEL_NAME=gpt-4
   DEFAULT_MODEL_TEMPERATURE=0
   ```
4. Railway will automatically deploy your application

### Local Development

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd agentk-web
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd AgentK
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   - Copy `.env.example` to `.env` in both directories
   - Fill in the required API keys and configuration
5. Start the development servers:
   ```bash
   # Frontend
   cd agentk-web
   npm run dev

   # Backend
   cd AgentK
   uvicorn main:app --reload
   ```

## Architecture

- Frontend: Next.js 14, TailwindCSS, TypeScript
- Backend: FastAPI, Python, WebSocket
- AI: OpenAI GPT-4, Anthropic Claude 