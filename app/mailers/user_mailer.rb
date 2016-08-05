class UserMailer < ApplicationMailer
  default from: "support@afrikelist.com"
  def welcome_email(user, email, validationcode)
    @user = user
    @validationcode = validationcode
    @url = 'http://www.afrikelist.com'
    #mail(to: 'success@simulator.amazonses.com', subject: 'Welcome to Loolform')
    mail(to: email, subject: 'Welcome to Afrikelist')
  end
  def forgot_password(user, email, randompassword)
    @user = user
    @randompassword=randompassword
    mail(to: email, subject: 'Forgot password to Afrikelist')
  end
  def posting_approved(user, email, title)
    @user = user
    @email = email
    @posting_title = title
    mail(to: email, subject: 'Posting approved')
  end
end