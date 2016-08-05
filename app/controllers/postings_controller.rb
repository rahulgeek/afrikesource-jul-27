require 'loolcode.rb'
class PostingsController < ApplicationController
  before_filter :session_expires , :except => [:show, :showMarket, :showBody, :showEvent, :showhcode, :urgent]#, :except => [:newTransport, :create, :createUser, :editProfile, :updateProfile, :loginForm, :validate, :editTransport, :update]
  before_filter :update_session_time
# note that we should make sure that users who created the post and level 100 or 200 users can edit the body, address, etc
#
  def new
    redirect_to posting_types_path
  end

  def create
    values = posting_params
    @posting = Posting.new(values)
    if(@posting.valid?)
      @posting.save
      render :text => 'Posting saved'
    else
      redirect_to posting_types_path
      #handle errors
    end

  end
  def index
    #note if not logged in redirect to main page, otherwise login can see their posting
    #
    #note that
    if(session[:level] == '200' || session[:level] == '300' || session[:level] == '400')
      postings = Posting
#    else
#      postings = Posting.find_by_sql("select * from postings where user_table_id="+session[:user_id].to_s)# 24");#all_by_user_table_id(session[:user_id])
    end
    postings = Posting
    @postings = initialize_grid(Posting.where(:user_table_id => session[:user_id]) )
  end

  #get postings/showAddress/:id
  # for all types, won't allow the map marker to be moved
  #
  def showAddress
    @posting=Posting.find(params[:id])
    if(!@posting.address_id.nil?)
      @address=Address.find(@posting[:address_id])
    else
      @address = Address.new
    end
  end
  #redirect to showMarket if enterprise==1?
  def show
    begin
      @posting = Posting.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to controller: 'postings', action: 'showhcode', id: params[:id]
      return
    end
    if @posting[:types] == 'transportation'
      redirect_to transport_path
      return
    end
    if @posting[:enterprise] == 1
      redirect_to posting_show_market_path
      return
    end
    if @posting[:types] == 'events'
      redirect_to posting_show_event_path
      return
    end
    @post_attachment = @posting.post_attachments.all
  end

  def showEvent
    begin
      @posting = Posting.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to controller: 'postings', action: 'showhcode', id: params[:id]
      return
    end
    @post_attachment = @posting.post_attachments.all
  end
  #this is only called if enterprise == 1
  #the user interface on the homepage will come directly here
  def showMarket
    begin
      @posting = Posting.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to controller: 'postings', action: 'showhcode', id: params[:id]
      return
    end
    if @posting[:types] == 'transportation'
      redirect_to transport_path
      return
    end
    @post_attachment = @posting.post_attachments.all
  end


  def showhcode
    begin
      @address = Address.find_by_hiacode(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to postings_record_not_found_path
      return
    end
    if @address.nil?
      redirect_to postings_record_not_found_path
      return
    end
    @posting=@address.postings.first
    @post_attachment = @posting.post_attachments.all
    if @posting[:types] == 'transportation'
      redirect_to controller: 'transports', action: 'show', id: @posting[:id], method: 'GET'
      return
    end
    if @posting[:types] == 'events' || @posting[:enterprise] == 1
      render 'showMarket'
      return
    end
  end
  def edit
    @posting = Posting.find_by(params[:id])
  end
  def update

  end
  def newBody
    @posting = Posting.new
    @posting.attributes = posting_params
    if params[:posting] == nil || params[:posting][:types].empty?
      @posting.errors[:base] << 'Must select posting type'
      render 'selectTypes'
      return
    end

    value = posting_params
    @posting.assign_attributes( { :types=> value[:types]} )
#    @posting.assign_attributes( { :enterprise => value[:enterprise ] })

    class << @posting
      attr_accessor :append_files
    end

    if value[:types] == 'transportation'
      render 'newTransport'
      return
    end
    @posting.append_files=nil
  end
  #this will actually save the type and body information
  #don't forget to save the user_table_id
  def newTransport

  end
  def editTransport
    @posting = Posting.find(params[:id])
    class << @posting
      attr_accessor :append_files
    end
  end
  def createTransport
    @posting = Posting.new(posting_params)
    @posting[:user_table_id] = session[:user_id]
    @posting[:types] = 'transportation'
    if @posting[:posting_price].nil? || @posting[:posting_price] ==0
      @posting.errors[:base] << 'Transport price cannot be empty'
    end
    if @posting[:space].nil? || @posting[:space] ==0
      @posting.errors[:base] << 'Transport space cannot be empty'
    end
    if @posting.errors.any?
      createPostingData
      render :newTransport
      return
    end
    if @posting.save
      redirect_to posting_upload_image_path(@posting)
#note that we should go to image upload
#      @posting.save_attachments(params) if params[:post_attachment]
#      redirect_to controller: 'postings', action: 'newAddress', id: @posting.id
      return
    else
      createPostingData
      render :newTransport
    end

  end
  def updateTransport
    @posting=Posting.find(params[:id])
    checkPostingData
    if @posting.errors.any?
      createPostingData
      render :editTransport
      return
    end
    if !@posting.nil? && @posting.update_attributes( posting_params )
      @posting.update_attachments(params) if params[:post_attachment]

      redirect_to postings_path
      return
    end
    redirect_to posting_edit_transport_path
  end

  #
  #after newBody
  #note that a change on 6/3/2016 is that after creating the body will come the images to be uploaded
  #at this point the posting will be either an enterprise or not depending on the user
  #
  def createBody
#    @post_attachment = @posting.post_attachments.build

    value = posting_params
    @posting = Posting.new

    value[:enterprise] = session[:enterprise]

    value[:user_table_id] = session[:user_id]

    #validations before it gets to the model
    #there must be a title and a description

    if(value[:posting_title].empty?)
      if(value[:posting_title].empty?)
        @posting.errors[:base] << 'Posting title cannot be empty'
      end
      if(value[:posting_description].empty?)
        @posting.errors[:base] << 'Posting description cannot be empty'
      end
      @posting.attributes=value
      render 'newBody'
      return
    end

    #if the values of the posting works then
    #save the attachments.
    if @posting.update(value)

      @posting.save_attachments(params) if params[:post_attachment]
#      params[:post_attachment]['image'].each do |a|
#        @post_attachment = @post.post_attachments.create!(:image => a)
#      end
    else
       render 'newBody'
       return
    end
    # a change is after the body is created, images are added, not the address

    redirect_to posting_upload_image_path(@posting)
    #redirect_to controller: 'postings', action: 'newAddress', posting: @posting.id
  end
  def editBody
    @posting = Posting.find(params[:id])
    class << @posting
      attr_accessor :append_files
    end

    if @posting[:types] == 'transportation'
      redirect_to posting_edit_transport_path(params[:id])
      return
    end
    @posting.append_files=nil
    #@post_attachment = @posting.post_attachments.all
  end


  def updateBody
    value = posting_params
    @posting = Posting.find(params[:id])
    if(@posting[:enable_sharing].nil?)
      @posting.address.update(:hiacode => nil)
    else
      #if it is not nil and the hiacode is nil, add one
      if !@posting.address.nil? &&  @posting.address.hiacode.nil?
        @posting.address.update(:hiacode => Loolcode.create('AF','SN',20))
      end
    end
    #update attachments
    if !@posting.update(value)
      render :action => 'editBody'
      return
    end
    #add postinng_attachment after updating all others
    @posting.update_attachments(params) if params[:post_attachment]

    redirect_to posting_edit_body_path(@posting)
  end

  # note that if the posting is market and the user is not
  # an enterprise user, then no bueno
  def selectTypes

    @posting = Posting.new
    @post_attachment = @posting.post_attachments.build
    if params[:from] == 'market'
      user = UserTable.find(session[:user_id])
      if user[:enterprise] == 1
        @posting[:enterprise] = '1'
        @market = '1'
      else
        redirect_to not_market_business_path
      end
    end
  end
  def editTypes
    @posting = Posting.find(params[:id])
    @post_attachment = @posting.post_attachments.build
  end


  def updateTypes
    value = posting_params
    @posting = Posting.find(params[:id])
    @posting.update(value)
    redirect_to postings_path
  end
  def newAddress
    #we should have the posting_id and the user_id

    @posting=Posting.find(params[:id])
    if(!@posting.address_id.nil?)
      @address=Address.find(@posting[:address_id])
    else
      @address = Address.new
    end
  end
  def newPackage
    @posting = Posting.new
  end
  #after createBody ->
  #follows newAddress
  def createAddress
    value = posting_address_params
    @posting=Posting.find(params[:id])

    if(value[:id].nil? && @posting[params[:id]].nil?)
      @address = Address.new
      if @posting[:enable_sharing]==1
        value[:hiacode]=Loolcode.create('AF','SN',20) #af for afrikelist sn for senegal... how to pull the country code?
      end
      @address.update_attributes(value)

      @address.save
    else
      @address = Address.find(params[:id])
      @address.update_attributes(value )
    end
    @posting.update(address_id: @address.id)
  end
  def editAddress
    @posting = Posting.find(params[:id])
    @address = @posting.address
    if @address.nil?
      @address = @posting.build_address
    end
  end
  def updateAddress
    @posting = Posting.find(params[:id])
    value = posting_address_params
    @address=@posting.address
    if @posting[:enable_sharing]==1 && (!@address.nil? && @address[:hiacode].nil?)
      value[:hiacode]=Loolcode.create('AF','SN',20) #af for afrikelist sn for senegal... how to pull the country code?
    end
    if @posting[:enable_sharing]==0
      value[:hiacode]=nil
    end
    #
    #check for the case where the address was not created
    #
    if @address.nil?
      @address=@posting.build_address
      @posting.update(address_id: @address.id)
    end
    @address.update_attributes(value)

    redirect_to postings_path

  end
  def delete

    posting=Posting.find(params[:id])
    posting.post_attachments.destroy
    posting.destroy
    redirect_to postings_path
  end

  def record_not_found
    
  end
  def notMarketBusiness

  end
  def uploadImage
    @posting=Posting.find(params[:id])

  end
  def editImages
    @posting=Posting.find(params[:id])
    if (@posting.nil?)

      redirect_to postings_path
      return
    end
  end
  #
  #for urgent and  other #bargain, search for posting_type= 16 or 17
  # note to provide pagination by 100?
  # and it has to be non-expired.
  def urgent
    @postings=Posting.page(params[:page]).per(12)

  end
  private
  def posting_params
    params.require(:posting).permit(:id, :posting_title, :posting_description, :posting_price, :picture, :types, :make, :model, :mileage, :url1, :url2, :enable_sharing, :enterprise, :space, address_attributes: [ :id, :address_1, :address_2, :lat, :lng], post_attachments_attributes: [:id, :posting_id, :image, :description, :_destroy])  end
  def posting_types_params
    params.require(:posting).permit(:types, :enterprise)
  end
  def posting_transport_params
    params.require(:posting).permit(:id, :address_1, :address_2, :city, :state, :zipcode_postal, :country, :lat, :lng, :hiacode)
  end
  def posting_address_params
    params.require(:address).permit(:id, :address_1, :address_2, :city, :state, :zipcode_postal, :country, :user_id, :hiacode, :lat, :lng)
  end
  def createPostingData
    createPostingAccessors @posting
    @posting.address_1 = params['posting'][:address_1]
    @posting.address_2 = params['posting'][:address_2]
    @posting.lat = params['posting'][:lat]
    @posting.lng = params['posting'][:lng]
  end
  def checkPostingData
    if params[:posting][:posting_price].nil? || params[:posting][:posting_price] == ''
      @posting.errors[:base] << 'Transport price cannot be empty'
    end
    if params[:posting][:space].nil? || params[:posting][:space] == ''
      @posting.errors[:base] << 'Transport space cannot be empty'
    end
    @address=@posting.build_address(posting_transport_params)
  end
  def createPostingAccessors(param)
    class << param
      attr_accessor :address_1
      attr_accessor :address_2
      attr_accessor :lat
      attr_accessor :lng
    end
  end

end
