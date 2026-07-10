# HR Management Backend

An HR management backend built with Node.js, TypeScript, Express, Knex, and PostgreSQL. This project demonstrates a layered architecture with strict separation of concerns — routes, controllers, services, and repositories each have a single responsibility. It was built as part of a backend engineering assessment.

## Features

- JWT Authentication (register, login, profile)
- Employee CRUD with photo upload
- Attendance UPSERT (create or update per employee per day)
- Attendance filtering by employee, date range, and pagination
- Employee search by name/designation
- Employee sorting by name, salary, hire date
- Monthly attendance report with late-count aggregation
- Request validation via Joi
- Global error handling with consistent response format
- Pagination on list endpoints

## Tech Stack

| Technology     | Purpose                           |
| -------------- | --------------------------------- |
| Node.js        | JavaScript runtime                |
| TypeScript     | Type safety                       |
| Express        | HTTP framework                    |
| Knex           | SQL query builder / migrations    |
| PostgreSQL     | Relational database               |
| JWT            | Authentication                    |
| Joi            | Request validation                |
| Multer         | File uploads                      |
| bcrypt         | Password hashing                  |
| Helmet         | Security headers                  |
| CORS           | Cross-origin resource sharing     |
| Morgan         | HTTP request logging              |
| express-rate-limit | API rate limiting             |

## Architecture

The project follows a strict layered architecture with clear separation of concerns:

```
Route → Controller → Service → Repository → Database
```

| Layer          | Responsibility                                      |
| -------------- | --------------------------------------------------- |
| **Route**      | Maps HTTP endpoints to controller methods           |
| **Controller** | Handles request/response, delegates to service      |
| **Service**    | Contains business logic, orchestrates repositories  |
| **Repository** | Pure database access (queries), no business logic   |
| **Database**   | PostgreSQL via Knex query builder                   |

## Project Structure

```
hr-management-backend/
├── src/
│   ├── config/              # App configuration (env, db, jwt, upload)
│   ├── constants/           # HTTP status codes
│   ├── controllers/         # Request/response handlers
│   ├── database/
│   │   ├── migrations/      # Database schema migrations
│   │   └── seeds/           # Seed data
│   ├── errors/              # Custom error classes
│   ├── interfaces/          # TypeScript interfaces
│   ├── middlewares/         # Express middlewares
│   ├── repositories/        # Database access layer
│   ├── routes/              # Express route definitions
│   ├── services/            # Business logic layer
│   ├── types/               # TypeScript type aliases
│   ├── utils/               # Helpers (ApiResponse, AsyncHandler, Logger)
│   ├── validators/          # Joi validation schemas
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── tests/                   # Test files
├── uploads/                 # File upload directory
├── .env.example             # Environment template
├── .eslintrc.json           # ESLint config
├── .gitignore               # Git ignore rules
├── .prettierrc              # Prettier config
├── docker-compose.yml       # Docker Compose setup
├── Dockerfile               # Multi-stage Docker build
├── jest.config.ts           # Jest configuration
├── knexfile.ts              # Knex configuration
├── package.json             # Project manifest
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## Design Decisions

- **Layered architecture** — Code is split into Routes, Controllers, Services, and Repositories. Each layer has one job and depends on the layer below it. This makes the code testable and easy to modify without side effects.
- **Business logic in services** — Controllers only parse requests and send responses. Services contain all decision-making: duplicate checks, validation orchestration, and data transformation.
- **Repositories are pure SQL** — Repositories receive parameters and return rows. No business logic, no conditionals beyond query building. This keeps database access predictable.
- **Attendance UPSERT in POST** — `POST /api/attendance` checks if a record exists for the given `(employee_id, date)` pair. If it does, the record is updated; if not, a new one is inserted. This avoids duplicate attendance entries.
- **Reports via SQL aggregation** — Monthly reports use PostgreSQL `to_char` and `CASE WHEN` to compute totals and late counts inside the database. This avoids loading all records into the application and looping over them.

## Database Schema Overview

Three main tables:

- **`hr_users`** — Stores login credentials (name, email, hashed password). Used by the auth module only.
- **`employees`** — Stores employee profile data (name, designation, salary, hiring date, photo path). Each employee is a separate entity from the user who created them.
- **`attendance`** — Stores daily check-in records. Each row tracks `employee_id`, `date`, and `check_in_time`. `employee_id` is a foreign key referencing `employees.id`.

## Prerequisites

- Node.js >= 20
- PostgreSQL >= 16
- npm >= 10

## Installation

```bash
git clone <repo-url>
cd hr-management-backend
npm install
cp .env.example .env
```

## Environment Variables

| Variable         | Description              | Default                            |
| ---------------- | ------------------------ | ---------------------------------- |
| `PORT`           | API server port          | `3000`                             |
| `NODE_ENV`       | Environment mode         | `development`                      |
| `DB_HOST`        | PostgreSQL host          | `localhost`                        |
| `DB_PORT`        | PostgreSQL port          | `5432`                             |
| `DB_NAME`        | Database name            | `hr_management`                    |
| `DB_USER`        | Database user            | `postgres`                         |
| `DB_PASSWORD`    | Database password        | `postgres`                         |
| `JWT_SECRET`     | JWT signing secret       | `default-secret-change-in-production` |
| `JWT_EXPIRES_IN` | JWT token expiry         | `7d`                               |
| `UPLOAD_DIR`     | File upload directory    | `uploads`                          |

## Database Setup

```bash
# Create the database
createdb hr_management

