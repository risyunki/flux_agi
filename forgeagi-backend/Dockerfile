# Use Python 3.11 slim image
FROM python:3.11-slim

# Install python3-venv
RUN apt-get update && apt-get install -y \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create and activate virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies in virtual environment
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application
COPY . .

# Create startup script
RUN echo '#!/bin/bash\n\
. /opt/venv/bin/activate\n\
echo "Starting app on port $PORT..."\n\
exec uvicorn forge_kernel:app --host 0.0.0.0 --port $PORT\n'\
> start.sh && chmod +x start.sh

ENV PORT=8000

CMD ["./start.sh"]
