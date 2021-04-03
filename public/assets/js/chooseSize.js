$(".infos .sizes label.sizeOption").click(function () {
    var sizes = $(".infos .sizes label.sizeOption");
    $(".infos .sizes label.selectedSize").text($(this).text());

    for (var i = 0; i < sizes.length; i++) {
        $(sizes[i]).removeClass("selected");
    }
    $(this).toggleClass("selected");

    var prices = $(".infos .price p");
    var currentID = $(this).attr("id");
    var currentPrice = $(".infos .price p." + currentID);
    for (var i = 0; i < prices.length; i++) {
        $(prices[i]).removeClass("showPrice");
    }
    currentPrice.addClass("showPrice");
    var href = $('#addToCart').attr('href');
    $('#addToCart').attr('href',href.replace(href.split("/")[3],currentID))
    
})

$(".infos .sizes .shownSize").click(function () {
    $(".infos .sizes .options").toggleClass("opened");
    $(".infos .sizes label.sizeOption").toggleClass("show");
    $(".infos .sizes i").toggleClass("rotated");
});