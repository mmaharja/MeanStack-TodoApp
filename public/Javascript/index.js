/**
 * Created by Maharjan on 12/9/2015.
 */
var app = angular.module("ToDoApp", []);
app.controller("ToDoController", function ($scope, $http) {
    $scope.myToDos = [];
    $scope.today = new Date();

    var url = "/MyToDos";

    $http.get(url).success(function (response) {
        $scope.myToDos = response;
    });

    $scope.addNewTask = function (form) {
        var item = $scope.myTodo;
        $http.post(url, $scope.myTodo)
            .success(function (res) {
                    if (res.success) {
                        $scope.myToDos.push(res.todo);
                        $scope.myTodo = {};
                    }
                    handleResponse(res)
                    $scope.resetForm(form);
                }
            )
            .error(handleError);
    };

    $scope.deleteToDo = function (item) {
        var index = $scope.myToDos.indexOf(item);
        $http.delete(url +'/' + item._id)
            .success(function (res) {
                if (res.success) {
                    $scope.myToDos.splice(index, 1);
                }
                handleResponse(res);
            })
            .error(handleError);
    };

    $scope.updateStatus = function (item) {
        $http.put(url, item)
            .success(function (res) {
                handleResponse(res);
            })
            .error(handleError);
    };

    $scope.resetForm = function (form) {
        form.$setPristine();
        form.$setUntouched();
        $scope.myTodo = {};
    };

    function handleResponse(res) {
        $scope.alert = res.success ? "alert alert-success" : "alert alert-danger";
        $scope.message = res.message;
    }

    function handleError() {
        $scope.alert = "alert alert-danger";
        $scope.message = "please try again!"
    }
});