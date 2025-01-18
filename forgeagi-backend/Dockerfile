FROM python:3.11-slim

# Install system dependencies
COPY apt-packages-list.txt .
RUN apt-get update && \
    xargs apt-get install -y < apt-packages-list.txt && \
    rm -rf /var/lib/apt/lists/* && \
    rm apt-packages-list.txt

# Create app directory
WORKDIR /app

# Copy Python requirements and Forge AI code
COPY forgeagi-backend forgeagi-backend/

# Set working directory to Forge AI backend
WORKDIR /app/forgeagi-backend

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set Python to run in unbuffered mode
ENV PYTHONUNBUFFERED=1

# Run the application
CMD ["python", "forge_kernel.py"]