var praticeController = angular.module('nerve.app');

praticeController.controller("praticeCtrl",["$scope","$state",function($scope,$state){

    $scope.uploading=false;
    $("#upload-data").click(function () {
        fileUpload();
    })
    function fileUpload() {
        var data = new FormData($('#pratice-data-file'));

        if(data.valueOf("file")==""){
            swal("未选择文件", "请选择pratice数据文件", "error");
        }

        data.append("user_id",sessionStorage.getItem("userId"));
        data.append("access_token",sessionStorage.getItem("access_token"));
        data.append("brain_id",sessionStorage.getItem("pratice_brain_id"));
        $.ajax({
            url: '../../brain/uploadPraticeData',
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
                swal("已上传！", "", "success");
            },
            error:function () {
                $scope.uploading=false;
                swal("系统错误", "请稍后重试", "error");
            }

        })

        data = new FormData($('#label-data-file'));

        if(data.valueOf("file")==""){
            swal("未选择文件", "请选择label数据文件", "error");
        }

        data.append("user_id",sessionStorage.getItem("userId"));
        data.append("access_token",sessionStorage.getItem("access_token"));
        data.append("brain_id",sessionStorage.getItem("pratice_brain_id"));
        $.ajax({
            url: '../../brain/uploadLabelData',
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
                swal("已上传！", "", "success");
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









    function clearModels(){
        var modelList=$(".model-list").find("ul");
        if(modelList.length>1){
            //模板不删
            for(var i=1;i<modelList.length;i++){
                modelList[i].remove();
            }
        }
    }



    function setClickEvent(){
        var modelList=$(".model-list").find("ul");
        for(var i=0;i<modelList.length;i++){
            (function(n){
                modelList[n].onclick = function(){
                    sessionStorage.setItem("pratice_brain_id",modelList[n].find("a").attr("modelId"));
                    $('#pratice-data-file').value="";
                    $('#label-data-file').value="";
                }
            })(i);
        }
    }
    function addModelItem(modelName,modelId){
        var $cloneObject=$("#model-template").clone();
        $cloneObject.find("a").attr("title",modelName);
        $cloneObject.css("display",'inline');
        $cloneObject.find("a").attr("modelId",modelId);
        $("#model-list:last").prev().after($cloneObject);
    }




    function getBrainByPage(pageIndex){


        var sendData={
            "user_id":sessionStorage.getItem("userId"),
            "access_token":sessionStorage.getItem("access_token"),
            "page_size":pageSize,
            "page_index":pageIndex
        };
        $.ajax({
            url:"../../brain/getAllBrain",
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

