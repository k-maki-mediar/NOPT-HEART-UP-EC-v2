$(document).ready(function() {
});

function sendMoveRequest(element) {
	
    var uri = "/customer/customer_complete/move/";
    var parameters = createBaseParametersForAjaxApi("customer", "customer_complete", "move");
    
    var param = {
        parameters : parameters,
        uri : uri,
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}
