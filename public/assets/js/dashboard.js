/* Collapse */
function openContent(className) {
    $("." + className + ".part .collapseContent").toggleClass("contentHidden");
    $("." + className + ".part i.fa-angle-down").toggleClass("rotated");
    $("." + className).toggleClass("opened");
}

/* Edit Info */
$(".personalInfo input").attr({'disabled': 'disabled' });
$(".personalInfo textarea").attr({ 'disabled': 'disabled' });
function changeForm() {
    $(".personalInfo .buttons button").toggleClass("hiddenButton");
}
$(".personalInfo .buttons .edit").click(function () {
    $(".personalInfo input").removeAttr("disabled");
    $(".personalInfo textarea").removeAttr("disabled");
});
// $(".personalInfo .buttons .after").click(function () {
//     $(".personalInfo input").attr({ 'disabled': 'disabled' });
//     $(".personalInfo textarea").attr({ 'disabled': 'disabled' });
// });

// function validateForm(){
//   var password=document.forms["changInformationForm"]["password"];
//   var passwordConfirmation=document.forms["changInformationForm"]["passwordConfirmation"];

//   if(password !=passwordConfirmation){
//     return false;
//   }
// }
var showCount = 4;
var starts = [0, 0, 0, 0, 0];


$(".dashboardPage .products button.seeMore").click(function () {
    showMore(".products", 0);
});
hideItems(".dashboardPage .products");
showMore(".dashboardPage .products", 0);