# Run migrations
npm run migrate:latest

# (Optional) Seed demo data
npm run seed:run
```

## Commands

| Command                    | Description                              |
| -------------------------- | ---------------------------------------- |
| `npm run dev`              | Start dev server with hot reload         |
| `npm run build`            | Compile TypeScript to `dist/`            |
| `npm start`                | Start production server                  |
| `npm run lint`             | Lint source code with ESLint             |
| `npm run format`           | Format code with Prettier                |
| `npm test`                 | Run tests                                |
| `npm run migrate:make`     | Create a new migration file              |
| `npm run migrate:latest`   | Run pending migrations                   |
| `npm run migrate:rollback` | Rollback the last migration batch        |
| `npm run seed:run`         | Run all seed files                       |

## Default Seeded User

After running seeds, you can log in with:

| Field    | Value                |
| -------- | -------------------- |
| Email    | `admin@example.com`  |
| Password | `admin123`           |

## API Endpoints

### Health

| Method | Path          | Auth Required | Description              |
| ------ | ------------- | ------------- | ------------------------ |
| GET    | `/api/health` | No            | Health check             |

### Authentication

| Method | Path                | Auth Required | Description          |
| ------ | ------------------- | ------------- | -------------------- |
| POST   | `/api/auth/register`| No            | Register a new user  |
| POST   | `/api/auth/login`   | No            | Login and get JWT    |
| GET    | `/api/auth/me`      | Yes           | Get current user     |

### Employees

| Method | Path                   | Auth Required | Description                  |
| ------ | ---------------------- | ------------- | ---------------------------- |
| POST   | `/api/employees`       | Yes           | Create employee (with photo) |
| GET    | `/api/employees`       | Yes           | List all employees           |
| GET    | `/api/employees/:id`   | Yes           | Get employee by ID           |
| PUT    | `/api/employees/:id`   | Yes           | Update employee (with photo) |
| DELETE | `/api/employees/:id`   | Yes           | Delete employee              |

**Employee query parameters** (`GET /api/employees`):

| Parameter   | Type   | Description                       |
| ----------- | ------ | --------------------------------- |
| `page`      | number | Page number (default: 1)          |
| `limit`     | number | Items per page (default: 10)      |
| `search`    | string | Search by name or designation     |
| `sortBy`    | string | Sort field (name, salary, hiring_date, created_at) |
| `sortOrder` | string | Sort direction (asc, desc)        |

### Attendance

| Method | Path                             | Auth Required | Description                    |
| ------ | -------------------------------- | ------------- | ------------------------------ |
| POST   | `/api/attendance`                | Yes           | Create or update (UPSERT)      |
| GET    | `/api/attendance`                | Yes           | List attendance records        |
| GET    | `/api/attendance/:id`            | Yes           | Get attendance by ID           |
| PUT    | `/api/attendance/:id`            | Yes           | Update attendance record       |
| DELETE | `/api/attendance/:id`            | Yes           | Delete attendance record       |

**Attendance query parameters** (`GET /api/attendance`):

| Parameter     | Type   | Description                         |
| ------------- | ------ | ----------------------------------- |
| `page`        | number | Page number (default: 1)            |
| `limit`       | number | Items per page (default: 10)        |
| `employee_id` | number | Filter by employee                  |
| `date`        | string | Filter by exact date (YYYY-MM-DD)   |
| `from`        | string | Filter start date (YYYY-MM-DD)      |
| `to`          | string | Filter end date (YYYY-MM-DD)        |

### Reports

| Method | Path                              | Auth Required | Description                       |
| ------ | --------------------------------- | ------------- | --------------------------------- |
| GET    | `/api/reports/attendance`         | Yes           | Monthly attendance report         |

**Report query parameters** (`GET /api/reports/attendance`):

| Parameter     | Type   | Description                         |
| ------------- | ------ | ----------------------------------- |
| `month`       | string | Month in YYYY-MM format (required)  |
| `employee_id` | number | Filter by employee (optional)       |

## Example Requests

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"user@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### List Employees (Paginated)

```bash
curl http://localhost:3000/api/employees?page=1&limit=10 \
  -H "Authorization: Bearer <token>"
