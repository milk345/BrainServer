var practiceController = angular.module('nerve.app');

practiceController.controller("practiceCtrl",["$scope","$state",function($scope,$state){
    var pageSize=20;
    getBrainByPage(0);
    $("#upload-data").unbind('click').click(function () {
        $scope.uploading=true;
        $scope.$apply();
        fileUpload();
    })
    $("#practice-now").unbind('click').click(function () {
        practiceNow();
    })
    function labelFileUpload() {
        //标签数据
        data = new FormData();

        data.append("file",document.querySelector("#label-data-file").files[0]);
        data.append("user_id",sessionStorage.getItem("userId"));
        data.append("access_token",sessionStorage.getItem("accessToken"));
        data.append("brain_id",sessionStorage.getItem("practiceBrainId"));
        $.ajax({
            url: '../brain/uploadLabelData',
            type: 'POST',
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            beforeSend:function () {
            },
            success:function (response) {
                $scope.uploading=false;
                $scope.$apply();
                swal("已上传！", "", "success");
            },
            error:function () {
                $scope.uploading=false;
                $scope.$apply();
                swal("系统错误", "请稍后重试", "error");
            }

        })
    }
    function practiceFileUpload() {
        var data = new FormData();

        data.append("file",document.querySelector("#practice-data-file").files[0]);
        data.append("user_id",sessionStorage.getItem("userId"));
        data.append("access_token",sessionStorage.getItem("accessToken"));
        data.append("brain_id",sessionStorage.getItem("practiceBrainId"));
        $.ajax({
            url: '../brain/uploadPraticeData',
            type: 'POST',
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            beforeSend:function () {
            },
            success:function (response) {
                labelFileUpload();
            },
            error:function () {
                $scope.uploading=false;
                $scope.$apply();
                swal("系统错误", "请稍后重试", "error");
            }

        })





    }














































    function clearModels(){
        var modelList=$("#practice-model-list").find("ul");
        if(modelList.length>1){
            //模板不删
            for(var i=1;i<modelList.length-1;i++){
                modelList[i].remove();
            }
        }
    }



    function setClickEvent(){
        var modelList=document.getElementById("practice-model-list").getElementsByTagName("ul");
        for(var i=1;i<modelList.length;i++){
            (function(n){
                var liForClick= modelList[n].getElementsByTagName("li")[0]
                liForClick.onclick = function(){
                    var modelId=liForClick.getElementsByTagName("a")[0].getAttribute("modelId");
                    sessionStorage.setItem("practiceBrainId",modelId);
                    $('#practice-data-file')[0].value="";
                    $('#label-data-file')[0].value="";

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
        var $cloneObject=$("#pratice-model-template").clone();
        $cloneObject.find("a input").attr("value",modelName);
        $cloneObject.css("display",'inline');
        $cloneObject.find("a").attr("modelId",modelId);
        $("#practice-model-list").children().eq(-2).after($cloneObject);
    }



    function practiceNow(){

        var sendData={
            "user_id":sessionStorage.getItem("userId"),
            "access_token":sessionStorage.getItem("accessToken"),
            "brain_id":sessionStorage.getItem("practiceBrainId")
        };
        $.ajax({
            url:"../brain/praticeBrain",
            type:"post",
            dataType:"json",
            data:JSON.stringify(sendData),
            contentType:"application/json",
            beforeSend:function () {
                $scope.practicing=true;
            },
            success:function (response) {
                if(response.result=="success"){
                    $scope.practicing=false;
                    $scope.$apply();
                    swal("训练成功", "感谢您的支持！", "success");
                    return;
                }
                if(response.result=="lack_data"){
                    $scope.practicing=false;
                    $scope.$apply();
                    swal("这个模型还没有上传数据", "请按照模板上传训练数据", "error");
                    return;
                }
                if(response.result=="wrong_brain"){
                    $scope.practicing=false;
                    $scope.$apply();
                    swal("模型错误", "可能这个模型的ID被搞错了，请刷新重试", "error");
                    return;
                }
                $scope.practicing=false;
                $scope.$apply();
                swal("系统错误", "请稍后重试", "error");
            },
            error:function () {
                $scope.practicing=false;
                $scope.$apply();
                swal("系统错误", "请稍后重试", "error");
            }
        });
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

