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
$(".loginPage .next")
.on('click', function(e) {
    var input = $(".phoneInput").val();
    $(".phoneInput").val(input);
    if (!validateEmail(input))
    {
        placeholderError(".phoneInput","pass is wrong");
        notifError("لطفا ایمیل یا شماره تلفن معتبر وارد نمایید")
        e.preventDefault();

    }
    
});