# Qadem Platform

REST API for companies to post jobs/internships and candidates to browse, build a profile, and apply.

## Tech Stack

- **Backend:** NestJS, TypeScript, PostgreSQL, TypeORM
- **Auth:** JWT (access + refresh tokens)
- **Docs:** Swagger (OpenAPI)
- **Testing:** Jest (e2e)
- **CI/CD:** GitHub Actions

## Features

### Auth
- Register / Login (Candidate or Company)
- JWT access + refresh tokens
- Protected routes via guards

### Companies
- Company profile (create/update)
- Public company view by ID

### Candidates
- Candidate profile (create/update)
- Resume upload (PDF) and download
- Remove resume

### Jobs
- Companies: create, update, delete, list own jobs
- Public: search & filter jobs (type, location, salary range, sort, pagination)

### Applications
- Candidates: apply to a job, check if already applied, view their applications, view stats
- Companies: view applicants per job, update application status, view stats
- Duplicate-apply protection

---

## Getting Started

### Prerequisites
- Node.js 24+
- PostgreSQL 16+
- npm

### Installation

```bash
git clone <repo-url>
cd Qadem_Platform/backend
npm install
```

### Environment Variables

Create a `.env` file in `backend/` based on `.env.example`:

```env
NODE_ENV=development
PORT=3001

DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=job_platform

JWT_ACCESS_SECRET=your_access_secret_change_this
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_change_this
JWT_REFRESH_EXPIRES_IN=7d
```

### Database Setup

```bash
npm run migration:run
```

### Run the App

```bash
npm run start:dev
```

API runs at `http://localhost:3001/api`

### API Documentation (Swagger)

```
http://localhost:3001/api/docs
```

---

## Testing

The project includes end-to-end (e2e) tests covering critical business logic:

- Duplicate application prevention
- Job ownership (companies can't edit/delete other companies' jobs)
- Role-based access (candidates vs companies)
- Application status transitions

### Run Tests Locally

```bash
npm run test:e2e
```

> Requires Node 24+ and a running PostgreSQL instance.

### Continuous Integration

Tests run automatically on every `push` and `pull_request` to `main` via **GitHub Actions**. The workflow:
1. Spins up a temporary PostgreSQL service container
2. Installs dependencies
3. Runs database migrations
4. Runs the full e2e test suite

Workflow file: `.github/workflows/backend-tests.yml`

You can check test results under the **Actions** tab on GitHub.

---

## API Testing with Postman

A ready-to-use Postman collection is included for manual API testing.

### Import Steps
1. Open Postman
2. Click **Import**
3. Select `Qadem-API.postman_collection.json` (located in `backend/docs/` or project root)
4. Create an Environment with:
   - `baseUrl` = `http://localhost:3001`
   - `accessToken` = *(leave empty, filled after login)*

### Suggested Flow
1. `POST /api/auth/register` → create an account
2. `POST /api/auth/login` → get `accessToken`, save it to the environment variable
3. Use protected endpoints (jobs, applications, profiles) with the saved token

---

## Project Structure

```
Qadem_Platform/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── companies/
│   │   ├── candidates/
│   │   ├── jobs/
│   │   ├── applications/
│   │   └── ...
│   ├── test/
│   │   └── app.e2e-spec.ts
│   ├── docs/
│   │   └── Qadem-API.postman_collection.json
│   └── .env.example
├── .github/
│   └── workflows/
│       └── backend-tests.yml
└── README.md
```

---

## Notes

- `synchronize: false` is enforced — schema changes go through migrations only.
- Global `ValidationPipe`, `ClassSerializerInterceptor`, and role/ownership guards are applied across all modules.
- Sensitive fields (passwords, tokens) are excluded from all API responses.