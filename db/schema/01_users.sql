DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS orders_content CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT null,
  created_at DATE DEFAULT CURRENT_TIMESTAMP,
  is_admin BOOLEAN default false
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  users_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_ready BOOLEAN DEFAULT false,
  is_pickedup BOOLEAN DEFAULT false,
  order_date DATE NOT null
);


CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  prep_time INT NOT NULL,
  type_plate VARCHAR not null,
  is_active BOOLEAN default false,
  created_at DATE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE orders_content (
  id SERIAL PRIMARY KEY NOT NULL,
  orders_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE
);
