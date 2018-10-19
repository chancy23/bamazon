//requires for inquirer and mysql
var inquirer = require("inquirer");
var mysql = require("mysql");

//create db connection 
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon_DB"
});

//connect to db
connection.connect(function(err, res){
    if (err) throw err;
    console.log("connected with ID: " + connection.threadId);
    //call function to show items avialalbe to order
    managerStart();
});

//inqurier to choose from the list of options 
function managerStart(){
    inquirer.prompt([
        {
            name: "mgrOptions",
            type: "list",
            message: "What would you like to do?",
             // show all products (use showAll from customer app)
            // show low inventory(same as show all, but with a threshold at less than 10ish)
            // add to inventory
            // add product (insert a row into the DB)
            choices: ["Show All Products",
            "Show Products With Low Inventory",
            "Add Inventory to a Product",
            "Add a New Product"
            ]
        }
    ]).then(function(answer){
        // Use a switch case to call the functions to peform each action
        switch(answer.mgrOptions) {
            case "Show All Products":
                showAllInventory();
            case "Show Products With Low Inventory":
                return showLowInventory();
            case "Add Inventory to a Product":
                return addInventory();
            case "Add a New Product":
                return addProduct()
        };
    }); 
};

function showAllInventory(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        console.log("\nAll Products\n\r\nID |  Name  |  Price($)  |  Inventory\n");
        for (var i = 0; i < res.length; i++){
            console.log(res[i].id + "  |  " + res[i].name + "  |  " + res[i].price + "  |  " +res[i].stock_quantity);
        };
        console.log("\n");
        //call function to start order process
        //startOrder();
    });

};

function showLowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity<?", [30], function(err, res){
        if (err) throw err;
        console.log("Low inventory Items (less than 30 units)");
        console.log("\nAll Products\n\r\nID |  Name  |  Price($)  |  Inventory\n");
        for (var i = 0; i < res.length; i++){
            //if there are no low stock items, show a message saying so and show start menu
            //may need to make this conditional the first thing after err throw line
            if (res.length < 0) {
                console.log("There are currently no low inventory items.\n");
                managerStart();
            }
            else {
                console.log(res[i].id + "  |  " + res[i].name + "  |  " + res[i].price + "  |  " +res[i].stock_quantity);
                console.log("\n");
                //Then ask if they want to add inventory
                inquirer.prompt([
                    {
                        name: "addMoreInventory",
                        type: "confirm",
                        message: "Would you like to add more inventory?"
                    }
                ]).then(function(answer){
                    //if yes, call the add low inventory function
                    if(answer.addMoreInventory){
                        addInventory();
                    }
                    else {
                        //if not start over
                        managerStart();
                    };
                }); 
            };
        };
    });
};

function addInventory(){
    //call function to show the items
    showAllInventory();
    // then query the DB to start this function
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        //need to ask which product ID to update inventory on
        inquirer.prompt([
            {
                name: "productID",
                type: "input",
                message: "Which ID do you want add inventory to?",
                validate: function(value){
                    //validate that the number is an actual number
                    if(isNaN(value) === false && value < res.length + 1){
                        return true;
                    }
                    else {
                        console.log(" | That is not a valid Product ID, please try again.");
                        return false;
                    };
                }
            }
        ]).then(function(answer){
            // set answer to a variable (and parse to an actual number)
            var chosenProductID = parseInt(answer.productID)
            //declare variables to assign data to for the rest of the function
            var chosenProductName;
            var chosenProductInventory;
            var newInventoryAmount;

            for (var i = 0; i < res.length; i++){
                if (chosenProductID === res[i].id){
                    chosenProductName = res[i].name;
                    chosenProductInventory = res[i].stock_quantity;
                    console.log("\nYou've selected: " + chosenProductName + " with a current inventory of: " + chosenProductInventory + "\n");
                }
            }
            //testing
            // console.log("this is the product ID chosen " + chosenProductID);
            // console.log("this is the product Name chosen " + chosenProductName);
            // console.log("this is the product Inventory chosen " + chosenProductInventory);

            //ask how much inventory they want to add
            inquirer.prompt([
                {
                    name: "updateAmount",
                    type: "input",
                    message: "How many units would you like to add?",
                    validate: function(value){
                        //validate that the number is an actual number and within our ID range
                        if(isNaN(value) === false){
                            return true;
                        }
                        else {
                            console.log(" | That is not a valid number, please try again.");
                            return false;
                        };
                    }
                }
            ]).then(function(answer){
                //add the answer to the currrent inventory to get the new inventory amount (parseInt each value to change to a number from a string)
                newInventoryAmount = parseInt(answer.updateAmount) + parseInt(chosenProductInventory);
                //console.log("This is the new inventory amount to send to DB: " + newInventoryAmount);
            
                //then send that new number to the DB
                connection.query("UPDATE products SET ? WHERE ?", [
                        {
                            //new quantity
                            stock_quantity: newInventoryAmount
                        },{
                            //on which rows
                            id: chosenProductID
                        }
                    ], function(err, res){
                    if (err) throw err;
                    console.log("\nSuccess!\n" + chosenProductName + "'s inventory has been updated to: " + newInventoryAmount + "\n\r");
                    return managerStart();
                });
            });
        });
    });
};

function addProduct(){

};
