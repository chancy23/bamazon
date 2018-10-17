DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
    id INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT(10) NULL
);

INSERT INTO products(name, department, price, stock_quantity)
VALUES("A Smarter Way to Learn JS", "books", 15, 100),
("Dancing Queen CD", "music", 9.99, 200),
("65 in HD TV", "electronics", 749.99, 50),
("Believe CD", "music", 8, 400),
("12 in Frying Pan", "housewares", 20, 1000),
("The Gunslinger", "books", 12.98, 5000),
("Set of 10 Spatulas", "housewares", 25, 200),
("BluRay Player", "electronics", 80, 150),
("Area Rug", "housewares", 300, 25),
("Gimme Gimme-Single", "music", .99, 10000),
("The Drawing of the Three", "books", 7.98, 450);

SELECT * FROM products;