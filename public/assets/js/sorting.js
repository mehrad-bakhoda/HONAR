$(".sorting label.sortOption").click(function () {
    var sorts = $(".soring label.sortOption");
    $(".sorting label.selectedSort").text($(this).text());

    for (var i = 0; i < sorts.length; i++) {
        $(sorts[i]).removeClass("selected");
    }
    $(this).toggleClass("selected");

    $(".sorting").toggleClass("opened");
    $(".sorting label.sortOption").toggleClass("show");
    $(".sorting i").toggleClass("rotated");
})

$(".sorting .shownSort").click(function () {
    $(".sorting").toggleClass("opened");
    $(".sorting label.sortOption").toggleClass("show");
    $(".sorting i").toggleClass("rotated");
    if (!$(".searchPage .advanced").hasClass("advancedHidden")) {
        $(".searchPage .advanced").addClass("advancedHidden")
    }
});