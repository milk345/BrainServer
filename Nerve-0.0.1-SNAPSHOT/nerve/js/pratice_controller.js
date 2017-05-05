var praticeController = angular.module('nerve.app');

praticeController.controller("praticeCtrl",["$scope","$state",function($scope,$state){


        $("#upload-pratice-data").click(function () {
            fileUpload();
        })
    function fileUpload() {
        var data = new FormData($('#pratice-data-file'));
        data.append("user_id",sessionStorage.userId);
        data.append("access_token",sessionStorage.access_token);
        data.append("brain_id",sessionStorage.brain_id);
        $.ajax({
            url: '/brain/uploadPraticeData',
            type: 'POST',
            data: data,
            dataType: 'JSON',
            cache: false,
            processData: false,
            contentType: false,
            beforeSend:function () {
                $scope.uploading=true;
            },
            success:function (response) {
                $scope.uploading=false;
            },
            error:function () {
                $scope.uploading=false;
                swal("系统错误", "请稍后重试", "error");
            }

        })
    }



































    var pageSize=20;

    $(document).ready(function(){
        getBrainByPage(0);
    })//document.ready

    function showNodes(brainId){
        var sendData={
            "account":sessionStorage.userId,
            "access_token":sessionStorage.access_token,
            "brain_id":brainId
        };
        $.ajax({
            url:"/nerve/brain/getNodesByBrain",
            type:"post",
            dataType:"json",
            data:JSON.stringify(sendData),
            contentType:"application/json",
            beforeSend:function () {
                $("#node-data-loading").style.display="block";
                clearNodes();
            },
            success:function (response) {
                if(response.result=="success"){
                    $("#node-data-loading").style.display="none";
                    $("#input-node-list").style.display="visible";
                    $("#output-node-list").style.display="visible";

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


                }
            },
            error:function () {
                $("#node-data-loading").style.display="none";
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
        var modelList=$(".model-list").find("ul");
        for(var i=0;i<modelList.length;i++){
            (function(n){
                modelList[n].onclick = function(){
                    showNodes(modelList[n].modelId);
                }
            })(i);
        }
    }
    function addModelItem(modelName,modelId){
        var $cloneObject=$("#model-template").clone();
        $cloneObject.find("a").attr("title",modelName);
        $cloneObject.style.display="visible";
        $cloneObject.find("a").attr("modelId",modelId);
        $("#model-list:last").after($cloneObject);
    }
    function addInputNodeItem(inputNodeName){
        var $cloneObject=$(".input-node-template").clone();
        $cloneObject.find("span")[0].innerHTML=inputNodeName;
        $cloneObject.style.display="visible";
        $(".input-node-template").after($cloneObject);
    }
    function addOutputNodeItem(outputNodeName){
        var $cloneObject=$(".output-node-template").clone();
        $cloneObject.find("span")[0].innerHTML=outputNodeName;
        $cloneObject.style.display="visible";
        $(".output-node-template").after($cloneObject);
    }



    function getBrainByPage(pageIndex){


        var sendData={
            "account":sessionStorage.userId,
            "access_token":sessionStorage.access_token,
            "page_size":pageSize,
            "page_index":pageIndex
        };
        $.ajax({
            url:"/nerve/brain/getAllBrain",
            type:"post",
            dataType:"json",
            data:JSON.stringify(sendData),
            contentType:"application/json",
            beforeSend:function () {
                $("#model-data-loading").style.display="block";
                clearModels();
            },
            success:function (response) {
                if(response.result=="success"){
                    $("#model-data-loading").style.display="none";
                    var brainArray=response.brain_array;
                    if(brainArray.length==0){
                        $("#empty-data").style.display="visible";
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
                $("#model-data-loading").style.display="none";
                swal("系统错误", "请稍后重试", "error");
            }
        });
    }

}]);

