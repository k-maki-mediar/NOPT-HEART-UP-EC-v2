$(document).ready(function() {

    setSearchList();

    // クライアント端末幅変更時
    clientStyleFunctionList.push(function() {
        // SPサイズの場合は強制的にサムネル画面を出す
        var param = analyzeUrlParameter(location);
        var displayMode = param.mode;

        if (clientStyle === "sp" && displayMode === "text") {
            changeDisplayMode("image");
        }
        if (clientStyle === "sp") {
            $('.balloon_icon').unbind('mouseenter').unbind('mouseleave');
        } else {
            iconHover();
        }
    });

});

function setSearchList() {

    // pageデータマッピング
    var pagerElement = $("#pager");
    var pageListElements = $(".pageList");
    var data = new Object();
    var pager = new Object();
    pager.currentPage = $(pagerElement).data("currentpage");
    pager.maxFetchSize = $(pagerElement).data("maxfetchsize");
    pager.maxPage = $(pagerElement).data("maxpage");
    pager.overflow = $(pagerElement).data("overflow");
    pager.pageSize = $(pagerElement).data("pagesize");
    pager.rowCount = $(pagerElement).data("rowcount");

    var pageListArray = new Array();
    for (var i = 0; i < pageListElements.length; i++) {
        var pageList = pageListElements[i];
        pageListArray.push($(pageList).data("pageno"));
    }
    pager.pageList = pageListArray;

    data.pager = pager;

    var pagerElements = $("[id^=pager]");
    for (var i = 0; i < pagerElements.length; i++) {
        var dom = pagerElements[i]
        initializePager(data, $(dom));
    }

    // page処理設定
    bindPager($("#catalogListArea"));

}

/**
 * 表示順変更時
 *
 * @param alignmentSequence
 */
function changeDisplayOrder(alignmentSequence) {

    var param = analyzeUrlParameter(location);

    param.alignmentSequence = alignmentSequence;

    location.href = createHref(param);
}

/**
 * 表示形式変更時
 *
 * @param displayMode
 */
function changeDisplayMode(displayMode) {

    var param = analyzeUrlParameter(location);

    param.mode = displayMode;

    location.href = createHref(param);
}

/**
 * 検索欄の遷移先URL作成
 *
 * @param param
 * @returns {String}
 */
function createHref(param) {

    var href = "?";

    var index = 0;
    for (obj in param) {
        if (index != 0) {
            href += "&";
        }
        href += obj + "=" + param[obj];
        index += 1;
    }

    return href;
}

/**
 * 商品データ取得
 *
 * @param commodityList
 * @param shopCode
 * @param commodityCode
 * @returns
 */
function findCommodityData(commodityList, shopCode, commodityCode) {
    for (var i = 0; i < commodityList.length; i++) {
        var commodity = commodityList[i];
        if (commodity.shopCode == shopCode && commodity.commodityCode == commodityCode) {
            return commodity;
        }
    }
}


/**
 * 商品詳細画面URL取得
 *
 * @param shopCode
 * @param commodityCode
 * @param skuCode
 * @returns {String}
 */
function getDetailUrlFromList(shopCode, commodityCode, skuCode) {
    var url = settings.context + "/commodity/" + shopCode + "/" + commodityCode + "/";
    if (skuCode) {
        url += "?selectedSkuCode=" + skuCode;
    }
    return url;
}

// アイコン説明
function iconHover() {
    $(".balloon_icon").hover(function() {
        $("span", $(this)).addClass('balloon').show();
    }, function() {
        $("span", $(this)).removeClass('balloon').hide();
    });

}
