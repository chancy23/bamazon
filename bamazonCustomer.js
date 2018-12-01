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
    showItems();
});

function showItems(){
    connection.query("SELECT id, name, department, price FROM products", function(err, res){
        if (err) throw err;
        console.log("\nAll Products\n\r\nProduct ID  |  Name  |  Department  | Price($)\n");
        for (var i = 0; i < res.length; i++){
           console.log(res[i].id + "  |  " + res[i].name + "  |  " + res[i].department + "  |  " + res[i].price);
        };
        console.log("\n");
        startOrder();
    });
};

function startOrder(){
    //call the DB to connect to products table
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        //use inquirer to ask which ID, make sure its a number and also one of our IDs in the DB
        inquirer.prompt([
            {
                name: "productID",
                type: "input",
                message: "Which Product ID do you want to order?",
                validate: function(value){
                    //validate that the number is an actual number and within our ID range
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
            var chosenProduct;
            var chosenProductStock;
            var chosenProductPrice;
            var chosenProductSales;

            for (var i = 0; i < res.length; i++) {
                if (res[i].id === parseInt(answer.productID)) {
                    chosenProduct = res[i].name;
                    chosenProductStock = res[i].stock_quantity;
                    chosenProductPrice = res[i].price;
                    chosenProductSales = res[i].product_sales;
                    //display the chosen item
                    console.log("\nYou've selected: " + chosenProduct +"\n");
                }; 
            };
            
            //then ask how many units of it they want
            inquirer.prompt([
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to order?",
                    validate: function(value){
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
                //variable to hold the answer/input amount as an integer
                var orderedNum = parseInt(answer.quantity);

                // remaining stock number (to use when updating the DB)
                var remainingStock = chosenProductStock - orderedNum;
                
                //testing section for variables
                // console.log("the is the amount ordered: " + orderedNum);
                // console.log("Amount Available in DB: " + chosenProductStock);
                // console.log("this is the remaining stock: " + remainingStock);
                // console.log("Item Price in DB: " + chosenProductPrice);
                // console.log("Total Product Sales in DB: " + chosenProductSales);

                //if insufficient stock, tell them so
                if (orderedNum > chosenProductStock){
                    console.log("\nI'm sorry, we don't have that may in stock.\n\rWe have " + chosenProductStock + " available for purchase\n");
                    // ask them if they want to enter a smaller amount
                    inquirer.prompt([
                        {
                            name: "reDoQuantity",
                            type: "confirm",
                            message: "Would you like to order a smaller quantity?", 
                            default: true 
                        }
                    ]).then(function(answer){
                        if (!answer.reDoQuantity){
                            console.log("\nThanks, come back anytime!");
                            return false;
                        }
                        else {
                            startOrder();
                        }
                    });
                }
                else {
                    //show the amount of the order (quanity * number)
                    var orderTotal = orderedNum * chosenProductPrice;
                    //process the order and print
                    console.log("\nCongratulations, your order has been placed! \nYour order total is: $" + orderTotal + "\n\r");

                    //add the current sale to the total in the DB to update in the DB
                    var newProductSalesTotal = orderTotal + chosenProductSales

                    //and finally update the db with the amount ordered subtracted from the quanity column and the orderTotal to the Product Sales column
                    connection.query("UPDATE products SET ? WHERE ?", 
                        [
                            {
                            //what to actually change (the SET)
                            stock_quantity: remainingStock,
                            product_sales: newProductSalesTotal
                            },{
                            //in what row (the WHERE)
                            name: chosenProduct
                            }
                        ], 
                        function(err, res){
                            if(err) throw err;
                            //testing
                            //console.log(res.affectedRows + " updated");
                        }
                    ); 
                    placeAnotherOrder()
                };
            });
        });
    });
};

function placeAnotherOrder(){
    inquirer.prompt([
        {
            name: "anotherOrder",
            type: "confirm",
            message: "Would you like to place another order?"
        }
    ]).then(function(answer){
        if (answer.anotherOrder){
            showItems();
        }
        else {
            console.log("\n\rThank you, come back again!");
            return;
        };
    });
};



   