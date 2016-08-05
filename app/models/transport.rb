class Transport < ActiveRecord::Base
  belongs_to :user_table
  validates :fromAddress, :presence => true
  validates :toAddress, :presence => true
  validates :date, :presence => true
end
