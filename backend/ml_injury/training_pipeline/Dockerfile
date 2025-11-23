# Python ML environment
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install build dependencies needed for packages like scikit-learn
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy all backend files first
COPY backend ./backend

# Install Python dependencies from the correct location
RUN pip install --no-cache-dir -r ./backend/ml_injury/training_pipeline/requirements.txt

# Expose port for Flask
EXPOSE 5002

# Start ML API - use absolute path
CMD ["python", "/app/backend/ml_injury/training_pipeline/app.py"]