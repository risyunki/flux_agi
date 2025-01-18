from fastapi import FastAPI, WebSocket, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from typing import List, Dict, Any, Optional
import uuid
import os
import logging
from datetime import datetime
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from agents import hermes
    HERMES_AVAILABLE = True
except ImportError:
    HERMES_AVAILABLE = False
    logger.warning("Hermes module not available")

app = FastAPI(
    title="Forge AI API",
    description="Advanced AI Agent System for Task Processing and Automation",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Get allowed origins from environment variable or use defaults
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,https://forgelabs-six.vercel.app,https://forgeai.xyz").split(",")

# Add CORS middleware with more restrictive settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Enhanced in-memory storage with timestamps and metadata
class Task(BaseModel):
    id: str
    description: str
    status: str
    result: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    agent_id: str
    priority: int = 1
    metadata: Dict[str, Any] = {}

tasks: List[Task] = []
active_connections: List[WebSocket] = []
system_stats = {
    "tasks_completed": 0,
    "tasks_failed": 0,
    "uptime_start": datetime.now(),
}

@app.get("/health")
async def health_check():
    """Enhanced health check with system metrics"""
    uptime = (datetime.now() - system_stats["uptime_start"]).total_seconds()
    return {
        "status": "healthy",
        "version": "2.0.0",
        "uptime_seconds": uptime,
        "tasks_completed": system_stats["tasks_completed"],
        "tasks_failed": system_stats["tasks_failed"],
        "agents_available": HERMES_AVAILABLE
    }

@app.get("/")
async def root():
    """Root endpoint with system information"""
    return {
        "name": "Forge AI System",
        "version": "2.0.0",
        "status": "operational",
        "features": [
            "Advanced Task Processing",
            "Real-time WebSocket Updates",
            "Priority-based Task Queue",
            "System Metrics"
        ]
    }

@app.get("/agents")
async def get_agents():
    """Get available AI agents with enhanced metadata"""
    return {
        "agents": [
            {
                "id": "bragi",
                "name": "Bragi",
                "status": "active" if HERMES_AVAILABLE else "inactive",
                "type": "assistant",
                "description": "Advanced AI assistant with natural language processing capabilities",
                "capabilities": ["task_processing", "language_understanding", "code_generation"],
                "version": "2.0.0"
            },
            {
                "id": "odin",
                "name": "Odin",
                "status": "active" if HERMES_AVAILABLE else "inactive",
                "type": "coordinator",
                "description": "Strategic planning and task coordination system",
                "capabilities": ["task_planning", "resource_allocation", "priority_management"],
                "version": "2.0.0"
            },
            {
                "id": "thor",
                "name": "Thor",
                "status": "active" if HERMES_AVAILABLE else "inactive",
                "type": "architect",
                "description": "System architecture and optimization specialist",
                "capabilities": ["system_design", "performance_optimization", "integration"],
                "version": "2.0.0"
            }
        ]
    }

@app.get("/tasks")
async def get_tasks():
    """Get all tasks with optional filtering"""
    return {"tasks": [task.dict() for task in tasks]}

@app.post("/tasks")
async def create_task(request: Request):
    """Create a new task with enhanced metadata and priority"""
    if not HERMES_AVAILABLE:
        raise HTTPException(status_code=503, detail="Task processing is currently unavailable")
        
    task_data = await request.json()
    task_id = str(uuid.uuid4())
    now = datetime.now()
    
    task = Task(
        id=task_id,
        description=task_data.get("description", ""),
        status="in_progress",
        created_at=now,
        updated_at=now,
        agent_id="bragi",  # Default to Bragi for now
        priority=task_data.get("priority", 1),
        metadata={
            "client_info": str(request.client),
            "source": task_data.get("source", "api"),
            "tags": task_data.get("tags", [])
        }
    )
    tasks.append(task)
    
    # Notify connected clients about task creation
    await broadcast_update("task_created", task)
    
    # Process task with Hermes
    try:
        result = hermes.hermes(task_id, task.description)
        task.result = result
        task.status = "completed"
        task.updated_at = datetime.now()
        system_stats["tasks_completed"] += 1
    except Exception as e:
        task.result = str(e)
        task.status = "failed"
        task.updated_at = datetime.now()
        system_stats["tasks_failed"] += 1
    
    # Notify connected clients about task completion
    await broadcast_update("task_completed", task)
    return task.dict()

async def broadcast_update(event_type: str, data: Any):
    """Broadcast updates to all connected WebSocket clients"""
    for connection in active_connections:
        try:
            await connection.send_json({
                "type": event_type,
                "timestamp": datetime.now().isoformat(),
                "data": data.dict() if hasattr(data, "dict") else data
            })
        except:
            logger.warning(f"Failed to send update to a client")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        logger.warning("WebSocket connection closed")
    finally:
        if websocket in active_connections:
            active_connections.remove(websocket)

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    logger.info(f"Starting Forge AI System v2.0.0 on port {port}")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info",
        access_log=True
    )