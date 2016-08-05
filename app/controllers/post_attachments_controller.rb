class PostAttachmentsController < ApplicationController
  before_action :set_post_attachment, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token, only: [:create, :update]
  # GET /post_attachments
  # GET /post_attachments.json
  def index
    @post_attachments = PostAttachment.all
  end

  # GET /post_attachments/1
  # GET /post_attachments/1.json
  def show
  end

  # GET /post_attachments/new
  def new
    @post_attachment = PostAttachment.new
  end

  # GET /post_attachments/1/edit
  def edit
  end

  # POST /post_attachments
  # POST /post_attachments.json
  def create
      p_attr = params[:post_attachment]
      #note that the name of the file is a little different with blueimp uploader
      ttt=[]
      uuu = params[:post_attachment].first if params[:post_attachment].class == Array
      #ttt[:image]=uuu
#      uuu = []
#      uuu[:image] = ttt
      @posting=Posting.find(params[:id])
      @picture = @posting.post_attachments.build
      @picture.image=uuu

      if @picture.save
        respond_to do |format|
          format.html {
            render :json => [@picture.to_jq_upload].to_json,
                   :content_type => 'text/html',
                   :layout => false
          }
          format.json {
            render :json => { :files => [@picture.to_jq_upload] }
          }
        end
      else
        render :json => [{:error => "custom_failure"}], :status => 304
      end

#    @post_attachment = PostAttachment.new(post_attachment_params)
#    if !@post_attachment.image.nil?
#      respond_to do |format|
#        if @post_attachment.save
#          format.html { redirect_to @post_attachment, notice: 'Post attachment was successfully created.' }
#          format.json { render :show, status: :created, location: @post_attachment }
#        else
#          format.html { render :new }
#          format.json { render json: @post_attachment.errors, status: :unprocessable_entity }
#        end
#      end
#    end
  end

  # PATCH/PUT /post_attachments/1
  # PATCH/PUT /post_attachments/1.json
  #this should redirect to the page where the images were uploaded
  def update
    session[:return_to] ||= request.referer

    respond_to do |format|
      if @post_attachment.update(post_attachment_params)

        format.html {       if(!session[:return_to].nil?)
                              redirect_to session.delete(:return_to), notice: 'Post attachment was successfully updated.'
                              else
                                redirect_to @post_attachment, notice: 'Post attachment was successfully updated.'
                            end
        }
        format.json { render :show, status: :ok, location: @post_attachment }
      else
        format.html { if(!session[:return_to].nil?)
                        redirect_to session.delete(:return_to), notice: 'Error handling attachment'
                      else
                        redirect_to @post_attachment, notice: 'Error handling attachment'
                      end
                  }
        #render :edit }
        format.json { render json: @post_attachment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /post_attachments/1
  # DELETE /post_attachments/1.json
  def destroy
    #should go back to the origin
    session[:return_to]||= request.referer
    @post_attachment.destroy
    respond_to do |format|
      format.html { redirect_to session.delete(:return_to), notice: 'Post attachment was successfully destroyed.' }
#        redirect_to post_attachments_url, notice: 'Post attachment was successfully destroyed.' }
      format.json { head :no_content }
    end
  end
  # get /post_attachments/retrieveAttachments/:id where :id is the posting id
  def retrieveImages
    posting = Posting.find(params[:id])
    post_attachments = posting.post_attachments.all
    respond_to do |format|
      format.json { render json: {
          status: 'ok',
          rowcount: post_attachments.length,
          results: post_attachments.map { |b| {
              id: b.id,
              imageData: b.image,
              description: b.description
          }}
      }}
    end
  end
  private
  # Use callbacks to share common setup or constraints between actions.
  def set_post_attachment
    @post_attachment = PostAttachment.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  # we need the posting_id, the image? is this passed to the uploader
  #http://stackoverflow.com/questions/33016156/undefined-method-permit-for-string0x007f66ec6ff180-ruby-on-rails
  def post_attachment_params
    json = params.require(:post_attachment)
    { posting_id: JSON.parse(json).permit(:posting_id), image: JSON.parse(json).permit(:original_filename)}
    #params.require(:post_attachment).permit(:posting_id, :image, :description )
  end
end
