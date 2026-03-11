$(document).ready(function() {

    // パンくず
    createMypageTopicPathList();

    // 規格名作成
    scanStandardName(".commodityList");
});

/**
 * パンくずリストを作成
 */
function createMypageTopicPathList() {
    var topicPathList = {};
    topicPathList["マイページ"] = "";

    initializeTopicPath(topicPathList);
}

function sendMypageMoveRequest(url, element) {

    // Source_V12.18_add_start
    // var parameters = createBaseParametersForAjaxApi("mypage", "mypage", "move");
    // parameters.url = url;

    // var param = {
    //     parameters : parameters,
    //     uri : "/mypage/mypage/move/",
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_V12.18_add_end
    // Mockup_V12.18_add_start
    window.location = url;
    // Mockup_V12.18_add_end
}
