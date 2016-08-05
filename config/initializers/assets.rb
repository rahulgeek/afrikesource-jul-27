# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
#Rails.application.assets_manifest.files.values.map{|v| v['logical_path']}

Rails.application.config.assets.precompile += %w( app.css )
Rails.application.config.assets.precompile += %w( IP_Master_PT_RTL.master.css )
Rails.application.config.assets.precompile += %w( home.css )
Rails.application.config.assets.precompile += %w( privacy.css )
Rails.application.config.assets.precompile += %w( terms.css )
Rails.application.config.assets.precompile += %w( jquery.mobile-1.4.5.min.css )
Rails.application.config.assets.precompile += %w( orange.css )
Rails.application.config.assets.precompile += %w( main.css )
Rails.application.config.assets.precompile += %w( tooltipster.css )
Rails.application.config.assets.precompile += %w( addLocation.js )
Rails.application.config.assets.precompile += %w( posting.css )

#the following will be removed from the asset pipeline to be integrated with requirejs.
Rails.application.config.assets.precompile += %w( application.js )
Rails.application.config.assets.precompile += %w( jquery.js )
Rails.application.config.assets.precompile += %w( jquery_ujs.js )
Rails.application.config.assets.precompile += %w( blueimp-gallery-all.js )
Rails.application.config.assets.precompile += %w( blueimp-gallery.js )
Rails.application.config.assets.precompile += %w( blueimp-gallery-fullscreen.js )
Rails.application.config.assets.precompile += %w( blueimp-gallery-indicator.js )
Rails.application.config.assets.precompile += %w( blueimp-gallery-video.js )
Rails.application.config.assets.precompile += %w( blueimp-gallery-vimeo.js )
Rails.application.config.assets.precompile += %w( blueimp-gallery-youtube.js )

Rails.application.config.assets.precompile += %w( jquery.ui.widget.js )
Rails.application.config.assets.precompile += %w( jquery.iframe-transport.js )
Rails.application.config.assets.precompile += %w( jquery.fileupload.js )
Rails.application.config.assets.precompile += %w( jquery.fileupload-process.js )
Rails.application.config.assets.precompile += %w( jquery.fileupload-ui.js )
Rails.application.config.assets.precompile += %w( jquery.fileupload-upload.js )
Rails.application.config.assets.precompile += %w( jquery.fileupload-validate.js )
Rails.application.config.assets.precompile += %w( jquery.fileupload-image.js )
Rails.application.config.assets.precompile += %w( jquery.ui.widget.js )
Rails.application.config.assets.precompile += %w( rails.validations.js )
