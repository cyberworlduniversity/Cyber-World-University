CREATE DATABASE IF NOT EXISTS cwu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'cwu_user'@'localhost' IDENTIFIED BY 'cwu_password';
GRANT ALL PRIVILEGES ON cwu_db.* TO 'cwu_user'@'localhost';
FLUSH PRIVILEGES;

-- Flask-SQLAlchemy creates application tables on first startup.
