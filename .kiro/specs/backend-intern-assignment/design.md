# Design Document: Backend Intern Assignment

## Overview

This design document specifies the architecture and implementation approach for a production-ready full-stack application demonstrating enterprise-level backend development practices. The system consists of a NestJS REST API backend with multiple authentication strategies, a Next.js frontend for testing and demonstration, and supporting infrastructure including MySQL database and Redis cache, all orchestrated through Docker.

### System Goals

- **Security-First Architecture**: Implement defense-in-depth with secure authentication flows, input validation at multiple layers, and OWASP best practices
- **Horizontal Scalability**: Design stateless services with efficient caching strategies and database optimization for production workloads
- **Maintainability**: Apply SOLID principles, clear separation of concerns, and dependency injection for long-term code health
- **Production Readiness**: Demonstrate enterprise-level thinking with comprehensive error handling, logging, monitoring hooks, and containerization

### Core Features

1. **Multi-Strategy Authentication**: Email/password, Google OAuth 2.0, and Telegram OAuth with unified JWT-based session management
2. **Role-Based Access Control (RBAC)**: User and admin roles with fine-grained permission enforcement
3. **Secondary Entity Management**: Full CRUD operations demonstrating RESTful API design and data ownership patterns
4. **Performance Optimization**: Redis caching layer with intelligent cache invalidation strategies
5. **Container Orchestration**: Docker-based deployment with service dependencies and health checks
6. **API Documentation**: Interactive Swagger/OpenAPI documentation for developer experience

### Technology Stack

**Backend (NestJS)**
- Framework: NestJS 10.x with TypeScript 5.x
- ORM: Prisma (chosen for type safety, migration management, and developer experience)
- Authentication: Passport.js with JWT, Google OAuth, Telegram OAuth strategies
- Validation: class-validator and class-transformer for DTO validation
- Security: helmet, cors, bcrypt/argon2 for password hashing

**Frontend (Next.js)**
- Framework: Next.js 14.x with App Router and TypeScript 5.x
- UI Library: React 18.x with Tailwind CSS for rapid development
- State Management: React Context API for authentication state
- HTTP Client: Axios with interceptors for JWT token injection

**Infrastructure**
- Database: MySQL 8.0+ with InnoDB engine for ACID compliance
- Cache: Redis 7.0+ for session and data caching
- Containerization: Docker with multi-stage builds
- Orchestration: Docker Compose with health checks and dependency management

## Architecture

### System Architecture

The system follows a three-tier architecture with clear separation between presentation, business logic, and data layers:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Pages   │  │  Dashboard   │  │  CRUD UI     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌────────────────────────────────────────────────────┐     │
│  │         API Client (Axios + JWT Interceptor)       │     │
│  └────────────────────────────────────────────────────┘     │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API (JSON)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (NestJS)                           │
│  ┌────────────────────────────────────────────────────┐     │
│  │              API Gateway Layer                     │     │
│  │  • Global Exception Filter                         │     │
│  │  • Validation Pipe                                 │     │
│  │  • Security Middleware (Helmet, CORS)             │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Module  │  │ Users Module │  │ Items Module │      │
│  │              │  │              │  │ (Secondary)  │      │
│  │ • Local      │  │ • Profile    │  │ • CRUD Ops   │      │
│  │ • Google     │  │ • RBAC       │  │ • Ownership  │      │
│  │ • Telegram   │  │              │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│  ┌──────┴──────────────────┴──────────────────┴───────┐     │
│  │              Service Layer                          │     │
│  │  • Business Logic                                   │     │
│  │  • Cache Management                                 │     │
│  │  • Transaction Coordination                         │     │
│  └──────┬──────────────────────────────────────┬───────┘     │
│         │                                       │             │
│  ┌──────▼───────┐                       ┌──────▼───────┐     │
│  │   Prisma     │                       │    Redis     │     │
│  │   Client     │                       │   Service    │     │
│  └──────┬───────┘                       └──────────────┘     │
└─────────┼─────────────────────────────────────────────────────┘
          │                                       │
          ▼                                       ▼
