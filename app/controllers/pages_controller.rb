class PagesController < ApplicationController
  before_filter :update_session_time
  before_filter :check_login, only: :orange
  def show
    if !session[:user_id].nil?
      @user= UserTable.find(session[:user_id])
    end
  end

  def events

  end

  def orange
    # binding.pry
    
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

  def save_credits
    #@payment_details = current_user.transaction_details.create(payment_details_params)
  end

  def paypal_pro
    #puts "VM"
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

  private 

  def check_login
    unless !session[:user_id].nil?
      flash[:notice]="You must be logged in first to view this page."
      redirect_to root_url
    end
  end

  # def payment_details_params
  #   params.require(:payment_details).permit(:credits,:user_table_id)
  # end
end
