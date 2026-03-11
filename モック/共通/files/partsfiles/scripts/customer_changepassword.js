$(document).ready(function() {
    // パンくず
    createCustomerChangePasswordTopicPathList();
    
    changepasswordValidation();
});

/**
 * パンくずリストを作成
 */
function createCustomerChangePasswordTopicPathList() {
    var topicPathList = {};
    // Source_V12.18_add_start
    // topicPathList["マイページ"] = "/mypage/mypage/";
    // Source_V12.18_add_end
    // Mockup_V12.18_add_start
    topicPathList["マイページ"] = "../mypage/マイページ.html";
    // Mockup_V12.18_add_end
    topicPathList["パスワード変更"] = "";
    
    initializeTopicPath(topicPathList);
}

var changepasswordValidation = function() {
    var inputList = $("input[type='password']");
    // リアルタイムバリデーション設定
    inputList.siValidation({
    //
    });
};

/**
 * アクション送信
 *
 */
function sendChangepasswordRequest(actionId, element) {

    // Source_V12.18_add_start
    // var successFunction = function(data) {
    //     $("input[type='password']").val("");
    // };

    // var parameters = createBaseParametersForAjaxApi("mypage", "customer_changepassword", actionId);
    // var afterUri = "/mypage/customer_changepassword/" + actionId + "/";
    // var functions = createAjaxFunctions(null, null, successFunction);

    // var param = {
    //     parameters : parameters,
    //     functions : functions,
    //     uri : afterUri,
    //     formId : "customerChangepasswordInfoForm",
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_V12.18_add_end
    // Mockup_V12.18_add_start
   $('.informationBlock').show();
    // Mockup_V12.18_add_end
}
