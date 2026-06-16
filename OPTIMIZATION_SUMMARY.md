# Backend Optimization for Frontend Preferences Integration

## Overview
Optimized the backend to fully support the user preferences feature added to the frontend, including language, currency, privacy settings, and theme preferences.

## Changes Made

### Backend (Express.js/Node.js)

#### 1. **Database Schema & Migrations**

**Schema Update** (`prisma/schema.prisma`):
- Added 5 new fields to the `User` model:
  - `language` (String, default: `"es-CO"`)
  - `currency` (String, default: `"COP"`)
  - `publicProfile` (Boolean, default: `true`)
  - `searchHistory` (Boolean, default: `true`)
  - `theme` (String, default: `"Claro"`)
- Added `status` field to the `Destination` model:
  - `status` (String, default: `"Borrador"`)

**Migrations Created**:
- `20260615000000_add_status_to_destination.sql` - Adds the status column to Destination table
- `20260615000001_add_preferences_to_user.sql` - Adds all preference fields to User table

#### 2. **Authentication Updates**

**File**: `src/services/auth.service.js`
- ✅ Added `changePassword(userId, currentPassword, newPassword)` method
  - Validates current password with bcrypt
  - Hashes new password
  - Updates database
- ✅ Added `formatUserForResponse(user)` helper method
  - Removes password from responses
  - Includes all fields (preferences, profile, etc.)
- Updated `register()` method to use formatter
- Updated `login()` method to use formatter

**File**: `src/controllers/auth.controller.js`
- ✅ Added `changePassword(req, res)` controller method
  - Validates input
  - Calls service
  - Returns success message

**File**: `src/routes/auth.routes.js`
- ✅ Added route: `POST /auth/me/change-password` (protected by authenticate middleware)

#### 3. **User Profile & Preferences**

**File**: `src/services/user.service.js`
- ✅ Added `updatePreferences(id, { language, currency, publicProfile, searchHistory, theme })` method
  - Validates theme values ('Claro' or 'Oscuro')
  - Allows partial updates
  - Returns updated preferences

**File**: `src/controllers/user.controller.js`
- ✅ Updated `updateProfile()` response to include all preference fields
- ✅ Updated `updateAvatar()` response to include all preference fields and user data
- ✅ Added `updatePreferences(req, res)` controller method
  - Accepts optional preference fields
  - Returns updated preferences

**File**: `src/routes/user.routes.js`
- ✅ Added route: `PATCH /users/me/preferences` (protected by authenticate middleware)

### Frontend (Angular 21)

#### 1. **Auth Service Updates**

**File**: `src/app/services/auth.service.ts`
- ✅ Extended `User` interface to include:
  ```typescript
  language?: string;          // 'es-CO', etc.
  currency?: string;          // 'COP', etc.
  publicProfile?: boolean;
  searchHistory?: boolean;
  theme?: string;             // 'Claro' | 'Oscuro'
  ```
- ✅ Updated `changePassword()` endpoint to `/auth/me/change-password`
- ✅ Added `updatePreferences()` method
  - Accepts partial preference updates
  - Persists to localStorage
  - Updates currentUser$ observable

#### 2. **Theme Service Integration**

**File**: `src/app/services/theme.service.ts`
- ✅ Added `AuthService` dependency injection
- ✅ Updated `setTheme()` to sync with backend
  - Converts 'light'/'dark' to 'Claro'/'Oscuro'
  - Calls `authService.updatePreferences()`
  - Handles errors gracefully
  - Still works offline (localStorage fallback)

#### 3. **Destination Service**

**File**: `src/app/services/destination.service.ts`
- ✅ Already includes `status` field in `Destination` interface
- No changes needed - frontend was already prepared

## API Endpoints Summary

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `POST /auth/me/change-password` - Change password ✅ NEW

### User Management
- `PATCH /users/me/profile` - Update profile (fullName, email, phone, city)
- `POST /users/me/avatar` - Upload avatar
- `PATCH /users/me/preferences` - Update preferences (language, currency, publicProfile, searchHistory, theme) ✅ NEW
- `GET /users` - Get paginated users (admin only)
- `PATCH /users/:id/status` - Update user status (admin only)

## Response Format Example

### Update Preferences Response
```json
{
  "message": "Preferencias actualizadas exitosamente.",
  "preferences": {
    "language": "es-CO",
    "currency": "COP",
    "publicProfile": true,
    "searchHistory": false,
    "theme": "Oscuro"
  }
}
```

### User Profile Response (with preferences)
```json
{
  "id": "uuid",
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "city": "Bogotá",
  "avatarUrl": "/uploads/avatars/...",
  "role": "Usuario",
  "status": "Activo",
  "language": "es-CO",
  "currency": "COP",
  "publicProfile": true,
  "searchHistory": true,
  "theme": "Claro"
}
```

## Deployment Instructions

### Backend
1. Commit changes:
   ```bash
   git add prisma/ src/
   git commit -m "feat: add preferences and password change endpoints"
   git push origin main
   ```

2. GitHub Actions will automatically:
   - Run `npx prisma migrate deploy`
   - Add the status and preference columns to the database
   - Restart the application

### Frontend
1. Commit changes:
   ```bash
   git add src/
   git commit -m "feat: integrate preferences and theme sync with backend"
   git push origin main
   ```

## Testing Checklist

- [ ] User can change password via `/auth/me/change-password`
- [ ] User can update theme preference via `/users/me/preferences`
- [ ] Theme changes sync to backend and persist
- [ ] User preferences load on login
- [ ] Language and currency preferences save correctly
- [ ] Privacy settings (publicProfile, searchHistory) persist
- [ ] All user responses include preference fields
- [ ] Database migrations run successfully on server
- [ ] Frontend localStorage works offline, syncs when online

## Technical Notes

- **Password Hashing**: Uses bcryptjs for security
- **JWT Token**: Includes user ID, name, email, role, status (preferences not in token, only in responses)
- **Offline Support**: Theme and preferences work offline, sync when connectivity restored
- **Error Handling**: Missing fields in update requests are handled gracefully
- **Database Defaults**: All preference fields have defaults for backward compatibility
- **Type Safety**: Full TypeScript types for preferences in frontend

## Files Changed

### Backend
- `prisma/schema.prisma`
- `prisma/migrations/20260615000000_add_status_to_destination/migration.sql` (NEW)
- `prisma/migrations/20260615000001_add_preferences_to_user/migration.sql` (NEW)
- `src/services/auth.service.js`
- `src/controllers/auth.controller.js`
- `src/routes/auth.routes.js`
- `src/services/user.service.js` (already had updatePreferences)
- `src/controllers/user.controller.js`
- `src/routes/user.routes.js`

### Frontend
- `src/app/services/auth.service.ts`
- `src/app/services/theme.service.ts`
- `src/app/pages/dashboard/dashboard.ts`
- `src/app/services/destination.service.ts`

## Status

✅ **Backend optimization complete**
✅ **Frontend integration complete**
✅ **Database migrations ready**
⏳ **Pending deployment to production**

Ready for testing and deployment!
