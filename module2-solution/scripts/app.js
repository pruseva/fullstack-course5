(function () {
'use strict';

angular.module('ShoppingListApp', [])
.controller('ToBuyController', ToBuyController)
.controller('AlreadyBoughtController', AlreadyBoughtController)
.service('ShoppingListCheckOffService', ShoppingListCheckOffService);

ToBuyController.$inject = ['ShoppingListCheckOffService'];
//to buy list controller
function ToBuyController(ShoppingListCheckOffService) {
  var tobuy = this;
  tobuy.list = ShoppingListCheckOffService.initTobuy();
  
  tobuy.addToBought = function (itemIndex) {
    ShoppingListCheckOffService.addToBought(itemIndex);
  };
  tobuy.isEmpty = function () {
      return ShoppingListCheckOffService.isEmptyToBuy();    
  };
}

AlreadyBoughtController.$inject = ['ShoppingListCheckOffService'];
//bought list controller
function AlreadyBoughtController(ShoppingListCheckOffService) {
  var bought = this;
  bought.list = ShoppingListCheckOffService.initBought();
  bought.isEmpty = function () {
      return ShoppingListCheckOffService.isEmptyBought();    
  };
}
//shopping list service
function ShoppingListCheckOffService() {
  var service = this;
  var items_tobuy = [];
  var items_bought = [];
  
  //pre-populate the to buy list and return it
  service.initTobuy = function () {
    items_tobuy = [
        {name: "Eggs", quantity: 10},
        {name: "Sugar", quantity: 1},
        {name: "Margarine", quantity: 2},
        {name: "Flour", quantity: 1},
        {name: "Oranges", quantity: 3},
        ];
    return items_tobuy;
  };
  
  //it returns the bouthg list
  service.initBought = function () {
    if (angular.isUndefined(items_bought))
        items_bought = [];
    return items_bought;
  };  
  //moves the selected item from items_tobuy to items_bought
  service.addToBought = function (index) {
      var to_add = items_tobuy[index];
      items_tobuy.splice(index, 1);
      items_bought.push(to_add);
  };
  //used to check if the items_tobuy has no items
  service.isEmptyToBuy = function () {      
      return service.isEmpty(items_tobuy);
  };
  //used to check if the items_bought has no items
  service.isEmptyBought = function () {
      return service.isEmpty(items_bought);
  };
  service.isEmpty = function (arr_to_check) {
      if (angular.isUndefined(arr_to_check) || arr_to_check.length <= 0)
        return true;
      return false;
  };
}

})();