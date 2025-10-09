<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">NestJS Production Starter</h1>
<p align="center">A highly opinionated, production-ready NestJS starter template with enterprise-grade features.</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
</p>

---

## ⚠️ Important Disclaimer

**This starter template is highly opinionated and tailored to my specific use case and production environment.**

- 🎯 **Purpose-Built**: This template reflects my personal development workflow, architectural preferences, and production infrastructure setup.
- 🔧 **Not Plug-and-Play**: It is **not designed to be a general-purpose starter** and may require significant modifications to fit your needs.
- 🏗️ **Opinionated Architecture**: The services, patterns, and integrations chosen here are based on my specific requirements and may not align with your project's needs.
- 📚 **Learning Resource**: While you're welcome to use this as a reference or starting point, expect to adapt it extensively for your own use case.

**If you're looking for a more flexible, general-purpose NestJS starter, consider using the official [NestJS CLI](https://docs.nestjs.com/cli/overview) or other community starters.**

---

## 🏢 Infrastructure Note

**Most external services are already hosted in my production environment**, which is why the `docker-compose.yml` file only includes PostgreSQL and Redis for local development.

### Services NOT Included in Docker Compose:

- **Elasticsearch** (with APM) - Hosted externally for logging and monitoring
- **RabbitMQ** - Hosted externally for message queuing
- **MinIO** - Hosted externally for object storage
- **Keycloak** - Hosted externally for authentication and authorization
- **Resend** - Cloud-based email service (API-only)
- **Stripe** - Cloud-based payment service (API-only)
- **Sentry** - Cloud-based error tracking (API-only)

### To Use This Starter:

You will need to either:

1. **Provide your own instances** of these services (cloud-hosted or self-hosted)
2. **Modify the `docker-compose.yml`** to include local instances of these services
3. **Update the configuration** in `.env` to point to your service instances

---

## ✨ Features

This starter template includes a comprehensive set of production-ready features organized by category:

### 🔐 Authentication & Authorization

- **Keycloak Integration** (`nest-keycloak-connect`)
  - JWT token decryption and validation
  - RBAC (Role-Based Access Control) with guards
  - Resource-level permissions
  - User management is done via Keycloak's UI

### 💬 Real-Time Communication

- **WebSocket Support** (Socket.IO)
  - Redis adapter for horizontal scaling
  - Example real-time chat functionality (group and direct messages)
- **Dual API Support**
  - REST API endpoints for all chat operations
  - WebSocket events for real-time updates
  - Consistent response format across both protocols

### 📨 Messaging & Background Jobs

- **RabbitMQ Integration** (`@golevelup/nestjs-rabbitmq`)
  - Message queue for asynchronous task processing
  - Separate worker process for background jobs
  - Email queue with retry logic
  - Chat notification queue
- **Cron Jobs** (`@nestjs/schedule`)
  - Scheduled tasks (e.g., daily unread chat notifications)
  - Timezone-aware scheduling
- **Email System**
  - React Email templates for beautiful, responsive emails
  - Resend integration for reliable email delivery
  - Email preview server for development
  - Queue-based email sending

### 🗄️ Database & Caching

- **Prisma ORM**
  - Type-safe database queries
  - Database migrations and seeding
  - PostgreSQL support (MongoDB and MySQL in progress)
  - Prisma Studio for database management
- **Redis Caching**
  - Endpoint-level caching
  - Cache invalidation strategies
  - Session storage

### 📁 File Management

- **MinIO Integration**
  - S3-compatible object storage
  - Secure file uploads
  - Pre-signed URL generation
  - No local file storage (cloud-first approach)

### 🛡️ Security & Rate Limiting

- **Helmet** - Security headers
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** (`@nestjs/throttler`)
  - Global rate limiting
  - Per-endpoint rate limiting with custom configurations
  - Redis-backed rate limit storage

### 📊 Logging & Monitoring

- **Winston Logger**
  - Structured logging
  - Multiple log levels
  - Context-aware logging
- **Elasticsearch Integration**
  - Centralized log aggregation
  - Log search and analysis
