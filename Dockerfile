FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements and AgentK code
COPY AgentK /app/AgentK

# Set up Python virtual environment and install dependencies
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Set working directory to AgentK
WORKDIR /app/AgentK

# Install Python dependencies
RUN /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# Expose FastAPI port
EXPOSE 8000

# Start the FastAPI server (using absolute path for both Python and the script)
CMD ["/opt/venv/bin/python3", "/app/AgentK/agent_kernel.py"] 