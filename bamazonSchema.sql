DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
	department_id INT PRIMARY KEY NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs NUMERIC(20,2) DEFAULT 0.00
);

INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES(1,"Books", 200.65),
	(2,"Electronics", 3075.82),
	(3,"Home & Kitchen", 5289.99);

INSERT INTO 
departments( department_id, department_name, over_head_costs)
SELECT MAX( department_id ) + 1, "Clothing", 350.24 FROM departments;

CREATE TABLE products (
    item_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    price NUMERIC(20,2) DEFAULT 0.00,
    product_sales NUMERIC(20,2) DEFAULT 0.00,
    stock_quantity INT(30)
);

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES("Americanah" , 1 , 12.34 , 72),
	("Things Fall Apart" , 1 , 10.24 , 52),
	("Purple Hibiscus" , 1 , 9.98 , 21),
	("Of Mice and Men" , 1 , 8.79 , 2),
	("Wreckage" , 1 , 4.99 , 24),
	("The Book Theif" , 1 , 10.75 , 50),
	("The Storyteller" , 1 , 9.98 , 31),
	("East of Eden" , 1 , 10.74 , 34),
	("The Things They Carried" , 1 , 9.97 , 12),
	("Their Eyes were Watching God" , 1 , 11.24 , 65),
	("Bose SoundTrue Around-Ear headphones" , 2 , 99.98 , 6),
	("Powerbeats3 Wireless In-Ear headphones" , 2 , 134 , 21),
	("HP DeskJet Compact Printer" , 2 , 24.98 , 52),
	("Canon All-in-One Printer" , 2 , 28 , 15),
	("Samsung 55'' Curved TV" , 2 , 797.99 , 4),
	("VIZIO Smart LED TV" , 2 , 409.99 , 15),
	("SONY Wireless Speaker" , 2 , 65.36 , 34),
	("Bose SoundLink Bluetooth Speaker" , 2 , 99 , 20),
	("Apple MacBook Air 13.3''" , 2 , 808.99 , 30),
	("Google Pixelbook" , 2 , 999.5 , 15),
	("Bissell Spinwave" , 3 , 96.15 , 3),
	("Whirlpool Top Load Washing Machine" , 3 , 1022.74 , 18),
	("Kenmore Electric Dryer" , 3 , 699.99 , 30),
	("LG Top Mount Refrigerator" , 3 , 1341 , 48),
	("Toshiba Toaster Oven" , 3 , 39.99 , 50),
	("Panasonic Microwave" , 3 , 113.23 , 3),
	("Shark Deluxe Upright Vacuum" , 3 , 119.69 , 15),
	("Keurig K575" , 3 , 150.14 , 12),
	("IKEA HEKTAR Floor Lamp" , 3 , 124.98 , 4),
	("13.2 Gallon Trash Can" , 3 , 44.88 , 65)