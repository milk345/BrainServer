/**
 * Created by Administrator on 2017/4/17.
 */

function organizeWindow() {
    $(document).ready(function(){

    $(".content_to_solid").css("width", getViewpoitWidth() + "px");
    $(".content_to_solid").css("height", getViewpoitHeight() + "px");
    $(".content_to_solid").css("overflow", "auto");
    function getViewpoitHeight() {
        if (document.compatMode == "BackCompat") {
            return document.body.clientHeight;
        } else {
            return document.documentElement.clientHeight;
        }
    }

    function getViewpoitWidth() {
        if (document.compatMode == "BackCompat") {
            return document.body.clientWidth;
        } else {
            return document.documentElement.clientWidth;
        }
    }

    })
}