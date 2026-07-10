# HR Management Backend

A production-grade REST API for managing employees, attendance, and monthly reports. Built with Node.js, TypeScript, Express, Knex, and PostgreSQL following a strict layered architecture.

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

## Error Handling

All API responses follow a consistent format:

**Success:**
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Authentication Flow

1. User registers via `POST /api/auth/register` or logs in via `POST /api/auth/login`
2. Server returns a JWT token
3. Client includes the token in the `Authorization: Bearer <token>` header for protected routes
4. `AuthMiddleware.authenticate` verifies the token and attaches the user payload to the request

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

## Production Readiness

### Health Check

`GET /api/health` returns server uptime and timestamp, useful for load balancer health probes.

### Rate Limiting

A global rate limiter allows 100 requests per 15 minutes per IP. Configurable in `src/app.ts`.

### HTTP Request Logging

Morgan logs all HTTP requests in combined format via the Logger utility.

### Graceful Shutdown

The server handles SIGTERM and SIGINT by closing the HTTP server and destroying the Knex connection pool before exiting.

### Testing

Jest with ts-jest is configured. Tests live in the `tests/` directory and run via `npm test`.

### Docker

A multi-stage Dockerfile and docker-compose.yml are included. The compose file spins up the API alongside a PostgreSQL 16 Alpine database with persistent volume storage.

## License

MIT

## Future Improvements

- Refresh token rotation
- Password reset flow
- Role-based access control (RBAC)
- Employee photo thumbnail generation
- API documentation with Swagger/OpenAPI
- CI/CD pipeline integration
- Sentry or similar error tracking
- Redis caching layer
- Email notifications
- Audit logging
