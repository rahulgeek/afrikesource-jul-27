class Address < ActiveRecord::Base
  validates_uniqueness_of :hiacode, :allow_blank=>true
  has_many :postings
end