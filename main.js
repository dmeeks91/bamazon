var mysql = require("mysql"),
    inquirer = require("inquirer"),
    Table = require('cli-table'),
    table = new Table();

Number.prototype.formatMoney = function(c, d, t){
    var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

exports.actions = {
    columns: {
        product:[
            {db:"item_id", display:"ID", width: 10},
            {db:"product_name", display:"Name", width: 50},
            {db:"department_id", display:"Department", width: 30},
            {db:"price", display:"Price", width: 10},
            {db:"stock_quantity", display:"Quantity", width: 10},
            {db:"product_sales", display:"Product Sales", width: 10}
        ],
        department: [
            {db:"department_id", display:"ID", width: 30},
            {db:"department_name", display:"Name", width: 50},
            {db:"over_head_costs", display:"Over Head Costs", width: 10},
        ],
        customer:[
            {db:"item_id", display:"ID", width: 10},
            {db:"product_name", display:"Name", width: 50},
            {db:"price", display:"Price", width: 10},
        ],
        manager:[
            {db:"item_id", display:"ID", width: 10},
            {db:"product_name", display:"Name", width: 50},
            {db:"price", display:"Price", width: 10},
            {db:"stock_quantity", display:"Quantity", width: 10}
        ],
        supervisor: [
            {db:"department_id", display:"ID", width: 10},
            {db:"department_name", display:"Name", width: 28},
            {db:"over_head_costs", display:"Over Head Costs", width: 18},
            {db:"product_sales", display:"Product Sales", width: 18},
            {db:"total_profit", display:"Total Profit", width: 18},
        ],
    },
    connection: mysql.createConnection({
        host: "localhost",
        port: 3306,
        
        // Your username
        user: "root",
        
        // Your password
        password: "",
        database: "bamazon_db"
    }),
    productList: [],
    departments: [],
    selected: [],
    askQuestion: function(type) {
        var self = this,
            ids = self.productList.map(product => {return parseInt(product[0])}),
            dptChoices = self.departments.map(dpt => {return {name: dpt[1], value: dpt[0]}}),
            userID = 0;    

        switch (type)
        {
            case "customer":
                return inquirer.prompt([
                    {
                        name: "item_id",
                        type: "input",
                        message: "What is the ID of the product you would like to purchase?",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                                userID = ids.indexOf(parseInt(value));                                    
                                return (userID != -1) ? true : `${value} is not a valid ID`;
                            }
                            return "Please enter a numeric value!";
                        }
                    },
                    {
                        name: "stock_quantity",
                        type: "input",
                        message: "How Many would you like to purchase?",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                                var available = self.productList[userID][4];
                                    self.selected = self.productList[userID];
                              return (parseInt(available) > parseInt(value)) ? true : `Insufficient quantity! There are only ${available} products available`;
                            }
                            return "Please enter a numeric value!";
                        }
                    },
                ]);
            case "add_existing":
                return inquirer.prompt([
                    {
                        name: "item_id",
                        type: "input",
                        message: "What is the ID of the product you would like to replenish?",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                                userID = ids.indexOf(parseInt(value));
                                self.selected = self.productList[userID];                                  
                                return (userID != -1) ? true : `${value} is not a valid ID`;
                            }
                            return "Please enter a numeric value!";
                        }
                    },
                    {
                        name: "stock_quantity",
                        type: "input",
                        message: "How many are you adding to the inventory?",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                                return (parseInt(value) > 0) ? true : `You must enter a positive value`;
                            }
                            return "Please enter a numeric value!";
                        }
                    },
                ]);
            case "add_new":
                return inquirer.prompt([
                    {
                        name: "product_name",
                        type: "input",
                        message: "What is the name of the new product?",
                        validate: function(value) {
                            if (value.length <= 100) {                                  
                                return true;
                            }
                            return "Product names must be no greater than 100 characters";
                        }
                    },
                    {
                        name: "department_id",
                        type: "list",
                        message: "Select the department to which this product belongs.",
                        choices: dptChoices
                    },
                    {
                        name: "price",
                        type: "input",
                        message: "What is the unit price for this product",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                                return (parseInt(value) > 0) ? true : `You must enter a positive value`;
                            }
                            return "Please enter a numeric value!";
                        }
                    },
                    {
                        name: "stock_quantity",
                        type: "input",
                        message: "How many units of this product are you adding to the inventory?",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                                return (parseInt(value) > 0) ? true : `You must enter a positive value`;
                            }
                            return "Please enter a numeric value!";
                        }
                    }
                ]);
            case "add_department":
                return inquirer.prompt([
                    {
                        name: "department_name",
                        type: "input",
                        message: "What is the name of the new department?",
                        validate: function(value) {
                            if (value.length <= 100) {                                  
                                return true;
                            }
                            return "Department names must be no greater than 100 characters";
                        }
                    },
                    {
                        name: "over_head_costs",
                        type: "input",
                        message: "What are the over head costs associated with this department?",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                                return (parseInt(value) > 0) ? true : `You must enter a positive value`;
                            }
                            return "Please enter a numeric value!";
                        }
                    }
                ]);
        }
        
    },
    getExtraSQL: function(obj, isNew) {
        var self = this;
        return (isNew) ? obj : [
            {stock_quantity : parseInt(self.selected[4]) + parseInt(obj.stock_quantity)},
            {item_id : obj.item_id}
        ]
    },
    getUpdateSummary: function (obj, isNew) {
        var self = this;
        return (isNew) ? "" :`Product Name:  ${self.selected[1]}  Total in Stock:  ${parseInt(self.selected[4]) + parseInt(obj.stock_quantity)}`
    },
    managerActions: function(data) {
        var self= this
        if (data.action.substring(0,3)=== "add") {
            self.setProducts()
            .then(function(){
                self.setDepartments()
                .then(function(){
                    self.askQuestion(data.action)
                    .then(function(answer){
                        self.updateInventory(answer, (data.action === "add_new"));
                        self.connection.end();
                    }); 
                })
            })
            
        }
        else {
            self.readProducts(data.action);
            self.connection.end();
        }
    },
    printTable: function(data, columns) {
        var tblCols = columns.map(col => {return col.display}),
            tblWidths = columns.map(col => {return col.width}),
            tblRows = data.map(row => {return columns.map(thisCol => {return row[thisCol.db]})}),
            table = new Table({
                head: tblCols,
                colWidths: tblWidths
            });

        this.productList = data.map(row => {return this.columns.product.map(thisCol => {return row[thisCol.db]})});

        tblRows.forEach(row => {
            table.push(row);
        });

        console.log((tblRows.length > 0) ? table.toString() : "There are no results matching your query.");
    },
    purchaseProduct: function(obj)
    {
        //[ id, product_name, department_id, price, quantity, product_sales ]
        var self = this,
            count = obj.stock_quantity,
            price = self.selected[3],
            name = self.selected[1],
            newCount = self.selected[4] - count,
            total = (price * count),
            allSales = (self.selected[5] + parseFloat(total));
        self.querySQL("UPDATE products set ? WHERE ?", 
            [
                {
                    stock_quantity:newCount, 
                    product_sales:allSales
                },
                {item_id:obj.item_id}
            ]);
        console.log(`Your purchase was successful.`);
        console.log(`Item: ${name}  Unit Price: $${price}  Count: ${count}  Total: $${total.formatMoney(2)}`);
        self.connection.end();
    },
    querySQL: function(sqlStr, extra) {
        var self = this;
        return new Promise (function(resolve, reject)
        {
            self.connection.query(sqlStr, extra, function(err, res) {
                if (err) throw err;
                resolve(res);
            });
        });        
    },
    readProducts: function(type) {
        var self = this,
            colArray = (type != "customer") ? self.columns.manager : self.columns.customer,
            msg = (type != "manager_low") ? "Retrieving all products for sale...\n" 
                : "Retrieving products with inventory lower than five...\n",
            sql = "SELECT * FROM products" + ((type != "manager_low") ? "" 
                : " WHERE stock_quantity < 5");

            console.log(msg);

        self.querySQL(sql, "")
            .then(function(data){                
                self.printTable(data, colArray);
                if (type === "customer")
                {
                    self.askQuestion("customer")
                        .then(function(data){
                            self.purchaseProduct(data);
                        });
                }
            });
    },
    setDepartments: function() {
        var self = this;
        return new Promise (function(resolve, reject)
        {
            self.querySQL("SELECT * FROM departments")
                .then(function(data){
                    //console.log("set department list");
                    self.departments = data.map(row => {return self.columns.department.map(thisCol => {return row[thisCol.db]})})
                    resolve(true);
                });
        });
    },
    setProducts: function() {
        var self = this;
        return new Promise (function(resolve, reject)
        {
            if (self.productList.length === 0)
            {
                self.querySQL("SELECT * FROM products")
                    .then(function(data){
                        //console.log("set product list");
                        self.productList = data.map(row => {return self.columns.product.map(thisCol => {return row[thisCol.db]})})
                        resolve(true);
                    });
            }
        });
    },
    supervisorActions: function(obj) {
        var self = this,
            sql = `SELECT d.department_id, d.department_name,
                d.over_head_costs, SUM(product_sales) as product_sales, 
                SUM(product_sales) - d.over_head_costs as total_profit 
                FROM products as p
                INNER JOIN departments as d
                ON p.department_id = d.department_id
                GROUP BY department_id`;

        if (obj.action === "supervisor")    
        {
            self.querySQL(sql)
                .then(function(data){                
                    self.printTable(data, self.columns.supervisor);
                    self.connection.end();
                });
        }
        else
        {
            self.askQuestion(obj.action).then(function(answer){
               var sql = `INSERT INTO departments( department_id, department_name, over_head_costs)
                          SELECT MAX( department_id ) + 1, 
                            "${answer.department_name}", 
                            ${answer.over_head_costs} FROM departments;`;
                self.querySQL(sql).then(function(){
                    console.log(`Success, new department (${answer.department_name}) added to database.`);
                    console.log(`Note: This department will not display in the View Product Sales by Department table until a Manager adds a new product with this department to the inventory.`)
                    self.connection.end();
                });
            })
        }  
    },
    updateInventory: function(obj, isNew) {
        var self = this,
            sql = (isNew) ? "INSERT INTO products set ?" : "UPDATE products set ? WHERE ?",
            extra = self.getExtraSQL(obj, isNew),
            msg = "Success, " + ((isNew) ? `new product (${obj.product_name}) added to inventory` : "inventory updated") + "!",
            msgSum = self.getUpdateSummary(obj, isNew);
        
        //Run SQL and alert user of status    
        self.querySQL(sql, extra)
            .then(function(data){
                if (data.warningCount === 0)//update successfull
                {
                    console.log(msg);
                    console.log(msgSum);
                }
            });
    }
};