
$(document).ready(function() {
  $("#usd").on("propertychange change keyup paste input", function(){
  var usd = $("#usd").val()
  if(parseFloat(usd)<=10)
  	{$("#valid_usd").text("no less than 10$ can be entered")
  	$("#proceed").attr("disabled","true")
  }
  else
  {
  $("#valid_usd").text("")
  $("#proceed").removeAttr("disabled")
  var rate = $("#currency_rate").text() 
  var converted_currency = rate*usd
  if(parseFloat(usd)>10 && parseFloat(usd)<=999)
  {
  	var ttus = ((parseFloat(usd)+((usd*0.029)+0.3))*1.05) //c1usd =1
  }
  else
  {
  	var ttus = ((parseFloat(usd)+((usd*0.029)+0.3))*1.035) //c1usd =1
  }
  
  $("#xof").val((converted_currency.toLocaleString()))
  $("#ttus").val(ttus.toLocaleString())
  $("#fees").val((ttus-usd).toLocaleString())
  }
});
});



