# Setup Guide

## 1. Install Node.js
Download and install Node.js (v20+) from https://nodejs.org

## 2. Install dependencies
```bash
npm install
```

## 3. Configure environment
```bash
cp .env.local.example .env.local
# Then fill in all values in .env.local
```

### 3a. Supabase
1. Create a project at https://supabase.com
2. Go to **Settings → API** and copy the URL, anon key, and service role key
3. Go to **SQL Editor** and run the contents of `supabase/schema.sql`

### 3b. Anthropic
1. Get an API key at https://console.anthropic.com/account/keys

### 3c. Google Gmail OAuth
1. Go to https://console.cloud.google.com
2. Create a project → Enable the **Gmail API**
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Authorized redirect URI: `http://localhost:3000/api/gmail/callback`
6. Copy the Client ID and Client Secret into `.env.local`

## 4. Run the app
```bash
npm run dev
```

Open http://localhost:3000

## 5. Configure Supabase Auth

### 5a. Set Site URL (required for invite links)
In Supabase dashboard → **Authentication → URL Configuration**:
- **Site URL:** `http://localhost:3000` (dev) / `https://yourdomain.vercel.app` (prod)
- **Redirect URLs:** add `http://localhost:3000/auth/callback` and `https://yourdomain.vercel.app/auth/callback`

### 5b. Disable public sign-ups (invite-only)
In Supabase dashboard → **Authentication → Providers → Email**:
- Turn OFF **"Enable sign ups"**

### 5c. Invite team members
In Supabase dashboard → **Authentication → Users → Invite user**:
- Enter their email + full name (the name shown in the app)
- They receive an email with a link → they click it → they're logged in and prompted to set a password

## Usage flow
1. **New Lead** → fill in niche, city, style (+ optional contact info)
2. **Lead Detail** → click **Generate Website** (calls Claude, ~10–20 sec)
3. Review the **Website Preview** tab
4. Click **Approve** (required before drafting)
5. Connect Gmail via the dashboard if not already connected
6. Click **Create Gmail Draft** — Claude writes the email, Gmail API saves it as a draft (never auto-sends)
7. Open Gmail, review and send the draft yourself
