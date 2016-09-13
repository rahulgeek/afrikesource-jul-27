class RenameColumnInUserTables < ActiveRecord::Migration
  def change
  	rename_column :user_tables, :address_1, :street
  end
end
