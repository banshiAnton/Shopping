$(function () {

    let stripe = Stripe('pk_test_LnRbSBERwGw9GqVIwFasdj1Z');

// Create an instance of Elements
    let elements = stripe.elements();

    let style = {
        base: {
            color: '#32325d',
            lineHeight: '24px',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };

// Create an instance of the card Element
    let card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>
    card.mount('#card-element');

    /*let form = $(document.forms.checkoutform);

    form.on('submit', function(event) {

        form.find('button').prop('disable', true);

        // stripe.createToken('bank_account', {
        //     number: $('#cart-number').val(),
        //     cvc: $('#card-cvc').val(),
        //     exp_month: $('#card-expiry-month').val(),
        //     exp_year: $('#card-expiry-year').val(),
        //     name: $('#card-name').val()
        // }).then(callbackStr);
        stripe.createToken(card).then(callbackStr);

        return false;

    });

    function callbackStr(result) {
        console.log('Arguments', arguments);
        console.log('Result', result);
    }*/

    // Handle real-time validation errors from the card Element.
    card.addEventListener('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });

// Handle form submission
    let form = $('#payment-form');
    form.on('submit', function (event) {
        stripe.createToken(card).then(callback);
        return false;
    });

    function callback(result) {
        if (result.error) {
            // Inform the user if there was an error
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        } else {
            // Send the token to your server
            console.log("Token", result.token);
            stripeTokenHandler(result.token);
        }
    }

    function stripeTokenHandler(token) {
        // Insert the token ID into the form so it gets submitted to the server
        var form = document.getElementById('payment-form');
        var hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'stripeToken');
        hiddenInput.setAttribute('value', token.id);
        form.appendChild(hiddenInput);

        // Submit the form
        form.submit();
    }

});