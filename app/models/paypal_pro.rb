require 'open-uri'
require 'uri'
require 'net/http'
class PaypalPro

    # //Configuration Options
    attr_accessor :apiUsername,:apiPassword,:apiSignature,:apiEndpoint,:subject,:authToken,
                  :authSignature,:authTimestamp,:useProxy,:proxyHost,:proxyPort,:paypalURL,:version,
                  :ackSuccess,:ackSuccessWarning
    
    def initialize 
     @apiUsername = 'moyadevijayshree-facilitator_api1.gmail.com'
     @apiPassword = '9PFX5HK88N72U4JX'
     @apiSignature = 'An5ns1Kso7MWUdW4ErQKJJJ4qi4-AH9Uh0JQ6Y77SnkyaikoHHdJhadp'
     @apiEndpoint = 'https://api-3t.sandbox.paypal.com/nvp'
     @subject = ''
     @authToken = ''
     @authSignature = ''
     @authTimestamp = ''
     @useProxy = FALSE
     @proxyHost = '127.0.0.1'
     @proxyPort = 808
     @paypalURL = 'https://www.sandbox.paypal.com/webscr&cmd=_express-checkout&token='
     @version = '65.1'
     @ackSuccess = 'SUCCESS'
     @ackSuccessWarning = 'SUCCESSWITHWARNING'
    end

    def nvpHeader
        @nvpHeaderStr = ""
    
        if((!(self.apiUsername).blank?) && (!(self.apiPassword).blank?) && (!(self.apiSignature).blank?) && (!(@subject).blank?))
            @authMode = "THIRDPARTY"
        elsif((!(self.apiUsername).blank?) && (!(self.apiPassword).blank?) && (!(self.apiSignature).blank?)) 
            @authMode = "3TOKEN"
        elsif (!(self.authToken).blank? && !(self.authSignature).blank? && !(self.authTimestamp).blank?) 
            @authMode = "PERMISSION"
        elsif(!(@subject).blank?)
            @authMode = "FIRSTPARTY"
        end
        
        case (@authMode) 
            when "3TOKEN" 
                @nvpHeaderStr = "&PWD="+URI::encode(self.apiPassword)+"&USER="+URI::encode(self.apiUsername)+"&SIGNATURE="+URI::encode(self.apiSignature)
            when "FIRSTPARTY"
                @nvpHeaderStr = "&SUBJECT="+URI::encode(self.subject)
                
            when "THIRDPARTY"
                @nvpHeaderStr = "&PWD="+URI::encode(self.apiPassword)+"&USER="+URI::encode(self.apiUsername)+"&SIGNATURE="+URI::encode(self.apiSignature)+"&SUBJECT="+URI::encode(@subject)
               	
            when "PERMISSION"
                @nvpHeaderStr = self.formAutorization(self.authToken,self.authSignature,self.authTimestamp)
                
        end

        return @nvpHeaderStr
    end

    def hashCall(methodName,nvpStr)

        @nvpheader = self.nvpHeader
        
        nvpStr = @nvpheader+nvpStr
        nvpStr = "&VERSION="+URI::encode(self.version)+nvpStr
        @nvpreq = "METHOD="+URI::encode(methodName)+ nvpStr            
        

        uri = URI(self.apiEndpoint)
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        response = http.post(uri.path, @nvpreq ,{}) 
        
        CGI::parse(response.body)
    end
    
    def formAutorization(auth_token,auth_signature,auth_timestamp)
        @authString="token="+auth_token+",signature="+auth_signature+",timestamp="+auth_timestamp 
        return @authString
    end
    
    def paypalCall(params)
		@recurringStr = (((params.include? "recurring") && params['recurring'] == 'Y')? '&RECURRING=Y': '')
        @nvpstr = "&PAYMENTACTION="+"#{params['paymentAction']}"+"&AMT="+"#{params['amount']}"+"&CREDITCARDTYPE="+"#{params['creditCardType']}"+"&ACCT="+"#{params['creditCardNumber'].split(" ").join}"+"&EXPDATE="+"#{params['expMonth']}"+"#{params['expYear']}"+"&CVV2="+"#{params['cvv']}"+"&FIRSTNAME="+"#{params['firstName']}"+"&LASTNAME="+"#{params['lastName']}"+"&CITY="+"#{params['city']}"+"&ZIP="+"#{params['zip']}"+"&COUNTRYCODE="+"#{params['countryCode']}"+"&CURRENCYCODE="+"#{params['currencyCode']}"+@recurringStr  
        @resArray = self.hashCall("DoDirectPayment",@nvpstr)    
        @resArray
    end
end