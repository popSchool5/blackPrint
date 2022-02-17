function activateParentMenu(e,type) {
	if(type == 'element') {
		$(e).parents('.adtm_column').children('h5').children('a').addClass('advtm_menu_actif');
		$(e).parents('.li-niveau1').children('a').addClass('advtm_menu_actif');
	}
	if(type == 'column') {
		$(e).parents('.li-niveau1').children('a').addClass('advtm_menu_actif');
	}
}

function adtm_isMobileDevice() {
	return (('ontouchstart' in window) || (typeof(document.documentElement) != 'undefined' && 'ontouchstart' in document.documentElement) || (typeof(window.navigator) != 'undefined' && typeof(window.navigator.msMaxTouchPoints) != 'undefined' && window.navigator.msMaxTouchPoints));
}

function adtm_loadDoubleTap(){!function(e){e.event.special.doubletap={bindType:"touchend",delegateType:"touchend",handle:function(e){var a=e.handleObj,t=jQuery.data(e.target),n=(new Date).getTime(),l=t.lastTouch?n-t.lastTouch:0,u=null==u?300:u;u>l&&l>50?(t.lastTouch=null,e.type=a.origType,["clientX","clientY","pageX","pageY"].forEach(function(a){e[a]=e.originalEvent.changedTouches[0][a]}),a.handler.apply(this,arguments)):t.lastTouch=n}}}(jQuery)}

function onMenuLinkClick(event) {
    var menuContainer = $('#adtm_menu');
    var linkHref = $(this).attr('href');

    if (menuContainer.hasClass('adtm_touch')) {
        var parent = $(event.currentTarget).closest('li');

        if (parent.hasClass('sub') && linkHref != '' && linkHref != '#') {
            window.location = linkHref;
        }
        return false;
    } else {
        var menuPanelToggle = $('#adtm_menu:not(.adtm_touch) .advtm_menu_toggle');

        if (menuPanelToggle.is(':visible') || menuPanelToggle.hasClass('adtm_menu_mobile_mode')) {
            if ($('#adtm_menu').hasClass('adtm_menu_toggle_open') &&
                li.hasClass('sub') &&
                linkHref != '' &&
                linkHref != '#'
            ) {
                window.location = linkHref;
            }
            return false;
        }
    }
}

function onSubmenuToggleClick(event) {
    var parent = $(event.currentTarget).closest('li');
    var menuContainer = $('#adtm_menu');

    if (menuContainer.hasClass('adtm_touch')) {
        var parentHasSubmenu = parent.hasClass('sub');

        if (parentHasSubmenu) {
            if (!menuContainer.hasClass('adtm_menu_toggle_open')) {
                if ($('#adtm_menu_inner').hasClass('advtm_open_on_hover')) {
                    if ($('div.adtm_sub', parent).css('visibility') == 'hidden') {
                        return false;
                    } else {
                        return true;
                    }
                }
            } else if (parent.hasClass('menuHaveNoMobileSubMenu')) {
                window.location = $(this).attr('href');
                return false;
            } else {
                parent.toggleClass('adtm_sub_open');
                $('div.adtm_sub', parent).slideToggle();
                return false;
            }
        }
    } else {
        var menuToggle = $('#adtm_menu:not(.adtm_touch) .advtm_menu_toggle, header .nav .advtm_menu_toggle');

        if (menuToggle.is(':visible') || menuToggle.hasClass('adtm_menu_mobile_mode')) {
            parent.toggleClass('adtm_sub_open');
            $('div.adtm_sub', parent).slideToggle();
            return false;
        }
    }
}

