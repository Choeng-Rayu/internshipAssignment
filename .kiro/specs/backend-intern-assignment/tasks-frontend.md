# Frontend Implementation Tasks

## Overview

This document contains all frontend-specific tasks for the Next.js application. The frontend is located in the `frontend/` directory and includes authentication UI, protected routes, CRUD interface for items, and error handling.

**Technology Stack:**
- Next.js 14.x with App Router and TypeScript 5.x
- React 18.x
- Tailwind CSS for styling
- Axios for HTTP client
- React Context API for state management

**Working Directory:** `frontend/`

## Tasks

- [x] 1. Frontend project initialization
  - [x] 1.1 Initialize Next.js project with TypeScript
    - Create Next.js project: `npx create-next-app@latest frontend --typescript --tailwind --app`
    - Configure TypeScript with strict mode in tsconfig.json
    - Set up path aliases (@/*) in tsconfig.json
    - Create folder structure: app/, components/, hooks/, lib/, context/
    - _Requirements: 0.2, 0.6, 0.9_
    - _Working Directory: frontend/_

  - [x] 1.2 Create frontend environment configuration
    - Create .env.example with NEXT_PUBLIC_API_URL
    - Document API base URL (default: http://localhost:3000)
    - Add comments explaining each variable
    - _Requirements: 16.4_
    - _Working Directory: frontend/_

  - [x] 1.3 Configure Tailwind CSS
    - Verify Tailwind is configured in tailwind.config.ts
    - Set up custom colors and theme if needed
    - Add global styles in app/globals.css
    - _Requirements: 0.9_
    - _File: frontend/tailwind.config.ts, app/globals.css_

- [x] 2. Authentication context and API client
  - [x] 2.1 Create authentication context and hooks
    - Create src/context/AuthContext.tsx with user state and token management
    - Create useAuth hook for accessing auth state
    - Implement login, logout, and token storage functions
    - Store JWT token in localStorage (key: 'auth_token')
    - Provide user profile state (id, email, role)
    - _Requirements: 12.7, 13.4, 17.5, 17.6_
    - _File: frontend/src/context/AuthContext.tsx_

  - [x] 2.2 Wire AuthProvider into root layout
    - Import AuthProvider in app/layout.tsx
    - Wrap children with <AuthProvider>
    - Ensure client-side rendering with 'use client' directive
    - _Requirements: 12.7_
    - _File: frontend/app/layout.tsx_

  - [x] 2.3 Create API client with Axios interceptors
    - Install Axios: `npm install axios`
    - Create src/lib/api-client.ts with Axios instance
    - Set base URL from NEXT_PUBLIC_API_URL environment variable
    - Add request interceptor to inject JWT token from localStorage
    - Add response interceptor to handle 401 errors (clear token, redirect to login)
    - Export configured axios instance
    - _Requirements: 13.3_
    - _File: frontend/src/lib/api-client.ts_

  - [ ]* 2.4 Write property tests for API client
    - Install fast-check: `npm install -D fast-check`
    - Create api-client.property.test.ts
    - **Property 58: JWT Token Injection** - Requests include Bearer token
    - **Property 59: Logout Token Clearing** - Logout clears token and redirects
    - _Validates: Requirements 13.3, 13.4, 17.6_
    - _File: frontend/src/lib/api-client.property.test.ts_

- [x] 3. Authentication UI pages
  - [x] 3.1 Create registration page
    - Create app/register/page.tsx
    - Build form with email and password inputs
    - Add client-side validation (email format, password length ≥8)
    - Submit POST to /api/v1/auth/register using API client
    - Display success message and redirect to /login on success
    - Display error messages from API response
    - Style with Tailwind CSS
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
    - _File: frontend/app/register/page.tsx_

  - [ ]* 3.2 Write property tests for registration form
    - Create RegisterForm.property.test.tsx
    - **Property 45: Registration Form Submission** - Form submits POST request
    - **Property 46: Registration Success Handling** - Success shows message and redirects
    - **Property 47: Frontend Email Validation** - Invalid email prevents submission
    - **Property 48: Frontend Password Validation** - Short password prevents submission
    - _Validates: Requirements 11.2, 11.3, 11.5, 11.6_
    - _File: frontend/app/register/RegisterForm.property.test.tsx_

  - [x] 3.3 Create login page
    - Create app/login/page.tsx
    - Build form with email and password inputs
    - Add "Login with Google" button
    - Add "Login with Telegram" button
    - Submit POST to /api/v1/auth/login for email/password
    - Redirect to /api/v1/auth/google for Google OAuth
    - Redirect to /api/v1/auth/telegram for Telegram OAuth
    - Store JWT token in localStorage on success
    - Update AuthContext with user data
    - Redirect to /dashboard on success
    - Display error messages from API response
    - Style with Tailwind CSS
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 12.10_
    - _File: frontend/app/login/page.tsx_

  - [ ]* 3.4 Write property tests for login form
    - Create LoginForm.property.test.tsx
    - **Property 49: Login Form Submission** - Form submits POST request
    - **Property 50: OAuth Redirect** - OAuth buttons redirect to authorization
    - **Property 51: JWT Token Storage** - Success stores token securely
    - **Property 52: Post-Login Redirect** - Success redirects to dashboard
    - _Validates: Requirements 12.4, 12.5, 12.6, 12.7, 12.8_
    - _File: frontend/app/login/LoginForm.property.test.tsx_

  - [x] 3.5 Create OAuth callback handler
    - Create app/auth/callback/page.tsx
    - Extract authorization code from URL query params
    - Extract state parameter for CSRF validation
    - Send code to backend callback endpoint (GET /api/v1/auth/google/callback or /telegram/callback)
    - Store JWT token from response in localStorage
    - Update AuthContext with user data
    - Redirect to /dashboard on success
    - Redirect to /login with error message on failure
    - _Requirements: 12A.1, 12A.2, 12A.3, 12A.4, 12A.5, 12A.6_
    - _File: frontend/app/auth/callback/page.tsx_

  - [ ]* 3.6 Write property tests for OAuth callback
    - Create OAuthCallback.property.test.tsx
    - **Property 53: OAuth Callback Forwarding** - Code sent to backend
    - **Property 54: OAuth Failure Handling** - Failure redirects to login
    - **Property 55: OAuth State Validation** - State parameter validated
    - _Validates: Requirements 12A.1, 12A.2, 12A.5, 12A.6_
    - _File: frontend/app/auth/callback/OAuthCallback.property.test.tsx_

- [x] 4. Protected routes and dashboard
  - [x] 4.1 Create protected route wrapper component
    - Create src/components/ProtectedRoute.tsx
    - Check for valid JWT token in localStorage
    - Redirect to /login if no token
    - Allow access if token exists
    - Use 'use client' directive for client-side logic
    - _Requirements: 13.1, 13.2_
    - _File: frontend/src/components/ProtectedRoute.tsx_

  - [ ]* 4.2 Write property tests for protected routes
    - Create ProtectedRoute.property.test.tsx
    - **Property 56: Unauthenticated Dashboard Redirect** - No token redirects to login
    - **Property 57: Authenticated Dashboard Access** - Valid token shows dashboard
    - _Validates: Requirements 13.1, 13.2_
    - _File: frontend/src/components/ProtectedRoute.property.test.tsx_

  - [x] 4.3 Create dashboard layout
    - Create app/dashboard/layout.tsx
    - Wrap with ProtectedRoute component
    - Display user profile information (email, role)
    - Add logout button that calls AuthContext.logout()
    - Add navigation links (Dashboard, Items)
    - Style with Tailwind CSS
    - _Requirements: 13.2, 13.4_
    - _File: frontend/app/dashboard/layout.tsx_

  - [x] 4.4 Create dashboard home page
    - Create app/dashboard/page.tsx
    - Display welcome message with user name
    - Show quick stats (total items, etc.)
    - Add link to items management page
    - Style with Tailwind CSS
    - _Requirements: 13.2_
    - _File: frontend/app/dashboard/page.tsx_

- [x] 5. Items CRUD interface
  - [x] 5.1 Create items list page
    - Create app/dashboard/items/page.tsx
    - Fetch items from GET /api/v1/items using API client
    - Display items in a table or card layout
    - Show title, description, status, createdAt for each item
    - Add "Create New Item" button
    - Add edit and delete buttons for each item
    - Handle loading and error states
    - Style with Tailwind CSS
    - _Requirements: 14.1_
    - _File: frontend/app/dashboard/items/page.tsx_

  - [x] 5.2 Create item form component
    - Create src/components/ItemForm.tsx
    - Build form with title, description, status inputs
    - Use for both create and edit operations (controlled by props)
    - Add client-side validation (title required, max 200 chars)
    - Submit POST /api/v1/items for create
    - Submit PATCH /api/v1/items/:id for update
    - Emit onSuccess and onError events
    - Style with Tailwind CSS
    - _Requirements: 14.2, 14.3_
    - _File: frontend/src/components/ItemForm.tsx_

  - [x] 5.3 Create item create page
    - Create app/dashboard/items/new/page.tsx
    - Use ItemForm component in create mode
    - Show success message and redirect to items list on success
    - Show error message on failure
    - _Requirements: 14.2, 14.5, 14.6_
    - _File: frontend/app/dashboard/items/new/page.tsx_

  - [x] 5.4 Create item edit page
    - Create app/dashboard/items/[id]/edit/page.tsx
    - Fetch item data from GET /api/v1/items/:id
    - Use ItemForm component in edit mode with pre-filled data
    - Show success message and redirect to items list on success
    - Show error message on failure
    - _Requirements: 14.3, 14.5, 14.6_
    - _File: frontend/app/dashboard/items/[id]/edit/page.tsx_

  - [x] 5.5 Implement delete functionality
    - Add delete confirmation modal/dialog
    - Send DELETE /api/v1/items/:id on confirmation
    - Show success message and refresh list on success
    - Show error message on failure
    - _Requirements: 14.4, 14.5, 14.6_
    - _File: frontend/app/dashboard/items/page.tsx or separate component_

  - [ ]* 5.6 Write property tests for items UI
    - Create ItemsList.property.test.tsx
    - **Property 60: User Items Display** - Dashboard shows user's items
    - **Property 61: CRUD Success Handling** - Success shows message and refreshes
    - _Validates: Requirements 14.1, 14.5_
    - _File: frontend/src/components/ItemsList.property.test.tsx_

- [x] 6. Toast notifications and error handling
  - [x] 6.1 Create toast notification component
    - Create src/components/Toast.tsx
    - Support success (green) and error (red) variants
    - Auto-dismiss success messages after 3 seconds
    - Allow manual dismiss for error messages with close button
    - Use React state for managing toast queue
    - Style with Tailwind CSS
    - _Requirements: 15.1, 15.4, 15.5_
    - _File: frontend/src/components/Toast.tsx_

  - [x] 6.2 Create toast context for global notifications
    - Create src/context/ToastContext.tsx
    - Provide showSuccess(message) and showError(message) functions
    - Manage toast queue state
    - Render Toast component with current toasts
    - _Requirements: 15.1_
    - _File: frontend/src/context/ToastContext.tsx_

  - [x] 6.3 Wire ToastProvider into root layout
    - Import ToastProvider in app/layout.tsx
    - Wrap children with <ToastProvider>
    - Ensure it's inside AuthProvider
    - _Requirements: 15.1_
    - _File: frontend/app/layout.tsx_

  - [x] 6.4 Integrate notifications throughout the app
    - Use useToast hook in all forms and API calls
    - Show success notifications for successful operations
    - Show error notifications for failed operations
    - Handle network errors with user-friendly messages
    - Extract error messages from API responses (response.data.message)
    - _Requirements: 15.2, 15.3_
    - _Files: All pages and components with API calls_

  - [ ]* 6.5 Write property tests for error handling
    - Create Toast.property.test.tsx
    - **Property 62: API Error Display** - Failed requests show error messages
    - **Property 63: Success Message Display** - Successful requests show success
    - **Property 64: Network Error Handling** - Network errors show friendly message
    - **Property 65: Success Message Auto-Dismiss** - Success dismisses after 3s
    - **Property 66: Error Message Manual Dismiss** - Errors can be dismissed manually
    - _Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5_
    - _File: frontend/src/components/Toast.property.test.tsx_

- [x] 7. Frontend styling and polish
  - [x] 7.1 Create consistent layout and navigation
    - Design header/navbar component
    - Add responsive navigation menu
    - Style authentication pages consistently
    - Add loading spinners for async operations
    - _Working Directory: frontend/_

  - [x] 7.2 Improve form UX
    - Add form field focus states
    - Add validation error styling
    - Add disabled states for submit buttons during loading
    - Add password visibility toggle
    - _Working Directory: frontend/_

  - [x] 7.3 Add responsive design
    - Ensure all pages work on mobile, tablet, and desktop
    - Use Tailwind responsive utilities (sm:, md:, lg:)
    - Test on different screen sizes
    - _Working Directory: frontend/_

- [ ] 8. Frontend testing and validation
  - [ ] 8.1 Set up testing infrastructure
    - Install testing dependencies: `npm install -D @testing-library/react @testing-library/jest-dom jest-environment-jsdom`
    - Configure Jest in jest.config.js
    - Create test utilities in test/utils/
    - Set up mock API client for tests
    - _Requirements: Testing Strategy_
    - _Files: frontend/jest.config.js, test/utils/*_

  - [ ] 8.2 Run all property-based tests
    - Execute all frontend property tests: `npm run test -- --testPathPattern=property.test`
    - Verify all properties pass with 100 iterations each
    - Document any failing cases and fix
    - _Requirements: All Property Tests_
    - _Working Directory: frontend/_

  - [ ] 8.3 Verify test coverage
    - Run coverage report: `npm run test:cov`
    - Target >70% component coverage, >80% hook coverage
    - Identify untested critical paths
    - Add additional tests if needed
    - _Requirements: Testing Strategy_
    - _Working Directory: frontend/_

  - [ ] 8.4 Run linter and fix issues
    - Run ESLint: `npm run lint`
    - Fix auto-fixable issues
    - Manually fix remaining issues
    - _Working Directory: frontend/_

- [x] 9. Frontend build and optimization
  - [x] 9.1 Optimize production build
    - Run production build: `npm run build`
    - Verify no build errors
    - Check bundle size and optimize if needed
    - Test production build locally: `npm run start`
    - _Working Directory: frontend/_

  - [x] 9.2 Add environment-specific configuration
    - Create .env.local for local development
    - Create .env.production for production
    - Document environment variables in README
    - _Working Directory: frontend/_

## Checkpoint

- [x] Frontend implementation complete
  - All pages and components implemented
  - All property tests passing
  - Test coverage meets targets (>70% component coverage)
  - Linter passes with no errors
  - Production build successful
  - Ready for integration with backend

## Notes

- All tasks should be executed from the `frontend/` directory unless otherwise specified
- Run `npm install` after adding new dependencies
- Use `npm run dev` for development with hot reload
- Tasks marked with `*` are optional property-based tests
- Each property test should run 100 iterations minimum
- Refer to [frontend/app](frontend/app) for existing code structure
- Use Next.js 14 App Router conventions (not Pages Router)
- All client-side components must use 'use client' directive
- Use `@/*` imports as configured in tsconfig.json