┌──────────────────┐                    ┌──────────────────┐
│  MySQL Database  │                    │  Redis Cache     │
│  • Users         │                    │  • User Profiles │
│  • Items         │                    │  • Item Lists    │
│  • OAuth Links   │                    │  • Session Data  │
└──────────────────┘                    └──────────────────┘
```

### Module Architecture

**NestJS Module Structure**:

```
src/
├── main.ts                          # Application bootstrap
├── app.module.ts                    # Root module
├── config/                          # Configuration management
│   ├── config.module.ts
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── jwt.config.ts
├── common/                          # Shared utilities
│   ├── decorators/
│   │   ├── roles.decorator.ts       # @Roles() decorator
│   │   └── current-user.decorator.ts # @CurrentUser() decorator
│   ├── guards/
│   │   ├── jwt-auth.guard.ts        # JWT authentication guard
│   │   └── roles.guard.ts           # RBAC authorization guard
│   ├── filters/
│   │   └── http-exception.filter.ts # Global exception handler
│   ├── interceptors/
│   │   └── logging.interceptor.ts   # Request/response logging
│   └── pipes/
│       └── validation.pipe.ts       # DTO validation
├── auth/                            # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts           # /api/v1/auth endpoints
│   ├── auth.service.ts              # Auth business logic
│   ├── strategies/
│   │   ├── local.strategy.ts        # Email/password strategy
│   │   ├── jwt.strategy.ts          # JWT validation strategy
│   │   ├── google.strategy.ts       # Google OAuth strategy
│   │   └── telegram.strategy.ts     # Telegram OAuth strategy
│   └── dto/
│       ├── register.dto.ts
│       ├── login.dto.ts
│       └── auth-response.dto.ts
├── users/                           # Users module
│   ├── users.module.ts
│   ├── users.controller.ts          # /api/v1/users endpoints
│   ├── users.service.ts             # User business logic
│   ├── entities/
│   │   └── user.entity.ts           # User domain model
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
├── items/                           # Secondary entity module
│   ├── items.module.ts
│   ├── items.controller.ts          # /api/v1/items endpoints
│   ├── items.service.ts             # Item business logic
│   ├── entities/
│   │   └── item.entity.ts           # Item domain model
│   └── dto/
│       ├── create-item.dto.ts
│       └── update-item.dto.ts
├── cache/                           # Redis caching module
│   ├── cache.module.ts
│   └── cache.service.ts             # Cache abstraction layer
└── prisma/                          # Database module
    ├── prisma.module.ts
    ├── prisma.service.ts            # Prisma client wrapper
    └── schema.prisma                # Database schema
```

### Authentication Flow

**Email/Password Authentication**:
```
1. User submits email + password → POST /api/v1/auth/register or /login
2. Controller validates DTO → class-validator checks format
3. Service layer:
   - Registration: Hash password with bcrypt (cost factor 12) → Store in DB
   - Login: Retrieve user → Compare hash → Verify credentials
4. Generate JWT with payload: { sub: userId, email, role }
5. Sign with HS256 algorithm using secret from env
6. Return { access_token, user: { id, email, role } }
7. Frontend stores token in httpOnly cookie or localStorage
8. Subsequent requests include: Authorization: Bearer <token>
```

**Google OAuth Flow**:
```
1. User clicks "Login with Google" → GET /api/v1/auth/google
2. Backend redirects to Google OAuth consent screen
3. User authorizes → Google redirects to /api/v1/auth/google/callback?code=...
4. Backend exchanges code for access_token with Google
5. Fetch user profile from Google People API
6. Check if user exists by google_oauth_id or email:
   - New user: Create account with google_oauth_id
   - Existing user: Link google_oauth_id if not already linked
7. Generate JWT with user data
8. Redirect to frontend with token: /auth/callback?token=...
9. Frontend extracts token and stores securely
```

**Telegram OAuth Flow**:
```
1. User clicks "Login with Telegram" → GET /api/v1/auth/telegram
2. Backend redirects to Telegram OAuth authorization
3. User authorizes → Telegram redirects to /api/v1/auth/telegram/callback
4. Backend validates Telegram auth data using bot token
5. Extract telegram_id and username from callback
6. Check if user exists by telegram_oauth_id:
   - New user: Create account with telegram_oauth_id and username
   - Existing user: Authenticate existing account
7. Generate JWT with user data
8. Redirect to frontend with token
```

### Security Architecture

**Defense-in-Depth Layers**:

1. **Network Layer**:
   - HTTPS enforcement in production (TLS 1.3)
   - CORS configuration with whitelist of allowed origins
   - Rate limiting: 100 requests per 15 minutes per IP (using @nestjs/throttler)

2. **Application Layer**:
   - Helmet middleware for security headers (CSP, X-Frame-Options, HSTS)
   - Input validation at DTO level with class-validator
   - SQL injection prevention via Prisma parameterized queries
   - XSS prevention via input sanitization and output encoding

3. **Authentication Layer**:
   - Password hashing with bcrypt (cost factor 12) or argon2id
   - JWT with short expiration (24 hours) and secure signing
   - OAuth state parameter validation for CSRF protection
   - Refresh token rotation (optional enhancement)

4. **Authorization Layer**:
   - Role-based access control with @Roles() decorator
   - Resource ownership validation (users can only access their own items)
   - Guard composition: JwtAuthGuard → RolesGuard

5. **Data Layer**:
   - Environment variables for all secrets (never in source code)
   - Database connection encryption
   - Sensitive data exclusion from logs and API responses

## Components and Interfaces

### Core Components

#### 1. Authentication Service

**Responsibilities**:
- User registration with password hashing
- Credential verification for email/password login
- OAuth integration with Google and Telegram
- JWT generation and validation
- Account linking for OAuth providers

**Interface**:
```typescript
interface IAuthService {
  // Registration
  register(dto: RegisterDto): Promise<AuthResponse>;
  
  // Email/Password Authentication
  validateUser(email: string, password: string): Promise<User | null>;
  login(user: User): Promise<AuthResponse>;
  
  // OAuth Authentication
  googleLogin(req: Request): Promise<AuthResponse>;
  telegramLogin(req: Request): Promise<AuthResponse>;
  
