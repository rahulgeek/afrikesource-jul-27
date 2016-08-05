class CreatePostAttachments < ActiveRecord::Migration
  def change
    create_table :post_attachments do |t|
      t.integer :posting_id
      t.string :image

      t.timestamps null: false
    end
  end
end
