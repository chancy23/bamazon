# bamazon App

##Overview
This is a Command Line Interface (CLI) App that has includes 3 different files, based on the user's role
  --Customer (Used to place orders via the app).
  --Manager (used to view all available products, view only low inventory items, add inventory to any available product, and add a new products).
  --Supervsior (used to view product sales and profit by department, and to create new departments).
  
The information for this app is stored in a MySQL Database with 2 tables (products and departments). To initialize the DB please see the bamazonSchema.sql file.

[click for database schema and seed data](bamazonSchema.sql)


##Customer Functionality

1. The customer is show all available products for sale (ID, Name, Department, and Cost)
2. They are then asked which ID they want to purchase followed by a second question, asking how many items.
      * If there is not enough units available, they are advised so, and asked to enter a smaller quantity.
      * Otherwise they are told their order was a success and give a total for their order and asked if they want to order another item.
3. (Not visible to customer) The database is updated with the new inventory amount (minus the order quanity), and the order total is added to the product sales total for the item's department.

  * [Screenshot](images/bamazon_cust_order_success.png)
  * [Screenshot](images/bamazon_cust_overquantity.png)


##Manager Functionality

* The manager is presented with the following options:
  * [Screenshot](images/bamazon_mgr_start.png)

  1. View Products for Sale
    * Shows all available item's ID, Name, pPice, and Quantity.
    * [Screenshot](images/mgr_showAll.png)

  2. View Low Inventory Items
    * Shows the same information as the all products, but only displays products with inventory less than 5 units available.
    * If there are no low inventory items, a message advising this displays.
    * [Screenshot](images/mgr_showLowInventory.png)

  3. Add to Inventory
    * Manager is prompted to pick an ID to add inventory, then asked how much to add, then displays the new total for the item.
    * [Screenshot](images/mgr_add_inventory.png)

  4. Add New Product
    * Manager is prompted for the new product's name, cost, inventory amount (an ID is automatically assigned in the DB).
    * Then a success message and the item is listed.
    * [Screenshot](images/mgr_add_product.png)


##Supervisor Functionality

* The manager is presented with the following options:

  1. View Product Sales by Department
    * Displays a table that shows Dept ID, Name, Overhead Costs, Products Sales (Sum of all products in that dept), and Total Profit (Product Sales minus Overhead Costs)
    * [Screenshot](images/sup_view_depts.png)
   
  2. Create New Department
    * Allows a supervisor to create a new department (ID, Name, Overhead Costs).
    * This department will not show in the Product Sales Dept until it has sold at least 1 item
    * After department creation, Manager must add new products to that department to show for customer purchase.
    * [Screenshot](images/sup_create_dept.png)

##Technology Used

*  npm packages: mysql, inquirer, cli-table
*  Database: MySQL

##Contact

If you have questions or issues, contact Chancy Leath at chancyleath@hotmail.com