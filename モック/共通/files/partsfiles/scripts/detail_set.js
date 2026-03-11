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

    // セット品設定
    setCompositionArea();

    // プレビュー時Function
    previewFunctionList.push(function() {
        detailPreviewFromBackCallback();
        setCompositionArea();
    });
    
});

/**
 * セット品設定処理
 */
function setCompositionArea() {

    var detailElement = $(".catalogDetailArea");
    var detailInfoElement = $(detailElement).find(".commodityDetailInfo");

    // commodityData作成
    var commodityData = new Object();
    var commodityCompositionList = new Array();
    var catalogCompositionItems = $(".catalogCompositionItem");

    for (var i = 0; i < catalogCompositionItems.length; i++) {
        var catalogCompositionItem = catalogCompositionItems[i];
        var compositionData = new Object();
        compositionData.commodityCode = $(catalogCompositionItem).data("commoditycode");
        compositionData.selectedSkuCode = $(catalogCompositionItem).data("selectedskucode");
        var detailList = new Array();
        var detailObjArray = $(catalogCompositionItem).find(".composiontDetail");

        for (var j = 0; j < detailObjArray.length; j++) {
            var detailObj = detailObjArray[j];
            var detailData = new Object();
            detailData.skuCode = $(detailObj).data("skucode");
            detailData.standardDetail1Code = $(detailObj).data("standarddetail1code");
            detailData.standardDetail2Code = $(detailObj).data("standarddetail2code");
            detailData.hasStock = $(detailObj).data("hasstock");
            detailData.availableStockQuantity = $(detailObj).data("availablestockquantity");

            detailList.push(detailData);
        }

        compositionData.detailList = detailList;
        commodityCompositionList.push(compositionData);
    }

    commodityData.commodityCompositionList = commodityCompositionList;

    var oneshotOrderLimit = $("#oneshotOrderLimit").val();
    commodityData.oneshotOrderLimit = oneshotOrderLimit;

    // 規格処理
    convertDisplayCompositionArea(commodityData, detailElement, detailInfoElement);

}

/**
 * セット構成品情報の処理
 * 
 * @param commodityData
 *            jsonのsetCommodityInfo情報
 * @param detailElement
 *            右側の一番大きな商品エリア(1つのdiv)
 * @param detailInfoElement
 *            右側の細かい商品情報(複数のdiv)
 */
