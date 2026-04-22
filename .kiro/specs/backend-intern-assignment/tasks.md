# Implementation Plan: Backend Intern Assignment

## Overview

This implementation plan breaks down the full-stack application into sequential, manageable tasks that build upon each other. The approach prioritizes establishing core infrastructure first (Docker, database, authentication), then implementing business logic (CRUD operations, caching), and finally building the frontend UI. Each task includes specific requirements references for traceability and optional property-based testing sub-tasks for quality assurance.

The implementation follows a production-ready approach with emphasis on security, scalability, and clean code practices. All services are containerized and orchestrated with Docker Compose for easy deployment.

## Tasks

- [ ] 1. Project initialization and Docker infrastructure
  - [x] 1.1 Initialize NestJS backend project with TypeScript
    - Create NestJS project with CLI
    - Configure TypeScript with strict mode
    - Set up ESLint and Prettier
    - Create project structure: modules, controllers, services, DTOs
    - _Requirements: 0.1, 0.5, 16.1, 16.2, 16.3_

  - [ ] 1.2 Initialize Next.js frontend project with TypeScript
    - Create Next.js project with App Router
    - Configure TypeScript with strict mode
    - Set up Tailwind CSS for styling
    - Create basic folder structure: components, hooks, lib, app
    - _Requirements: 0.2, 0.6, 0.9_

  - [ ] 1.3 Create Docker Compose configuration with all services
    - Define MySQL service with volume persistence
    - Define Redis service with volume persistence
    - Define backend service with environment variables
    - Define frontend service with environment variables
    - Configure service networking and dependencies
    - _Requirements: 0.3, 0.4, 0.10, 20.3, 20.4, 20.9, 20.10, 20.11, 20.12, 20.13, 20.14, 20.15_


  - [ ] 1.4 Create Dockerfiles for backend and frontend with multi-stage builds
    - Write backend Dockerfile with build and production stages
    - Write frontend Dockerfile with build and production stages
    - Create .dockerignore files for both services
    - Configure port exposure (backend: 3000, frontend: 3001)
    - _Requirements: 20.1, 20.2, 20.5, 20.6, 20.16, 20.17, 20.18, 20.19_

  - [ ] 1.5 Create environment configuration files
    - Create .env.example for backend with all required variables
    - Document MySQL, Redis, JWT, OAuth credentials
    - Create .env.example for frontend with API URL
    - Add comments explaining each variable
    - _Requirements: 16.4, 16.5, 18A.1, 18A.2, 18A.3, 18A.4, 18A.5, 18A.6, 18A.7, 20.21_

- [ ] 2. Database setup and Prisma configuration
  - [ ] 2.1 Set up Prisma with MySQL
    - Install Prisma and Prisma Client
    - Initialize Prisma with MySQL provider
    - Configure database connection URL from environment
    - Create Prisma module and service in NestJS
    - _Requirements: 0.3, 0.7_

  - [ ] 2.2 Define database schema with Prisma
    - Create User model with all fields (id, email, passwordHash, role, OAuth IDs, timestamps)
    - Create Item model with all fields (id, title, description, status, userId, timestamps)
    - Define enums for UserRole and ItemStatus
    - Add unique constraints and indexes
    - Define foreign key relationships with cascade delete
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

  - [ ] 2.3 Create and run initial database migration
    - Generate Prisma migration from schema
    - Apply migration to MySQL database
    - Verify tables and indexes created correctly
    - _Requirements: 9.1, 9.2_

  - [ ] 2.4 Create database seed script for development
    - Create seed.ts with admin and test user
    - Create sample items for test user
    - Configure seed script in package.json
    - _Requirements: 1.6, 4.1_

