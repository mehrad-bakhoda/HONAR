function placeholderError(input, message) {
    $(input).val()
    $(input).attr({ "placeholder": message });
    $(input + "::placeholder").css({ "color": "#d14774" });
}

function notifError(message) {
    $(".notif.error p").html(message);
    $(".notif.error").addClass("showNotif");
    setTimeout(function() {
        $(".notif.error").removeClass("showNotif");
    }, 4000);
}
function notifSucces(message) {
    $(".notif.succes p").html(message);
    $(".notif.success").addClass("showNotif");
    setTimeout(function() {
        $(".notif.success").removeClass("showNotif");
    }, 4000);
}

function validateEmail(input) {
    const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phone = /^[0-9]{11}$/;
    return email.test(String(input).toLowerCase()) || phone.test(input)
}


//login notif
$(".loginPage .login .next")
.on('click', function(e) {

    var input = $(".phoneInput").val();
    $(".phoneInput").val(input);
    if (!validateEmail(input))
    {
        placeholderError(".phoneInput","لطفا ایمیل یا شماره تلفن معتبر وارد نمایید");
        notifError("لطفا ایمیل یا شماره تلفن معتبر وارد نمایید");
        e.preventDefault();

    }

});

function validateForm(){
  var firstName=document.forms["downloaderForm"]["firstName"].value;
  var password=document.forms["downloaderForm"]["password"].value;
  var passwordConfirmation=document.forms["downloaderForm"]["passwordConfirmation"].value;
  if(firstName=="" || password=="" || passwordConfirmation==""){
    notifError("لطفا اطلاعات خواسته شده را وارد کنید");
    if(firstName==""){
      placeholderError(".firstNameInput","لطفا اسم خود را وارد کنید");
      return false;
    }
    if(passwordConfirmation==""){
      placeholderError(".passwordConfirmationInput","لطفا رمز خود را دوباره وارد کنید");
      return false;
    }
    if(password==""){
      placeholderError(".passwordConfirmation","لطفا رمز خود را وارد کنید");
      return false;
    }
    return false;

  }
  if(password !== passwordConfirmation){
    notifError("رمز عبور ها با هم شباهتی ندارند");
    placeholderError(".passwordConfirmationInput","رمز عبور ها با هم شباهتی ندارند");
    password="";
    passwordConfirmation="";
    return false;
  }
}
