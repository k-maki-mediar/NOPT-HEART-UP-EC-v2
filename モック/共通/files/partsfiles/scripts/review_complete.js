$(document).ready(function() {

});

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
