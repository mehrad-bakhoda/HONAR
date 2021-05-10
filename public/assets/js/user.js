
var showCount = 4;
var starts = [0, 0, 0, 0, 0];
var i=0;




$(".userPage button.seeMore").click(function () {
    showMore(".userPage", 0);
    i=i+4;
    console.log(i);
    console.log(searched.length);
});
hideItems(".userPage");
showMore(".userPage", 0);

if (i==searched.length) {
    $(".userPage button.seeMore").addClass("hiddenItem");
}