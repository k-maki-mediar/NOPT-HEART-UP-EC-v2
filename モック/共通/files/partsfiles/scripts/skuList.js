$(document).ready(function() {

});

/**
 * 規格品情報取得・表示
 *
 * @param formId
 */
function getSkuList(formId) {

    // DOMをクリアする
    $("#skuInfoTemplate").siblings().remove();
    $(".standard1Cell, .standard2Cell, .imageCell").show();

    var skuSearchCallBack = function(data) {
        // タイトル表示
        var skuListArea = $("#skuListArea");
        skuListArea.find(".commodityName").html(data.commodityName);

        if (data.stockManagementType.value == "0") {
            // 在庫管理しない場合は、在庫情報非表示
            $(".stockMessageArea").hide();
        } else {
            $(".stockMessageArea").show();
        }

        skuListArea.find("#commodityStandard1Name").html(data.commodityStandard1Name);
        skuListArea.find("#commodityStandard2Name").html(data.commodityStandard2Name);
        if (data.commodityStandard2Name == null) {
            $(".standard2Cell").hide();
        }

        for (index in data.skuList) {

            var skuInfo = data.skuList[index];

            var skuInfoDom = $("#skuInfoTemplate").clone();

            bindDataToDomDataAttribute(skuInfoDom, skuInfo);
            bindDataToDomDataAttributeAlt(skuInfoDom, skuInfo);
            skuInfoDom.show();
            skuInfoDom.attr("id", "skuInfo" + index);
            skuInfoDom.find("form").attr("id", "skuForm" + index);
            $("#skuList").append(skuInfoDom);
        }

        skuListAreaProcess($("tr[id^='skuInfo']", "#skuList"), data, formId);

        switch (data.standardImageType.value) {
        case "0":
            // 通常画像関連付けの場合は、画像を表示しない
            $(".imageCell").hide();
            break;

        case "1": // 規格1関連付け
            $(".imageCell").show();
            $(".standard1Cell").hide();
            skuListArea.find("#mainStandardName").html(data.commodityStandard1Name);
            break;

        case "2": // 規格2関連付け
            $(".imageCell").show();
            $(".standard2Cell").hide();
            skuListArea.find("#mainStandardName").html(data.commodityStandard2Name);

            // 規格２を画像列の隣に移動
            $(".standard2Cell").not("#skuInfoTemplate .standard2Cell").each(function() {
                $(this).insertBefore($(this).parent("tr").find(".standard1Cell"));
            });

            break;

        default:
            break;
        }

        imgSrc();
        replaceNoPhoto();
        combineStandard();
        
        var popupFlag = true;
        popupFlag = popupFlag && !document.URL.match("/parts/general/skuList");

        var c5SkuList = $("#c5SkuList").attr("data-param");
        c5SkuList = (c5SkuList !== undefined) ? c5SkuList : null;
        var skuListUrl = JSON.parse(c5SkuList);
        if ( skuListUrl != null ){
            popupFlag = popupFlag && !skuListUrl.match("/parts/general/skuList");
        }
        
        if ( popupFlag ) {
            pcPopup("skuListArea");
        }

        resizePopup();

    }

    var uri = "/catalog/sku_list/search/";

    var parameters = createBaseParametersForAjaxApi("catalog", "sku_list", "search");

    var functions = createAjaxFunctions(null, null, skuSearchCallBack);

    var param = {
        parameters : parameters,
        functions : functions,
        formId : formId,
        uri : uri,
        dataType : "json",
        async : true
    }
    sendAjaxToApi(param);
}

/**
 * Popup firefox表示幅対応
 *
 */
function resizePopup(){
    var agent = window.navigator.userAgent.toLowerCase();
    if(agent.indexOf('firefox') > -1){
        $('#skuListArea').css('min-width','601px');
    }
}

/**
 * 規格品情報表示
 *
 * @param skuListDom
 * @param skuListData
 */
