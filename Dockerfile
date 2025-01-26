# FluxAGI - Next-Generation AI Agent Orchestration Platform
# Use Python 3.11 slim image
FROM python:3.11-slim

WORKDIR /app

# Create and activate virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy requirements first for better caching
COPY flux-backend/requirements.txt .

# Install dependencies in virtual environment
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FluxAGI backend application
COPY flux-backend .

# Create startup script with detailed logging and error handling
RUN echo '#!/bin/bash\n\
set -e\n\
. /opt/venv/bin/activate\n\
\n\
echo "=== FluxAGI Environment Information ==="\n\
echo "Python version:"\n\
python --version\n\
echo "Working directory: $(pwd)"\n\
echo "Directory contents:"\n\
ls -la\n\
echo "Environment variables (excluding secrets):"\n\
env | grep -vE "KEY|TOKEN|SECRET|PASSWORD"\n\
\n\
echo "=== Checking Required Files ==="\n\
if [ ! -f "flux_kernel.py" ]; then\n\
    echo "ERROR: flux_kernel.py not found!"\n\
    exit 1\n\
fi\n\
\n\
echo "=== Starting FluxAGI Application ==="\n\
PORT="${PORT:-8000}"\n\
echo "Using port: $PORT"\n\
exec uvicorn flux_kernel:app --host 0.0.0.0 --port $PORT --log-level debug\n'\
> start.sh && chmod +x start.sh

# Set environment variables for FluxAGI
ENV PORT=8000
ENV PYTHONUNBUFFERED=1
ENV ENVIRONMENT=production

CMD ["./start.sh"]
