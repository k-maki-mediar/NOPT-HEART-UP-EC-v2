$(document).ready(function() {

    var targetRoot = $(".commodityDetailArea");
    // 規格名作成
    scanStandardName(targetRoot);
    // パンくず
    createFavoriteListTopicPathList();
    // ページャー
    pagerDataBind();
});

/**
 * パンくずリストを作成
 */
function createFavoriteListTopicPathList() {
    // Source_code_v12.18_add_start
    var topicPathList = {};
    // topicPathList["マイページ"] = "/mypage/mypage/";
    topicPathList["マイページ"] = "../mypage/マイページ.html";
    topicPathList["お気に入り商品"] = "";
    // Source_code_v12.18_add_end

    initializeTopicPath(topicPathList);

}

/**
 * 削除アクション送信
 *
 * @param shopCode
 * @param commodityCode
 * @param skuCode
 */
function sendFavoriteListDeleteRequest(shopCode, skuCode, formId, element) {

    // Source_V12.18_add_start
    // if (!window.confirm(message.confirmDelete)) {
    //     return;
    // }

    // var uri = "/mypage/favorite_list/delete/" + shopCode + "/" + skuCode + "/";
    // var parameters = createBaseParametersForAjaxApi("mypage", "favorite_list", "delete");

    // var param = {
    //     parameters : parameters,
    //     uri : uri,
    //     formId : formId,
    //     dataType : "json",
    //     async : true,
    //     messageAdd : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_V12.17_add_end
    // Mockup_V12.17_add_start
    if (!window.confirm(message.confirmDelete)) {
        return;
    } else {
        $('.informationBlock').show();
        $('.informationMessage').html('お気に入り商品の削除を完了しました。');
        window.scrollTo(0, 0);
    }
    // Mockup_V12.18_add_end
}
