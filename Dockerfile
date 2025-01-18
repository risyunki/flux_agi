FROM python:3.11-slim

# Set working directory for the entire build
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements and AgentK code
COPY AgentK AgentK/

# Set working directory to AgentK
WORKDIR /app/AgentK

# Set up Python virtual environment and install dependencies
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Default port (can be overridden by Railway)
ENV PORT=8000

# Expose the port
EXPOSE $PORT

# Start the FastAPI server using uvicorn with explicit options
CMD ["uvicorn", "agent_kernel:app", "--host", "0.0.0.0", "--port", "$PORT", "--log-level", "info"] 