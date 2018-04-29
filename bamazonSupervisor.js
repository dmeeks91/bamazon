var CLI = require('./main.js'),
    inquirer = require("inquirer");

inquirer.prompt({
    name: "action",
    type: "list",
    message: "Select an action to complete?",
    choices: [
        {name:"View Product Sales by Department", value:"supervisor"},
        {name:"Create New Department", value:"add_department"}
    ]
  })
  .then(function(answerObj) {
      CLI.actions.supervisorActions(answerObj);
  });