-- script.sql
CREATE DATABASE marketplace;

\c marketplace;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  profile_picture VARCHAR(255)
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL,
  category VARCHAR(50),
  status VARCHAR(50),
  location VARCHAR(100),
  image_url TEXT
);