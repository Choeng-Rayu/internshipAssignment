# Backend Implementation Tasks

## Overview

This document contains all backend-specific tasks for the NestJS API implementation. The backend is located in the `backend/` directory and includes authentication, authorization, CRUD operations, caching, and API documentation.

**Technology Stack:**
- NestJS 10.x with TypeScript 5.x
- Prisma ORM with MySQL 8.0+
- Passport.js for authentication (JWT, Google OAuth, Telegram OAuth)
- Redis 7.0+ for caching
- class-validator for input validation
- Swagger/OpenAPI for API documentation

**Working Directory:** `backend/`

## Tasks

- [ ] 1. Backend project initialization
  - [x] 1.1 Initialize NestJS project with TypeScript
    - Create NestJS project with CLI: `npx @nestjs/cli new backend`
    - Configure TypeScript with strict mode in tsconfig.json
    - Set up ESLint and Prettier
    - Create project structure: modules, controllers, services, DTOs
    - _Requirements: 0.1, 0.5, 16.1, 16.2, 16.3_
    - _Working Directory: backend/_

  - [ ] 1.2 Create backend environment configuration
    - Create .env.example with all required variables
    - Document MySQL connection (DATABASE_URL)
    - Document Redis connection (REDIS_HOST, REDIS_PORT)
    - Document JWT configuration (JWT_SECRET, JWT_EXPIRATION)
    - Document OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, TELEGRAM_BOT_TOKEN)
    - Add comments explaining each variable
    - _Requirements: 16.4, 16.5, 18A.1, 18A.2, 18A.3, 18A.4, 18A.5, 18A.6, 18A.7_
    - _Working Directory: backend/_

- [ ] 2. Database setup and Prisma configuration
  - [ ] 2.1 Set up Prisma with MySQL
    - Install dependencies: `npm install prisma @prisma/client`
    - Initialize Prisma: `npx prisma init`
    - Update schema.prisma provider to "mysql"
    - Configure DATABASE_URL in .env
    - Create PrismaModule and PrismaService in src/prisma/
    - _Requirements: 0.3, 0.7_
    - _Working Directory: backend/_

  - [ ] 2.2 Define database schema with Prisma
    - Create User model with fields: id, email, passwordHash, role, googleOauthId, telegramOauthId, telegramUsername, createdAt, updatedAt
    - Create Item model with fields: id, title, description, status, userId, createdAt, updatedAt
    - Define UserRole enum (USER, ADMIN)
    - Define ItemStatus enum (ACTIVE, COMPLETED, ARCHIVED)
    - Add unique constraints on email, googleOauthId, telegramOauthId
    - Add indexes on email, googleOauthId, telegramOauthId, userId, status, createdAt
    - Define foreign key relationship: Item.userId → User.id with onDelete: Cascade
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_
    - _File: backend/prisma/schema.prisma_

  - [ ] 2.3 Create and run initial database migration
    - Generate migration: `npx prisma migrate dev --name init`
    - Apply migration to MySQL database
    - Generate Prisma Client: `npx prisma generate`
    - Verify tables and indexes created correctly
    - _Requirements: 9.1, 9.2_
    - _Working Directory: backend/_

  - [ ] 2.4 Create database seed script for development
    - Create prisma/seed.ts with admin user (email: admin@example.com, password: Admin123!, role: ADMIN)
    - Create test user (email: user@example.com, password: User123!, role: USER)
    - Create sample items for test user
    - Add seed script to package.json: `"prisma:seed": "ts-node prisma/seed.ts"`
    - _Requirements: 1.6, 4.1_
    - _File: backend/prisma/seed.ts_

