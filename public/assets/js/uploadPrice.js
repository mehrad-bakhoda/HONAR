$(".pricing label.free").click(function () {
    $(this).addClass("selected");
    $(".pricing label.toman").removeClass("shown");
});
$(".pricing input").click(function () {
    $(".pricing label.free").removeClass("selected");
    $(".pricing label.toman").addClass("shown");
});