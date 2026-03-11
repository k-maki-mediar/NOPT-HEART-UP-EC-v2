$(document).ready(function() {

    var inputList = $("input[name='email']");
    // リアルタイムバリデーション設定
    $(inputList).siValidation({
    //
    });

});

function sendCustomerSendpasswordRequest(formId, element) {

    var parameters = createBaseParametersForAjaxApi("customer", "customer_sendpassword", "sendmail");

    var param = {
        parameters : parameters,
        uri : "/customer/customer_sendpassword/sendmail/",
        formId : formId,
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

// enterキーで送信する
function enterKeySubmit(keyCode) {
    if (keyCode == 13) {
        sendCustomerSendpasswordRequest('customerSendpasswordForm', $(".sendPassword"));
    }
}
