create database bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	itemID INTEGER(11) AUTO_INCREMENT NOT NULL,
	productName VARCHAR(50) NOT NULL,
    departmentName VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stockQuantity INTEGER(10) NOT NULL,
    totalSales decimal (10,2) default 0.00,
    primary key (itemID)
);

CREATE TABLE departments (
	departmentID INTEGER(11) AUTO_INCREMENT NOT NULL,
	departmentName VARCHAR(50) NOT NULL,
    overHeadCosts DECIMAL(10,2) NOT NULL,
    totalSales decimal (10,2) default 0.00,
    primary key (departmentID)
);

alter table departments drop column totalProfit;

select * from products;

select * from departments;

update products set stockQuantity=8 where itemID=101;
update departments set totalSales=4799.97 where departmentID=1;

INSERT INTO departments (departmentName, overHeadCosts)
VALUES ('Electronics', 18990.50);

INSERT INTO departments (departmentName, overHeadCosts)
VALUES ('Home', 14500.00);

INSERT INTO departments (departmentName, overHeadCosts)
VALUES ('Sports', 17800.00);

INSERT INTO products (itemID, productName, departmentName, price, stockQuantity)
VALUES (101, 'Apple MacBook 12" Display', 'Electronics', 1599.99, 10);

INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES ('Sony PlayStation 4 500gb', 'Electronics', 349.99, 15);

INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES ('Bose Lifestyle SoundTouch 535', 'Electronics', 3499.99, 8);

INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES ('Samsung 60" LED Curved 2160p 4K', 'Electronics', 1699.99, 12);

INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES ('Simmons Beautyrest U.P. King Mattress', 'Home', 5099.99, 9);

INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES ('Cindy Crawford 4-pc. Sectional Sofa', 'Home', 4399.99, 7);

INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES ('Samsung Family Hub 27.9 Cu.Ft. 4-Door', 'Home', 4894.99, 10);

INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES ('ProForm Pro 2000 Treadmill', 'Sports', 1249.99, 15);

INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES ('Imperial Outdoor 8ft Pool Table', 'Sports', 3199.99, 15);

INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES ('Ridley Fenix C20 Shimano 105 Bike', 'Sports', 1754.99, 12);
