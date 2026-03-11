$(document).ready(function() {

    // リアルタイムバリデーション設定
    var inputList = $("input[type='password']");
    inputList.siValidation({
    //
    });

});

/**
 * アクション送信
 *
 */
function sendCustomerInitpasswordRequest(actionId, element) {

    var successFunction = function(data, messages) {
        $("input[type='password']").val("");
        if (messages.errorMessages.length == 0) {
            $("#customerInitpasswordArea").remove();
        }
    }

    var uri = "/customer/customer_initpassword/" + actionId;
    var parameters = createBaseParametersForAjaxApi("customer", "customer_initpassword", actionId);
    var functions = createAjaxFunctions(null, null, successFunction);

    var param = {
            parameters : parameters,
            functions : functions,
            uri : uri,
            formId : "customerInitpasswordInfoForm",
            dataType : "json",
            async : true,
            element : element
    }
    sendAjaxToApi(param);
}
