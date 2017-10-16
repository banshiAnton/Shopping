$(function () {
   $(document.forms.coffee).on('submit', function () {
       let form = $(this);

        // console.log('Form', $("#imgM").files );
        // console.log('Form 2', form.serialize() );
        //
        // var formData = new FormData(form);
        // console.log('Form 3', formData);

       var formData = new FormData(this);

        $.ajax({
            url: "/putCoffee",
            method: "POST",
            data: formData,
            // headers: {"X-CSRF-Token": "{{csrfToken}}" },
            success: function (data) {
                console.log('Data', data);
            },
            error: function (err) {
                console.log("Err", err);
            },
            complete: function () {
                console.log("Done");
            },
            cache: false,
            contentType: false,
            processData: false
        });

       return false;
   })
});