function popupNewAddressArea() {

    // リアルタイムバリデーション設定
    var inputList = $("#addressEditArea input[type='text']");
    inputList.siValidation({});
    // リアルタイムバリデーションクリア
    $("div.validationMessageArea").remove();

    var closeCallback = function() {
	// メッセージエリアのクリア
	$("#addressMessage").html("");
	// 入力項目の削除
	$("#addressEditArea input[type='text']").val("");
	$("#addressEditArea select").val("");
	$("#postalGuide").html("");
    };
    pcPopup('addressEditArea', {
	onClose : closeCallback
    });
}

/**
 * 新お届け先追加
 */
function submitNewAddress(element) {

    var successFunction = function(data, messages) {
        // エラーメッセージの移動
        var orgMessageArea = $("#message");
        var htmlData = orgMessageArea.html();

        if (htmlData != "") {
            $("#addressMessage").html(htmlData);
            orgMessageArea.html("");

            // スクロール(LightBox) 先頭までスクロールする
            $("#addressScrollArea").animate({
                scrollTop : 0
            }, 'fast');
        }
    };

    var uri = "/order/shipping/add_new_address/";
    var parameters = createBaseParametersForAjaxApi("order", "shipping", "add_new_address");
    
    // 呼び出し元画面のjsで、「getSubmitNewAddressParam」というfuncitonを宣言し、必要なparameterを設定する
    var submitNewAddressParam = getSubmitNewAddressParam();
    parameters.url = submitNewAddressParam.url;
    if( typeof submitNewAddressParam.selectAddressIndex != "undefined" ){
        parameters.selectAddressIndex = submitNewAddressParam.selectAddressIndex;
    }
    
    parameters.requestPattern = "add_new_address";
    
    var functions = createAjaxFunctions(null, null, successFunction);

    if ( $('input[name="message"]').length == 0 ) {
        $('<input>').attr({
            'type': 'hidden',
            'name': 'message',
            'value': $('textarea[name="message"]').val()
        }).appendTo(element);
    }

    var param = {
        parameters : parameters,
        functions : functions,
        uri : uri,
        formId : "addressRegisterForm",
        dataType : "json",
        async : true,
        element : element,
        messageType : "popup"
    }
    sendAjaxToApi(param);
}
