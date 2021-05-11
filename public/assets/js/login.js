
    setInterval(function(){ 
        $(".loginPage .code .codeAgain").fadeIn(400);
        $(".loginPage .code .codeAgain").removeClass("hidden");
        
        

    }, 30000);
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

