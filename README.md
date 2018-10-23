# bamazon App

##Overview
This is a Command Line Interface (CLI) App that has includes 3 different files, based on the user's role
  --Customer (Used to place orders via the app).
  --Manager (used to view all available products, view only low inventory items, add inventory to any available product, and add a new products).
  --Supervsior (used to view product sales and profit by department, and to create new departments).
  
The information for this app is stored in a MySQL Database with 2 tables (products and departments). To initialize the DB please see the bamazonSchema.sql file.


##Customer Functionality

1. The customer is show all available products for sale (ID, Name, Department, and Cost)
2. They are then asked which ID they want to purchase followed by a second question, asking how many items.
      * If there is not enough units available, they are advised so, and asked to enter a smaller quantity.
      * Otherwise they are told their order was a success and give a total for their order and asked if they want to order another item.
3. (Not visible to customer) The database is updated with the new inventory amount (minus the order quanity), and the order total is added to the product sales total for the item's department.


##Manager Functionality

* The manager is present with  the following options:

  1. View Products for Sale
    * Shows all available item's ID, Name, pPice, and Quantity.

  2. View Low Inventory Items
    * Shows the same information as the all products, but only displays products with inventory less than 5 units available.
    * If there are no low inventory items, a message advising this displays.

  3. Add to Inventory
    * Manager is prompted to pick an ID to add inventory, then asked how much to add, then displays the new total for the item

  4. Add New Product
    * Manager is prompted for the new product's name, cost, inventory amount (an ID is automatically assigned in the DB).
    * Then a success message and the item is listed.


##Supervisor Functionality

1. Create a new MySQL table called `departments`. Your table should include the following columns:

   * department_id

   * department_name

   * over_head_costs (A dummy number you set for each department)

2. Modify the products table so that there's a product_sales column, and modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

   * Make sure your app still updates the inventory listed in the `products` column.

3. Create another Node app called `bamazonSupervisor.js`. Running this application will list a set of menu options:

   * View Product Sales by Department
   
   * Create New Department

4. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

| department_id | department_name | over_head_costs | product_sales | total_profit |
| ------------- | --------------- | --------------- | ------------- | ------------ |
| 01            | Electronics     | 10000           | 20000         | 10000        |
| 02            | Clothing        | 60000           | 100000        | 40000        |

5. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.

6. If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.

   * Hint: You may need to look into aliases in MySQL.

   * Hint: You may need to look into GROUP BYs.

   * Hint: You may need to look into JOINS.

   * **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)