class CreatePostings < ActiveRecord::Migration
  def change
  	create_table "postings", force: :cascade do |t|
	    t.integer  "user_table_id",       limit: 8
	    t.integer  "address_id",          limit: 8
	    t.integer  "disabled",            limit: 2
	    t.string   "location_icon",       limit: 30
	    t.string   "types",               limit: 200
	    t.string   "posting_title",       limit: 30
	    t.string   "posting_description", limit: 1000
	    t.float    "posting_price",       limit: 24
	    t.string   "make",                limit: 50
	    t.string   "model",               limit: 30
	    t.string   "mileage",             limit: 20
	    t.datetime "created_at",                       null: false
	    t.datetime "updated_at",                       null: false
	    t.integer  "approved",            limit: 4
	    t.integer  "enable_sharing",      limit: 2
	    t.integer  "enterprise",          limit: 2
  	end

	  add_index "postings", ["address_id"], name: "address_id_ndx", using: :btree
	  add_index "postings", ["approved"], name: "approved_ndx", using: :btree
	  add_index "postings", ["disabled"], name: "disabled", using: :btree
	  #add_index "postings", ["posting_title"], name: "post_title_search", type: :fulltext
	  #add_index "postings", ["types"], name: "types_ndx", type: :fulltext
	  add_index "postings", ["user_table_id"], name: "user_table_id_ndx", using: :btree
  end
end
