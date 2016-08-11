
$(document).ready(function() {
  $("#usd").on("propertychange change keyup paste input", function(){
  var rate = $("#currency_rate").text()
  var usd = $("#usd").val()
  var ttus = ((((usd *0.029)+0.30*1.05)*(rate+25))/1) //c1usd =1
  $("#xof").val((rate*usd).toLocaleString())
  $("#ttus").val(ttus.toLocaleString())
  $("#fees").val((ttus-usd).toLocaleString())
});
});