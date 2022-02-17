$(function () {
    $('#submitMessage').on('click', function (e) {
        //Check Google captcha
        if ($('.contact-form-box .g-recaptcha').length > 0) {
            var response = grecaptcha.getResponse();
            if (response.length === 0) {
                if ($('.alert-recaptcha').length === 0) {
                    $('.g-recaptcha').prepend('<p class="alert-danger alert-recaptcha">' + recaptchaInvalidMessage + '</p>');
                }
                e.preventDefault();
            } else {
                $('.alert-recaptcha').remove();
            }
        }
    });
});