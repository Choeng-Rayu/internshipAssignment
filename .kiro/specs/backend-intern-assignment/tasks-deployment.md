# Deployment and Infrastructure Tasks

## Overview

This document contains all deployment, infrastructure, and DevOps tasks for the full-stack application. This includes Docker configuration, docker-compose orchestration, documentation, and production readiness.

**Technology Stack:**
- Docker with multi-stage builds
- Docker Compose for orchestration
- MySQL 8.0+ (containerized)
- Redis 7.0+ (containerized)

**Working Directory:** Workspace root

## Tasks

- [x] 1. Docker infrastructure setup
  - [x] 1.1 Create Docker Compose configuration
    - Create docker-compose.yml in workspace root
    - Define MySQL service:
      - Use official mysql:8.0 image
      - Set MYSQL_ROOT_PASSWORD, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD from env
      - Add volume for data persistence: mysql_data:/var/lib/mysql
      - Expose port 3306
      - Add healthcheck for MySQL readiness
    - Define Redis service:
      - Use official redis:7-alpine image
      - Add volume for data persistence: redis_data:/data
      - Expose port 6379
      - Add healthcheck for Redis readiness
    - Define backend service:
      - Build from ./backend with Dockerfile
      - Set environment variables (DATABASE_URL, REDIS_HOST, JWT_SECRET, etc.)
      - Expose port 3000
      - Depend on mysql and redis services
      - Add healthcheck for backend API
    - Define frontend service:
      - Build from ./frontend with Dockerfile
      - Set NEXT_PUBLIC_API_URL environment variable
      - Expose port 3001
      - Depend on backend service
    - Configure custom network for service communication
    - Define named volumes for MySQL and Redis persistence
    - _Requirements: 0.3, 0.4, 0.10, 20.3, 20.4, 20.9, 20.10, 20.11, 20.12, 20.13, 20.14, 20.15_
    - _File: docker-compose.yml_

  - [x] 1.2 Create backend Dockerfile with multi-stage build
    - Create backend/Dockerfile
    - Stage 1 (builder): Install dependencies and build
      - FROM node:18-alpine AS builder
      - WORKDIR /app
      - COPY package*.json ./
      - RUN npm ci
      - COPY . .
      - RUN npx prisma generate
      - RUN npm run build
    - Stage 2 (production): Run application
      - FROM node:18-alpine
      - WORKDIR /app
      - COPY package*.json ./
      - RUN npm ci --only=production
      - COPY --from=builder /app/dist ./dist
      - COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
      - COPY prisma ./prisma
      - EXPOSE 3000
      - CMD ["npm", "run", "start:prod"]
    - _Requirements: 20.1, 20.5, 20.16_
    - _File: backend/Dockerfile_

  - [x] 1.3 Create backend .dockerignore
    - Create backend/.dockerignore
    - Exclude: node_modules, dist, .env, .git, *.log, coverage, .vscode
    - _Requirements: 20.18_
    - _File: backend/.dockerignore_

  - [x] 1.4 Create frontend Dockerfile with multi-stage build
    - Create frontend/Dockerfile
    - Stage 1 (builder): Install dependencies and build
      - FROM node:18-alpine AS builder
      - WORKDIR /app
      - COPY package*.json ./
      - RUN npm ci
      - COPY . .
      - ARG NEXT_PUBLIC_API_URL
      - ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
      - RUN npm run build
    - Stage 2 (production): Run application
      - FROM node:18-alpine
      - WORKDIR /app
      - COPY package*.json ./
      - RUN npm ci --only=production
      - COPY --from=builder /app/.next ./.next
      - COPY --from=builder /app/public ./public
      - COPY --from=builder /app/next.config.js ./
      - EXPOSE 3001
      - CMD ["npm", "run", "start"]
    - _Requirements: 20.2, 20.6, 20.17_
    - _File: frontend/Dockerfile_

  - [x] 1.5 Create frontend .dockerignore
    - Create frontend/.dockerignore
    - Exclude: node_modules, .next, .env.local, .git, *.log, coverage, .vscode
    - _Requirements: 20.19_
    - _File: frontend/.dockerignore_

