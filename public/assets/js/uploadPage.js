/* Pricing */
$(".pricing label.free").click(function () {
    $(this).addClass("selected");
    $(".pricing label.toman").removeClass("shown");
});
$(".pricing input").click(function () {
    $(".pricing label.free").removeClass("selected");
    $(".pricing label.toman").addClass("shown");
});

/* Category */
$(".category .options label.radioLabel").click(function () {
    var labels = $(".category .options label.radioLabel");
    for (var i = 0; i < 3; i++) {
        $(labels[i]).removeClass("selected");
    }
    $(this).addClass("selected");
});