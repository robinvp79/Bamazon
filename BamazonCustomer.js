var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

var start = function(){
	connection.query('SELECT * FROM products', function(err,res){
		if (err) {
			throw err;
		}
        showProducts(res);
        customerPurchase();
    });
};

function showProducts(arg){
    var table = new Table({
        head: ['Item ID', 'Product Name', 'Price'],
        colWidths: [10, 60, 10]
    });
    arg.forEach(function(row){
        table.push([row.itemID, row.productName, row.price]);
    });
    console.log(table.toString());
};

function customerPurchase(){
    inquirer.prompt(customerChoice).then(function(choice){
        checkout(choice);
    });
};

var customerChoice = [
    {
        type:"input",
        name:"ID",
        message:"What is the ID of the product you would like to buy?"
    },{
        type:"input",
        name:"quantity",
        message:"How many units of the product you would like to buy?"
    }
];

function checkout(arg){
    connection.query('SELECT * FROM products WHERE ?',{
        itemID:arg.ID
    }, function(err,res){
        if (err) {
            throw err;
        }
    var resultObj = res[0];
    if(arg.quantity>0){
        if (arg.quantity>resultObj.stockQuantity){
            console.log("We're unable to process your order at this time. Insufficient quantity!");
            connection.end();
        }else{
            processPurchase(resultObj,arg.quantity);
        }
    }else{
        console.log("Please enter a valid quantity units of the product you would like to buy.");
        connection.end();
    }
    });
};

function processPurchase(itemObj,qty){
    var newqty= itemObj.stockQuantity-qty;
    var totalPurchase=itemObj.price*qty;
    var newTotalSales=itemObj.totalSales+totalPurchase;
    connection.query('UPDATE products SET ? WHERE ?',[{
        stockQuantity: newqty,
        totalSales: newTotalSales
    },{  
        itemID: itemObj.itemID
    }],function(err,res){
        if (err) {
            throw err;
        }
        console.log("The total cost of your order was: $", totalPurchase, "; Thanks for your purchase");
        updateDepartmentSales(itemObj.departmentName,totalPurchase);
    });
};

function updateDepartmentSales(departName,saleAmount){
    connection.query('SELECT * FROM departments WHERE ?',{
        departmentName: departName
    },function(err,res){
        if(err){
            throw err;
        }
        var newDepartmentSales = parseFloat(res[0].totalSales) + parseFloat(saleAmount);
        connection.query('UPDATE departments SET ? WHERE ?',[{
            totalSales: newDepartmentSales
        },{
            departmentName: departName
        }],function(err,res){
            if (err){
                throw err;
            }
            connection.end();
        });
    });
}
