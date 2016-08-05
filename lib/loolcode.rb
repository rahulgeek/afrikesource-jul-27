class Loolcode
  def self.create (* args)
    if args.length == 3
      app, country, length = *args
    else
      app = nil
      country = nil
      length = 0
    end
    first=''
    second=''
    if(app.nil? || app=='')
      first='HCODE'
    else
      first=app
    end
    if(country.nil? || country=='')
      second='US'
    else
      second = country
    end

    if(length<=0)
      iterate=20
    else
      iterate=length
    end
    return first+second+randomstring(iterate).upcase
  end
  def self.random(number)
    return rand(number) #return random number
  end
  def self.randomcharacter
    string='abcdefghijklmnopqrstuvwxyz1234567890'
    length=string.length
    position=random(length)
    return string[position]
  end
  def self.randomstring(length)
    string='';
    for i in 0..length
      string[i]=randomcharacter
    end
    return string
  end
end
