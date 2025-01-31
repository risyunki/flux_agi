import pytest
from unittest.mock import patch
import os.path

from agents import bragi, odin, thor, software_engineer, ai_researcher, web_researcher
from tools.list_available_agents import list_available_agents

def test_list_available_agents_exists():
    """Test that the list_available_agents tool exists and has the correct interface"""
    assert callable(list_available_agents)
    assert list_available_agents.__doc__ is not None
    assert "list" in list_available_agents.__doc__.lower()
    assert "agent" in list_available_agents.__doc__.lower()

@patch("os.listdir")
def test_list_available_agents_finds_agents(mock_listdir):
    """Test that the tool correctly identifies and returns agent files"""
    mock_listdir.return_value = [
        "bragi.py",
        "odin.py",
        "thor.py",
        "software_engineer.py",
        "ai_researcher.py",
        "web_researcher.py",
        "__init__.py",
        "not_an_agent.txt"
    ]
    
    result = list_available_agents()
    
    assert isinstance(result, list)
    assert "bragi" in result
    assert "odin" in result
    assert "thor" in result
    assert "software_engineer" in result
    assert "ai_researcher" in result
    assert "web_researcher" in result
    assert "__init__" not in result
    assert "not_an_agent" not in result
    mock_listdir.assert_called_once()

@patch("os.listdir")
def test_list_available_agents_empty_directory(mock_listdir):
    """Test behavior when agents directory is empty"""
    mock_listdir.return_value = []
    
    result = list_available_agents()
    
    assert isinstance(result, list)
    assert len(result) == 0
    mock_listdir.assert_called_once()

@patch("os.listdir")
def test_list_available_agents_error_handling(mock_listdir):
    """Test error handling when directory access fails"""
    mock_listdir.side_effect = Exception("Test error")
    
    result = list_available_agents()
    
    assert isinstance(result, list)
    assert len(result) == 0
    mock_listdir.assert_called_once() 