- [x] 2. Environment configuration
  - [x] 2.1 Create root .env.example
    - Create .env.example in workspace root for docker-compose
    - Document all environment variables:
      - MySQL: MYSQL_ROOT_PASSWORD, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD
      - Redis: (no auth by default)
      - Backend: DATABASE_URL, REDIS_HOST, REDIS_PORT, JWT_SECRET, JWT_EXPIRATION
      - OAuth: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, TELEGRAM_BOT_TOKEN
      - Frontend: NEXT_PUBLIC_API_URL
    - Add detailed comments explaining each variable
    - Provide example values (not production secrets)
    - _Requirements: 18A.1, 18A.2, 18A.3, 18A.4, 18A.5, 18A.6, 18A.7, 20.21_
    - _File: .env.example_

  - [ ] 2.2 Create .env file from example
    - Copy .env.example to .env
    - Fill in actual values for local development
    - Add .env to .gitignore
    - _File: .env_

- [x] 3. Documentation
  - [x] 3.1 Write comprehensive README.md
    - Create README.md in workspace root
    - Add project title and description
    - List key features:
      - Multi-strategy authentication (email/password, Google OAuth, Telegram OAuth)
      - Role-based access control
      - CRUD operations for items
      - Redis caching
      - Docker containerization
    - Document technology stack (NestJS, Next.js, MySQL, Redis, Docker)
    - Add prerequisites section:
      - Docker and Docker Compose installed
      - Node.js 18+ (for local development)
      - Git
    - _Requirements: 18.1, 18.2_
    - _File: README.md_

  - [x] 3.2 Add setup instructions to README
    - Document step-by-step setup:
      1. Clone repository
      2. Copy .env.example to .env and configure
      3. Obtain Google OAuth credentials from Google Cloud Console
      4. Obtain Telegram bot token from BotFather
      5. Run `docker compose up --build`
      6. Access frontend at http://localhost:3001
      7. Access backend API at http://localhost:3000
      8. Access API docs at http://localhost:3000/api/docs
    - Add instructions for local development without Docker:
      - Backend: `cd backend && npm install && npm run start:dev`
      - Frontend: `cd frontend && npm install && npm run dev`
    - _Requirements: 18.2, 18.3, 18.4, 18.5_
    - _File: README.md_

  - [x] 3.3 Document OAuth credential setup
    - Add section "Obtaining OAuth Credentials"
    - Google OAuth:
      - Go to Google Cloud Console
      - Create new project or select existing
      - Enable Google+ API
      - Create OAuth 2.0 credentials
      - Add authorized redirect URI: http://localhost:3000/api/v1/auth/google/callback
      - Copy Client ID and Client Secret to .env
    - Telegram OAuth:
      - Open Telegram and search for @BotFather
      - Send /newbot command and follow instructions
      - Copy bot token to .env
      - Set bot domain with /setdomain command
    - _Requirements: 18.3, 18.4_
    - _File: README.md_

  - [x] 3.4 Document architecture and design
    - Add "Architecture" section to README
    - Describe three-tier architecture (frontend, backend, data layer)
    - Add database schema description:
      - Users table with OAuth fields
      - Items table with foreign key to users
      - Cascade delete relationship
    - Link to Swagger docs for API endpoints: http://localhost:3000/api/docs
    - Explain Redis caching strategy:
      - User profiles cached for 1 hour
      - Item lists cached for 5 minutes
      - Cache invalidation on mutations
    - Describe Docker architecture:
      - 4 containers: backend, frontend, MySQL, Redis
      - Custom network for inter-service communication
      - Persistent volumes for data
      - Health checks for service readiness
    - _Requirements: 18.6, 18.7, 18.8, 18.9_
    - _File: README.md_

  - [x] 3.5 Add scalability considerations
    - Add "Scalability" section to README
    - Discuss horizontal scaling:
      - Stateless API design allows multiple backend instances
      - Load balancer can distribute traffic across instances
      - Redis can be clustered for high availability
    - Discuss caching benefits:
      - Reduces database load
      - Improves response times
      - Enables higher throughput
    - Discuss potential microservices migration:
      - Auth service can be separated
      - Items service can be separated
      - Each service with own database (database per service pattern)
    - _Requirements: 19.7, 19.8_
    - _File: README.md_

  - [x] 3.6 Add troubleshooting section
    - Document common issues and solutions:
      - Port conflicts: Change ports in docker-compose.yml
      - Database connection errors: Check DATABASE_URL format
      - Redis connection errors: Verify REDIS_HOST and REDIS_PORT
      - OAuth errors: Verify credentials and redirect URIs
      - CORS errors: Check CORS configuration in backend
    - Add commands for debugging:
      - View logs: `docker compose logs -f [service]`
      - Restart service: `docker compose restart [service]`
      - Rebuild: `docker compose up --build`
      - Clean volumes: `docker compose down -v`
    - _File: README.md_

  - [x] 3.7 Add API documentation reference
    - Document that Swagger UI is available at /api/docs
    - List main API endpoints:
      - POST /api/v1/auth/register
      - POST /api/v1/auth/login
      - GET /api/v1/auth/google
      - GET /api/v1/auth/telegram
      - GET /api/v1/items
      - POST /api/v1/items
      - PATCH /api/v1/items/:id
      - DELETE /api/v1/items/:id
    - Mention that all endpoints are documented with request/response schemas in Swagger
    - _Requirements: 18.7_
    - _File: README.md_

