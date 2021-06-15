$(document).ready(function () {
    $(".page").fadeIn(1000);
    $(".uploadButton").fadeIn(1000);
})
$("img").on("taphold", function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
 })
 $('img').bind("contextmenu",function(e){
    return false;
});
$('img').on('dragstart', function(event) { event.preventDefault(); });