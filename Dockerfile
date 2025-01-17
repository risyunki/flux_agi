FROM node:18-slim as web-builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
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

# Copy AgentK requirements and install Python dependencies
RUN cd AgentK && pip3 install -r requirements.txt

# Expose ports
EXPOSE 3000
EXPOSE 8000

# Start both services
CMD cd agentk-web && npm start & cd AgentK && python3 agent_kernel.py 