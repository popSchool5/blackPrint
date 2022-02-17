$(document).ready(function(){
	$(document).on('submit', '#create-account_form', function(e){
		e.preventDefault();
		submitFunction();
	});
	$('.is_customer_param').hide();
});

function submitFunction()
{
	//Check Google captcha
	if ($('#create-account_form .g-recaptcha').length > 0 &&
		typeof recaptchaInvalidMessage !== undefined
	) {
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

	$('#create_account_error').html('').hide();
	$.ajax({
		type: 'POST',
		url: baseUri + '?rand=' + new Date().getTime(),
		async: true,
		cache: false,
		dataType : "json",
		headers: { "cache-control": "no-cache" },
		data:
		{
			controller: 'authentication',
			SubmitCreate: 1,
			ajax: true,
			email_create: $('#email_create').val(),
			back: $('input[name=back]').val(),
			token: token,
			"g-recaptcha-response": $('.g-recaptcha-response').val()
		},
		success: function(jsonData)
		{
			if (jsonData.hasError)
			{
				var errors = '';
				for(error in jsonData.errors)
					//IE6 bug fix
					if(error != 'indexOf')
						errors += '<li>' + jsonData.errors[error] + '</li>';
				$('#create_account_error').html('<ol>' + errors + '</ol>').show();
			}
			else
			{
				// adding a div to display a transition
				$('#center_column').html('<div id="noSlide">' + $('#center_column').html() + '</div>');
				$('#noSlide').fadeOut('slow', function()
				{
					$('#noSlide').html(jsonData.page);
					$(this).fadeIn('slow', function()
					{
						if (typeof bindUniform !=='undefined')
							bindUniform();
						if (typeof bindStateInputAndUpdate !=='undefined')
							bindStateInputAndUpdate();
						document.location = '#account-creation';
					});
				});
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{
			error = "TECHNICAL ERROR: unable to load form.\n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus;
			if (!!$.prototype.fancybox)
			{
				$.fancybox.open([
				{
					type: 'inline',
					autoScale: true,
					minHeight: 30,
					content: "<p class='fancybox-error'>" + error + '</p>'
				}],
				{
					padding: 0
				});
			}
			else
				alert(error);
		}
	});
}