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
    @paypal_pro = PaypalPro.new
    #@transaction = TransactionDetail.find(params[:payment_id])
    session["transaction_id"] = @payment_details.id
    redirect_to @paypal_pro.paypal_url(paypal_callback_path,@payment_details.id,params["payment_details"]["ttus"])
  end

  # def paypal_pro

  # end

  def paypal_callback
    params.permit! # Permit all Paypal input params
    status = params[:payment_status]
    if status == "Completed"
      @message= "Transaction successful"
    else
      @message = "Last Transaction cancelled due to some internal error"
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
      session["store_url"] = save_credits_url(params)
      redirect_to new_login_url
    end
  end

  def success?
    @paypal_pro.include?"TRANSACTIONID"
  end

  def payment_details_params
    params.require(:payment_details).permit(:credits,:user_table_id,:ttus,:currencyCode)
  end

  def paypal_pro_params
    params.require(:paypal_pro).permit(:creditCardType,:paymentAction,:amount,:currencyCode,:firstName,
      :last_name,:creditCardNumber,:expMonth,:expYear,:cvv,:creditCardType, :id_type,:id_number, :issuing_authority, 
      :reciepient_number,:creditCardNumber,:expMonth,:expYear,:cvv,:transaction_id)
  end

  def sanitize_params
    params.require(:paypal_pro).permit(:creditCardType,:paymentAction,:ttus,:creditCardNumber,:expMonth,:expYear,:cvv,:creditCardType, :id_type,:id_number, :issuing_authority, 
      :reciepient_number,:creditCardNumber,:expMonth,:expYear,:cvv,:transaction_id)
  end
end
