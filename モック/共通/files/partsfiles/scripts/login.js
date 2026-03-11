$(document).ready(function() {

    // リアルタイムバリデーション設定
    $("input[type='text'],input[type='password']").siValidation({});

    // フォーカス
    var loginId = $("#loginId").val();
    if (!loginId) {
        finalFunctionList.push(function() {
            setFocus("#loginId");
        });
    } else {
        finalFunctionList.push(function() {
            setFocus("#password");
        });
    }

    loginInitSocialLoginAuth();
});

// ログイン
function submitLoginInfo(formId, element) {

    var beforeSendFunction = function() {
        $('#submitLoginButton').attr("disabled", true);
    };

    var successFunction = function(data) {
        $("#password").val("");
    };

    var param = {
        parameters : createBaseParametersForAjaxApi("common", "login", "auth"),
        functions : createAjaxFunctions(beforeSendFunction, null, successFunction),
        uri : "/common/login/auth/",
        formId : formId,
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

