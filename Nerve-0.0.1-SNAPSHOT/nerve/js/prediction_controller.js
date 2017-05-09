var predictionController = angular.module('nerve.app');

predictionController.controller("predictionCtrl",["$scope","$state",function($scope,$state){
    var pageSize=20;

    getBrainByPage(0);
    $("#predict-data").unbind('click').click(function () {
        predict();
    });
    function predict(){

        var inputNodeList=document.getElementById("input-node-list").getElementsByTagName("li");
        var inputArray="";
        for(var i=1;i<inputNodeList.length;i++){
            if(inputNodeList[i].getElementsByTagName("input")[0].value==null){
                swal("参数不全", "请补充所有参数(null)", "error");
                return;
            }
            if(inputNodeList[i].getElementsByTagName("input")[0].value==""){
                swal("参数不全", "请补充所有参数(空字符串)", "error");
                return;
            }
            inputArray+=inputNodeList[i].getElementsByTagName("input")[0].value;
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
                if(response.result=="wrong_format") {
                    swal("参数格式错误", "请检查模型", "error");
                    return;
                }
                var outputArray=response.result.split(",");
                var outputNodeList=document.getElementById("output-node-list").getElementsByTagName("li");

                for(var i=1;i<outputArray.length;i++)
                {
                    outputNodeList[i].getElementsByTagName("input")[0].value==outputArray[i]
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
                clearNodes();
            },
            success:function (response) {
                if(response.result=="success"){
                    clearNodes();
                    $scope.loadingNode=false;
                    $scope.$apply();

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
                        $scope.$apply();
                    }


                }
            },
            error:function () {
                $scope.loadingNode=false;
                $scope.$apply();
                swal("系统错误", "请稍后重试", "error");
            }
        });
    }







    function clearModels(){
        var modelList=$("#prediction-model-list").find("ul");
        if(modelList.length>1){
            //模板不删
            for(var i=1;i<modelList.length-1;i++){
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
        var modelList=document.getElementById("prediction-model-list").getElementsByTagName("ul");
        for(var i=1;i<modelList.length;i++){
            (function(n){
                    var liForClick= modelList[n].getElementsByTagName("li")[0]
                    liForClick.onclick = function(){
                    var modelId=liForClick.getElementsByTagName("a")[0].getAttribute("modelId");
                    showNodes(modelId);
                    sessionStorage.setItem("predictionBrainId",modelId);


                        //清空全部的class
                        for(var j=0; j<modelList.length;j++){
                            removeClass(modelList[j].getElementsByTagName("li")[0],"model-item-selected");
                        }
                        //设置选中项
                        modelList[n].getElementsByTagName("li")[0].className="model-item-selected";
                }
            })(i);
        }
        if(modelList.length>1){
            modelList[1].getElementsByTagName("li")[0].click();
        }
    }
    function removeClass(obj, cls) {
        if (hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');

            addClass(obj,"model-item");
        }
    }
    function hasClass(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    function addClass(obj, cls) {
        if (!hasClass(obj, cls)) obj.className += " " + cls;
    }
    function addModelItem(modelName,modelId){
        var $cloneObject=$("#prediction-model-template").clone();
        $cloneObject.find("a input").attr("value",modelName);
        $cloneObject.css("display",'inline');
        $cloneObject.find("a").attr("modelId",modelId);
        $("#prediction-model-list").children().eq(-2).after($cloneObject);
    }
    function addInputNodeItem(inputNodeName){
        var $cloneObject=$("#input-node-template").clone();
        $cloneObject.find("span")[0].innerHTML=inputNodeName;
        $cloneObject.css("display",'inline');
        $("#input-node-template").after($cloneObject);
    }
    function addOutputNodeItem(outputNodeName){
        var $cloneObject=$("#output-node-template").clone();
        $cloneObject.find("span")[0].innerHTML=outputNodeName;
        $cloneObject.css("display",'inline');
        $("#output-node-template").after($cloneObject);
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
                    $scope.$apply();
                    clearModels();
                    var brainArray=response.brain_array;
                    if(brainArray.length==0){
                        $scope.modelEmptyData=true;
                        $scope.$apply();
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
                $scope.$apply();
                swal("系统错误", "请稍后重试", "error");
            }
        });
    }

}]);

