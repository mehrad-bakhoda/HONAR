var addToCartButton = $(".addToCart");
var buyButton = $(".buy");
var downloadButton = $(".download");
var bought = $("#bought");
var price1 = $(".infos .price p." + "original").children("span").text();
if(price1 == "" || "original" == bought.val())
    {
        downloadButton.removeAttr('hidden');
        addToCartButton.attr("hidden",true);
        buyButton.attr("hidden",true);
    }
else{
    downloadButton.attr("hidden",true);
    addToCartButton.removeAttr('hidden');
    buyButton.removeAttr('hidden');
}
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

    $(".infos .sizes .options").toggleClass("opened");
    $(".infos .sizes label.sizeOption").toggleClass("show");
    $(".infos .sizes i").toggleClass("rotated");

    currentPrice.addClass("showPrice");
    var price = currentPrice.children("span").text();
    console.log(bought.val());
    if(price == "" || currentID == bought.val())
    {
        downloadButton.removeAttr('hidden');
        addToCartButton.attr("hidden",true);
        buyButton.attr("hidden",true);
    }
    else{
        downloadButton.attr("hidden",true);
        addToCartButton.removeAttr('hidden');
        buyButton.removeAttr('hidden');
    }
 
        
    var href = $('#addToCart').attr('href');
    var href1 = $('#downloadButton').attr('href');
    $('#addToCart').attr('href',href.replace(href.split("/")[3],currentID))
    $('#downloadButton').attr('href',href1.replace(href1.split("/")[3],currentID))
    
})

$(".infos .sizes .shownSize").click(function () {
    $(".infos .sizes .options").toggleClass("opened");
    $(".infos .sizes label.sizeOption").toggleClass("show");
    $(".infos .sizes i").toggleClass("rotated");
});


//////////////////////////////////////////// File Types ////////////////////////////////////////////
$(".infos .fileTypes label.typeOption").click(function () {
    var sizes = $(".infos .sizes label.typeOption");
    $(".infos .fileTypes label.selectedType").text($(this).text());

    for (var i = 0; i < sizes.length; i++) {
        $(sizes[i]).removeClass("selected");
    }
    $(this).toggleClass("selected");

    for (var i = 0; i < prices.length; i++) {
        $(prices[i]).removeClass("showPrice");
    }

    $(".infos .fileTypes .options").toggleClass("opened");
    $(".infos .fileTypes label.sizeOption").toggleClass("show");
    $(".infos .fileTypes i").toggleClass("rotated");

})

$(".infos .fileTypes .shownType").click(function () {
    $(".infos .fileTypes .options").toggleClass("opened");
    $(".infos .fileTypes label.typeOption").toggleClass("show");
    $(".infos .fileTypes i").toggleClass("rotated");
});