function convertDisplayCompositionArea(commodityData, detailElement, detailInfoElement) {

    // 画面の2つの構成品を取得
    var compositionAreaElement = $(detailElement).find(".catalogCompositionItem");

    var selectSkuDataList = new Array();

    // 画面の2つの構成品でループ
    for (var i = 0; i < compositionAreaElement.length; i++) {
        // 画面の1つの構成品
        var compositionElement = compositionAreaElement[i];

        // 画面のhidden項目
        var commodityCodeElement = $(compositionElement).find("input[name='commodityCode']");
        var commodityCode = $(commodityCodeElement).val();

        // jsonの構成品リスト
        var compositionList = commodityData.commodityCompositionList;

        // jsonのリストと画面のhiddenのcommodityCodeをもとに、そのcommodityCodeがリストの何番目かを取得する。(0もしくは1)
        var compositionDataIndex = findCompositionDataIndex(compositionList, commodityCode);

        if (!compositionDataIndex && compositionDataIndex != 0) {
            continue;
        }

        // jsonの1つの構成品
        var compositionData = compositionList[compositionDataIndex];

        // jsonから構成品のSKUコードを取得する。
        var skuCode = compositionData.selectedSkuCode;

        var standardAreaElement = $(compositionElement).find(".commodityStandardArea");

        // jsonの構成品のdetailInfoList(1件のリスト)とjsonの構成品のskuCodeから、そのskuCodeがリストの何番目かを取得する。(規格品の時にdetailListはn件になる)
        var compositionDetailIndex = findCompositionDetailDataIndex(compositionData.detailList, skuCode);

        $(standardAreaElement).append("<input type=\"hidden\" name=\"compositionIndex\" value=\"" + compositionDataIndex + "\">");
        $(standardAreaElement).append("<input type=\"hidden\" name=\"detailIndex\" value=\"" + compositionDetailIndex + "\">");

        // 規格1の処理-------------------------------------------------------------------------------
        // 構成品が規格品の場合
        if ($(compositionElement).data("selectedstandarddetailcode1")) {
            // 規格の切り替え処理
            var standardElement = $(standardAreaElement).find("input[name='standardDetail1_" + i + "']");
            $(standardElement).change(function() {
                changeStandardDetail1(commodityData, $(this));
                // スタイル変更
                var name = $(this).attr("name");
                $("input[name='" + name + "']+label").removeClass("checked");
                $("input[name='" + name + "']:checked+label").addClass("checked");
            });
            $(standardAreaElement).find("input[name='standardDetail1_" + i + "']+label").removeClass("checked");
            $(standardAreaElement).find("input[name='standardDetail1_" + i + "']:checked+label").addClass("checked");

            if (!_ua.Tablet && !_ua.Mobile) {
                // マウスオーバー処理
                $(standardAreaElement).find(".standard1").siHover({
                    commodityData : commodityData,
                    elementIndex : i
                }, function(event, data, label) {
                    var id = $(label).attr("for");
                    var radio = $("#" + id);
                    var compositionListElement = getCompositionListElement();
                    var compositionElement = $(compositionListElement[data.elementIndex]);
                    var standard2 = compositionElement.find("input[name='standardDetail2_" + data.elementIndex + "']:checked").val();

                    changeStandardDetailFromCode(radio.val(), standard2, data.commodityData, compositionListElement, compositionElement, data.elementIndex);
                }, function(event, data, label) {
                    // 元に戻す処理
                    var compositionListElement = getCompositionListElement();
                    var compositionElement = $(compositionListElement[data.elementIndex]);

                    changeStandardDetail(data.commodityData, compositionListElement, compositionElement, data.elementIndex);
                });
            }

        }

        // 規格2の処理-------------------------------------------------------------------------------
        // 構成品が規格品の場合
        if ($(compositionElement).data("selectedstandarddetailcode2")) {
            $(standardAreaElement).find("input[name='standardDetail2_" + i + "']").change(function() {
                changeStandardDetail2(commodityData, $(this));
                // スタイル変更
                var name = $(this).attr("name");
                $("input[name='" + name + "']+label").removeClass("checked");
                $("input[name='" + name + "']:checked+label").addClass("checked");
            });
            $(standardAreaElement).find("input[name='standardDetail2_" + i + "']+label").removeClass("checked");
            $(standardAreaElement).find("input[name='standardDetail2_" + i + "']:checked+label").addClass("checked");

            if (!_ua.Tablet && !_ua.Mobile) {
                // マウスオーバー処理
                $(standardAreaElement).find(".standard2").siHover({
                    commodityData : commodityData,
                    elementIndex : i
                }, function(event, data, label) {

                    var id = $(label).attr("for");
                    var radio = $("#" + id);
                    var compositionListElement = getCompositionListElement();
                    var compositionElement = $(compositionListElement[data.elementIndex]);

                    var standard1 = compositionElement.find("input[name='standardDetail1_" + data.elementIndex + "']:checked").val();

                    changeStandardDetailFromCode(standard1, radio.val(), data.commodityData, compositionListElement, compositionElement, data.elementIndex);
                }, function(event, data, label) {
                    // 元に戻す処理
                    var compositionListElement = getCompositionListElement();
                    var compositionElement = $(compositionListElement[data.elementIndex]);
                    changeStandardDetail(data.commodityData, compositionListElement, compositionElement, data.elementIndex);
                });
            }

        }
        // ↑規格の処理ここまで-------------------------------------------------------------------------------

        // 初期表示切替
        var compositionListElement = getCompositionListElement();
        var compositionElement = $(compositionListElement[i]);
        changeStandardDetail(commodityData, compositionListElement, compositionElement, i);

        // IE8以下がラベルでの切り替えが効かないため、イベントを追加
        if (!$.support.opacity) {
            standardAreaElement.find("label").on("click", function(e) {
                var input = $("#" + $(this).attr("for"));
                if (!input.prop("checked")) {
                    input.prop("checked", true).trigger("change");
                }
            });
        }

        // jsonのdetaiInfoをまとめたリスト
        selectSkuDataList.push(compositionData.detailList[compositionDetailIndex]);

    }
    // ループここまで (画面の2つの構成品でループ)

    // カートエリア(数量プルダウン、カートボタン、在庫なし)
    var addCartAreaElement = $(detailInfoElement).find(".addCartArea");
    // ヘッダの在庫数エリア
    var stockInfoAreaElement = $(detailInfoElement).find(".stockInfoArea");

    // 有効在庫数
    convertAddCartArea(addCartAreaElement, stockInfoAreaElement, selectSkuDataList, commodityData.oneshotOrderLimit);

}

