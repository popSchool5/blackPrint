var oldUpdateHookShoppingCart   = updateHookShoppingCart;
var oldDeleteProductFromSummary = deleteProductFromSummary;
var oldUpQuantity               = upQuantity;
var oldDownQuantity             = downQuantity;
var oldUpdateCartSummary        = updateCartSummary;

var updateHookShoppingCart = function(data) {
    oldUpdateHookShoppingCart(data.oldHookValue);
    updateProductOptions(data.productOptions);
};

var deleteProductFromSummary = function(id) {
    var ids = id.split('_');
    if (typeof(ids[4]) !== 'undefined') {
        var productAttributeId = 0;
        var id_address_delivery = 0;
        var productId = parseInt(ids[0]);
        if (typeof(ids[1]) !== 'undefined') {
            productAttributeId = parseInt(ids[1]);
        }
        if (typeof(ids[3]) !== 'undefined') {
            id_address_delivery = parseInt(ids[3]);
        }

        $(document).bind('ajaxSend', function (event, jqXHR, options) {
            if (options.url.indexOf('?id_syno_cart_product_option=') === -1) {
                return;
            }

            options.dataFilter = function (data) {
                var jsonData = JSON.parse(data);

                if (!jsonData.hasError && !jsonData.refresh && parseInt(jsonData.summary.products.length)) {
                    var exist           = false;
                    var matchingProduct = -1;
                    for (i = 0; i < jsonData.summary.products.length; i++) {
                        if (jsonData.summary.products[i].id_product == productId
                            && jsonData.summary.products[i].id_product_attribute == productAttributeId
                            && jsonData.summary.products[i].id_address_delivery == id_address_delivery) {
                            if ((parseInt(jsonData.summary.products[i].customizationQuantityTotal) > 0)) {
                                exist = true;
                            } else {
                                matchingProduct = i;
                            }
                        }
                    }

                    if (!exist) {
                        if (jsonData.HOOK_SHOPPING_CART.productOptions.hasOwnProperty(productId)
                            && jsonData.HOOK_SHOPPING_CART.productOptions[productId].hasOwnProperty(productAttributeId)
                            && jsonData.HOOK_SHOPPING_CART.productOptions[productId][productAttributeId].hasOwnProperty(id_address_delivery)
                        ) {
                            jsonData.summary.products[matchingProduct].customizationQuantityTotal = 1;
                            jsonData.summary.products[matchingProduct].fakeCustom = true;
                        }
                    }
                }
                return JSON.stringify(jsonData);
            };
            $(this).unbind(event);
        });
        oldBaseUri = baseUri;

        baseUri   += '?id_syno_cart_product_option='+parseInt(ids[4])+'&rand=' + new Date().getTime()+'&';
        oldDeleteProductFromSummary(id);

        baseUri = oldBaseUri;
    } else {
        oldDeleteProductFromSummary(id);
    }
};

var upQuantity = function (id, qty) {
    var ids = id.split('_');
    if (typeof(ids[4]) !== 'undefined') {
        oldBaseUri = baseUri;
        baseUri   += '?id_syno_cart_product_option='+parseInt(ids[4])+'&rand=' + new Date().getTime()+'&';

        oldUpQuantity(id, qty);

        baseUri = oldBaseUri;
    } else {
        oldUpQuantity(id, qty);
    }
};

var downQuantity = function (id, qty) {
    var ids = id.split('_');
    if (typeof(ids[4]) !== 'undefined') {
        oldBaseUri = baseUri;
        baseUri   += '?id_syno_cart_product_option='+parseInt(ids[4])+'&rand=' + new Date().getTime()+'&';

        oldDownQuantity(id, qty);

        baseUri = oldBaseUri;
    } else {
        oldDownQuantity(id, qty);
    }
};

var updateCartSummary = function (json) {
    oldUpdateCartSummary(json);

    var i;
    var product_list = new Array();

    if (typeof json == 'undefined')
        return;

    $('div.alert-danger').fadeOut();

    for (i = 0; i < json.products.length; i++) {
        product_list[json.products[i].id_product + '_' + json.products[i].id_product_attribute + '_' + json.products[i].id_address_delivery] = json.products[i];
    }

    if (!$('.multishipping-cart:visible').length) {
        for (i = 0; i < json.gift_products.length; i++) {
            if (typeof(product_list[json.gift_products[i].id_product + '_' + json.gift_products[i].id_product_attribute + '_' + json.gift_products[i].id_address_delivery]) !== 'undefined') {
                product_list[json.gift_products[i].id_product + '_' + json.gift_products[i].id_product_attribute + '_' + json.gift_products[i].id_address_delivery].quantity -= json.gift_products[i].cart_quantity;
            }
        }
    }
    else {
        for (i = 0; i < json.gift_products.length; i++) {
            if (typeof(product_list[json.gift_products[i].id_product + '_' + json.gift_products[i].id_product_attribute + '_' + json.gift_products[i].id_address_delivery]) == 'undefined') {
                product_list[json.gift_products[i].id_product + '_' + json.gift_products[i].id_product_attribute + '_' + json.gift_products[i].id_address_delivery] = json.gift_products[i];
            }
        }
    }

    for (i in product_list) {
        var key_for_blockcart = product_list[i].id_product + '_' + product_list[i].id_product_attribute + '_' + product_list[i].id_address_delivery;

        //Module specific
        if (typeof(product_list[i].customizationQuantityTotal) !== 'undefined'
            && product_list[i].customizationQuantityTotal > 0
            && product_list[i].hasOwnProperty('fakeCustom')
        ) {
            var product_total = '';

            if (priceDisplayMethod !== 0) {
                current_price = formatCurrency(product_list[i].price, currencyFormat, currencySign, currencyBlank);
                product_total = product_list[i].total;
            }
            else {
                current_price = formatCurrency(product_list[i].price_wt, currencyFormat, currencySign, currencyBlank);
                product_total = product_list[i].total_wt;
            }
            $('#total_product_price_' + key_for_blockcart).html(formatCurrency(product_total, currencyFormat, currencySign, currencyBlank))
        }

        if ($('#cart_quantity_option_' + key_for_blockcart).length !== 0) {
            $('#cart_quantity_option_' + key_for_blockcart).html(product_list[i].quantity);
        }
        //Module specific end
    }
};

function updateProductOptions(json)
{
    for (var productId in json) {
        for (var productAttributeId in json[productId]) {
            for (var deliveryAddressId in json[productId][productAttributeId]) {
                for (var productOptionId in json[productId][productAttributeId][deliveryAddressId]) {
                    var productOption = json[productId][productAttributeId][deliveryAddressId][productOptionId];
                    var price 		  = productOption['quantity'];

                    if (priceDisplayMethod === 0) {
                        price *= productOption['price_tax_incl'];
                    } else {
                        price *= productOption['price_tax_excl'];
                    }

                    var formattedPrice = formatCurrency(price, currencyFormat, currencySign, currencyBlank);

                    $('input[name=quantity_' + productId + '_' + productAttributeId + '_0_' + deliveryAddressId + '_' + productOptionId + '_hidden]').val(productOption['quantity']);
                    $('input[name=quantity_' + productId + '_' + productAttributeId + '_0_' + deliveryAddressId + '_' + productOptionId + ']').val(productOption['quantity']);
                    $('#total_product_price_' + productId + '_' + productAttributeId + '_' + deliveryAddressId + '_' + productOptionId).text(formattedPrice);
                }
            }
        }
    }
}