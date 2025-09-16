# Contributing

Thank you for considering contributing to AI + AGI Campus Control System! This project uses only free and open-source tooling and welcomes contributions across frontend, backend, AI/ML, and infrastructure.

## Ground rules
- Be respectful and constructive. See our Code of Conduct.
- Prefer issues before large changes; discuss design first.
- Keep PRs focused and reasonably small.
- Do not commit secrets. Use `.env` files locally and sample env files for docs.

## Getting started
1. Fork the repo and clone your fork.
2. Create a feature branch: `git checkout -b feature/<short-description>`.
3. Make changes with clear commits (Conventional Commits recommended: `feat:`, `fix:`, `docs:`, `chore:`).
4. Run checks and add/update docs/tests when applicable.
5. Push and open a Pull Request against `main`.

## Project layout
- `frontend/` Flutter apps (student, faculty, admin, parent)
- `backend/` Python APIs (FastAPI/Django), services, models, utils
- `ai_agi/` agents and orchestration (LangChain, AutoGPT, CrewAI)
- `vision/` face recognition
- `voice_video/` STT/TTS/YouTube
- `database/` Firebase, PostgreSQL
- `docs/` documentation

## Code style
- Python: prefer type hints; format with Black and isort (if configured) and run linters.
- Dart/Flutter: `dart format .` and fix analyzer warnings.
- Markdown: wrap at ~100 columns where practical; use descriptive headings.

## Testing
- Add unit tests for new logic when possible.
- Keep tests deterministic and fast.

## Pull Requests
- Fill out the PR template.
- Link related issues (e.g., `Closes #123`).
- Include screenshots or recordings for UI changes.

## Security
- Do not open public issues for vulnerabilities. See `SECURITY.md` to report privately.

## License
By contributing, you agree that your contributions will be licensed under the MIT License.
