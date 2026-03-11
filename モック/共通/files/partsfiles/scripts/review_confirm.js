$(document).ready(function() {
});


/**
 * 登録画面遷移処理
 */
function moveRegister(formId, element) {
	
	var beforeSendFunction = function() {
		 $('#submitBtn').attr("disabled", true);
		 $('#backButton').attr("disabled", true);
	}

    var errorSendFunction = function() {
        $('#submitBtn').removeAttr("disabled");
        $('#backButton').removeAttr("disabled");
    }

    var param = {
        parameters : createBaseParametersForAjaxApi("catalog", "review_confirm", "register"),
        functions : createAjaxFunctions(beforeSendFunction, errorSendFunction, null),
        uri : "/catalog/review_confirm/register/",
        formId : formId,
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

/**
 * 他画面遷移処理
 */
function backOrderDetailPage() {
  
  const shopCode = $("#orderCode").html();
  
  if (shopCode) {
    location.href = createWovnHref(settings.context + "/app/mypage/order_detail/" + shopCode + "/");
    return;
  }
  
  location.href = createWovnHref(settings.context + "/app/mypage/mypage/");
}

