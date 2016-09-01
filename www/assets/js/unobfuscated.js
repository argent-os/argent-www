function sendMessage() {
    //console.log("submitting")
    var form = $('#phoneNumberForm');
    var formattedPhoneNumber = $('input[name="PhoneNumber"]').val()
    var rawPhoneNumber = formattedPhoneNumber.replace(/\D/g,'');
    var phoneNumberUS = "+1"+rawPhoneNumber
    // console.log("phone number is", "+1" + rawPhoneNumber);
    // console.log(form)
    $.ajax({
        type: "POST",
        url: "https://api.argent.cloud/v1/twilio",
        dataType: "json",  
        contentType: 'application/json; charset=UTF-8', // This is the money shot
        data: JSON.stringify({
            "phone": phoneNumberUS
        }),
        success: function (data) {
            swal({   
                title: "Success!",   
                text: "App link is on it's way",   
                type: "success",   
                confirmButtonText: "Sweet" 
            });
        },
        failure: function(err) {
            swal({   
                title: "Error",   
                text: "App could not be sent to phone :(",   
                type: "error",   
                confirmButtonText: "Ok" 
            });
        }
    });
}

function showTextAlert() {
    //console.log("submitting")
    swal({   
        title: "🇺🇸 +1-202-800-1060 ",   
        text: "Text APP to the number above to receive a link to our app",   
        confirmButtonText: "Sweet" 
    });
}