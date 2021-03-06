//requires for inquirer and mysql
var inquirer = require("inquirer");
var mysql = require("mysql");
//for cli-table package
var Table = require("cli-table");

// instantiate table
var table = new Table({
    head: ["Deptartment ID", "Department Name", "Overhead Costs ", "Products Sales", "Total Profit"],
    colWidths: [20, 20, 20, 20, 20]
});

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
    supervisorStart();
});

function supervisorStart(){
    inquirer.prompt([
        {
            name: "supOptions",
            type: "list",
            message: "What would you like to do?",
            choices: [
            "View Product Sales by Department",
            "Create New Department"
            ]
        }
    ]).then(function(answer){
        // Use a switch case to call the functions to peform each action
        switch(answer.supOptions) {
            case "View Product Sales by Department":
                return viewSales();
            case "Create New Department":
                return createDept();
        };
    }); 
};


function viewSales(){
    //query database and join the 2 tables to display as one table
    connection.query("SELECT department_id, department_name, overhead_costs, SUM(product_sales) AS dept_prod_sales FROM products AS p " +
    "INNER JOIN departments AS d ON p.department = d.department_name " +
    // "WHERE dept_prod_sales >= 0 " + //how to get it to show all, even if there have been no sales yet, this says its an unknown col??
    "GROUP BY d.department_name " +
    "ORDER BY d.department_id ASC", function(err, res){
        if (err) throw err;
        //loop through the results and push to the table array
        for (var i = 0; i < res.length; i++){
            var totalProfit = res[i].dept_prod_sales - res[i].overhead_costs;
            table.push([res[i].department_id, res[i].department_name, res[i].overhead_costs, res[i].dept_prod_sales, totalProfit]);
        };
        //display the table
        //Note: if the same option is chosen more than once it keeps appending to the table, so have multiple rows of same content, how to fix?
        console.log("\n\rProduct Sales by Department\n" + table.toString() + "\n\r");
        supervisorStart();
    })
};

function createDept(){
    inquirer.prompt([
        {
            name: "newDeptId",
            type: "input",
            message: "What is the Department's ID?",
            validate: function(value){
                //validate that the number is an actual number
                if(isNaN(value) === false){
                    return true;
                }
                else {
                    console.log(" | That is not a valid ID, please try again.");
                    return false;
                };
            }
        },{
            name: "newDeptName",
            type: "input",
            message: "What is the name of the new Department?"
        },{
            name: "newDeptCosts",
            type: "input",
            message: "What are the overhead costs of the Department?",
            validate: function(value){
                //validate that the number is an actual number
                if(isNaN(value) === false){
                    return true;
                }
                else {
                    console.log(" | That is not a valid number, please try again.");
                    return false;
                };
            }
        }
    ]).then(function(answers){
        //then post into the departments table
        connection.query("INSERT INTO departments SET ?", [
            {
                department_id: answers.newDeptId,
                department_name: answers.newDeptName,
                overhead_costs: answers.newDeptCosts
            }
        ], 
        function(err, res){
            if (err) throw err;
            console.log("\nSuccess! You've added the department: " + answers.newDeptName + 
            "\n\r=========================================\n\r");
            supervisorStart();
        });
    });
};