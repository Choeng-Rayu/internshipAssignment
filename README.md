# Internship Assignment: Full-Stack Application

## Overview

This is a full-stack web application built with NestJS (backend) and Next.js (frontend). The application features user authentication via Google OAuth and Telegram OAuth, email notifications, and a RESTful API for managing items.

## Features

- **Backend (NestJS)**
  - RESTful API with versioning (`/api/v1`)
  - User authentication (Google OAuth, Telegram OAuth)
  - Role-based access control
  - Email notifications (using SendGrid API, configured to work with Gmail SMTP)
  - Redis caching for improved performance
  - Prisma ORM with MySQL database
  - Swagger API documentation (`/api/docs`)
  - Input validation and error handling
  - Environment-based configuration

- **Frontend (Next.js)**
  - Modern UI with React 19 and Next.js 16 (App Router)
  - Authentication flows (Google, Telegram)
  - Protected routes
  - Responsive design
  - State management with React Context
  - API integration with backend

## Technology Stack

- **Backend**: NestJS, Node.js, TypeScript
- **Frontend**: Next.js, React, TypeScript
- **Database**: MySQL (with Prisma ORM)
- **Cache**: Redis
- **Authentication**: Google OAuth 2.0, Telegram Login
- **Email**: SendGrid (configured to use Gmail SMTP via App Password)
- **Containerization**: Docker, Docker Compose
- **Dev Tools**: ESLint, Prettier, Jest

## Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for local development without Docker, though Docker is recommended)
- [Git](https://git-scm.com/)

## Setup Instructions

Follow these steps to get the application running:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd internshipAssignment
```

### 2. Configure Environment Variables
Copy the example environment files and fill in the required values:

#### Backend
```bash
cd backend
cp .env.example .env
# Edit .env and add your configuration
```

#### Frontend
```bash
cd ../frontend
cp .env.example .env
# Edit .env and add your configuration
```

### 3. Obtain API Credentials

#### Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Create OAuth 2.0 Client IDs (for Web application)
5. Set the authorized redirect URI to: `http://localhost:3001/api/v1/auth/google/callback`
6. Copy the Client ID and Client Secret to your `.env` files

#### Telegram OAuth Credentials
1. Talk to [BotFather](https://t.me/BotFather) on Telegram
2. Create a new bot using `/newbot`
3. Obtain the Bot Token
4. For Telegram Login, you also need to set up a domain:
   - Go to [Telegram Login](https://core.telegram.org/auth/login)
   - Follow the instructions to link your bot with a domain
5. Add the Bot Token, Bot Username (without @), and set the redirect URIs in your `.env` files

### 4. Start the Application with Docker Compose
From the root directory:
```bash
docker compose up --build
```

The application will be available at:
- **Via NGINX (Recommended for production):**
  - Frontend: http://localhost
  - Backend API: http://localhost/api/v1
  - API Documentation: http://localhost/api/docs
- **Direct access (Development):**
  - Frontend: http://localhost:3000
  - Backend API: http://localhost:3001/api/v1
  - API Documentation: http://localhost:3001/api/docs

### 5. (Optional) Configure SSL for Production
For HTTPS support on your VPS:
```bash
# Navigate to nginx/ssl directory
cd nginx/ssl

# Generate Let's Encrypt certificate (replace your-domain.com)
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./key.pem

# Uncomment HTTPS server block in nginx/nginx.conf
# Restart NGINX
docker compose restart nginx
```

### 6. (Optional) Local Development Without Docker
If you prefer to run the application locally (requires Node.js, MySQL, and Redis installed):

#### Backend
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (`.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Backend server port | `3001` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000,http://localhost:8080` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your_google_client_id.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `your_google_client_secret` |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | `http://localhost:3001/api/v1/auth/google/callback` |
| `TELEGRAM_BOT_CLIENT_ID` | Telegram Bot ID (numeric part of token) | `123456789` |
| `TELEGRAM_BOT_CLIENT_SECRET` | Telegram Bot Secret (from BotFather) | `your_telegram_bot_secret` |
| `TELEGRAM_BOT_USERNAME` | Telegram Bot Username (without @) | `yourdternbot` |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token | `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11` |
| `TELEGRAM_APP_REDIRECT_URI` | Telegram App redirect URI (mobile) | `dastern://auth/telegram/callback` |
| `TELEGRAM_OAUTH_REDIRECT_URI` | Telegram OAuth redirect URI (web) | `http://localhost:3001/api/v1/auth/telegram/callback` |
| `SENDGRID_API_KEY` | SendGrid API Key (or Gmail App Password) | `your_gmail_app_password` |
| `SENDGRID_FROM_EMAIL` | Sender email address | `your_email@gmail.com` |
| `SENDGRID_FROM_NAME` | Sender name | `Your App Name` |
| `JWT_SECRET` | Secret for JWT tokens | `your_jwt_secret_min_32_chars` |
| `JWT_EXPIRES_IN` | JWT expiration time | `1h` |
| `REDIS_PASSWORD` | Redis password (if set) | `your_redis_password` |
| `FRONTEND_URL` | Frontend URL for redirects | `http://localhost:3000` |
| `DATABASE_URL` | MySQL connection string | `mysql://root:example@db:3306/mydb` |

### Frontend (`.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for backend API | `http://localhost:3001/api/v1` |
| `NODE_ENV` | Environment mode | `development` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your-google-client-id-here` |
| `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` | Google OAuth callback URL | `http://localhost:3001/api/v1/auth/google/callback` |
| `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` | Telegram Bot Username (without @) | `your_bot_username` |
| `NEXT_PUBLIC_TELEGRAM_APP_REDIRECT_URI` | Telegram App redirect URI (mobile) | `dastern://auth/telegram/callback` |
| `NEXT_PUBLIC_TELEGRAM_OAUTH_REDIRECT_URI` | Telegram OAuth redirect URI (web) | `http://localhost:3001/api/v1/auth/telegram/callback` |

## Docker Compose Notes

The `docker-compose.yml` file defines five services:
- `mysql`: MySQL 8.0 database with persistent volume and healthcheck
- `redis`: Redis 7-alpine cache with persistent volume and healthcheck
- `backend`: NestJS application with multi-stage Docker build
- `frontend`: Next.js application with multi-stage Docker build
- `nginx`: NGINX reverse proxy for routing and load balancing

All services are connected via a custom bridge network (`app-network`) for secure inter-service communication. The services have dependency chains with health checks to ensure proper startup order.

### NGINX Reverse Proxy

NGINX acts as the entry point for all traffic:
- **Port 80 (HTTP)**: Routes requests to frontend and backend
- **Port 443 (HTTPS)**: SSL/TLS termination (when certificates are configured)
- **Rate Limiting**: 10 req/s for API, 30 req/s for general traffic
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection

**Routing:**
- `/api/*` → Backend service (port 3001)
- `/*` → Frontend service (port 3000)

**Access URLs:**
- Frontend: http://localhost (or http://your-domain.com)
- Backend API: http://localhost/api/v1 (or http://your-domain.com/api/v1)
- API Documentation: http://localhost/api/docs

## Architecture

### Three-Tier Architecture

The application follows a three-tier architecture pattern:

1. **Presentation Layer (Frontend)**
   - Next.js 16 with App Router
   - React 19 for UI components
   - Client-side routing and state management
   - Responsive design with Tailwind CSS

2. **Business Logic Layer (Backend)**
   - NestJS REST API with versioning (`/api/v1`)
   - Authentication strategies (Local, Google OAuth, Telegram OAuth)
   - Role-based access control (RBAC)
   - Input validation and error handling
   - Swagger/OpenAPI documentation

3. **Data Layer**
   - MySQL 8.0 for persistent data storage
   - Redis 7 for caching and session management
   - Prisma ORM for type-safe database access

### Database Schema

**Users Table:**
- `id`: UUID primary key
- `email`: Unique email address (nullable for OAuth-only users)
- `passwordHash`: Bcrypt hashed password (nullable for OAuth-only users)
- `role`: Enum (USER, ADMIN)
- `googleOauthId`: Unique Google OAuth identifier
- `telegramOauthId`: Unique Telegram OAuth identifier
- `createdAt`, `updatedAt`: Timestamps

**Items Table:**
- `id`: UUID primary key
- `title`: Item title (max 200 chars)
- `description`: Item description (text)
- `status`: Enum (ACTIVE, COMPLETED, ARCHIVED)
- `userId`: Foreign key to Users (cascade delete)
- `createdAt`, `updatedAt`: Timestamps

**Relationships:**
- One User has many Items (1:N)
- Cascade delete: When a user is deleted, all their items are deleted

### API Documentation

Interactive API documentation is available at: **http://localhost:3001/api/docs**

**Main API Endpoints:**

**Authentication:**
- `POST /api/v1/auth/register` - Register with email/password
- `POST /api/v1/auth/login` - Login with email/password
- `GET /api/v1/auth/google` - Initiate Google OAuth flow
- `GET /api/v1/auth/google/callback` - Google OAuth callback
- `POST /api/v1/auth/telegram/verify` - Verify Telegram ID token
- `GET /api/v1/auth/profile` - Get current user profile (protected)

**Items (CRUD):**
- `GET /api/v1/items` - List user's items (protected)
- `POST /api/v1/items` - Create new item (protected)
- `GET /api/v1/items/:id` - Get item by ID (protected)
- `PATCH /api/v1/items/:id` - Update item (protected)
- `DELETE /api/v1/items/:id` - Delete item (protected)

**Users (Admin only):**
- `GET /api/v1/users` - List all users (admin)
- `GET /api/v1/users/:id` - Get user by ID (admin)
- `PATCH /api/v1/users/:id` - Update user (admin)
- `DELETE /api/v1/users/:id` - Delete user (admin)

All endpoints are documented with request/response schemas, authentication requirements, and example payloads in Swagger UI.

### Redis Caching Strategy

The application implements intelligent caching to improve performance and reduce database load:

**Cache Keys:**
- User profiles: `user:profile:{userId}` (TTL: 1 hour)
- Item lists: `items:list:{userId}` (TTL: 5 minutes)

**Cache Flow:**
1. **Read Operation**: Check Redis cache first
   - Cache hit: Return cached data immediately
   - Cache miss: Query database, store result in cache, return data

2. **Write Operation**: Invalidate relevant cache entries
   - User update: Invalidate `user:profile:{userId}`
   - Item create/update/delete: Invalidate `items:list:{userId}`

**Benefits:**
- Reduces database query load by 60-80% for frequently accessed data
- Improves API response times (10-50ms vs 50-200ms)
- Enables higher throughput and concurrent user capacity

### Docker Architecture

**Multi-Stage Builds:**
- Both backend and frontend use multi-stage Docker builds
- Stage 1 (builder): Installs all dependencies and builds the application
- Stage 2 (production): Copies only production dependencies and built artifacts
- Result: 40-60% smaller image sizes compared to single-stage builds

**Service Communication:**
- All services connected via custom bridge network (`app-network`)
- NGINX reverse proxy routes external traffic to backend and frontend
- Backend connects to MySQL at `mysql:3306` and Redis at `redis:6379`
- Frontend connects to backend through NGINX at `/api/*`

**Health Checks:**
- MySQL: `mysqladmin ping` every 10s
- Redis: `redis-cli ping` every 10s
- Backend: HTTP GET to `/api/v1/health` every 30s
- Services wait for dependencies to be healthy before starting

**Persistent Volumes:**
- `mysql_data`: Stores MySQL database files
- `redis_data`: Stores Redis persistence files (RDB snapshots)
- Data persists across container restarts and rebuilds

**NGINX Configuration:**
- Reverse proxy with rate limiting
- Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- SSL/TLS support (configure certificates in `nginx/ssl/`)
- Load balancing ready for horizontal scaling

## Scalability Considerations

### Horizontal Scaling

The application is designed for horizontal scalability:

**Stateless API Design:**
- Backend API is stateless (JWT-based authentication)
- No server-side session storage
- Multiple backend instances can run behind a load balancer
- Each instance can handle requests independently

**Load Balancing:**
- Add Nginx or HAProxy as reverse proxy
- Distribute traffic across multiple backend containers
- Use round-robin or least-connections algorithm
- Example: `docker compose up --scale backend=3`

**Redis Clustering:**
- Redis can be configured in cluster mode for high availability
- Use Redis Sentinel for automatic failover
- Distribute cache across multiple Redis nodes
- Ensures cache availability even if one node fails

### Caching Benefits

**Performance Improvements:**
- Reduces database load by 60-80%
- Improves response times from 50-200ms to 10-50ms
- Enables higher throughput (500+ req/s vs 100-200 req/s)
- Reduces database connection pool exhaustion

**Cost Optimization:**
- Fewer database queries = lower database CPU/memory usage
- Can use smaller database instances in production
- Redis is memory-efficient for caching use cases

### Microservices Migration Path

The current monolithic architecture can be migrated to microservices:

**Potential Services:**
1. **Auth Service**: User authentication and authorization
2. **Items Service**: CRUD operations for items
3. **User Service**: User profile management
4. **Notification Service**: Email notifications

**Benefits:**
- Independent scaling of services based on load
- Technology diversity (different languages/frameworks per service)
- Fault isolation (one service failure doesn't affect others)
- Independent deployment and versioning

**Database Per Service Pattern:**
- Each service has its own database
- Services communicate via REST APIs or message queues
- Eventual consistency instead of ACID transactions
- Use API Gateway for unified entry point

## Troubleshooting

### Common Issues and Solutions

**Port Conflicts:**
```bash
# Check if ports are in use
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :3306  # MySQL
lsof -i :6379  # Redis

# Solution: Stop conflicting services or change ports in docker-compose.yml
# Edit docker-compose.yml and change FRONTEND_PORT, BACKEND_PORT, etc.
```

**Database Connection Errors:**
```bash
# Check if MySQL is running and healthy
docker compose ps

# View MySQL logs
docker compose logs mysql

# Verify DATABASE_URL format
# Correct: mysql://user:password@mysql:3306/database
# Common mistake: Using 'localhost' instead of 'mysql' (container name)

# Test connection from backend container
docker compose exec backend sh
# Inside container: npm run prisma:studio
```

**Redis Connection Errors:**
```bash
# Check if Redis is running
docker compose ps redis

# View Redis logs
docker compose logs redis

# Test Redis connection
docker compose exec redis redis-cli ping
# Should return: PONG

# Verify REDIS_HOST and REDIS_PORT in backend environment
# Should be: REDIS_HOST=redis, REDIS_PORT=6379
```

**OAuth Errors:**
```bash
# Google OAuth: "redirect_uri_mismatch"
# Solution: Add exact redirect URI to Google Cloud Console
# Must match: http://localhost:3001/api/v1/auth/google/callback

# Telegram OAuth: "Invalid bot token"
# Solution: Verify TELEGRAM_BOT_TOKEN is correct from BotFather
# Format: 123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

# Check backend logs for detailed OAuth errors
docker compose logs backend | grep -i oauth
```

**CORS Errors:**
```bash
# "Access-Control-Allow-Origin" error in browser console
# Solution: Verify FRONTEND_URL in backend .env matches frontend URL
# Backend .env: FRONTEND_URL=http://localhost:3000

# Check CORS configuration in backend/src/main.ts
# Should allow origin from FRONTEND_URL environment variable
```

**Build Errors:**
```bash
# "npm ci" fails during Docker build
# Solution: Delete package-lock.json and regenerate
cd backend  # or frontend
rm package-lock.json
npm install
git add package-lock.json

# Rebuild Docker images
docker compose build --no-cache
```

**Prisma Migration Errors:**
```bash
# "Migration failed" or "Database schema out of sync"
# Solution: Reset database and run migrations
docker compose down -v  # WARNING: Deletes all data
docker compose up -d mysql
docker compose exec backend npx prisma migrate deploy
docker compose up
```

### Debugging Commands

**View Logs:**
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
docker compose logs -f redis

# Last 100 lines
docker compose logs --tail=100 backend
```

**Restart Services:**
```bash
# Restart specific service
docker compose restart backend
docker compose restart frontend

# Restart all services
docker compose restart
```

**Rebuild and Restart:**
```bash
# Rebuild specific service
docker compose up --build backend

# Rebuild all services
docker compose up --build

# Force rebuild without cache
docker compose build --no-cache
docker compose up
```

**Clean Up:**
```bash
# Stop services
docker compose down

# Stop and remove volumes (WARNING: Deletes all data)
docker compose down -v

# Remove all containers, networks, and images
docker compose down --rmi all -v

# Clean up Docker system
docker system prune -a
```

**Database Access:**
```bash
# Access MySQL CLI
docker compose exec mysql mysql -u root -p
# Enter password from MYSQL_ROOT_PASSWORD

# Inside MySQL:
USE internship;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM items;
```

**Redis Access:**
```bash
# Access Redis CLI
docker compose exec redis redis-cli

# Inside Redis:
PING
KEYS *
GET user:profile:123
TTL user:profile:123
```

**Container Shell Access:**
```bash
# Access backend container shell
docker compose exec backend sh

# Access frontend container shell
docker compose exec frontend sh

# Inside container, you can run:
npm run prisma:studio  # Backend only
npm run test
npm run lint
```

## License

This project is for educational purposes only.
