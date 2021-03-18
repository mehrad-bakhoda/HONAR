function openContent(className) {
    console.log(className);
    $("."+ className+ ".part .collapseContent").toggleClass("contentHidden");
    $("."+ className + ".part i.fa-angle-down").toggleClass("rotated");
}