class LoginController < ApplicationController
  #session_expires is located in the application controller , :editProfile, :updateProfile
  before_filter :session_expires, :except => [:new, :create, :createUser, :loginForm, :validate, :authorize, :forgot, :forgot_form, :sign_up, :welcome, :logout]
  before_filter :update_session_time
  def logout
    #note that if it's the map
    log_out
    redirect_to pages_show_path
  end
  def index
    @users = UserTable.all
  end

  def new
    @user = UserTable.new
    logger.info('test')
  end

#if password forgotten, create a temporary one
  #http://stackoverflow.com/questions/12028910/ruby-bcrypt-hash-comparison
  def authorize
    @user=UserTable.find_by_userid(params[:user_table][:userid])
    password=params[:user][:password]
    if(!@user.nil?)
      #password_hash = BCrypt::Password.create(@user.password_hash, :cost => 10)
      #another = BCrypt::Password.create(password, :cost => 10)

      password_hash=@user.password_hash
      password_hash[2]='a'
      if BCrypt::Password.new(password_hash) == params[:user][:password]
        log_in(@user)
        if(params[:user][:remember] == 'on')
          login_expire(true)
        end
        update_session_time

        if session["store_url"]
          stored_location = session["store_url"]
          session["store_url"] = nil
          redirect_to stored_location and return         
        elsif is_admin? || is_vendor?
          redirect_to admin_list_postings_path
          return
        end
        #note depending on the source either postings_path or reload
        redirect_to postings_path
        return
      #looged_in
      end
    else
      @user=UserTable.new
    end
    @user.errors[:base] << 'Invalid userid/password combination'
    redirect_to new_login_path, :flash => { :error => @user.errors.full_messages.join(', ') }
  end
  def forgot_form
    @user = UserTable.new

  end
  def forgot
    @user = UserTable.find_by_userid(params[:user_table][:userid])
    if @user.nil?
      @user = UserTable.find_by_email(params[:user_table][:userid])
    end
    if @user.nil?
      redirect_to new_login_path
      return
    end
    random_password = Array.new(10).map { (65 + rand(58)).chr }.join
    @user.password_hash = BCrypt::Password.create(random_password, :cost => 10)
    @user.save!
    UserMailer.forgot_password(@user.id,@user.email, random_password).deliver_now

  end
  def acreate
    session=params[:session]
    userid=session[:userid]
    password=session[:password]
    password_confirm=session[:password_confirm]
    if (password != password_confirm)

    end
    #note that we will be given login, email, email_confirm, password, password_confirm, maybe phone
    #use bcrypt is it the same as password_hash and password_verify in php? not sure so call login.php to save the password
    uri = URI('https://www.loolmaps.com/login.php')
    #uri = URI('http://localhost/user.php')

    #note that we have to use a call to get the id used by the login table password
    #http://stackoverflow.com/questions/9538773/how-to-make-a-call-from-ruby-on-rails-to-an-external-php-script
    res = Net::HTTP.post_form(uri, {'action' => 'processUser', 'userid' => userid, 'password' => password})

    #ajax call to check the password
    data=JSON(res.body)

  end

  def update
    #note that the update can only happen if the validation code is
    userid = params[:id]
    if userid != session[:user_id]
      userid=session[:user_id]
    end
    #note if userid!=params[:id] then session is not correct
    password=params[:user][:password]
    password_confirm=params[:user][:password_confirm]
    email = params[:user_table][:email]
    user= UserTable.find(userid)
    handle = params[:user_table][:userid]
    t=user_params
    user.update_attributes(user_params)
