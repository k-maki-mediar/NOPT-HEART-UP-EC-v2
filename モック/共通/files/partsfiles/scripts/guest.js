/**
 * ＰＣ版
 */
$(document).ready(function() {

    var inputList = $("input[type='text']");

    // リアルタイムバリデーション設定
    inputList.siValidation({
    //
    });

    toggleGuestAddress();
});

function sendGuestRequest(element) {

    var parameters = createBaseParametersForAjaxApi("order", "guest", "move");
    var functions = createAjaxFunctions(null, null, sendGuestRequestCallBack);

    var param = {
        parameters : parameters,
        functions : functions,
        uri : "/order/guest/move/",
        formId : "guestInfoForm",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

function sendGuestRequestCallBack(data) {
    if (!data.displayOtherAddress || !data.otherAddress) {
        $("#guestAddressEditArea").addClass("hidden");
    }
}

// 別のお届け先情報表示切替
function toggleGuestAddress() {

    if ($("#otherAddress").is(":checked")) {
        $("#guestAddressEditArea").removeClass("hidden");
    } else {
        $("#guestAddressEditArea").addClass("hidden");
    }
}

function changeAgreeCheck() {
    if($("#agreeCheck").prop('checked')) {
        $("#nextButton").prop('disabled', false).css("opacity",1);
    } else {
        $("#nextButton").prop('disabled', true).css("opacity",0.65);
    }
}

function confirmCodeIssue(formId,element) {

    var parameters = createBaseParametersForAjaxApi("order", "guest", "issue");

    var completeFunction = function(xhr) {
      if( xhr.messages.totalMessageLength > 0 ) {
        $('html,body').animate({
          scrollTop : 0
        }, 'fast');
      }
    };
    var functions = createAjaxFunctions(null, completeFunction, null );
    var param = {
        parameters : parameters,
        functions : functions,
        uri : "/order/guest/issue",
        dataType : "json",
        formId : formId,
        messageType : "popup",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}