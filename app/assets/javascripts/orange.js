
$(document).ready(function() {
  $("#xof").on("propertychange change keyup paste input", function(){
  var xof = $("#xof").val()
  usd_to_xof = $("#usd_to_xof").val()
  var converted_currency = usd_to_xof *xof    
  round_us = Math.round(converted_currency * 100)/100;
  $("#usd").val((round_us))
  if(parseFloat(converted_currency.toLocaleString())<10)
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

  if(parseFloat(usd)>=10 && parseFloat(usd)<=999)
  {
  	var ttus = ((parseFloat(usd)+((usd*0.029)+0.3))*1.05) //c1usd =1
  }
  else
  {
  	var ttus = ((parseFloat(usd)+((usd*0.029)+0.3))*1.035) //c1usd =1
  }
  round_ttus = Math.round(ttus * 100)/100;
  $("#ttus").val(round_ttus.toLocaleString())
  round_fees = Math.round(((ttus-usd)) * 100)/100;
  $("#fees").val((round_fees).toLocaleString())
  // $("#total_cost_usd").text(ttus)
  // $("#total_cost_fcfa").text(converted_currency.toLocaleString())
  }
});

$('#phone_number input[type=text]').on('keyup',function(){
            var oldstr=$('#phone_number input[type=text]').val();
            var str= "7"+ oldstr; 
            $('.percent input[type=text]').val(str);        
        });

});



