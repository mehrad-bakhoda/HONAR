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
    const phone = /^[0-9]{11}$/;
    return phone.test(input)
}


//login notif
$(".loginPage .login .next")
.on('click', function(e) {
    
    var input = $(".phoneInput").val();
    $(".phoneInput").val(input);
    if (!validateEmail(input))
    {
        placeholderError(".phoneInput","لطفا شماره تلفن معتبر وارد نمایید");
        notifError("لطفا شماره تلفن معتبر وارد نمایید");
        e.preventDefault();

    }

});
function validateUploaderChangeForm(){

  var userName=document.forms["changInformationForm"]["userName"].value;
  var oldPassword=document.forms["changInformationForm"]["oldPassword"].value;
  var password=document.forms["changInformationForm"]["password"].value;
  var passwordConfirmation=document.forms["changInformationForm"]["passwordConfirmation"].value;
  if(userName==""){
    notifError("لطفا نام کاربری را وارد کنید");
    return false;
  }else if(userName.length<5){
    notifError("نام کاربری باید حداقل 5 کارکتر باشد");  
    return false;
  }else if(oldPassword==""){
    notifError("رمز عبور  خود را وارد کنید");
    return false;
}else if(password!=""){
  if(password !== passwordConfirmation){
    notifError("رمز عبور ها با هم شباهتی ندارند");
    
    password="";
    passwordConfirmation="";
    return false;
  }if(password.length<8){
    notifError("رمز عبور باید حداقل 8 کارکتر باشد");
    return false;
  }
}


  return true;
}

function validateDownloaderChangeForm(){

  var oldPassword=document.forms["changInformationForm2"]["oldPassword"].value;
  var password=document.forms["changInformationForm2"]["password"].value;
  var passwordConfirmation=document.forms["changInformationForm2"]["passwordConfirmation"].value;
if(oldPassword==""){
    notifError("رمز عبور  خود را وارد کنید");
    return false;
}else if(password!=""){
  if(password !== passwordConfirmation){
    notifError("رمز عبور ها با هم شباهتی ندارند");
    
    password="";
    passwordConfirmation="";
    return false;
  }if(password.length<8){
    notifError("رمز عبور باید حداقل 8 کارکتر باشد");
    return false;
  }
}


  return true;
}


function validateDownloaderForm(){
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


function validateUploaderForm(){
  var userName=document.forms["uploaderForm"]["userName"].value;
  var password=document.forms["uploaderForm"]["password"].value;
  var passwordConfirmation=document.forms["uploaderForm"]["passwordConfirmation"].value;
  let strengthBadge = document.getElementById('StrengthDisp');


  if(password=="" || passwordConfirmation=="" || userName==""){
    notifError("لطفا اطلاعات خواسته شده را وارد کنید");

if(userName==""){
  placeholderError(".userNameInput","نام کاربری خود را وارد کنید");
  return false;
}
else if(password==""){
  placeholderError(".passwordInput","لطفا رمز خود را وارد کنید");
  return false;
}
else if(passwordConfirmation==""){
  placeholderError(".passwordConfirmationInput","لطفا رمز خود را دوباره وارد کنید");
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
  if(strengthBadge.textContent === 'Weak'){
    notifError("پسوورد شما امن نیست");
    return false;
  }
}
