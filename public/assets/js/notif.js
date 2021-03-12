function placeholderError(input, message) {
    $(input).attr({ "placeholder": message });
    $(input + "::placeholder").css({ "color": "#d14774" });
}

function notifError(message) {
    $(".notif.error p").html(message);
    $(".notif.error").addClass("showNotif");
}
function notifSucces(message) {
    $(".notif.succes p").html(message);
    $(".notif.success").addClass("showNotif");
}