- **Elastic APM**
  - Application performance monitoring
  - Distributed tracing
  - Error tracking
- **Sentry**
  - Error tracking and reporting
  - Performance monitoring
  - Release tracking

### 💳 Payments

- **Stripe Integration** (`@golevelup/nestjs-stripe`)
  - Payment processing
  - Subscription management
  - Webhook handling
  - Test and production mode support

### 🏗️ Architecture & Best Practices

- **API Versioning** - URI-based versioning (`/api/v1/...`)
- **Swagger Documentation** - Auto-generated API docs with authentication
- **Custom Error Handling**
  - Standardized error responses
  - Custom error codes (VALIDATION_ERROR, OTP_REQUIRED, etc.)
  - Detailed error messages
- **Response Transformation**
  - Consistent response format
  - Automatic pagination metadata
  - Success/error response wrappers
- **Pagination**
  - Offset-based pagination
  - Cursor-based pagination (for real-time data)
- **Graceful Shutdown** - Proper cleanup of connections and resources
- **Health Checks** (`@nestjs/terminus`) - Application health monitoring
- **Validation** - Class-validator and class-transformer for DTO validation

### 🧪 Development Tools

- **Commitlint & Husky** - Enforce conventional commits
- **ESLint & Prettier** - Code formatting and linting
- **Jest** - Unit and E2E testing
- **TypeScript** - Full type safety
- **Path Aliases** - Clean imports with `@/` prefix

---

## 🛠️ Services & Technologies

### External Services

| Service           | Purpose                                   | Required    |
| ----------------- | ----------------------------------------- | ----------- |
| **PostgreSQL**    | Primary database                          | ✅ Yes      |
| **Redis**         | Caching, rate limiting, WebSocket adapter | ✅ Yes      |
| **Elasticsearch** | Log aggregation and search                | ✅ Yes      |
| **RabbitMQ**      | Message queue for background jobs         | ✅ Yes      |
| **MinIO**         | S3-compatible object storage              | ✅ Yes      |
| **Keycloak**      | Authentication and authorization          | ✅ Yes      |
| **Resend**        | Email delivery service                    | ✅ Yes      |
| **Stripe**        | Payment processing                        | ⚠️ Optional |
| **Sentry**        | Error tracking and monitoring             | ⚠️ Optional |

### Core NestJS Modules

- `@nestjs/common` - Core framework
- `@nestjs/core` - Core framework
- `@nestjs/platform-express` - Express adapter
- `@nestjs/platform-socket.io` - WebSocket support
- `@nestjs/config` - Configuration management
- `@nestjs/swagger` - API documentation
- `@nestjs/schedule` - Cron jobs
- `@nestjs/throttler` - Rate limiting
- `@nestjs/cache-manager` - Caching
- `@nestjs/terminus` - Health checks
- `@nestjs/websockets` - WebSocket support

### Key Libraries & Integrations

- **ORM & Database**: `@prisma/client`, `@prisma/extension-accelerate`
- **Authentication**: `nest-keycloak-connect`
- **Caching**: `cache-manager`, `cache-manager-redis-store`, `ioredis`
- **Logging**: `winston`, `winston-elasticsearch`, `elastic-apm-node`
- **Message Queue**: `@golevelup/nestjs-rabbitmq`
- **Email**: `resend`, `@react-email/components`, `react`, `react-dom`
- **Storage**: `minio`
- **WebSocket**: `socket.io`, `@socket.io/redis-adapter`
- **Payments**: `@golevelup/nestjs-stripe`, `stripe`
- **Monitoring**: `@sentry/nestjs`, `@sentry/profiling-node`
- **Security**: `helmet`
- **Validation**: `class-validator`, `class-transformer`
- **Utilities**: `lodash`, `axios`

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following services running and accessible:

- PostgreSQL database
- Redis server
- Elasticsearch cluster
- RabbitMQ server
- MinIO server
- Keycloak server

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd nest-starter

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your .env file with your service credentials
# (See .env.example for all required variables)

# Generate Prisma client
npx prisma generate

# Run database migrations
npm run db:migrate:dev