```

### Create Attendance (UPSERT)

```bash
curl -X POST http://localhost:3000/api/attendance \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"employee_id":1,"date":"2026-07-09","check_in_time":"09:10:00"}'
```

### Monthly Report

```bash
curl "http://localhost:3000/api/reports/attendance?month=2026-07" \
  -H "Authorization: Bearer <token>"
```

## Security

- **bcrypt** — Passwords are hashed with bcrypt before storage. The raw password is never persisted.
- **JWT** — Authenticated sessions are managed via signed JWTs. Tokens expire after a configurable duration (`JWT_EXPIRES_IN`).
- **Helmet** — Sets security-related HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.) to mitigate common web vulnerabilities.
- **CORS** — Cross-origin requests are restricted. Configure allowed origins in `src/app.ts`.
- **express-rate-limit** — A global rate limiter caps requests to 100 per 15 minutes per IP to prevent abuse.
- **Joi validation** — Every input payload is validated against a schema before reaching the service layer. Invalid requests return 422 with the validation details.

## API Response Format

All endpoints return JSON with a consistent envelope:

**Success:**
```json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Description of what went wrong",
  "errors": []
}
```

Paginated list responses include a `pagination` object with `page`, `limit`, `totalItems`, and `totalPages`.

## Authentication Flow

1. A `POST /api/auth/register` request hashes the password with bcrypt and inserts a row into `hr_users`. A `POST /api/auth/login` request verifies the password hash against the stored hash.
2. On successful login, the server signs a JWT containing `{ id, name, email }` and returns it in the response body.
3. For protected routes, the client sends the JWT in the `Authorization: Bearer <token>` header.
4. The `AuthMiddleware.authenticate` middleware decodes the token on every request, verifies its validity, and attaches the decoded payload to `req.user`. If the token is missing, expired, or invalid, the request is rejected with 401 before reaching the controller.

## Coding Standards

- Strict TypeScript with `strict: true`
- No `any` types allowed
- No default exports
- OOP with classes throughout
- One responsibility per class
- Dependency injection friendly constructors
- ESLint + Prettier enforced

## Project Conventions

- Interfaces prefixed with `I` (e.g., `IUser`, `IEmployee`)
- Error classes suffixed with `Error` (e.g., `NotFoundError`, `ValidationError`)
- Repository classes deal only with database queries
- Service classes contain all business logic
- Controller classes handle only request/response
- Route classes define endpoint mappings only
- Validation schemas live in `validators/` as class static properties

## Production Notes

- **Health check** — `GET /api/health` returns uptime and timestamp.
- **Rate limiting** — 100 requests per 15 minutes per IP via express-rate-limit.
- **Request logging** — Morgan logs HTTP requests in combined format.
- **Graceful shutdown** — SIGTERM and SIGINT close the HTTP server and destroy the Knex pool before exiting.
- **Docker** — Multi-stage Dockerfile and docker-compose.yml with PostgreSQL 16 Alpine.
- **Testing** — Jest with ts-jest; tests in `tests/`, run with `npm test`.

## Assumptions

- **One attendance per employee per day** — The system allows exactly one check-in record per employee per calendar date. POSTing twice for the same `(employee_id, date)` updates the existing record instead of creating a duplicate.
- **POST /attendance is an UPSERT** — The POST endpoint creates or updates based on the `(employee_id, date)` pair. If you intend to force a new insert, use PUT with the existing record ID.
- **Late threshold is 09:45 AM** — Any `check_in_time` strictly after `09:45:00` is marked as late. A check-in at exactly `09:45:00` is considered on time.
- **Employee photos are stored locally** — Uploaded photos are saved to the `uploads/` directory on the server filesystem. No external storage (S3, CDN) is configured.
- **Protected endpoints require a valid JWT** — All employee, attendance, and report endpoints require the `Authorization: Bearer <token>` header. Requests without a valid token receive a 401 response.

## License

MIT


