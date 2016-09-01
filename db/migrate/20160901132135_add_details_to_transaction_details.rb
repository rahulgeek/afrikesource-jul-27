class AddDetailsToTransactionDetails < ActiveRecord::Migration
  def change
    add_column :transaction_details, :creditCardType, :text
    add_column :transaction_details, :id_type, :string
    add_column :transaction_details, :id_number, :text
    add_column :transaction_details, :issuing_authority, :string
    add_column :transaction_details, :reciepient_number, :text
    add_column :transaction_details, :creditCardNumber, :text
    add_column :transaction_details, :expMonth, :text
    add_column :transaction_details, :expYear, :text
    add_column :transaction_details, :cvv, :text
    add_column :transaction_details, :paymentAction, :text      
  end
end
