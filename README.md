# ForgeAGI

A modern AI orchestration platform that enables seamless interaction with multiple AI agents through a real-time web interface.

🔗 [GitHub Repository](https://github.com/risyunki/forgeagi)

## Overview

ForgeAGI is a cutting-edge AI orchestration platform that leverages modern web technologies to create a seamless interaction between users and multiple AI agents. The system employs a sophisticated task management system with real-time updates and elegant state preservation.

### Key Highlights
- 🚀 Modern tech stack with Next.js 14 and FastAPI
- 🎨 Beautiful dark mode UI with TailwindCSS
- 🤖 Multi-agent orchestration system
- ⚡ Real-time updates with optimized polling
- 🔄 Smart state preservation for completed tasks
- 📝 Multi-line task input support

## Technical Architecture

### Frontend (Next.js 14)

#### Core Technologies
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with custom dark mode support
- **State Management**: React hooks for local state
- **Real-time Updates**: Polling mechanism with configurable intervals
- **UI Components**: Custom shadcn/ui based components

#### Key Components

1. **Task Management**
```typescript
interface Task {
  id: string
  description: string
  status: 'in_progress' | 'completed'
  result?: string
  agent_id: string
  created_at: string
}
```

2. **Agent System**
```typescript
interface Agent {
  id: string
  name: string
  type: 'assistant' | 'coordinator' | 'architect'
  description: string
}
```

### Backend (FastAPI)

#### Core Architecture

1. **Forge Kernel**
```python
class ForgeKernel:
    def __init__(self):
        self.agents = {}
        self.tasks = {}
        self.task_queue = TaskQueue()
        self.memory_manager = MemoryManager()
        
    async def process_task(self, task_id: str, description: str):
        # Task processing pipeline
        agent = self.select_agent(task_id)
        context = self.memory_manager.get_context(task_id)
        result = await agent.execute(description, context)
        return self.format_response(result)
```

2. **Agent System**
```python
class Agent:
    def __init__(self, agent_id: str, type: str, model: str):
        self.id = agent_id
        self.type = type
        self.model = model
        self.memory = AgentMemory()
        self.capabilities = self.load_capabilities()

    async def execute(self, task: str, context: dict) -> str:
        # Agent execution pipeline
        prompt = self.build_prompt(task, context)
        response = await self.model.generate(prompt)
        self.memory.store(task, response)
        return response
```

#### Database Schema

1. **Tasks Table**
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    result TEXT,
    agent_id UUID REFERENCES agents(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. **Agents Table**
```sql
CREATE TABLE agents (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    capabilities JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Task Processing Pipeline

1. **Task Creation Flow**
```python
@app.post("/tasks")
async def create_task(task: TaskCreate, background_tasks: BackgroundTasks):
    # 1. Validate task input
    validate_task_input(task.description)
    
    # 2. Create task record
    task_id = generate_uuid()
    task_record = await db.tasks.create(
        id=task_id,
        description=task.description,
        status="in_progress"
    )
    
    # 3. Queue task for processing
    background_tasks.add_task(
        process_task,
        task_id=task_id,
        description=task.description
    )
    
    return {"id": task_id, "status": "in_progress"}
```

2. **Task Processing**
```python
async def process_task(task_id: str, description: str):
    try:
        # 1. Select appropriate agent
        agent = kernel.select_agent(task_id)
        
        # 2. Prepare context
        context = memory_manager.get_context(task_id)
        
        # 3. Execute task
        result = await agent.execute(description, context)
        
        # 4. Update task status
        await db.tasks.update(
            task_id,
            status="completed",
            result=result
        )
        
        # 5. Broadcast update
        await broadcast_task_update(task_id)
        
    except Exception as e:
        logger.error(f"Task processing failed: {str(e)}")
        await handle_task_error(task_id, str(e))
```

#### Memory Management

```python
class MemoryManager:
    def __init__(self):
        self.redis_client = Redis()
        self.vector_store = PGVector()
    
    async def store_result(self, task_id: str, result: str):
        # Store in Redis for quick access
        await self.redis_client.set(f"task:{task_id}:result", result)
        
        # Store in vector database for semantic search
        embedding = self.create_embedding(result)
        await self.vector_store.store(task_id, embedding)
    
    async def get_context(self, task_id: str) -> dict:
        # Retrieve relevant past interactions
        recent = await self.redis_client.get_recent(task_id)
        similar = await self.vector_store.find_similar(task_id)
        return self.merge_context(recent, similar)
```

#### Error Handling

```python
class TaskError(Exception):
    def __init__(self, task_id: str, message: str):
        self.task_id = task_id
        self.message = message
        super().__init__(self.message)

async def handle_task_error(task_id: str, error_message: str):
    # 1. Log error
    logger.error(f"Task {task_id} failed: {error_message}")
    
    # 2. Update task status
    await db.tasks.update(
        task_id,
        status="failed",
        error=error_message
    )
    
    # 3. Notify monitoring systems
    await alert_monitoring(task_id, error_message)
    
    # 4. Attempt recovery if possible
    await attempt_task_recovery(task_id)
```

#### Performance Optimizations

1. **Database Optimizations**
```python
# Indexing
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_agent_id ON tasks(agent_id);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

# Connection Pooling
db_pool = PooledPostgresConnection(
    min_connections=5,
    max_connections=20,
    timeout=30
)
```

2. **Caching Strategy**
```python
class CacheManager:
    def __init__(self):
        self.redis = Redis(connection_pool=redis_pool)
        
    async def get_or_fetch(self, key: str, fetch_func: Callable):
        # Try cache first
        cached = await self.redis.get(key)
        if cached:
            return cached
            
        # Fetch and cache if not found
        result = await fetch_func()
        await self.redis.set(key, result, ex=300)  # 5 min cache
        return result
```

## Setup & Installation

### Frontend Setup
```bash
cd forgeagi-frontend
npm install
npm run dev
```

Required environment variables:
```env
NEXT_PUBLIC_API_URL=https://your-api-url
```

### Backend Setup
```bash
cd forgeagi-backend
pip install -r requirements.txt
uvicorn forge_kernel:app --reload
```

Required environment variables:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/forge
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your-key
```

## Features

### 1. Task Management
- Real-time task creation and monitoring
- Support for multi-line task descriptions (Shift+Enter)
- Automatic status updates via polling
- Result preservation for completed tasks

### 2. Agent System
- Multiple agent types (Assistant, Coordinator, Architect)
- Agent selection for task assignment
- Visual status indicators for agent activities

### 3. Real-time Updates
- Polling mechanism with 2-second intervals
- Optimized state management to prevent UI flicker
- Result caching for completed tasks

## Technical Implementation Details

### Task Service Implementation
```typescript
class TaskService {
  private pollingInterval: NodeJS.Timeout | null = null
  private lastKnownTasks: Task[] = []

  async getTasks(): Promise<Task[]> {
    // Fetch tasks with result preservation
    // See task.service.ts for full implementation
  }

  startPolling(callback: (tasks: Task[]) => void) {
    // Polling implementation with cleanup
    // 2-second interval for updates
  }
}
```

### State Management
- Task states are managed using React's useState
- Polling is handled through useEffect with cleanup
- Agent selection state is preserved across renders

### Error Handling
- Comprehensive error handling for API calls
- Toast notifications for user feedback
- Fallback UI states for loading and error conditions

## Development Guidelines

### Code Structure
```
forgeagi-frontend/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # Reusable UI components
│   ├── lib/             # Utilities and services
│   └── styles/          # Global styles
```

### Best Practices
1. Use TypeScript for type safety
2. Implement proper error boundaries
3. Follow React hooks best practices
4. Maintain consistent error handling
5. Document complex logic
6. Use proper TypeScript interfaces

## Security Considerations

1. **API Security**
   - CORS configuration
   - Authentication headers
   - Input validation

2. **Data Handling**
   - Secure credential management
   - Data sanitization
   - XSS prevention

## Performance Optimizations

1. **Frontend**
   - Optimized polling mechanism
   - Result caching
   - Efficient state updates

2. **Backend**
   - Connection pooling
   - Query optimization
   - Rate limiting

## Deployment

### Frontend (Vercel)
```bash
vercel deploy
```

### Backend (Railway)
```bash
railway up
```

Required environment variables should be configured in respective platforms.

## Monitoring & Debugging

### Frontend Monitoring
- Console logging for development
- Error tracking through try-catch blocks
- State change logging in development

### Backend Monitoring
- Request logging
- Task processing logs
- Agent interaction logging

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details

## Deep Dive: System Architecture

### Task Processing Flow

1. **Task Creation**
```typescript
// Frontend: Task creation with agent selection
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!input.trim()) return

  try {
    setIsSubmitting(true)
    await taskService.createTask(input, selectedAgent?.id || 'assistant')
    // State updates and notifications
  } catch (error) {
    // Error handling with toast notifications
  }
}
```

2. **Backend Processing**
```python
# FastAPI endpoint handling task creation
@app.post("/tasks")
async def create_task(task: TaskCreate, background_tasks: BackgroundTasks):
    task_id = generate_uuid()
    background_tasks.add_task(process_task, task_id, task.description)
    return {"id": task_id, "status": "in_progress"}
```

3. **State Management**
```typescript
// Smart task result preservation
this.lastKnownTasks = tasks.map((newTask: Task) => {
  const existingTask = this.lastKnownTasks.find(t => t.id === newTask.id)
  if (existingTask?.status === 'completed' && existingTask?.result) {
    return { ...newTask, result: existingTask.result }
  }
  return newTask
})
```

### Agent System Architecture

1. **Agent Types & Capabilities**
- **Assistant**: General-purpose AI agent for basic tasks
- **Coordinator**: Orchestrates complex multi-step operations
- **Architect**: Specialized in system design and technical tasks

```typescript
// Agent type definitions
type AgentType = 'assistant' | 'coordinator' | 'architect'

interface Agent {
  id: string
  name: string
  type: AgentType
  description: string
  capabilities?: string[]
}
```

2. **Agent Selection Logic**
```typescript
// Default coordinator selection
const odin = agentsList.find((agent: Agent) => agent.type === 'coordinator')
if (odin) {
  setSelectedAgent(odin)
}
```

### Real-time Updates Implementation

1. **Polling Mechanism**
```typescript
class TaskService {
  private pollingInterval: NodeJS.Timeout | null = null
  private lastKnownTasks: Task[] = []

  startPolling(callback: (tasks: Task[]) => void) {
    this.stopPolling()
    this.getTasks().then(callback)
    
    this.pollingInterval = setInterval(async () => {
      const tasks = await this.getTasks()
      callback(tasks)
    }, 2000)
  }
}
```

2. **State Preservation**
- Tasks are cached locally
- Completed task results are preserved
- UI updates are optimized to prevent flickering

### UI/UX Features

1. **Multi-line Input**
```typescript
<Textarea
  value={input}
  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
  onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }}
  placeholder="Enter your task description..."
  className="flex-1 min-h-[100px] resize-none"
  disabled={isSubmitting}
/>
```

2. **Dynamic Status Indicators**
```typescript
{task.status === 'in_progress' && (
  <>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
    <span className="text-sm text-stone-500 dark:text-stone-400">
      Processing...
    </span>
  </>
)}
```

### Performance Optimizations

1. **Task Result Caching**
- Completed task results are cached locally
- Prevents unnecessary re-fetching
- Optimizes UI responsiveness

2. **State Updates**
- Batched state updates for better performance
- Optimistic UI updates for better UX
- Smart diffing for minimal re-renders

### Error Handling & Recovery

1. **Network Error Recovery**
```typescript
async getTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${config.apiUrl}/tasks`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
    // Process response
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return this.lastKnownTasks // Fallback to cached tasks
  }
}
```

2. **User Feedback**
- Toast notifications for success/error states
- Visual indicators for loading states
- Clear error messages with recovery options

## Getting Started

### Quick Start
```bash
# Clone the repository
git clone https://github.com/risyunki/forgeagi.git

# Frontend setup
cd forgeagi-frontend
npm install
npm run dev

# Backend setup
cd ../forgeagi-backend
pip install -r requirements.txt
uvicorn forge_kernel:app --reload
``` 