  // JWT Operations
  generateToken(user: User): string;
  verifyToken(token: string): JwtPayload;
}

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}
```

**Dependencies**:
- UsersService: User CRUD operations
- JwtService: Token generation and verification
- Passport strategies: Authentication strategy implementations
- CacheService: Token blacklist (for logout functionality)

#### 2. Users Service

**Responsibilities**:
- User CRUD operations
- Profile management
- OAuth account linking
- Role management

**Interface**:
```typescript
interface IUsersService {
  create(dto: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  findByTelegramId(telegramId: string): Promise<User | null>;
  update(id: string, dto: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
  linkGoogleAccount(userId: string, googleId: string): Promise<User>;
  linkTelegramAccount(userId: string, telegramId: string): Promise<User>;
}
```

**Dependencies**:
- PrismaService: Database access
- CacheService: User profile caching

#### 3. Items Service (Secondary Entity)

**Responsibilities**:
- CRUD operations for items
- Ownership validation
- List filtering by user

**Interface**:
```typescript
interface IItemsService {
  create(userId: string, dto: CreateItemDto): Promise<Item>;
  findAll(userId: string): Promise<Item[]>;
  findOne(id: string, userId: string): Promise<Item | null>;
  update(id: string, userId: string, dto: UpdateItemDto): Promise<Item>;
  delete(id: string, userId: string): Promise<void>;
}
```

**Dependencies**:
- PrismaService: Database access
- CacheService: Item list caching

#### 4. Cache Service

**Responsibilities**:
- Redis connection management
- Cache get/set/delete operations
- TTL management
- Cache invalidation strategies

**Interface**:
```typescript
interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  deletePattern(pattern: string): Promise<void>;
  
  // High-level caching methods
  getUserProfile(userId: string): Promise<User | null>;
  setUserProfile(user: User): Promise<void>;
  invalidateUserProfile(userId: string): Promise<void>;
  
  getItemsList(userId: string): Promise<Item[] | null>;
  setItemsList(userId: string, items: Item[]): Promise<void>;
  invalidateItemsList(userId: string): Promise<void>;
}
```

**Cache Key Patterns**:
- User profiles: `user:profile:{userId}` (TTL: 1 hour)
- Item lists: `items:list:{userId}` (TTL: 5 minutes)
- Token blacklist: `token:blacklist:{tokenId}` (TTL: 24 hours)

**Dependencies**:
- Redis client (ioredis)

#### 5. Prisma Service

**Responsibilities**:
- Database connection lifecycle
- Query execution
- Transaction management
- Connection pooling

**Interface**:
```typescript
interface IPrismaService extends PrismaClient {
  onModuleInit(): Promise<void>;
  onModuleDestroy(): Promise<void>;
  enableShutdownHooks(app: INestApplication): void;
}
```

### API Endpoints

**Authentication Endpoints**:
```
POST   /api/v1/auth/register          # Email/password registration
POST   /api/v1/auth/login             # Email/password login
GET    /api/v1/auth/google            # Initiate Google OAuth
GET    /api/v1/auth/google/callback   # Google OAuth callback
GET    /api/v1/auth/telegram          # Initiate Telegram OAuth
GET    /api/v1/auth/telegram/callback # Telegram OAuth callback
POST   /api/v1/auth/logout            # Logout (optional: token blacklist)
GET    /api/v1/auth/profile           # Get current user profile (protected)
```

**Users Endpoints**:
```
GET    /api/v1/users                  # List all users (admin only)
GET    /api/v1/users/:id              # Get user by ID (admin only)
PATCH  /api/v1/users/:id              # Update user (admin only)
DELETE /api/v1/users/:id              # Delete user (admin only)
```

**Items Endpoints** (Secondary Entity):
```
POST   /api/v1/items                  # Create item (protected)
GET    /api/v1/items                  # List user's items (protected)
GET    /api/v1/items/:id              # Get item by ID (protected, ownership check)
PATCH  /api/v1/items/:id              # Update item (protected, ownership check)
DELETE /api/v1/items/:id              # Delete item (protected, ownership check)
```

### DTOs and Validation

**RegisterDto**:
```typescript
class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and number'
  })
  password: string;
}
```

**LoginDto**:
```typescript
class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

**CreateItemDto**:
```typescript
class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(ItemStatus)
  @IsOptional()
  status?: ItemStatus;
}
```

## Data Models

### Database Schema (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  USER
  ADMIN
}

enum ItemStatus {
  ACTIVE
  COMPLETED
  ARCHIVED
}

model User {
  id              String    @id @default(uuid())
  email           String?   @unique
  passwordHash    String?   @map("password_hash")
  role            UserRole  @default(USER)
  
  // OAuth fields
  googleOauthId   String?   @unique @map("google_oauth_id")
  telegramOauthId String?   @unique @map("telegram_oauth_id")
  telegramUsername String?  @map("telegram_username")
  
  // Timestamps
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  // Relations
  items           Item[]
  
  @@map("users")
  @@index([email])
  @@index([googleOauthId])
  @@index([telegramOauthId])
}

