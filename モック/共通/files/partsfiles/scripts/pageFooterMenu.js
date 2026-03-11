$(document).ready(function() {
    // toTop制御
    $(".go_top").click(function() {
        $('html,body').animate({
            scrollTop : 0
        }, 'fast');
    });

    // クライアント端末幅変更時
    clientStyleFunctionList.push(function() {
        $(".sitemap_cate dt").off("click");

        // フッターtoggle（SPのみ）
        if (clientStyle === "sp") {
            $(".sitemap_cate dt").click(function() {
                $(this).next("dd").slideToggle(200);
                $(this).toggleClass("open");
            });

            // カテゴリ高さ揃え解除
            $('.footerCategory').height("auto");

        } else {
            // カテゴリ高さ揃え
            var cssHeight = 0;
            $('.footerCategory').each(function() {
                var thisHeight = parseInt($(this).css('height'));
                if (thisHeight > cssHeight) {
                    cssHeight = thisHeight;
                }
            });
            $('.footerCategory').height(cssHeight);

            $('.footerCategory').show();
        }
    });

    // プレビュー時Function
    previewFunctionList.push(function() {
        $(".footerLinkArea").find("a").removeAttr("href");
    });
});

// サイトページに遷移
function moveSite() {
    location.href = createWovnHref(settings.context + "/shop/" + commonSettings.siteCode + "/");
}

function footerSearch() {

    $("#footerSearchArea", "#floating-menu").slideToggle(200, function(){
        if ($("#footerSearchArea", "#floating-menu").is(":visible")) { 
            $("#cookieConsentBannerSP").removeClass("moveUp").addClass("moveUpOnSearchArea");
        }
        if (!$("#footerSearchArea", "#floating-menu").is(":visible")) { 
            $("#cookieConsentBannerSP").removeClass("moveUpOnSearchArea").addClass("moveUp");
        }
    });
}

function executeSearchFooter(formId) {

    if (!$(".pageFooterSearchWord").val() && $(".pageFooterSearchCategoryCode").val() == "0") {
        pcPopup("pageFooterSearchAlert");
    } else {
        sendRequestToFront(settings.context + settings.servletMapping + "/catalog/list/", false, formId);
    }
}
