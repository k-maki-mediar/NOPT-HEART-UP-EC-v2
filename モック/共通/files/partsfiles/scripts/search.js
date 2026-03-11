$(document).ready(function() {

    // バリデーション設定
    $("input[type='text']").siValidation({});

});

/**
 * ショップ変更アクション
 */
function changeShop() {

    var successFunction = function(data) {

        if (data.searchShopCode == "") {
            $("#searchByCampaign .no_select_shop").removeClass("hidden");
            $("#searchByCampaign .selected_shop").addClass("hidden");
            $("#searchByBrand .no_select_shop").removeClass("hidden");
            $("#searchByBrand .selected_shop").addClass("hidden");
        } else {
            $("#searchByCampaign .no_select_shop").addClass("hidden");
            $("#searchByCampaign .selected_shop").removeClass("hidden");
            $("#searchByBrand .no_select_shop").addClass("hidden");
            $("#searchByBrand .selected_shop").removeClass("hidden");

            if (data.campaignList.length > 1) {
                $(".noCampaign").addClass("hidden");
                var campaignSelectObj = $("#searchCampaignCode").empty();
                for (var i = 0; i < data.campaignList.length; i++) {
                    var campaign = data.campaignList[i];
                    var name;
                    if (campaign.name == "") {
                        name = "選択してください";
                    } else {
                        name = campaign.name;
                    }
                    campaignSelectObj.append("<option value=\"" + campaign.value + "\">" + name + "</option>");
                }

            } else {
                $(".hasCampagin").addClass("hidden");
            }

            if (data.brandList.length > 1) {
                $(".noBrand").addClass("hidden");
                var brandSelectObj = $("#searchBrandCode").empty();
                for (var i = 0; i < data.brandList.length; i++) {
                    var brand = data.brandList[i];
                    var name;
                    if (brand.name == "") {
                        name = "選択してください";
                    } else {
                        name = brand.name;
                    }
                    brandSelectObj.append("<option value=\"" + brand.value + "\">" + name + "</option>");
                }
            } else {
                $(".hasBrand").addClass("hidden");
            }
        }
        if (data.featureList.length > 1) {
            $(".noFeature").addClass("hidden");
            $(".hasFeature").removeClass("hidden");
            var featureSelectObj = $("#searchFeatureCode").empty();
            for (var i = 0; i < data.featureList.length; i++) {
                var feature = data.featureList[i];
                featureSelectObj.append("<option value=\"" + feature.value + "\">" + feature.name + "</option>");
            }
        } else {
            $(".hasFeature").addClass("hidden");
            $(".noFeature").removeClass("hidden");
        }
    }
    var param = {
        parameters : createBaseParametersForAjaxApi("catalog", "search", "change_shop"),
        functions : createAjaxFunctions(null, null, successFunction),
        uri : "/catalog/search/change_shop",
        formId : "detailSearchForm",
        dataType : "json",
        async : true,
    }

    sendAjaxToApi(param);
}

/**
 * 検索アクション
 */
function search(actionId, element) {
    if (!$(".detailSearchAreaSearchWord").val() && !$(".searchCommodityCode").val() 
        && $(".detailSearchSearchCategoryCode").val() == "0" && !$("#searchShopCode").val() 
        && !$("#searchCampaignCode").val() && !$("#searchBrandCode").val()
        && !$("#searchFeatureCode").val()  
        && !$(".searchPriceStart").val() && !$(".searchPriceEnd").val()) {
        pcPopup("detailSearchAlert");
        return false;
    }
    var param = {
        parameters : createBaseParametersForAjaxApi("catalog", "list", actionId),
        uri : "/catalog/list/"+actionId+"/",
        dataType : "json",
        async : true,
        formId : "detailSearchForm",
        functions : createAjaxFunctions(null, null, nextSearchList),
        element : element
    };
    sendAjaxToApi(param);
}

function nextSearchList(data, messages){
    if (messages.errorMessages.length == 0) {
        sendRequestToFront("/catalog/list/", false, "detailSearchForm");
    }
}
