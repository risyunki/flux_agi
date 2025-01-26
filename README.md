# FluxAGI

<div align="center">
  <img src="flux-frontend/public/logo.png" alt="FluxAGI Logo" width="200"/>
  <h3>Next-Generation AI Agent Orchestration Platform</h3>
</div>

🔗 [GitHub Repository](https://github.com/risyunki/flux_agi)

## ✨ Features

- 🤖 **Multi-Agent System**
  - Specialized agents for different tasks (Bragi, Odin, Thor)
  - Intelligent task routing and coordination
  - Real-time agent collaboration

- 🎯 **Task Management**
  - Real-time task creation and monitoring
  - Smart state preservation
  - Task archiving and restoration
  - Multi-line task descriptions

- 🎨 **Modern UI/UX**
  - Beautiful dark/light mode
  - Responsive design
  - Real-time updates
  - Elegant transitions and animations

- ⚡ **Performance**
  - Optimized polling mechanism
  - Smart caching strategy
  - Efficient state management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- PostgreSQL
- Redis (optional, for enhanced caching)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/risyunki/flux_agi.git
cd flux_agi
```

2. **Frontend Setup**
```bash
cd flux-frontend
npm install
```

Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Backend Setup**
```bash
cd flux-backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/flux
OPENAI_API_KEY=your_key_here
```

### Running the Application

1. **Start the frontend**
```bash
cd flux-frontend
npm run dev
```

2. **Start the backend**
```bash
cd flux-backend
uvicorn flux_kernel:app --reload
```

## 🤖 AI Agents

### Bragi - The AI Assistant
- Natural Language Understanding
- Task Processing
- Information Retrieval
- Problem Solving
- Real-time Responses

### Odin - The Coordinator
- Strategic Planning
- Resource Management
- Agent Coordination
- Task Prioritization
- System Optimization

### Thor - The Architect
- Agent Creation
- System Architecture
- Capability Enhancement
- Performance Testing
- Agent Maintenance

## 🔧 Technical Architecture

### Frontend (Next.js 14)

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with custom dark mode
- **State Management**: React hooks
- **Real-time Updates**: Optimized polling
- **Components**: Custom shadcn/ui based

### Backend (FastAPI)

- **API Framework**: FastAPI
- **Database**: PostgreSQL
- **Task Processing**: Async pipeline
- **Memory Management**: Redis + Vector Store
- **Agent System**: LangChain integration

## 📦 Core Components

### Task Management
```typescript
interface Task {
  id: string;
  description: string;
  status: 'in_progress' | 'completed';
  result?: string;
  agent_id: string;
  created_at: string;
  archived: boolean;
}
```

### Agent System
```typescript
interface Agent {
  id: string;
  name: string;
  type: 'assistant' | 'coordinator' | 'architect' | 'engineer' | 'researcher';
  description: string;
  capabilities?: string[];
}
```

## 🔄 State Management

- Optimistic UI updates
- Real-time WebSocket updates
- Smart error handling and rollback
- Task state preservation

## 🛠️ Development

### Code Style
- TypeScript for frontend
- Python type hints
- ESLint + Prettier configuration
- Pre-commit hooks

### Testing
- Jest for frontend
- Pytest for backend
- E2E testing with Playwright

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📚 Documentation

For detailed documentation, please visit our [Wiki](https://github.com/risyunki/flux_agi/wiki).
