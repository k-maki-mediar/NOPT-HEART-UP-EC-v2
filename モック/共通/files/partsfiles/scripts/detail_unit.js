$(document).ready(function() {

    // クライアント端末幅変更時
    clientStyleFunctionList.push(function() {

        // SP時はズームしない
        if (clientStyle === "sp" || clientStyle === "tb") {
            $(".ZoomContainer").hide();
        } else {
            $(".ZoomContainer").show();
        }
    });

    setZoomImages();
    setLightBoxImages();
  
    // パンくずリスト
    createTopicPathListForCatalogDetail();

    // プレビュー時Function
    previewFunctionList.push(function() {
        detailPreviewFromBackCallback();
    });
    
});

function addCartOfDetail(formId, agreeFlg) {

    var quantity = $("#quantityList").val();

    var salesMethodType = $("#salesMethodType").val();
    var purchaseMethodType;
    if (salesMethodType == "1") {
        purchaseMethodType = "1"
    } else {
        purchaseMethodType = $("input[name=purchaseMethodType]:checked").val();
    }

    // カートに追加
    addCartFromDetail(formId, agreeFlg, quantity, null, purchaseMethodType);
}
