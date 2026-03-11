$(document).ready(function() {
    $("#nickName, #reviewTitle, textarea, select").siValidation({});

});


function next(formId, element) {

    var parameters = createBaseParametersForAjaxApi("catalog", "review_edit", "next");
    var functions = createAjaxFunctions(null, null, null);

    var param = {
        parameters : parameters,
        functions : functions,
        uri : "/catalog/review_edit/next/",
        dataType : "json",
        formId : "reviewForm",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}


/**
 * 他画面遷移処理
 */
function backOrderDetailPage() {
  var referrerUrl = document.referrer; 

  if (referrerUrl.indexOf("/order_detail") !== -1) {
    var index = referrerUrl.indexOf(settings.context);
    var url = referrerUrl.substring(index);
    location.href = createWovnHref(url);
    return;
  }
  
  const orderCode = $("#orderCode").html();
  
  if (orderCode) {
    location.href = createWovnHref(settings.context + "/app/mypage/order_detail/" + orderCode + "/");
    return;
  }
  
  location.href = createWovnHref(settings.context + "/app/mypage/mypage/");
}