- [ ] 3. Authentication infrastructure
  - [ ] 3.1 Set up Passport.js and JWT module
    - Install Passport, JWT, and bcrypt dependencies
    - Configure JwtModule with secret and expiration
    - Create JWT configuration from environment variables
    - _Requirements: 0.8, 2.6, 2.7_

  - [ ] 3.2 Create Users module with service and repository
    - Create UsersModule, UsersService, UsersController
    - Implement user CRUD methods (create, findById, findByEmail, findByGoogleId, findByTelegramId)
    - Implement OAuth account linking methods
    - Exclude passwordHash from all responses
    - _Requirements: 16.2, 17.2_

  - [ ]* 3.3 Write property tests for Users service
    - **Property 2: Password Hashing** - Verify stored hashes never equal plaintext
    - **Property 33: Password Hash Exclusion** - Verify passwordHash never in responses
    - **Validates: Requirements 1.2, 17.2**


  - [ ] 3.4 Create Auth module with registration and login
    - Create AuthModule, AuthService, AuthController
    - Implement register method with password hashing (bcrypt cost 12)
    - Implement login method with credential verification
    - Implement JWT token generation with user ID and role claims
    - Set default role to USER for new registrations
    - _Requirements: 1.1, 1.2, 1.6, 2.1, 2.2, 2.6, 2.7, 16.2_

  - [ ]* 3.5 Write property tests for registration
    - **Property 1: Valid Registration Creates Account** - Any valid email/password creates account
    - **Property 3: Duplicate Email Rejection** - Existing email returns 409
    - **Property 4: Invalid Email Rejection** - Invalid email format returns 400
    - **Property 5: Short Password Rejection** - Password <8 chars returns 400
    - **Property 6: Default User Role Assignment** - New users get USER role
    - **Validates: Requirements 1.1, 1.3, 1.4, 1.5, 1.6, 1.7**

  - [ ]* 3.6 Write property tests for authentication
    - **Property 7: Successful Authentication Returns JWT** - Valid login returns 200 with JWT
    - **Property 8: Invalid Credentials Rejection** - Wrong password returns 401
    - **Property 9: Missing Login Fields Rejection** - Missing fields return 400
    - **Property 10: JWT Expiration Time** - JWT exp claim is 24 hours from iat
    - **Property 11: JWT Signature Validity** - JWT verifiable with secret, fails if tampered
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**

  - [ ] 3.7 Create JWT authentication strategy and guard
    - Implement JwtStrategy to validate JWT tokens
    - Extract user ID and role from JWT payload
    - Create JwtAuthGuard for protecting routes
    - Handle expired and invalid tokens with 401 responses
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 3.8 Write property tests for JWT authentication
    - **Property 14: Valid JWT Grants Access** - Valid JWT allows access to protected routes
    - **Property 15: Missing Authorization Rejection** - No header returns 401
    - **Property 16: Expired JWT Rejection** - Expired token returns 401
    - **Property 17: Invalid JWT Signature Rejection** - Tampered token returns 401
    - **Property 18: JWT Claims Extraction** - User ID and role extracted correctly
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

- [ ] 4. OAuth integration
  - [ ] 4.1 Implement Google OAuth strategy
    - Install @nestjs/passport and passport-google-oauth20
    - Create GoogleStrategy with client ID and secret from env
    - Implement OAuth callback to exchange code for token
    - Fetch user profile from Google
    - Create new user or link to existing account by email
    - Generate JWT on successful authentication
    - _Requirements: 2A.1, 2A.2, 2A.3, 2A.4, 2A.5, 2A.6, 2A.7, 2A.9_

  - [ ]* 4.2 Write property tests for Google OAuth
    - **Property 12: OAuth First-Time User Creation** - New OAuth user creates account
    - **Property 13: OAuth Account Linking** - Existing email links google_oauth_id
    - **Validates: Requirements 2A.4, 2A.5**

  - [ ] 4.3 Implement Telegram OAuth strategy
    - Install passport-telegram-official or custom strategy
    - Create TelegramStrategy with bot token from env
    - Implement OAuth callback to validate Telegram auth data
    - Extract telegram_id and username
    - Create new user or authenticate existing by telegram_oauth_id
    - Generate JWT on successful authentication
    - _Requirements: 2B.1, 2B.2, 2B.3, 2B.4, 2B.5, 2B.6, 2B.7, 2B.9_

  - [ ] 4.4 Create OAuth callback endpoints
    - Add GET /api/v1/auth/google and /google/callback routes
    - Add GET /api/v1/auth/telegram and /telegram/callback routes
    - Handle OAuth failures with 401 and descriptive messages
    - Redirect to frontend with JWT token on success
    - _Requirements: 2A.1, 2A.7, 2A.8, 2B.1, 2B.7, 2B.8_