/**
 * 在庫処理
 * 
 * 
 * 
 * @param addCartAreaElement
 *            画面のカートエリア(数量プルダウン、カートボタン、在庫なし)
 * @param stockInfoAreaElement
 *            画面のヘッダの在庫数エリア
 * @param selectSkuDataList
 *            jsonのdetaiInfoをまとめたリスト
 * @param oneshotOrderLimit
 *            セット品自体の注文上限数
 * 
 */
function convertAddCartArea(addCartAreaElement, stockInfoAreaElement, selectSkuDataList, oneshotOrderLimit) {

    // 数量select
    var quantityListElement = $(addCartAreaElement).find("select[name='quantityList']");

    // max
    var limitOrderQuantity = Number.MAX_VALUE;

    // 在庫エリア
    var stockInfoElement = $(stockInfoAreaElement).find(".stockInfo");
    // 購入可能数(在庫数/SKU数)を取得する
    var arrivalQuantity = computeAvailableStockOfSetCatalog(selectSkuDataList);
    // 0や20の場合
    if (arrivalQuantity || arrivalQuantity == 0) {

        // 在庫数を設定する
        $(stockInfoElement).text(arrivalQuantity);

        // カートボタンや在庫を画面表示する
        $(addCartAreaElement).removeClass("hidden");
        $(stockInfoAreaElement).removeClass("hidden");

        // 0の場合
        if (arrivalQuantity == 0) {

            // カートボタンを非表示。在庫なしエリアを表示。
            $(addCartAreaElement).find(".hasStockArea").addClass("hidden");
            $(addCartAreaElement).find(".noStockArea").removeClass("hidden");

            return;

        } else {

            // 在庫なしエリアを非表示。
            $(addCartAreaElement).find(".noStockArea").addClass("hidden");
        }

    } else {
        // 未定義の場合
        $(stockInfoAreaElement).addClass("hidden");
        $(addCartAreaElement).removeClass("hidden");
    }

    $(addCartAreaElement).find(".hasStockArea").removeClass("hidden");

    limitOrderQuantity = compareLimitOrderQuantity(limitOrderQuantity, arrivalQuantity, oneshotOrderLimit);

    // 数量
    createQuantityList(quantityListElement, limitOrderQuantity);

}

/**
 * index取得
 * 
 * jsonのリストと画面のhiddenのcommodityCodeをもとに、そのcommodityCodeがリストの何番目かを返却する。(0もしくは1)
 * 
 * @param compositionList
 * @param commodityCode
 * @returns
 */
function findCompositionDataIndex(compositionList, commodityCode) {
    for (var i = 0; i < compositionList.length; i++) {
        if (compositionList[i].commodityCode == commodityCode) {
            return i;
        }
    }
}

function findCompositionDetailDataIndex(detailList, skuCode) {
    for (var i = 0; i < detailList.length; i++) {
        if (detailList[i].skuCode == skuCode) {
            return i;
        }
    }
}

/**
 * 規格１変更
 * 
 * @param commodityData
 * @param selectStandardDetail1Element
 */
function changeStandardDetail1(commodityData, selectStandardDetail1Element) {
    var standardDetail1Name = $(selectStandardDetail1Element).attr("name");
    var elementIndex = standardDetail1Name.split("_")[1];
    var compositionListElement = getCompositionListElement();
    var compositionElement = compositionListElement[elementIndex];

    changeStandardDetail(commodityData, compositionListElement, compositionElement, elementIndex);
}

/**
 * 規格２変更
 * 
 * @param commodityData
 * @param selectStandardDetail2Element
 */
