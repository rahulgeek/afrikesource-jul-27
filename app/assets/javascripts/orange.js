
$(document).ready(function() {
  $("#usd").on("propertychange change keyup paste input", function(){
  //alert('Changed!1')
  rate = $("#currency_rate").text()
  usd = $("#usd").val()
  ttus = ((((usd *0.029)+0.30*1.05)*(rate+25))/1) //c1usd =1
  $("#xof").val((rate*usd))
  $("#ttus").val(ttus)
  $("#fees").val((ttus-usd))
     // do stuff;
});
});