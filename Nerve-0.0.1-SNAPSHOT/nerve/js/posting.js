$(document).ready(function(){
	$(".btn-add").click(function(){
		var $span=$(".span2").val();
		a = parseInt($span);
		$(".span2").val(a + 1);
	});
	$(".btn-reduce").click(function(){
		var $span=$(".span2").val();
	});
});
function Id(id){
	return document.getElementById(id);
}
function changeToop(){
	var file = Id("file");
	if(file.value==''){
		//设置默认图片
		Id("myimg").src='http://sandbox.runjs.cn/uploads/rs/72/huvtowwn/zanwu.png';
	}else{
		preImg("file","myimg");
	}
}
//获取input[file]图片的url Important
function getFileUrl(fileId) {
	var url;
	var file = Id(fileId);
	var agent = navigator.userAgent;
	if (agent.indexOf("MSIE")>=1) {
		url = file.value;
	} else if(agent.indexOf("Firefox")>0) {
		url = window.URL.createObjectURL(file.files.item(0));
	} else if(agent.indexOf("Chrome")>0) {
		url = window.URL.createObjectURL(file.files.item(0));
	}
	return url;
}
//读取图片后预览
function preImg(fileId,imgId) {
	var imgPre =Id(imgId);
	imgPre.src = getFileUrl(fileId);
} 
