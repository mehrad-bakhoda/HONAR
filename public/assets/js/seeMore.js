var startBest = 0;
var showCount = 4;
function hideItems(tabID) {
    var products = $(tabID + " .card.product");
    for (var i = 0; i < products.length; i++) {
        $(products[i]).addClass("hiddenItem");
    }
}
function showMore(tabID) {
    var products = $(tabID + " .card.product");
    for (var i = startBest; i < startBest + showCount; i++) {
        $(products[i]).removeClass("hiddenItem");
    }
    startBest += showCount;
}

$("button.seeMore").click(function () {
    showMore("#bestTabC");
});

hideItems("#bestTabC");
showMore("#bestTabC")