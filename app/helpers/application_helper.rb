module ApplicationHelper
	def get_fox_rate_for_usd
		fx = OpenExchangeRates::Rates.new
		fx.exchange_rate(:from => "USD", :to => "XOF", :on => (Time.zone.now.to_date-1).to_s)
	end

	def get_usd_rate_for_fox
		fx = OpenExchangeRates::Rates.new
		fx.exchange_rate(:from => "XOF", :to => "USD", :on => (Time.zone.now.to_date-1).to_s)
	end
end
