-- 易宿酒店预订平台 MySQL 建表SQL

-- 1. 用户表
CREATE TABLE user (
  user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  sign_up_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 商户表
CREATE TABLE merchant (
  merchant_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  merchant_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  business_license VARCHAR(255),
  status INT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. 管理员表
CREATE TABLE admin (
  admin_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. 酒店表
CREATE TABLE hotel (
  hotel_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  merchant_id BIGINT NOT NULL,
  hotel_name VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  hotel_address VARCHAR(255) NOT NULL,
  hotel_level INT,
  phone VARCHAR(20) NOT NULL,
  price_start DECIMAL(10,2) NOT NULL,
  room_count INT NOT NULL,
  description TEXT,
  images TEXT,
  audit_status INT DEFAULT 0,
  publish_status INT DEFAULT 0,
  reject_reason VARCHAR(255),
  offline_reason VARCHAR(255),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchant(merchant_id)
);

-- 5. 房型字典表
CREATE TABLE room_type (
  type_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  type_name VARCHAR(50) NOT NULL UNIQUE
);

-- 6. 酒店房型表
CREATE TABLE hotel_room (
  room_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  hotel_id BIGINT NOT NULL,
  room_type_id BIGINT NOT NULL,
  room_count INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  images TEXT,
  FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id),
  FOREIGN KEY (room_type_id) REFERENCES room_type(type_id)
);

-- 7. 房间预订表
CREATE TABLE room_booking (
  book_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  room_id BIGINT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status INT DEFAULT 1,
  booking_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id),
  FOREIGN KEY (room_id) REFERENCES hotel_room(room_id)
);

-- 8. 标签表
CREATE TABLE tag (
  tag_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tag_name VARCHAR(50) NOT NULL UNIQUE
);

-- 9. 酒店标签关联表
CREATE TABLE hotel_tag_relation (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  hotel_id BIGINT NOT NULL,
  tag_id BIGINT NOT NULL,
  FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id),
  FOREIGN KEY (tag_id) REFERENCES tag(tag_id),
  UNIQUE KEY unique_hotel_tag (hotel_id, tag_id)
);
