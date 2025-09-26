# Better Auth Setup Guide

## Environment Variables Setup

Create a `.env` file in the root of your project with the following variables:

```env
# Database
DATABASE_URL=your_neon_database_url_here

# Better Auth Configuration
BETTER_AUTH_SECRET=your-super-secret-key-here-at-least-32-characters-long
BETTER_AUTH_URL=http://localhost:3000

# Optional: Social providers (uncomment and configure as needed)
# GITHUB_CLIENT_ID=your_github_client_id
# GITHUB_CLIENT_SECRET=your_github_client_secret
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Generate a Secret Key

You can generate a secure secret key using one of these methods:

1. **OpenSSL** (if available):

   ```bash
   openssl rand -hex 32
   ```

2. **Node.js**:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Online Generator**: Use a secure random string generator (ensure it's at least 32 characters long)

## Database Migration

After setting up your environment variables, run the migration to create the authentication tables:

```bash
# Generate migration files (already done)
npx drizzle-kit generate

# Apply the migration to your database
npx drizzle-kit migrate
```

## Social Providers (Optional)

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env` file

### Google OAuth Setup

1. Go to Google Cloud Console > APIs & Services > Credentials
2. Create OAuth 2.0 Client IDs
3. Set authorized redirect URIs to: `http://localhost:3000/api/auth/callback/google`
4. Copy the Client ID and Client Secret to your `.env` file

## Features Implemented

- ✅ Email/Password authentication
- ✅ User registration and login
- ✅ Session management
- ✅ User profile display
- ✅ Sign out functionality
- ✅ Database integration with Drizzle ORM
- ✅ Social provider support (GitHub, Google) - requires configuration
- ✅ Responsive authentication UI

## Usage

1. Navigate to the Account tab in your app
2. Click "Sign In" to open the authentication modal
3. Toggle between "Sign In" and "Create Account"
4. Fill in your credentials and submit
5. Once authenticated, you'll see your profile information

The authentication state is managed globally and will persist across page refreshes.
