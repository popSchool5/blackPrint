function rea_addToCart(idProduct, callerElement, callBack) {
    if (idProduct > 0) {
        var rea_submitButton = $('input[type="submit"]', callerElement);
        var formData         = {};
        $(rea_submitButton).attr('disabled', true).removeClass('exclusive').addClass('exclusive_disabled');
        $('#buy_block').find("[id^='BALISE_BLOC_']").each(function () {
            if ($(this).css('display') != 'none') {
                $(this).find("input[type='text'][name^='VARTICLE_NUMERO_EN_COURS_']").each(function () {
                    if ($(this).parent().css('display') == "inline-block") {
                        formData[$(this).attr('name')] = $(this).parent().parent().prev().text() + ' : ' + $(this).val();
                    }
                });

                $(this).find("select[name^='VARTICLE_NUMERO_EN_COURS_']").each(function () {
                    if ($(this).parent().css('display') == "inline-block") {
                        formData[$(this).attr('name')] = $(this).parent().parent().prev().text() + ' : ' + $(this).find("option:selected").text();
                    }
                });
            }
        });
        var data = $("#buy_block").serialize();
        data     = data + '&customData=' + JSON.stringify(formData);
        $.ajax({
            type:     'POST',
            url:      $(callerElement).attr('action'),
            data:     data,
            dataType: 'json',
            cache:    false,
            success:  function (jsonData, textStatus, jqXHR) {
                // Redirect if AJAX cart is disabled
                if (!jsonData.hasError && typeof(jsonData.reaRedirectURL) !== 'undefined' && jsonData.reaRedirectURL != null && jsonData.reaRedirectURL.length > 0) {
                    window.location = jsonData.reaRedirectURL;
                    return;
                }

                /* PS 1.6 CODE */
                $('#rea-add-to-cart button').prop('disabled', 'disabled').addClass('disabled');
                $('.filled').removeClass('filled');
                if ($('.cart_block_list').hasClass('collapsed')) {
                    ajaxCart.expand();
                }
                if (!jsonData.hasError) {
                    // Modal Cart 3

                    if (typeof(modalAjaxCart) !== 'undefined' && typeof(jsonData.reaData) !== 'undefined') {

                        modalAjaxCart.showModal("product_add", idProduct);
                    } else if (typeof(ajaxCart) !== 'undefined' && typeof(ajaxCart.updateLayer) !== 'undefined') {
                        if (typeof(jsonData.reaData) !== 'undefined') {
                            $(jsonData.products).each(function () {
                                if (this.id != undefined && this.id == parseInt(idProduct)) {
                                    if (typeof(contentOnly) !== 'undefined' && contentOnly && typeof(window.parent.ajaxCart) !== 'undefined') {
                                        window.parent.ajaxCart.updateLayer(this);
                                    } else {
                                        ajaxCart.updateLayer(this);
                                    }
                                }
                            });
                        } else if (typeof(jsonData.fakeAp5Product) !== 'undefined') {
                            if (typeof(contentOnly) !== 'undefined' && contentOnly && typeof(window.parent.ajaxCart) !== 'undefined') {
                                window.parent.updateLayer(jsonData.fakeAp5Product);
                            } else {
                                ajaxCart.updateLayer(jsonData.fakeAp5Product);
                            }
                        }
                    }
                    if (typeof(contentOnly) !== 'undefined' && contentOnly && typeof(window.parent.ajaxCart) !== 'undefined') {
                        window.parent.ajaxCart.updateCartInformation(jsonData, true);
                    } else if (typeof(window.parent.ajaxCart) !== 'undefined') {
                        window.parent.ajaxCart.updateCartInformation(jsonData, true);
                    } else if (typeof(ajaxCart) !== 'undefined') {
                        ajaxCart.updateCartInformation(jsonData, true);
                    }
                    $('#rea-add-to-cart button').removeProp('disabled').removeClass('disabled');
                    if (!jsonData.hasError || jsonData.hasError == false) {
                        $('#rea-add-to-cart button').addClass('added');
                    } else {
                        $('#rea-add-to-cart button').removeClass('added');
                    }

                    // Close quick view
                    if (typeof(contentOnly) !== 'undefined' && contentOnly) {
                        parent.$.fancybox.close();
                    }
                } else {
                    $('#rea-add-to-cart button').removeProp('disabled').removeClass('disabled');
                    rea_displayErrors(jsonData);
                }
            },
            error:    function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Impossible to add the product to the cart.\n\ntextStatus: '" + textStatus + "'\nerrorThrown: '" + errorThrown + "'\nresponseText:\n" + XMLHttpRequest.responseText);
                /* PS 1.6 CODE */
                $('#add_to_cart button').removeProp('disabled').removeClass('disabled');
            },
            complete: function (jqXHR, textStatus) {
                /* PS 1.6 CODE */
                $('#add_to_cart button').removeProp('disabled').removeClass('disabled');
            }
        });
    }
}

function rea_displayErrors(jsonData) {
    // User errors display
    if (jsonData.hasError) {
        var errors = '';
        for (error in jsonData.errors)
            // IE6 bug fix
        {
            if (error != 'indexOf') {
                errors += $('<div />').html(jsonData.errors[error]).text() + "\n";
            }
        }
        if (!!$.prototype.fancybox) {
            $.fancybox.open([
                {
                    type:      'inline',
                    autoScale: true,
                    minHeight: 30,
                    content:   '<p class="fancybox-error">' + errors + '</p>'
                }
            ], {
                padding: 0
            });
        } else {
            alert(errors);
        }
    }
}

