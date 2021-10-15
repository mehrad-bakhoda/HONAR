function chooseFree(element) {
    $(element + " label.free").addClass("selected");
    $(element + " label.toman").removeClass("shown");
    $(element + " .price").val("0");
}
if($(".pricing.original  .price").val() == 0)
    chooseFree(".pricing.original")
if($(".pricing.large  .price").val() == 0)
    chooseFree(".pricing.large")
if($(".pricing.medium  .price").val() == 0)
    chooseFree(".pricing.medium")
if($(".pricing.small  .price").val() == 0)
    chooseFree(".pricing.small")

var type = $("#types").val();
if (type == "photo")
    $("#photography").addClass("selected");
else if (type == "graphic")
    $("#graphic").addClass("selected");
else if (type == "clip")
    $("#clip").addClass("selected");