- [ ] 4. Build and deployment testing
  - [ ] 4.1 Test Docker build process
    - Build all images: `docker compose build`
    - Verify no build errors
    - Check image sizes (should be optimized with multi-stage builds)
    - _Requirements: 20.16, 20.17_
    - _Working Directory: workspace root_

  - [ ] 4.2 Test Docker Compose orchestration
    - Start all services: `docker compose up`
    - Verify all services start successfully
    - Check service health with: `docker compose ps`
    - Verify MySQL is ready (healthcheck passing)
    - Verify Redis is ready (healthcheck passing)
    - Verify backend is ready (healthcheck passing)
    - Verify frontend is accessible
    - _Requirements: 20.15_
    - _Working Directory: workspace root_

  - [ ] 4.3 Test service connectivity
    - Verify backend can connect to MySQL
    - Verify backend can connect to Redis
    - Verify frontend can connect to backend API
    - Test API endpoints through Docker network
    - Check logs for any connection errors: `docker compose logs`
    - _Requirements: 20.9, 20.13, 20.14_
    - _Working Directory: workspace root_

  - [ ] 4.4 Test database migrations
    - Verify Prisma migrations run automatically on backend startup
    - Check MySQL database for tables: `docker compose exec mysql mysql -u root -p`
    - Verify users and items tables exist
    - Verify indexes are created
    - _Requirements: 9.1, 9.2_
    - _Working Directory: workspace root_

  - [ ] 4.5 Test data persistence
    - Create test data through the application
    - Stop services: `docker compose down`
    - Start services again: `docker compose up`
    - Verify data persists (check MySQL and Redis volumes)
    - _Requirements: 20.10, 20.11_
    - _Working Directory: workspace root_

- [ ] 5. Production readiness verification
  - [ ] 5.1 Verify environment variables
    - Check all required environment variables are documented in .env.example
    - Verify no hardcoded secrets in source code
    - Verify JWT_SECRET is strong and unique
    - Verify OAuth credentials are configured
    - _Requirements: 17.1, 18A.8_
    - _Working Directory: workspace root_

  - [ ] 5.2 Verify security headers
    - Test API response headers with curl or Postman
    - Verify helmet security headers are present:
      - X-Frame-Options
      - X-Content-Type-Options
      - Content-Security-Policy
      - Strict-Transport-Security (in production)
    - _Requirements: 17.3_
    - _Working Directory: workspace root_

  - [ ] 5.3 Test rate limiting
    - Send multiple rapid requests to API
    - Verify rate limiting kicks in (429 Too Many Requests)
    - Verify limit is 100 requests per 15 minutes per IP
    - _Requirements: 17.3_
    - _Working Directory: workspace root_

  - [ ] 5.4 Verify CORS configuration
    - Test API from different origins
    - Verify CORS headers are present
    - Verify only allowed origins can access API
    - _Requirements: 17.3_
    - _Working Directory: workspace root_

  - [ ] 5.5 Test error logging
    - Trigger various errors (validation, authentication, server errors)
    - Check backend logs: `docker compose logs backend`
    - Verify errors are logged with context (timestamp, endpoint, user)
    - Verify stack traces are not exposed in API responses
    - _Requirements: 8.5, 17.4_
    - _Working Directory: workspace root_

  - [ ] 5.6 Test graceful shutdown
    - Start services: `docker compose up`
    - Send SIGTERM signal: `docker compose stop`
    - Verify services shut down gracefully
    - Check logs for proper connection closures
    - Verify no data corruption
    - _Requirements: 20.22_
    - _Working Directory: workspace root_

