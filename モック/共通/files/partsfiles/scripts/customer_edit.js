$(document).ready(function() {
    // リアルタイムバリデーション設定
    var inputList = $("#customerInfoArea input[type='text'],#customerInfoArea input[type='password']");
    inputList.siValidation({});

    customerEditSocialLoginAuth();
});

function changeCustomerPassword(element) {

    var parameters = createBaseParametersForAjaxApi("customer", "customer_edit", "move");
    parameters.url = "/mypage/customer_changepassword/";

    var param = {
        parameters : parameters,
        uri : "/customer/customer_edit/move/",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

function changeCustomerEmail(element) {

    var parameters = createBaseParametersForAjaxApi("customer", "customer_edit", "move");
    parameters.url = "/mypage/customer_changeemail/";

    var param = {
        parameters : parameters,
        uri : "/customer/customer_edit/move/",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

function next(formId, element) {

    var beforeSendFunction = function() {
        $('#nextButton').attr("disabled", true);
    };

    var successFunction = function(data) {
        $("#customerInfoArea input[type='password']").val("");
    };

    var parameters = createBaseParametersForAjaxApi("customer", "customer_edit", "next");
    var functions = createAjaxFunctions(beforeSendFunction, null, successFunction);

    var param = {
        parameters : parameters,
        functions : functions,
        uri : "/customer/customer_edit/next/",
        dataType : "json",
        formId : "customerInfoForm",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

function changeAgreeCheck() {
    if($("#agreeCheck").prop('checked')) {
        $("#nextButton").prop('disabled', false).css("opacity",1);
    } else {
        $("#nextButton").prop('disabled', true).css("opacity",0.65);
    }
}


function confirmCodeIssue(emailName,formId,element) {

    var parameters = createBaseParametersForAjaxApi("customer", "customer_edit", "issue");
    parameters.url = "/customer/customer_edit/issue";
    parameters.email = $('input[name="'+ emailName +'"]').val()

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
        uri : "/customer/customer_edit/issue",
        dataType : "json",
        formId : formId,
        messageType : "popup",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}