/**
 * PC版
 */
$(document).ready(function() {
});

/**
 * 確定
 */
function shippingSplit(element) {
    var uri = "/order/shipping/split_fix/";
    var parameters = createBaseParametersForAjaxApi("order", "shipping", "split_fix");
    parameters.requestPattern = "split_fix";

    var param = {
        parameters : parameters,
        uri : uri,
        formId : "addressSelect",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

/**
 * 均等割り
 */
function allocateShipping() {

    // 割り当て数を0で初期化
    $(".allocateSelect").val("0");

    var commodityQuantityList = $(".commodityQuantity");
    for (var int = 0; int < commodityQuantityList.length; int++) {
        var commodityQuantity = commodityQuantityList[int];
        var amount = $(commodityQuantity).html();
        var shopCode = $(commodityQuantity).data("shop");
        var commodityindex = $(commodityQuantity).data("commodityindex");

        var selectList = $(".allocateSelect" + shopCode + "_" + commodityindex);
        var selectLength = selectList.length;
        var selectCnt = 0;

        var countOne = Math.floor(amount / selectLength);
        var countTotal = countOne * selectLength;

        for (var int2 = 0; int2 < selectLength; int2++) {
            var select = selectList[selectCnt];
            selectCnt++;

            if (countTotal == amount) {
                $(select).val(countOne);
            } else {
                $(select).val(countOne + 1);
                countTotal++;
            }
        }
    }
}
