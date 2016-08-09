# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160809133837) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "addresses", force: :cascade do |t|
    t.string   "address_1",      limit: 80
    t.string   "address_2",      limit: 50
    t.string   "city",           limit: 20
    t.string   "state",          limit: 20
    t.string   "zipcode_postal", limit: 20
    t.string   "country",        limit: 20
    t.integer  "user_id",        limit: 8
    t.string   "hiacode",        limit: 50
    t.float    "lat"
    t.float    "lng"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "addresses", ["lat"], name: "lat_ndx", using: :btree
  add_index "addresses", ["lng"], name: "lng_ndx", using: :btree

  create_table "post_attachments", force: :cascade do |t|
    t.integer  "posting_id"
    t.string   "image"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "postings", force: :cascade do |t|
    t.integer  "user_table_id",       limit: 8
    t.integer  "address_id",          limit: 8
    t.integer  "disabled",            limit: 2
    t.string   "location_icon",       limit: 30
    t.string   "types",               limit: 200
    t.string   "posting_title",       limit: 30
    t.string   "posting_description", limit: 1000
    t.float    "posting_price"
    t.string   "make",                limit: 50
    t.string   "model",               limit: 30
    t.string   "mileage",             limit: 20
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.integer  "approved"
    t.integer  "enable_sharing",      limit: 2
    t.integer  "enterprise",          limit: 2
  end

  add_index "postings", ["address_id"], name: "address_id_ndx", using: :btree
  add_index "postings", ["approved"], name: "approved_ndx", using: :btree
  add_index "postings", ["disabled"], name: "disabled", using: :btree
  add_index "postings", ["user_table_id"], name: "user_table_id_ndx", using: :btree

  create_table "transaction_details", force: :cascade do |t|
    t.integer  "user_table_id"
    t.float    "credits"
    t.string   "transaction_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "transports", force: :cascade do |t|
    t.string   "fromAddress"
    t.string   "toAddress"
    t.datetime "date"
    t.integer  "space"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "user_tables", force: :cascade do |t|
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
    t.integer  "status"
    t.string   "level",          limit: 10
    t.integer  "enterprise",     limit: 2
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  add_index "user_tables", ["email"], name: "email_ndx", using: :btree
  add_index "user_tables", ["phone"], name: "phone_ndx", using: :btree

end
