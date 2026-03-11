$(document).ready(function() {
    // キャンペーン一覧
    var campaignDom = $("#campaignList").children();
    if (campaignDom.length < 1) {
        $("#campaignArea").remove();
    }

    // ブランド一覧
    var brandDom = $("#brandInfoList").children();
    if (brandDom.length < 1) {
        $("#brandArea").remove();
    }

    // 一店舗版の場合はショップリスト非表示
    var shopDom = $("#shopList").children();
    if (shopDom.length <= 1) {
        $("#shopListArea").remove();
    }
    
	// タグ一覧
    var tagDom = $("#tagInfoList").children();
    if (tagDom.length < 1) {
        $("#tagArea").remove();
    }

    for (var i = 0; i < shopDom.length; i++) {
        var shop = $(shopDom[i]);
        if (i == 0) {
            shop.remove();
        }
    }

});

// ページに遷移
function moveRequest(url) {
    // Source_code_v12.18_add_start
    // location.href = createWovnHref(settings.context + settings.servletMapping + url);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    window.location = url;
    // Mockup_v12.18_add_end
}
