# encoding: utf-8

class LogoUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
include CarrierWave::RMagick
  # include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
  storage :file
  after :remove, :delete_empty_upstream_dirs
  # storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    #"uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
    "uploads/logo/#{model.id}"
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  #
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Process files as they are uploaded:
  # process :scale => [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  # Create different versions of your uploaded files:
  # version :thumb do
  #   process :resize_to_fit => [50, 50]
  # end
  version :thumb do
    process :resize_to_limit => [100, 100]
  end
  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  # def extension_white_list
  #   %w(jpg jpeg gif png)
  # end
  def extension_white_list
    %w(jpg jpeg gif png)
  end
  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
def filename
  "#{secure_token}.#{file.extension}" if original_filename.present?
end

protected
def secure_token
  var = :"@#{mounted_as}_secure_token"
  model.instance_variable_get(var) or model.instance_variable_set(var, SecureRandom.uuid)
end
  #   "something.jpg" if original_filename
  # end
  #from carrierwave wiki How-to%3A-Make-a-fast-lookup-able-storage
def delete_empty_upstream_dirs
  path = ::File.expand_path(store_dir, root)
  Dir.delete(path) #fails if path not empty dir
  #path = ::File.expand_path(base_store_dir, root)
  #Dir.delete(path) #fails if path not empty dir
rescue SystemCallError
  true #
end
end
