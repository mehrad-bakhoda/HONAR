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

/* check pass */
function checkConfirm(e) {
    const cPass = e;
    const pass = cPass.parentElement.querySelector(".passwordInput");
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


document.querySelector(".personalInfo .change").onclick = () => {
    document.querySelector(".personalInfo .password").classList.toggle("open");
}

