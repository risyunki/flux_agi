from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
import asyncio
import json
import logging
import os
import uuid

from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocketState
import uvicorn
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get port from environment variable (for Railway)
PORT = int(os.getenv("PORT", "8000"))

# ------------------------------------------------------
# Configure Logging (Structured Format)
# ------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s :: %(name)s :: %(levelname)s :: %(message)s"
)
logger = logging.getLogger("forge.kernel")

# ------------------------------------------------------
# FastAPI App Configuration
# ------------------------------------------------------
app = FastAPI()

# Configure CORS with all production domains
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://localhost:3002",
    "https://forgelabs-six.vercel.app",
    "https://forgeai.xyz",
    "https://www.forgeai.xyz",
    "https://forgelabs-production.up.railway.app"
]

logger.info(f"Configuring CORS with allowed origins: {allowed_origins}")

# Configure CORS middleware for HTTP requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# WebSocket Manager instance
ws_manager = WebSocketManager()

@app.on_event("startup")
async def startup_event():
    """Log startup information"""
    logger.info("Starting Forge AI API")
    logger.info(f"Environment: {os.environ.get('ENVIRONMENT', 'production')}")
    logger.info(f"Port: {os.environ.get('PORT', '8000')}")
    logger.info(f"Allowed Origins: {allowed_origins}")
    
    # Log API keys status (without revealing them)
    openai_key = bool(os.getenv("OPENAI_API_KEY"))
    anthropic_key = bool(os.getenv("ANTHROPIC_API_KEY"))
    logger.info(f"OpenAI API Key present: {openai_key}")
    logger.info(f"Anthropic API Key present: {anthropic_key}")

# ------------------------------------------------------
# Attempt Dynamic Agent Import
# ------------------------------------------------------
if os.getenv("OPENAI_API_KEY"):
    try:
        from agents.bragi import bragi
        BRAGI_AVAILABLE = True
        logger.info("Successfully imported Bragi agent")
    except ImportError as e:
        BRAGI_AVAILABLE = False
        logger.error(f"Unable to import 'bragi' agent: {str(e)}")
        logger.warning("Task processing features may be limited.")
else:
    BRAGI_AVAILABLE = False
    logger.warning("OpenAI API key not found - agent features disabled")

# ------------------------------------------------------
# Enum Definitions
# ------------------------------------------------------
class TaskStatus(str, Enum):
    """
    Describes the different stages a task can be in.
    """
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

# ------------------------------------------------------
# Data Classes
# ------------------------------------------------------
@dataclass
class TaskMetadata:
    """
    Metadata for tracking additional information about a task.
    """
    client_info: str
    source: str = "api"
    tags: List[str] = field(default_factory=list)

