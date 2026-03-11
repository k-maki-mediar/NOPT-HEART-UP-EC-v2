$(document).ready(function() {

    var data = createDetailSearchData();
    var dom = $("#catalogDetailSearch");
    var shopCode = $(dom).find(".selectSearchShopArea select[name='searchShopCode']").val();

    // キャンペーン一覧の制御
    convertNeedSelectShopElement($(".selectSearchCampaignArea"), shopCode, data.campaignList, data.searchConditionField.searchSelectCampaignCode, data.shopList.length);

    // ブランド一覧の制御
    convertNeedSelectShopElement($(".selectSearchBrandArea"), shopCode, data.brandList, data.searchConditionField.searchSelectBrandCode, data.shopList.length);

    // 特集一覧の制御
    shopCode = shopCode ? shopCode : settings.siteShopCode;
    convertNeedSelectShopElement($(".selectSearchFeatureArea"), shopCode, data.featureList, data.searchConditionField.searchSelectFeatureCode, data.shopList.length);
  
    // ショップ一覧の制御
    $("#searchShopCode").change(function() {
        convertNeedSelectShopElement($(".selectSearchCampaignArea"), $(this).val(), data.campaignList, data.shopList, data.shopList.length);
        convertNeedSelectShopElement($(".selectSearchBrandArea"), $(this).val(), data.brandList, data.shopList, data.shopList.length);
        convertNeedSelectShopElement($(".selectSearchFeatureArea"), $(this).val(), data.featureList, data.shopList, data.shopList.length);
        var shopCode = $(this).val() ? $(this).val() : settings.siteShopCode;
        convertNeedSelectShopElement($(".selectSearchFeatureArea"), shopCode, data.featureList, data.shopList, data.shopList.length);
    });

    // カテゴリ価格帯の制御
    selectCategory($("select[name='searchCategoryCode']", "#catalogDetailSearch").val());
    $("select[name='searchCategoryCode']", "#catalogDetailSearch").change(function() {
        selectCategory($(this).val());
    })
});

/**
 * 画面設定用のデータを作成する
 */
function createDetailSearchData() {

    var data = new Object();
    var searchConditionField = new Object();

    // ショップ
    data.shopList = getValueList(".shopList");

    // キャンペーン
    data.campaignList = getValueList(".campaignList");
    searchConditionField.searchSelectCampaignCode = $("#searchSelectedCampaignCode").data("value");
    if ((searchConditionField.searchSelectCampaignCode != null) && (searchConditionField.searchSelectCampaignCode != "")) {
        $("#detailSearchCampaignCode").val(splitData(searchConditionField.searchSelectCampaignCode)[1]);
    }

    // ブランド
    data.brandList = getValueList(".brandList");
    searchConditionField.searchSelectBrandCode = $("#searchSelectedBrandCode").data("value");
    if ((searchConditionField.searchSelectBrandCode != null) && (searchConditionField.searchSelectBrandCode != "")) {
        $("#detailSearchBrandCode").val(splitData(searchConditionField.searchSelectBrandCode)[1]);
    }
    
    // 特集
    data.featureList = getValueList(".featureList");
    searchConditionField.searchSelectFeatureCode = $("#searchSelectedFeatureCode").data("value");
    if ((searchConditionField.searchSelectFeatureCode != null) && (searchConditionField.searchSelectFeatureCode != "")) {
        $("#detailSearchFeatureCode").val(splitData(searchConditionField.searchSelectFeatureCode)[1]);
    }

    // コンディション
    data.searchConditionField = searchConditionField;

    return data;
}

/**
 * nameとvalueからなるリストを取得する
 */
function getValueList(className) {

    var list = new Array();
    var listElements = $(className);
    for (var i = 0; i < listElements.length; i++) {
        var element = listElements[i];
        var obj = new Object();
        obj.name = $(element).data("name");
        obj.value = $(element).data("value");
        if (!obj.value) {
            obj.value = "";
        }
        list.push(obj);
    }

    return list;
}

/**
 * 価格帯検索処理
 *
 * @param searchPriceStart
 * @param searchPriceEnd
 */
