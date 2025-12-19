# Contributing to Vialytics

Thanks for your interest in contributing to Vialytics! 🎉

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Set up** the development environment (see README.md)

## Development Setup

### Backend (Python)
```bash
cd vialytics-api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
PYTHONPATH=src python -m vialytics_api.api_server
```

### Frontend (Bun/React)
```bash
cd app
bun install
bun run dev
```

### Indexer (Rust)
```bash
cd vialytics-core
cargo build --release
```

## Making Changes

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test locally
4. Commit with clear messages: `git commit -m "feat: add new feature"`
5. Push and open a PR

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

## Code Style

- **Python**: Follow PEP 8
- **TypeScript/React**: Use ESLint/Prettier defaults
- **Rust**: Run `cargo fmt` before committing

## Need Help?

- Open an issue for bugs or feature requests
- Reach out on X: [@eaabimbola](https://x.com/eaabimbola)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