- [ ] 5. Role-based access control (RBAC)
  - [ ] 5.1 Create Roles decorator and guard
    - Create @Roles() decorator to specify required roles
    - Create RolesGuard to check user role from JWT
    - Combine with JwtAuthGuard for authentication + authorization
    - Return 403 Forbidden when role check fails
    - _Requirements: 4.1, 4.2, 4.4_

  - [ ] 5.2 Create admin-only endpoint for demonstration
    - Add GET /api/v1/users endpoint (admin only)
    - Apply @Roles('ADMIN') decorator
    - Return list of all users (excluding passwords)
    - _Requirements: 4.1, 4.3_

  - [ ]* 5.3 Write property tests for RBAC
    - **Property 19: Admin Role Access** - Admin users can access admin endpoints
    - **Property 20: Non-Admin Role Rejection** - User role returns 403 on admin endpoints
    - **Validates: Requirements 4.1, 4.2**

- [ ] 6. Input validation and security middleware
  - [ ] 6.1 Configure global validation pipe
    - Set up ValidationPipe with whitelist and transform options
    - Configure custom exception factory for validation errors
    - Return 400 with field-level error messages
    - _Requirements: 6.1, 6.2, 8.4_

  - [ ] 6.2 Create DTOs with validation decorators
    - RegisterDto: @IsEmail, @MinLength(8), @Matches for password
    - LoginDto: @IsEmail, @IsNotEmpty
    - CreateItemDto: @IsString, @MaxLength, @IsEnum
    - UpdateItemDto: @IsOptional with same validators
    - _Requirements: 1.4, 1.5, 2.5, 5.7, 6.1_

  - [ ]* 6.3 Write property tests for input validation
    - **Property 28: Input Validation and Error Response** - Invalid input returns 400 with field errors
    - **Property 40: Validation Error Array** - Multiple field errors returned as array
    - **Validates: Requirements 6.1, 6.2, 8.4**

  - [ ] 6.4 Set up security middleware
    - Install and configure helmet for security headers
    - Configure CORS with allowed origins
    - Set up rate limiting with @nestjs/throttler (100 req/15min)
    - Add payload size limit (10MB)
    - _Requirements: 6.6, 17.3_

  - [ ]* 6.5 Write property tests for security
    - **Property 29: SQL Injection Prevention** - SQL patterns don't cause injection
    - **Property 31: XSS Prevention** - XSS payloads are sanitized
    - **Property 32: Payload Size Limit** - >10MB returns 413
    - **Property 34: Security Headers** - Responses include security headers
    - **Validates: Requirements 6.3, 6.5, 6.6, 17.3**

- [ ] 7. Items CRUD module (Secondary Entity)
  - [ ] 7.1 Create Items module with service and controller
    - Create ItemsModule, ItemsService, ItemsController
    - Define Item entity and DTOs (CreateItemDto, UpdateItemDto)
    - Implement CRUD methods with ownership validation
    - Associate each item with creator's user ID
    - _Requirements: 5.8, 16.1_

  - [ ] 7.2 Implement create and read operations
    - POST /api/v1/items - Create item with user ID from JWT
    - GET /api/v1/items - List items filtered by user ID
    - GET /api/v1/items/:id - Get single item with ownership check
    - Return 201 for create, 200 for reads, 404 for not found
    - _Requirements: 5.1, 5.2, 5.3, 5.6, 5.8, 5.9_

  - [ ] 7.3 Implement update and delete operations
    - PATCH /api/v1/items/:id - Update item with ownership check
    - DELETE /api/v1/items/:id - Delete item with ownership check
    - Return 200 for update, 204 for delete, 404 for not found
    - Validate item data on create/update
    - _Requirements: 5.4, 5.5, 5.6, 5.7_


  - [ ]* 7.4 Write property tests for Items CRUD
    - **Property 21: Valid Item Creation** - Valid data creates item with user ID
    - **Property 22: Item Retrieval by ID** - Existing item returns 200 with data
    - **Property 23: Item List Retrieval** - User gets only their own items
    - **Property 24: Item Update** - Owner can update item
    - **Property 25: Item Deletion** - Owner can delete item
    - **Property 26: Non-Existent Item Rejection** - Non-existent ID returns 404
    - **Property 27: Invalid Item Data Rejection** - Invalid data returns 400
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9**

