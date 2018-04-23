var mysql = require("mysql"),
    inquirer = require("inquirer"),
    Table = require('cli-table'),
    table = new Table();

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
    selected: [],
    askQuestion: function(type) {
        var self = this,
            ids = self.productList.map(product => {return parseInt(product[0])}),
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
                              return (available > value) ? true : `Insufficient quantity! There are only ${available} products available`;
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
                break;
            case "add_new":
                break;
            case "supervisor":
                break;
            default:
                console.log("default"); 
                break;
        }
        
    },
    getExtraSQL: function(obj, isNew) {
        var self = this;
        if (isNew)
        {

        }
        else
        {
            //var newCount = self.selected[4] + obj.stock_quantity;
            return [
                {stock_quantity : self.selected[4] + obj.stock_quantity},
                {item_id : obj.item_id}
            ]
        }
    },
    getUpdateSummary: function (obj, isNew) {
        var self = this;
        if (isNew)
        {

        }
        else
        {
            return `Product Name:  ${self.selected[1]}  Total in Stock:  ${parseInt(self.selected[4]) + parseInt(obj.stock_quantity)}`
        }
    },
    managerActions: function(data) {
        var self= this
        if (data.action.substring(0,3)=== "add") {
            self.setProducts().then(function(){
               self.askQuestion(data.action)
                .then(function(answer){
                    self.updateInventory(answer, (data.action === "add_new"));
                    self.connection.end();
                }); 
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
        var self = this,
            count = obj.stock_quantity,
            price = self.selected[3],
            name = self.selected[1],
            newCount = self.selected[4] - count,
            total = price * count,
            allSales = self.selected[5] + total;

        self.querySQL("UPDATE products set ? WHERE ?", 
            [
                {
                    stock_quantity:newCount, 
                    product_sales:allSales
                },
                {item_id:obj.item_id}
            ]);
        console.log(`Your purchase was successful.`);
        console.log(`Item: ${name}  Unit Price: $${price}  Count: ${count}  Total: $${total}`);
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
                else
                {
                    //self.connection.end();
                }
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
                        console.log("set product list");
                        self.productList = data.map(row => {return self.columns.product.map(thisCol => {return row[thisCol.db]})})
                        resolve(true);
                    });
            }
        });
    },
    updateInventory: function(obj, isNew) {
        var self = this,
            sql = (isNew) ? "INSERT INTO products set ?" : "UPDATE products set ? WHERE ?",
            extra = self.getExtraSQL(obj, isNew),
            msg = "Success, " + ((isNew) ? "new product added to inventory" : "inventory updated") + "!";
            msgSum = self.getUpdateSummary(obj, isNew);
        //console.log(obj);
        //console.log(self.selected);
        self.querySQL(sql, extra)
            .then(function(data){
                if (data.warningCount === 0)//console.log(data);
                {
                    console.log(msg);
                    console.log(msgSum);
                }
                //console.log(`Item: ${self.selected[0]}  Quantity:`);
            });
    }
};