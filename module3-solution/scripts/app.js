(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/")
.directive('foundItems', FoundItemsDirective);

//controller
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
    var menu = this;
    var err = {'notfound':'Nothing found', 'noservice':'Service not available. Please try again later!'};
    menu.searchUser = '';
    menu.found = [];
    menu.err = '';
    
    menu.getMatchedMenuItems = function () {
        this.reset();
        if (angular.isUndefined(menu.searchUser) || menu.searchUser.trim() == '') {
            menu.err = err.notfound;
            return;
        }        
        var promise = MenuSearchService.getMatchedMenuItems(menu.searchUser);    
        promise.then(function (response) {
            menu.found = response;
            if (menu.found.length <= 0)
                menu.err = err.notfound;
        })
        .catch(function (error) {
            menu.err = err.noservice;     
        })
        
    };

    menu.removeItem = function (itemIndex) {
        if (MenuSearchService.isEmpty(menu.found))
            return;
        menu.found.splice(itemIndex, 1);
    };    
    menu.reset = function () {
        menu.found = [];
        menu.err = '';
    };
    menu.isEmpty = function (arr_to_check) {
        return MenuSearchService.isEmpty(arr_to_check);
    };   
    
}

//service
MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
    var service = this;
    
    //get the menu list and filter it
    service.getMatchedMenuItems = function (searchTerm) {        
        var foundItems = [];        
        return $http({
            method: "GET",
            url: (ApiBasePath + "menu_items.json")
          }).then(function (response) {
            
            if (!service.isEmpty(response.data) && !service.isEmpty(response.data.menu_items)) {                
                foundItems = service.filterMenuItems(searchTerm, response.data.menu_items);
            } else {
                foundItems = [];
            }
            return foundItems;
          
        }).catch(function (error) {
            return (foundItems = []);
      });
        
    };
    
    //check if an array is empty
    service.isEmpty = function (arr_to_check) {
        if (angular.isUndefined(arr_to_check) || arr_to_check.length <= 0)
          return true;
        return false;
    };   
    
    //filter the array items based on the user's search
    service.filterMenuItems = function (searchTerm, dataItems) {
        var filterFoundItems = [];
        var i_filter = 0;
        if (service.isEmpty(dataItems))
          return [];
        var regFilter = new RegExp("(" + searchTerm + ")", "i");
        
        for (var i=0; i<dataItems.length; i++) {
            if(regFilter.test(dataItems[i]['description'])) {
                filterFoundItems[i_filter] = dataItems[i];
                i_filter++;
            }
        }
        return filterFoundItems;
    };    
}
//custom directive
function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'founditems.html',
    scope: {
        menuItems: '<',
        menuErr: '@',
        onRemove: '&',
        isEmpty: '&'
    }
  };

  return ddo;
}

})();