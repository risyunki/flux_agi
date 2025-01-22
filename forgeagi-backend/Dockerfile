# Use Python 3.11 slim image
FROM python:3.11-slim

WORKDIR /app

# Create startup script for debugging
RUN echo '#!/bin/bash\n\
echo "Starting app..."\n\
echo "PORT=$PORT"\n\
echo "Working directory: $(pwd)"\n\
echo "Files in directory:"\n\
ls -la\n\
echo "Python path:"\n\
echo $PYTHONPATH\n\
echo "Starting uvicorn..."\n\
PYTHONPATH=/app uvicorn backend.api.main:app --host 0.0.0.0 --port $PORT --log-level debug\n'\
> start.sh && chmod +x start.sh

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend directory
COPY backend/ /app/backend/

# Set environment variables
ENV PORT=8000
ENV PYTHONPATH=/app

# Expose the port
EXPOSE 8000

# Use the startup script
CMD ["./start.sh"]
