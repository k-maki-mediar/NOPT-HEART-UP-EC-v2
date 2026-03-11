/**
 * ＰＣ版
 */
$(document).ready(function() {

    // カートが空
    if ($("#cartArea").children().length == 0) {
        noCartItem();
        return;
    }

    // 規格
    scanStandardName("#cartArea");

    // パンくず
    createCartTopicPathList();

    // リアルタイムバリデーション
    var inputList = $("input[type='text']");
    inputList.siValidation({});

});

/**
 * パンくずリストを作成
 */
function createCartTopicPathList() {
    var topicPathList = {};
    topicPathList["カート"] = "";

    initializeTopicPath(topicPathList);
}

/**
 * お気に入りアクション作成
 */
function sendAddFavoriteRequest(shopCode, commodityCode, skuCode, isSet, element) {

    var parameters = createBaseParametersForAjaxApi("mypage", "favorite", "add");
    var useSkuCode = skuCode;

    if (isSet === "true") {
        useSkuCode = commodityCode;
    }

    parameters.shopCode = shopCode;
    parameters.skuCode = useSkuCode;

    var addFavoriteCallBack = function() {
        $('html,body').animate({
            scrollTop : 0
        }, 'fast');
    }

    parameters.loginAfterUrl = "/cart/cart/";
    parameters.loginAfterActionInfo = "/mypage/favorite/add/";
    parameters.additionalActionParameterKey = "shopCode,skuCode";
    var functions = createAjaxFunctions(null, null, addFavoriteCallBack);

    var param = {
        parameters : parameters,
        functions : functions,
        uri : "/mypage/favorite/add/",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

/**
 * クリアカート
 */
function sendClearCartRequest(element) {

    var param = {
        parameters : createBaseParametersForAjaxApi("cart", "cart", "clear"),
        functions : createAjaxFunctions(null, null, cartReload),
        uri : "/cart/cart/clear/",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

/**
 * 数量変更
 */
function changeNumberOfItem(shopCode, purchaseIndex, element) {

    var parameters = createBaseParametersForAjaxApi("cart", "cart", "update_quantity");
    parameters.shopCode = shopCode;
    parameters.orderPurchaseIndex = purchaseIndex;

    var param = {
        parameters : parameters,
        functions : createAjaxFunctions(null, null, cartReload),
        formId : "cartForm_" + purchaseIndex,
        uri : "/cart/cart/update_quantity/",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}


/**
 * カート商品削除
 */
function sendCartItemDeleteRequest(shopCode, skuCode, incWorkKey, purchaseMethodType, element) {

    var parameters = createBaseParametersForAjaxApi("cart", "cart", "remove");
    parameters.shopCode = shopCode;
    parameters.skuCode = skuCode;
    parameters.incWorkKey = incWorkKey;
    parameters.purchaseMethodType = purchaseMethodType;

    var param = {
        parameters : parameters,
        functions : createAjaxFunctions(null, null, cartReload),
        uri : "/cart/cart/remove/",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

/**
 * カートが空の処理
 */
function noCartItem() {
    var errorMessage = $("<div></div>");
    $(errorMessage).addClass("errorBlock");
    $(errorMessage).html("<div class=\"errorMessage\">" + message.noCartItem + "</div>");
    $("#noCartItemMessage").append(errorMessage);
    $("#cartMainArea").remove();
}

/**
 * お届け先選択画面へ
 */
function shippingMoveRequest(purchaseIndex, shopCode, deliveryShopCode, reserveSkuCode, purchaseMethodType, element) {

    var parameters = createBaseParametersForAjaxApi("cart", "cart", "move");
    parameters.orderPurchaseMethodType = purchaseMethodType;
    parameters.orderPurchaseIndex = purchaseIndex;
    parameters.shopCode = shopCode;
    parameters.deliveryShopCode = deliveryShopCode;
    parameters.reserveSkuCode = reserveSkuCode;
    parameters.url = settings.apiServ + "/cart/cart/shipping/";
    var sendform = "sendform_" + purchaseIndex;
    parameters.sendform = sendform;

    var param = {
        parameters : parameters,
        functions : createAjaxFunctions(null, null, cartReload),
        formId : "cartForm_" + purchaseIndex,
        uri : "/cart/cart/move/",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

/** カート再描画 */
function cartReload(data, messages) {
    if (messages.errorMessages.length == 0) {
        var url = location.toString();
        url = url.split("#")[0];
        location.assign(url);
    }
}

/** 数量変更時、PCとSP両レイアウトの数量の同期を取る */
function changeQuantity(obj, commodityCartId) {

    var quantity = $(obj).val();
    var parentObj = document.getElementsByName(commodityCartId);

    for (var i = 0; i < parentObj.length; i++) {

        // 「PC用input text」、「SP用input text」、「submit用input hidden」の3点を変更する
        $(parentObj[i]).find(".commodityQuantity").val(quantity);

    }
}

function confirmMoveRequest(purchaseIndex, shopCode, deliveryShopCode, reserveSkuCode, purchaseMethodType, element) {

    var parameters = createBaseParametersForAjaxApi("cart", "cart", "move");
    parameters.orderPurchaseMethodType = purchaseMethodType;
    parameters.orderPurchaseIndex = purchaseIndex;
    parameters.shopCode = shopCode;
    parameters.deliveryShopCode = deliveryShopCode;
    parameters.reserveSkuCode = reserveSkuCode;
    parameters.url = settings.apiServ + "/cart/cart/confirm/";
    var sendform = "sendform_" + purchaseIndex;
    parameters.sendform = sendform;

    var param = {
        parameters: parameters,
        functions: createAjaxFunctions(null, null, cartReload),
        formId: "cartForm_" + purchaseIndex,
        uri: "/cart/cart/move/",
        dataType: "json",
        async: true,
        element: element
    }
    sendAjaxToApi(param);

    $("#lastOrderCloseLightBoxButton_" + purchaseIndex + "_" + shopCode ).trigger('click');

}