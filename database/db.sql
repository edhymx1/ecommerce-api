DROP DATABASE ecommerce;
CREATE SCHEMA IF NOT EXISTS ecommerce DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE ecommerce ;

-- -----------------------------------------------------
-- Table users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  user_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(40) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  email VARCHAR(120) NOT NULL,
  password VARCHAR(120) NOT NULL,
  image_profile VARCHAR(160) NULL,
  PRIMARY KEY (user_id))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table products
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  product_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  description VARCHAR(2000) NOT NULL,
  price FLOAT(10,2) NOT NULL,
  discount INT NOT NULL DEFAULT 0,
  stock INT NOT NULL,
  PRIMARY KEY (product_id))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table pictures
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS pictures (
  picture_id INT NULL AUTO_INCREMENT,
  url VARCHAR(160) NOT NULL,
  PRIMARY KEY (picture_id))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table categories
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  category_id INT NOT NULL AUTO_INCREMENT,
  category_name VARCHAR(70) NOT NULL,
  picture_id INT NOT NULL,
  PRIMARY KEY (category_id),
  INDEX fk_categories_pictures1_idx (picture_id ASC),
  CONSTRAINT fk_categories_pictures1
    FOREIGN KEY (picture_id)
    REFERENCES pictures (picture_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table product_categories
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS product_categories (
  pc_id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  category_id INT NOT NULL,
  INDEX fk_product_categories_products_idx (product_id ASC),
  INDEX fk_product_categories_categories1_idx (category_id ASC),
  PRIMARY KEY (pc_id),
  CONSTRAINT fk_product_categories_products
    FOREIGN KEY (product_id)
    REFERENCES products (product_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_product_categories_categories1
    FOREIGN KEY (category_id)
    REFERENCES categories (category_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table product_pictures
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS product_pictures (
  pp_id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  picture_id INT NOT NULL,
  INDEX fk_product_pictures_products1_idx (product_id ASC),
  INDEX fk_product_pictures_pictures1_idx (picture_id ASC),
  PRIMARY KEY (pp_id),
  CONSTRAINT fk_product_pictures_products1
    FOREIGN KEY (product_id)
    REFERENCES products (product_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_product_pictures_pictures1
    FOREIGN KEY (picture_id)
    REFERENCES pictures (picture_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table roles
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  role_id INT NOT NULL AUTO_INCREMENT,
  role VARCHAR(45) NOT NULL,
  PRIMARY KEY (role_id))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table user_roles
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS user_roles (
  ur_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (ur_id),
  INDEX fk_user_roles_users1_idx (user_id ASC),
  INDEX fk_user_roles_roles1_idx (role_id ASC),
  CONSTRAINT fk_user_roles_users1
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_user_roles_roles1
    FOREIGN KEY (role_id)
    REFERENCES roles (role_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


INSERT INTO pictures(url) VALUES ('http://localhost:3000/pictures/categories/software.png'), ('http://localhost:3000/pictures/categories/hardware.png');

INSERT INTO categories(category_name, picture_id) VALUES('software', 1);
INSERT INTO categories(category_name, picture_id) VALUES('hardware', 2);

INSERT INTO roles(role) VALUES('administrator'),('employee'),('customer');

SELECT p.* FROM products p
  JOIN product_categories pc ON p.product_id = pc.product_id
  LEFT JOIN categories c ON pc.category_id = c.category_id
    WHERE c.category_id = 1 AND p.product_id > 0
    ORDER BY p.product_id ASC LIMIT 10;

SELECT p.* FROM product_categories pc 
  JOIN products p ON p.product_id = p.product_id
  LEFT JOIN categories c ON pc.category_id = c.category_id
    WHERE c.category_id = 1 AND p.product_id > 0
    ORDER BY p.product_id ASC LIMIT 10;

SELECT pic.* FROM products p
  JOIN product_pictures pp ON p.product_id = pp.product_id
  JOIN pictures pic ON pp.picture_id = pic.product_id
    WHERE product_id = ? ORDER BY pic.picture_id ASC