#    if(params[:user_table][:enterprise] != user[:enterprise])
#      user.update_attribute(:enterprise, params[:user_table][:enterprise])
#    end
    if(params[:user_table][:first_name].blank?)
      flash[:error] = 'First name cannot be empty'
      redirect_to edit_login_path(userid)
      return;
    end
    if(params[:user_table][:phone].blank?)
      flash[:error] = 'phone cannot be empty'
      redirect_to edit_login_path(userid)
      return;
    end
    if(params[:user_table][:email].blank?)
      flash[:error] = 'Email cannot be empty'
      redirect_to edit_login_path(userid)
      return;
    end
    if(handle.blank?)
      flash[:error] = 'Handle cannot be empty'
      redirect_to edit_login_path(userid)
      return;
    end
    #************************
    #note that the password_hash can't be null if it is then don't accept a password.blank
    if ! (user.password_hash.nil? || password.blank?)
      if password != password_confirm
        flash[:error] = 'Passwords are blank or do not match'
        redirect_to edit_login_path(userid)
        return
      else

        user.update_attribute(:password_hash, passwordCheck(password))
        user.save
        redirect_to postings_path
        return
        end
    end
    redirect_to postings_path
  end
  def sign_up
    @user= UserTable.new
  end
  def passwordCheck(password)
    password_hash = BCrypt::Password.create(password, :cost => 10)
    #change $2a to $2y, this is the seed for bcrypt style storage, should make it compatible with php
    password_hash[2]='y'
    return password_hash
  end
  def edit
    #must checked if logged in
    #note that if the user is not level 200 then they can't edit other people's profile
    if session[:user_id]== params[:id]
      @user = UserTable.find(params[:id])
    else
      @user = UserTable.find(session[:user_id])
      #note that the params is wrong
    end
  end


  def create
    #this has to check the password
    #userid has to be unique
    #note that this is similar to update however
    #create an entry in the user table and then email a
    email=params[:user][:email]
    #
  end

  def loginForm
    @existing = UserTable.new
    @new = UserTable.new
  end

  #createUser is called when the initial profile is created
  #theoretically only the correct email address is needed
  #however we will require all the fields to be filled.
  def createUser
    @user = UserTable.new
    value = user_params
    password=params[:user][:password]
    password_confirm=params[:user][:password_confirm]
    @user.assign_attributes(value)
    if password.blank? || password != password_confirm
      flash[:error] = 'Passwords are blank or do not match'
      render :sign_up
      return
    else
      password_v = passwordCheck(password)
      @user.update_attributes(:password_hash => password_v)
      @user.update_attributes(value);
      if !@user.save
        ##@user.errors[:base] << @user.errors
        #flash[:error] = @user.errors
        render :sign_up
        return
      end
    end
    if (!params[:user_table][:email].nil?)
      #testing
      @user.email = params[:user_table][:email]
      @user.validation = randomstring(20)
      if @user.save
        #@user.error[:base] << 'An validation email has been sent to this address'
        UserMailer.welcome_email(@user.id,@user.email, @user.validation).deliver_now
      else
        @user.errors[:base] << 'email cannot be empty error'
        render :sign_up
        return
      end
      render :welcome
    end
  end
  def welcome

  end

  def validate
    #this will be given two parameters, the userid and the uniquecode forthe email address, if this matches then this will allow the user to
    #update their profile, including the password?
    # we currently ask for the phone, email and handle
    id=params[:id]
    @user = UserTable.find(id)
    if (@user.validation == params[:validate] && !@user.validation.nil?)
      #matches note that at this point the user is logged in
      @user.update_attribute(:validation,nil);
      log_in(@user)
      update_session_time
      #@user.update_attributes(validation: nil) #null out the validation so it can't be used
      redirect_to edit_login_path
    else
      @user.errors[:base] << 'Invalid user/validation'
      redirect_to new_login_path
      #not found
    end
  end

  def editProfile
    #this includes the password?
  end

  def updateProfile

  end

  def destroy
    log_out
    redirect_to root_path
  end
  private
  def user_params
    params.require(:user_table).permit(:userid, :phone, :email, :first_name, :last_name, :business, :country, :phone_type, :enterprise) #:logo,
  end
end