function searchPriceArea(searchPriceStart, searchPriceEnd) {
    if (!searchPriceEnd) {
        searchPriceEnd = "";
    }

    var searchPriceArea = $("#detailSearchAreaForm .searchPriceArea");
    var priceStart = $(searchPriceArea).find(".searchPriceStart");
    var priceEnd = $(searchPriceArea).find(".searchPriceEnd");

    $(priceStart).val(searchPriceStart);
    $(priceEnd).val(searchPriceEnd);

    catalogListSearch();
}

function clearSearchPriceArea() {
    var searchPriceArea = $("#detailSearchAreaForm .searchPriceArea");
    var priceStart = $(searchPriceArea).find(".searchPriceStart");
    var priceEnd = $(searchPriceArea).find(".searchPriceEnd");
    $(priceStart).val("");
    $(priceEnd).val("");
}

function setBrandCode(selected) {
    $("#detailSearchBrandCode").val(splitData(selected.value)[1]);
}

function setCampaignCode(selected) {
    $("#detailSearchCampaignCode").val(splitData(selected.value)[1]);
}

function setFeatureCode(selected) {
    $("#detailSearchFeatureCode").val(splitData(selected.value)[1]);
}

/**
 * 検索
 */
function catalogListSearch() {


    if (!$(".detailSearchSearchWord").val()
            && $(".detailSearchSearchCategoryCode").val() == "0"
            && !$("#searchShopCode").val()
            && !$(".searchPriceStart").val()
            && !$(".searchPriceEnd").val()
            && !$("#searchSelectFeatureCode").val()
            ) {
        pcPopup("detailSearchAlert");
        return false;
    }
    var url = "/catalog/list/";
    sendRequestToFront(url, false, "detailSearchAreaForm");
}

/**
 * ショップ選択
 *
 * @param needSelectShopElement
 * @param selectSearchShopAreaElement
 * @param catalogDetailSearchData
 */
function convertNeedSelectShopElement(needSelectShopElement, shopCode, catalogDetailSearchData, selectItem, shopListSize) {
    var selectElement = $(needSelectShopElement).find("select");
    // ショップが選択されていない場合
    if (shopListSize > 0 && !shopCode) {
        $(needSelectShopElement).find(".noSelectedShopMessage").removeClass("hidden");
        $(needSelectShopElement).find(".selectedShopArea").addClass("hidden");
        $(".selectSearchCampaignArea").removeClass("hidden");
        $(".selectSearchBrandArea").removeClass("hidden");
        $(".selectSearchFeatureArea").removeClass("hidden");
        $(selectElement).val("");
        return;
        // 一店舗版
    } else if (!shopListSize && !shopCode) {
        $("#catalogDetailSearch").find(needSelectShopElement).removeClass("hidden");
        $(selectElement).val("");
    }

    $(selectElement).empty();
    var newSearchDataList = new Array();

    if (shopListSize < 1) {
        newSearchDataList = catalogDetailSearchData;
    } else {
        for (var i = 0; i < catalogDetailSearchData.length; i++) {
            var searchData = catalogDetailSearchData[i];

            var searchDataValue = searchData.value;
            var splited = splitData(searchData.value);

            var searchShopCode;
            if (splited.length > 1) {
                searchShopCode = splited[0];
            }
            if (searchShopCode == shopCode || !searchDataValue) {
                newSearchDataList.push(searchData);
            }
        }
    }
    if (newSearchDataList.length < 2) {
        $(needSelectShopElement).addClass("hidden");
        return;
    }

    var isSelectItemExists = false;
    for (var i = 0; i < newSearchDataList.length; i++) {
        var searchData = newSearchDataList[i];

        $(selectElement).append("<option value=\"" + searchData.value + "\">" + searchData.name + "</option>");

        if(selectItem == searchData.value){
            isSelectItemExists = true;
        }
    }

    if (typeof (selectItem) === "string" && isSelectItemExists) {
        $(selectElement).val(selectItem);
    } else {
        $(selectElement).val("");
    }
    $(needSelectShopElement).find(".noSelectedShopMessage").addClass("hidden");
    $(needSelectShopElement).find(".selectedShopArea").removeClass("hidden");
    $(needSelectShopElement).removeClass("hidden");
}

function splitData(splitData) {
    return splitData.split("%");
}

function selectCategory(categoryCode) {
    $("#categoryPriceRangeList_" + categoryCode).show();
    $("#categoryPriceRangeList_" + categoryCode).siblings().hide();
}
