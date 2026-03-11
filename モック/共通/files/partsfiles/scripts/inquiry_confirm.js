$(document).ready(function() {
});

// 確認画面遷移処理
function sendInquiryRequest(actionId, element) {

    var parameters = createBaseParametersForAjaxApi("customer", "inquiry_confirm", actionId);

    var param = {
        parameters : parameters,
        uri : "/customer/inquiry_confirm/" + actionId + "/",
        formId : "inquiryForm",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}