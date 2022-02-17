$(document).ready(function () {
    $('button[name="submitNewsletter"]').on('click', function (e) {
        //Check Google captcha
        if ($('.newsletter-form .g-recaptcha').length > 0) {
            var response = grecaptcha.getResponse();
            if (response.length === 0) {
                if ($('.alert-recaptcha').length === 0 && !$('.newsletter-form .form-group').hasClass('form-error')) {
                    $('.g-recaptcha').prepend('<p class="alert-danger alert-recaptcha">' + recaptchaInvalidMessage + '</p>');
                }
                e.preventDefault();
            } else {
                $('.alert-recaptcha').remove();
            }
        }
    });
});