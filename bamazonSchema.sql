DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
    id INT(10) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT(10) NULL,
    product_sales DECIMAL(10,2) NULL DEFAULT 100
);

INSERT INTO products(name, department, price, stock_quantity)
VALUES("A Smarter Way to Learn JS", "books", 15.00, 100),
("Dancing Queen CD", "music", 9.99, 200),
("65 in HD TV", "electronics", 749.99, 50),
("Believe CD", "music", 8.00, 400),
("12 in Frying Pan", "housewares", 20.00, 1000),
("The Gunslinger", "books", 12.98, 5000),
("Set of 10 Spatulas", "housewares", 25.99, 200),
("BluRay Player", "electronics", 80.97, 4),
("Area Rug", "housewares", 300.00, 2),
("Gimme Gimme-Single", "music", .99, 10000),
("SOS-Single", "music", .99, 1000),
("The Drawing of the Three", "books", 7.98, 450);

CREATE TABLE departments(
    department_id INT(10) UNIQUE NOT NULL,
    department_name VARCHAR(100) NOT NULL PRIMARY KEY,
    overhead_costs INT(11) NULL
);

INSERT INTO departments(department_id, department_name, overhead_costs)
VALUES(1, "books", 50000),
(2, "music", 100000),
(3, "housewares", 75000),
(4, "electronics", 200000);

SELECT * FROM products;

SELECT * FROM departments
ORDER BY department_id ASC;

-- inner join both tables for supervisor view
SELECT department_id, department_name, overhead_costs, SUM(product_sales) AS dept_prod_sales  FROM products AS p
INNER JOIN departments AS d ON p.department = d.department_name
GROUP BY d.department_name
ORDER BY d.department_id ASC;