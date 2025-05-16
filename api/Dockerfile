# Use an official Python runtime as a parent image
FROM python:3.12-slim


# Set the working directory in the container
WORKDIR /api_app

# Copy the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code from the current directory (.) in the host 
# into the current directory (.) in the container (which is /api_app)
# Thanks to .dockerignore, old subdirectories won't be copied.
COPY . .

# Expose the port the app runs on (FastAPI default is 8000)
# This is for documentation; actual port mapping is in docker-compose.yml
EXPOSE 8000

# Command to run the application
# It assumes your FastAPI app instance is named 'app' in 'main.py'
# If you have a script like create_tables.py, you might run it during entrypoint or separately.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 