function skuListAreaProcess(skuListDom, data, formId) {

    var skuListData = data.skuList;
    var salesMethodType = data.salesMethodType;

    for (var i = 0; i < skuListDom.length; i++) {

        var skuDom = skuListDom[i];
        var skuCode = $(skuDom).find("input[name='skuCode']").val();
        var skuData = findSkuData(skuListData, skuCode);

        // 一致するデータがなかったとき
        if (!skuData) {
            continue;
        }

        $(skuDom).find("input[name=purchaseMethodType]").val(salesMethodType);

        var stockMessageAreaDom = $(skuDom).find(".stockMessageArea").children();
        var addCartAreaElement = $(skuDom).find(".cartButtonArea");

        // ボタン表示あり
        if (skuData.reservation) {
            // 予約するボタンの表示制御
            $(addCartAreaElement).find(".addCartButton").remove();

        } else {
            // カートに入れるボタンの表示制御
            $(addCartAreaElement).find(".reservationButton").remove();
        }

        // 在庫なしの場合カートボタンの非活性
        if (!skuData.displayCartFlg) {
            $(addCartAreaElement).find(".addCartButton").addClass("btn_off").removeAttr("onclick");
        }

        // 在庫表示制御
        if (skuData.reservation) {
            // 予約の場合
            if (!skuListData.reservationLimit && skuData.availavleStock != 0) {
                $(stockMessageAreaDom).not(".reservationPeriodMessage").remove();
            } else {
                // 予約上限数超えてる
                $(stockMessageAreaDom).not(".endReservationMessage").remove();
                // 予約ボタンの非活性
                $(addCartAreaElement).find(".reservationButton").addClass("btn_off").removeAttr("onclick").val("予約受付終了");
            }

        } else {
            $(stockMessageAreaDom).not(".stockStatusMessage").remove();
        }
    }
}

/**
 * Actionを実行
 */
function callSkuListAction(target, action) {
    var skuDom = $(target).closest("tr");
    var shopCode = skuDom.find("input[name='shopCode']").val();
    var commodityCode = skuDom.find("input[name='commodityCode']").val();
    var skuCode = skuDom.find("input[name='skuCode']").val();

    switch (action) {

    case "detail":
        location.href = createWovnHref(getDetailUrlFromSkuList(shopCode, commodityCode, skuCode));

        break;

    case "add":

        var skuForm = skuDom.find("form");
        var skuFormId = skuForm.attr("id");
        showPurchasingConfirm(skuFormId);

        break;

    default:

        break;
    }
}

/**
 * 規格品データ取得
 *
 * @param skuList
 * @param skuCode
 * @returns
 */
function findSkuData(skuList, skuCode) {
    for (var i = 0; i < skuList.length; i++) {
        var skuData = skuList[i];
        if (skuData.skuCode == skuCode) {
            return skuData;
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
function getDetailUrlFromSkuList(shopCode, commodityCode, skuCode) {
    var url = settings.context + "/commodity/" + shopCode + "/" + commodityCode + "/";
    if (skuCode) {
        url += "?selectedSkuCode=" + skuCode;
    }
    return url;
}

/**
 * NoPhoto画像を規格名に置換する
 */
function replaceNoPhoto() {

    $("img[class='skuImage']").each(function() {
        if ($(this).attr("src") == images["noPhotoCommodity"]) {
            var target = $(this).closest("td");
            target.next().show();
        }
    });
}

/**
 * 同じ規格の行を結合する
 */
function combineStandard() {

    var skuImages = $("img[class='skuImage']");
    for (var i = 0; i < skuImages.length; i++) {

        var currentSrc = $(skuImages[i]).attr("src");
        currentImgUrl = currentSrc.substr(0, currentSrc.indexOf("?"));
        var count = 1;

        if ($(skuImages[i]).attr("src") == images["noPhotoCommodity"]) {
            $(skuImages[i]).closest("td").hide();
            continue;
        }

        for (var j = i + 1; j < skuImages.length; j++) {

            var nextSrc = $(skuImages[j]).attr("src");
            nextImgUrl = nextSrc.substr(0, nextSrc.indexOf("?"));
            if (currentImgUrl == nextImgUrl) {
                count++;
                $(skuImages[j]).closest("td").hide();
            }
        }
        if (count > 1) {
            $(skuImages[i]).closest("td").attr("rowspan", count);
        }
    }
}
