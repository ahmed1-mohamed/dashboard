# Environment Configuration Guide

## Required Environment Variables

This guide shows how to configure your `.env` file for authentication and Firebase Cloud Messaging.

## Step 1: Create or Update .env File

Create a `.env` file in the root of your project (`d:\new\dashboard3\p-adviser_dashboard\.env`) with the following variables:

### NextAuth Configuration

```env
# NextAuth base URL (your app URL)
NEXTAUTH_URL=http://localhost:3000

# NextAuth secret (generate a random string)
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-secret-here
```

### Backend API Configuration

```env
# Your backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/dashboard
NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD=http://localhost:8000/api
```

> **IMPORTANT**: Replace `http://localhost:8000` with your actual backend API URL

### Firebase Cloud Messaging (Optional but Recommended)

To get Firebase credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings → General
4. Scroll down to "Your apps" and click the web icon (</>)
5. Register your app and copy the config values

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123
```

To get the VAPID key:

1. In Firebase Console, go to Project Settings → Cloud Messaging
2. Under "Web configuration" → "Web Push certificates"
3. Click "Generate key pair"
4. Copy the key

```env
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key-here
```

## Step 2: Update Firebase Service Worker

Edit `public/firebase-messaging-sw.js` and replace the placeholder values with your actual Firebase config:

```javascript
firebase.initializeApp({
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
});
```

## Step 3: Restart Development Server

After updating `.env`, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## Testing

1. **Check Service Worker**: Navigate to `http://localhost:3000/firebase-messaging-sw.js` - should return 200 OK
2. **Test Login**: Try logging in with valid credentials
3. **Check FCM Token**: Open browser console and look for "FCM Token:" log
4. **Grant Permissions**: Allow notification permissions when prompted

## Troubleshooting

### 404 on firebase-messaging-sw.js

- Ensure the file exists in the `public` folder
- Restart dev server

### Login not working

- Check backend API is running
- Verify `NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD` is correct
- Check browser console and terminal for error messages

### FCM token not generated

- Check Firebase credentials are correct
- Ensure VAPID key is configured
- Check browser console for Firebase errors
- Grant notification permissions
