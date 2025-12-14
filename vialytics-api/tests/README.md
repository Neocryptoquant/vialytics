# Tests for Vialytics API services

These are unit/integration tests for the `vialytics-api` Python backend.

## Running Tests

```bash
cd vialytics-api
source venv/bin/activate
python -m unittest discover tests/
```

## Test Structure

- `tests/services/` - Service layer tests (price, label, analytics)
- `tests/api/` - API endpoint tests

## Helius Integration Tests

Helius tests require `HELIUS_API_KEY` environment variable. Tests will skip automatically if not set.

```bash
HELIUS_API_KEY=your_key python -m unittest tests/test_analytics.py
```
