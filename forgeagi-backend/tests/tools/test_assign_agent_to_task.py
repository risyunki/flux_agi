import pytest
from unittest.mock import patch, MagicMock

from agents import bragi, odin, thor, software_engineer, ai_researcher
from tools.assign_agent_to_task import assign_agent_to_task

def test_assign_agent_to_task_exists():
    """Test that the assign_agent_to_task tool exists and has the correct interface"""
    assert callable(assign_agent_to_task)
    assert assign_agent_to_task.__doc__ is not None
    assert "agent" in assign_agent_to_task.__doc__.lower()
    assert "task" in assign_agent_to_task.__doc__.lower()

@pytest.mark.parametrize("agent_name", [
    "bragi",
    "odin",
    "thor",
    "software_engineer",
    "ai_researcher"
])
def test_assign_agent_to_task_validates_agent_names(agent_name):
    """Test that the tool accepts all valid agent names in its docstring"""
    assert agent_name in assign_agent_to_task.__doc__.lower()

@patch("utils.load_module")
def test_assign_agent_to_task_success(mock_load_module):
    """Test successful task assignment and execution"""
    # Setup mock agent
    mock_agent = MagicMock()
    mock_agent.return_value = {
        "messages": [
            MagicMock(content="Test response")
        ]
    }
    
    # Setup mock module
    mock_module = MagicMock()
    mock_module.__name__ = "test_agent"
    setattr(mock_module, "test_agent", mock_agent)
    mock_load_module.return_value = mock_module
    
    test_task = "test task description"
    result = assign_agent_to_task("test_agent", test_task)
    
    # Verify results
    assert result == "Test response"
    mock_load_module.assert_called_once_with("agents/test_agent.py")
    mock_agent.assert_called_once_with(uuid=pytest.ANY)

@patch("utils.load_module")
def test_assign_agent_to_task_empty_response(mock_load_module):
    """Test handling of empty response from agent"""
    # Setup mock agent
    mock_agent = MagicMock()
    mock_agent.return_value = {
        "messages": []
    }
    
    # Setup mock module
    mock_module = MagicMock()
    mock_module.__name__ = "test_agent"
    setattr(mock_module, "test_agent", mock_agent)
    mock_load_module.return_value = mock_module
    
    result = assign_agent_to_task("test_agent", "test task")
    
    # Verify results
    assert "Failed to execute task" in result
    assert "returned no response" in result
    mock_load_module.assert_called_once_with("agents/test_agent.py")
    mock_agent.assert_called_once_with(uuid=pytest.ANY)

@patch("utils.load_module")
def test_assign_agent_to_task_error_handling(mock_load_module):
    """Test error handling when task assignment fails"""
    # Setup mock to raise error
    mock_load_module.side_effect = Exception("Test error")
    
    result = assign_agent_to_task("test_agent", "test task")
    
    # Verify results
    assert "Failed to execute task" in result
    assert "Test error" in result
    mock_load_module.assert_called_once_with("agents/test_agent.py") 