$(document).ready(function() {
    // リアルタイムバリデーション設定
    var inputList = $("#addressEditMain input[type='text']");
    inputList.siValidation({});
});

function sendNextActionRequest(actionId, element) {
    // Source_V12.18_add_start
    // var successFunction = function(data) {
    //     $(".confirmMessageArea").html("");
    //     $("#updateButton").remove();
    //     $("#registerButton").remove();
    // };

    // var parameters = createBaseParametersForAjaxApi("mypage", "address_edit", actionId);
    // var functions = createAjaxFunctions(null, null, successFunction);

    // var uri = "/mypage/address_edit/" + actionId + "/";

    // var param = {
    //     parameters : parameters,
    //     functions : functions,
    //     uri : uri,
    //     formId : "addressInfoForm",
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_V12.18_add_end

    // Mockup_V12.18_add_start
    $('#registerButton').hide();
    $('#updateButton').hide();
    $('.informationBlock').show();
    $('#backEditButton').attr("onclick", "location.href='../mypage/アドレス帳一覧.html'");
    var param = location.search;
    if (param == null) {
        return;
    }
        
    if (param.split("=")[1] == 'update') {
        $('.informationMessage').html('アドレス帳の更新を完了しました。');
    } else {
        $('.informationMessage').html('アドレス帳の登録を完了しました。');
    }

    window.scrollTo(0, 0);
    // Mockup_V12.18_add_end
    
}