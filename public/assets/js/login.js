$(".invalid-loginInput").hide();
$(".next")
.on('click', function(e) {
    $('.invalid-loginInput').fadeIn(400);
    $('.invalid-loginInput').delay(1000).fadeOut(400);
    // $(".invalid-loginInput").removeAttr('hidden');
    e.preventDefault();
    // if(!isValid) {
    //   e.preventDefault(); //prevent the default action
    // }
});