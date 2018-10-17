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

//function to display all items in the db
function showItems(){
    connection.query("SELECT id, name, department, price FROM products", function(err, res){
        if (err) throw err;
        console.log("\nAll Products\n\r\nProduct ID  |  Name  |  Department  | Price($)\n");
        for (var i = 0; i < res.length; i++){
            console.log(res[i].id + "  |  " + res[i].name + "  |  " + res[i].department + "  |  " +res[i].price);
        };
        console.log("\n");
        //call function to start order process
        startOrder();
    });
};


//function to start order process
function startOrder(){
    //call the DB to connect to products table
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        //use inquirer to ask which ID
        inquirer.prompt([
            {
                name: "productID",
                type: "input",
                message: "Which Product ID do you want to order?",
                validate: function(value){
                    if(isNaN(value) === false){
                        return true;
                    }
                    else {
                        console.log("  That is not a valid number, please try again.");
                        return false;
                    };
                }
            }
        ]).then(function(answer){
            //create a variables to hold the chosen product id's name, quantity and price from the db
            var chosenProduct;
            //used when we ask how many, later
            var chosenProductStock;
            var chosenProductPrice;

            //loop through all items in the db to match the inputted id to variables
            for (var i = 0; i < res.length; i++) {
                if (res[i].id === parseInt(answer.productID)) {
                    chosenProduct = res[i].name;
                    chosenProductStock = res[i].stock_quantity;
                    chosenProductPrice = res[i].price;
                };  
            };
            //display the chosen item
            console.log("You've selected: " + chosenProduct);


            //if entered item is not in the db ask them to try again
            
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
                            console.log("  That is not a valid number, please try again.");
                            return false;
                        };
                    }
                }
            ]).then(function(answer){
                //variable to hold the answer/input amount as an integer
                var orderedNum = parseInt(answer.quantity);
                console.log("the is the amount ordered: " + orderedNum);

                //testing
                console.log("Amount Available in DB: " + chosenProductStock);
                console.log("Item Price in DB: " + chosenProductPrice);

                //if insufficient stock, tell them so
                if (orderedNum > chosenProductStock){
                    console.log("I'm sorry, we don't have that may in stock");
                    //show the available amount from the DB
                    console.log("We have this many available for purchase: " + chosenProductStock);
                    //ask them if they want to enter a smaller amount
                }
                else {
                    //process order
                    console.log("Congratulations, your order has been placed!")

                    //show the amount of the order (quanity * number)
                    var orderTotal = orderedNum * chosenProductPrice;
                    console.log("Your order total is: $" + orderTotal);
                    //and update the db with the amount ordered from the quanity column
                };

            });
        });
    });

};


   