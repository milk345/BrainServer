var appRouter = angular.module('nerve.app',['ui.router']);
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
                    //controller:"createCtrl"
                }
            },
            onExit:function(){
                organizeWindow();
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