class UserTableController < ApplicationController
  before_filter :session_expires #, :except => [:new, :create, :createUser, :editProfile, :updateProfile, :loginForm, :validate, :edit, :update]
  before_filter :update_session_time
  before_filter :vendor_above

  #only the administrator can access this, level 200 and 300
  #there will be no create or new here
  def show
    @user=UserTable.find(params[:id])
  end

  def edit
    @user = UserTable.find(params[:id])
  end

  def index
    user=UserTable.all
    @users=initialize_grid(user)

  end

  def update
    user = UserTable.find(params[:id])
    userid = params[:id]
    password=params[:user][:password]
    password_confirm=params[:user][:password_confirm]
    if !(is_vendor? || is_admin)
      flash[:error] = 'Passwords are blank or do not match'
      redirect_to user_table_index_path
      return

    end
    if ! (user.password_hash.nil? || password.blank?)
      if password != password_confirm
        flash[:error] = 'Passwords are blank or do not match'
        redirect_to edit_user_table_path(userid)
        return
      else

        user.update_attribute(:password_hash, passwordCheck(password))
        user.save
        redirect_to user_table_path
        return
      end
    end
    if user.update_attributes(user_table_params)
      redirect_to user_table_index_path
      return
    end
    redirect_to user_table_path
  end
  def destroy
    user = UserTable.find(params[:id])
    user.destroy
    redirect_to user_table_index_path
  end
  def passwordCheck(password)
    password_hash = BCrypt::Password.create(password, :cost => 10)
    #change $2a to $2y, this is the seed for bcrypt style storage, should make it compatible with php
    password_hash[2]='y'
    return password_hash
  end
  private
  def user_table_params
    params.require(:user_table).permit(:userid, :phone, :email, :first_name, :last_name, :business, :logo, :level, :country, :phone_type)
  end
end
