class TransportsController < ApplicationController
  before_action :set_transport, only: [:show, :edit, :update, :destroy]

  # GET /transports
  # GET /transports.json
  def index
    #the index gets all available Postings where type='transportation'
    @posting = Posting.where(:types=> :transportation)
  end

  # GET /transports/1
  # GET /transports/1.json
  def show
    @posting = Posting.find(params[:id])
    createPostingAccessors(@posting)
    address=@posting.address
    if(!address.nil?)
      @posting.address_1=address.address_1
      @posting.address_2=address.address_2
      @posting.lat=address.lat
      @posting.lng=address.lng
    end
    @post_attachment = @posting.post_attachments.all
  end

  # GET /transports/new
  def new
    @posting = Posting.new
    createPostingAccessors(@posting)
    @posting.address_1=nil
    @posting.address_2=nil
    @posting.lat=nil
    @posting.lng=nil
  end

  # GET /transports/1/edit
  def edit
    @posting = Posting.find(params[:id])
    createPostingAccessors(@posting)
    address=@posting.address
    if(!address.nil?)
      @posting.address_1 = address.address_1
      @posting.address_2 = address.address_2
      @posting.lat = address.lat
      @posting.lng = address.lng
    end
  end

  # POST /transports
  # POST /transports.json
  def create
    @posting = Posting.new(transport_params)
    @posting[:user_table_id] = session[:user_id]
    @posting[:types] = 'transportation'
    if @posting[:posting_price].nil? || @posting[:posting_price] ==0
      @posting.errors[:base] << 'Transport price cannot be empty'
    end
    if @posting[:space].nil? || @posting[:space] ==0
      @posting.errors[:base] << 'Transport space cannot be empty'
    end
    @address=@posting.build_address(transport_address_params)
    if params[:posting][:address_1].empty?
      @posting.errors[:base] << 'From address cannot be empty'
    end
    if params[:posting][:address_2].empty?
      @posting.errors[:base] << 'To address cannot be empty'
    end
    if @posting.errors.any?
      createPostingData
      render :new
      return
    end
    #respond_to do |format|
    #  if @posting.save
    ##    format.html { redirect_to @posting, notice: 'Transport was successfully created.' }
    #    format.json { render :show, status: :created, location: @posting }
    #  else
    #    format.html { render :new }
    #    format.json { render json: @posting.errors, status: :unprocessable_entity }
    #  end
    #end

    if @posting.save
      @address=@posting.build_address(transport_address_params)
      value=Loolcode.create('AF','SN',20) #af for afrikelist sn for senegal... how to pull the country code?
      @address.update_attributes(:hiacode => value)
      @address.save
      @posting.update_attributes(:address_id => @address[:id])
      createPostingAccessors(@posting)
      redirect_to @posting, notice: 'Transport was successfully created.'
    else
      createPostingData
      render :new
    end
  end

  # PATCH/PUT /transports/1
  # PATCH/PUT /transports/1.json
  def update
    @posting=Posting.find(params[:id])
    checkPostingData
    if @posting.errors.any?
      createPostingData
      render :edit
      return
    end
    if !@posting.nil? && @posting.update_attributes( transport_params )
      @address=@posting.address
      value = transport_address_params
      @address.update_attributes(value)
      #@address.update( transport_address_params )
    end
    redirect_to transports_path
#    respond_to do |format|
##      if @posting.update(transport_params)
#        format.html { redirect_to @transport, notice: 'Transport was successfully updated.' }
#        format.json { render :show, status: :ok, location: @transport }
#      else
#        format.html { render :edit }
#        format.json { render json: @transport.errors, status: :unprocessable_entity }
#      end
#    end
  end

  # DELETE /transports/1
  # DELETE /transports/1.json
  def delete
    destroy
  end
  def destroy

    Posting.destroy(params[:id])
    respond_to do |format|
      format.html { redirect_to transports_url, notice: 'Transport was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_transport
      posting = Posting.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def transport_params
      params.require(:posting).permit(:posting_title,:posting_description , :date, :space, :posting_price)
    end
  def transport_address_params
    params.require(:posting).permit(:address_1, :address_2, :lat, :lng)
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
    @address=@posting.build_address(transport_address_params)
    if params[:posting][:address_1].empty?
      @posting.errors[:base] << 'From address cannot be empty'
    end
    if params[:posting][:address_2].empty?
      @posting.errors[:base] << 'To address cannot be empty'
    end
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
