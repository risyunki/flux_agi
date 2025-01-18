FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install python3-venv
RUN apt-get update && apt-get install -y \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements and backend code
COPY forgeagi-backend forgeagi-backend/

# Set working directory to forgeagi-backend
WORKDIR /app/forgeagi-backend

# Create and activate virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the app runs on
ENV PORT=8000
EXPOSE 8000

# Command to run the application
CMD ["python", "forge_kernel.py"]