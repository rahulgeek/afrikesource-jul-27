/**
 * Created by telhar on 3/2/16.
 * http://brandonhilkert.com/blog/organizing-javascript-in-rails-application-with-turbolinks/
 *
 * to be converted to requirejs-rails.. use require and lod the module when needed, rather than
 * always in the asset pipeline
 *
 * Must be removed from asset.rb and added to requirejs.yml in the modules section
 * header must be encapsulated to include jquery and google maps?
 */
var test = 0;
var draggable = true;//fixed means the marker doesn't move
require(['jquery'], function ($) {
    var _lat = 14.669538;
    var _lng = -17.432041;
    var markera = "data:image/png;base64,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";
    var initialize=false;
    var map = new google.maps.Map(document.getElementById('googlemaps'), {
        center: {lat: _lat, lng: _lng}, //new york?
        zoom: 14
    });
    var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
//    $(document).on('page:change', function () { //$(document).ready(function(){
        console.log('testing load');
        if ($(".postings.editAddress").length > 0 && test === 0) {
            console.log('initialize editAddress');
            test = 1;
            initMap();
        }
        if ($(".postings.newAddress").length > 0 && test === 0) {
            console.log('initialize newAddress');
            test = 1;
            initMap();
        }
        if ($(".transports.new").length > 0 && test === 0) {
            console.log('initialize1 transport new');
            test = 1;
            initMap();
        }
        if ($(".transports.edit").length > 0 && test === 0) {
            console.log('initialize transport edit');
            test = 1;
            initMap();
        }
        if ($(".transports.show").length > 0 && test === 0) {
            console.log('initialize show');
            test = 1;
            if($(".show").length >0) {
                draggable = false;
                console.log('draggable false');
            }
            initMap();
        }
    if ($(".showAddress").length > 0 && test === 0) {
        console.log('initialize showAddress');
        test = 1;
        if($(".showAddress").length >0) {
            draggable = false;
            console.log('draggable false');
        }
        initMap();
    }    

  //  });

    console.log('initialize');


    if(test!==1) {
        console.log('not initalized');
        initMap();
        test = 1;
    }else {
        console.log('already initialized');
    }
    var infoWindow;
    function initMap() {

        var isFireFox = typeof InstallTrigger !== 'undefined'; 
        var lat, lng;
        if(isFirefox === true){
	console.log('firefox detected');
            setTimeout(function(){
                console.log('firefox timout');
                if(initialize===false)
                    locateMarkerAt(_lat,_lng);
            },3000);
        }
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                locateMarkerAt(lat,lng);

            }, function () {
                console.log("Location not found");
                locateMarkerAt(_lat,_lng);

                //handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            console.log("browser doesn't have locator");
            locateMarkerAt(_lat,_lng);
            //handleLocationError(false, infoWindow, map.getCenter());
        }

    }
    function locateMarkerAt(lat,lng) {
        var pos;
        var valuelat = parseFloat($('#address_lat').val());
        var valuelng = parseFloat($('#address_lng').val());
        var marker;
        initialize=true;
        console.log('lat:' + valuelat + ' lng: ' + valuelng);
        //
        //see if there are stored values from the database that populated address_lat and address_lng
        //
        if ((valuelat === 0 || valuelng === 0) || !(isNaN(valuelat) && isNaN(valuelng))) {
            lat = valuelat;
            lng = valuelng;

        } else {
            console.log('Database set no values, using'+lat+':'+lng);
        }
        $('#address_lat').val(lat);
        $('#address_lng').val(lng);
        marker = new google.maps.Marker({
            position: {
                lat: lat,
                lng: lng
            },
            map: map,
            icon: markera,
            draggable: draggable
        });
        google.maps.event.addListener(marker, "dragend", function () {
            var point = marker.getPosition();
            lat = point.lat();
            lng = point.lng();
            console.log('update marker'+lat+':'+lng);
            $('#address_lat').val(lat);
            $('#address_lng').val(lng);
        });
        pos = {
            lat: lat,
            lng: lng
        };
        /*
         infoWindow.setPosition(pos);
         infoWindow.setContent('Location found.');*/
        map.setCenter(pos);
        google.maps.event.addListener(map, 'click', function (event) {
            //alert( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() );
            lat = event.latLng.lat();
            lng = event.latLng.lng();
            marker.setPosition({lat: lat, lng: lng});
            $('#address_lat').val(lat);
            $('#address_lng').val(lng);
            console.log('update');
        });

    }
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }
});
