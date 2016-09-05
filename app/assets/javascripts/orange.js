
$(document).ready(function() {
  $("#xof").on("propertychange change keyup paste input", function(){
  var xof = $("#xof").val()
  if(parseFloat(xof)<10)
  	{$("#valid_usd").text("no less than 10$ can be entered")
  	$("#proceed").attr("disabled","true")
  }
  else if(xof=="")
  {
  	 	$("#usd").val(0)
  		$("#ttus").val(0)
  		$("#fees").val(0)
      // $("#total_cost_usd").text(0)
      // $("#total_cost_fcfa").text(0)
  }
  else
  {

  usd = $("#usd").val()

  $("#valid_usd").text("")
  $("#proceed").removeAttr("disabled")
  var rate = $("#currency_rate").text() 
  var converted_currency = rate*xof
  if(parseFloat(usd)>=10 && parseFloat(usd)<=999)
  {
  	var ttus = ((parseFloat(usd)+((usd*0.029)+0.3))*1.05) //c1usd =1
  }
  else
  {
  	var ttus = ((parseFloat(usd)+((usd*0.029)+0.3))*1.035) //c1usd =1
  }
  
  $("#usd").val((converted_currency))
  $("#ttus").val(ttus.toLocaleString())
  $("#fees").val((ttus-usd).toLocaleString())
  // $("#total_cost_usd").text(ttus)
  // $("#total_cost_fcfa").text(converted_currency.toLocaleString())
  }
});

});




