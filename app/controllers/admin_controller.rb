class AdminController < ApplicationController
  before_filter :session_expires #, :except => [:new, :create, :createUser, :editProfile, :updateProfile, :loginForm, :validate, :edit, :update]
  before_filter :update_session_time
  before_filter :vendor_above

  #note that only level 200 or 300 can use this
  def list_postings
    posting=Posting
    @postings = initialize_grid(posting)
  end
  def list_pending
    posting=Posting.where(approved: nil)
    @postings = initialize_grid(posting)
  end

  def approvePosting
    posting=Posting.find(params[:id])
    posting.update(:approved => '1')
    @user=posting.user_table
    UserMailer.posting_approved(@user.id,@user.email, posting.posting_title).deliver_now

    redirect_to request.referer
    #this will be for individual posting, the approve flag in the posting will be updated\
    #save current location and
    #set the approve flag
  end
  def disablePosting
    posting=Posting.find(params[:id])
    posting.update(:approved => nil)
    redirect_to request.referer
    #this will be for individual posting, the approve flag in the posting will be updated\
    #save current location and
    #the disable flag in the posting will be set
  end
  def deletePosting
    posting=Posting.find(params[:id])
    posting.destroy
    redirect_to request.referer
  end
  private
  def posting_address_params
  params.require(:posting).permit(:id, :posting_title, :posting_description, :posting_price, :picture, :types, :make, :model, :mileage, :image, :image2)
    end
end
