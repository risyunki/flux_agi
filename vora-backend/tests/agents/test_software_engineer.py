import pytest
from agents.software_engineer import software_engineer

def test_software_engineer_exists():
    """Test that the software engineer agent exists and has the correct interface"""
    assert callable(software_engineer)
    assert software_engineer.__doc__ is not None
    assert "software" in software_engineer.__doc__.lower()
    assert "engineer" in software_engineer.__doc__.lower()
    assert "implements" in software_engineer.__doc__.lower()
    assert "maintains" in software_engineer.__doc__.lower()
