$(document).ready(function() {
});

/**
 * アクション送信
 *
 */
function verifyMfaCode(element) {

    var parameters = createBaseParametersForAjaxApi("common", "login_mfa", "verify");
    var afterUri = "/common/login_mfa/verify/";
    parameters.verifyCode = $('input[name="verifyCode"]').val()

    var param = {
        parameters : parameters,
        uri : afterUri,
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}
