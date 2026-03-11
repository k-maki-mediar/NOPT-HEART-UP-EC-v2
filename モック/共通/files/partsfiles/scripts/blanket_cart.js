$(document).ready(function() {

    // パンくず
    createBlanketCartTopicPathList();

    // リアルタイムバリデーション設定
    var inputList = $("input[type='text']", "#blanketCartMain");
    inputList.siValidation({
    //
    });

});

/**
 * パンくずリストを作成
 */
function createBlanketCartTopicPathList() {

    var topicPathList = {};
    topicPathList["まとめてカート"] = "";

    initializeTopicPath(topicPathList);
}

/**
 * 削除アクション
 */
function sendBlanketCartRemoveRequest(targetNo, element) {

    var parameters = createBaseParametersForAjaxApi("cart", "blanket_cart", "remove");
    parameters.targetNo = targetNo;
    var param = {
        parameters : parameters,
        uri : "/cart/blanket_cart/remove/",
        dataType : "json",
        async : true,
        formId : "blanketCartForm",
        functions : createAjaxFunctions(msgReload, null, blanketSuccessFunction),
        element : element
    }
    sendAjaxToApi(param);
}

/**
 * カートに入れると商品名取得
 */
function sendBlanketCartRequest(actionId, element) {

    var param = {
        parameters : createBaseParametersForAjaxApi("cart", "blanket_cart", actionId),
        uri : "/cart/blanket_cart/" + actionId + "/",
        dataType : "json",
        async : true,
        formId : "blanketCartForm",
        functions : createAjaxFunctions(msgReload, null, blanketSuccessFunction),
        element : element
    }
    sendAjaxToApi(param);
}

function blanketSuccessFunction(data) {

    for (var i = 0; i < data.detailList.length; i++) {

        var target = $(".commodityInfoTemplateArea", "#blanketCartMain")[i];

        var skuCode = $(target).find("input[name='skuCode']");
        var skuCodeLabel = $(target).find("span.skuCodeLabel");
        var removeButton = $(target).find("input[name='blanketCartRemoveButton']");
        var commodityNameLabel = $(target).find("span.commodityName");
        var standardDetailNameLabel = $(target).find("span.bean.standardDetailName");
        var commodityName = $(target).find("input[name='commodityName']");
        var shopCode = $(target).find("select[name='shopCode']");
        var quantity = $(target).find("input[name='quantity']");
        var row = data.detailList[i];

        $(skuCode).val(row.skuCode);
        $(skuCodeLabel).html(row.skuCode);
        $(commodityNameLabel).html(row.commodityName);
        $(commodityName).val(row.commodityName);
        $(standardDetailNameLabel).html(row.standardDetailName);
        $(shopCode).val(row.shopCode);
        $(quantity).val(row.quantity);
        if (row.commodityName) {
            $(skuCode).addClass("hidden");
            $(skuCodeLabel).removeClass("hidden");
            $(removeButton).removeClass("hidden");
        } else {
            $(skuCode).removeClass("hidden");
            $(skuCodeLabel).addClass("hidden");
            $(removeButton).addClass("hidden");
        }

    }

}
function msgReload() {
    var errMsg = $(".errorBlock");
    errMsg.remove();
}