@dataclass
class Task:
    """
    The core representation of a Task within the Forge AI system.
    """
    id: str
    description: str
    status: TaskStatus
    agent_id: str
    priority: int
    created_at: datetime
    updated_at: datetime
    result: Optional[str] = None
    metadata: TaskMetadata = field(default_factory=TaskMetadata)

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the Task object into a dictionary for JSON serialization.
        """
        return {
            "id": self.id,
            "description": self.description,
            "status": self.status,
            "result": self.result,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "agent_id": self.agent_id,
            "priority": self.priority,
            "metadata": {
                "client_info": self.metadata.client_info,
                "source": self.metadata.source,
                "tags": self.metadata.tags
            },
        }

# ------------------------------------------------------
# WebSocket Manager
# ------------------------------------------------------
class WebSocketManager:
    """
    Manages active WebSocket connections and enables server-side broadcast to clients.
    """
    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        """
        Accept and register a new WebSocket connection.
        """
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(
            f"WebSocket connected. Total active connections: {len(self.active_connections)}"
        )

    def disconnect(self, websocket: WebSocket) -> None:
        """
        Unregister a WebSocket connection.
        """
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(
                f"WebSocket disconnected. Remaining connections: {len(self.active_connections)}"
            )

    async def broadcast(self, event_type: str, data: Any) -> None:
        """
        Broadcast a JSON message to all connected clients.
        """
        message = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
        
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except WebSocketDisconnect:
                self.disconnect(connection)
            except Exception as e:
                logger.error(f"Failed to send message to client: {e}")
                self.disconnect(connection)

    async def broadcast_agent_activity(self, agent_id: str, activity: str, details: Dict[str, Any] = None) -> None:
        """
        Broadcast agent activity updates to all connected clients.
        """
        await self.broadcast("agent_activity", {
            "agent_id": agent_id,
            "activity": activity,
            "details": details or {},
        })

    async def broadcast_task_progress(self, task_id: str, progress: float, status: str, current_action: str = None) -> None:
        """
        Broadcast task progress updates to all connected clients.
        """
        await self.broadcast("task_progress", {
            "task_id": task_id,
            "progress": progress,
            "status": status,
            "current_action": current_action,
        })

# ------------------------------------------------------
# System Metrics
# ------------------------------------------------------
class SystemMetrics:
    """
    Tracks system usage statistics, including number of completed/failed tasks and uptime.
    """
    def __init__(self) -> None:
        self.tasks_completed: int = 0
        self.tasks_failed: int = 0
        self.uptime_start: datetime = datetime.now()

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert metrics to a dictionary for JSON responses.
        """
        return {
            "tasks_completed": self.tasks_completed,
            "tasks_failed": self.tasks_failed,
            "uptime_seconds": (datetime.now() - self.uptime_start).total_seconds()
        }

