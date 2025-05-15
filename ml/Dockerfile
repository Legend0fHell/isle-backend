# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container at /app
# This includes main.py, config.py, models.py, and the models_store directory
COPY . .

# Ensure the models_store directory and its contents are copied
# If models_store is not in the root of the context (./ml), adjust the COPY path accordingly.
# For example, if it's in ml/models_store, and your Docker context is ./ml, then COPY models_store ./models_store is correct.

# Make port 15100 available to the world outside this container
EXPOSE 15100

# Define environment variables (if any, though we are using config.py)
# ENV NAME World

# Run main.py when the container launches
# The command should be uvicorn main:sio_app --host 0.0.0.0 --port 15100
# However, our main.py currently uses uvicorn.run() directly.
# If main.py is executable and has a shebang, `CMD ["python", "main.py"]` works.
# Otherwise, explicitly call python interpreter.
CMD ["python", "main.py"] 