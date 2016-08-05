class CreateTransports < ActiveRecord::Migration
  def change
    create_table :transports do |t|
      t.string :fromAddress
      t.string :toAddress
      t.datetime :date
      t.integer :space

      t.timestamps null: false
    end
  end
end
