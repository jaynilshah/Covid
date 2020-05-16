angular.module("myApp", []).controller("ctrl", function($scope,$http) {
    
    $http.get('/temporary').then(
        (res)=>{
        console.log(res);
    },
    (err)=>{
        console.log("error");
    });
});