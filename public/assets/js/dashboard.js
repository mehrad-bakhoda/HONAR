/* Collapse */
function openContent(className) {
    console.log(className);
    $("." + className + ".part .collapseContent").toggleClass("contentHidden");
    $("." + className + ".part i.fa-angle-down").toggleClass("rotated");
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
$(".personalInfo .buttons .after").click(function () {
    $(".personalInfo input").attr({ 'disabled': 'disabled' });
    $(".personalInfo textarea").attr({ 'disabled': 'disabled' });
});

function validateForm(){
  var password=document.forms["changInformationForm"]["password"];
  var passwordConfirmation=document.forms["changInformationForm"]["passwordConfirmation"];

  if(password !=passwordConfirmation){
    return false;
  }
}
