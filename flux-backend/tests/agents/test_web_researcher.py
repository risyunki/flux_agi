import pytest
from agents.ai_researcher import ai_researcher

def test_ai_researcher_exists():
    """Test that the AI researcher agent exists and has the correct interface"""
    assert callable(ai_researcher)
    assert ai_researcher.__doc__ is not None
    assert "ai" in ai_researcher.__doc__.lower()
    assert "researcher" in ai_researcher.__doc__.lower()
    assert "explores" in ai_researcher.__doc__.lower()
    assert "technologies" in ai_researcher.__doc__.lower()