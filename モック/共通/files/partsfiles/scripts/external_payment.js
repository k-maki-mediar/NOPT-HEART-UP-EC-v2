/**
 * ＰＣ版
 */
$(document).ready(function() {

    var actionId = "init";

    var accessSet = analyzeAccessSet(location.toString());

    var uri = "/order/external_payment/" + actionId + "/";
    var parameters = createBaseParametersForAjaxApi("order", "external_payment", actionId);

    var url = location.toString();
    var urlParameters = url.split("?");
    if (1 < urlParameters.length) {
        var params = urlParameters[1].split("&");
        var paramsArray = [];
        for (i = 0; i < params.length; i++) {
            var param = params[i].split("=");
            var key = param[0];
            var value = param[1];
            parameters[key] = value;
        }
    }

    parameters.url = location.toString();
    var functions = createAjaxFunctions(null, null, externalPaymentCallback);

    var param = {
        parameters : parameters,
        functions : functions,
        uri : uri,
        dataType : "json",
        async : false,
        skipComplete : true
    }
    sendAjaxToApi(param);
});

var externalPaymentCallback = function(data) {

    var patternCode = data.formPatternCode;
    log(data.externalFormHtml);

    if (patternCode == "failed") {

        $("#urlOnlyArea").remove();

    } else if (patternCode == "urlOnly") {

        $("#buttonArea").remove();
        $("form[name='urlOnlyFrm']").attr("action", data.externalFormHtml);

    } else if (patternCode == "formOnly") {

        $("#completeMainArea").html(data.externalFormHtml);

    } else if (patternCode == "completeMainArea") {

        $("#externalPaymentMain").html(data.externalFormHtml);

    } else if (patternCode == "fullHtml") {

        /*
         *  fullHtmlの場合、external_paymentの初期表示のResponseデータとして
         *  決済プロバイダから返却された外部決済踏み台ページHTMLを直接返しているので
         *  AjaxのcallBackとしては処理不要
         */
    }
};

/**
 * 次画面に遷移する
 *
 * @param url
 */
function moveNext(url) {
    location.href = createWovnHref(settings.context + url);
}