- [ ] 8. Redis caching layer
  - [ ] 8.1 Set up Redis module and service
    - Install ioredis and @nestjs/cache-manager
    - Create CacheModule and CacheService
    - Configure Redis connection from environment
    - Implement get, set, delete, deletePattern methods
    - _Requirements: 0.4_

  - [ ] 8.2 Implement cache-first pattern for user profiles
    - Add getUserProfile and setUserProfile methods
    - Check cache before database query
    - Store result in cache with 1 hour TTL
    - Invalidate cache on user update/delete
    - _Requirements: 19.1, 19.3, 19.4, 19.5_

  - [ ] 8.3 Implement cache-first pattern for item lists
    - Add getItemsList and setItemsList methods
    - Check cache before database query
    - Store result in cache with 5 minute TTL
    - Invalidate cache on item create/update/delete
    - _Requirements: 19.2, 19.3, 19.4, 19.5_

  - [ ]* 8.4 Write property tests for caching
    - **Property 41: Cache-First Data Retrieval** - Check cache before DB
    - **Property 42: User Profile Cache TTL** - User cache TTL is 1 hour
    - **Property 43: Item List Cache TTL** - Item cache TTL is 5 minutes
    - **Property 44: Cache Invalidation on Mutation** - Updates invalidate cache
    - **Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5**

- [ ] 9. API versioning and error handling
  - [ ] 9.1 Configure API versioning
    - Enable versioning with URI strategy
    - Prefix all routes with /api/v1
    - Return 404 for unversioned endpoints
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ] 9.2 Create global exception filter
    - Implement GlobalExceptionFilter to catch all exceptions
    - Transform exceptions to consistent JSON format
    - Map exception types to HTTP status codes
    - Log errors with context (timestamp, endpoint, user)
    - Prevent stack trace exposure in production
    - _Requirements: 8.1, 8.2, 8.3, 8.5_

  - [ ]* 9.3 Write property tests for error handling
    - **Property 35: API Versioning** - All endpoints prefixed with /api/v1
    - **Property 36: Unversioned Endpoint Rejection** - Unversioned paths return 404
    - **Property 37: Consistent Error Response Format** - Errors have error and message fields
    - **Property 38: Appropriate HTTP Status Codes** - Correct status for each error type
    - **Property 39: Unhandled Exception Handling** - 500 errors don't expose stack traces
    - **Validates: Requirements 7.1, 7.2, 7.3, 8.1, 8.2, 8.3**

- [ ] 10. API documentation with Swagger
  - [ ] 10.1 Set up Swagger/OpenAPI documentation
    - Install @nestjs/swagger
    - Configure SwaggerModule in main.ts
    - Serve interactive docs at /api/docs
    - _Requirements: 10.5_

  - [ ] 10.2 Add Swagger decorators to DTOs and controllers
    - Add @ApiProperty to all DTO fields
    - Add @ApiTags to controllers
    - Add @ApiOperation and @ApiResponse to endpoints
    - Document authentication requirements with @ApiBearerAuth
    - _Requirements: 10.1, 10.2, 10.3, 10.4_