function changeStandardDetail2(commodityData, selectStandardDetail2Element) {
    var standardDetail2Name = $(selectStandardDetail2Element).attr("name");
    var elementIndex = standardDetail2Name.split("_")[1];

    var compositionListElement = getCompositionListElement();
    var compositionElement = compositionListElement[elementIndex];

    changeStandardDetail(commodityData, compositionListElement, compositionElement, elementIndex);
}

function getCompositionListElement() {
    var detailElement = $(".catalogDetailArea");
    var compositionAreaElement = $(detailElement).find(".commodityCompositionArea");
    var compositionListElement = $(compositionAreaElement).find(".catalogCompositionItem");

    return compositionListElement;
}

/**
 * 規格変更
 * 
 * @param commodityData
 * @param compositionElement
 * @param elementIndex
 */
function changeStandardDetail(commodityData, compositionListElement, compositionElement, elementIndex) {
    var standardDetailCode1 = $(compositionElement).find("input[name='standardDetail1_" + elementIndex + "']:checked").val();
    var standardDetailCode2 = $(compositionElement).find("input[name='standardDetail2_" + elementIndex + "']:checked").val();

    changeStandardDetailFromCode(standardDetailCode1, standardDetailCode2, commodityData, compositionListElement, compositionElement, elementIndex);
}

function changeStandardDetailFromCode(standardDetailCode1, standardDetailCode2, commodityData, compositionListElement, compositionElement, elementIndex) {
    var mismatchMessageElement = $(compositionElement).find(".mismatchMessage");
    var compositionSkuCodeAreaElement = $(compositionElement).find(".compositionSkuCodeArea");

    var compositionIndex = $(compositionElement).find("input[name='compositionIndex']").val();
    var compositionData = commodityData.commodityCompositionList[compositionIndex];

    var skuDataIndex = findSkuDataIndexFromStandardDetail(compositionData.detailList, standardDetailCode1, standardDetailCode2);

    if (skuDataIndex || skuDataIndex == 0) {
        var skuCode = compositionData.detailList[skuDataIndex].skuCode;
        $(mismatchMessageElement).addClass("hidden");
        var compositionSkuCodeElement = $(compositionSkuCodeAreaElement).find(".compositionSkuCode");
        $(compositionSkuCodeElement).text(skuCode);
        $(compositionSkuCodeAreaElement).find(".compositionSkuCode").removeClass("hidden");
        $(compositionElement).find(".compositionStock_" + skuCode).removeClass("hidden");
        $(compositionElement).find(".compositionStock_" + skuCode).siblings().addClass("hidden");
    } else {
        $(mismatchMessageElement).removeClass("hidden");
        $(compositionSkuCodeAreaElement).find(".compositionSkuCode").addClass("hidden");
        skuDataIndex = "";
    }

    $(compositionElement).find("input[name='detailIndex']").attr("value", skuDataIndex);

    changeDisplayAddCartArea(commodityData, compositionListElement);

    // 存在しない規格の表示切り替え処理
    if (standardDetailCode2) {

        $(compositionElement).find("label.selectStandard").addClass("noStock");

        for (var i = 0; i < compositionData.detailList.length; i++) {
            var skuData = compositionData.detailList[i];

            if (standardDetailCode1 && skuData.standardDetail1Code == standardDetailCode1) {
                if (skuData.hasStock) {
                    $("label[for='" + compositionData.commodityCode + "_" + elementIndex + "_2_" + skuData.standardDetail2Code + "']").removeClass("noStock");
                }
            }
            if (skuData.hasStock) {
                $("label[for='" + compositionData.commodityCode + "_" + elementIndex + "_2_" + skuData.standardDetail2Code + "']").removeClass("noStock");
                $("label[for='" + compositionData.commodityCode + "_" + elementIndex + "_1_" + skuData.standardDetail1Code + "']").removeClass("noStock");
            }
        }

    } else {
        // 在庫切れ
        $(compositionElement).find("label.selectStandard").addClass("noStock");
        for (var i = 0; i < compositionData.detailList.length; i++) {
            var skuData = compositionData.detailList[i];
            if (skuData.hasStock) {
                $("label[for='" + compositionData.commodityCode + "_" + elementIndex + "_2_" + skuData.standardDetail2Code + "']").removeClass("noStock");
                $("label[for='" + compositionData.commodityCode + "_" + elementIndex + "_1_" + skuData.standardDetail1Code + "']").removeClass("noStock");
            }
        }
    }

}