model Item {
  id          String      @id @default(uuid())
  title       String      @db.VarChar(200)
  description String?     @db.Text
  status      ItemStatus  @default(ACTIVE)
  
  // Ownership
  userId      String      @map("user_id")
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Timestamps
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")
  
  @@map("items")
  @@index([userId])
  @@index([status])
  @@index([createdAt])
}
```

### Entity Relationships

```
User (1) ──────< (N) Item
  │
  │ Cascade Delete: When user is deleted, all items are deleted
  │
  └─ Ownership: Each item belongs to exactly one user
```

### Database Indexes

**Performance Optimization**:

1. **User Table**:
   - Primary key: `id` (UUID, clustered index)
   - Unique indexes: `email`, `google_oauth_id`, `telegram_oauth_id`
   - Rationale: Fast lookups during authentication

2. **Item Table**:
   - Primary key: `id` (UUID, clustered index)
   - Foreign key index: `user_id` (for JOIN operations)
   - Composite index: `(user_id, created_at DESC)` for paginated queries
   - Index: `status` for filtering
   - Rationale: Optimize common query patterns (list user's items, filter by status)

### Data Validation Rules

**User Model**:
- `email`: Valid email format, unique, optional (for OAuth-only users)
- `passwordHash`: Required for email/password users, null for OAuth-only users
- `role`: Enum (USER, ADMIN), default USER
- `googleOauthId`: Unique when present, null allowed
- `telegramOauthId`: Unique when present, null allowed

**Item Model**:
- `title`: Required, max 200 characters, trimmed
- `description`: Optional, max 1000 characters
- `status`: Enum (ACTIVE, COMPLETED, ARCHIVED), default ACTIVE
- `userId`: Required, must reference existing user

### Migration Strategy

**Initial Migration**:
```bash
# Generate migration from schema
npx prisma migrate dev --name init

# Apply migration to database
npx prisma migrate deploy
```

**Seed Data** (for development):
```typescript
// prisma/seed.ts
async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: await bcrypt.hash('Admin123!', 12),
      role: 'ADMIN',
    },
  });

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      passwordHash: await bcrypt.hash('User123!', 12),
      role: 'USER',
    },
  });

  // Create sample items
  await prisma.item.createMany({
    data: [
      { title: 'Sample Item 1', userId: user.id, status: 'ACTIVE' },
      { title: 'Sample Item 2', userId: user.id, status: 'COMPLETED' },
    ],
  });
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several areas of redundancy:

1. **JWT Generation Properties**: Requirements 2.2, 2A.6, and 2B.6 all specify that JWT tokens should contain user ID and role claims. These can be combined into a single property covering all authentication methods.

2. **Successful Authentication Response**: Requirements 2.3, 2A.7, and 2B.7 all specify returning HTTP 200 with JWT and user profile. These can be combined into one property.

3. **Authentication Failure**: Requirements 2.4, 2A.8, and 2B.8 all specify returning HTTP 401 for authentication failures. These can be combined.

4. **Frontend Token Storage**: Requirements 12.7, 12A.3 specify storing JWT tokens after successful login. These are redundant and can be combined.

5. **Frontend Success Redirect**: Requirements 12.8, 12A.4 specify redirecting to dashboard after successful login. These can be combined.

6. **Frontend Error Display**: Requirements 11.4, 12.9, 14.6, 15.2 all specify displaying error messages from API responses. These can be combined into one property.

7. **Input Validation**: Requirements 6.1 and 6.2 are closely related (validation and error response). These can be combined into one comprehensive property.

8. **Cache-First Pattern**: Requirements 19.3 and 19.4 describe the cache-first pattern (check cache, then DB). These can be combined into one property.

After eliminating redundancies, the following properties provide unique validation value:

### Backend Authentication Properties

#### Property 1: Valid Registration Creates Account

*For any* valid email and password combination (email in valid format, password ≥ 8 characters), submitting a registration request should create a new user account and return HTTP 201 with the user profile (excluding password).

**Validates: Requirements 1.1, 1.7**

#### Property 2: Password Hashing

*For any* password provided during registration, the stored password_hash in the database should be a valid bcrypt or argon2 hash and should never equal the plaintext password.

**Validates: Requirements 1.2**

#### Property 3: Duplicate Email Rejection

*For any* existing user email, attempting to register with the same email should return HTTP 409 Conflict with a descriptive error message.

**Validates: Requirements 1.3**

#### Property 4: Invalid Email Rejection

*For any* string that does not match valid email format (missing @, invalid domain, etc.), registration should return HTTP 400 Bad Request with validation errors.

**Validates: Requirements 1.4**

#### Property 5: Short Password Rejection

*For any* password string with length less than 8 characters, registration should return HTTP 400 Bad Request with validation errors.

**Validates: Requirements 1.5**

#### Property 6: Default User Role Assignment

*For any* newly registered user (via email/password or OAuth), the assigned role should be "USER" not "ADMIN" unless explicitly set otherwise.

**Validates: Requirements 1.6**

#### Property 7: Successful Authentication Returns JWT

*For any* successful authentication (email/password, Google OAuth, or Telegram OAuth), the response should be HTTP 200 OK containing a valid JWT token with user ID and role claims, plus the user profile.

**Validates: Requirements 2.2, 2.3, 2A.6, 2A.7, 2B.6, 2B.7**