// Add pack to cart
$(document).on('submit', 'form.rea-buy-block', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var rea_id_product = parseInt($('input[name=id_product]').val());

    rea_addToCart(rea_id_product, $(this));
    return false;
});

window.addEventListener('load', onWindowLoad);

function onWindowLoad() {
    if (!!$.prototype.uniform) {
        $('input:checkbox', '.realisaprint-controls').uniform();
    }

    var realisaprintTechnicalData = $('#GLOBAL_CONTENT .contenu_bloc_realisaprint_tech').detach();
    $('.realisaprint-technical-data').html(realisaprintTechnicalData);
    $('.realisaprint-technical-data, .realisaprint .pb-right-column').removeClass('loading');
}

$(document).ready(function() {
    // input (objet html), max (int decimales max), allow_negative (booleen)
    if(typeof onlyDecimals ==='undefined')
    {
        function onlyDecimals(input, max, allow_negative){
            var negative       = ((typeof(allow_negative) != 'undefined' && allow_negative === true)? '-?' : ''),
                first_pattern  = new RegExp('('+negative+'\\d{0,})[^.|,]*((?:(\.|,|;)\\d{0,'+max+'})?)', 'g'),
                second_pattern = new RegExp('[^'+negative+'\\d.]', 'g'),
                match          = first_pattern.exec(input.value.replace(/(,|;)/g, '.').replace(second_pattern, ''));

            return match[1] + match[2];
        }

        // input (objet html), allow_negative (booleen)
        function onlyIntegers(input, allow_negative){
            var negative = ((typeof(allow_negative) != 'undefined' && allow_negative === true)? '(?!^-)' : ''),
                pattern  = new RegExp(negative+'[^0-9]', 'g');

            return input.value.replace(pattern, '');
        }
        function remove_tout_le_champ(elm) {
            $(elm).val('');
        }

        function remove_last_input(elm) {
            var val = $(elm).val();
            var cursorPos = elm.selectionStart;

            $(elm).val(	val.substr(0,cursorPos-1) +			// before cursor - 1
                val.substr(cursorPos,val.length)	// after  cursor
            )

            elm.selectionStart = cursorPos-1;				// replace the cursor at the right place
            elm.selectionEnd   = cursorPos-1;
        }
    }

    // input decimal à 1 decimale
    $('input.only_une_decimale, input.only_decimal1, input.only_une_decimalep').on('input', function() {
        this.value = onlyDecimals(this, 1);
    });

    // input only prix à 2 decimales
    $('input.only_deux_decimales, only_deux_decimalesp').on('input', function() {
        this.value = onlyDecimals(this, 2);
    });

    // entier négatif possible
    $('input.only_entiers').on('input', function() {
        this.value = onlyIntegers(this, true);
    });

    // entier positif
    $('input.only_entierp').on('input', function() {
        this.value = onlyIntegers(this);
    });

    // input only decimal
    $('input.only_decimaux').on('input', function() {
        this.value = onlyDecimals(this, '', true);
    });

    // input only decimal positif
    $('input.only_decimauxp').on('input', function() {
        this.value = onlyDecimals(this, '');
    });


    // input only heure
    $('body').delegate('input.only_heures','keyup',function(){
        if( !( $(this).val().match(/^([0-2])$/) || $(this).val().match(/^([0-1][0-9]|2[0-3])$/) || $(this).val().match(/^([0-1][0-9]|2[0-3]):$/) || $(this).val().match(/^([0-1][0-9]|2[0-3]):([0-5])$/) || $(this).val().match(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/) ) )
            remove_last_input(this);
        if ( $(this).val().length==2) $(this).val($(this).val()+':');
    });

    $('body').delegate('input.only_heures','blur',function(){
        if( $(this).val().match(/^([0-2])$/) ) $(this).val($(this).val()+'0:00');
        if ( $(this).val().match(/^([0-1][0-9]|2[0-3])$/) ) $(this).val($(this).val()+':00');
        if ($(this).val().match(/^([0-1]?[0-9]|2[0-3]):$/) ) $(this).val($(this).val()+'00');
        if ( $(this).val().match(/^([0-1]?[0-9]|2[0-3]):([0-5])$/) ) $(this).val($(this).val()+'0');
        if ( !($(this).val().match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/) ) )remove_tout_le_champ(this);
    });

    // input only date
    $('body').delegate('input.only_dates','keyup',function(){
        if( !( $(this).val().match(/^([1-9]|[0-2][1-9]|3[0-1])[\/]?$/) || $(this).val().match(/^([1-9]|[0-2][1-9]|3[0-1])[\/]([0]?[1-9]|1[0-2])[\/]?$/) || $(this).val().match(/^([1-9]|[0-2][1-9]|3[0-1])[\/]([0]?[1-9]|1[0-2])[\/]([0-9]{0,4})$/)  ) )
            remove_last_input(this);

        t_inter=$(this).val().split('/');
        if (t_inter.length==1)
        {
            if (parseFloat(t_inter[0])>3) $(this).val($(this).val()+'/');
        }
        if (t_inter.length==2)
        {
            if (parseFloat(t_inter[1])>1) $(this).val($(this).val()+'/');
        }
    });

    $('body').delegate('input.only_dates','blur',function(){
        if ( !($(this).val().match(/^([1-9]|[0-2][1-9]|3[0-1])[\/]([0]?[1-9]|1[0-2])[\/]([0-9]{4})$/) ) )remove_tout_le_champ(this);
    });
}); // end of document.ready