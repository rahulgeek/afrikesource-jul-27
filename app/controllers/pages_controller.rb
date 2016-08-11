class PagesController < ApplicationController
  before_filter :update_session_time
  before_filter :check_login, only: :save_credits
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
    @payment_details = current_user.transaction_details.create(payment_details_params)
  end

  def paypal_pro
    @paypal_pro = PaypalPro.new.paypalCall(params[:paypal_pro])

    if success?
      @paypal_pro.merge!({"status"=>1})
      @transaction = TransactionDetail.find(params[:payment_id])
      @transaction.update_attributes(:transaction_id=>@paypal_pro["TRANSACTIONID"].first)
    end
    respond_to do |format|
      format.json { render json: @paypal_pro }
    end
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
      flash[:notice]="You must be logged in to proceed for payment."
      redirect_to new_login_url
    end
  end

  def success?
    @paypal_pro.include?"TRANSACTIONID"
  end

  def payment_details_params
    params.require(:payment_details).permit(:credits,:user_table_id,:ttus)
  end

  def paypal_pro_params
    params.require(:paypal_pro).permit(:creditCardType,:paymentAction,:amount,:currencyCode,:firstName,
      :last_name,:creditCardNumber,:expMonth,:expYear,:cvv)
  end
end
