var budgetControllet = (function () {
  //
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },

    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem: function (type, sortDescription, sortValue) {
      var newItem, ID;

      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //create new item based on incomes or expenses
      if (sortValue === ".exp") {
        newItem = new Expense(ID, sortDescription, sortValue);
      } else if (sortValue === ".inc"); {
        newItem = new Income(ID, sortDescription, sortValue);
      }

      //push it into our data structure
      data.allItems[type].push(newItem); //agrega el objeto al array, es type pq se llaman iugal para no usar un if con los nombres expesnes o inc
      return newItem; // return the new element
    },

    calculateBudget: function () {
      //calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");
      //calculate budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      //calculate percentage of expenses
      if (data.totals.inc) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalIncome: data.totals.inc,
        totalExpenses: data.totals.exp,
        percentage: data.percentage,
      };
    },

    testing: function () {
      console.log(data);
    },
  };
})();

///UI CONTROLLER
var UIControllet = (function () {
  var DOMstrings = {
    inputType: ".add-type",
    inputDescription: ".add-description",
    inputValue: ".add-value",
    inputBtn: ".add-btn",
    incomeContainer: ".income-list",
    expensesContainer: ".expenses-list",
  };

  return {
    getInput: function () {
      //METHOD
      return {
        type: document.querySelector(DOMstrings.inputType).value, //will be etiher income or expense
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    addListItem: function (object, type) {
      var html;
      var newHtml;
      //Create html string with placeholder text

      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '          <div class="item clearfix" id="income-%id%"> <div class="item-description">%description%</div> <div class="right clearfix"> <div class="item-value">%value%</div> <div class="item-delete"> <button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button> </div> <div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"> <div class="item-description">%description%</div> <div class="right clearfix"> <div class="item-value">%value%</div> <div class="item-percentage">21%</div> <div class="item-delete"> <button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
      }

      //Replace the placehorder with data received
      newHtml = html.replace("%id%", object.id);
      newHtml = newHtml.replace("%description%", object.description);
      newHtml = newHtml.replace("%value%", object.value);

      //Insert html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    clearFields: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      var fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function (current, index, array) {
        current.value = ""; // to clear the fields
      });
      fieldsArray[0].focus();
    },

    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

///
var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
        ctrlAddItem();
      }
    });
  };

  //UPDATE BUDGET
  var updateBudget = function () {
    //calculate budget
    budgetCtrl.calculateBudget();
    //return the budget
    var budget = budgetCtrl.getBudget();
    // display to the UI
    console.log(budget);
  };

  var ctrlAddItem = function () {
    //1. Get the field input data
    var input = UICtrl.getInput();

    //2. add the item to the budget controllet

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      var newItem = budgetCtrl.addItem(
        input.type,
        input.description,
        input.value
      );

      //3. add new item t the UI

      UICtrl.addListItem(newItem, input.type);

      //3.5 Clear the fields

      UICtrl.clearFields();

      //4. calculate and update the budget
      updateBudget();
      //5. display the budget
    }
  };
  return {
    initializatin: function () {
      console.log("APP has started");
      setupEventListeners();
    },
  };
})(budgetControllet, UIControllet);

controller.initializatin();