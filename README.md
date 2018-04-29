# Bamazon (Amazon-like CLI-Storefront)

This CLI app has 3 different user profiles: Customer, Manager and Supervisor. Each profile provides the user different methods to interact with the products stored in the mySQL database.

## Customer Profile
This profile displays a table of all products in the store. The user is then prompted to enter the ID of the product to be purchased. If the entered value does match a product in the database the user is notified and prompted again. Once the product is selected the user must specify the quantity to be purchased. If the entered value is greater than is currently available in stock, the user is notified to enter a different quantity. After a successful transaction the app prints summary of the purchase including name of product, unit price, quantity purchased, and total cost. 

![Bamazon-CLI Customer Node App Gif](/images/customer.gif)

## Manager Profile
This profile prompts the user to select from a list of potential actions:
* **View All Products:** Returns table displaying the ID, Name, Department, Price, and Quantity of all products
* **View Products With A Low Inventory:** Returns table of all products with fewer that five units in stock
* **Add Stock To Inventory:** 
    1) Select product from inventory 
    2) Enter quantity to be added
* **Add A New Product:** 
    1) Enter name of new product 
    2) Enter department name product belongs to 
    3) Enter unit price 
    4) Enter quantity available in stock

![Bamazon-CLI Manager Node App Gif](/images/manager.gif)

## Supervisor Profile
This profile prompts the user to select from a list of potential actions:
* **View Product Sales By Department:** Returns a table showing product sales by department. 
* **Create New Department:** 
    1) Enter Department Name
    2) Enter over-head costs for department

![Bamazon-CLI Supervisor Node App Gif](/images/supervisor.gif)