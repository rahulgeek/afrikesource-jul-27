class ApplicationController < ActionController::Base
  before_action :set_locale

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  include LoginHelper
  protect_from_forgery with: :exception

  helper_method :is_admin?, :is_vendor?, :is_user?, :leveler

  #the default locale is fr
  def set_locale
#    local=params[:locale]
#    if !local.nil?
#      I18n.locale = params[:locale] || I18n.default_locale
#      end
#    @language = I18n.locale
# -- Get lang from cookies or url parameter locale
    if !params[:locale].nil?
      user_locale = params[:locale]
    else
      user_locale = cookies[:locale] || params[:locale]
    end
# -- If present

    if user_locale.present?

      # -- If it is has 2 symbols

      user_locale = user_locale.scan(/[a-zA-Z]{2}/)
    else

      # -- If no - use default en locale

      user_locale = 'fr' #set default to fr unless otherwise (cookie etc)
    end
    cookies[:locale] = user_locale
# -- Check, is this locale available for using.
# Please note: this needed for disable invalid locale warning.

    if I18n.available_locales.include?(user_locale[0].to_sym)

      I18n.locale =  user_locale[0]
    else
      I18n.locale =   "fr"
    end
    @language=I18n.locale
  end
  # app/controllers/application_controller.rb
 def default_url_options(options = {})
   options.merge(:locale => I18n.locale )
#    { locale: I18n.locale }.merge options
    #@language = I18n.locale
end
  def vendor_above
    if ! (is_vendor? or is_admin?)
      redirect_to root_path
    end
  end
  def is_admin?
    session[:level]=='300'
  end
  def is_vendor?
    session[:level]=='200'
  end
  def is_user?
    session[:level]=='100' || session[:level].blank?
  end

  def session_expires
    t=session[:expires_at]
    if logged_in?
      logger.info('UserTable logged in')
      if !t.nil?
        if(session[:expires_at].is_a? String )
          time=Time.parse(session[:expires_at])
          session[:expires_at]=time
        end
        if(session[:expires_at] != nil)
          @time_left = (session[:expires_at] - Time.now).to_i
          logger.info('time_left %p' % @time_left)
          unless @time_left > 0

            log_out
            redirect_to new_login_path
          end
        end
        update_session_time
      else
        logger.info('timed out redirect')
        redirect_to new_login_path
        return
      end
    else
      logger.info('user not logged in- redirect')
      redirect_to new_login_path
      return
    end
  end
  def update_session_time
    if !session[:user_id].nil?
      if session[:remember] == true
        session[:expires_at] = 7.days.from_now
      else
        session[:expires_at] = 7.days.from_now
      end
    else
      session[:expires_at] = nil
    end
  end
end
