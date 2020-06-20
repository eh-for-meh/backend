-- deals
CREATE TABLE deals (
  id VARCHAR(18) PRIMARY KEY NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now(),
  features TEXT NOT NULL,
  photo_urls TEXT[] NOT NULL,
  sold_out_at TIMESTAMP,
  specifications TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL
);

CREATE TABLE deal_items (
  attributes TEXT[] NOT NULL,
  id TEXT PRIMARY KEY NOT NULL UNIQUE,
  deal_id VARCHAR(18) NOT NULL REFERENCES deals(id),
  photo_url TEXT NOT NULL,
  price SMALLINT NOT NULL
);

CREATE TABLE deal_stories (
  id SERIAL PRIMARY KEY NOT NULL UNIQUE,
  deal_id VARCHAR(18) NOT NULL REFERENCES deals(id) UNIQUE,
  body TEXT NOT NULL,
  title TEXT NOT NULL
);

CREATE TYPE foreground_color AS ENUM ('light', 'dark');

CREATE TABLE deal_themes (
  id SERIAL PRIMARY KEY NOT NULL UNIQUE,
  accent_color VARCHAR(7) NOT NULL,
  background_color VARCHAR(7) NOT NULL,
  background_photo_url TEXT NOT NULL,
  deal_id VARCHAR(18) NOT NULL REFERENCES deals(id) UNIQUE,
  foreground foreground_color NOT NULL
);

-- polls
CREATE TABLE polls (
  id VARCHAR(18) PRIMARY KEY NOT NULL UNIQUE,
  deal_id VARCHAR(18) REFERENCES deals(id),
  start_timestamp TIMESTAMP,
  title TEXT NOT NULL
);

create TABLE poll_anwsers (
  id TEXT PRIMARY KEY NOT NULL UNIQUE,
  poll_id VARCHAR(18) NOT NULL REFERENCES polls(id),
  title TEXT NOT NULL,
  vote_count INTEGER NOT NULL
);

-- videos
CREATE TABLE videos (
  id VARCHAR(18) PRIMARY KEY NOT NULL UNIQUE,
  start_timestamp TIMESTAMP,
  title TEXT NOT NULL,
  media_url TEXT NOT NULL
);

-- all
CREATE TABLE topics (
  id SERIAL PRIMARY KEY NOT NULL UNIQUE,
  deal_id VARCHAR(18) REFERENCES deals(id),
  form_url TEXT NOT NULL,
  start_timestamp TIMESTAMP,
  title TEXT NOT NULL,
  poll_id VARCHAR(18) REFERENCES polls(id),
  video_id VARCHAR(18) REFERENCES videos(id),
  vote_count INTEGER NOT NULL
);