class CreateAddresses < ActiveRecord::Migration
  def change
    create_table :addresses do |t|
	    t.string   "address_1",      limit: 80
	    t.string   "address_2",      limit: 50
	    t.string   "city",           limit: 20
	    t.string   "state",          limit: 20
	    t.string   "zipcode_postal", limit: 20
	    t.string   "country",        limit: 20
	    t.integer  "user_id",        limit: 8
	    t.string   "hiacode",        limit: 50
	    t.float    "lat",            limit: 53
	    t.float    "lng",            limit: 53
	    t.timestamps null: false
  	end

  	add_index "addresses", ["lat"], name: "lat_ndx", using: :btree
  	add_index "addresses", ["lng"], name: "lng_ndx", using: :btree
  end
end
