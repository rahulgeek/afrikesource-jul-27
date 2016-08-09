class CreateTransactionDetails < ActiveRecord::Migration
  def change
    create_table :transaction_details do |t|
      t.integer :user_table_id
      t.float :credits
      t.string :transaction_id

      t.timestamps null: false
    end
  end
end
