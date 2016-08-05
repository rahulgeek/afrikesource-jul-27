class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
	    t.string   "userid",         limit: 20
	    t.string   "first_name",     limit: 30
	    t.string   "last_name",      limit: 30
	    t.string   "email",          limit: 50
	    t.string   "phone",          limit: 20
	    t.string   "address_1",      limit: 60
	    t.string   "city",           limit: 30
	    t.string   "state",          limit: 20
	    t.string   "zipcode_postal", limit: 20
	    t.string   "country",        limit: 30
	    t.string   "phone_type",     limit: 2
	    t.string   "contact_by",     limit: 10
	    t.string   "validation",     limit: 50
	    t.string   "password_hash",  limit: 256
	    t.integer  "status",         limit: 4
	    t.string   "level",          limit: 10
	    t.integer  "enterprise",     limit: 2
      	t.timestamps null: false
    end

  	add_index "users", ["email"], name: "email_ndx", using: :btree
  	add_index "users", ["phone"], name: "phone_ndx", using: :btree
  end
end
