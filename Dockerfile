FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install python3-venv
RUN apt-get update && apt-get install -y \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Copy only the requirements file first
COPY ./forgeagi-backend/requirements.txt .

# Create and activate virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY ./forgeagi-backend .

# Expose the port the app runs on
ENV PORT=8000
EXPOSE 8000

# Command to run the application with uvicorn
CMD ["uvicorn", "forge_kernel:app", "--host", "0.0.0.0", "--port", "8000"] 