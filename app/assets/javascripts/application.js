/*! concat hiamaps 2016-03-28 15:45 */
//= require jquery.js
//= require jquery_ujs.js
//= require rails.validations
//= require wice_grid.js
/**@preserve
 * @author Allan Lee
 * Copyright 2014, 2015 Cidea Inc.  All Rights Reserved
 */
var displayInfo={};
displayInfo.windowedMode=true;
require(['jquery','underscore'], function($, _){
    if($(".pages").length>0) {
        $(document).bind("mobileinit", function () {
            $.mobile.defaultPageTransition = 'none';
            $.mobile.defaultDialogTransition = 'none';
            $.mobile.ajaxEnabled = false;
            $.mobile.useFastClick = true;
        });
        require(['app', 'afrike_init'], function (App, af) {
            displayInfo.windowedMode = true;
            console.log('calling jssor');

            af;
            App;
        });
    }
});

