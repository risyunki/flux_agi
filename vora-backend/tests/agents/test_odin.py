import pytest
from agents.odin import odin

def test_odin_exists():
    """Test that the Odin agent exists and has the correct interface"""
    assert callable(odin)
    assert odin.__doc__ is not None
    assert "all-father" in odin.__doc__.lower()
    assert "operations" in odin.__doc__.lower()
    assert "coordinates" in odin.__doc__.lower()
    assert "optimal" in odin.__doc__.lower() 