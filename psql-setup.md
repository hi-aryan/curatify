# Project Setup & Deployment Guide (Postgres Branch)

This guide outlines the changes in the `postgres` branch and precise steps for local development and Vercel deployment.

## 🔍 Branch Differences vs `main`
The `postgres` branch introduces a database layer using **PostgreSQL** and **Drizzle ORM**.

- **New Dependencies**: `drizzle-orm`, `pg`, `dotenv` (and dev: `drizzle-kit`).
- **New Config**: `drizzle.config.mjs` (ORM config), `src/db/` (Schema & connection).
- **Scripts**: `scripts/test-db.js` added for connection verification.

---

## 👩‍💻 For Teammates: Local Setup Steps
Share these exact instructions with your team.

### 1. Switch to the branch
```bash
git fetch origin
git checkout postgres
```

### 2. Install Dependencies
> **Important**: This branch adds new packages.
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (if you haven't already) and add your PostgreSQL connection string. 
*Note: Each team member should typically use their own local DB or a shared dev DB.*
```env
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
```

### 4. Initialize Database
Sync your local database with the schema defined in `src/db/schema.js`.
```bash
npx drizzle-kit push
```

### 5. Verify Connection
Run the test script to ensure everything is working.
```bash
node scripts/test-db.js
```
*Expected Output:* `✅ Connection successful!`

---

## 🚀 For Vercel Deployment
Since Vercel listens to the `main` branch, you will need to configure these settings **before** merging or if you want to deploy a preview of this branch.

### 1. Database Accessibility
**CRITICAL**: Vercel cannot access a database running on your `localhost`.
- You **MUST** use a cloud-hosted PostgreSQL database (e.g., Neon, Supabase, Vercel Postgres, or AWS RDS).
- Ensure the database accepts connections from the public internet (or configure Vercel IP allowlists).

### 2. Environment Variables
Go to **Vercel Dashboard > Settings > Environment Variables**:
- **Key**: `DATABASE_URL`
- **Value**: Your *cloud* database connection string (e.g., `postgres://user:pass@ep-hostname.us-east-2.aws.neon.tech/neondb...`)
- Select environments: **Production**, **Preview**, and **Development**.

### 3. Build & Deploy
- Vercel will automatically detect the new dependencies (`pg`, `drizzle-orm`) from `package.json` and install them.
- No changes to the build command are needed.

---


