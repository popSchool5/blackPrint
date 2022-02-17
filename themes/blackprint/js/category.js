/*
* 2007-2016 PrestaShop
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author PrestaShop SA <contact@prestashop.com>
*  @copyright  2007-2016 PrestaShop SA
*  @license    http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*/
$(document).ready(function(){
    localStorage.setItem('lastCategoryTitle', $('h1').html());
    $("div.bloc-img-preview").hover(function(){
        var src=$(this).children('img').prop('src');
        $("div.img-cover img#cover").attr('src',src);
    });

    $('div.product-list-header ul.slick-container').slick({
        centerMode: false,
        infinite: false,
        slidesToShow: 4,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3
                }
            }
            , {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
                }
            }
        ],
        prevArrow: '<div class="slick-prev"><span></span></div>',
        nextArrow: '<div class="slick-next"><span></span></div>'
    });

    $(document).on('click', '.view-description .ul-scroll span', function (e) {
        e.preventDefault();
        $('.view-description-product').hide();
        $('.ul-scroll span').removeClass("active");

        var viewClass = '.' + $(this).attr('id');
        $(viewClass).show();
        $(this).addClass("active");
    });
});