#### Property 8: Invalid Credentials Rejection

*For any* registered user, attempting to log in with an incorrect password should return HTTP 401 Unauthorized.

**Validates: Requirements 2.4, 2A.8, 2B.8**

#### Property 9: Missing Login Fields Rejection

*For any* login request missing required fields (email or password), the API should return HTTP 400 Bad Request with validation errors.

**Validates: Requirements 2.5**

#### Property 10: JWT Expiration Time

*For any* generated JWT token, the expiration claim (exp) should be set to 24 hours (86400 seconds) from the issuance time (iat).

**Validates: Requirements 2.6**

#### Property 11: JWT Signature Validity

*For any* generated JWT token, it should be verifiable using the configured secret key and should fail verification if the signature is tampered with.

**Validates: Requirements 2.7**

#### Property 12: OAuth First-Time User Creation

*For any* new OAuth user (Google or Telegram) logging in for the first time, a new user account should be created with the OAuth provider ID and email/username from the OAuth profile.

**Validates: Requirements 2A.4, 2B.4**

#### Property 13: OAuth Account Linking

*For any* existing user with a matching email, logging in via Google OAuth should link the google_oauth_id to that existing account without creating a duplicate.

**Validates: Requirements 2A.5**

### Backend Authorization Properties

#### Property 14: Valid JWT Grants Access

*For any* protected endpoint and valid JWT token in the Authorization header, the request should be allowed to proceed and not return 401.

**Validates: Requirements 3.1**

#### Property 15: Missing Authorization Rejection

*For any* protected endpoint, a request without an Authorization header should return HTTP 401 Unauthorized.

**Validates: Requirements 3.2**

#### Property 16: Expired JWT Rejection

*For any* protected endpoint and expired JWT token, the request should return HTTP 401 Unauthorized with an expiration message.

**Validates: Requirements 3.3**

#### Property 17: Invalid JWT Signature Rejection

*For any* protected endpoint and JWT token with invalid or tampered signature, the request should return HTTP 401 Unauthorized.

**Validates: Requirements 3.4**

#### Property 18: JWT Claims Extraction

*For any* valid JWT token, the API should successfully extract the user ID and role from the token claims for use in authorization checks.

**Validates: Requirements 3.5**

#### Property 19: Admin Role Access

*For any* user with role "ADMIN", requests to admin-only endpoints should be allowed to proceed.

**Validates: Requirements 4.1**

#### Property 20: Non-Admin Role Rejection

*For any* user with role "USER", requests to admin-only endpoints should return HTTP 403 Forbidden.

**Validates: Requirements 4.2**

### Backend CRUD Properties

#### Property 21: Valid Item Creation

*For any* valid item data (title, description, status), creating an item should store it in the database with the creator's user ID and return HTTP 201 Created.

**Validates: Requirements 5.1, 5.8**

#### Property 22: Item Retrieval by ID

*For any* existing item ID owned by the requesting user, a GET request should return HTTP 200 OK with the item data.

**Validates: Requirements 5.2**

#### Property 23: Item List Retrieval

*For any* authenticated user, a GET request for all items should return HTTP 200 OK with a list containing only items owned by that user.

**Validates: Requirements 5.3, 5.9**

#### Property 24: Item Update

*For any* existing item owned by the requesting user, a PATCH request with valid data should modify the item and return HTTP 200 OK.

**Validates: Requirements 5.4**

#### Property 25: Item Deletion

*For any* existing item owned by the requesting user, a DELETE request should remove the item from the database and return HTTP 204 No Content.

**Validates: Requirements 5.5**

#### Property 26: Non-Existent Item Rejection

*For any* non-existent item ID, a GET, PATCH, or DELETE request should return HTTP 404 Not Found.

**Validates: Requirements 5.6**

#### Property 27: Invalid Item Data Rejection

*For any* create or update request with invalid item data (missing title, title too long, invalid status), the API should return HTTP 400 Bad Request with validation errors.

**Validates: Requirements 5.7**

### Backend Security Properties

#### Property 28: Input Validation and Error Response

*For any* API request with invalid input data, the API should validate all fields against defined schemas and return HTTP 400 Bad Request with specific field-level error messages before processing.

**Validates: Requirements 6.1, 6.2**

#### Property 29: SQL Injection Prevention

*For any* string input containing SQL injection patterns (e.g., `'; DROP TABLE users; --`), the API should sanitize or parameterize the input such that no SQL injection occurs.

**Validates: Requirements 6.3**

#### Property 30: NoSQL Injection Prevention

*For any* string input containing NoSQL injection patterns (e.g., `{"$ne": null}`), the API should sanitize the input to prevent NoSQL injection attacks.

**Validates: Requirements 6.4**

#### Property 31: XSS Prevention

*For any* string input containing XSS payloads (e.g., `<script>alert('XSS')</script>`), the API should sanitize the input to prevent stored or reflected XSS attacks.

**Validates: Requirements 6.5**

#### Property 32: Payload Size Limit

*For any* request with body size exceeding 10MB, the API should return HTTP 413 Payload Too Large.

**Validates: Requirements 6.6**

#### Property 33: Password Hash Exclusion