- [ ] 11. Checkpoint - Backend core functionality complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Frontend authentication UI
  - [ ] 12.1 Create authentication context and hooks
    - Create AuthContext with user state and token management
    - Create useAuth hook for accessing auth state
    - Implement token storage in localStorage or httpOnly cookies
    - Implement logout function to clear token
    - _Requirements: 12.7, 13.4, 17.5, 17.6_

  - [ ] 12.2 Create API client with Axios interceptors
    - Set up Axios instance with base URL
    - Add request interceptor to inject JWT token
    - Add response interceptor to handle 401 errors
    - Redirect to login on authentication failure
    - _Requirements: 13.3_

  - [ ]* 12.3 Write property tests for API client
    - **Property 58: JWT Token Injection** - Requests include Bearer token
    - **Property 59: Logout Token Clearing** - Logout clears token and redirects
    - **Validates: Requirements 13.3, 13.4, 17.6**

  - [ ] 12.3 Create registration form component
    - Build form with email and password inputs
    - Add client-side validation (email format, password length)
    - Submit POST to /api/v1/auth/register
    - Display success message and redirect to login
    - Display error messages from API
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [ ]* 12.4 Write property tests for registration form
    - **Property 45: Registration Form Submission** - Form submits POST request
    - **Property 46: Registration Success Handling** - Success shows message and redirects
    - **Property 47: Frontend Email Validation** - Invalid email prevents submission
    - **Property 48: Frontend Password Validation** - Short password prevents submission
    - **Validates: Requirements 11.2, 11.3, 11.5, 11.6**

  - [ ] 12.5 Create login form component
    - Build form with email and password inputs
    - Add "Login with Google" button
    - Add "Login with Telegram" button
    - Submit POST to /api/v1/auth/login for email/password
    - Redirect to OAuth endpoints for Google/Telegram
    - Store JWT token on success and redirect to dashboard
    - Display error messages from API
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 12.10_

  - [ ]* 12.6 Write property tests for login form
    - **Property 49: Login Form Submission** - Form submits POST request
    - **Property 50: OAuth Redirect** - OAuth buttons redirect to authorization
    - **Property 51: JWT Token Storage** - Success stores token securely
    - **Property 52: Post-Login Redirect** - Success redirects to dashboard
    - **Validates: Requirements 12.4, 12.5, 12.6, 12.7, 12.8**

  - [ ] 12.7 Create OAuth callback handler
    - Create /auth/callback page to receive OAuth redirects
    - Extract authorization code from URL params
    - Send code to backend callback endpoint
    - Store JWT token from response
    - Redirect to dashboard on success
    - Redirect to login with error on failure
    - Implement state parameter validation for CSRF protection
    - _Requirements: 12A.1, 12A.2, 12A.3, 12A.4, 12A.5, 12A.6_

  - [ ]* 12.8 Write property tests for OAuth callback
    - **Property 53: OAuth Callback Forwarding** - Code sent to backend
    - **Property 54: OAuth Failure Handling** - Failure redirects to login
    - **Property 55: OAuth State Validation** - State parameter validated
    - **Validates: Requirements 12A.1, 12A.2, 12A.5, 12A.6**

- [x] 13. Frontend protected dashboard
   - [x] 13.1 Create protected route wrapper
    - Check for valid JWT token
    - Redirect to login if no token
    - Allow access if token exists
    - _Requirements: 13.1, 13.2_

  - [ ]* 13.2 Write property tests for protected routes
    - **Property 56: Unauthenticated Dashboard Redirect** - No token redirects to login
    - **Property 57: Authenticated Dashboard Access** - Valid token shows dashboard
    - **Validates: Requirements 13.1, 13.2**


   - [x] 13.3 Create dashboard layout with navigation
    - Display user profile information
    - Add logout button
    - Add navigation to items management
    - _Requirements: 13.2, 13.4_

- [x] 14. Frontend CRUD interface for items
   - [x] 14.1 Create items list component
    - Fetch items from GET /api/v1/items
    - Display items in a table or card layout
    - Show title, description, status, timestamps
    - Add edit and delete buttons for each item
    - _Requirements: 14.1_

  - [ ] 14.2 Create item form component
    - Build form with title, description, status inputs
    - Use for both create and edit operations
    - Validate title length and required fields
    - Submit POST for create, PATCH for update
    - _Requirements: 14.2, 14.3_

  - [ ] 14.3 Implement create, update, delete operations
    - POST /api/v1/items to create new item
    - PATCH /api/v1/items/:id to update item
    - DELETE /api/v1/items/:id to delete item
    - Show success message and refresh list on success
    - Show error message on failure
    - _Requirements: 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ]* 14.4 Write property tests for items UI
    - **Property 60: User Items Display** - Dashboard shows user's items
    - **Property 61: CRUD Success Handling** - Success shows message and refreshes
    - **Validates: Requirements 14.1, 14.5**

