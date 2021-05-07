$(".seeAdvanced").click(function () {
    $(".advanced").toggleClass("advancedHidden");
    $(".searchSection i.fa-angle-down").toggleClass("rotated");
})

$(".advanced label.radioLabel").click(function () {
    $(this).toggleClass("selected");
})