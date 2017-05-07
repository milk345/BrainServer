var predictionController = angular.module('nerve.app');

predictionController.controller("predictionCtrl",["$scope","$state",function($scope,$state){
    var pageSize=20;

    $(document).ready(function(){
        getBrainByPage(0);
    })//document.ready

    function predict(){

        var inputNodeList=$(".input-node-list").find("li");
        var inputArray="";
        for(var i=0;i<inputNodeList.length;i++){
            if(inputNodeList[i].find("input").value==null){
                swal("参数不全", "请补充所有参数(null)", "error");
                return;
            }
            if(inputNodeList[i].find("input").value==""){
                swal("参数不全", "请补充所有参数(空字符串)", "error");
                return;
            }
            inputArray+=inputNodeList[i].find("input").value;
            if(i<inputNodeList.length-1) inputArray+=",";
        }
        var sendData={
            "user_id":sessionStorage.getItem("userId"),
            "access_token":sessionStorage.getItem("accessToken"),
            "brain_id":sessionStorage.getItem("predictionBrainId"),
            "input_array":inputArray
        };
        $.ajax({
            url:"../brain/predictBrain",
            type:"post",
            dataType:"json",
            data:JSON.stringify(sendData),
            contentType:"application/json",
            beforeSend:function () {

            },
            success:function (response) {
                if(response=="wrong_format") swal("参数格式错误", "请检查模型", "error");
                var outputArray=response.split(",");
                var outputNodeList=$(".output-node-list").find("li");

                for(var i=0;i<outputArray.length;i++)
                {
                    outputNodeList[i].find("input").value==outputArray[i]
                }

                swal("参数模拟成功！", "", "success");

            },
            error:function () {
                swal("系统错误", "请稍后重试", "error");
            }
        });

    }

























    function showNodes(brainId){

        var sendData={
            "user_id":sessionStorage.getItem("userId"),
            "access_token":sessionStorage.getItem("accessToken"),
            "brain_id":brainId
        };
        $.ajax({
            url:"../brain/getNodesByBrain",
            type:"post",
            dataType:"json",
            data:JSON.stringify(sendData),
            contentType:"application/json",
            beforeSend:function () {
                //$("#node-data-loading").style.display="block";
                $scope.loadingNode=true;
                clearNodes();
            },
            success:function (response) {
                if(response.result=="success"){
                    $scope.loadingNode=false;
                    //$("#input-node-list").style.display="visible";
                    //$("#output-node-list").style.display="visible";

                    var inputArray=response.input_array;
                    for(var i=0;i<inputArray.length;i++)
                    {
                        addInputNodeItem(inputArray[i].name);
                    }

                    var outputArray=response.output_array;
                    for(var i=0;i<outputArray.length;i++)
                    {
                        addOutputNodeItem(outputArray[i].name);
                    }

                    if(outputArray.length==0||inputArray.length==0){
                        $scope.nodeEmptyData=true;
                    }


                }
            },
            error:function () {
                $scope.loadingNode=false;
                swal("系统错误", "请稍后重试", "error");
            }
        });
    }







    function clearModels(){
        var modelList=$(".model-list").find("ul");
        if(modelList.length>1){
            //模板不删
            for(var i=1;i<modelList.length;i++){
                modelList[i].remove();
            }
        }
    }
    function clearNodes(){
        var inputList=$(".input-node-list").find("li");
        if(inputList.length>1){
            //模板不删
            for(var i=1;i<inputList.length;i++){
                inputList[i].remove();
            }
        }
        var outputList=$(".output-node-list").find("li");
        if(outputList.length>1){
            for(var i=1;i<outputList.length;i++){
                outputList[i].remove();
            }
        }
    }


    function setClickEvent(){
        var modelList=$("#prediction-model-list>ul");
        for(var i=0;i<modelList.length;i++){
            console.log("我在点击",modelList[i]);
            (function(n){
                modelList[n].children("li")[0].onclick = function(){
                    console.log("我在点击");
                    var modelId=modelList[n].find("a").attr("modelId");
                    showNodes(modelId);
                    sessionStorage.setItem("predictionBrainId",modelId);
                }
            })(i);
        }
    }
    function addModelItem(modelName,modelId){
        var $cloneObject=$("#prediction-model-template").clone();
        $cloneObject.find("a input").attr("value",modelName);
        $cloneObject.css("display",'inline');
        $cloneObject.find("a").attr("modelId",modelId);
        console.log("我是老二",$("#prediction-model-list:last").prev());
        $("#prediction-model-list").last().prev().after($cloneObject);
    }
    function addInputNodeItem(inputNodeName){
        var $cloneObject=$(".input-node-template").clone();
        $cloneObject.find("span")[0].innerHTML=inputNodeName;
        $cloneObject.css("display",'inline');
        $(".input-node-template").after($cloneObject);
    }
    function addOutputNodeItem(outputNodeName){
        var $cloneObject=$(".output-node-template").clone();
        $cloneObject.find("span")[0].innerHTML=outputNodeName;
        $cloneObject.css("display",'inline');
        $(".output-node-template").after($cloneObject);
    }



    function getBrainByPage(pageIndex){
        var sendData={
            "user_id":sessionStorage.getItem("userId"),
            "access_token":sessionStorage.getItem("accessToken"),
            "page_size":pageSize,
            "page_index":pageIndex
        };
        $.ajax({
            url:"../brain/getAllBrain",
            type:"post",
            dataType:"json",
            data:JSON.stringify(sendData),
            contentType:"application/json",
            beforeSend:function () {
                $scope.loadingModel=true;
                clearModels();
            },
            success:function (response) {
                if(response.result=="success"){
                    $scope.loadingModel=false;
                    var brainArray=response.brain_array;
                    if(brainArray.length==0){
                        $scope.modelEmptyData=true;
                        return;
                    }
                    for(var i=0;i<brainArray.length;i++)
                    {
                        addModelItem(brainArray[i].name,brainArray[i].brain_id);
                    }
                    setClickEvent();

                }
            },
            error:function () {
                $scope.loadingModel=false;
                swal("系统错误", "请稍后重试", "error");
            }
        });
    }

}]);

