# ASAP KR-Sync Authentication Setup Guide

## Overview

This document outlines the setup and configuration required to enable DataSeer (KR-Sync) users to authenticate with their ASAP Hub credentials **without exposing sensitive ASAP Hub metadata** (teams, projects, working groups, etc.).

## Goals

- ✅ Allow DataSeer users to log in with existing ASAP Hub credentials (SSO)
- ✅ Support Google OAuth, ORCID, and email/password authentication
- ✅ **Prevent** sensitive ASAP Hub metadata from being included in ID tokens sent to DataSeer
- ✅ Only share basic user identity (email, name, avatar)

---

## Architecture Overview

```
User Authentication Flow:
┌─────────────────────────────────────────────────────────────────┐
│ 1. User visits DataSeer/KR-Sync app                             │
│ 2. Clicks "Log in with ASAP ID"                                 │
│ 3. Redirected to Auth0 (dev-asap-hub.us.auth0.com)              │
│ 4. Chooses auth method (Google/ORCID/Email)                     │
│ 5. Auth0 authenticates user                                     │
│ 6. Post-Login Action runs:                                      │
│    - Checks client_id/client_name                               │
│    - IF "ASAP KR-Sync" → Skip metadata (return early)           │
│    - ELSE → Fetch and add full ASAP Hub metadata                │
│ 7. ID Token generated (with or without metadata)                │
│ 8. User redirected back to app with token                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 1: Auth0 Application Setup

### 1.1 Create New Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Applications**
3. Click **Create Application**
4. Configure:
   - **Name:** `ASAP KR-Sync`
   - **Application Type:** `Single Page Application`
   - Click **Create**

### 1.2 Configure Application Settings

#### Basic Information

- **Domain:** `dev-asap-hub.us.auth0.com`
- **Client ID:** `MivJD29giPRypbiAJetSXk6dFyPvXDov` (example - yours will be different)
- Copy these values - you'll need them for your app configuration

#### Application URIs

**Allowed Callback URLs:**

```
https://your-production-domain.com/,
http://localhost:5173/
```

**Allowed Logout URLs:**

```
https://your-production-domain.com/,
http://localhost:5173/
```

**Allowed Web Origins:**

```
https://your-production-domain.com,
http://localhost:5173
```

⚠️ **Important:** Include both with and without trailing slashes.

### 1.3 Enable Connections

1. Scroll down to **Connections** tab
2. Enable:
   - ✅ **Username-Password-Authentication** (database connection)
   - ✅ **Google-OAuth2** (social connection)
   - ✅ **ORCID** (social connection)

---

## Part 2: Database Connection Configuration

### 2.1 Add KR-Sync App to Database Connection

1. Navigate to **Authentication** → **Database**
2. Click **Username-Password-Authentication**
3. Go to **Applications** tab
4. **Enable** the toggle for `ASAP KR-Sync`

⚠️ **Known Issue:** When the database connection is shared across multiple applications (ASAP Hub dev, ASAP KR-Sync, etc.), Auth0 routes authentication through the primary application (ASAP Hub dev). This means:

- Callback URLs must be configured in **both** ASAP Hub (dev) **and** ASAP KR-Sync applications
- This is an Auth0 quirk when database connections are shared
- See [Troubleshooting](#troubleshooting) section for details

---

## Part 3: Auth0 Post-Login Action Configuration

### 3.1 Locate the "Add Metadata" Action

1. Navigate to **Actions** → **Library**
2. Find the **Add Metadata** action (Trigger: `Login / Post Login`)
3. Click to edit

### 3.2 Add Client Check Logic

At the **beginning** of the `onExecutePostLogin` function, add:

```javascript
const onExecutePostLogin = async (event, api) => {
  try {
    // ✅ CHECK FOR KR-SYNC APP - SKIP METADATA
    if (event.client.name === 'ASAP KR-Sync') {
      console.log('Skipping sensitive metadata for DataSeer app.');
      return true;
    }

    // ... rest of the existing code that adds metadata
    const [apiUrl, redirect_uri] = getApiUrls(event);
    console.log(
      `requesting metadata from ${apiUrl}/webhook/users/${event.user.user_id}`,
    );

    // ... existing code continues
  } catch (err) {
    // ... error handling
  }
  return true;
};
```

### 3.3 Deploy the Action

1. Click **Deploy** (top right)
2. Verify it's deployed in the **Post-Login** flow:
   - Go to **Actions** → **Triggers** → **post-login**
   - Confirm "Add Metadata" action is in the flow
   - Verify it shows **DEPLOYED** status

---

## Part 4: Application Code Implementation (POC)

### 4.1 Environment Variables

Create `.env` file in your app:

```env

