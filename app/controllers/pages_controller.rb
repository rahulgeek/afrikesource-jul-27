class PagesController < ApplicationController
  before_filter :update_session_time
  def shows
    if !session[:user_id].nil?
      @user= UserTable.find(session[:user_id])
    end
  end

  def events

  end
  def orange

  end
  def market

  end
  def about

  end
  def privacy

  end
  def refund

  end
  def terms

  end
  def logged_in?

  end

  def change_lang

    if request.referer.nil?
      refer = root_url
    else
      uri = URI(request.referer)
      refer = uri.path
    end
    lang = params[:lang]
    cookies[:locale] = lang
    redirect_to refer

  end
end
