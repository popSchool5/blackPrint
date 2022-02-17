/* Cookie Banner Prestashop module
 * Copyright 2018, Prestaddons
 * Author: Prestaddons
 * Website: http://www.prestaddons.fr
 */

$(document).ready(function() {

	$('#cookiebanner #allow_all').click(function(event){
		event.preventDefault();

        // Active swiches if exists
		var switch_value = 'yes';
		$('.module-blocked-categories .btn-switch__label_' + switch_value).click();

        // Process AJAX request
		$.post($(this).attr('href'), {ajax: 1, action: 'allowAllCookies'}, 
			function(data){
				
			}
		);
		$('#cookiebanner').fadeOut(1000);
	});

    $('#cookiebanner #valid_cookie').click(function(event){
		event.preventDefault();

        // Process AJAX request
		$.post($(this).attr('href'), {ajax: 1, action: 'validCookies'}, 
			function(data){
				
			}
		);
		$('#cookiebanner').fadeOut(1000);
	});
	
});