- [ ] 3. Authentication infrastructure
  - [ ] 3.1 Set up Passport.js and JWT module
    - Install dependencies: `npm install @nestjs/passport @nestjs/jwt passport passport-jwt bcrypt`
    - Install types: `npm install -D @types/passport-jwt @types/bcrypt`
    - Create src/config/jwt.config.ts with JWT configuration from environment
    - Configure JwtModule.registerAsync() in AuthModule
    - Set JWT secret and expiration (24 hours)
    - _Requirements: 0.8, 2.6, 2.7_
    - _Working Directory: backend/src/_

  - [ ] 3.2 Create Users module with service and repository
    - Generate module: `nest g module users`
    - Generate service: `nest g service users`
    - Generate controller: `nest g controller users`
    - Implement methods: create, findById, findByEmail, findByGoogleId, findByTelegramId, update, delete
    - Implement OAuth linking: linkGoogleAccount, linkTelegramAccount
    - Use Prisma Client for database operations
    - Exclude passwordHash from all responses using Prisma select
    - _Requirements: 16.2, 17.2_
    - _Files: backend/src/users/users.module.ts, users.service.ts, users.controller.ts_

  - [ ]* 3.3 Write property tests for Users service
    - Install fast-check: `npm install -D fast-check`
    - Create users.service.property.spec.ts
    - **Property 2: Password Hashing** - Verify stored hashes never equal plaintext
    - **Property 33: Password Hash Exclusion** - Verify passwordHash never in responses
    - Run with: `npm run test users.service.property.spec.ts`
    - _Validates: Requirements 1.2, 17.2_
    - _File: backend/src/users/users.service.property.spec.ts_

  - [ ] 3.4 Create Auth module with registration and login
    - Generate module: `nest g module auth`
    - Generate service: `nest g service auth`
    - Generate controller: `nest g controller auth`
    - Create DTOs: RegisterDto, LoginDto, AuthResponseDto in src/auth/dto/
    - Implement register() with bcrypt hashing (cost factor 12)
    - Implement login() with credential verification
    - Implement generateToken() with user ID and role claims
    - Set default role to USER for new registrations
    - Create POST /api/v1/auth/register and /api/v1/auth/login endpoints
    - _Requirements: 1.1, 1.2, 1.6, 2.1, 2.2, 2.6, 2.7, 16.2_
    - _Files: backend/src/auth/auth.module.ts, auth.service.ts, auth.controller.ts, dto/*_

  - [ ]* 3.5 Write property tests for registration
    - Create auth.service.property.spec.ts
    - **Property 1: Valid Registration Creates Account** - Any valid email/password creates account
    - **Property 3: Duplicate Email Rejection** - Existing email returns 409
    - **Property 4: Invalid Email Rejection** - Invalid email format returns 400
    - **Property 5: Short Password Rejection** - Password <8 chars returns 400
    - **Property 6: Default User Role Assignment** - New users get USER role
    - Run with: `npm run test auth.service.property.spec.ts`
    - _Validates: Requirements 1.1, 1.3, 1.4, 1.5, 1.6, 1.7_
    - _File: backend/src/auth/auth.service.property.spec.ts_

  - [ ]* 3.6 Write property tests for authentication
    - **Property 7: Successful Authentication Returns JWT** - Valid login returns 200 with JWT
    - **Property 8: Invalid Credentials Rejection** - Wrong password returns 401
    - **Property 9: Missing Login Fields Rejection** - Missing fields return 400
    - **Property 10: JWT Expiration Time** - JWT exp claim is 24 hours from iat
    - **Property 11: JWT Signature Validity** - JWT verifiable with secret, fails if tampered
    - _Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
    - _File: backend/src/auth/auth.service.property.spec.ts_

  - [ ] 3.7 Create JWT authentication strategy and guard
    - Create src/auth/strategies/jwt.strategy.ts
    - Implement JwtStrategy extending PassportStrategy
    - Extract user ID and role from JWT payload in validate()
    - Create src/common/guards/jwt-auth.guard.ts extending AuthGuard('jwt')
    - Handle expired and invalid tokens with 401 responses
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
    - _Files: backend/src/auth/strategies/jwt.strategy.ts, src/common/guards/jwt-auth.guard.ts_

  - [ ]* 3.8 Write property tests for JWT authentication
    - Create jwt.strategy.property.spec.ts
    - **Property 14: Valid JWT Grants Access** - Valid JWT allows access to protected routes
    - **Property 15: Missing Authorization Rejection** - No header returns 401
    - **Property 16: Expired JWT Rejection** - Expired token returns 401
    - **Property 17: Invalid JWT Signature Rejection** - Tampered token returns 401
    - **Property 18: JWT Claims Extraction** - User ID and role extracted correctly
    - _Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5_
    - _File: backend/src/auth/strategies/jwt.strategy.property.spec.ts_

- [ ] 4. OAuth integration
  - [ ] 4.1 Implement Google OAuth strategy
    - Install: `npm install passport-google-oauth20`
    - Install types: `npm install -D @types/passport-google-oauth20`
    - Create src/auth/strategies/google.strategy.ts
    - Configure with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from env
    - Implement validate() to exchange code for token and fetch user profile
    - Create new user or link to existing account by email
    - Generate JWT on successful authentication
    - _Requirements: 2A.1, 2A.2, 2A.3, 2A.4, 2A.5, 2A.6, 2A.7, 2A.9_
    - _File: backend/src/auth/strategies/google.strategy.ts_

  - [ ]* 4.2 Write property tests for Google OAuth
    - Create google.strategy.property.spec.ts
    - **Property 12: OAuth First-Time User Creation** - New OAuth user creates account
    - **Property 13: OAuth Account Linking** - Existing email links google_oauth_id
    - _Validates: Requirements 2A.4, 2A.5_
    - _File: backend/src/auth/strategies/google.strategy.property.spec.ts_

  - [ ] 4.3 Implement Telegram OAuth strategy
    - Install: `npm install passport-telegram-official` or create custom strategy
    - Create src/auth/strategies/telegram.strategy.ts
    - Configure with TELEGRAM_BOT_TOKEN from env
    - Implement validate() to validate Telegram auth data
    - Extract telegram_id and username
    - Create new user or authenticate existing by telegram_oauth_id
    - Generate JWT on successful authentication
    - _Requirements: 2B.1, 2B.2, 2B.3, 2B.4, 2B.5, 2B.6, 2B.7, 2B.9_
    - _File: backend/src/auth/strategies/telegram.strategy.ts_

  - [ ] 4.4 Create OAuth callback endpoints
    - Add GET /api/v1/auth/google route with @UseGuards(AuthGuard('google'))
    - Add GET /api/v1/auth/google/callback route
    - Add GET /api/v1/auth/telegram route with @UseGuards(AuthGuard('telegram'))
    - Add GET /api/v1/auth/telegram/callback route
    - Handle OAuth failures with 401 and descriptive messages
    - Redirect to frontend with JWT token on success
    - _Requirements: 2A.1, 2A.7, 2A.8, 2B.1, 2B.7, 2B.8_
    - _File: backend/src/auth/auth.controller.ts_

- [ ] 5. Role-based access control (RBAC)
  - [ ] 5.1 Create Roles decorator and guard
    - Create src/common/decorators/roles.decorator.ts with @Roles() decorator
    - Create src/common/guards/roles.guard.ts implementing CanActivate
    - Extract user role from request.user (set by JwtAuthGuard)
    - Compare with required roles from @Roles() decorator
    - Return 403 Forbidden when role check fails
    - _Requirements: 4.1, 4.2, 4.4_
    - _Files: backend/src/common/decorators/roles.decorator.ts, src/common/guards/roles.guard.ts_

  - [ ] 5.2 Create admin-only endpoint for demonstration
    - Add GET /api/v1/users endpoint in UsersController
    - Apply @UseGuards(JwtAuthGuard, RolesGuard) and @Roles('ADMIN')
    - Return list of all users (excluding passwords)
    - _Requirements: 4.1, 4.3_
    - _File: backend/src/users/users.controller.ts_

  - [ ]* 5.3 Write property tests for RBAC
    - Create roles.guard.property.spec.ts
    - **Property 19: Admin Role Access** - Admin users can access admin endpoints
    - **Property 20: Non-Admin Role Rejection** - User role returns 403 on admin endpoints
    - _Validates: Requirements 4.1, 4.2_
    - _File: backend/src/common/guards/roles.guard.property.spec.ts_

- [ ] 6. Input validation and security middleware
  - [ ] 6.1 Configure global validation pipe
    - Install: `npm install class-validator class-transformer`
    - Configure ValidationPipe in main.ts with whitelist: true, transform: true
    - Set up custom exception factory for validation errors
    - Return 400 with field-level error messages
    - _Requirements: 6.1, 6.2, 8.4_
    - _File: backend/src/main.ts_

  - [ ] 6.2 Create DTOs with validation decorators
    - RegisterDto: @IsEmail(), @IsNotEmpty(), @MinLength(8), @Matches() for password
    - LoginDto: @IsEmail(), @IsNotEmpty()
    - CreateItemDto: @IsString(), @IsNotEmpty(), @MaxLength(200), @IsEnum(ItemStatus)
    - UpdateItemDto: @IsOptional() with same validators
    - _Requirements: 1.4, 1.5, 2.5, 5.7, 6.1_
    - _Files: backend/src/auth/dto/*, src/items/dto/*_

  - [ ]* 6.3 Write property tests for input validation
    - Create validation.pipe.property.spec.ts
    - **Property 28: Input Validation and Error Response** - Invalid input returns 400 with field errors
    - **Property 40: Validation Error Array** - Multiple field errors returned as array
    - _Validates: Requirements 6.1, 6.2, 8.4_
    - _File: backend/src/common/pipes/validation.pipe.property.spec.ts_

  - [ ] 6.4 Set up security middleware
    - Install: `npm install helmet @nestjs/throttler`
    - Configure helmet in main.ts for security headers
    - Configure CORS with allowed origins
    - Set up ThrottlerModule with 100 requests per 15 minutes
    - Add payload size limit (10MB) in main.ts
    - _Requirements: 6.6, 17.3_
    - _File: backend/src/main.ts, src/app.module.ts_

  - [ ]* 6.5 Write property tests for security
    - Create security.property.spec.ts
    - **Property 29: SQL Injection Prevention** - SQL patterns don't cause injection
    - **Property 31: XSS Prevention** - XSS payloads are sanitized
    - **Property 32: Payload Size Limit** - >10MB returns 413
    - **Property 34: Security Headers** - Responses include security headers
    - _Validates: Requirements 6.3, 6.5, 6.6, 17.3_
    - _File: backend/src/common/security.property.spec.ts_

- [ ] 7. Items CRUD module (Secondary Entity)
  - [ ] 7.1 Create Items module with service and controller
    - Generate module: `nest g module items`
    - Generate service: `nest g service items`
    - Generate controller: `nest g controller items`
    - Create DTOs: CreateItemDto, UpdateItemDto in src/items/dto/
    - Create Item entity interface in src/items/entities/item.entity.ts
    - _Requirements: 5.8, 16.1_
    - _Files: backend/src/items/items.module.ts, items.service.ts, items.controller.ts_

  - [ ] 7.2 Implement create and read operations
    - POST /api/v1/items - Create item with user ID from JWT (@CurrentUser() decorator)
    - GET /api/v1/items - List items filtered by user ID
    - GET /api/v1/items/:id - Get single item with ownership check
    - Apply @UseGuards(JwtAuthGuard) to all endpoints
    - Return 201 for create, 200 for reads, 404 for not found
    - _Requirements: 5.1, 5.2, 5.3, 5.6, 5.8, 5.9_
    - _File: backend/src/items/items.controller.ts, items.service.ts_

  - [ ] 7.3 Implement update and delete operations
    - PATCH /api/v1/items/:id - Update item with ownership check
    - DELETE /api/v1/items/:id - Delete item with ownership check
    - Verify item belongs to requesting user before update/delete
    - Return 200 for update, 204 for delete, 404 for not found, 403 for ownership violation
    - Validate item data on create/update using DTOs
    - _Requirements: 5.4, 5.5, 5.6, 5.7_
    - _File: backend/src/items/items.controller.ts, items.service.ts_

  - [ ]* 7.4 Write property tests for Items CRUD
    - Create items.service.property.spec.ts
    - **Property 21: Valid Item Creation** - Valid data creates item with user ID
    - **Property 22: Item Retrieval by ID** - Existing item returns 200 with data
    - **Property 23: Item List Retrieval** - User gets only their own items
    - **Property 24: Item Update** - Owner can update item
    - **Property 25: Item Deletion** - Owner can delete item
    - **Property 26: Non-Existent Item Rejection** - Non-existent ID returns 404
    - **Property 27: Invalid Item Data Rejection** - Invalid data returns 400
    - _Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9_
    - _File: backend/src/items/items.service.property.spec.ts_

- [ ] 8. Redis caching layer
  - [ ] 8.1 Set up Redis module and service
    - Install: `npm install ioredis @nestjs/cache-manager cache-manager`
    - Create src/cache/cache.module.ts and cache.service.ts
    - Configure Redis connection from REDIS_HOST and REDIS_PORT env variables
    - Implement methods: get<T>, set, delete, deletePattern
    - _Requirements: 0.4_
    - _Files: backend/src/cache/cache.module.ts, cache.service.ts_

  - [ ] 8.2 Implement cache-first pattern for user profiles
    - Add getUserProfile(userId) and setUserProfile(user) methods to CacheService
    - Check cache before database query in UsersService.findById()
    - Store result in cache with 1 hour TTL (3600 seconds)
    - Invalidate cache on user update/delete
    - Cache key pattern: `user:profile:{userId}`
    - _Requirements: 19.1, 19.3, 19.4, 19.5_
    - _Files: backend/src/cache/cache.service.ts, src/users/users.service.ts_

  - [ ] 8.3 Implement cache-first pattern for item lists
    - Add getItemsList(userId) and setItemsList(userId, items) methods to CacheService
    - Check cache before database query in ItemsService.findAll()
    - Store result in cache with 5 minute TTL (300 seconds)
    - Invalidate cache on item create/update/delete
    - Cache key pattern: `items:list:{userId}`
    - _Requirements: 19.2, 19.3, 19.4, 19.5_
    - _Files: backend/src/cache/cache.service.ts, src/items/items.service.ts_

  - [ ]* 8.4 Write property tests for caching
    - Create cache.service.property.spec.ts
    - **Property 41: Cache-First Data Retrieval** - Check cache before DB
    - **Property 42: User Profile Cache TTL** - User cache TTL is 1 hour
    - **Property 43: Item List Cache TTL** - Item cache TTL is 5 minutes
    - **Property 44: Cache Invalidation on Mutation** - Updates invalidate cache
    - _Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5_
    - _File: backend/src/cache/cache.service.property.spec.ts_

- [ ] 9. API versioning and error handling
  - [ ] 9.1 Configure API versioning
    - Enable versioning in main.ts: app.enableVersioning({ type: VersioningType.URI })
    - Set global prefix: app.setGlobalPrefix('api')
    - Add @Controller({ version: '1' }) to all controllers
    - Verify all routes prefixed with /api/v1
    - _Requirements: 7.1, 7.2, 7.3_
    - _File: backend/src/main.ts, all controllers_

  - [ ] 9.2 Create global exception filter
    - Create src/common/filters/http-exception.filter.ts implementing ExceptionFilter
    - Catch all exceptions with @Catch()
    - Transform exceptions to consistent JSON format: { statusCode, message, timestamp, path }
    - Map exception types to HTTP status codes
    - Log errors with context (timestamp, endpoint, user, stack trace)
    - Prevent stack trace exposure in production (check NODE_ENV)
    - Apply globally in main.ts: app.useGlobalFilters(new HttpExceptionFilter())
    - _Requirements: 8.1, 8.2, 8.3, 8.5_
    - _File: backend/src/common/filters/http-exception.filter.ts_

  - [ ]* 9.3 Write property tests for error handling
    - Create error-handling.property.spec.ts
    - **Property 35: API Versioning** - All endpoints prefixed with /api/v1
    - **Property 36: Unversioned Endpoint Rejection** - Unversioned paths return 404
    - **Property 37: Consistent Error Response Format** - Errors have error and message fields
    - **Property 38: Appropriate HTTP Status Codes** - Correct status for each error type
    - **Property 39: Unhandled Exception Handling** - 500 errors don't expose stack traces
    - _Validates: Requirements 7.1, 7.2, 7.3, 8.1, 8.2, 8.3_
    - _File: backend/src/common/filters/error-handling.property.spec.ts_

- [ ] 10. API documentation with Swagger
  - [ ] 10.1 Set up Swagger/OpenAPI documentation
    - Install: `npm install @nestjs/swagger`
    - Configure SwaggerModule in main.ts
    - Set document title, description, version
    - Serve interactive docs at /api/docs
    - _Requirements: 10.5_
    - _File: backend/src/main.ts_

  - [ ] 10.2 Add Swagger decorators to DTOs and controllers
    - Add @ApiProperty() to all DTO fields with description and example
    - Add @ApiTags() to all controllers
    - Add @ApiOperation() and @ApiResponse() to all endpoints
    - Document authentication requirements with @ApiBearerAuth()
    - Add examples for request/response bodies
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
    - _Files: All DTOs and controllers_

- [ ] 11. Backend graceful shutdown
  - [ ] 11.1 Implement shutdown hooks
    - Add enableShutdownHooks() to PrismaService
    - Close database connections gracefully in onModuleDestroy()
    - Close Redis connections gracefully in CacheService.onModuleDestroy()
    - Handle SIGTERM and SIGINT signals in main.ts
    - _Requirements: 20.22_
    - _Files: backend/src/prisma/prisma.service.ts, src/cache/cache.service.ts, src/main.ts_

- [ ] 12. Backend testing and validation
  - [ ] 12.1 Set up testing infrastructure
    - Configure Jest in package.json
    - Create test database configuration
    - Create test fixtures in test/fixtures/
    - Set up mock Prisma Client for unit tests
    - Set up mock Redis for cache tests
    - _Requirements: Testing Strategy_
    - _Files: backend/jest.config.js, test/fixtures/*_

  - [ ] 12.2 Run all property-based tests
    - Execute all backend property tests: `npm run test -- --testPathPattern=property.spec.ts`
    - Verify all properties pass with 100 iterations each
    - Document any failing cases and fix
    - _Requirements: All Property Tests_
    - _Working Directory: backend/_

  - [ ] 12.3 Verify test coverage
    - Run coverage report: `npm run test:cov`
    - Target >80% line coverage, >75% branch coverage
    - Identify untested critical paths
    - Add additional tests if needed
    - _Requirements: Testing Strategy_
    - _Working Directory: backend/_

  - [ ] 12.4 Run linter and fix issues
    - Run ESLint: `npm run lint`
    - Fix auto-fixable issues: `npm run lint:fix`
    - Manually fix remaining issues
    - _Working Directory: backend/_

## Checkpoint

- [ ] Backend implementation complete
  - All modules implemented and tested
  - All property tests passing
  - Test coverage meets targets (>80% line coverage)
  - Linter passes with no errors
  - API documentation available at /api/docs
  - Ready for integration with frontend

## Notes

- All tasks should be executed from the `backend/` directory unless otherwise specified
- Run `npm install` after adding new dependencies
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate dev` to create new migrations
- Use `npm run start:dev` for development with hot reload
- Tasks marked with `*` are optional property-based tests
- Each property test should run 100 iterations minimum
- Refer to [backend/src](backend/src) for existing code structure
