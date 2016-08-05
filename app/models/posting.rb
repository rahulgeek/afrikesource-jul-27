class Posting < ActiveRecord::Base
  belongs_to :user_table
  belongs_to :address
  has_many :post_attachments
  validates :posting_title, :presence => true
  accepts_nested_attributes_for :address
  accepts_nested_attributes_for :post_attachments, allow_destroy: true

  def self.active
    a=Posting.joins(:address).where(addresses: { loolcode: nil } ).count
  end
  def self.unapproved_count
    a=Posting.joins(:address).where(approved: nil).count
  end
  def self.approved_count
    a=Posting.joins(:address).where(approved: !nil).count
  end
  def self.available_count
    a=Posting.joins(:address).where(approved: !nil).count
  end
  def self.unapproved
    a=Posting.joins(:address).where(approved: nil)
  end


  #this will happen when new files are attached to the form
  def save_attachments(params)
    params[:post_attachment]['image'].each do |photo|
      if self.post_attachments(:reload).count < 10
        self.post_attachments.create!(:image => photo)
      else
          # note that a change, market postings can have 10, regular postings have 3
          errors.add(:base, "Maximum 10 Pictures")
      end
    end
  end

  def update_attachments(params)
    if params[:posting][:append_files].nil? ||params[:posting][:append_files] == '0'
      self.post_attachments.each(&:destroy) if self.post_attachments.present?
    end
    params[:post_attachment]['image'].each do |photo|
      if self.post_attachments(:reload).count < 10
        self.post_attachments.create!(:image => photo)
      else
        # note that a change, market postings can have 10, regular postings have 3
        errors.add(:base, "Maximum 10 Pictures")
      end
    end
  end
end