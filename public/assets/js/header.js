$(".header .searchSection .seeAdvanced").click(function () {
    $(".header .searchSection .advanced").toggleClass("advancedHidden");
    $(".header .searchSection i.fa-angle-down").toggleClass("rotated");
})

$(".header .searchSection .advanced label.radioLabel").click(function () {
    $(this).toggleClass("selected");
})