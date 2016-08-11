require 'exchange'
module ApplicationHelper
	def get_fox_rate_for_usd
		"593"
		# endpoint = "http://apilayer.net/api/historical?access_key=f512dc46348ab5259e5aa44c50d8c924&date=#{(Time.zone.now.to_date-1).to_s}&source=USD&currencies=XOF&format=1"


		# # endpoint = "https://openexchangerates.org/historical/2016-08-10.json?app_id=59be646ec0de4c67a14199dfd92037b9"
		# uri = URI(endpoint)
  #       http = Net::HTTP.new(uri.host, uri.port)
  #       http.use_ssl = true
  #       binding.pry
  #       response = http.get(uri.path,{'Access-Control-Allow-Origin'=>"true"}) 
        
  #       CGI::parse(response.body)
		# fx = OpenExchangeRates::Rates.new
		# fx.exchange_rate(:from => "USD", :to => "XOF", :on => (Time.zone.now.to_date-1).to_s).round
	end
end