*For any* API response containing user data, the response should never include the password_hash field.

**Validates: Requirements 17.2**

#### Property 34: Security Headers

*For any* HTTP response from the API, the response should include security headers such as X-Frame-Options, Content-Security-Policy, and X-Content-Type-Options.

**Validates: Requirements 17.3**

### Backend API Design Properties

#### Property 35: API Versioning

*For any* API endpoint, the URL path should be prefixed with "/api/v1" for consistent versioning.

**Validates: Requirements 7.1, 7.2**

#### Property 36: Unversioned Endpoint Rejection

*For any* request to an unversioned endpoint path (e.g., "/auth/login" instead of "/api/v1/auth/login"), the API should return HTTP 404 Not Found.

**Validates: Requirements 7.3**

#### Property 37: Consistent Error Response Format

*For any* error condition (4xx or 5xx), the API should return a JSON response with "error" and "message" fields.

**Validates: Requirements 8.1**

#### Property 38: Appropriate HTTP Status Codes

*For any* error type, the API should return the appropriate HTTP status code: 400 for validation errors, 401 for authentication failures, 403 for authorization failures, 404 for not found, 500 for server errors.

**Validates: Requirements 8.2**

#### Property 39: Unhandled Exception Handling

*For any* unhandled exception or server error, the API should return HTTP 500 Internal Server Error with a generic error message that does not expose stack traces or sensitive implementation details.

**Validates: Requirements 8.3**

#### Property 40: Validation Error Array

*For any* validation failure with multiple field errors, the API should return HTTP 400 Bad Request with an array of validation errors specifying which fields failed and why.

**Validates: Requirements 8.4**

### Backend Caching Properties

#### Property 41: Cache-First Data Retrieval

*For any* request for user profile or item list data, the API should first check Redis cache and only query the database if the cache misses, then store the database result in cache.

**Validates: Requirements 19.3, 19.4**

#### Property 42: User Profile Cache TTL

*For any* user profile stored in Redis cache, the TTL should be set to 1 hour (3600 seconds).

**Validates: Requirements 19.1**

#### Property 43: Item List Cache TTL

*For any* item list stored in Redis cache, the TTL should be set to 5 minutes (300 seconds).

**Validates: Requirements 19.2**

#### Property 44: Cache Invalidation on Mutation

*For any* update or delete operation on a user or item, the API should invalidate the corresponding cache entries in Redis to prevent stale data.

**Validates: Requirements 19.5**

### Frontend Authentication Properties

#### Property 45: Registration Form Submission

*For any* registration form submission with email and password, the frontend should send a POST request to /api/v1/auth/register with the form data.

**Validates: Requirements 11.2**

#### Property 46: Registration Success Handling

*For any* successful registration response (HTTP 201), the frontend should display a success message and redirect to the login page.

**Validates: Requirements 11.3**

#### Property 47: Frontend Email Validation

*For any* email input that does not match valid email format, the frontend should prevent form submission and display a validation error.

**Validates: Requirements 11.5, 12.10**

#### Property 48: Frontend Password Validation

*For any* password input with length less than 8 characters, the frontend should prevent form submission and display a validation error.

**Validates: Requirements 11.6**

#### Property 49: Login Form Submission

*For any* login form submission with email and password, the frontend should send a POST request to /api/v1/auth/login with the credentials.

**Validates: Requirements 12.4**

#### Property 50: OAuth Redirect

*For any* OAuth button click (Google or Telegram), the frontend should redirect the browser to the appropriate OAuth authorization flow URL.

**Validates: Requirements 12.5, 12.6**

#### Property 51: JWT Token Storage

*For any* successful authentication response (email/password or OAuth) containing a JWT token, the frontend should store the token securely in browser storage (localStorage or httpOnly cookie).

**Validates: Requirements 12.7, 12A.3**

#### Property 52: Post-Login Redirect

*For any* successful authentication, the frontend should redirect the user to the protected dashboard page.

**Validates: Requirements 12.8, 12A.4**

#### Property 53: OAuth Callback Forwarding

*For any* OAuth callback with an authorization code, the frontend should send the code to the backend callback endpoint for token exchange.

**Validates: Requirements 12A.1, 12A.2**

#### Property 54: OAuth Failure Handling

*For any* failed OAuth callback, the frontend should redirect to the login page with an error message displayed.

**Validates: Requirements 12A.5**

#### Property 55: OAuth State Validation

*For any* OAuth flow, the frontend should generate a random state parameter, include it in the authorization request, and validate it matches in the callback to prevent CSRF attacks.

**Validates: Requirements 12A.6**

### Frontend Authorization Properties

#### Property 56: Unauthenticated Dashboard Redirect

*For any* attempt to access the protected dashboard without a valid JWT token, the frontend should redirect to the login page.

**Validates: Requirements 13.1**

#### Property 57: Authenticated Dashboard Access

*For any* attempt to access the protected dashboard with a valid JWT token, the frontend should display the dashboard content.

**Validates: Requirements 13.2**

#### Property 58: JWT Token Injection

*For any* API request from the frontend to protected endpoints, the request should include the JWT token in the Authorization header as "Bearer <token>".

**Validates: Requirements 13.3**

