####
# database scheme
# # id int
# posting_id int
# image
# description
# created_at
# updated_at
class PostAttachment < ActiveRecord::Base
  include Rails.application.routes.url_helpers
  before_save :truncate_description
  mount_uploader :image, ImageUploader
  validate :post_attachment_count_within_limit, :on => :create

  belongs_to :posting

  def truncate_description
    if(!self.description.nil?)
      self.description = self.description.truncate(80)
    end
  end
  #if the posting is for an enterprise the limit is 3
  #personal basic 1, silver 5, gold 5, platinum 10
  #enterprise basic 5, silver 5, gold 10, platinum 10
  #urgent
  #bargains

  def post_attachment_count_within_limit
    if self.posting.enterprise == 1
      if self.posting.post_attachments(:reload).count >= 10
        errors.add(:base, "Maximum 10 Pictures")
      end
    else
      if self.posting.post_attachments(:reload).count >= 3
        errors.add(:base, "Maximum 3 Pictures ")
      end
    end
  end
  def to_jq_upload
    {
        "name" => read_attribute(:image),
        "size" => image.size,
        "url" => image.url,
        "thumbnail_url" => image.thumb.url,
        "delete_url" =>  post_attachments_path(:id => id),
        "delete_type" => "DELETE"
    }
  end
end
