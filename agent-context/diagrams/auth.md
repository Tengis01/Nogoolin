# Flow: Google OAuth Sign-In

> Regenerated from `docs/05-sequence-diagrams.md` SEQ-001 (labels updated
> Express → Fastify per finalized stack). Ref: UC-A-002, FR-AUTH-002/004/010.

```mermaid
sequenceDiagram
    actor User
    participant Web as Web/Mobile Client
    participant SBAuth as Supabase Auth
    participant Google
    participant DB as Supabase PostgreSQL

    User->>Web: Click "Sign in with Google"
    Web->>SBAuth: signInWithOAuth(provider: 'google', PKCE)
    SBAuth->>Google: Redirect to consent screen
    Google->>User: Show consent screen
    User->>Google: Grant permission
    Google->>SBAuth: Redirect with authorization code
    SBAuth->>SBAuth: Exchange code for tokens (PKCE verify)
    SBAuth->>DB: INSERT INTO auth.users (if new)
    DB->>DB: Trigger on_auth_user_created fires
    DB->>DB: INSERT INTO public.users (id, email, full_name, role='customer')
    SBAuth-->>Web: Return JWT access_token + refresh_token
    Web->>Web: Store tokens (httpOnly cookie / secure storage)
    Web->>User: Redirect to home page or /admin/dashboard
```

**Key facts:**
- Admin role is NEVER set via OAuth — first admin promoted by direct SQL
  (docs/09 §9), subsequent admins via `PATCH /admin/users/{id}` by an existing admin.
- Mobile (RN + Expo) uses native `signInWithIdToken` via
  `@react-native-google-signin` — not WebView; same DB trigger applies.
- Tokens: 15-min access JWT, refresh rotation + reuse detection enabled
  (NFR-SEC-013).