# Seed the database (optional)
npm run db:seed
```

### Running the Application

```bash
# Development mode (main application)
npm run start:dev

# Development mode (worker process)
npm run start:worker:dev

# Production mode (main application)
npm run start:prod

# Production mode (worker process)
npm run start:worker:prod

# Email template preview server
npm run email:dev
```

The main application will be available at `http://localhost:3000` (or your configured port).

### API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3000/docs
```

### Docker Compose (Local Development)

```bash
# Start PostgreSQL and Redis
npm run docker:start

# Stop services
docker-compose down
```

---

## 📁 Project Structure

```
src/
├── common/           # Shared DTOs, interfaces, and types
├── config/           # Configuration files for all services
├── constants/        # Application constants
├── database/         # Prisma schema, migrations, and seeds
├── decorators/       # Custom decorators
├── enums/            # Enums (error codes, etc.)
├── filters/          # Exception filters
├── guards/           # Custom guards
├── interceptors/     # Custom interceptors
├── modules/          # Feature modules
│   ├── api.module.ts # API module aggregator
│   ├── chat/         # Chat feature
│   ├── file/         # File upload feature
│   ├── health/       # Health checks
│   └── user/         # User management
├── shared/           # Shared modules
│   ├── cache/        # Cache module
│   ├── guards/       # Shared guards
│   ├── keycloak/     # Keycloak integration
│   ├── logger/       # Winston logger
│   ├── mail/         # Email templates and service
│   ├── queues/       # RabbitMQ queues
│   ├── storage/      # MinIO storage
│   └── websocket/    # WebSocket gateway
├── utils/            # Utility functions
├── worker/           # Worker module for background jobs
├── main.ts           # Main application entry point
└── main.worker.ts    # Worker process entry point
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

---

## 📝 Environment Variables

See `.env.example` for a complete list of required environment variables. Key variables include:

- **Application**: `NODE_ENV`, `APP_NAME`, `APP_PORT`, `APP_URL`
- **Database**: `DATABASE_URL`, `POSTGRES_URL`
- **Redis**: `REDIS_URL`, `REDIS_HOST`, `REDIS_PORT`
- **Elasticsearch**: `ELASTIC_SEARCH_URL`, `ELASTIC_APM_SERVER_URL`
- **RabbitMQ**: `RABBITMQ_URI`
- **MinIO**: `MINIO_URL`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`
- **Keycloak**: `KEYCLOAK_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID`
- **Email**: `RESEND_API_KEY`, `EMAIL_SENDER`
- **Stripe**: `STRIPE_API_KEY`
- **Sentry**: `SENTRY_DSN`
- **WebSocket**: `WEBSOCKET_PORT`, `WEBSOCKET_PATH`, `WEBSOCKET_CORS_ORIGIN`

---

## 🏗️ Architecture Highlights

### Dual Process Architecture

This application runs as **two separate Node.js processes**:

1. **Main Application** (`main.ts`)
   - Handles HTTP REST API requests
   - Manages WebSocket connections
   - Publishes messages to RabbitMQ queues

2. **Worker Process** (`main.worker.ts`)
   - Consumes messages from RabbitMQ queues
   - Runs scheduled cron jobs
   - Processes background tasks (emails, notifications, etc.)
   - Does NOT expose HTTP endpoints

### Key Patterns

- **DRY Principles**: Reuse of filters, interceptors, and services across REST and WebSocket
- **Queue-Based**: Asynchronous processing for emails and notifications
- **Horizontal Scaling**: Redis adapter enables WebSocket scaling across multiple instances

---

## 🔄 Roadmap

### In Progress

- [ ] Multiple database connections with Prisma
  - [x] PostgreSQL
  - [ ] MongoDB
  - [ ] MySQL
- [ ] Setup bare minimum docker compose for all services

### Known Issues

- Error responses with Prisma could be more detailed

---

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Socket.IO Documentation](https://socket.io/docs/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [React Email Documentation](https://react.email/)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

This is a personal starter template and is not open for contributions. However, feel free to fork and adapt it for your own needs.
