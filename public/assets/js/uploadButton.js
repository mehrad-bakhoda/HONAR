if ($(window).width() > 1440) {
    cWidth = $(window).width();
    $(".uploadButton").css({ left: (cWidth - 1440) / 2 + 16 });
}

$(window).resize(function () {
    if ($(window).width() > 1440) {
        cWidth = $(window).width();
        $(".uploadButton").css({ left: (cWidth - 1440) / 2 + 16 });
    }
})