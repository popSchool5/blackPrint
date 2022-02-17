$(document).ready(function () {
    $('.row-post .post-description ul').addClass('synonews-list');
    $('.row-post .post-description ol').addClass('synonews-numbered-list');
    $('.row-post .post-description p').addClass('synonews-text');
    $('.row-post .post-description table').addClass('synonews-table table-striped table-bordered').wrap('<div class="table-responsive"></div>');
    $('.row-post .post-description img').closest('p').addClass('synonews-image');
    $('.row-post .post-description blockquote').addClass('synonews-quote');
    $('.row-post .post-description iframe').addClass('synonews-frame');
    $('h1, h2, h3, h4, h5, h6', '.row-post .post-description').addClass('synonews-title');

    $('iframe, img, blockquote, table, pre, address, p, ul, ol', '.row-post .post-description').each(function () {
        synoNewsIdentifyFloatingContents(this);
    });
});

function synoNewsIdentifyFloatingContents(element)
{
    var styleContent = $(element).attr('style');
    var elementType  = $(element).get(0).tagName.toLowerCase();
    if(typeof styleContent != 'undefined') {
        if(styleContent.length) {
            var expression = new RegExp('.*float\s*:\s*([a-zA-Z]+)(?:[\s;]|$)+', 'i');
            var matches    = styleContent.match(expression);
            if (matches && matches !== 'null' && matches !== 'undefined' && matches.length) {
                $(element).addClass('synonews-float-' + matches[1].toLowerCase()).removeAttr('style');
                if (elementType == 'iframe') {
                    $(element).parent().addClass('embed-responsive');
                }
            }
        }
    }
    return false;
}