# Use Python slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /api_app

# Copy requirements first for better caching
COPY requirements.txt .

# Make a copy of .env.example
COPY .env.example .env

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
