$(document).ready(function() {

    $('.recommendNaviPlusList').slick({
        slidesToShow : 5,
        slidesToScroll : 1,
        infinite : true,
        focusOnSelect : false,
        arrows : true,
        responsive : [ {
            breakpoint : 1152,
            settings : {
                slidesToShow : 4,
                slidesToScroll : 1,
                focusOnSelect : false,
                infinite : true,
            }
        }, {
            breakpoint : 1024,
            settings : {
                slidesToShow : 3,
                slidesToScroll : 1,
                focusOnSelect : false,
                infinite : true,
            }
        }, {
            breakpoint : 800,
            settings : {
                slidesToShow : 2,
                slidesToScroll : 1,
                focusOnSelect : false,
                infinite : true,
            }
        }, {
            breakpoint : 480,
            settings : {
                slidesToShow : 1,
                slidesToScroll : 1,
                focusOnSelect : false,
                infinite : true,
            }
        } ]
    });

    // プレビュー時Function
    previewFunctionList.push(function() {
        $(".detailUrl").removeAttr("href");
    });

});

function sendMoveRequest(element) {

    var parameters = createBaseParametersForAjaxApi("catalog", "recommend_naviplus", "move");
    parameters.url = $(element).data('url');
    parameters.clickShopCode = $(element).data('shopcode');
    parameters.clickCommodityCode = $(element).data('commoditycode');
    parameters.tmpl = $(element).data('tmpl');

    var param = {
        parameters : parameters,
        uri : "/catalog/recommend_naviplus/move/",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

