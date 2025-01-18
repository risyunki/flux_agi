FROM python:3.11-slim

# Set working directory for the entire build
WORKDIR /app/AgentK

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements and AgentK code
COPY AgentK/* ./

# Set up Python virtual environment and install dependencies
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose FastAPI port
EXPOSE 8000

# Start the FastAPI server using shell form
CMD /opt/venv/bin/python3 agent_kernel.py 