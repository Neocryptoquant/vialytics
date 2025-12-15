FROM python:3.11-slim

WORKDIR /app

# Install system deps for SQLite
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install poetry
RUN pip install --no-cache-dir poetry

# Copy dependency files
COPY pyproject.toml poetry.lock ./

# Install dependencies (no dev)
RUN poetry config virtualenvs.create false && \
    poetry install --only main --no-interaction --no-ansi

# Copy source code
COPY src/ ./src/

# Create data directory for SQLite databases
RUN mkdir -p /data

# Environment configuration
ENV VIALYTICS_DATA_DIR=/data
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Run the API server
CMD ["python", "-m", "vialytics_api.api_server"]
