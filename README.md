# HR Management Backend

A production-grade REST API for managing employees, attendance, and monthly reports.

## Architecture

The project follows a strict layered architecture:

```
Route → Controller → Service → Repository → Database
```

| Layer        | Responsibility                                                |
| ------------ | ------------------------------------------------------------- |
| **Route**    | Maps HTTP endpoints to controller methods                     |
| **Controller** | Handles request/response, delegates to service               |
| **Service**  | Contains business logic, orchestrates repositories            |
| **Repository** | Pure database access (queries), no business logic            |
| **Database** | PostgreSQL via Knex query builder                             |

## Tech Stack

| Technology   | Purpose                         |
| ------------ | ------------------------------- |
| Node.js      | Runtime                         |
| TypeScript   | Type safety                     |
| Express      | HTTP framework                  |
| Knex         | SQL query builder / migrations  |
| PostgreSQL   | Relational database             |
| JWT          | Authentication                  |
| Joi          | Request validation              |
| Multer       | File uploads                    |
| Helmet       | Security headers                |
| CORS         | Cross-origin resource sharing   |
| Morgan       | HTTP request logging            |
| Rate Limit   | API rate limiting               |

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
# Edit .env with your database credentials
```

## Environment Variables

| Variable        | Description                  | Default                        |
| --------------- | ---------------------------- | ------------------------------ |
| `PORT`          | API server port              | `3000`                         |
| `NODE_ENV`      | Environment mode             | `development`                  |
| `DB_HOST`       | PostgreSQL host              | `localhost`                    |
| `DB_PORT`       | PostgreSQL port              | `5432`                         |
| `DB_NAME`       | Database name                | `hr_management`                |
| `DB_USER`       | Database user                | `postgres`                     |
| `DB_PASSWORD`   | Database password            | `postgres`                     |
| `JWT_SECRET`    | JWT signing secret           | (change in production)         |
| `JWT_EXPIRES_IN`| JWT token expiry             | `7d`                           |
| `UPLOAD_DIR`    | File upload directory        | `uploads`                      |

## Database Setup

```bash
# Create the database
createdb hr_management

# Run migrations
npm run migrate:latest

# (Optional) Seed data
npm run seed:run
```

## Migration Commands

| Command                     | Description              |
| --------------------------- | ------------------------ |
| `npm run migrate:make`      | Create a new migration   |
| `npm run migrate:latest`    | Run pending migrations   |
| `npm run migrate:rollback`  | Rollback last batch      |

## Seed Commands

| Command            | Description       |
| ------------------ | ----------------- |
| `npm run seed:run` | Run all seeds     |

## Development Commands

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Start dev server with hot reload        |
| `npm run build`     | Compile TypeScript to dist/             |
| `npm start`         | Start production server                 |
| `npm run lint`      | Lint source code                        |
| `npm run format`    | Format code with Prettier               |
| `npm test`          | Run tests                               |

## Production Build

```bash
npm run build
npm start
```

## Folder Structure

```
hr-management-backend/
├── src/
│   ├── config/          # App configuration (env, db, jwt, upload)
│   ├── constants/       # HTTP status codes
│   ├── controllers/     # Request/response handlers
│   ├── database/        # Migrations and seeds
│   ├── errors/          # Custom error classes
│   ├── interfaces/      # TypeScript interfaces
│   ├── middlewares/      # Express middlewares
│   ├── repositories/    # Database access layer
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic layer
│   ├── types/           # TypeScript type aliases
│   ├── utils/           # Helpers (ApiResponse, AsyncHandler, Logger)
│   ├── validators/      # Joi validation schemas
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── tests/               # Test files
├── uploads/             # File upload directory
├── .env.example         # Environment template
├── .eslintrc.json       # ESLint config
├── .gitignore           # Git ignore rules
├── .prettierrc          # Prettier config
├── docker-compose.yml   # Docker Compose setup
├── Dockerfile           # Multi-stage Docker build
├── jest.config.ts       # Jest configuration
├── knexfile.ts          # Knex configuration
├── package.json         # Project manifest
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## API Endpoints

| Method | Path                              | Auth Required | Description                       |
| ------ | --------------------------------- | ------------- | --------------------------------- |
| GET    | `/api/health`                     | No            | Health check                      |
| POST   | `/api/auth/register`              | No            | Register a new user               |
| POST   | `/api/auth/login`                 | No            | User login                        |
| GET    | `/api/auth/profile`               | Yes           | Get authenticated user profile    |
| POST   | `/api/employees`                  | Yes           | Create employee (with photo)      |
| GET    | `/api/employees`                  | Yes           | List all employees                |
| GET    | `/api/employees/:id`              | Yes           | Get employee by ID                |
| PUT    | `/api/employees/:id`              | Yes           | Update employee (with photo)      |
| DELETE | `/api/employees/:id`              | Yes           | Delete employee                   |
| POST   | `/api/attendance/check-in`        | Yes           | Record attendance check-in        |
| PUT    | `/api/attendance/:id`             | Yes           | Update attendance record          |
| GET    | `/api/attendance/employee/:employeeId` | Yes      | Get attendance by employee        |
| GET    | `/api/attendance/reports/monthly` | Yes           | Get monthly attendance report     |
| DELETE | `/api/attendance/:id`             | Yes           | Delete attendance record          |

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

1. User registers via `POST /api/auth/register` (name, email, password)
2. User logs in via `POST /api/auth/login` (email, password) → receives JWT token
3. Client includes token in `Authorization: Bearer <token>` header for protected routes
4. `AuthMiddleware.authenticate` verifies the token and attaches user payload to request

## Coding Standards

- Strict TypeScript with `strict: true`
- No `any` types allowed
- No default exports
- OOP with classes throughout
- One responsibility per class
- Dependency injection friendly constructors
- ESLint + Prettier enforced

## Project Conventions

- All interfaces prefixed with `I` (e.g., `IUser`)
- All error classes suffixed with `Error` (e.g., `NotFoundError`)
- Repository classes deal only with database queries
- Service classes contain all business logic
- Controller classes handle only request/response
- Route classes define endpoint mappings only
- Validation schemas live in `validators/` as class static properties

## Production Readiness

### Health Check

`GET /api/health` returns uptime and timestamp, useful for load balancer health probes and monitoring systems.

### Rate Limiting

A global rate limiter (express-rate-limit) is applied to all routes, allowing 100 requests per 15 minutes per IP. The limit is configurable in `src/app.ts`.

### HTTP Request Logging

Morgan is wired into the existing Logger utility, producing structured HTTP request logs in 'combined' format for production observability.

### Graceful Shutdown

The server handles SIGTERM and SIGINT signals by closing the HTTP server and destroying the Knex connection pool before exiting. A 10-second forced shutdown ensures the process does not hang indefinitely.

### Testing

Jest with ts-jest is configured. A placeholder health check test validates `GET /api/health` returns 200. Tests live in the `tests/` directory and run via `npm test`.

### Docker Support

A multi-stage Dockerfile builds the TypeScript project in a `build` stage (including devDependencies) then produces a minimal runtime image with only production dependencies and the compiled output. A docker-compose.yml spins up the API alongside a postgres:16-alpine database with a named volume and health check.

## License

MIT

## Future Improvements

- Refresh token rotation
- Password reset flow
- Role-based access control (RBAC)
- Advanced attendance reporting (weekly, custom date ranges)
- Employee photo thumbnail generation
- Pagination, sorting, filtering for all list endpoints
- API documentation with Swagger/OpenAPI
- CI/CD pipeline integration
- Sentry or similar error tracking
- Redis caching layer
- Email notifications
- Audit logging
