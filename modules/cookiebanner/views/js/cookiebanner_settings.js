/* Cookie Banner Prestashop module
 * Copyright 2014, Prestaddons
 * Author: Prestaddons
 * Website: http://www.prestaddons.fr
 */

$(document).ready(function() {
	
	$('.all-modules .btn-switch input[type="radio"]').on('change', function() {
		var switch_value = $(this).val() == 1 ? 'yes' : 'no';
		$('.module-blocked-categories .btn-switch__label_' + switch_value).click();
	});
	
});