$(document).ready(function() {
    previewFunctionList.push(function() {
        $("#purchasingConfirmArea").find("input").attr("disabled", "disabled");
    });
});

/**
 * カートに入れるボタン押下時
 */
function showPurchasingConfirm(formId) {

    if (formId.startsWith("detailInfo")) {
        // 商品詳細系画面の購入確認

        if ($("#purchasingConfirmFlg").val() == "true") {

            // 購入確認LightBoxにて同意するボタンevent
            if(!$._data($("#purchasingConfirmArea").find("input[name='confirm']").get(0), "events")){
                $("#purchasingConfirmArea").find("input[name='confirm']").one("click", function() {
                    $(".js_lb_overlay").remove();
                    $("#purchasingConfirmArea").hide();
                    // detail_xxx.jsのカート追加functionを利用
                    addCartOfDetail(formId, true);
                });
            }
            pcPopup("purchasingConfirmArea");

        } else {
            // detail_xxx.jsのカート追加functionを利用
            addCartOfDetail(formId, false);

        }

    } else {
        // 商品一覧、お気に入れ一覧画面、規格リストの購入確認

        var formElement = document.forms[formId];
        var purchasingConfirmFlg = formElement.purchasingConfirmFlg.value;

        if (purchasingConfirmFlg == "true" || purchasingConfirmFlg == "1") {
            showPurchasingConfirm.shopCode = formElement.shopCode.value;
            showPurchasingConfirm.commodityCode = formElement.commodityCode.value;
            showPurchasingConfirm.skuCode = formElement.skuCode.value;
            showPurchasingConfirm.purchasingConfirmFlg = formElement.purchasingConfirmFlg.value;

            getPurchasingConfirm(formId);

        } else {
            // 数量は１固定
            var parameters = {
                "quantity" : "1",
                "purchaseMethodType" : ""
            };

            addCart(formId, null, false, parameters);
        }
    }

}

/**
 * 購入確認LightBoxにて同意しないボタン押下時
 */
function notConfirmPurchasing() {
    $(".js_lb_overlay").remove();
    $("#purchasingConfirmArea").hide();
    $("#purchasingConfirmArea").find("input[name='confirm']").unbind("click");
}

/**
 * 購入確認情報取得・表示
 */
function getPurchasingConfirm(formId) {

    var uri = "/catalog/listpurchasing/search/";
    var parameters = createBaseParametersForAjaxApi("catalog", "listpurchasing", "search");
    purchasingConfirmCallBack.formId = formId;
    var functions = createAjaxFunctions(null, null, purchasingConfirmCallBack);

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
 * 購入確認LightBoxを表示する
 */
function purchasingConfirmCallBack(data) {

    $(".js_lb_overlay").remove();
    $("#skuListArea").hide();

    var dom = $("#purchasingConfirm");

    bindDataToDom(dom, data.purchasingConfirm);

    var formId = purchasingConfirmCallBack.formId;

    // 購入確認LightBoxにて同意するボタンevent
    if(!$._data($("#purchasingConfirmArea").find("input[name='confirm']").get(0), "events")){
        $("#purchasingConfirmArea").find("input[name='confirm']").one("click", function() {
            $(".js_lb_overlay").remove();
            $("#purchasingConfirmArea").hide();
            $("#purchasingAgreementFlg").val(true);

            var parameters = {
                "shopCode" : showPurchasingConfirm.shopCode,
                "commodityCode" : showPurchasingConfirm.commodityCode,
                "skuCode" : showPurchasingConfirm.skuCode,
                "quantity" : "1"
            };

            addCart(formId, null, true, parameters);
        });
    }
    pcPopup("purchasingConfirmArea");
}