- [x] 15. Frontend error and success messaging
  - [ ] 15.1 Create toast notification component
    - Display success messages with green styling
    - Display error messages with red styling
    - Auto-dismiss success messages after 3 seconds
    - Allow manual dismiss for error messages
    - _Requirements: 15.1, 15.4, 15.5_

  - [ ] 15.2 Integrate notifications throughout the app
    - Show notifications for all API operations
    - Handle network errors with user-friendly messages
    - Extract error messages from API responses
    - _Requirements: 15.2, 15.3_

  - [ ]* 15.3 Write property tests for error handling
    - **Property 62: API Error Display** - Failed requests show error messages
    - **Property 63: Success Message Display** - Successful requests show success
    - **Property 64: Network Error Handling** - Network errors show friendly message
    - **Property 65: Success Message Auto-Dismiss** - Success dismisses after 3s
    - **Property 66: Error Message Manual Dismiss** - Errors can be dismissed manually
    - **Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5**

- [ ] 16. Checkpoint - Frontend functionality complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Documentation and deployment preparation
  - [ ] 17.1 Write comprehensive README.md
    - Add project overview and features list
    - Document technology stack
    - Add prerequisites (Docker, docker-compose)
    - Write step-by-step setup instructions
    - Document how to obtain Google OAuth credentials
    - Document how to obtain Telegram OAuth credentials
    - Add instructions for running with docker-compose
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

  - [ ] 17.2 Document architecture and design decisions
    - Add database schema diagrams or descriptions
    - Document API endpoints or link to Swagger docs
    - Explain Redis caching strategy and invalidation
    - Describe Docker architecture and container networking
    - Discuss scalability considerations (load balancing, microservices)
    - _Requirements: 18.6, 18.7, 18.8, 18.9, 19.7, 19.8_

  - [ ] 17.3 Finalize environment configuration
    - Verify .env.example has all required variables
    - Add detailed comments for each variable
    - Document default values and examples
    - Reference .env.example in README setup section
    - _Requirements: 18A.8_

  - [ ] 17.4 Add graceful shutdown handling
    - Implement shutdown hooks in NestJS
    - Close database connections gracefully
    - Close Redis connections gracefully
    - Handle SIGTERM and SIGINT signals
    - _Requirements: 20.22_


- [ ] 18. Testing and quality assurance
  - [ ] 18.1 Set up testing infrastructure
    - Configure Jest for backend with TypeScript
    - Configure Jest/Vitest for frontend with React Testing Library
    - Install fast-check for property-based testing
    - Set up test database configuration
    - Create test fixtures and mock data
    - _Requirements: Testing Strategy_

  - [ ] 18.2 Run all property-based tests
    - Execute all backend property tests (100 iterations each)
    - Execute all frontend property tests (100 iterations each)
    - Verify all properties pass
    - Document any failing cases and fix
    - _Requirements: All Property Tests_

  - [ ] 18.3 Verify test coverage
    - Run coverage report for backend (target >80% line coverage)
    - Run coverage report for frontend (target >70% component coverage)
    - Identify untested critical paths
    - Add additional tests if needed
    - _Requirements: Testing Strategy_

  - [ ] 18.4 Manual testing checklist
    - Test complete registration flow
    - Test email/password login flow
    - Test Google OAuth flow (if credentials available)
    - Test Telegram OAuth flow (if credentials available)
    - Test CRUD operations for items
    - Test admin-only endpoints
    - Test error handling and validation
    - Test logout and session management
    - _Requirements: All Requirements_

- [ ] 19. Final integration and deployment
  - [ ] 19.1 Build and test Docker containers
    - Build all Docker images
    - Start services with docker-compose up
    - Verify all services start successfully
    - Check service health and connectivity
    - Test API endpoints through Docker network
    - _Requirements: 20.15_

  - [ ] 19.2 Verify production readiness
    - Check all environment variables configured
    - Verify security headers in responses
    - Test rate limiting functionality
    - Verify CORS configuration
    - Check error logging and monitoring hooks
    - Verify database migrations applied
    - _Requirements: 17.1, 17.3, 17.4_

  - [ ] 19.3 Performance and load testing (optional)
    - Test API throughput and response times
    - Verify cache effectiveness
    - Test concurrent user sessions
    - Identify and document bottlenecks
    - _Requirements: Testing Strategy_

- [ ] 20. Final checkpoint - Project complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at major milestones
- Property tests validate universal correctness properties using fast-check
- The implementation follows a bottom-up approach: infrastructure → backend → frontend
- All services are containerized for consistent deployment across environments
- OAuth integration requires obtaining credentials from Google and Telegram before testing
- The 3-day timeline assumes focused work with prior NestJS/Next.js experience
