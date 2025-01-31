import pytest
from agents.bragi import bragi

def test_bragi_exists():
    """Test that the Bragi agent exists and has the correct interface"""
    assert callable(bragi)
    assert bragi.__doc__ is not None
    assert "wise" in bragi.__doc__.lower()
    assert "eloquent" in bragi.__doc__.lower()
    assert "assistant" in bragi.__doc__.lower()
    assert "natural language" in bragi.__doc__.lower() 