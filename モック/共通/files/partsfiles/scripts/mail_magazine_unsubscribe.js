$(document).ready(function() {
});

/**
 * アクション送信
 *
 */
function sendMailMagazineRequest(actionId, element) {

  var successFunction = function(data, messages) {
    if (messages.errorMessages.length == 0) {
      $("#buttonArea").remove();
    }
  }
  
  var uri = "/customer/mail_magazine_unsubscribe/" + actionId;
  var parameters = createBaseParametersForAjaxApi("customer", "mail_magazine_unsubscribe", actionId);
  var functions = createAjaxFunctions(null, null, successFunction);

  var param = {
    parameters : parameters,
    functions : functions,
    uri : uri,
    formId : "mailMagazineForm",
    dataType : "json",
    async : true,
    element : element
  }
  
  sendAjaxToApi(param);
}
