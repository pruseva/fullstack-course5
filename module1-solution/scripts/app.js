(function () {
'use strict';

angular.module('Module1App', [])
.controller('UserController', UserController);

UserController.$inject = ['$scope'];
function UserController($scope) {
    var limit_user = 3;
    var msg_user = {count_empty: "Please enter data first", count_success:"Enjoy!", count_fail:"Too much!"};
    var msg_decorate = {count_empty: "red", count_notempty: "green"};
    $scope.msg_input_decorate = msg_decorate.count_empty;

    $scope.validateCount = function () {
        if (angular.isUndefined($scope.input_user) || $scope.input_user == '') {
            return processMsg(false, msg_user.count_empty, msg_decorate.count_empty);
        }
        var input_user = $scope.input_user;
        var re_criteria = /\s*,\s*/; 
        var input_user_process = input_user.split(re_criteria).filter(function(x){
                                                                                    return (!angular.isUndefined(x) && x.trim() != '');
                                                                                });
        if (input_user_process.length == 0) {
            return processMsg(false, msg_user.count_empty, msg_decorate.count_empty);
        }
        if (input_user_process.length <= limit_user)
            return processMsg(true, msg_user.count_success, msg_decorate.count_notempty);
        else
            return processMsg(true, msg_user.count_fail, msg_decorate.count_notempty);
        
    };
    
    function processMsg (status, msg_input_verify, msg_input_decorate) {
        $scope.msg_input_verify = msg_input_verify;
        if ($scope.msg_input_decorate != msg_input_decorate)
            $scope.msg_input_decorate = msg_input_decorate;
        return status;
    }
    
}

})();