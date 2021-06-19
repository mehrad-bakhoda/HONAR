
    setInterval(function(){ 
        $(".loginPage .code .codeAgain").fadeIn(400);
        $(".loginPage .code .codeAgain").removeClass("hidden");
        
        

    }, 10000);
    $( ".loginPage .code .codeAgain").on( "click", function() {
        var phoneNumber=document.forms["verifyCodeSubmition"]["loginInput"].value;
        var formData = {phone:phoneNumber}; 

        $.ajax({
            url : "/sendAgain",
            type: "POST", 
            data : formData, 
            async : true, 
        });
        $(".loginPage .code .codeAgain").fadeOut(400);
      });
let timeout;
let password = $("#uploaderPassword");
let passwordD = $("#downloaderPassword")
let strengthBadge = document.getElementById('StrengthDisp');
let strengthBadgeD = document.getElementById('StrengthDispD');
let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))');

function StrengthChecker(strengthBadge,PasswordParameter){

    if(strongPassword.test(PasswordParameter)) {
        strengthBadge.style.backgroundColor = "#1a981f"
        strengthBadge.textContent = 'Strong'
    } else if(mediumPassword.test(PasswordParameter)){
        strengthBadge.style.backgroundColor = '#0098c5'
        strengthBadge.textContent = 'Medium'
    } else{
        strengthBadge.style.backgroundColor = '#d14774'
        strengthBadge.textContent = 'Weak'
    }
}
password.on('input',() => {
    //The badge is hidden by default, so we show it

    strengthBadge.style.display= 'block'
    clearTimeout(timeout);

    //We then call the StrengChecker function as a callback then pass the typed password to it

    timeout = setTimeout(() => StrengthChecker(strengthBadge,password.val()), 500);

    //Incase a user clears the text, the badge is hidden again

    if(password.val().length !== 0){
        strengthBadge.style.display != 'block'
    } else{
        strengthBadge.style.display = 'none'
    }
});
passwordD.on('input',() => {

    strengthBadgeD.style.display= 'block'
    clearTimeout(timeout);
    timeout = setTimeout(() => StrengthChecker(strengthBadgeD,passwordD.val()), 500);
    if(passwordD.val().length !== 0){
        strengthBadgeD.style.display != 'block'
    } else{
        strengthBadgeD.style.display = 'none'
    }
});
    

