/* Variables */
var showCount = 4;
var starts = [0, 0, 0, 0, 0, 0];


/* Show Best */
$(".homePage #bestTabC button.seeMore").click(function () {
    showMore("#bestTabC", 0);
});
hideItems(".homePage #bestTabC");
showMore(".homePage #bestTabC", 0);

/* Show Down */
$(".homePage #downTabC button.seeMore").click(function () {
    showMore("#downTabC", 1);
});
hideItems(".homePage #downTabC");
showMore(".homePage #downTabC", 1);

/* Show Latest */
$(".homePage #latestTabC button.seeMore").click(function () {
    showMore(".homePage #latestTabC", 2);
});
hideItems(".homePage #latestTabC");
showMore(".homePage #latestTabC", 2);

/* Show Search */
$(".searchPage button.seeMore").click(function () {
    showMore(".searchPage", 3);
});
hideItems(".searchPage");
showMore(".searchPage", 3);

$(".dashboardPage .products button.seeMore").click(function () {
    showMore(".products", 4);
});
hideItems(".dashboardPage .products");
showMore(".dashboardPage .products", 4);


$(".userPage button.seeMore").click(function () {
    showMore(".userPage", 5);
});
hideItems(".userPage .products");
showMore(".userPage .products", 5);




/* Functions */
function hideItems(tabID) {
    var products = $(tabID + " .card.product");
    for (var i = 0; i < products.length; i++) {
        $(products[i]).addClass("hiddenItem");
    }
}
function showMore(tabID, index) {
    var products = $(tabID + " .card.product");
    for (var i = starts[index]; i < starts[index] + showCount; i++) {
        $(products[i]).removeClass("hiddenItem");
    }
    starts[index] += showCount;
}