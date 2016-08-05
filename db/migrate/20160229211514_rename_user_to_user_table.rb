class RenameUserToUserTable < ActiveRecord::Migration
  def change
  	rename_table :users, :user_tables
  end
end
