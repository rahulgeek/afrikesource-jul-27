class AddCurrencyCodeToTransactionDetails < ActiveRecord::Migration
  def change
    add_column :transaction_details, :currencyCode, :text
  end
end
