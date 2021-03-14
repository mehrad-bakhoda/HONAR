/* Pricing */
function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}    
$(".pricing label.free").click(function () {
    $(this).addClass("selected");
    $(".pricing label.toman").removeClass("shown");
    $(".price").val("");
});
$(".pricing input").click(function () {
    
    $(".pricing label.free").removeClass("selected");
    $(".pricing label.toman").addClass("shown");
});

/* Category */
$(".category .options label.radioLabel").click(function () {
    var labels = $(".category .options label.radioLabel");
    for (var i = 0; i < 3; i++) {
        $(labels[i]).removeClass("selected");
    }
    $(this).addClass("selected");
});