function changeDisplayAddCartArea(commodityData, compositionListElement) {
    var detailInfoElement = $(".commodityDetailInfo");
    var addCartAreaElement = $(detailInfoElement).find(".addCartArea");
    var stockInfoAreaElement = $(detailInfoElement).find(".stockInfoArea");

    var selectSkuDataList = new Array();

    for (var i = 0; i < compositionListElement.length; i++) {
        var compositionElement = compositionListElement[i];
        var compositionIndex = $(compositionElement).find("input[name='compositionIndex']").val();
        var detailIndex = $(compositionElement).find("input[name='detailIndex']").val();

        if (!compositionIndex) {
            $(addCartAreaElement).removeClass("hidden");
            $(stockInfoAreaElement).find(".stockInfo").removeClass("hidden");
            $(stockInfoAreaElement).find(".mismatchMessage").addClass("hidden");
            continue;
        } else if (compositionIndex && !detailIndex) {
            $(addCartAreaElement).addClass("hidden");
            $(stockInfoAreaElement).find(".stockInfo").addClass("hidden");
            $(stockInfoAreaElement).find(".mismatchMessage").removeClass("hidden");
            return;
        } else {

            $(stockInfoAreaElement).find(".stockInfo").removeClass("hidden");
            $(stockInfoAreaElement).find(".mismatchMessage").addClass("hidden");

        }

        var detailInfo = commodityData.commodityCompositionList[compositionIndex].detailList[detailIndex];

        selectSkuDataList.push(detailInfo);

    }
    convertAddCartArea(addCartAreaElement, stockInfoAreaElement, selectSkuDataList, commodityData.oneshotOrderLimit);
}

function findSkuDataIndexFromStandardDetail(skuDataList, standardDetailCode1, standardDetailCode2) {
    for (var i = 0; i < skuDataList.length; i++) {
        var skuData = skuDataList[i];

        if (standardDetailCode1 && skuData.standardDetail1Code != standardDetailCode1) {
            continue;
        }
        if (standardDetailCode2 && skuData.standardDetail2Code != standardDetailCode2) {
            continue;
        }
        return i;
    }
}

/**
 * カート追加
 * 
 * @param shopCode
 * @param commodityCode
 * @param skuCode
 */
function addCartOfDetail(formId, agreeFlg) {
    var compositionList = new Array();

    var compositionListElement = $(".commodityCompositionArea").find(".catalogCompositionItem");
    for (var i = 0; i < compositionListElement.length; i++) {
        var compositionElement = compositionListElement[i];
        var compositionSkuCode = $(compositionElement).find(".compositionSkuCode").text();
        if (!compositionSkuCode) {
            continue;
        }
        compositionList.push(compositionSkuCode);
    }
    var addCartAreaElement = $(".commodityDetailInfo .addCartArea");
    var quantity = $(addCartAreaElement).find("select[name='quantityList'] option:selected").val();

    var salesMethodType = $("#salesMethodType").val();
    var purchaseMethodType;
    if (salesMethodType == "1") {
        purchaseMethodType = "1"
    } else {
        purchaseMethodType = $("input[name=purchaseMethodType]:checked").val();
    }

    // カートに追加
    addCartFromDetail(formId, agreeFlg, quantity, compositionList, purchaseMethodType);
}


function findCompoitionDataFromCommodityCode(compoisitionDataList, commodityCode) {
    for (var i = 0; i < compoisitionDataList.length; i++) {
        if (compoisitionDataList[i].commodityCode == commodityCode) {
            return compoisitionDataList[i];
        }
    }
}

function checkLabel1(obj, commodityCode, index) {

    var catalogCompositionItem = $("#catalogCompositionItem_" + commodityCode + "_" + index);
    $(catalogCompositionItem).find(".standard1").removeClass("checked, selectedStandard");
    $(obj).addClass("checked selectedStandard");
}

function checkLabel2(obj, commodityCode, index) {

    var catalogCompositionItem = $("#catalogCompositionItem_" + commodityCode + "_" + index);
    $(catalogCompositionItem).find(".standard2").removeClass("checked, selectedStandard");
    $(obj).addClass("checked selectedStandard");
}
