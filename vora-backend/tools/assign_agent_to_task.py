import logging
import sys
import traceback
from typing import Optional
from uuid import uuid4
from langchain_core.tools import tool
import utils

logger = logging.getLogger("forge.tools.assign_agent")

@tool
def assign_agent_to_task(agent_name: str, task: str) -> str:
    """
    Assign an agent to a task and get their response.
    
    Args:
        agent_name: Name of the agent to assign (bragi, odin, thor, software_engineer, ai_researcher)
        task: The task description or request for the agent
        
    Returns:
        The agent's response to the task
    """
    task_id = str(uuid4())
    logger.info(f"Task {task_id}: Assigning agent '{agent_name}' to task: {task}")

    try:
        # Load and validate agent
        agent_module = utils.load_module(f"agents/{agent_name}.py")
        agent_function = getattr(agent_module, agent_name)
        
        # Execute task
        result = agent_function(uuid=task_id)
        response = result["messages"][-1].content if result and result.get("messages") else None
        
        # Cleanup
        if agent_module.__name__ in sys.modules:
            del sys.modules[agent_module.__name__]
        
        if not response:
            raise ValueError(f"Agent '{agent_name}' returned no response")
            
        logger.info(f"Task {task_id}: Agent '{agent_name}' completed task successfully")
        return response

    except Exception as e:
        error_msg = f"Task {task_id}: Failed to execute task with agent '{agent_name}': {str(e)}"
        logger.error(f"{error_msg}\n{traceback.format_exc()}")
        return error_msg