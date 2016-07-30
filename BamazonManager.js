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

var table = new Table({
    head: ['Item ID', 'Product Name', 'Price', 'Quantity'],
    colWidths: [10, 60, 10, 10]
});

var managerChoice = [
	{
		type:"list",
		message:"What do you want to do?",
		choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"],
		name:"selection"
	}
];

var inventoryQuestions = [
	{
        type:"input",
        name:"ID",
        message:"What is the ID of the product you would like to increase quantity?"
    },{
        type:"input",
        name:"quantity",
        message:"How many units of the product you would like to add?"
    }
];

var newProduct = [
	{
		type:"input",
		name:"item",
		message:"What is the name of the product you want to add?"
	},{
		type:"list",
		name:"department",
		message:"What is the product's department?",
		choices:[]
	},{
		type:"input",
		name:"price",
		message:"What is the price?"
	},{
		type:"input",
		name:"qty",
		message:"What is the quantity in sotck?"
	}
];

var start = function (){
	inquirer.prompt(managerChoice).then(function(manager){
		if (manager.selection === "View Products for Sale"){
			showProducts();
		}else if (manager.selection === "View Low Inventory"){
			showLowInventory();
		}else if (manager.selection === "Add to Inventory"){
			addInventory();
		}else if (manager.selection === "Add New Product"){
			addNewProduct();
		}
	});
};

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

function showProducts(){
	connection.query('SELECT * FROM products', function(err,res){
		if (err) {
			throw err;
		}
	    res.forEach(function(row){
	        table.push([row.itemID, row.productName, row.price, row.stockQuantity]);
	    });
	    console.log(table.toString());
	    connection.end();
	});
};

function showLowInventory(){
	var counter=0;
	connection.query('SELECT * FROM products', function(err,res){
		if (err) {
			throw err;
		}
	    res.forEach(function(row){
	    	if(row.stockQuantity<5){
	        	table.push([row.itemID, row.productName, row.price, row.stockQuantity]);
	        	counter++;
	    	}
	    });
	    if (counter>0){
	    	console.log(table.toString());
	    	connection.end();
	    }else{
	    	console.log("There is no product with low inventory.");
	    	connection.end();
	    }
	});
};

function addInventory(){
	inquirer.prompt(inventoryQuestions).then(function(inventory){
		connection.query('SELECT * FROM products WHERE ?',{
			itemID: inventory.ID
		},function(err,res){
			if (err) {
				throw err;
			}
			if (inventory.quantity>0){
				var itemName = res[0].productName;
				var newQuantity = parseInt(res[0].stockQuantity)+parseInt(inventory.quantity);
				connection.query('UPDATE products SET ? WHERE ?',[{
					stockQuantity: newQuantity
				},{	
					itemID: inventory.ID
				}],function(err,res){
					if (err) {
						throw err;
					}
					console.log("The product: ",itemName," with item ID: ",inventory.ID," was successfully updated.");
					console.log("The new quantity is: ",newQuantity);
				});
				connection.end();
			}else{
				console.log("Please enter a valid number to update the quantity of the product.");
				connection.end();
			}
		});
	});
};

function addNewProduct(){
	connection.query('SELECT * FROM departments',function (err,results) {
		if (err) {
			throw err;
		}
		results.forEach(function(row){
			newProduct[1].choices.push(row.departmentName);
		});
		addProductDetails();
	});
};

function addProductDetails(){
	inquirer.prompt(newProduct).then(function(answers){
		connection.query('INSERT INTO products SET ?',{
			productName: answers.item,
			departmentName: answers.department,
			price: answers.price,
			stockQuantity: answers.qty
		},function(err,res){
			if (err) {
				throw err;
			}
			console.log("You successfully added a new item for sale.");
			connection.end();
		});
	});
}
