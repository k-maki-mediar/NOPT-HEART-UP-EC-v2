$(document).ready(function() {
    // パンくず
    createWithdrawalRequestTopicPathList();
    
});

function createWithdrawalRequestTopicPathList() {
    var topicPathList = {};
    // Source_V12.18_add_start
    // topicPathList["マイページ"] = "/mypage/mypage/";
    // Source_V12.18_add_end
    // Mockup_V12.18_add_start
    topicPathList["マイページ"] = "../mypage/マイページ.html";
    // Mockup_V12.18_add_end
    topicPathList["お客様退会依頼"] = "";
    
    initializeTopicPath(topicPathList);
}

var withdrawalRequest = function() {


    var parameters = createBaseParametersForAjaxApi("mypage", "withdrawal_request", "move");

    var param = {
        parameters : parameters,
        uri : "/mypage/withdrawal_request/move/",
        dataType : "json",
        async : true,
    }
    sendAjaxToApi(param);

}