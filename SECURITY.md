# Security Policy

We take the security of this project seriously and appreciate responsible disclosures.

## Supported versions
This is an academic capstone project; we aim to maintain `main` with security fixes as they arise.

## Reporting a vulnerability
- Prefer opening a private security advisory in GitHub (if enabled for this repo).
- Alternatively, email the maintainers: <set_security_contact_email@yourdomain.example>.
- Please include steps to reproduce, impact, and any suggested mitigations.

Do not file public GitHub issues for security reports.

## Best practices for contributors
- Never commit secrets (API keys, tokens). Use `.env` and local secrets.
- Rotate credentials that may have been exposed during development.
- Validate and sanitize all user inputs in backend APIs.
- Follow the principle of least privilege for Firebase and database access.
