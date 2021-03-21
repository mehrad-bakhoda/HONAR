$(".infos .sizes label.sizeOption").click(function () {
    var sizes = $(".infos .sizes label.sizeOption");

    for (var i = 0; i < sizes.length; i++) {
        $(sizes[i]).removeClass("selected");
    }
    $(this).toggleClass("selected");

    var prices = $(".infos .price p");
    var currentID = $(this).attr("id");
    console.log(currentID);
    var currentPrice = $(".infos .price p." + currentID);
    for (var i = 0; i < prices.length; i++) {
        $(prices[i]).removeClass("showPrice");
    }
    currentPrice.addClass("showPrice");
})
