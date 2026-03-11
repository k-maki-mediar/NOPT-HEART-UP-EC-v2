/**
 * ＰＣ版
 */
$(document).ready(function() {
    // 規格名作成
    scanStandardName(".commodityListBodyArea");

    $("#confirmMain dt").click(function(event) {
        if (!$(event.target).is(".deliveryUpdateButton")) {
            $(this).next("dd").slideToggle(200);
            $(this).toggleClass("closeTtl");
        }
    });

});


/**
 * リクエスト送信
 *
 * @param actionId
 */
function sendConfirmRequest(element) {
    var successFunction = function(data) {
        if( data.externalPaymentParameter ) {
            var config = {
                "api_key" : data.externalPaymentParameter.apiKey,
                "logo_url": "http://www.paidy.com/images/logo.png",
                "closed":function(callbackData) {
                    var parameters = createBaseParametersForAjaxApi("order", "external_payment", "confirm");
                    parameters.status = callbackData.status;
                    parameters.id = callbackData.id;
                    var param = {
                        parameters : parameters,
                        uri : "/order/external_payment/confirm/paidypostpay/",
                        dataType : "json",
                        async : false,
                        element : element	
                    }
                    sendAjaxToApi(param);
                }
            }
            var paidyHandler = Paidy.configure(config);
            var payload = JSON.parse(data.externalPaymentParameter.parameter);
            paidyHandler.launch(payload);
        }
    };
    var functions = createAjaxFunctions(null, null, successFunction);

    var param = {
        parameters : createBaseParametersForAjaxApi("order", "confirm", "register"),
        functions : functions,
        uri : "/order/confirm/register/",
        dataType : "json",
        async : false,
        element : element
    }
    sendAjaxToApi(param);
}


function sendConfirmMoveRequest(url, element) {
    // Source_code_v12.18_add_start
    // var parameters = createBaseParametersForAjaxApi("order", "confirm", "move");
    // parameters.url = url;
    // var param = {
    //     parameters : parameters,
    //     uri : "/order/confirm/move/",
    //     dataType : "json",
    //     async : false,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    window.location = url;
    // Mockup_v12.18_add_end
}
