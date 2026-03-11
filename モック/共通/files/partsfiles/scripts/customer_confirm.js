$(document).ready(function() {
    
});

function sendRegisterRequest(element) {

    var beforeSendFunction = function() {
        $('#registerButton').attr("disabled", true);
    };

    var actionId = $("#displayMode").val();
    var uri = "/customer/customer_confirm/" + actionId + "/";

    var parameters = createBaseParametersForAjaxApi("customer", "customer_confirm", actionId);
    var functions = createAjaxFunctions(beforeSendFunction, null, null);

    var param = {
        parameters : parameters,
        functions : functions,
        uri : uri,
        dataType : "json",
        formId : "customerInfoForm",
        async : true,
        element : element
    }
    sendAjaxToApi(param);

}
