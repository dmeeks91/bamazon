var CLI = require('./main.js'),
    inquirer = require("inquirer");

inquirer.prompt({
    name: "action",
    type: "list",
    message: "Select an action to complete?",
    choices: [
        {name:"View Products for Sale", value:"manager"},
        {name:"View Low Inventory", value:"manager_low"},
        {name:"Add to Inventory", value:"add_existing"},
        {name:"Add New Product", value:"add_new"},
    ]
  })
  .then(function(answerObj) {
      CLI.actions.managerActions(answerObj);
  });