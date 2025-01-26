import sqlite3
import importlib.util
import sys
import string
import secrets
import traceback
import json
from typing import Dict, List, Optional, Any
from pathlib import Path
from langgraph.checkpoint.base import BaseCheckpointSaver

# ------------------------------------------------------
# Database Configuration
# ------------------------------------------------------
DB_PATH = Path("checkpoints.sqlite")
conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)

class SQLiteCheckpointer(BaseCheckpointSaver):
    """Enhanced SQLite-based checkpoint system for Forge AI"""
    
    def __init__(self, connection: sqlite3.Connection):
        self.connection = connection
        self.cursor = connection.cursor()
        self._initialize_schema()

    def _initialize_schema(self) -> None:
        """Initialize the database schema with proper indexing"""
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS checkpoints (
                id TEXT PRIMARY KEY,
                data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        self.connection.commit()

    def get(self, key: str) -> dict:
        """Retrieve checkpoint data by key"""
        self.cursor.execute(
            "SELECT data FROM checkpoints WHERE id = ?", 
            (key,)
        )
        result = self.cursor.fetchone()
        return json.loads(result[0]) if result else {}

    def put(self, key: str, value: dict) -> None:
        """Store checkpoint data with automatic JSON serialization"""
        self.cursor.execute(
            "INSERT OR REPLACE INTO checkpoints (id, data) VALUES (?, ?)",
            (key, json.dumps(value))
        )
        self.connection.commit()

    def get_tuple(self, config: dict) -> Optional[tuple]:
        """Get tuple data from checkpoint"""
        key = json.dumps(config, sort_keys=True)
        data = self.get(key)
        if not data:
            return None
        return tuple(data.get('tuple', []))

    def put_tuple(self, config: dict, value: tuple) -> None:
        """Store tuple data in checkpoint"""
        key = json.dumps(config, sort_keys=True)
        self.put(key, {'tuple': list(value)})

# Initialize the checkpointer
checkpointer = SQLiteCheckpointer(conn)

# ------------------------------------------------------
# Agent Management
# ------------------------------------------------------
def all_tool_functions() -> List[Any]:
    """
    List all available tool functions from the tools directory.
    Returns a list of loaded tool functions.
    """
    tools = list_tools()
    tool_funcs = []
    
    for tool in tools:
        try:
            module = load_module(f"tools/{tool}.py")
            tool_func = getattr(module, tool)
            tool_funcs.append(tool_func)
        except Exception as e:
            print(f"WARNING: Failed to load tool '{tool}'. {e.__class__.__name__}: {e}")
    
    return tool_funcs

def list_broken_tools() -> Dict[str, List[Any]]:
    """
    Identify and report broken tools in the system.
    Returns a dictionary of tool names and their error details.
    """
    tools = list_tools()
    broken_tools = {}
    
    for tool in tools:
        try:
            module = load_module(f"tools/{tool}.py")
            getattr(module, tool)
            del sys.modules[module.__name__]
        except Exception as e:
            exception_trace = traceback.format_exc()
            broken_tools[tool] = [e, exception_trace]
    
    return broken_tools

def list_tools() -> List[str]:
    """
    List all available tools in the tools directory.
    Returns a list of tool names without the .py extension.
    """
    tools_dir = Path("tools")
    return [
        f.stem for f in tools_dir.glob("*.py")
        if f.is_file() and not f.name.startswith("_")
    ]

def all_agents(exclude: List[str] = ["bragi"]) -> Dict[str, str]:
    """
    List all available agents and their documentation.
    Optionally exclude specific agents from the list.
    """
    agents = list_agents()
    agents = [agent for agent in agents if agent not in exclude]
    agent_funcs = {}
    
    for agent in agents:
        try:
            module = load_module(f"agents/{agent}.py")
            agent_func = getattr(module, agent)
            agent_funcs[agent] = agent_func.__doc__
            del sys.modules[module.__name__]
        except Exception as e:
            print(f"WARNING: Failed to load agent '{agent}'. {e.__class__.__name__}: {e}")
    
    return agent_funcs

def list_broken_agents() -> Dict[str, List[Any]]:
    """
    Identify and report broken agents in the system.
    Returns a dictionary of agent names and their error details.
    """
    agents = list_agents()
    broken_agents = {}
    
    for agent in agents:
        try:
            module = load_module(f"agents/{agent}.py")
            getattr(module, agent)
            del sys.modules[module.__name__]
        except Exception as e:
            exception_trace = traceback.format_exc()
            broken_agents[agent] = [e, exception_trace]
    
    return broken_agents

def list_agents() -> List[str]:
    """
    List all available agents in the agents directory.
    Returns a list of agent names without the .py extension.
    """
    agents_dir = Path("agents")
    return [
        f.stem for f in agents_dir.glob("*.py")
        if f.is_file() and not f.name.startswith("_")
    ]

def gensym(length: int = 32, prefix: str = "forge_") -> str:
    """
    Generate a unique symbol for module naming.
    Uses cryptographically secure random generation.
    """
    alphabet = string.ascii_uppercase + string.ascii_lowercase + string.digits
    symbol = "".join(secrets.choice(alphabet) for _ in range(length))
    return f"{prefix}{symbol}"

def load_module(source: str, module_name: Optional[str] = None) -> Any:
    """
    Load a Python module from a file path.
    
    Args:
        source: Path to the source file
        module_name: Optional custom module name
    
    Returns:
        Loaded module object
    """
    if module_name is None:
        module_name = gensym()

    spec = importlib.util.spec_from_file_location(module_name, source)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not load module from {source}")
        
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    spec.loader.exec_module(module)

    return module