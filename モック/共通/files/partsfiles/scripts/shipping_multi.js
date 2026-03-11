/**
 * 次へ
 */
function moveShippingSplit(element) {

    var uri = "/order/shipping/multi_move/";
    var parameters = createBaseParametersForAjaxApi("order", "shipping",
	    "multi_move");
    parameters.requestPattern = "move_split";

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
 * 新規アドレス登録用なparameter設定
 */
function getSubmitNewAddressParam(){
    var submitNewAddressParam = {};
    
    // url
    submitNewAddressParam.url = "/order/shipping_multi/";
    
    // 選択されたアドレスのリスト
    var selectAddressIndexObj = $('input[name="selectAddressIndex"]:checked');
    var selectAddressIndex = new Array();
    for (var int = 0; int < selectAddressIndexObj.length; int++) {
        var array_element = selectAddressIndexObj[int];
        selectAddressIndex.push($(array_element).val());
    }
    submitNewAddressParam.selectAddressIndex = selectAddressIndex;
    
    return submitNewAddressParam;
}