# ------------------------------------------------------
# ForgeKernel: Main Orchestrator
# ------------------------------------------------------
class ForgeKernel:
    """
    Manages the entire lifecycle of tasks and agent interactions via the FastAPI application.
    """
    def __init__(self):
        self.tasks: List[Task] = []
        self.ws_manager = WebSocketManager()
        self.metrics = SystemMetrics()
        self._register_routes()

    def _register_routes(self) -> None:
        """
        Register HTTP endpoints and WebSocket endpoints with the FastAPI application.
        """
        @app.get("/")
        def root():
            """Root endpoint"""
            logger.debug("Root endpoint called")
            return {
                "status": "running",
                "api_ready": bool(os.getenv("OPENAI_API_KEY"))
            }

        @app.get("/health")
        def health_check():
            """Health check endpoint - always returns healthy"""
            logger.debug("Health check called")
            return {"status": "healthy"}

        @app.get("/agents")
        async def list_agents():
            return {
                "agents": [
                    {
                        "id": "assistant",
                        "name": "Bragi",
                        "status": "active" if BRAGI_AVAILABLE else "inactive",
                        "type": "assistant",
                        "description": "A wise and eloquent AI assistant that can help with various tasks, from answering questions to helping with complex problems.",
                        "capabilities": ["natural_language_understanding", "task_processing", "information_retrieval", "problem_solving", "real_time_responses"],
                        "version": "2.0.0"
                    },
                    {
                        "id": "coordinator",
                        "name": "Odin",
                        "status": "active" if BRAGI_AVAILABLE else "inactive",
                        "type": "coordinator",
                        "description": "The wise overseer of all operations and strategic planning.",
                        "capabilities": ["strategic_planning", "resource_management", "agent_coordination", "task_prioritization", "system_optimization"],
                        "version": "2.0.0"
                    },
                    {
                        "id": "architect",
                        "name": "Thor",
                        "status": "active" if BRAGI_AVAILABLE else "inactive",
                        "type": "architect",
                        "description": "The master builder and maintainer of the system's agents.",
                        "capabilities": ["agent_creation", "system_architecture", "capability_enhancement", "performance_testing", "agent_maintenance"],
                        "version": "2.0.0"
                    },
                    {
                        "id": "engineer",
                        "name": "Software Engineer",
                        "status": "active" if BRAGI_AVAILABLE else "inactive",
                        "type": "engineer",
                        "description": "Implements and maintains software solutions.",
                        "capabilities": ["code_development", "bug_fixing", "code_review", "testing", "technical_implementation"],
                        "version": "2.0.0"
                    },
                    {
                        "id": "researcher",
                        "name": "AI Researcher",
                        "status": "active" if BRAGI_AVAILABLE else "inactive",
                        "type": "researcher",
                        "description": "Conducts research and analysis in artificial intelligence.",
                        "capabilities": ["data_analysis", "research_planning", "experiment_design", "literature_review", "innovation_discovery"],
                        "version": "2.0.0"
                    }
                ]
            }

        @app.get("/tasks")
        async def fetch_all_tasks():
            return {"tasks": [task.to_dict() for task in self.tasks]}

        @app.post("/tasks")
        async def create_new_task(request: Request):
            if not BRAGI_AVAILABLE:
                raise HTTPException(
                    status_code=503,
                    detail="Task processing functionality is unavailable at this moment."
                )

            payload = await request.json()
            new_task = await self._spawn_task(payload, request)
            return new_task.to_dict()

        @app.post("/chat")
        async def handle_chat_message(request: Request):
            if not BRAGI_AVAILABLE:
                raise HTTPException(
                    status_code=503,
                    detail="Chat functionality is unavailable at this moment."
                )

            try:
                payload = await request.json()
                message = payload.get("message", "")
                agent_id = payload.get("agent_id", "assistant")  # Default to Bragi

                # Log which agent handles the message
                logger.info(f"Processing chat message via {agent_id} agent: {message}")
                
                # Send message to appropriate agent
                if agent_id == "assistant":
                    response = bragi.chat(message)
                elif agent_id == "coordinator":
                    response = "Greetings! I am Odin. " + bragi.chat(message)
                elif agent_id == "architect":
                    response = "Hail! I am Thor. " + bragi.chat(message)
                else:
                    response = bragi.chat(message)

                # Log the response
                logger.info(f"Chat response from {agent_id}: {response}")

                # Broadcast the response via WebSocket
                await self.ws_manager.broadcast("chat_response", {
                    "agent_id": agent_id,
                    "message": response,
                    "timestamp": datetime.now().isoformat()
                })

                return {
                    "response": response,
                    "agent_id": agent_id
                }

            except Exception as exc:
                logger.error(f"Failed to process chat message: {exc}")
                raise HTTPException(
                    status_code=500,
                    detail=str(exc)
                )

        @app.websocket("/ws")
        async def websocket_endpoint(websocket: WebSocket):
            """
            WebSocket endpoint for real-time communication with clients.
            Handles connection, message processing, and graceful disconnection.
            """
            try:
                # Handle CORS for WebSocket upgrade
                origin = websocket.headers.get("origin")
                if origin not in allowed_origins:
                    await websocket.close(code=1008)  # Policy violation
                    return

                await self.ws_manager.connect(websocket)
                logger.info(f"New WebSocket client connected from {origin}")
                
                # Send initial connection success message
                await websocket.send_json({
                    "type": "connection_status",
                    "data": {
                        "status": "connected",
                        "message": "Successfully connected to Forge WebSocket server"
                    }
                })
                
                while True:
                    try:
                        # Wait for messages from the client
                        data = await websocket.receive_json()
                        logger.debug(f"Received WebSocket message: {data}")
                        
                        # Process the message based on its type
                        if isinstance(data, dict) and "type" in data:
                            message_type = data["type"]
                            
                            if message_type == "ping":
                                await websocket.send_json({
                                    "type": "pong",
                                    "data": {"timestamp": datetime.now().isoformat()}
                                })
                            else:
                                # Handle other message types
                                await self.ws_manager.broadcast(message_type, data.get("data", {}))
                    
                    except WebSocketDisconnect:
                        logger.info("WebSocket client disconnected normally")
                        self.ws_manager.disconnect(websocket)
                        break
                    
                    except Exception as e:
                        logger.error(f"Error processing WebSocket message: {str(e)}")
                        await websocket.send_json({
                            "type": "error",
                            "data": {"message": "Internal server error"}
                        })
                
            except Exception as e:
                logger.error(f"WebSocket connection error: {str(e)}")
                try:
                    if not websocket.client_state == WebSocketState.DISCONNECTED:
                        await websocket.close(code=1011)  # Internal error
                except Exception as close_error:
                    logger.error(f"Error closing WebSocket: {str(close_error)}")
                finally:
                    self.ws_manager.disconnect(websocket)

    async def _spawn_task(self, task_data: Dict[str, Any], request: Request) -> Task:
        """
        Create and process a new Task, then return the completed Task object.
        """
        generated_id = str(uuid.uuid4())
        current_time = datetime.now()

        task = Task(
            id=generated_id,
            description=task_data.get("description", ""),
            status=TaskStatus.IN_PROGRESS,
            created_at=current_time,
            updated_at=current_time,
            agent_id=task_data.get("agent_id", "assistant"),
            priority=task_data.get("priority", 1),
            metadata=TaskMetadata(
                client_info=str(request.client),
                source=task_data.get("source", "api"),
                tags=task_data.get("tags", [])
            )
        )

        self.tasks.append(task)
        await self.ws_manager.broadcast("task_created", task.to_dict())

        try:
            # Send initial progress update
            await self.ws_manager.broadcast_task_progress(
                task.id, 0.1, "started", "Initializing task processing"
            )

            # Log which agent processes the task
            logger.info(f"Processing task {task.id} via {task.agent_id}")
            
            # Process task with appropriate agent
            if task.agent_id == "assistant":
                await self.ws_manager.broadcast_agent_activity(task.agent_id, "Bragi is analyzing your task")
                result_text = bragi.process_task(task.id, task.description)
            elif task.agent_id == "coordinator":
                await self.ws_manager.broadcast_agent_activity(task.agent_id, "Odin is coordinating your task")
                result_text = "Odin's wisdom: " + bragi.process_task(task.id, task.description)
            elif task.agent_id == "architect":
                await self.ws_manager.broadcast_agent_activity(task.agent_id, "Thor is architecting your solution")
                result_text = "Thor's guidance: " + bragi.process_task(task.id, task.description)
            else:
                result_text = bragi.process_task(task.id, task.description)
            
            # Send completion progress
            await self.ws_manager.broadcast_task_progress(
                task.id, 1.0, "completed", "Task completed successfully"
            )
            
            task.result = result_text
            task.status = TaskStatus.COMPLETED
            task.updated_at = datetime.now()
            self.metrics.tasks_completed += 1
            
        except Exception as exc:
            logger.error(f"Failed to process task {task.id}: {exc}")
            task.result = str(exc)
            task.status = TaskStatus.FAILED
            task.updated_at = datetime.now()
            self.metrics.tasks_failed += 1
            
            # Send failure progress
            await self.ws_manager.broadcast_task_progress(
                task.id, 1.0, "failed", f"Task failed: {str(exc)}"
            )

        await self.ws_manager.broadcast("task_update", task.to_dict())
        return task

    def run(self, port: int = None) -> None:
        """
        Start the Forge AI System using uvicorn on the specified port.
        """
        port = port or PORT  # Use provided port or default from environment
        logger.info(f"Starting Forge AI System (v2.0.0) on port {port} ...")
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            log_level="info",
            access_log=True
        )

# Create the kernel instance
kernel = ForgeKernel()

# Improved WebSocket CORS middleware
@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    # Special handling for WebSocket upgrade requests
    if request.headers.get("upgrade", "").lower() == "websocket":
        origin = request.headers.get("origin")
        if origin in allowed_origins:
            # Return response with CORS headers for WebSocket
            return Response(
                status_code=101,  # Switching Protocols
                headers={
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Expose-Headers": "*",
                    "Connection": "Upgrade",
                    "Upgrade": "websocket",
                }
            )
    
    response = await call_next(request)
    
    origin = request.headers.get("origin")
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Expose-Headers"] = "*"
    
    return response

if __name__ == "__main__":
    # Start the server using the PORT from environment variable
    uvicorn.run("forge_kernel:app", host="0.0.0.0", port=PORT, reload=True)
