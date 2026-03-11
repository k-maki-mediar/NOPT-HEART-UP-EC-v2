$(document).ready(function() {
    // パンくず
    createMfaTopicPathList();
    
});

/**
 * パンくずリストを作成
 */
function createMfaTopicPathList() {
    var topicPathList = {};
    // Source_V12.18_add_start
    // topicPathList["マイページ"] = "/mypage/mypage/";
    // Source_V12.18_add_end
    // Mockup_V12.18_add_start
    topicPathList["マイページ"] = "../mypage/マイページ.html";
    // Mockup_V12.18_add_end
    topicPathList["2段階認証設定"] = "";
    
    initializeTopicPath(topicPathList);
}


/**
 * アクション送信
 *
 */
function createTotp(actionId, element) {

    // Source_code_v12.18_add_start
    // var parameters = createBaseParametersForAjaxApi("mypage", "mfa", actionId);
    // var afterUri = "/mypage/mfa/";

    // var param = {
    //     parameters : parameters,
    //     uri : afterUri,
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    window.location = actionId;
    // Mockup_v12.18_add_end

}

function updateTotp(element) {

    // Source_code_v12.18_add_start
    // var parameters = createBaseParametersForAjaxApi("mypage", "mfa", "totp_update");
    // var afterUri = "/mypage/mfa/";
    // parameters.verifyCode = $('input[name="verifyCode"]').val()

    // var param = {
    //     parameters : parameters,
    //     uri : afterUri,
    //     // formId : formId,
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    var idButton = element.id;

    if (idButton === "cancelTotp") {
        window.location = "../mypage/2段階認証設定.html?screen=cancelTotp";
    } else {
        window.location = "../mypage/2段階認証設定(有効).html";
    }
    // Mockup_v12.18_add_end

}
