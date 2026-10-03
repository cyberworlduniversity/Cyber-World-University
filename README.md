# Cyber World University (CWU)

Cyber World University (CWU) is an open-source cybersecurity education project focused on making cybersecurity learning more accessible to students, beginners, and aspiring cybersecurity professionals.

The platform is being developed as a structured online learning system with cybersecurity courses, phases, lessons, question banks, quizzes, final exams, student progress, certificates, and protected administration features.

## Project Goals

- Provide structured cybersecurity learning resources.
- Make cybersecurity concepts easier for students and beginners to study.
- Support practical and security-focused learning.
- Provide quizzes and examinations for knowledge assessment.
- Track student learning progress.
- Provide certificates for completed learning activities.
- Maintain a secure and maintainable open-source codebase.
- Continue improving the project through documentation, testing, security reviews, and community contributions.

## Current Platform

The current platform includes:

- Dynamic courses
- Course phases
- Lessons
- Question bank
- Quizzes
- Final examinations
- Student progress
- Certificates
- Administrative management
- Protected student APIs

## Technology

- Frontend: HTML5, CSS3, vanilla JavaScript
- Backend: Node.js 24.x
- API: Vercel Node.js serverless functions
- Database: MongoDB
- Deployment: Vercel
- Authentication: HTTP-only session cookies with server-side password hashing

## Vercel Configuration

Static HTML, CSS, and JavaScript files are served directly, while `/api/*.js` files run as Node.js serverless functions.

The application uses the following environment variables:

- `MONGODB_URI` — required database connection string
- `MONGODB_DB` — optional database name; defaults to `cwu`

Never commit database credentials, API keys, session secrets, or other sensitive information.

## Security

Security is an important part of CWU. The platform includes measures such as:

- Server-side authentication and authorization
- HTTP-only sessions
- Password hashing
- Admin role checks
- ObjectId validation
- Server-side quiz and examination scoring
- Hidden correct answers
- Attempt and time limits
- Secure response headers
- Input validation
- Output escaping

Security issues should be reported privately according to [SECURITY.md](SECURITY.md).

## Development

Before making changes:

1. Read the existing project documentation and source structure.
2. Run the application locally using the project's development instructions.
3. Make focused changes.
4. Test affected functionality.
5. Check for security and input-validation issues.
6. Update documentation when behavior changes.
7. Submit a pull request with a clear description of the change.

## Contributing

Contributions are welcome when they improve the project, educational content, accessibility, security, documentation, testing, or maintainability.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Code of Conduct

All contributors and community members are expected to participate respectfully. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Roadmap

Planned development areas include:

- Expanding cybersecurity courses and learning resources
- Improving lesson and study-material management
- Expanding quizzes and examination content
- Improving student progress features
- Improving certificate workflows
- Strengthening security testing
- Improving documentation
- Improving accessibility and responsive design
- Supporting additional community contributions

The roadmap may change as the project evolves.

## License

This project is distributed under the MIT License. See [LICENSE](LICENSE) for details.

## Project Status

CWU is an actively developing open-source project. Features and architecture may change as development continues.

**Current release:** 3.1.0
