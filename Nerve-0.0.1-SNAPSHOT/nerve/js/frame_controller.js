var frameController = angular.module('nerve.app');
frameController.controller("frameCtrl",["$scope","$state",function($scope,$state){
    $(document).ready(function(){
        $(".content_to_solid").css("width",getViewpoitWidth()+"px");
        $(".content_to_solid").css("height",getViewpoitHeight()+"px");
        $(".content_to_solid").css("overflow","auto");
        function getViewpoitHeight() {
            if(document.compatMode=="BackCompat"){
                return document.body.clientHeight;
            }else{
                return document.documentElement.clientHeight;
            }
        }
        function getViewpoitWidth() {
            if(document.compatMode=="BackCompat"){
                return document.body.clientWidth;
            }else{
                return document.documentElement.clientWidth;
            }
        }

    })
}]);
