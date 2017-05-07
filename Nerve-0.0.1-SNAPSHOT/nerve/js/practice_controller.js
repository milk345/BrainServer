var practiceController = angular.module('nerve.app');

practiceController.controller("practiceCtrl",["$scope","$state",function($scope,$state){
    var pageSize=20;


    $scope.uploading=false;
    $scope.loadingModel=false;
    $("#upload-data").click(function () {
        fileUpload();
    })
    function fileUpload() {
        var data = new FormData($('#pratice-data-file'));

        if(data.valueOf("file")==""){
            swal("未选择文件", "请选择pratice数据文件", "error");
        }

        data.append("user_id",sessionStorage.getItem("userId"));
        data.append("access_token",sessionStorage.getItem("accessToken"));
        data.append("brain_id",sessionStorage.getItem("praticeBrainId"));
        $.ajax({
            url: '../brain/uploadPraticeData',
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




        //标签数据
        data = new FormData($('#label-data-file'));

        if(data.valueOf("file")==""){
            swal("未选择文件", "请选择label数据文件", "error");
        }

        data.append("user_id",sessionStorage.getItem("userId"));
        data.append("access_token",sessionStorage.getItem("accessToken"));
        data.append("brain_id",sessionStorage.getItem("praticeBrainId"));
        $.ajax({
            url: '../brain/uploadLabelData',
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
        var modelList=document.getElementById("pratice-model-list").getElementsByTagName("ul");
        for(var i=1;i<modelList.length;i++){
            (function(n){
                var liForClick= modelList[n].getElementsByTagName("li")[0]
                liForClick.onclick = function(){
                    var modelId=liForClick.getElementsByTagName("a")[0].attr("modelId");
                    sessionStorage.setItem("praticeBrainId",modelId);
                    $('#pratice-data-file')[0].value="";
                    $('#label-data-file')[0].value="";

                    //清空全部的class
                    for(var j=0; j<modelList.length;j++){
                        modelList[n].getElementsByTagName("li")[0].className="model-item";
                    }
                    //设置选中项
                    modelList[n].getElementsByTagName("li")[0].className="model-item-selected";



                }
            })(i);
        }
    }
    function addModelItem(modelName,modelId){
        var $cloneObject=$("#pratice-model-template").clone();
        $cloneObject.find("a input").attr("value",modelName);
        $cloneObject.css("display",'inline');
        $cloneObject.find("a").attr("modelId",modelId);
        $("#pratice-model-list").children().eq(-2).after($cloneObject);
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

