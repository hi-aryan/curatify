# Project Setup & Deployment Guide (Postgres Branch)

This guide outlines the changes in the `postgres` branch and precise steps for local development and Vercel deployment.

## 🔍 Branch Differences vs `main`

The `postgres` branch introduces a database layer using **PostgreSQL** and **Drizzle ORM**.

- **New Dependencies**: `drizzle-orm`, `pg`, `dotenv` (and dev: `drizzle-kit`).
- **New Config**: `drizzle.config.mjs` (ORM config), `src/db/` (Schema & connection).
- **Scripts**: `scripts/test-db` added for connection verification.

---

## 🛠 Prerequisites: Installing PostgreSQL (macOS)

If you don't have PostgreSQL installed, follow these steps using **Homebrew** (easiest method):

1. **Install Homebrew** (if you don't have it):

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install PostgreSQL**:

   ```bash
   brew install postgresql
   ```

3. **Start the Service**:

   ```bash
   brew services start postgresql
   ```

4. **Create Default Database**:

   ```bash
   createdb
   ```

   _This creates a database matching your system username, which is often enough for local dev._

5. **connect to the db**

---

## 👩‍💻 For Teammates: Local Setup Steps

Share these exact instructions with your team.

### 1. Switch to the branch (not needed anymore)

### 2. Install Dependencies

> **Important**: This branch adds new packages.

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory (if you haven't already) and add your PostgreSQL connection string.
_Note: Each team member should typically use their own local DB or a shared dev DB._

```env
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
```

### 4. Initialize Database

Sync your local database with the schema defined in `src/db/schema.js`.

```bash
npx drizzle-kit push
or
npx drizzle-kit push --config=drizzle.config.mjs
```

### 5. Verify Connection

Run the test script to ensure everything is working.

```bash
node scripts/test-db.js
```

_Expected Output:_ `✅ Connection successful!`

---

## 🚀 For Vercel Deployment (Neon Postgres)

### 1. Database Setup (Vercel Marketplace)

1. In your Vercel Project, go to the **Storage** tab or **Marketplace**.
2. Add **Neon** (or Vercel Postgres).
3. Once created, find the **Connection String** (usually in `.env.local` tab or settings).
   - It looks like: `postgres://user:pass@ep-hostname...neon.tech/neondb?sslmode=require`

### 2. Configure Vercel Environment

Go to **Settings > Environment Variables** on Vercel:

- **Key**: `DATABASE_URL`
- **Value**: Paste the Neon connection string from above.
- **Environments**: Check Production, Preview, and Development.

### 3. Initialize Production Database (Run from Laptop)

Your cloud database starts empty. You must "push" your schema to it.

1. **Temporarily** paste your **Neon Connection String** into your local `.env` file (replacing localhost).
   ```env
   # .env
   DATABASE_URL="postgres://user:pass@ep-...neon.tech/neondb?sslmode=require"
   ```
2. Run the push command:

   ```bash
   npx drizzle-kit push
   ```

   _You should see output confirming tables were created._

3. **Revert** your local `.env` back to localhost:
   ```env
   # .env
   DATABASE_URL="postgresql://localhost:5432/curatify_db"
   ```

### 4. Deploy Code

- Push your `postgres` branch to `main` (or merge via PR).
- Vercel will trigger a build.
- Since `DATABASE_URL` is set, the app will work immediately!

---

### ❓ FAQ

**Q: Do I need `@vercel/postgres`?**
A: **No.** Your project is configured to use the standard `pg` driver (in `src/db/index.js`). This is compatible with Neon and Vercel out of the box. You do NOT need to install extra Vercel-specific packages.

**Q: Can I connect to Vercel from localhost?**
A: Yes! If you want to debug against the _production_ data, you can put the Neon URL in your `.env`. Just be careful not to delete real user data.

---

# potential db schema

create table users (
spotify_user_id text primary key,
display_name text not null,
email text unique,
image_url text,
created_at timestamptz default now() not null,
updated_at timestamptz default now() not null
);
create table user_state (
spotify_user_id text primary key references users(spotify_user_id) on delete cascade,
landing_playlist jsonb not null default '[]'::jsonb,
preferences jsonb,
updated_at timestamptz default now() not null
);
