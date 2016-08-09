class UserTable < ActiveRecord::Base
  
  #self.table_name='user_table'
  has_many :postings
  has_many :transaction_details
  #mount_uploader :logo, LogoUploader
  validates :email, presence: true, uniqueness: true
  validates :userid, presence: true, uniqueness: true
  validates :phone, presence: true
  validates :first_name, presence: true
  validates :last_name, presence: true
end
