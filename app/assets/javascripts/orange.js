
$(document).ready(function() {
  $("#usd").on("propertychange change keyup paste input", function(){
  //alert('Changed!1')
  rate = $("#currency_rate").text()
  usd = $("#usd").val()
  ttus = Math.round((((usd *0.029)+0.30*1.05)*(rate+25))/rate)
  $("#xof").val(Math.round(rate*usd))
  $("#ttus").val(ttus)
  $("#fees").val(Math.round(ttus-usd))
     // do stuff;
});
});