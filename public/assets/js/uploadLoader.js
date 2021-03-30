$(".loginPage .tab-pane .uploadPic input").click(function () {
    $(".loginPage .tab-pane .uploadPic i.fa-spinner-third").removeClass("hidden");
})
const reader = new FileReader();
$("#fileUploader").change(event =>{
    const files = event.target.files;
    const file = files[0];
    reader.readAsDataURL(file);
    reader.addEventListener('progress',event =>{
        if(event.loaded == event.total)
        {
            $(".loginPage .tab-pane .uploadPic i.fa-spinner-third").addClass("hidden");
            $(".loginPage .tab-pane .uploadPic i.fa-check-circle").removeClass("hidden");
        }
    })
})