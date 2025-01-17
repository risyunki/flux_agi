FROM node:18-slim as web-builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY agentk-web/package*.json ./agentk-web/

# Install dependencies
RUN npm ci
RUN cd agentk-web && npm ci

# Copy source code
COPY . .

# Build web app
RUN cd agentk-web && npm run build

# Set up Python virtual environment and install dependencies
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
WORKDIR /app/AgentK
RUN /opt/venv/bin/pip install --no-cache-dir -r requirements.txt
WORKDIR /app

# Expose ports
EXPOSE 3000
EXPOSE 8000

# Start both services
CMD cd agentk-web && npm start & cd AgentK && /opt/venv/bin/python3 agent_kernel.py 