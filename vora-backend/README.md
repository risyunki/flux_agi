# Flux AI - Advanced Multi-Agent System

Flux AI is a modular, self-evolving system made of intelligent agents that collaborate to complete complex tasks. Built with a recursive architecture, it enables agents to work together seamlessly while maintaining individual specializations.

## Table of Contents
- [System Architecture](#system-architecture)
- [Core Agents](#core-agents)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Usage](#usage)
  - [Web Interface](#web-interface)
  - [CLI Interface](#cli-interface)
- [API Documentation](#api-documentation)
- [WebSocket Events](#websocket-events)
- [Development](#development)
- [Contributing](#contributing)

## System Architecture

Flux AI is built on a modular architecture with these key components:

### Core Components
- **Agent System**: A recursive, self-evolving network of specialized agents
- **Task Processing Engine**: Handles task distribution and execution
- **WebSocket System**: Enables real-time updates and agent communication
- **State Management**: Tracks task progress and system metrics

### Technology Stack
- Backend: FastAPI, LangChain, Python
- Frontend: Next.js, TypeScript, TailwindCSS
- Communication: WebSocket, REST API
- State Management: SQLite (for persistence)

## Core Agents

### Bragi - The AI Assistant
- **Role**: Primary interface for task execution and problem-solving
- **Capabilities**:
  - Natural Language Understanding
  - Task Processing
  - Information Retrieval
  - Problem Solving
  - Real-time Responses

### Odin - The Coordinator
- **Role**: Strategic oversight and resource allocation
- **Capabilities**:
  - Strategic Planning
  - Resource Management
  - Agent Coordination
  - Task Prioritization
  - System Optimization

### Thor - The Architect
- **Role**: System architecture and agent maintenance
- **Capabilities**:
  - Agent Creation
  - System Architecture
  - Capability Enhancement
  - Performance Testing
  - Agent Maintenance

### Software Engineer
- **Role**: Technical implementation and code management
- **Capabilities**:
  - Code Development
  - Bug Fixing
  - Code Review
  - Testing
  - Technical Implementation

### AI Researcher
- **Role**: AI advancement and methodology research
- **Capabilities**:
  - Data Analysis
  - Research Planning
  - Experiment Design
  - Literature Review
  - Innovation Discovery

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- OpenAI API key
- Git

### Installation

1. Clone the repository:
```bash
git clone (https://github.com/risyunki/flux_agi)
cd forgeagi
```

2. Set up the backend:
```bash
cd forgeagi-backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd ../forgeagi-frontend
npm install
```

### Environment Setup

1. Backend configuration (.env):
```env
DEFAULT_MODEL_PROVIDER=OPENAI
DEFAULT_MODEL_NAME=gpt-4
DEFAULT_MODEL_TEMPERATURE=0
OPENAI_API_KEY=your_openai_api_key_here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

2. Frontend configuration (.env):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

## Usage

### Web Interface

1. Start the backend server:
```bash
cd forgeagi-backend
source venv/bin/activate
python forge_kernel.py
```

2. Start the frontend development server:
```bash
cd forgeagi-frontend
npm run dev
```

3. Access the web interface at http://localhost:3001

#### Using the Web Interface

1. **Select an Agent**:
   - Browse available agents on the home page
   - Click on an agent card to view details
   - Each agent has specific capabilities and roles

2. **Create a Task**:
   - Click "Create Task" with your chosen agent
   - Describe your task in natural language
   - The system will automatically:
     - Parse your request
     - Assign appropriate agents
     - Begin task execution

3. **Monitor Progress**:
   - View real-time updates in the task list
   - Check detailed task status and results
   - Receive notifications for important events

### CLI Interface

The CLI provides direct access to agent capabilities:

1. Start a CLI session:
```bash
python cli.py
```

2. Basic Commands:
```bash
# List available agents
> list agents

# Start a conversation with Bragi
> chat bragi

# Create a new task
> task create "Analyze the performance of our current system"

# Check task status
> task status <task_id>

# List active tasks
> task list

# Get agent details
> agent info <agent_name>
```

3. Advanced Usage:
```bash
# Direct agent collaboration
> collaborate odin thor "Design a new agent architecture"

# System diagnostics
> system status
> system metrics

# Agent management
> agent deploy <agent_name>
> agent update <agent_name>
```

## API Documentation

### REST Endpoints

#### Agents
- `GET /agents` - List all available agents
- `GET /agents/{agent_id}` - Get specific agent details
- `POST /agents` - Deploy a new agent

#### Tasks
- `GET /tasks` - List all tasks
- `POST /tasks` - Create a new task
- `GET /tasks/{task_id}` - Get task details
- `PUT /tasks/{task_id}` - Update task status

#### System
- `GET /health` - System health check
- `GET /metrics` - System metrics

### WebSocket Events

1. **Task Updates**:
```typescript
interface TaskUpdate {
  type: 'task_update';
  data: {
    id: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    progress?: number;
    result?: string;
  };
}
```

2. **Agent Status**:
```typescript
interface AgentStatus {
  type: 'agent_status';
  data: {
    id: string;
    status: 'active' | 'inactive';
    load: number;
  };
}
```

## Development

### Adding New Agents

1. Create a new agent file in `agents/`:
```python
from typing import Literal
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, MessagesState

class NewAgent:
    def __init__(self):
        self.system_prompt = """
        Your system prompt here
        """
```

2. Register the agent in `utils.py`:
```python
AVAILABLE_AGENTS = {
    'new_agent': NewAgent
}
```

### Testing

Run the test suite:
```bash
pytest tests/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

For detailed contribution guidelines, see CONTRIBUTING.md.
