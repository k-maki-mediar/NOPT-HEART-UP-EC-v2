$(document).ready(function() {
    createPointHistoryTopicPathList();
    // ページャー
    pagerDataBind();
});

/**
 * パンくずリストを作成
 */
function createPointHistoryTopicPathList() {
    var topicPathList = {};
    // Source_V12.18_add_start
    // topicPathList["マイページ"] = "/mypage/mypage/";
    // Source_V12.18_add_end
    // Mockup_V12.18_add_start
    topicPathList["マイページ"] = "../mypage/マイページ.html";
    // Mockup_V12.18_add_end
    topicPathList["ポイント履歴"] = "";

    initializeTopicPath(topicPathList);
}

var pointHistoryCallback = function() {

};

/**
 * 指定URLに遷移する
 * 
 * @param url
 */
function sendPointHistoryMoveRequest(url, element) {

    // Source_V12.18_add_start
    // var parameters = createBaseParametersForAjaxApi("mypage", "point_history", "move");
    // parameters.url = url;
    // var functions = createAjaxFunctions(null, null, pointHistoryCallback);

    // var param = {
    //     parameters : parameters,
    //     functions : functions,
    //     uri : "/mypage/point_history/move/",
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_V12.18_add_end
    // Mockup_V12.18_add_start
    location.href = '../mypage/注文内容.html'
    // Mockup_V12.18_add_end
}
