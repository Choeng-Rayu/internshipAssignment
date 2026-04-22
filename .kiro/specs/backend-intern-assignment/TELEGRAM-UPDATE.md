# Telegram Login Implementation Update

## Summary

Updated the design to use the **official Telegram Login Widget** following the OpenID Connect (OIDC) standard as documented at https://core.telegram.org/bots/telegram-login.

## Key Changes

### 1. Authentication Flow Change

**OLD (Passport Strategy Approach)**:
- Backend redirects to Telegram OAuth
- Telegram redirects back to backend callback
- Backend validates auth data with bot token
- Backend generates JWT

**NEW (Official Widget Approach)**:
- Frontend loads Telegram Login Widget library
- Widget opens popup for user authorization
- Widget receives ID token (JWT) from Telegram
- Frontend sends ID token to backend for verification
- Backend validates JWT signature using Telegram's JWKS
- Backend generates application JWT

### 2. Backend Architecture Changes

**Removed**:
- `telegram.strategy.ts` (Passport strategy)
- GET `/api/v1/auth/telegram` endpoint
- GET `/api/v1/auth/telegram/callback` endpoint

**Added**:
- `telegram-auth.service.ts` - ID token validation service
- `telegram-jwks.service.ts` - JWKS key fetching/caching
- `telegram-verify.dto.ts` - DTO for ID token verification
- POST `/api/v1/auth/telegram/verify` endpoint

### 3. Frontend Implementation

**Widget Integration**:
```html
<script async src="https://oauth.telegram.org/js/telegram-login.js?3" 
        data-client-id="YOUR_BOT_ID" 
        data-onauth="handleTelegramAuth" 
        data-request-access="write">
</script>
<button class="tg-auth-button">Sign In with Telegram</button>
```

**JavaScript Callback**:
```typescript
function handleTelegramAuth(data: { id_token: string, user: TelegramUser }) {
  // Send id_token to backend for verification
  const response = await apiClient.post('/api/v1/auth/telegram/verify', {
    id_token: data.id_token
  });
  
  // Store application JWT and redirect
  localStorage.setItem('auth_token', response.data.access_token);
  router.push('/dashboard');
}
```

### 4. Security Improvements

**JWT Signature Verification**:
- Fetch public keys from Telegram JWKS endpoint
- Verify token signature using `jose` library
- Validate issuer: `https://oauth.telegram.org`
- Validate audience: Bot ID (Client ID)
- Validate expiration timestamp

**JWKS Caching**:
- Cache public keys in Redis (TTL: 1 hour)
- Automatic key rotation support
- Fallback to fresh fetch if verification fails

### 5. Database Schema Update

**Added Field**:
- `telegramName` - User's display name from Telegram

**Updated Field Descriptions**:
- `telegramOauthId` - Now stores the `sub` claim from ID token (Telegram user ID)
- `telegramUsername` - Stores the `preferred_username` claim (@username)

### 6. Environment Variables

**Required**:
- `TELEGRAM_BOT_ID` - Bot ID (Client ID) from @BotFather
- `TELEGRAM_BOT_TOKEN` - Bot token (optional, only if using Bot API features)

**Optional** (for advanced OIDC flow):
- `TELEGRAM_CLIENT_SECRET` - Client secret from @BotFather

### 7. Dependencies

**Backend**:
- `jose` - JWT verification and JWKS handling
- Remove: `passport-telegram-official` (no longer needed)

**Frontend**:
- Telegram Login Widget library (loaded via CDN)

## Benefits of New Approach

1. **Standards-Based**: Uses OpenID Connect, a widely adopted standard
2. **Better Security**: Cryptographic JWT verification instead of hash validation
3. **Simpler Backend**: No need for Passport strategy, just JWT verification
4. **Better UX**: Popup-based flow instead of full page redirects
5. **Future-Proof**: Compatible with OIDC libraries and identity brokers

## Migration Notes

### For Backend Developers

1. Install `jose` library: `npm install jose`
2. Remove `passport-telegram-official` dependency
3. Create `TelegramAuthService` for ID token validation
4. Create `TelegramJwksService` for key management
5. Update `AuthController` with new `/verify` endpoint
6. Remove old Telegram strategy and callback endpoint

### For Frontend Developers

1. Add Telegram Login Widget script to login page
2. Implement `handleTelegramAuth` callback function
3. Send ID token to backend `/api/v1/auth/telegram/verify`
4. Handle response and store application JWT
5. Remove old redirect-based Telegram OAuth flow

### For DevOps

1. Update environment variables in `.env` files
2. Ensure `TELEGRAM_BOT_ID` is set (get from @BotFather)
3. Register allowed URLs in @BotFather (Bot Settings > Web Login)
4. Update documentation with new setup instructions

## Testing Checklist

- [ ] Widget loads correctly on login page
- [ ] Clicking button opens Telegram authorization popup
- [ ] Successful authorization returns ID token
- [ ] Backend validates ID token signature
- [ ] Backend verifies issuer and audience
- [ ] Backend creates/authenticates user correctly
- [ ] Application JWT is generated and returned
- [ ] Frontend stores token and redirects to dashboard
- [ ] Error handling works for invalid tokens
- [ ] JWKS caching works correctly

## References

- Official Documentation: https://core.telegram.org/bots/telegram-login
- OIDC Discovery: https://oauth.telegram.org/.well-known/openid-configuration
- JWKS Endpoint: https://oauth.telegram.org/.well-known/jwks.json
- Widget Library: https://oauth.telegram.org/js/telegram-login.js

## Example Widget Configuration

```html
<script async 
  src="https://oauth.telegram.org/js/telegram-login.js?3" 
  data-client-id="8764946066"
  data-onauth="handleTelegramAuth"
  data-request-access="write">
</script>
<button class="tg-auth-button">Sign In with Telegram</button>

<script>
function handleTelegramAuth(data) {
  console.log('ID Token:', data.id_token);
  console.log('User:', data.user);
  // Send to backend for verification
}
</script>
```

## Next Steps

1. Update requirements.md with new Telegram flow details
2. Update tasks-backend.md with new implementation tasks
3. Update tasks-frontend.md with widget integration tasks
4. Update TASK-ALIGNMENT.md with new flow
5. Test implementation end-to-end
