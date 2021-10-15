$(".codeInputs .codeInput").keyup(function (event) {
    var key = event.which;
    if(key == 8)
    {
        $(this).next('.codeInputs .codeInput').val();
        $(this).prev('.codeInputs .codeInput').focus();

    }
    if (this.value.length == this.maxLength) {
        $(this).next('.codeInputs .codeInput').focus();
    }
});
$(".codeInputs .codeInput").keydown(function (evenet) {
    var key = evenet.which;
    if(key >= 48 && key <= 57)
    {
        if (this.value.length == this.maxLength) {
            $(this).val(key - 48);
        }
    }
    if(key >= 96 && key <= 105)
    {
        if (this.value.length == this.maxLength) {
            $(this).val(key - 96);
        }
    }
    
});