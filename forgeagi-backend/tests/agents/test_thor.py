import pytest
from agents.thor import thor

def test_thor_exists():
    """Test that the Thor agent exists and has the correct interface"""
    assert callable(thor)
    assert thor.__doc__ is not None
    assert "mighty" in thor.__doc__.lower()
    assert "architect" in thor.__doc__.lower()
    assert "forges" in thor.__doc__.lower()
    assert "maintains" in thor.__doc__.lower() 