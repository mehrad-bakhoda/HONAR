
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
let password = $(".passwordInput");
let strengthBadge = document.getElementById('StrengthDisp');
let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))');

function StrengthChecker(PasswordParameter){

    if(strongPassword.test(PasswordParameter)) {
        strengthBadge.style.backgroundColor = "green"
        strengthBadge.textContent = 'Strong'
    } else if(mediumPassword.test(PasswordParameter)){
        strengthBadge.style.backgroundColor = 'blue'
        strengthBadge.textContent = 'Medium'
    } else{
        strengthBadge.style.backgroundColor = 'red'
        strengthBadge.textContent = 'Weak'
    }
}
password.change(function(){
    console.log(password.value);
    console.log($("passwordInput").val());
    console.log(password.val());
    //The badge is hidden by default, so we show it

    strengthBadge.style.display= 'block'
    clearTimeout(timeout);

    //We then call the StrengChecker function as a callback then pass the typed password to it

    timeout = setTimeout(() => StrengthChecker(password.value), 500);

    //Incase a user clears the text, the badge is hidden again

    if(password.value.length !== 0){
        strengthBadge.style.display != 'block'
    } else{
        strengthBadge.style.display = 'none'
    }
});


function checkConfirm(e) {
    const cPass = e;
    const pass = cPass.parentElement.querySelector(".passwordInput");
    console.log(cPass.value + " and " + pass.value)
    if (cPass.value !== pass.value) {
        cPass.classList.add("notSame");
        cPass.classList.remove("same");
    }
    if (cPass.value === pass.value) {
        cPass.classList.remove("notSame");
        cPass.classList.add("same");
    }
    if (cPass.value === "") {
        cPass.classList.remove("notSame");
        cPass.classList.remove("same");
    }
}

const eyes = Array.from(document.querySelectorAll(".loginPage .password i"));
for (eye of eyes) {
    eye.onclick = () => {

        const input = document.querySelector(".loginPage .password .passwordInput");
        if (input.type == "password") {
            input.type = "text";
            document.querySelector(".loginPage .fa-eye").classList.remove("hidden");
            document.querySelector(".loginPage .fa-eye-slash").classList.add("hidden");
        }
        else if (input.type == "text") {
            input.type = "password";
            document.querySelector(".loginPage .fa-eye-slash").classList.remove("hidden");
            document.querySelector(".loginPage .fa-eye").classList.add("hidden");
        }
    }  
}
  

