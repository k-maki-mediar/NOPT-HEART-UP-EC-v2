$(document).ready(function() {

    $('.rankingCommodity .categories, .rankingCommodity .commodityList').slick({
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

    $('.categoryEvt').on("click", function( event ){
        event.preventDefault();
        let categoryCode = $(this).attr('data-categorycode');
        let elementId = '#ranking_' + categoryCode;
        let parent = $(this).closest('.categories');

        $(parent).find('.item_label span').removeClass('active');
        $(parent).find('.categoryEvt').each(function(){
            let currentCategoryCode = $(this).attr('data-categorycode');
            if (categoryCode == currentCategoryCode) {
                $(this).closest('span').addClass('active');
            }
         });

        $('.rankingCommodity').find('.m-fadeIn').removeClass('m-fadeIn').addClass('m-fadeOut');
        $('.rankingCommodity').find(elementId).removeClass('m-fadeOut').addClass('m-fadeIn');
    })

});
