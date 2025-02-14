CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at DATE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS travel_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    country TEXT NOT NULL,
    arrival_date DATE NOT NULL,
    departure_date DATE,
    updated_at DATE DEFAULT NOW() NOT NULL
);
