module LoginHelper
  def log_in(contact)
    session[:user_id] = contact[:id]
    session[:level] = contact[:level]
    session[:enterprise] = contact[:enterprise]
    session[:remember] = false
  end
  def log_out
    session[:user_id] = nil
    session[:level] = nil
    session[:expires_at] = nil
    session[:remember] = nil
    current_user=nil
  end
  def login_expire(remember)
    session[:remember] = remember
  end
  def vendor?
    return session[:level]==200
  end
  def admin?
    return session[:level]==300
  end

  def  current_user
    return @current_user ||= UserTable.find(id: session[:user_id])
  end
  def logged_in?
    logger.info("user id %p user_level %p" % [session[:user_id], session[:level] ])
    !session[:user_id].nil?
    #!@current_user.nil?
  end
  def updateactive
    session[:expires_at] = Time.now+30.minutes
  end
  def checkactive?

    # time = Time.new()
    # if(time-session[:expires_at]<0)
    #   render :plain =>'timeout true'
    # else
    #   render :plain =>'timeout false'
    # end
  end
  def random(number)
    return rand(number) #return random number
  end
  def randomcharacter
    string='abcdefghijklmnopqrstuvwxyz1234567890'
    length=string.length
    position=random(length)
    return string[position]
  end
  def randomstring(length)
    string='';
    for i in 0..length
      string[i]=randomcharacter
    end
    return string
  end
end
