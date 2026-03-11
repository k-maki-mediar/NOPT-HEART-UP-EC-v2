$(document).ready(function() {
    // パンくず
    createAddressListTopicPathList();

    // ページャー
    pagerDataBind();
});

/**
 * パンくずリストを作成
 */
function createAddressListTopicPathList() {
    // Source_code_v12.18_add_start
    var topicPathList = {};
    // topicPathList["マイページ"] = "/mypage/mypage/";
    topicPathList["マイページ"] = "../mypage/マイページ.html";
    topicPathList["アドレス帳一覧"] = "";
    // Source_code_v12.18_add_end
    initializeTopicPath(topicPathList);
}

/**
 * 変更ボタン、お届け履歴ボタン
 */
function sendAddressListMoveRequest(url, element) {

    var parameters = createBaseParametersForAjaxApi("mypage", "address_list", "move");
    parameters.url = url;

    var param = {
        parameters : parameters,
        uri : "/mypage/address_list/move/",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

/**
 * 削除ボタン
 */
function sendAddressListDeleteRequest(targetAddressNo, element) {
    // Source_V12.18_add_start
    // if (!window.confirm(message.confirmDelete)) {
    //     return;
    // }

    // var uri = "/mypage/address_list/delete/";
    // var parameters = createBaseParametersForAjaxApi("mypage", "address_list", "delete");
    // parameters.addressNo = targetAddressNo;
    // addressListDeleteCallback.targetAddressNo = targetAddressNo;
    // var functions = createAjaxFunctions(null, null, addressListDeleteCallback);

    // var param = {
    //     parameters : parameters,
    //     functions : functions,
    //     uri : uri,
    //     formId : "addressListForm",
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_V12.18_add_end

    // Mockup_V12.18_add_start
    if (!window.confirm(message.confirmDelete)) {
        return;
    } else {
        $('.informationBlock').show();
        window.scrollTo(0, 0);
    }
    // Mockup_V12.18_add_end
}

/**
 * 削除処理のコールバック
 */
function addressListDeleteCallback(data) {
    var isDeleted = true;
    for (var i = 0; i < data.list.length; i++) {
        var addressInfo = data.list[i];
        if (addressListDeleteCallback.targetAddressNo == addressInfo.addressNo) {
            isDeleted = false;
        }
    }
    if (isDeleted) {
        $("#addressCell_" + addressListDeleteCallback.targetAddressNo).remove();
        var addressListCount = $("#addressListCount").html();
        $("#addressListCount").html(addressListCount - 1)
    }

}
