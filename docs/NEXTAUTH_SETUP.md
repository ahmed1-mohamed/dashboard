# NextAuth Setup Guide

Complete NextAuth authentication has been configured for your project! 🎉

## 📁 Files Created

### Authentication Configuration

- **`src/app/api/auth/[...nextauth]/route.ts`** - NextAuth route handler
- **`src/app/api/auth/[...nextauth]/auth-options.ts`** - Main auth configuration
- **`src/app/api/auth/[...nextauth]/pages-options.ts`** - Custom page routes

### Utilities

- **`src/lib/refresh-token.ts`** - Token refresh logic
- **`src/types/next-auth.d.ts`** - TypeScript type definitions

## 🚀 Features Implemented

✅ **Multiple Authentication Providers:**

- Email/Password (Credentials)
- Google OAuth
- Apple OAuth
- Facebook OAuth

✅ **Advanced Features:**

- Automatic token refresh
- JWT session management
- Custom user data handling
- Developer relationship tracking
- FCM token support for push notifications

## ⚙️ Environment Variables Setup

Add these to your `.env` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/dashboard
NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD=http://localhost:8000/api

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple OAuth (optional)
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret

# Facebook OAuth (optional)
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this Node.js command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📦 Required Dependencies

Make sure you have these installed:

```bash
npm install next-auth
```

If not installed, run:

```bash
npm install next-auth@latest
```

## 🔧 Usage Examples

### 1. **Sign In (Client Component)**

```tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        alert("Login failed: " + result.error);
      } else {
        // Redirect to dashboard
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### 2. **Sign In with OAuth Providers**

```tsx
"use client";

import { signIn } from "next-auth/react";

export default function OAuthButtons() {
  return (
    <div>
      <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
        Sign in with Google
      </button>

      <button onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}>
        Sign in with Facebook
      </button>

      <button onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}>
        Sign in with Apple
      </button>
    </div>
  );
}
```

### 3. **Get Session (Client Component)**

```tsx
"use client";

import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {session?.user?.name}!</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Role ID: {session?.user?.role_id}</p>
      <p>Access Token: {session?.user?.accessToken}</p>
    </div>
  );
}
```

### 4. **Get Session (Server Component)**

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export default async function ServerProfile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

### 5. **Sign Out**

```tsx
"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
  );
}
```

### 6. **Protected Route (Middleware)**

Create `src/middleware.ts`:

```typescript
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
```

### 7. **Use Token in API Calls**

```tsx
"use client";

import { useSession } from "next-auth/react";
import { fetchProjects } from "@/data/api-client";

export default function ProjectsList() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const loadProjects = async () => {
    if (!token) return;
    const projects = await fetchProjects(token);
  };

  return <button onClick={loadProjects}>Load Projects</button>;
}
```

## 🎨 Session Provider Setup

Make sure your root layout includes the SessionProvider:

```tsx
// src/app/layout.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

Or create a separate provider component:

```tsx
// src/components/providers/session-provider.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

Then use it in your layout:

```tsx
// src/app/layout.tsx
import AuthProvider from "@/components/providers/session-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

## 🔒 Token Refresh

The token refresh is automatic! The system will:

- Check token expiry every time the JWT callback runs
- Refresh tokens that expire in less than 5 minutes
- Update the session with new tokens
- Handle refresh failures gracefully

You can see the refresh logic in `src/lib/refresh-token.ts`.

## 🧪 Testing the Setup

### 1. Start your development server:

```bash
npm run dev
```

### 2. Test the authentication endpoints:

- Sign in: `http://localhost:3000/api/auth/signin`
- Sign out: `http://localhost:3000/api/auth/signout`

### 3. Check session data:

```tsx
import { useSession } from "next-auth/react";

const { data: session } = useSession();
console.log(session);
```

## 📝 Custom Pages

The configuration references custom auth pages. Create them if needed:

- `/auth/signin` - Sign-in page
- `/auth/signout` - Sign-out confirmation
- `/auth/error` - Error display page
- `/auth/verify-request` - Email verification

Or update `pages-options.ts` to use NextAuth default pages by removing entries.

## 🛠️ Troubleshooting

### Issue: "NEXTAUTH_SECRET not defined"

**Solution:** Add `NEXTAUTH_SECRET` to your `.env` file

### Issue: "Invalid callback URL"

**Solution:** Make sure `NEXTAUTH_URL` matches your application URL

### Issue: OAuth provider error

**Solution:** Verify your OAuth client IDs and secrets are correct

### Issue: Token not refreshing

**Solution:** Check that your API's `/auth/refresh` endpoint is working

### Issue: Session is null

**Solution:** Make sure SessionProvider wraps your app in the layout

## 🎯 Next Steps

1. ✅ Add environment variables to `.env`
2. ✅ Generate `NEXTAUTH_SECRET`
3. ✅ Wrap your app with `SessionProvider`
4. ✅ Create your sign-in page at `/auth/signin`
5. ✅ Test the authentication flow
6. ✅ Set up OAuth providers (optional)

## 📚 Additional Resources

- [NextAuth Documentation](https://next-auth.js.org/)
- [Session Management](https://next-auth.js.org/configuration/options#session)
- [JWT Configuration](https://next-auth.js.org/configuration/options#jwt)
- [OAuth Providers](https://next-auth.js.org/providers/)

You're all set! 🎉 Your authentication system is ready to use!
