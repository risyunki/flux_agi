from fastapi import FastAPI, WebSocket, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from typing import List, Dict, Any
import uuid
import os

try:
    from agents import hermes
    HERMES_AVAILABLE = True
except ImportError:
    HERMES_AVAILABLE = False

app = FastAPI()

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

# In-memory storage
tasks = []
active_connections: List[WebSocket] = []

@app.get("/")
async def root():
    return {"status": "ok", "version": "1.0.0"}

@app.get("/agents")
async def get_agents():
    return {
        "agents": [
            {
                "id": "bragi",
                "name": "Bragi",
                "status": "active" if HERMES_AVAILABLE else "inactive",
                "type": "assistant",
                "description": "A wise and eloquent AI assistant that can help with various tasks"
            },
            {
                "id": "odin",
                "name": "Odin",
                "status": "active" if HERMES_AVAILABLE else "inactive",
                "type": "coordinator",
                "description": "The wise overseer of all operations and strategic planning"
            },
            {
                "id": "thor",
                "name": "Thor",
                "status": "active" if HERMES_AVAILABLE else "inactive",
                "type": "architect",
                "description": "The master builder and maintainer of the system's agents"
            }
        ]
    }

@app.get("/tasks")
async def get_tasks():
    return {"tasks": tasks}

@app.post("/tasks")
async def create_task(request: Request):
    if not HERMES_AVAILABLE:
        return {"error": "Task processing is currently unavailable"}
        
    task_data = await request.json()
    task_id = str(uuid.uuid4())
    task = {
        "id": task_id,
        "description": task_data.get("description", ""),
        "status": "in_progress",
        "result": None
    }
    tasks.append(task)
    
    # Notify connected clients about task creation
    for connection in active_connections:
        try:
            await connection.send_json({
                "type": "task_update",
                "data": task
            })
        except:
            pass
    
    # Process task with Hermes
    try:
        result = hermes.hermes(task_id, task["description"])
        task["result"] = result
        task["status"] = "completed"
    except Exception as e:
        task["result"] = str(e)
        task["status"] = "failed"
    
    # Notify connected clients about task completion
    for connection in active_connections:
        try:
            await connection.send_json({
                "type": "task_update",
                "data": task
            })
        except:
            pass
    
    return task

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        pass
    finally:
        if websocket in active_connections:
            active_connections.remove(websocket)

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)