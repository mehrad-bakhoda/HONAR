$(".seeAdvanced").click(function () {
    $(".advanced").toggleClass("advancedHidden");
    $(".searchSection i.fa-angle-down").toggleClass("rotated");
    if ($(".searchPage .sorting").hasClass("opened")) {
        $(".searchPage .sorting").removeClass("opened");
        $(".sorting label.sortOption").removeClass("show");
    }
})

$(".advanced label.radioLabel").click(function () {
    $(this).toggleClass("selected");
})