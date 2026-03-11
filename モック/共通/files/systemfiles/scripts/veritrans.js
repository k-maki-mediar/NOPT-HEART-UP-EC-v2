var validateErrorMessages = {
    missing_card_number: "クレジットカード番号を入力してください。",
    missing_security_code: "クレジットカードのセキュリティコードを入力してください。",
    missing_card_expire: "クレジットカードの有効期限を選択してください。",
    missing_cardholder_name: "クレジットカード名義人を入力してください。",
};

var responseStatus = {
    success: "success",
    failure: "failure"
}

var responseErrorMessages = {
    invalid_card_number: "クレジットカード番号を正しく入力してください。",
    digit_check_error: "クレジットカード番号を正しく入力してください。",
    invalid_card_expire: "クレジットカードの有効期限を正しく入力してください。",
    invalid_security_code: "クレジットカードのセキュリティコードを正しく入力してください。",
    invalid_other_error: "クレジットカードはご利用になれません。",
    invalid_server_error: "MDKトークン処理においてエラーが発生しました。",
    invalid_cardholder_name: "クレジットカード名義人を正しく入力してください。",
}

function paymentTokenProcess(formId, processFunction, element) {

    var target = $('input[data-payment-type]:checked');
    // カード決済の場合の処理
    if (target.attr('data-payment-type') == "04") {
        var targetArea = $("#paymentMethodArea_" + target.val());
        if (!$('.inputtedCard', targetArea).is(':checked') && $('.newCard', targetArea).is(':checked')) {
            getPaymentToken(formId, processFunction, element, "paymentMethodArea_" + target.val());
            return;
        }
    }
    processFunction(element);
}

function getPaymentToken(formId, processFunction, element, targetId) {

    var targetArea = $("#" + targetId);
    // 登録データ取得
    var security_code = targetArea.find(getPaymentElementRegex('securityCode')).val();
    var cardholder_name;
    if ($('.newCard', targetArea).is(':checked')) {
        // お支払い方法選択画面
        cardholder_name = targetArea.find(".newCardInfoArea").find(getPaymentElementRegex('cardholderName')).val()
    } else {
        // クレジットカード情報登録画面
        cardholder_name = targetArea.find(getPaymentElementRegex('cardholderName')).val();
    }
    var card_number = targetArea.find(getPaymentElementRegex('cardNo')).val();
    var cardExpirationMonth = targetArea.find(getPaymentElementRegex('cardExpirationMonth')).val();
    var cardExpirationYear = targetArea.find(getPaymentElementRegex('cardExpirationYear')).val();
    var card_expire = cardExpirationMonth + "/" + cardExpirationYear;
    var token_api_key = targetArea.find("input[name='paymentTokenApiKey']").val();

    var param = {
        cardholder_name: cardholder_name,
        card_number: card_number,
        card_expire: card_expire,
        security_code: security_code,
        token_api_key: token_api_key
    };

    if (validateTokenParameter(param)) {
        requestMdkToken(formId, param, processFunction, element);
    }

}

function validateTokenParameter(param) {

    var errorMessages = [];
    // カード名義人入力チェック
    if( typeof param.cardholder_name != "undefined" ){
        if (param.cardholder_name.length < 1) {
            errorMessages.push(validateErrorMessages.missing_cardholder_name);
        }
    }
    // カード番号入力チェック
    if (param.card_number.length < 1) {
        errorMessages.push(validateErrorMessages.missing_card_number);
    }
    // 有効期限選択チェック
    if (param.card_expire.length < 5) {
        errorMessages.push(validateErrorMessages.missing_card_expire);
    }
    // セキュリティコード入力チェック
    if (param.security_code.length < 1) {
        errorMessages.push(validateErrorMessages.missing_security_code);
    }

    if (errorMessages.length > 0) {
        showErrorMessage(errorMessages);
        return false;
    }

    return true;
}

function requestMdkToken(formId, param, processFunction, element) {

    var jsonParam = JSON.stringify(param);
    var tokenServerUrl = $(getPaymentElementRegex('paymentTokenServerUrl')).val();

    $.ajax({
        url: tokenServerUrl,
        type: "POST",
        data: jsonParam,
        dataType: 'json',
        async: true,
        timeout: 5000,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },

        beforeSend: function (xhr, settings) {
            blockDoubleClick("paymentBlockDbClick");
        },
        success: function (data) {
            if (data.status == responseStatus.success) {
                createPaymentTokenElement(formId, data);
                processFunction(element);
            }
        },
        error: function (xhr, status, errorThrown) {
            var data = xhr.responseJSON;
            if (data) {
                var errMsg = responseErrorMessages[data.code];
                var errorMessage = errMsg ? errMsg : responseErrorMessages.invalid_other_error;
                if (errorMessage == responseErrorMessages.invalid_other_error) {
                    sendErrorLog(data.message);
                }
                showErrorMessage([errorMessage]);
            } else {
                sendErrorLog(responseErrorMessages.invalid_server_error);
                showErrorMessage([responseErrorMessages.invalid_other_error]);
            }
        },
        complete: function (xhr, statusText) {
            $("#paymentBlockDbClick").remove();
        }
    });

}

function sendErrorLog(logMessage) {

    logger.error(logMessage);
    logger.transport();
}

function showErrorMessage(errorMessages) {

    parceMessageArea({
        messages: {
            errorMessages: errorMessages
        }
    }, "document");
}

function createPaymentTokenElement(formId, response) {

    $('#paymentToken').remove();
    $('#tokenExpireDate').remove();
    $('#reqCardNumber').remove();

    var tokenTag = createPaymentElement('paymentToken', response.token);
    var tokenExpireDate = createPaymentElement('tokenExpireDate', response.token_expire_date);
    var reqCardNumber = createPaymentElement('reqCardNumber', response.req_card_number);

    $('#' + formId).append(tokenTag).append(reqCardNumber).append(tokenExpireDate);
}

function createPaymentElement(id,value) {

    return $('<input>').attr('type', 'hidden').attr('name', id).attr('id', id).attr('value', value);
}

function getPaymentElementRegex(id) {

    var reg = "[id^='" + id + "']";
    return reg;
}