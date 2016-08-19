Rails.application.routes.draw do
  delete 'transports/:id' => 'transports#delete', as: 'delete_transports'
  resources :transports
  get 'pages/show'
  get 'pages/orange'
  get 'pages/about'
  get 'pages/terms'
  get 'pages/market'
  get 'pages/events'
  get 'pages/refund'
  get 'pages/privacy'
  get 'save_credits'=> 'pages#save_credits'
  post 'paypal_pro'=> 'pages#paypal_pro'

  scope "(:locale)", locale: /[a-zA-Z]{2}/ do
    get "change_lang/:lang" => "users#change_lang", :as => "change_lang"
  end
  post 'post_attachments/:id' => 'post_attachments#uploadImage', as: 'upload_image_posts'
  get 'post_attachment/retrieveImages/:id' => 'post_attachments#retrieveImages', as: 'retrieve_images'
  resources :post_attachments
  resources :user_table

  post 'admin/approve_posting/:id' => 'admin#approvePosting', as: 'admin_approve_posting'
  get 'admin/list_postings'
  get 'admin/list_pending'
  post 'admin/delete_posting/:id' => 'admin#deletePosting', as: 'admin_delete_posting'
  post 'admin/disable_posting/:id' => 'admin#disablePosting', as: 'admin_disable_posting'

  patch 'login/createUser' => 'login#createUser', as: 'createUser'
  post 'login/authorize' => 'login#authorize', as: 'authorize_user'
  get 'login/validate/:id/:validate' => 'login#validate', as: 'validate_email'
  post 'login/forgot' => 'login#forgot', as: 'login_forgot'
  get 'login/forgot_form' => 'login#forgot_form', as: 'login_forgot_form'
  get 'login/logout' => 'login#logout', as: 'logout'
  get 'login/sign_up' => 'login#sign_up', as: 'login_sign_up'
  get 'login/welcome' => 'login#welcome', as: 'login_welcome'
  resources :login

  get 'postings/selectTypes' => 'postings#selectTypes', as: 'posting_types'
  get 'postings/editBody/:id' => 'postings#editBody', as: 'posting_edit_body'
  post 'postings/updateBody/:id' => 'postings#updateBody', as: 'posting_update_body'
  get 'postings/newTransport' => 'postings#newTransport', as: 'posting_new_transport'
  post 'postings/createTransport' => 'postings#createTransport', as: 'posting_create_transport'
  get 'postings/newBody' => 'postings#newBody', as: 'posting_body'
  post 'postings/createBody' => 'postings#createBody', as: 'posting_create_body'
  get 'postings/newType' => 'postings#newTypes', as: 'posting_new_type'
  post 'postings/createType' => 'postings#createTypes', as: 'posting_create_type'
  get 'postings/editBody/:id' => 'postings#editTypes', as: 'posting_edit_type'
  get 'postings/editTransport/:id' => 'postings#editTransport', as: 'posting_edit_transport'
  post 'postings/updateTransport/:id' => 'postings#updateTransport', as: 'posting_update_transport_type'
  post 'postings/updateType/:id' => 'postings#updateTypes', as: 'posting_update_type'
  get 'postings/newAddress/:id' => 'postings#newAddress', as: 'posting_new_address'
  post 'postings/createAddress/:id' => 'postings#createAddress', as: 'posting_create_address'
  get  'postings/editAddress/:id' => 'postings#editAddress', as: 'posting_edit_address'
  post 'postings/editAddress/:id' => 'postings#updateAddress', as: 'posting_update_address'
  get  'postings/showAddress/:id' => 'postings#showAddress', as: 'posting_show_address'
  get 'postings/record_not_found'
  get 'posting/showMarket/:id' => 'postings#showMarket', as: 'posting_show_market'
  get 'posting/showEvent/:id' => 'postings#showEvent', as: 'posting_show_event'
  get 'postings/showhcode/:id' => 'postings#showhcode', as: 'postings_showhcode_path'
  get 'postings/not_market_business' => 'postings#notMarketBusiness', as: 'not_market_business'
  get 'postings/editImages/:id' => 'postings#editImages', as: 'posting_edit_images'
  get 'postings/uploadImage/:id' => 'postings#uploadImage', as: 'posting_upload_image'
  get 'postings/uploadImage' => 'postings#uploadImage', as: 'posting_upload_image2'
  delete 'posting/:id' => 'postings#delete', as: 'delete_posting'
  get 'postings/urgent' => 'postings#urgent', as: 'postings_urgent'
  get 'postings/newPackage' => 'postings#newPackage', as: 'postings_new_metal'
  resources :postings
  root 'pages#show'
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
