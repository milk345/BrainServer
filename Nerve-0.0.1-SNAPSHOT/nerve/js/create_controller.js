var createController = angular.module("nerve.app");


//createController.controller("createCtrl",["$scope","$state","oc.lazyLoad",function($scope,$state,$ocLazyLoad){
createController.controller("createCtrl",["$scope","$state",function($scope,$state){

    // 基于准备好的dom，初始化echarts实例
    var myChart = deps.echarts.init(document.getElementById('chart'));
    myChart.showLoading();




    var brain={
        forwardBrain:'<gexf xmlns="http://www.gexf.net/1.2draft" version="1.2" xmlns:viz="http://www.gexf.net/1.2draft/viz"' +
        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.gexf.net/1.2draft http://www.gexf.net/1.2draft/gexf.xsd">'+
        '<meta lastmodifieddate="2014-01-30">' +
        '<creator>Gephi 0.8.1</creator>' +
        '<description></description>' +
        '</meta>' +
        '<graph defaultedgetype="undirected" mode="static">' +

        '<nodes> ',
        middleBrain: '</nodes>' +
        '<edges>' ,
        backwardBrain: '</edges>' +
        '</graph>' + '</gexf>',
        nodeLayers:[],
        linkLayers:[],
        //addNode:function(node){
        //    this.nodes.push(node);
        //},
        //addEdge:function(edge){
        //    this.edges.push(edge);
        //},
        build:function(){
            var brain=this.forwardBrain;
            //放弃无序的节点堆和连接堆
            var layers=this.nodeLayers;
            for( i=0;i<layers.length;i++){
                for(j=0;j<layers[i].length;j++){
                    brain+=layers[i][j].build();
                }
            }
            brain+=this.middleBrain;
            //添加神经连接
            layers=this.linkLayers;
            for( i=0;i<layers.length;i++){
                for(j=0;j<layers[i].length;j++){
                    brain+=layers[i][j].build();
                }
            }
            brain+=this.backwardBrain;
            return brain;
        }
        }

    function render(xml) {
        myChart.hideLoading();



        var graph = echarts.dataTool.gexf.parse(xml);
        var categories = [];
        //暂时不需要类目
        //for (var i = 0; i < 9; i++) {
        //    categories[i] = {
        //        name: '类目' + i
        //    };
        //}
        graph.nodes.forEach(function (node) {
            node.itemStyle = null;
            node.value = node.symbolSize;
            node.symbolSize /= 1.5;
            node.label = {
                normal: {
                    show: node.symbolSize > 30
                }
            };
            node.category = node.attributes.modularity_class;
        });
        option = {
            title: {
                text: 'Milk, getting you out of the fucking world',
                subtext: 'Default layout',
                top: 'bottom',
                left: 'right'
            },
            tooltip: {},
            legend: [{
                // selectedMode: 'single',
                data: categories.map(function (a) {
                    return a.name;
                })
            }],
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    name: 'milk\'s node',
                    type: 'graph',
                    layout: 'none',
                    data: graph.nodes,
                    links: graph.links,
                    categories: categories,
                    roam: true,
                    label: {
                        normal: {
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: 'source',
                            curveness: 0.3
                        }
                    }
                }
            ]
        }

        myChart.setOption(option);

    }
    function findLargestLayer(layers) {
        var maxLayer=layers[0];
        var len = layers.length;
        for (var i = 1; i < len; i++) {
            if (layers[i].length > maxLayer) {
                maxLayer = layers[i];
            }
        }
        return maxLayer;
    }
    function editBrainLayer(layerIndex,nodeNumber){
        if( nodeNumber<1||layerIndex<0||layerIndex>=brain.nodeLayers.length) return;
        var edittingNodeLayer=brain.nodeLayers[layerIndex];
        var height=100;
        var width=50;
        var nodeLayers= brain.nodeLayers;
        var linkLayers=brain.linkLayers;

        //
        var nodePositionY=edittingNodeLayer[0].y;


        //控制形状
        var paddingStart;
        if(nodeLayers.length<=0){
            paddingStart=0;
        }else{
            var largestLayerNodeNumber=findLargestLayer(nodeLayers).length;
            paddingStart=((largestLayerNodeNumber-nodeNumber)/2)*width;
        }
        var lack=nodeNumber-edittingNodeLayer.length;
        if(lack<0){
            //如果lack为负数，说明得减少节点
            edittingNodeLayer.splice(edittingNodeLayer.length-1+lack, -lack);
            for(var i=0;i<edittingNodeLayer.length;i++){
                var nodePositionX=paddingStart+width*i;
                edittingNodeLayer[i].setPositionX(nodePositionX);
                edittingNodeLayer[i].setValue(adjustValue(nodeNumber));
            }
            //更新到大脑
            nodeLayers.splice(layerIndex,1,edittingNodeLayer);
        }else if(lack>0){
            //如果lack为正数,得增加节点
            //修正横坐标
            for(var i=0;i<edittingNodeLayer.length;i++){
                var nodePositionX=paddingStart+width*i;
                edittingNodeLayer[i].setPositionX(nodePositionX);
                edittingNodeLayer[i].setValue(adjustValue(nodeNumber));
            }
            var existedDistance=width*edittingNodeLayer.length;
            //增加节点
            for(i=0;i<lack;i++){
                var nodePositionX=paddingStart+width*i+existedDistance;
                var node=nodeBuilder(nodePositionX,nodePositionY,adjustValue(nodeNumber));
                edittingNodeLayer.push(node);
            }
            //更新到大脑
            nodeLayers.splice(layerIndex,1,edittingNodeLayer);
        }else if(lack==0) return;





        //描边，头尾要改的连接可不一样
        if(layerIndex<nodeLayers.length-1&&layerIndex>0){

            //前后层均要描绘
            var frontNodeLayer=nodeLayers[layerIndex-1];
            var backNodeLayer=nodeLayers[layerIndex+1];
            var newFrontLinkLayer=[];
            var newBackLinkLayer=[];
            for(i=0;i<frontNodeLayer.length;i++){
                var frontNode=frontNodeLayer[i];
                for(j=0;j<edittingNodeLayer.length;j++){
                    var edge=edgeBuilder(frontNode.id,edittingNodeLayer[j].id);
                    newFrontLinkLayer.push(edge);
                }
            }
            for(i=0;i<backNodeLayer.length;i++){
                var backNode=backNodeLayer[i];
                for(j=0;j<edittingNodeLayer.length;j++){
                    var edge=edgeBuilder(backNode.id,edittingNodeLayer[j].id);
                    newBackLinkLayer.push(edge);
                }
            }
            //这里是插入，不要搞成push了,顺便删除和替换神经连接
            linkLayers.splice(layerIndex-1,2,newFrontLinkLayer,newBackLinkLayer);
            //第一个
        }else if(layerIndex==0){
            if(nodeLayers.length<=1)return;
            //修改后一层
            var backNodeLayer=nodeLayers[layerIndex+1];
            var newBackLinkLayer=[];
            for(i=0;i<backNodeLayer.length;i++){
                var backNode=backNodeLayer[i];
                for(j=0;j<edittingNodeLayer.length;j++){
                    var edge=edgeBuilder(backNode.id,edittingNodeLayer[j].id);
                    newBackLinkLayer.push(edge);
                }
            }
            linkLayers.splice(layerIndex,1,newBackLinkLayer);
            //最后一个
        }else if(layerIndex>=nodeLayers.length-1){
            //修改前一层
            var frontNodeLayer=nodeLayers[layerIndex-1];
            var newFrontLinkLayer=[];
            for(i=0;i<frontNodeLayer.length;i++){
                var frontNode=frontNodeLayer[i];
                for(j=0;j<edittingNodeLayer.length;j++){
                    var edge=edgeBuilder(frontNode.id,edittingNodeLayer[j].id);
                    newFrontLinkLayer.push(edge);
                }
            }
            linkLayers.splice(layerIndex-1,1,newFrontLinkLayer);
        }

    }
    function deleteBrainLayer(layerIndex){
        if(layerIndex<0) return;

        var nodeLayers=brain.nodeLayers;
        var linkLayers=brain.linkLayers;


        nodeLayers.splice(layerIndex,1);

            //头尾要删的连接可不一样，这里是比较length，因为是看删除的NodeLayer是否为最后一层，这里NodeLayer已经提前被删了一层，所以最后一层是length
        if(layerIndex<nodeLayers.length&&layerIndex>0){

            //补连上前后层，擦屁股
            var frontNodeLayer=nodeLayers[layerIndex-1];
            var backNodeLayer=nodeLayers[layerIndex];
            var newLinkLayer=[];
            for(i=0;i<frontNodeLayer.length;i++){
                var frontNode=frontNodeLayer[i];
                for(j=0;j<backNodeLayer.length;j++){
                    var edge=edgeBuilder(frontNode.id,backNodeLayer[j].id);
                    newLinkLayer.push(edge);
                }
            }
            //这里是插入，不要搞成push了,顺便删除和替换神经连接
            linkLayers.splice(layerIndex-1,2,newLinkLayer);
        }else if(layerIndex==0){
            linkLayers.splice(layerIndex,1);
        }else if(layerIndex>=nodeLayers.length){
            linkLayers.splice(layerIndex-1,1);
        }
    }
    function adjustHeight(number){
        //以100为基数，乘以与10个球的比例得到
        return number*10;
    }
    function adjustValue(number){
        //
        return 28/number;
    }
    function addBrainLayerByPosition(nodeNumber,position){
        var addedNodeLayer=[];
        if( nodeNumber<1) return;
        var height=100;
        var width=50;
        var layers= brain.nodeLayers;
        if (position>layers.length-1)return;




        //层数会被删减，但图形绝对位置不变，所以必须在原来基础上加
        var nodePositionY;
        if(layers.length>0){
            nodePositionY=layers[position][0].y;
        }else  nodePositionY=0;

        //控制形状
        var paddingStart;
        if(layers.length<=0){
            paddingStart=0;
        }else{
            var largestLayerNodeNumber=findLargestLayer(layers).length;
            paddingStart=((largestLayerNodeNumber-nodeNumber)/2)*width;
        }
        //生成节点
        for(i=0;i<nodeNumber;i++){
            var nodePositionX=paddingStart+width*i;
            var node=nodeBuilder(nodePositionX,nodePositionY,adjustValue(nodeNumber));
            //brain.addNode(node);
            addedNodeLayer.push(node);
        }
        if(position==0){

            if(layers.length<=0){
                //如果还没有层，加入第一层
                layers.push(addedNodeLayer);
                return;
            }
            //开始描边
            var secondLayer=layers[0];
            var addedLinkLayer=[];
            for(i=0;i<secondLayer.length;i++){
                var oldNode=secondLayer[i];
                for(j=0;j<addedNodeLayer.length;j++){
                    var edge=edgeBuilder(oldNode.id,addedNodeLayer[j].id);
                    addedLinkLayer.push(edge);
                }
            }
            brain.linkLayers.push(addedLinkLayer);

            //下移所有节点
            for(i=0;i<layers.length;i++){
                for(j=0;j<layers[i].length;j++){
                    layers[i][j].y+=height;
                }
            }
            //描完边再加入层
            layers.splice(0,0,addedNodeLayer);


            //跟上下都要描边，并且要把旧边删去
        }else if(position<=layers.length-1){



            //开始描边
            var frontLayer=layers[position-1];
            var addedFrontLinkLayer=[];
            var backLayer=layers[position];
            var addedBackLinkLayer=[];
            brain.linkLayers.splice(position-1,1);
            for(i=0;i<frontLayer.length;i++){
                var oldNode=frontLayer[i];
                for(j=0;j<addedNodeLayer.length;j++){
                    var edge=edgeBuilder(oldNode.id,addedNodeLayer[j].id);
                    addedFrontLinkLayer.push(edge);
                }
            }
            brain.linkLayers.push(addedFrontLinkLayer);
            for(i=0;i<backLayer.length;i++){
                var oldNode=backLayer[i];
                for(j=0;j<addedNodeLayer.length;j++){
                    var edge=edgeBuilder(oldNode.id,addedNodeLayer[j].id);
                    addedBackLinkLayer.push(edge);
                }
            }
            brain.linkLayers.push(addedBackLinkLayer);

            //下移position后面所有节点
            for(i=position;i<layers.length;i++){
                for(j=0;j<layers[i].length;j++){
                    layers[i][j].y+=height;
                }
            }

            //描完边再加入层
            layers.splice(position,0,addedNodeLayer);


        }
    }
    function addBrainLayer(nodeNumber){
        var addedNodeLayer=[];
        if( nodeNumber<1) return;
        var height=100;
        var width=50;
        var layers= brain.nodeLayers;

        //层数会被删减，但图形绝对位置不变，所以必须在原来基础上加
        var nodePositionY;
        if(layers.length>0){
             nodePositionY=layers[layers.length-1][0].y+height;
        }else  nodePositionY=0;

        //控制形状
        var paddingStart;
        if(layers.length<=0){
            paddingStart=0;
        }else{
            var largestLayerNodeNumber=findLargestLayer(layers).length;
            paddingStart=((largestLayerNodeNumber-nodeNumber)/2)*width;
        }
        //生成节点
         for(i=0;i<nodeNumber;i++){
             var nodePositionX=paddingStart+width*i;
             var node=nodeBuilder(nodePositionX,nodePositionY,adjustValue(nodeNumber));
             //brain.addNode(node);
             addedNodeLayer.push(node);
         }
        if(layers.length<=0){
            //如果还没有层，加入第一层
            layers.push(addedNodeLayer);
            return;
        }
        //开始描边
        var lastLayer=layers[layers.length-1];
        var addedLinkLayer=[];
        for(i=0;i<lastLayer.length;i++){
            var oldNode=lastLayer[i];
            for(j=0;j<addedNodeLayer.length;j++){
                var edge=edgeBuilder(oldNode.id,addedNodeLayer[j].id);
               addedLinkLayer.push(edge);
            }
        }
        brain.linkLayers.push(addedLinkLayer);
        //描完边再加入层
        layers.push(addedNodeLayer);

    }


    function test(){

        addBrainLayer(15);
        addBrainLayer(8);
        addBrainLayer(6);
        addBrainLayer(2);
        addBrainLayer(2);
        addBrainLayer(4);
        addBrainLayer(6);
        addBrainLayer(8);
        addBrainLayer(15);
        deleteBrainLayer(5);
        deleteBrainLayer(6);
        deleteBrainLayer(5);
        console.log(brain.build());
        render(brain.build());

    }
    var nodeIdGenerater={
        id:0,
        getId:function(){
            this.id++;
            return this.id;
        }
    };
    var edgeIdGenerater={
        id:0,
        getId:function(){
            this.id++;
            return this.id;
        }
    };
    function edgeBuilder(source,target){

        var edge={
            source:0,
                target:0,
            id:-1,
            setId:function(id){
            this.id=id;
        },
            setSource:function(source){
                this.source=source;
            },
            setTarget:function(target){
                this.target=target;
            },
            build:function(){
                if(this.id==-1){
                    return "not initialized"
                }

                return  '<edge id="'+this.id+'" source="'+this.source+'" target="'+this.target+'">' +
                    '<attvalues></attvalues>' +
                    '</edge>'

            }
        };
        edge.setId(edgeIdGenerater.getId());
        edge.setSource(source);
        edge.setTarget(target);
        return edge;
    }
  function nodeBuilder(x,y,value){

      var node={
          x:0,
          y:0,
          id:-1,
          value:25,
          label:'Miracle',
          setId:function(id){
              this.id=id;
          },
          setPositionX:function(x){
              this.x=x;
          },
          setPositionY:function(y){
              this.y=y;
          },
          setLabel:function(label){
              this.label=label;
          },
          setValue:function(value){
               this.value=value;
          },
          build:function(){

              if(this.id==-1){
                  return "not initialized"
              }

              return   '<node id="'+this.id+'" label="'+this.label+'">' +
                  ' <attvalues> <attvalue for="modularity_class" value="0"></attvalue> </attvalues> ' +
                  '<viz:size value="'+this.value+'"></viz:size>' +
                  '<viz:position x="'+
                  this.x+
                  '" y="'+
                  this.y +
                  '" z="0.0"></viz:position>' +
                  '<viz:color r="235" g="81" b="72"></viz:color>'+
                  '</node>'
          }}

      node.setId(nodeIdGenerater.getId());
      node.setPositionX(x);
      node.setPositionY(y);
      node.setLabel(node.id);
      node.setValue(value);
      return node;

  }





















    $("#saveBrain").unbind('click').click(function(){
        readyForSavingBrain();
    })

    $("#addInPut").unbind('click').click(function(){
        addInputNode();
    })
    $("#addOutPut").unbind('click').click(function(){
        addOutputNode();
    })
    $("#addLayer").unbind('click').click(function(){
        addLayer();
    })

    //$scope.deleteNode=function (toBeDelete){
    //    console.log(typeof(toBeDelete.parentNode)+"");
    //    console.log(toBeDelete);
    //    toBeDelete.parent().removeChild();
    //
    //
    //}
    function addLayer() {
        if($('.layer:last').find("input:first").val()==""){
            alert("请先填写本层神经元数量");
            return;
        }
        clearNumberInput("nerve-list")

        //更新神经网络图
        var ul = document.getElementById("nerve-list");
        var list = ul.getElementsByTagName("li");
        var theNewOne = list.length-1;
        var nodeNumber=list[theNewOne].getElementsByTagName("input")[0].value;
        addBrainLayerByPosition(nodeNumber,brain.nodeLayers.length-1);
        render(brain.build());


        //将旧的input框隐去，换成button
        $(".layer:last").find("input").hide();
        $(".layer:last").find("button")[0].innerHTML=  $(".layer:last").find("input").val();
        $(".layer:last").find("button:first").show();


        var $cloneObject=$(".layer:last").clone();
        $cloneObject.find("input").val("");
        $cloneObject.find("input:first").attr("data-AcademyId","");
        //新建的input要显示出来,不能用show，否则会inline样式会丢失
        $cloneObject.find("input:first").attr("style","display: inline;width: 100px");
        $(".layer:last").after($cloneObject);
        $(".layer-delete").show();
        //隐藏蓝色按钮
        $(".layer:last").find("button:first").hide();

        //设置删除属性
        setNumberDeleteEvent("nerve-list");
        //设置编辑属性
        setNumberEditEvent("nerve-list");

    }
    function addOutputNode() {
        if($('.output-node:last').find("input:first").val()==""){
            alert("请先填写当前的输出层参数名");
            return;
        }

        clearContentInput("output-list")

        //更新神经网络图
        var ul = document.getElementById("output-list");
        var list = ul.getElementsByTagName("li");
        if(list.length>1) {
            //第一次
            editBrainLayer(brain.nodeLayers.length - 1, brain.nodeLayers[brain.nodeLayers.length - 1].length + 1);
            render(brain.build());
        }

        //将旧的input框隐去，换成button
        $(".output-node:last").find("input").hide();
        $(".output-node:last").find("button")[0].innerHTML=  $(".output-node:last").find("input").val();
        $(".output-node:last").find("button:first").show();


        var $cloneObject=$(".output-node:last").clone();
        $cloneObject.find("input").val("");
        $cloneObject.find("input:first").attr("data-AcademyId","");
        //新建的input要显示出来,不能用show，否则会inline样式会丢失
        $cloneObject.find("input:first").attr("style","display: inline;width: 100px");
        $(".output-node:last").after($cloneObject);
        $(".output-node-delete").show();
        //隐藏蓝色按钮
        $(".output-node:last").find("button:first").hide();
        //设置删除属性
        setFootDeleteEvent("output-list")
        //设置编辑属性
        setContentEditEvent("output-list");

    }
    function addInputNode() {
        if($('.input-node:last').find("input:first").val()==""){
            alert("请先填写当前的输入层参数名");
            return;
        }


        clearContentInput("input-list")

        //更新神经网络图
        var ul = document.getElementById("input-list");
        var list = ul.getElementsByTagName("li");
        if(list.length>1){
            editBrainLayer(0,brain.nodeLayers[0].length+1);
            render(brain.build());
        }


        //将旧的input框隐去，换成button
        $(".input-node:last").find("input").hide();
        $(".input-node:last").find("button")[0].innerHTML=  $(".input-node:last").find("input").val();
        $(".input-node:last").find("button:first").show();

        var $cloneObject=$(".input-node:last").clone();
        $cloneObject.find("input").val("");
        //$cloneObject.find("input").removeClass("form-controlborder");
        $cloneObject.find("input:last").css("border-style:solid");
        $cloneObject.find("input:first").attr("data-AcademyId","");
        //新建的input要显示出来,不能用show，否则会inline样式会丢失
        $cloneObject.find("input:first").attr("style","display: inline;width: 100px");
        $(".input-node:last").after($cloneObject);
        $(".input-node-delete").css("display",'inline');
        $(".input-node-delete").show();
        //隐藏蓝色按钮
        $(".input-node:last").find("button:first").hide();
        //设置删除属性
        setHeadDeleteEvent("input-list")
        //设置编辑属性
        setContentEditEvent("input-list");
    }
    //检查有无编辑中的节点并处理
    function clearContentInput(ulName){
        var ul = document.getElementById(ulName);
        var list = ul.getElementsByTagName("li");

        //最后一个不作考虑
        for(var i = 0, len = list.length-1; i < len; i++){
            var blueButton = list[i].getElementsByTagName("button")[0];
            var comfirmButton=list[i].getElementsByTagName("button")[2];
            var input=list[i].getElementsByTagName("input")[0];
            var deleteButton=list[i].getElementsByTagName("button")[1];

            (function(n) {
                if (input.style.display=="inline"){
                    //编辑过的节点要更新到神经网络图
                    blueButton.innerHTML = input.value;
                    input.style.display = "none";
                    comfirmButton.style.display = "none";
                    deleteButton.style.display = "inline";
                    blueButton.style.display = "inline";
                }
            })(i);
        }
    }
    //检查有无编辑中的节点并处理
    function clearNumberInput(ulName){
        var ul = document.getElementById(ulName);
        var list = ul.getElementsByTagName("li");

        //最后一个不作考虑
        for(var i = 0, len = list.length-1; i < len; i++){
            var blueButton = list[i].getElementsByTagName("button")[0];
            var comfirmButton=list[i].getElementsByTagName("button")[2];
            var input=list[i].getElementsByTagName("input")[0];
            var deleteButton=list[i].getElementsByTagName("button")[1];

            (function(n) {
                if (input.style.display=="inline"){
                //编辑过的节点要更新到神经网络图
                if (input.value!= brain.nodeLayers[n].length){
                    //考虑输入输出层
                    editBrainLayer(n+1, input.value);
                    render(brain.build());
                }
                blueButton.innerHTML = input.value;
                input.style.display = "none";
                comfirmButton.style.display = "none";
                deleteButton.style.display = "inline";
                blueButton.style.display = "inline";
                }
            })(i);
        }



    }
    function setContentEditEvent(ulName){
        var ul = document.getElementById(ulName);
        var list = ul.getElementsByTagName("li");

        for(var i = 0, len = list.length; i < len; i++){
            (function(n){
                var blueButton = list[i].getElementsByTagName("button")[0];
                var comfirmButton=list[i].getElementsByTagName("button")[2];
                var input=list[i].getElementsByTagName("input")[0];
                var deleteButton=list[i].getElementsByTagName("button")[1];
                blueButton.onclick= function() {
                    blueButton.style.display="none";
                    deleteButton.style.display="none";
                    comfirmButton.style.display="inline";
                    input.style.display="inline";
                }
                comfirmButton.onclick= function() {
                    blueButton.innerHTML=input.value;
                    input.style.display="none";
                    comfirmButton.style.display="none";
                    deleteButton.style.display="inline";
                    blueButton.style.display="inline";
                }

            })(i)
        }
    }
    function setNumberEditEvent(ulName){
        var ul = document.getElementById(ulName);
        var list = ul.getElementsByTagName("li");

        for(var i = 0, len = list.length; i < len; i++){
            (function(n){
                var blueButton = list[i].getElementsByTagName("button")[0];
                var comfirmButton=list[i].getElementsByTagName("button")[2];
                var input=list[i].getElementsByTagName("input")[0];
                var deleteButton=list[i].getElementsByTagName("button")[1];
                blueButton.onclick= function() {
                    blueButton.style.display="none";
                    deleteButton.style.display="none";
                    comfirmButton.style.display="inline";
                    input.style.display="inline";
                }
                comfirmButton.onclick= function() {
                    //考虑输入输出层，n+1
                    editBrainLayer(n+1,input.value);
                    render(brain.build());
                    blueButton.innerHTML=input.value;
                    input.style.display="none";
                    comfirmButton.style.display="none";
                    deleteButton.style.display="inline";
                    blueButton.style.display="inline";

                }

            })(i)
        }
    }
    function setFootDeleteEvent(ulName){
        var ul = document.getElementById(ulName);
        var list = ul.getElementsByTagName("li");

        for(var i = 0, len = list.length; i < len; i++){
            (function(n){
                var deleteButton = list[n].getElementsByTagName("button")[1];
                deleteButton.onclick = function(){

                    if(n==0){
                        //看是否是最后一个
                        if(ul.getElementsByTagName("li").length<=1){
                            deleteButton.style.display="none";
                            var theFirst=list[n].getElementsByTagName("input")[0];
                            theFirst.value="";
                            //蓝色框隐藏,input显示
                            theFirst.style.display="inline";
                            var blueButton=list[n].getElementsByTagName("button")[0];
                            blueButton.style.display="none";
                            //保证有一层垫底
                            //deleteBrainLayer(brain.nodeLayers.length-1);
                            //render(brain.build());
                        }else {
                            if(list[n].getElementsByTagName("input")[0].style.display=="none"){
                                editBrainLayer(brain.nodeLayers.length-1,brain.nodeLayers[brain.nodeLayers.length-1].length-1);
                                render(brain.build());
                            }

                            list[n].remove();
                            setFootDeleteEvent(ulName);
                        }

                    }else   {
                        if(list[n].getElementsByTagName("input")[0].style.display=="none"){
                            editBrainLayer(brain.nodeLayers.length-1,brain.nodeLayers[brain.nodeLayers.length-1].length-1);
                            render(brain.build());
                        }
                        list[n].remove();
                        setFootDeleteEvent(ulName);
                    }
                }
            })(i)
        }
    }
    function setHeadDeleteEvent(ulName){
        var ul = document.getElementById(ulName);
        var list = ul.getElementsByTagName("li");

        for(var i = 0, len = list.length; i < len; i++){
            (function(n){
                var deleteButton = list[n].getElementsByTagName("button")[1];
                deleteButton.onclick = function(){


                    if(n==0){
                        //看是否是最后一个
                        if(ul.getElementsByTagName("li").length<=1){
                            deleteButton.style.display="none";
                            var theFirst=list[n].getElementsByTagName("input")[0];
                            theFirst.value="";
                            //蓝色框隐藏,input显示
                            theFirst.style.display="inline";
                            var blueButton=list[n].getElementsByTagName("button")[0];
                            blueButton.style.display="none";
                            //保证有一层在最前面
                            //deleteBrainLayer(0);
                        }else {
                            if(list[n].getElementsByTagName("input")[0].style.display=="none") {
                                editBrainLayer(0, brain.nodeLayers[0].length - 1);
                                render(brain.build());
                            }
                            list[n].remove();
                            setHeadDeleteEvent(ulName);
                        }

                    }else   {
                        if(list[n].getElementsByTagName("input")[0].style.display=="none") {
                            editBrainLayer(0, brain.nodeLayers[0].length - 1);
                            render(brain.build());
                        }
                        list[n].remove();
                        setHeadDeleteEvent(ulName);
                    }
                }
            })(i)
        }
    }

    function setNumberDeleteEvent(ulName){
        var ul = document.getElementById(ulName);
        var list = ul.getElementsByTagName("li");

        for(var i = 0, len = list.length; i < len; i++){
            (function(n){
                var deleteButton = list[n].getElementsByTagName("button")[1];
                deleteButton.onclick = function(){

                    if(list[n].getElementsByTagName("input")[0].style.display=="none"){
                        deleteBrainLayer(n+1);
                        render(brain.build());
                    }

                    if(n==0){
                        //看是否是最后一个
                        if(ul.getElementsByTagName("li").length<=1){
                            deleteButton.style.display="none";
                            var theFirst=list[n].getElementsByTagName("input")[0];
                            theFirst.value="";
                            //蓝色框隐藏,input显示
                            theFirst.style.display="inline";
                            var blueButton=list[n].getElementsByTagName("button")[0];
                            blueButton.style.display="none";
                        }else {
                            list[n].remove();
                            setNumberDeleteEvent(ulName);
                        }

                    }else   {
                        list[n].remove();
                        setNumberDeleteEvent(ulName);
                    }
                }
            })(i)
        }
    }


    function checkBrowser()
    {
        var browserName=navigator.userAgent.toLowerCase();
        //var ua = navigator.userAgent.toLowerCase();
        var Sys = {};


        if(/msie/i.test(browserName) && !/opera/.test(browserName)){
            strBrowser = "IE: "+browserName.match(/msie ([\d.]+)/)[1];
        }else if(/firefox/i.test(browserName)){
            strBrowser = "Firefox: " + browserName.match(/firefox\/([\d.]+)/)[1];;
        }else if(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)){
            strBrowser = "Chrome: " + browserName.match(/chrome\/([\d.]+)/)[1];
        }else if(/opera/i.test(browserName)){
            strBrowser = "Opera: " + browserName.match(/opera.([\d.]+)/)[1];
        }else if(/webkit/i.test(browserName) &&!(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName))){
            strBrowser = "Safari: ";
        }else{
            strBrowser = "unKnow,未知浏览器 ";
        }
        strBrowser = strBrowser ;
        return strBrowser;
    }

    //添加输入层和输出层
    addBrainLayer(1);
    addBrainLayer(1);
    render(brain.build());






















    function readyForSavingBrain(){
        var name=prompt("请输入您这个神经网络模型的名字","")
        if (name!=null && name!="")
        {
            saveBrain(name);
        }
    }



    function saveBrain(brainName){
        //输入层
        var inputArray=brain.nodeLayers[0];
        var ul = document.getElementById("input-list");
        var inputList=ul.getElementsByTagName("li");
        var inputArrayJson=[];
        for(var i=0;i<inputArray.length;i++){
            var node={"name":inputList[i].getElementsByTagName("input")[0].value}
            inputArrayJson.push(node);
        }


        //输出层
        var outputArray=brain.nodeLayers[brain.nodeLayers.length-1];
        var ul = document.getElementById("output-list");
        var outputList=ul.getElementsByTagName("li");
        var outputArrayJson=[];
        for(var i=0;i<outputArray.length;i++){
            var node={"name":outputList[i].getElementsByTagName("input")[0].value}
            outputArrayJson.push(node);
        };

        //隐含层
        var shape="";
        var layers=brain.nodeLayers;
        for(var i=1;i<layers.length-1;i++){
            shape+=layers[i].length;
            if(i<layers.length-2){
                shape+=",";
            }
        };

        var sendData={
            "user_id":sessionStorage.getItem("userId"),
            "access_token":sessionStorage.getItem("accessToken"),
            "name":brainName,
            "shape":shape,
            "inputs":inputArrayJson,
            "outputs":outputArrayJson
        };
        $.ajax({
            url:"../brain/createBrain",
            type:"post",
            dataType:"json",
            data:JSON.stringify(sendData),
            contentType:"application/json",
            success:function (response) {
                if(response.result=="success"){
                    swal("模型已建立！", "", "success");
                }
            },
            error:function () {
                swal("系统错误", "请稍后重试", "error");
            }
        });





    }




} ]);
