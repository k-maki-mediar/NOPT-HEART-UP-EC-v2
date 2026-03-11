$(document).ready(function() {
});

/**
 * アクション送信
 *
 */
function sendInformationMailRequest(actionId, element) {

    var successFunction = function(data, messages) {
        if (messages.errorMessages.length == 0) {
            $("#informationMailArea").remove();
        }
    }

    var uri = "/customer/information_mail_unsubscribe/" + actionId;
    var parameters = createBaseParametersForAjaxApi("customer", "information_mail_unsubscribe", actionId);
    var functions = createAjaxFunctions(null, null, successFunction);

    var param = {
            parameters : parameters,
            functions : functions,
            uri : uri,
            formId : "informationMailForm",
            dataType : "json",
            async : true,
            element : element
    }
    sendAjaxToApi(param);
}
