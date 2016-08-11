class AddTtusToTransactionDetails < ActiveRecord::Migration
  def change
    add_column :transaction_details, :ttus, :string
  end
end
