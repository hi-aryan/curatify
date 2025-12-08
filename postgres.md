1. npm install pg (with caching "npm install pg --cache ./.npm-cache")

2. add DATABASE_URL=postgres://aryan@localhost:5432/curatify_db to .env

(didn't set up super user, skipped:
  psql -d postgres -c "create role curatify with login password 'curatify';"
  psql -d postgres -c "grant all privileges on database curatify_db to curatify;")

3. schema setup (run in psql):
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