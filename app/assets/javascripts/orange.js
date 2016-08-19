
$(document).ready(function() {
  $("#usd").on("propertychange change keyup paste input", function(){
  var rate = $("#currency_rate").text()
  var usd = $("#usd").val()
  var converted_currency = rate*usd
  var ttus = ((parseFloat(usd)+((usd*0.029)+0.3))*1.035) //c1usd =1
  $("#xof").val((converted_currency.toLocaleString()))
  $("#ttus").val(ttus.toLocaleString())
  $("#fees").val((ttus-usd).toLocaleString())
});
});



