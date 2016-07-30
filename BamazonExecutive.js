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
    head: ['Department ID', 'Department Name', 'Over Head Costs', 'Product Sales', 'Total Profit'],
    colWidths: [18, 20, 18, 18, 18]
});

var executiveChoice = [
	{
		type:"list",
		message:"What do you want to do?",
		choices:["View Product Sales by Department","Create New Department"],
		name:"selection"
	}
];

var newDepartment =[
	{
		type:"input",
		name:"department",
		message:"What is the name of the department you want to add?"
	},{
		type:"input",
		name:"cost",
		message:"What is the cost of opening this department?"
	}
];

var start = function (){
	inquirer.prompt(executiveChoice).then(function(executive){
		if (executive.selection === "View Product Sales by Department"){
			showSalesByDepartment();
		}else if (executive.selection === "Create New Department"){
			createNewDepartment();
		}
	});
};

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

function showSalesByDepartment(){
	connection.query('SELECT * FROM departments', function(err,res){
		if (err) {
			throw err;
		}
	    res.forEach(function(row){
	    	var profit = (parseFloat(row.totalSales)-parseFloat(row.overHeadCosts)).toFixed(2);
	        table.push([row.departmentID, row.departmentName, row.overHeadCosts, row.totalSales, profit]);
	    });
	    console.log(table.toString());
	    connection.end();
	});
};

function createNewDepartment(){
	inquirer.prompt(newDepartment).then(function(answers){
		connection.query('INSERT INTO departments SET ?',{
			departmentName: answers.department,
			overHeadCosts: answers.cost
		},function(err,res){
			if (err) {
				throw err;
			}
			console.log("You successfully added a new department of sales.");
			connection.end();
		});
	});
};
