var appRouter = angular.module('nerve.app',['ui.router',"oc.lazyLoad"]);

//为了懒加载
appRouter.config(["$provide", "$compileProvider", "$controllerProvider", "$filterProvider",
    function ($provide, $compileProvider, $controllerProvider, $filterProvider) {
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
    }]);
appRouter.config(function ($httpProvider) {

    $httpProvider.defaults.transformRequest = function (obj) {
        var str = [];
        for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    };

    $httpProvider.defaults.headers.post = {
        'Content-Type': 'application/x-www-form-urlencoded; charser=UTF-8'
    }

});
appRouter.constant('Modules_Config', [
    {
        name: 'treeControl',
        serie: true,
        files: []
    }
]);
appRouter.config(["$ocLazyLoadProvider","Modules_Config",routeFn]);
function routeFn($ocLazyLoadProvider,Modules_Config){
    $ocLazyLoadProvider.config({
        debug:false,
        events:false,
        modules:Modules_Config
    });
};













appRouter.config(function($stateProvider,$urlRouterProvider){





    $urlRouterProvider.otherwise("/index");

    $stateProvider
        .state("index",
        {
        url:"/index",
        views:{
            "":{
                templateUrl:"./templates/frame.html",
                controller:"frameCtrl"
        },
            "nav@index":{
                templateUrl:"./templates/navbar.html"
            },
            "main@index":{
                templateUrl:"./templates/home.html",
                controller:"homeCtrl"
            }
        },
            onExit:function(){
                organizeWindow();
            }
    })
        .state("index.home",
        {
            url:"/home",
            views:{
                "":{
                    templateUrl:"./templates/frame.html",
                    controller:"frameCtrl"
                },
                "nav@index":{
                    templateUrl:"./templates/navbar.html"
                },
                "main@index":{
                    templateUrl:"./templates/home.html",
                    controller:"homeCtrl"
                }
            },
            onExit:function(){
                organizeWindow();
            }
        })
        .state("index.prediction",
        {
            url:"/prediction",
            views:{
                "":{
                    templateUrl:"./templates/frame.html",
                    controller:"frameCtrl"
                },
                "nav@index":{
                    templateUrl:"./templates/navbar.html"
                },
                "main@index":{
                    templateUrl:"./templates/prediction.html",
                    controller:"predictionCtrl"
                }
            },
            onExit:function(){
                organizeWindow();
            }

        })
        .state("index.create",
        {
            url:"/create",
            views:{
                "":{
                    templateUrl:"./templates/frame.html",
                    controller:"frameCtrl"
                },
                "nav@index":{
                    templateUrl:"./templates/navbar.html"
                },
                "main@index":{
                    templateUrl:"./templates/create.html",
                    controller:"createCtrl"
                }
            },
            onExit:function(){
                organizeWindow();
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load( [
                           "./framework/echarts.js",
                           "./framework/dataTool.js"
                       ]
                    );
                }]
            }
        })
        .state("index.practice",
        {
            url:"/practice",
            views:{
                "":{
                    templateUrl:"./templates/practice.html",
                    controller:"frameCtrl"
                },
                "nav@index":{
                    templateUrl:"./templates/navbar.html"
                },
                "main@index":{
                    templateUrl:"./templates/practice.html",
                    controller:"practiceCtrl"
                }
            },
            onExit:function(){
                organizeWindow();
            }
        })
        .state("index.user",
        {
            url:"/user",
            views:{
                "":{
                    templateUrl:"./templates/frame.html",
                    controller:"frameCtrl"
                },
                "nav@index":{
                    templateUrl:"./templates/navbar.html"
                },
                "main@index":{
                    templateUrl:"./templates/user.html"
                }
            },
            onExit:function(){
                organizeWindow();
            }
        })

})