function adtm_initMenu(isMobile) {
	if (typeof(isMobile) != 'undefined' && isMobile) {
		$("#adtm_menu").addClass('adtm_touch');
		$('.advtm_menu_toggle').addClass('adtm_menu_mobile_mode');
	} else {
		$("#adtm_menu").removeClass('adtm_touch');
		if (adtm_isToggleMode) {
			$("#adtm_menu").removeClass('adtm_menu_toggle_open');
		}
		$('.advtm_menu_toggle').removeClass('adtm_menu_mobile_mode');
	}

	// Activate parent menu process
	if (typeof($('#adtm_menu').data('activate-menu-id')) != 'undefined' && typeof($('#adtm_menu').data('activate-menu-type')) != 'undefined') {
		activateParentMenu($('#adtm_menu').data('activate-menu-id'), $('#adtm_menu').data('activate-menu-type'));
	}
	// Set touch mode
	if ((typeof(isMobile) != 'undefined' && isMobile) || adtm_isMobileDevice()) {
		if ($('#adtm_menu .advtm_menu_toggle').is(':visible') || $(adtm_menuHamburgerSelector).is(':visible')) {
			// Menu toggle is visible
			$("#adtm_menu").addClass('adtm_touch');
			adtm_loadDoubleTap();
		} else {
			// Menu toggle is NOT visible (Laptop with touch)
			if ($('#adtm_menu').attr('data-open-method') == 1) {
				$("#adtm_menu").addClass('adtm_touch');
				adtm_loadDoubleTap();
			}
		}
	}

	// Touch devices
	$("#adtm_menu.adtm_touch ul#menu li.li-niveau1").each(function(){
		var li = $(this);
		li.mouseover(function(){ li.data('hoverTime', new Date().getTime()); });
		if (typeof(li.mouseleave) != 'undefined') {
			li.mouseleave(function(){ li.removeClass("adtm_is_open"); });
		} else if (typeof(li.mouseout) != 'undefined') {
			li.mouseout(function(){ li.removeClass("adtm_is_open"); });
		}
        $('> .submenu-toggle', li).bind('click', onSubmenuToggleClick);
        $('> a', li).bind('click', onMenuLinkClick);
	});

	if ($('#adtm_menu:not(.adtm_touch)').attr('data-open-method') == 2) {
		$('#adtm_menu:not(.adtm_touch)').hover(
			function(e) {
				adtm_overState = true;
			},
			function(e) {
				adtm_overState = false;
				// Remove any previous timeout
				clearTimeout(adtm_overStateTimeout);
				// Set new timeout
				adtm_overStateTimeout = setTimeout(function() {
					// Close sub-menu if menu isn't on mouse over state after 500ms
					if (!adtm_overState) {
						$("#adtm_menu:not(.adtm_touch) ul#menu li.li-niveau1.atm_clicked").removeClass('atm_clicked');
					}
				}, 500);
			}
		);
	}

	// Non-touch devices
	$("#adtm_menu:not(.adtm_touch) ul#menu li.li-niveau1").each(function(){
		var li = $(this);
		if (li.hasClass('sub')) {
			if ($('#adtm_menu').attr('data-open-method') == 2) {
				// Open on click
				li.click(function(e) {
					targetElement =  e.toElement || e.relatedTarget || e.target;

					if (typeof(targetElement) != 'undefined' && $(targetElement).is('.adtm_menu_icon, .advtm_menu_span, .a-niveau1, .li-niveau-1')) {
						// Follow link if submenu is already open
						if ($(this).is('.atm_clicked')) {
							return true;
						}
						if ($(li).css('position') != 'relative') {
							// We must calculate top if it's on line != 1 (responsive case)
							if ($('#adtm_menu li.li-niveau1').offset().top != $(li).offset().top) {
								if (typeof($('div.adtm_sub', li).data('originalTop')) === 'undefined') {
									$('div.adtm_sub', li).data('originalTop', parseInt($('div.adtm_sub', li).css('top')));
								}
								$('div.adtm_sub', li).css('top', $('div.adtm_sub', li).data('originalTop') + $(li).offset().top - $('#adtm_menu li.li-niveau1').offset().top);
							} else {
								$('div.adtm_sub', li).css('top', $('div.adtm_sub', li).data('originalTop'));
							}
						}
						$("#adtm_menu:not(.adtm_touch) ul#menu li.li-niveau1.sub").each(function(){
							if (li.get(0) != $(this).get(0)) {
								$(this).removeClass('atm_clicked');
							}
						});
						$(this).toggleClass('atm_clicked');
						e.preventDefault();
						return false;
					}
				});
			} else {
				li.hover(function(e) {
					li.addClass('active');
					if ($(li).css('position') != 'relative') {
						// We must calculate top if it's on line != 1 (responsive case)
						if ($('#adtm_menu li.li-niveau1').offset().top != $(li).offset().top) {
							if (typeof($('div.adtm_sub', li).data('originalTop')) === 'undefined') {
								$('div.adtm_sub', li).data('originalTop', parseInt($('div.adtm_sub', li).css('top')));
							}
							$('div.adtm_sub', li).css('top', $('div.adtm_sub', li).data('originalTop') + $(li).offset().top - $('#adtm_menu li.li-niveau1').offset().top);
						} else {
							$('div.adtm_sub', li).css('top', $('div.adtm_sub', li).data('originalTop'));
						}
					}
				}, function(e) {
                    li.removeClass('active');
				});
			}
            $('> .submenu-toggle', li).on('click', onSubmenuToggleClick);
            $('> a', li).bind('click', onMenuLinkClick);
		}
	});

	// Set event for menu toggle
	$('.advtm_menu_toggle a.adtm_toggle_menu_button').unbind('click').bind('click', function(e) {
		$('#adtm_menu').toggleClass('adtm_menu_toggle_open');
        $('.container-page').toggleClass('container-page-active');
        $(this).toggleClass('active');
		return false;
	});

	// Set sticky menu
	if ($('#adtm_menu').attr('data-sticky') == 1 && $('.advtm_menu_toggle').css('display') == 'none') {
		if (typeof($("#adtm_menu").attr('class')) != 'undefined') {
			originalClasses = ' ' + $("#adtm_menu").attr('class');
		} else {
			originalClasses = '';
		}
		$("#adtm_menu").sticky({className:'adtm_sticky' + originalClasses, getWidthFrom:'#adtm_menu_inner'});
	}
}

if (typeof(adtm_isToggleMode) == 'undefined') {
	var adtm_isToggleMode = true;
}
if (typeof(adtm_menuHamburgerSelector) == 'undefined' || adtm_menuHamburgerSelector == '') {
	var adtm_menuHamburgerSelector = '#menu-icon, .menu-icon';
}

var adtm_overState = false;
var adtm_overStateTimeout;
$(document).ready(function(){
	// No need to keep this outside, as the even will be fired only while the mode change after a resize of the broswer
	var adtm_responsive = false;
	if (typeof(prestashop) == 'object') {
		if (!adtm_isToggleMode) {
			// Menu icon
			$(adtm_menuHamburgerSelector).on('click', function() {
				$('#adtm_menu').toggleClass('adtm_menu_toggle_open');
				$('.advtm_menu_toggle').toggleClass('adtm_menu_mobile_mode');
			});
		} else {
			prestashop.on('responsive update', function(event) {
				var adtm_responsive = false;
				if ((typeof(event.mobile) != 'undefined' && event.mobile)) {
					adtm_responsive = true;
				}
				adtm_initMenu(adtm_responsive);
			});
		}

		adtm_responsive = prestashop.responsive.mobile;
	}

	adtm_initMenu(adtm_responsive);

	$('#menu li.li-niveau1 .column_wrap_title > a').wrapInner('<span class="js-span"/>');
	$('#menu a[href="#"]').on('click touchstart', onBlankLinkClick);
});

function onBlankLinkClick(event) {
    event.preventDefault();
    event.stopPropagation();
}