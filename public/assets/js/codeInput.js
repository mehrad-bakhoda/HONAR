$(".codeInputs .codeInput").keyup(function () {
    if (this.value.length == this.maxLength) {
        $(this).next('.codeInputs .codeInput').focus();
    }
});