#### Property 59: Logout Token Clearing

*For any* logout action, the frontend should clear the JWT token from browser storage and redirect to the login page.

**Validates: Requirements 13.4, 17.6**

### Frontend CRUD Properties

#### Property 60: User Items Display

*For any* authenticated user viewing the dashboard, the frontend should display a list of items owned by that user.

**Validates: Requirements 14.1**

#### Property 61: CRUD Success Handling

*For any* successful CRUD operation (create, update, delete), the frontend should display a success message and refresh the item list.

**Validates: Requirements 14.5**

### Frontend Error Handling Properties

#### Property 62: API Error Display

*For any* failed API request, the frontend should display error messages extracted from the API response.

**Validates: Requirements 11.4, 12.9, 14.6, 15.2**

#### Property 63: Success Message Display

*For any* successful API request, the frontend should display a success message with operation details.

**Validates: Requirements 15.1**

#### Property 64: Network Error Handling

*For any* network error (connection refused, timeout), the frontend should display a user-friendly connection error message.

**Validates: Requirements 15.3**

#### Property 65: Success Message Auto-Dismiss

*For any* success message displayed, the frontend should automatically dismiss it after 3 seconds.

**Validates: Requirements 15.4**

#### Property 66: Error Message Manual Dismiss

*For any* error message displayed, the frontend should provide a way for the user to manually dismiss it.

**Validates: Requirements 15.5**

## Error Handling

### Error Handling Strategy

The application implements a comprehensive error handling strategy with multiple layers:

**1. Global Exception Filter (NestJS)**

All unhandled exceptions are caught by a global exception filter that:
- Logs the error with context (timestamp, endpoint, user ID, stack trace)
- Transforms exceptions into consistent JSON responses
- Prevents stack trace exposure in production
- Maps exception types to appropriate HTTP status codes

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message;
    }

    // Log error with context
    this.logger.error({
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // Return sanitized response
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

**2. Validation Pipe**

Input validation errors are handled by a global validation pipe:
- Validates all DTOs using class-validator decorators
- Returns HTTP 400 with field-level error details
- Prevents invalid data from reaching business logic

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strip unknown properties
    forbidNonWhitelisted: true, // Throw error on unknown properties
    transform: true, // Transform payloads to DTO instances
    exceptionFactory: (errors) => {
      const messages = errors.map(error => ({
        field: error.property,
        errors: Object.values(error.constraints || {}),
      }));
      return new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: messages,
      });
    },
  }),
);
```

**3. Service-Level Error Handling**

Business logic errors are handled with custom exceptions:
- `UserNotFoundException`: HTTP 404 when user not found
- `DuplicateEmailException`: HTTP 409 when email already exists
- `UnauthorizedException`: HTTP 401 for authentication failures
- `ForbiddenException`: HTTP 403 for authorization failures
- `InvalidCredentialsException`: HTTP 401 for wrong password

**4. Database Error Handling**

Prisma errors are caught and transformed:
- `P2002` (Unique constraint violation) → HTTP 409 Conflict
- `P2025` (Record not found) → HTTP 404 Not Found
- `P2003` (Foreign key constraint) → HTTP 400 Bad Request
- Connection errors → HTTP 503 Service Unavailable

**5. Redis Error Handling**

Cache failures are handled gracefully:
- Cache read errors: Log warning and fall back to database
- Cache write errors: Log warning and continue (cache is optional)
- Connection errors: Retry with exponential backoff

**6. Frontend Error Handling**

Axios interceptors handle API errors:
- 401 errors: Clear token and redirect to login
- 403 errors: Show "Access Denied" message
- 404 errors: Show "Resource Not Found" message
- 500 errors: Show "Server Error" message
- Network errors: Show "Connection Error" message

### Error Response Format

All error responses follow a consistent format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "errors": ["email must be a valid email address"]
    },
    {
      "field": "password",
      "errors": ["password must be at least 8 characters"]
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/auth/register"
}
```

### Logging Strategy

**Log Levels**:
- `ERROR`: Unhandled exceptions, database errors, authentication failures
- `WARN`: Cache failures, validation errors, authorization failures
- `INFO`: Successful authentication, CRUD operations, cache hits
- `DEBUG`: Request/response details, query execution times

**Log Format** (JSON for production):
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "ERROR",
  "context": "AuthService",
  "message": "Failed to authenticate user",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "error": "Invalid credentials",
  "stack": "Error: Invalid credentials\n    at AuthService.validateUser..."
}
```

**Log Destinations**:
- Development: Console with pretty formatting
- Production: JSON to stdout (for container log aggregation)
- Optional: Winston with file rotation or external service (e.g., Datadog, Sentry)

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests**: Verify specific examples, edge cases, and error conditions
- Focus on concrete scenarios with known inputs and expected outputs
- Test integration points between components
- Validate error handling for specific failure modes
- Example: "Registering with email 'test@example.com' and password 'Test123!' creates a user"

**Property-Based Tests**: Verify universal properties across all inputs
- Generate hundreds of random inputs to test general correctness
- Uncover edge cases that manual testing might miss
- Validate invariants that should hold for all valid inputs
- Example: "For any valid email and password, registration should succeed"

Both approaches are complementary and necessary:
- Unit tests catch concrete bugs and validate specific behaviors
- Property tests verify general correctness and find unexpected edge cases

### Property-Based Testing Configuration

**Library Selection**:
- Backend (TypeScript/NestJS): **fast-check** (https://github.com/dubzzz/fast-check)
- Frontend (TypeScript/Next.js): **fast-check** (same library for consistency)

**Test Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Seed-based reproducibility for failed tests
- Shrinking enabled to find minimal failing examples

**Property Test Structure**:
```typescript
import * as fc from 'fast-check';

