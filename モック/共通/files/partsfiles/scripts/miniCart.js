$(document).ready(function() {

    // カート画面ならミニカートを表示しない
    var url = location.href;
    if (url.endsWith("/cart/") || url.endsWith("/logout/")) {

        $("#miniCart").remove();
        $(".header-cart-button").remove();
    } else {
        // ミニカート詳細ボタン
        $("#miniCartHeader").off("click");

        if ($(".miniCartShopArea").length > 0) {
            $("#miniCartHeader .miniCartItemAndPrice").addClass("dropdown-toggle");
            $("#miniCartHeader").on("click", function() {
                $("#miniCartDetailArea").slideToggle("fast");
            });

            // ミニカートfooter
            $(window).scroll(function() {
                if ($(this).scrollTop() > 150) {
                    $("#miniCartFooter").removeClass("slidedown").addClass("slideup");
                } else {
                    $("#miniCartFooter").removeClass("slideup").addClass("slidedown");
                }
            });
        }
    }

    // プレビュー時Function
    previewFunctionList.push(function() {
        if (url.indexOf("/preview/") > 0) {
            $("#miniCart").remove();
        }
    });
});

$(window).on("load", function() {
    var url = location.href;

    // ミニカートアイコン初期化。ログイン画面および新規会員登録画面は対象外
    if( url.indexOf("/common/login/") < 0 && url.indexOf("/customer/customer_edit/") < 0) {
        initializeMiniCart(miniCartInitCallBack);
    }
});

/**
 * ミニカート初期化
 */
function initializeMiniCart(callback) {

    var uri = "/cart/mini_cart/init/";
    var parameters = createBaseParametersForAjaxApi("cart", "mini_cart", "init");
    parameters.needHtml = true;
    parameters.partsId = "miniCart";
    var functions = createAjaxFunctions(null, null, callback);

    var param = {
        parameters : parameters,
        functions : functions,
        uri : uri,
        dataType : "json",
        async : true
    };
    sendAjaxToApi(param);

}

var miniCartInitCallBack = function(data, msg, html) {

    // ミニカート詳細ボタン
    updateDisplay(html);
    $("#miniCartHeader").off("click");
    if (data.miniCartShopBeanList.length < 1) {
        $(".caret", "#miniCartHeader").hide();
        $("#miniCartFooter").hide();
        return;
    } else {
        $(".caret", "#miniCartHeader").show();
        $("#miniCartHeader").on("click", function() {
            $("#miniCartDetailArea").slideToggle("fast");
        });
    }
    $("#footerItemCount").text(data.miniCartItemQuantity);
    if (data.miniCartItemQuantity > 0) {
        $("#footerItemCount").show();
    } else {
        $("#footerItemCount").hide();
    }

    // 画像
    $(".miniCartItemImage").each(function() {
        if (!$(this).attr("src")) {
            $(this).attr("src", images["noPhotoCommodity"]);
        }
    });

    cartCount(data);
}

var miniCartAddCallBack = function(data, msg, html) {

    miniCartInitCallBack(data, msg, html);

}

var updateDisplay = function(html) {

    var bodyHtml = $('#miniCartRoot',html);
    $("#miniCartRoot").parent().html(bodyHtml);
}

var cartCount = function(data) {

    // ショップ単位でDomを作成
    for (index in data.miniCartShopBeanList) {

        var shopBean = data.miniCartShopBeanList[index];
        var skuQuantity = {};

        // ショップの中の商品単位でDomを作成
        for (index in shopBean.miniCartCommodityBeanList) {

            var commodityBean = shopBean.miniCartCommodityBeanList[index];
            var shopCode = shopBean.shopCode;
            var commodityCode = commodityBean.commodityCode;

            if (commodityBean.skuCode in skuQuantity) {
                skuQuantity[commodityBean.skuCode] += parseInt(commodityBean.commodityQuantity);
            } else {
                skuQuantity[commodityBean.skuCode] = parseInt(commodityBean.commodityQuantity);
            }

            // カートにある商品数表示
            if ($("[id^='detailInfoForm']").length > 0) {
                // 商品詳細の場合
                var itemsShopCode = $("#shopCode").val();
                var itemCommodityCode = $("#commodityCode").val();

                if (shopCode === itemsShopCode && commodityCode === itemCommodityCode) {
                    var countElement = createCountElement(skuQuantity[commodityBean.skuCode]);

                    if ($("[id^='standard']").length > 0) {
                        $(".badge", "#showPurchasingConfirmButton_" + commodityBean.skuCode).remove();
                        $("#showPurchasingConfirmButton_" + commodityBean.skuCode).append(countElement);
                    } else {
                        $(".badge").remove();
                        $(".addCartButton", "[id^='detail'][id$='Main']").append(countElement);
                    }
                }

            } else {
                // 商品一覧の場合
                $(".itembox, .itembox2").each(function() {
                    var itemsShopCode =$("input[name='shopCode']", $(this)).val();
                    var itemCommodityCode = $("input[name='commodityCode']", $(this)).val();

                    if (shopCode === itemsShopCode && commodityCode === itemCommodityCode) {

                        $(".badge", $(this)).remove();

                        // 同じショップコードと商品コードの商品を合計する
                        var badgeCount = 0;
                        if ($(".badgeCounting", $(this)).length > 0) {
                            badgeCount = $(".badgeCounting", $(this)).val();
                            badgeCount = parseInt(commodityBean.commodityQuantity) + parseInt(badgeCount);
                            $(".badgeCounting", $(this)).val(badgeCount);

                        } else {
                            $(this).append("<input type='hidden' class='badgeCounting' value='" + commodityBean.commodityQuantity + "'/>");
                        }
                        badgeCount = $(".badgeCounting", $(this)).val();

                        var countElement = createCountElement(badgeCount);
                        $(".addCartButton, .cartItemCount", $(this)).append(countElement);
                    }
                });
            }
        }

        $(".badgeCounting").remove();

    }
}

/**
 * 商品詳細画面URL取得
 *
 * @param shopCode
 * @param commodityCode
 * @param skuCode
 * @returns {String}
 */
function getDetailUrl(shopCode, commodityCode, skuCode) {
    var url = "/commodity/" + shopCode + "/" + commodityCode + "/";
    if (skuCode) {
        url += "?selectedSkuCode=" + skuCode;
    }
    return url;
}

function moveDetail(url, itemIndex, purchaseMethodType, skuCode) {

    var parameters = {
        "itemIndex" : itemIndex,
        "purchaseMethodType" : purchaseMethodType,
        "selectedSkuCode" :  skuCode
    };

    sendRequestToFront(url, false, null, parameters);
}

function createCountElement(count) {
    return $("<sup></sup>", {
        "class" : "badge",
        css : {
            "background-color" : "#af0000"
        }
    }).append(count);
}
