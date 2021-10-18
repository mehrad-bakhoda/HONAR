/* Pricing */
function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
  return true;
}

function chooseFree(element) {
  $(element + " label.free").addClass("selected");
  $(element + " label.toman").removeClass("shown");
  $(element + " .price").val("0");
}

function chooseMoney(element) {
  $(element + " label.free").removeClass("selected");
  $(element + " label.toman").addClass("shown");
}

$(".pricing.original label.free").click(function () {
  chooseFree(".pricing.original");
});
$(".pricing.original input").focus(function () {
  chooseMoney(".pricing.original");
});

$(".pricing.large label.free").click(function () {
  chooseFree(".pricing.large");
});
$(".pricing.large input").focus(function () {
  chooseMoney(".pricing.large");
});

$(".pricing.medium label.free").click(function () {
  chooseFree(".pricing.medium");
});
$(".pricing.medium input").focus(function () {
  chooseMoney(".pricing.medium");
});

$(".pricing.small label.free").click(function () {
  chooseFree(".pricing.small");
});
$(".pricing.small input").focus(function () {
  chooseMoney(".pricing.small");
});

/* Category */
$(".category .options label.radioLabel").click(function () {
  var labels = $(".category .options label.radioLabel");
  for (var i = 0; i < 4; i++) {
    $(labels[i]).removeClass("selected");
  }
  $(this).addClass("selected");
  if ($(this).text() === "گرافیک") $("#types").val("graphic");
  if ($(this).text() === "عکس") $("#types").val("photo");
  if ($(this).text() === "ویدیو") $("#types").val("clip");
  if ($(this).text() === "GIF") $("#types").val("gif");
});
var png = false;
var jpeg = false;
var psd = false;
/* File Type */
$(".type .options label.radioLabel").click(function () {
  var labels = $(".type .options label.radioLabel");

  $(this).toggleClass("selected");
  if ($(this).text() === "PNG")
    if ($(this).hasClass("selected")) png = true;
    else png = false;
  if ($(this).text() === "JPEG")
    if ($(this).hasClass("selected")) jpeg = true;
    else jpeg = false;
  if ($(this).text() === "PSD")
    if ($(this).hasClass("selected")) psd = true;
    else psd = false;
  var fileTypes = "";
  if (png) fileTypes = fileTypes.concat("png&");
  if (jpeg) fileTypes = fileTypes.concat("jpeg&");
  if (psd) fileTypes = fileTypes.concat("psd&");

  $("#fileTypes").val(fileTypes);
});
