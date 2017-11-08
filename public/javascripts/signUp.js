$(function () {

    $(document.forms.signup).on('submit', function () {

        let form = $(this);

        if(form.password != form.password_confirmation) {
            viewError('Invalid confirm password');
            return false;
        }

        var formData = new FormData(this);

        $.ajax({
            url: "/signUp",
            method: "POST",
            data:formData,
            success: (data) => {
                console.log('Data', data);
                console.log('Data type', typeof data);
                if(data.length > 0) {
                    if(data.indexOf('/') !== -1) {
                        window.location.href = data;
                    } else {
                        viewError(data);
                    }
                }
            },
            error: (err) => {
                console.log("Err", err);
            },
            complete: () => {
                console.log("Done");
            },
            cache: false,
            contentType: false,
            processData: false
        });

        return false;

    });

    function viewError(errMess) {
        console.log('ErrMess', errMess);

        if(document.getElementById('errFormMsgSignUp') !== null) {

            if((typeof errMess) === 'object') {
                for(let i = 0; i < errMess.length; i++) {
                    let msgError = $('<p>' + errMess[i] + '</p>');
                    $('#errFormMsgSignUp').prepend(msgError);
                }
            } else {
                let msgError = $('<p>' + errMess + '</p>');
                $('#errFormMsgSignUp').prepend(msgError);
            }

        } else {

            if((typeof errMess) === 'object') {
                for(let i = 0; i < errMess.length; i++) {
                    let msgError = $('<div id="errFormMsgSignUp" class="alert alert-danger"><p>' + errMess[i] + '</p></div>');
                    $('#signUpForm').prepend(msgError);
                }
            } else {
                let msgError = $('<div id="errFormMsgSignUp" class="alert alert-danger"><p>' + errMess + '</p></div>');
                $('#signUpForm').prepend(msgError);
            }
        }

    };

});