- [ ] 6. Performance and load testing (optional)
  - [ ] 6.1 Test API throughput
    - Install load testing tool (k6, Artillery, or Apache Bench)
    - Run load test with 100 concurrent users
    - Measure requests per second
    - Measure average response time
    - Target: <100ms for authentication, <50ms for CRUD
    - _Requirements: Testing Strategy_
    - _Working Directory: workspace root_

  - [ ] 6.2 Test cache effectiveness
    - Monitor Redis cache hit rate
    - Verify user profiles are cached
    - Verify item lists are cached
    - Measure response time improvement with cache
    - _Requirements: 19.1, 19.2, 19.3, 19.4_
    - _Working Directory: workspace root_

  - [ ] 6.3 Test concurrent user sessions
    - Simulate multiple users logging in simultaneously
    - Verify no race conditions or data corruption
    - Verify JWT tokens are unique per user
    - _Requirements: Testing Strategy_
    - _Working Directory: workspace root_

  - [ ] 6.4 Identify and document bottlenecks
    - Profile database queries
    - Profile Redis operations
    - Profile API endpoints
    - Document any performance issues
    - Suggest optimizations if needed
    - _Requirements: Testing Strategy_
    - _Working Directory: workspace root_

- [ ] 7. Deployment documentation
  - [ ] 7.1 Create deployment guide
    - Create DEPLOYMENT.md in workspace root
    - Document production deployment steps:
      1. Set up production server (VPS, cloud instance)
      2. Install Docker and Docker Compose
      3. Clone repository
      4. Configure production .env file
      5. Set up SSL/TLS certificates (Let's Encrypt)
      6. Configure reverse proxy (Nginx)
      7. Run `docker compose -f docker-compose.prod.yml up -d`
      8. Set up monitoring and logging
    - _File: DEPLOYMENT.md_

  - [ ] 7.2 Create production docker-compose file
    - Create docker-compose.prod.yml
    - Use production-ready configurations:
      - Set NODE_ENV=production
      - Use secrets for sensitive data
      - Configure resource limits (CPU, memory)
      - Set up restart policies (restart: always)
      - Configure logging drivers
    - _File: docker-compose.prod.yml_

  - [ ] 7.3 Document monitoring and logging
    - Add section to DEPLOYMENT.md on monitoring
    - Suggest tools: Prometheus, Grafana, ELK stack
    - Document log locations and formats
    - Suggest alerting strategies
    - _File: DEPLOYMENT.md_

  - [ ] 7.4 Document backup and recovery
    - Add section to DEPLOYMENT.md on backups
    - Document MySQL backup strategy:
      - Use mysqldump for regular backups
      - Store backups in secure location
      - Test restore procedure
    - Document Redis backup strategy:
      - Use RDB snapshots
      - Configure save intervals
    - _File: DEPLOYMENT.md_

- [ ] 8. Final integration testing
  - [ ] 8.1 End-to-end testing checklist
    - Test complete user registration flow
    - Test email/password login flow
    - Test Google OAuth flow (if credentials configured)
    - Test Telegram OAuth flow (if credentials configured)
    - Test protected dashboard access
    - Test item creation, reading, updating, deletion
    - Test admin-only endpoints
    - Test error handling and validation
    - Test logout and session management
    - _Requirements: All Requirements_
    - _Working Directory: workspace root_

  - [ ] 8.2 Cross-browser testing
    - Test frontend in Chrome, Firefox, Safari, Edge
    - Verify all features work consistently
    - Check for any browser-specific issues
    - _Working Directory: workspace root_

  - [ ] 8.3 Mobile responsiveness testing
    - Test frontend on mobile devices (iOS, Android)
    - Verify responsive design works correctly
    - Check touch interactions
    - _Working Directory: workspace root_

  - [ ] 8.4 Security testing
    - Test for SQL injection vulnerabilities
    - Test for XSS vulnerabilities
    - Test for CSRF vulnerabilities (OAuth state parameter)
    - Test authentication bypass attempts
    - Test authorization bypass attempts
    - Verify password hashing is secure
    - _Requirements: 6.3, 6.4, 6.5, 17.2_
    - _Working Directory: workspace root_

## Checkpoint

- [ ] Deployment and infrastructure complete
  - Docker Compose orchestration working
  - All services containerized and communicating
  - Data persistence verified
  - Documentation comprehensive and accurate
  - Production readiness verified
  - Security measures in place
  - Performance acceptable
  - Ready for production deployment

## Notes

- All tasks should be executed from the workspace root unless otherwise specified
- Use `docker compose up --build` to rebuild and start all services
- Use `docker compose down -v` to stop services and remove volumes (data loss!)
- Use `docker compose logs -f [service]` to view real-time logs
- Refer to [docker-compose.yml](docker-compose.yml) for service configuration
- Tasks marked with "(optional)" can be skipped for faster MVP delivery
- Always test in a staging environment before production deployment
- Keep .env file secure and never commit to version control
- Use strong, unique secrets for JWT_SECRET and database passwords in production