describe('AuthService - Property Tests', () => {
  /**
   * Feature: backend-intern-assignment
   * Property 1: Valid Registration Creates Account
   * 
   * For any valid email and password combination, registration should
   * create a new user account and return HTTP 201 with user profile.
   */
  it('should create account for any valid email and password', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(), // Generate random valid emails
        fc.string({ minLength: 8, maxLength: 50 }), // Generate random passwords
        async (email, password) => {
          const result = await authService.register({ email, password });
          
          expect(result.statusCode).toBe(201);
          expect(result.user.email).toBe(email);
          expect(result.user.role).toBe('USER');
          expect(result.user).not.toHaveProperty('passwordHash');
        }
      ),
      { numRuns: 100 } // Run 100 iterations
    );
  });
});
```

**Tag Format**: Each property test must include a comment referencing the design document property:
```typescript
/**
 * Feature: backend-intern-assignment
 * Property {number}: {property_text}
 */
```

### Test Organization

**Backend Tests** (NestJS):
```
src/
├── auth/
│   ├── auth.service.spec.ts          # Unit tests
│   ├── auth.service.property.spec.ts # Property tests
│   ├── auth.controller.spec.ts       # Controller unit tests
│   └── strategies/
│       ├── local.strategy.spec.ts
│       ├── google.strategy.spec.ts
│       └── telegram.strategy.spec.ts
├── users/
│   ├── users.service.spec.ts
│   ├── users.service.property.spec.ts
│   └── users.controller.spec.ts
├── items/
│   ├── items.service.spec.ts
│   ├── items.service.property.spec.ts
│   └── items.controller.spec.ts
└── cache/
    ├── cache.service.spec.ts
    └── cache.service.property.spec.ts
```

**Frontend Tests** (Next.js):
```
src/
├── components/
│   ├── LoginForm.test.tsx
│   ├── LoginForm.property.test.tsx
│   ├── RegisterForm.test.tsx
│   ├── RegisterForm.property.test.tsx
│   └── ItemList.test.tsx
├── hooks/
│   ├── useAuth.test.ts
│   └── useAuth.property.test.ts
└── lib/
    ├── api-client.test.ts
    └── api-client.property.test.ts
```

### Test Coverage Goals

**Backend**:
- Line coverage: >80%
- Branch coverage: >75%
- Function coverage: >85%
- Critical paths (authentication, authorization): 100%

**Frontend**:
- Component coverage: >70%
- Hook coverage: >80%
- API client coverage: >90%

### Integration Testing

**E2E Tests** (Optional, using Playwright or Cypress):
- Complete authentication flows (email/password, Google OAuth, Telegram OAuth)
- CRUD operations through the UI
- Error handling and validation
- Session management and logout

**API Integration Tests** (using Supertest):
- Test complete request/response cycles
- Verify middleware execution order
- Test database transactions
- Verify cache behavior

### Test Data Management

**Test Database**:
- Separate MySQL database for testing
- Reset database before each test suite
- Use transactions for test isolation

**Test Fixtures**:
```typescript
export const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'Admin123!',
    role: 'ADMIN',
  },
  user: {
    email: 'user@test.com',
    password: 'User123!',
    role: 'USER',
  },
};

export const testItems = {
  active: {
    title: 'Test Item',
    description: 'Test Description',
    status: 'ACTIVE',
  },
  completed: {
    title: 'Completed Item',
    status: 'COMPLETED',
  },
};
```

**Mock Services**:
- Mock Redis for cache tests
- Mock OAuth providers for authentication tests
- Mock external APIs

### Continuous Integration

**CI Pipeline** (GitHub Actions, GitLab CI, or similar):
1. Install dependencies
2. Run linter (ESLint)
3. Run type checker (TypeScript)
4. Run unit tests
5. Run property tests
6. Run integration tests
7. Generate coverage report
8. Build Docker images
9. Run security scan (npm audit, Snyk)

**Pre-commit Hooks** (using Husky):
- Run linter on staged files
- Run type checker
- Run affected tests

### Performance Testing

**Load Testing** (Optional, using k6 or Artillery):
- Test API throughput (requests per second)
- Test concurrent user sessions
- Test cache effectiveness
- Identify bottlenecks

**Benchmarks**:
- Authentication: <100ms per request
- CRUD operations: <50ms per request
- Cache hits: <10ms per request
- Database queries: <20ms per query

---

This design document provides a comprehensive blueprint for implementing a production-ready full-stack application with enterprise-level architecture, security, and testing practices. The system is designed to be scalable, maintainable, and demonstrative of modern backend development best practices.