VITE_AUTH0_CLIENT_ID_KR_SYNC=MivJD29giPRypbiAJetSXk6dFyPvXDov // yours might be different

VITE_AUTH0_DOMAIN=dev-asap-hub.us.auth0.com
```

### 4.2 Auth0 Provider Setup

**File:** `src/main.tsx`

```typescript

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID_KR_SYNC;

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: `${window.location.origin}/`,
        }}
      >
        <App />
      </Auth0Provider>
    </React.StrictMode>,
  );
}
```

### 4.3 App Component (Login/Logout/User Display)

**File:** `src/App.tsx`

```typescript

import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // Check if sensitive metadata is present (for verification)
  const hasMetadata = user && user['https://dev.hub.asap.science/user'];

  return (
    <div className="container">
      {!isAuthenticated ? (
        <div className="login-card">
          <h2>Authentication Required</h2>
          <button onClick={() => loginWithRedirect()}>
            Log In with ASAP ID
          </button>
        </div>
      ) : (
        <div className="profile-card">
          <div className="profile-header">
            <img src={user?.picture} alt={user?.name} />
            <h2>Welcome, {user?.given_name}!</h2>
            <p>{user?.email}</p>
          </div>

          {/* Privacy Verification Section */}
          <div className="privacy-results">
            <h3>🔒 Privacy Verification</h3>
            {hasMetadata ? (
              <div className="alert error">
                <strong>⚠️ WARNING: SENSITIVE DATA FOUND</strong>
                <p>
                  The ID Token contains ASAP Hub metadata.
                  The filter is not working correctly.
                </p>
              </div>
            ) : (
              <div className="alert success">
                <strong>✅ SUCCESS: PRIVACY GUARANTEED</strong>
                <p>
                  No sensitive ASAP Hub metadata found in token.
                  Only basic identity information is shared.
                </p>
              </div>
            )}
          </div>

          <button onClick={() => logout({
            logoutParams: { returnTo: window.location.origin }
          })}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
```

---

## Part 5: What Gets Shared with DataSeer/KR-Sync

### ✅ Data Included in ID Token (Safe to Share)

**Actual token format (verified):**

```json
{
  "given_name": "Amin",
  "family_name": "Aimeur",
  "nickname": "amin.aimeur",
  "name": "Amin Aimeur",
  "picture": "https://lh3.googleusercontent.com/a/ACg8ocK220kHR6uhqxLDnirFQZNZN1FWcYfrKTQOroVwyjNHEsTOhgQ=s96-c",
  "updated_at": "2026-02-05T02:37:59.044Z",
  "email": "amin.aimeur@yld.com",
  "email_verified": true,
  "sub": "google-oauth2|111927471080496237229"
}
```

**Standard claims included:**

- `sub` - Unique user identifier (format: `{provider}|{provider-user-id}`)
- `email` - User's email address
- `email_verified` - Email verification status
- `name` - Full name
- `given_name` - First name
- `family_name` - Last name
- `nickname` - Username/handle
- `picture` - Profile picture URL
- `updated_at` - Last profile update timestamp

### ❌ Data NOT Included (Protected)

The following metadata is **excluded** from KR-Sync tokens:

```json
{
  "https://dev.hub.asap.science/user": {
    "id": "...",
    "teams": [...],           // EXCLUDED
    "workingGroups": [...],   // EXCLUDED
    "interestGroups": [...],  // EXCLUDED
    "projects": [...],        // EXCLUDED
    "role": "...",            // EXCLUDED
    "algoliaApiKey": "..."    // EXCLUDED
  }
}
```

---

## Part 6: Testing & Verification

### 6.1 Local Testing Setup

1. **Install dependencies:**

   ```bash
   cd apps/kr-sync-mock
   yarn install
   ```

2. **Start dev server:**

   ```bash
   yarn dev
   ```

3. **Open browser:**

   ```
   http://localhost:5173
   ```

### 6.2 Test Checklist

- [x] **Google OAuth login** works
- [x] **ORCID login** works
- [x] **Email/password login** works
- [x] After login, **green success message** appears (no metadata warning)
- [x] User profile shows: email, name, picture
- [x] User profile does NOT show: teams, projects, working groups
- [x] Logout works correctly

### 6.3 Verify Token Contents

**In browser console after login:**

```javascript
// Get the ID token

auth0.getIdTokenClaims().then((claims) => {
  console.log('ID Token Claims:', claims);

  // Check for sensitive metadata
  const hasSensitiveData = claims['https://dev.hub.asap.science/user'];
  console.log('Has sensitive metadata?', hasSensitiveData ? 'YES ⚠️' : 'NO ✅');
});
```

---

## Part 7: Production Deployment

### 7.1 Update Auth0 Callback URLs

When deploying to production, add production URLs:

**In BOTH applications:**

- ASAP Hub (dev): `xRDvgZe3Ql3LSZDs2dWQYzcohFnLyeL2`
- ASAP KR-Sync: `MivJD29giPRypbiAJetSXk6dFyPvXDov`

Add to **Allowed Callback URLs**, **Allowed Logout URLs**, **Allowed Web Origins**:

```
https://asap-kr-sync.dataseer.ai/,
https://asap-kr-sync.dataseer.ai
```

### 7.2 Environment Variables

Set production environment variables:

```env

VITE_AUTH0_CLIENT_ID_KR_SYNC=MivJD29giPRypbiAJetSXk6dFyPvXDov

VITE_AUTH0_DOMAIN=dev-asap-hub.us.auth0.com
```

### 7.3 Deploy Application

Deploy your application to production hosting (Vercel, Netlify, etc.)

---

## Part 8: Information to Share with DataSeer Team

### 8.1 Integration Details

Provide DataSeer with:

**Auth0 Configuration:**

```
Domain: dev-asap-hub.us.auth0.com

Client ID: MivJD29giPRypbiAJetSXk6dFyPvXDov

Application Name: ASAP KR-Sync

Client Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Supported Authentication Methods:**

- Google OAuth
- ORCID
- Email/Password (Username-Password-Authentication)

**Callback URL Format:**

```
https://your-dataseer-domain.com/
```

###

**ID Token will contain:**

```typescript
interface UserProfile {
  sub: string; // Unique user ID (e.g., "google-oauth2|111927471080496237229")
  email: string; // User email
  email_verified: boolean; // Email verification status
  name: string; // Full name
  given_name: string; // First name
  family_name: string; // Last name
  nickname: string; // Username/handle
  picture: string; // Avatar URL
  updated_at: string; // Last profile update (ISO 8601 timestamp)
}
```

**ID Token will NOT contain:**

- ASAP Hub team memberships
- Project associations
- Working group memberships
- Interest group memberships
- ASAP Hub roles
- Algolia API keys
- Any other ASAP-specific metadata

### 8.3 Implementation Notes for DataSeer

1. **Use the** `sub` claim as the unique user identifier
2. **Treat this as a federated identity** - users are managed by ASAP Hub
3. **Don't expect ASAP-specific metadata** - only basic OpenID Connect standard claims
4. **Token lifetime:** Access tokens expire after \~24 hours, ID tokens after \~10 hours
5. **Logout:** Users can log out from DataSeer, but they'll still be logged in to ASAP Hub (independent sessions)

---

## Troubleshooting

### Issue 1: "Callback URL mismatch" Error

**Symptom:**

```
Error: unauthorized_client

Description: Callback URL mismatch. https://your-url.com/ is not in the list of allowed callback URLs
```

**Solution:** Due to database connection routing, callback URLs must be added to **BOTH**:

1. **ASAP KR-Sync** application (`MivJD29giPRypbiAJetSXk6dFyPvXDov`)
2. **ASAP Hub (dev)** application (`xRDvgZe3Ql3LSZDs2dWQYzcohFnLyeL2`)

**Why this happens:**

- The Username-Password-Authentication database connection is shared across multiple applications
- Auth0 routes database authentication through the ASAP Hub (dev) application
- This requires callback URLs to be whitelisted in both applications

**Evidence from Auth0 logs:**

```json
{
  "client_id": "MivJD29giPRypbiAJetSXk6dFyPvXDov", // Initial request uses KR-Sync
  "client_name": "ASAP KR-Sync",
  "details": {
    "body": {
      "wctx": {
        "client_id": "xRDvgZe3Ql3LSZDs2dWQYzcohFnLyeL2" // Routes through Hub dev
      }
    }
  }
}
```

### Issue 2: Metadata Still Appearing in Token

**Symptom:** Red warning appears showing sensitive metadata is present

**Checklist:**

1. ✅ Verify the "Add Metadata" action has the client check:

   ```javascript
   if (event.client.name === 'ASAP KR-Sync') {
     return true;
   }
   ```

2. ✅ Verify the action is **DEPLOYED** (not just saved)
3. ✅ Check Auth0 Logs for any errors in the action execution
4. ✅ Verify you're using the correct Client ID in your app
5. ✅ Clear browser cache and try again

### Issue 3: Google/ORCID Work but Email/Password Doesn't

**Symptom:** Social logins work, but email/password fails with callback URL error

**Solution:**

- Ensure Username-Password-Authentication connection has ASAP KR-Sync enabled
- Add callback URLs to **both** ASAP Hub (dev) and ASAP KR-Sync applications
- Wait 30 seconds after saving Auth0 changes for propagation

### Issue 4: Environment Variables Not Loading

**Symptom:** Auth0 client ID is undefined or incorrect

**Solution:**

```bash
# Stop dev server (Ctrl+C)
# Clear Vite cache

rm -rf node_modules/.vite

# Restart dev server

yarn dev
```

### Issue 5: Logout from One App Affects Another

**Symptom:** Logging out from ASAP Hub logs you out from KR-Sync (or vice versa)

**Expected Behavior:**

- **Same browser/window:** Sessions are shared via cookies (normal behavior)
- **Different browsers:** Sessions are independent (correct isolation)

**Test properly:**

- Use separate browsers (Chrome vs Firefox)
- Or use incognito/private windows

---

## Security Considerations

### Data Privacy

- ✅ **Minimal data exposure:** Only OpenID Connect standard claims are shared
- ✅ **No ASAP-specific metadata:** Teams, projects, and roles remain private
- ✅ **Verified approach:** Auth0 Action filters metadata before token generation

### Session Management

- Each browser maintains independent Auth0 sessions
- Logging out from DataSeer doesn't affect ASAP Hub sessions
- Token lifetimes are managed by Auth0 (default: 24h access, 10h ID tokens)

### Monitoring

- Monitor Auth0 logs for failed login attempts
- Set up alerts for callback URL mismatch errors
- Track usage metrics for the ASAP KR-Sync application

---

## Maintenance

### Adding New Callback URLs

When adding new environments (staging, preview, etc.):

1. Add URL to **ASAP KR-Sync** application:
   - Allowed Callback URLs
   - Allowed Logout URLs
   - Allowed Web Origins
2. Add **same URL** to **ASAP Hub (dev)** application (due to database connection routing)
3. Test authentication from the new environment

### Updating Auth0 Actions

If you need to modify the "Add Metadata" action:

1. **Preserve the KR-Sync check:**

   ```javascript
   if (event.client.name === 'ASAP KR-Sync') {
     console.log('Skipping metadata for ASAP KR-Sync');
     return true;
   }
   ```

2. Make your changes **after** this check
3. Test thoroughly in development before deploying
4. Deploy and verify in Auth0 Logs

### Monitoring Checklist

Monthly review:

- [ ] Check Auth0 logs for unusual authentication patterns
- [ ] Verify "Add Metadata" action is still deployed and functioning
- [ ] Review callback URL configurations
- [ ] Test login flow with all authentication methods
- [ ] Verify metadata filtering is still working (green success message)

---

## References

- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 Actions Documentation](https://auth0.com/docs/customize/actions)
- [Auth0 React SDK](https://github.com/auth0/auth0-react)
- [OpenID Connect Specification](https://openid.net/specs/openid-connect-core-1_0.html)

---

## Support

For issues or questions:

1. Check Auth0 Logs: [Monitoring → Logs](https://manage.auth0.com/#/logs)
2. Review this documentation
3. Contact Auth0 Support for platform-specific issues
4. Contact ASAP Hub team for application-specific questions

---

**Document Version:** 1.0 **Last Updated:** 2026-02-05 **Maintained By:** ASAP Hub Team
