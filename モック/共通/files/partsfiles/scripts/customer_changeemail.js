$(document).ready(function() {
    changeemailValidation();
});

var changeemailValidation = function() {
    var inputList = $("input[type='text']");
    // リアルタイムバリデーション設定
    inputList.siValidation({});
};


/**
 * アクション送信
 *
 */
function sendChangeemailRequest(actionId, element) {

    // Source_code_v12.18_add_start
    // var successFunction = function(data) {
    //     $('input[name="newEmail"]').val("");
    //     $('input[name="confirmCode"]').val("");
    //     $('#oldEmail').text(data.oldEmail);
    // };

    // var parameters = createBaseParametersForAjaxApi("mypage", "customer_changeemail", actionId);
    // var afterUri = "/mypage/customer_changeemail/" + actionId + "/";
    // var functions = createAjaxFunctions(null, null, successFunction);

    // var param = {
    //     parameters : parameters,
    //     functions : functions,
    //     uri : afterUri,
    //     formId : "customerChangeemailInfoForm",
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    $(".informationBlock").show();
    $("#sendCode").hide();
    $("#updateComplete").show();
    // Mockup_v12.18_add_end
}

function confirmCodeIssue(emailName,element) {

    // Source_code_v12.18_add_start
    // var parameters = createBaseParametersForAjaxApi("customer", "confirm_code", "issue");
    // parameters.url = "/customer/confirm_code/issue";
    // parameters.email = $('input[name="'+ emailName +'"]').val()

    // var param = {
    //     parameters : parameters,
    //     uri : "/customer/confirm_code/issue",
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    $(".informationBlock").show();
    $("#sendCode").show();
    $("#updateComplete").hide();
    // Mockup_v12.18_add_end
}