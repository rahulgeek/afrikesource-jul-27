/*! concat hiamaps 2016-03-28 15:45 */
/* global device, google, plugin, _, moment, cordova */

/**@preserve
 * @author Allan Lee
 * Copyright 2014, 2015 Cidea Inc.  All Rights Reserved
 */
//if there's an address in the textfield, convert that to a lat/lng and pass it to googlemaps.

//var myCenter=new google.maps.LatLng(51.508742,-0.120850);
//following centered on astoria, need to get this from the start address...
//starting location is time square
//
var map, gmap;
require(['moment',
    'async!https://maps.googleapis.com/maps/api/js?v=3.22?key=AIzaSyAim9hgtYAZ6YGOabhLc3rVvcjGYwpU3cc&libraries=places,geometry&callback=google_ready',
    'jquery',
    'jquery-mobile',
    'tooltipster',
    'scrollto',
    'noUiSlider',
    'aSimpleTour',
    'markers',
    'datebox',
    'hmenu',
    'underscore',
    'favorite',
    'afrike_init'

],function(moment, gmaps,  $, jqm, tooltipster, scrollTo, noUiSlider, aSimpleTour, mark,
datebox, hmenu, _,  favorite, localinit){
window.app=$(this);

var marker = new mark();
var specialdinner = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAJOjAACTowHRsvDGAAAAB3RJTUUH3wYSACQOTLyiTwAAAQpJREFUWMNjYBhgwEiK4h9ruf8Tq5Yj+Csj1RxAisWkOoSRlpYT4wgmfBbjs3zTyT9YxS89+EuSWUzE+Pri/b8MHMFfGW4++cfAEfyVgYGBgSGs6ye6Lxk4gr8ymBX/gKshJjSZiAlCNSkmmuUCJlrEOSlpiomelmOzh6SwXXoQe8IrmvuT8oIIn++///zPIBj1DZtP4AkQlxyh7ElUCPz+y0C/RIgN8HExDqwDsAUpMUFMVQcMeAiMOmBQO+DHWm6yE+VoFAweBxBqu737TN2KEmYf0SHAwkyHKMAXCh++/qe677GGAC5HPH37n+qWkxQFlhq0iQNGWvYHiAndAe+YDP6uGa07pwMOABE5dwajNHmZAAAAAElFTkSuQmCC';
var specialdrink = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAJOjAACTowHRsvDGAAAAB3RJTUUH3wgZAQccaF/3MQAAA9VJREFUWMPNl1tsVFUUhr+1zz5nph3GQqvBosZAQxoNoogv3sXYenkglAbrJT401lBSEg0iUVQgGo0vPmhosRKj1iCRpvGSUBEvD5IGNQaSEoHEIDUgcYyj1aE4c27bh6F02mk7M7VNXcnOedj77H/ttf/1r7Vhlk1KWZzuiZli10Ybh2TaHCgFuFRHZCbBi3FCzxRwYtCw5pU0tZcrEl3lpiIm4zqiJgP3A1PyMMZwMhHy2PYM358IufoKwdETH2rcCLie4djpkKOnDGFYfCBEBC8wfPRNwP7DAbcvUSyoVJxMGBYvAFtLcYTr3Ro1VXEM/Lchkv3OnyvmixejJt0TM2OjoMeCB4HhwA8ByRTEorC8RlEWEXw/PxKWJWgLghB++jXkxzOGeBlcu1BRUS78dc5w6ERIYtBw8HjAjbUKyxLSPTEzzAedH0aoqc6GyragfplF8102EQ1eMLIuYkMyZUgMGv48a3j1Q48zfxieXGXTUm9jKejc59E/EAKw6FKFyCRpmBuaZMrw0h6Xjl6fSy6CZ5scWuo02hrZ4chAyM79HkdPhQyl4ZdkyKbVDuvu1SgFHb0+L3e7JFOwYZXNptU2c2OSl57jkrAqLjx3v4MItO/12brLxVLQUqcREX7/2/D8LpfPDgeY827fsUSx9h6NZQkdvR7bdruk/oGNDTYbG/LBC+pAZVzY0uQgwPa9Ppvedona8MgKm/6BkIPHR8CVgupKwdbCO196PNPlkvGy4E832swpm5j9erKMqIgJm9c4BCHs+NSn7Q0XEVg4XzGUyeGDhqZbNG997vH4Thc/gCdW2jzVMDn4hBwYa8mUYXOXy7tf+cSisO1BBz8wdPcFXBwXWuo1A78ZtrzvknZh7d2aFx52qIhJQYmWYqXXDwzNr2Xo7gsQgR3rHBpv0iiB3V/7rO90AXi0TtPeGim6RuhiVU5bwnsbovhBmo+/C2jtcKmeJ2Q8WN/poi146LbiwUu6glzzfEPz6xk++TbA9c+fxMlyoLMtUnKVVKVWOVsLb7ZFuHOpdSED7ltu0d7qTKlqqqn8VB4Rbr5KYeusWq5Yao0SqRl3ALigAQBhOPW+QTHLpkptIqfLhvGmHIHcyiYyTVdQKAphONIhjeKAyZ8vtkmVQg1pEBj2HQro7vM5l8meNupky/Gx0wYRuOZKRe1lWVEyJtvIPHCrpu46C6Vk0g65oBImz8KePp8PDgQolc98Y6B/IOTIz6PnLCXcsNiiKj6FLMj1snIOXL/IIupkNx4eY1Mydy4WhWU1inmxwu+DWX+Y/P+fZjP9OJ11+xd5k9cmTGeWGAAAAABJRU5ErkJggg==';
var specialmusic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAJOjAACTowHRsvDGAAAAB3RJTUUH3wYSACs0DShnMgAAAcxJREFUWMPtVz1PAkEQfbucQO4SpIESpEZCBx1+FDYGG78aNbGXSo2NmthhQicFBdEfYGgMFrZaqRUYLWg4Wm3O4hTBu7MwF4VwcHeyQOGUu5t9b97M7OwAQzZi5XC9IGhmz7oXZdI3AlaArRIhLMHNkCB2gEtVBbtnDVw/qgCARJgi6KdIhCmSMQ5egZgmQux4vZSuo3ivGO5vzXPYX3V2JNJOgtqR9FXuHpXs5Sfi2+8Qn9Wed1EWMQeA2ouGleMPSG1k2++nLMB1K4sqTorNriGmfwUJ+AgCPuNiynYg0FEBu96vz3Co5HjUCwJuM26sTXOt+fL2XTVGKtB+Sh4NOZBPuXB15IaH/1mXZAtJ2A+bmnSgkuMRCVLrVdAv8woE+ZSzRYmBEtBDktl0Iug3TlKOdbvdmB0bngJm7J9AzxyQZA3ZYhMXdwrKoopxfoAEJFnD3GEdZVFtedkGFoLldCs40xxo/yiUqgpuntiB63jUWP4hVMFvFbyCyddugtr2vqMC+mY05Oja5wEgEqRYiHO2wXsm4fmey7CZeHggn3Kym4z0D4Mka9g5baBUVfFQUxHwESRjDhwY/HqtzgejO5iMzGjGejgdun0BUDGoDoa9kcoAAAAASUVORK5CYII=';
var specialjazz = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAJOjAACTowHRsvDGAAAAB3RJTUUH3wYSACwNHWx5/QAAAbtJREFUWMPtVy1MQlEU/t594J6PDS0S5VlFpUmCacGiFOcsGjSYNEtwOEWD04bOYKPBsAAGDW5EIKEEG9LcLBhwT+CCwfEc+Bjvj5/g1+69Z/f77jn33nMOMGAwaozFW0tDqS23WmYME6CGWK0QppfkSkQweolzBYqTaBWJDAUArMyzON8agWAjioQwesm9AREfn63zYzzwcMzBOcV2FUH0uDaUrEnkGwsmvIV5vFyPwu1g4Q2IWDsTu+5BtJ4+lad4eq1L44N1M8YtDAQbQczPIbrPYU4gXb3LaCEPRio4jVbbN9Z0MTWFwCkQwz4iouW5+Vwm3B9xuoibfJqOEoxUsHQoGuuBgYdADYwIgS4B/yHwuUyq330nmNQYx9M1JLIUuUIdN7sj/REQfqwikaVStmv++3KJpicC4hmKZJa2zNltTP/uQMzPoZcgGDCI2iLSKOjKhqVyA6k8NT4EnbwwOdE6fXVXw87llzR2TxNNp5f1gJyIzcW/j6X4/pu9PTOsJnLFIdhbNmPWLm9q5X/WDe+M2guUUrmBULKKeJriuViHlQc8DhYX2/IluNL+YHgbk6FpzXrdnA4c35wtqJo6qXT5AAAAAElFTkSuQmCC';
var specialcomedy = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAJOjAACTowHRsvDGAAAAB3RJTUUH3wYSAC8qk0ufVQAAAw1JREFUWMPNVz9ME1EY/93rtUXOaBdu5I61UuoCTgXKwAKyKO1SGDC6VBwMigl/YoKDGJzQhRBJwEUJi7KRWK0TOlXofC1ju4BJy5Vydw5He3ft0d4VEL6k6eXlvff93vt+3+/7HnDJRtmZLG4witW5Tfdy1LkBsOPYLhDqIp1bAUFdpGMrQIjJvNvrk27LzlMZGWuxYsMcok3mvRyeLwAooIMn8DA4+dfAJ1IyDnIKEoKMg7w61tpC0NPuOHsW+Dii7KRl2xstRV0Y7XPaDgWpvKJGnANAOqs0lM7ksoWI1CLI9kITxA0Gg53G2H5+7oa4wSA6QDfsuOSvaofWFgp7J9f5M6mSjGeNVPFcpxBPSthJaeHSk9SOVQHo4An2shIAYGLlyHRR/6wIs3UJQYK/zYFURi4fIp2RkRBkfP0lIRKkMRN21QbQ0+7A5m/J1iluNAMeBrgzIdacF9+VgHAdIbrbZYx3dIBGwEsMzqZCTvg4bWyoi8Zq7Lgu0D8puX4IeJYg0kvj43d1Qz9P8HbMXbVwLZYvf48EaTx8V6gL4CBfIwv0Nh3WBKUERG8/dqVyjCO9NDiWwkjQeJbBTgemQk5EemlraVh5C0tRlSzxpIzheREJQcJ+TsFarIjQvFhSTSyMucCzBEMVoaMoYCbswsKYyxC+U6XYTAdWvxXx6L15Jvg4gg9P3HiwWICHgaEu6DMjndHGA16CrblrBkmueT+jfU50tzvw6lMRCUFGOivDzxOMBGlwLMH912KVBPs4gnRWxt98Nek62kh9EpqFY3m8moSdTw8Nzn0cwfoLN3hWdbK4WcSzCh0Z6qKtccCKjfYZN9M7B4DxQSMBW1so03JN7DaR+tQrkSrgJeBZVQnjSfW3n1PQfUsDNB1ympbkhquJh6Gw/NiN0JsC9rIK+mcPEU9qMb/ZDPhPYh7wklN7BeqsvWCtTClxY2uuyVCs9LdNnUdD+mX7GBMrR2Vx0sv4TNh1qvNzA1DuFQUJCUEGxxL424hpibYE4H+25Vf3YXJlnmYX/Ti9dPsH18AzVBU3UtMAAAAASUVORK5CYII=';
var bookmark = "data:image/png;base64,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";

    if( window._lat === undefined) {
        console.log('lat undefined');
        var _lat = 40.759011000000000000;
        var _lng = -73.984472200000030000;

    }else {
        var _lat = window._lat;
        var _lng = window._lng;
    }
var advanced_mode = true, more_screen = true, smart=0;
var infowindow;



var counter = 0;
////new google.maps.LatLng(40.774473, -73.909464);
var marker;
map = null, gmap = null; //map that is in use gmap is google map for platform===2
var startingLocation1 = null, startingLocation2 = null, miniLocation = [];
var markers = []; //is this really used?
var routeDetails1, routeDetails2; // should this be global?

//polylineroute1 and polylineroute2 is used to hold the polyline innformation
//this is stored inrouteDetails1 and routeDetails2.polyline as well
var polylineRoute1 = [], polylineRoute2 = [];
var circlesOn = 0;
var stepDisplay;//this was used for directional instruction on routes
var stepMarkerArray = [];
var venueArray = []; //for the venue markers?
//phonegap plugin doesn't support this yet
var directionsService;// = new google.maps.DirectionsService();
//this should be objectified

var venueDetails = [];
var permanentMarkers = [];
var touristData = [];
var selectedRoute; //indicates if A or B is chosen
//var deviceWidth, deviceHeight; moved to an attribute of displayInfo
var platform = 0;
var screenHistory = [];
var screenMax = 10;

displayInfo.travelMode=  ''; //used to store the mode of travel for A & B
displayInfo.eventLocationId = null;
displayInfo.defaultZoom = 15;
displayInfo.currentDisplayDiv = ""; //what is the current window
displayInfo.previousDisplayDiv = "";
displayInfo.mapDisplay = true;
displayInfo.clusterIncrement=25;

displayInfo.venueUiPanel = false; //false then in widescreen/tablet view
displayInfo.portrait = false; //false then in widescreen/tablet view
displayInfo.retrievedStartingLocation = 0; //flag to tell if the geolocation was retrieved//
//currentLocation is suppose to be in the native Web or Platform location, this must be changed if platform==2
displayInfo.currentLocation;// = new google.maps.LatLng(_lat, _lng);//
displayInfo.startingLocation = displayInfo.currentLocation;
displayInfo.venueUiDiv = null;
displayInfo.bounds = null;
displayInfo.staticMode=false;
displayInfo.start=null;
displayInfo.staticZoom=false;
displayInfo.openZoomId=null;
displayInfo.pluginCounter=0;
displayInfo.searchFlag=false;
/******
* initialization constants to be moved to their own file

displayInfo.ajaxFlag=false;
displayInfo.windowedMode=true;
displayInfo.popupMenuDisplay=false;
*/

/*****************************
* backgroundSearch will search for subscribers
* windowedMode is for licencee who are using the map on their page
* popupMenuDisplay is to enable the popupMenu
* favoriteProcessing is to enable favorites in the app
*/
displayInfo.panelWidth=400;
//
//platformmarkers to be removed
var platformMarkers = true; //0 is browser 2 is phonegap 1 mobile browser?

var googleMapFullName = "googleMap";
var GoogleMapDiv = $("#"+googleMapFullName);//null;
//in main version it's content-div
displayInfo.googleMapParent = "#control-div";
//the following is particular to webydo
displayInfo.googlePackParent = "#control-div";

var venueDetailsUi = '#venue-details-ui';
var venueUi = '#venue-ui';

displayInfo.midlocation = null; //latLng of midpoint
//venueSearchStatus indicates whether searching is ongoing
// if so, it has to be stop (stopSearch=true)
// and then venueSearch can continue
var stopSearchFlag = false;
var venueSearchStatus = false;
var venueSearchFlag = false;
var lastKnownLocation = displayInfo.currentLocation;
var searchCirclePrimative;

var inviteCode = null;



var eventObject = {};//used for drag and drop, not working now
var devurl = "https://localhost:8080/Invite.php";
var devurl = "http://php-allanlee.rhcloud.com/Invite.php";
var getInviteUrl = "https://www.loolmaps.com/getinvite.php";
var getBlocksUrl = "https://www.loolmaps.com/getblocks.php";
var createInviteUrl = "https://www.loolmaps.com/createinvite.php";
var UserUrl = "https://www.hiamaps.com/user.php";
//var UserUrl = "http://localhost/user.php";
var favoriteUrl = 'http://www.hiamaps.com/favorites.php';
var yelpQuery = "https://www.loolmaps.com/phone.php";
var vendorIconPath = "https://www.hiamaps.com/public/";
var venueDataUrl =  "https://www.loolmaps.com/venueData.php";
//var mapSearchUrl = "https://www.loolmaps.com/mapSearch.php";
var postingHost = "http://ec2-54-164-25-8.compute-1.amazonaws.com";
//var postingHost = "http://192.168.1.124:80"
//var postingHost = "http://localhost";
var mapSearchUrl = postingHost+"/postSearch.php";
var tierSearchUrl = 'https://www.loolmaps.com/tier.php';
var postingPicturePath = "/pictures/posting/";
var yellowMarkerMove = false;
var yellow = $('#yellowDrag')[0];
var navigateFlag = false;
//searchFlag is used by aroundMe... if set then it searches
var searchFlag = false;
var where = {};
var bookmarkObject = null;

var hmenu_instance, localinit_instance;
    var favorite_instance;
var marker_calls = {
    dimAllMarkers: dimAllMarkers,
    activeAllMarkers: activeAllMarkers,
    updateStart1: updateStart1,
    updateStart2: updateStart2,
    eventObject: eventObject,
    startingLocation1: startingLocation1,
    startingLocation2: startingLocation2,
    clearVenues: clearVenues,
    resetMapItems: resetMapItems,
    closeWindows: closeWindows,

    gasSearch: gasSearch,
    barSearch: barSearch,
    atmSearch: atmSearch,
    restaurantSearch: restaurantSearch,
    openInviteScreen: openInviteScreen,

    getClusterData: getClusterData,
    getUserSelect: getUserSelect,
    buildFavoritesPopup: buildFavoritesPopup,
    updatePopupMenu: updatePopupMenu,
    getDeviceHeight: getDeviceHeight,
    findVenue: findVenue,

    aroundMe: aroundMe,
    popupMenuMarkerDisplay: popupMenuMarkerDisplay,
    ajaxKeyWordSearch: ajaxKeyWordSearch,
    processClusterData: processClusterData
};

function navigate(flag) {
    if(flag)
        navigateFlag=1;
    if (startingLocation1.googlePosition !== null && startingLocation2.googlePosition !== null) {
        if(!navigateFlag){
            navigateFlag = 1;
        }
        //navigate is called when the markerObject.setPosition is called
        //when the travel mode is changed and by the popupMenu
        calculateRoute();
    }
}
function turnByTurn(){
    //if both of these are null then it's not possible to navigate?
    if(startingLocation1.googlePosition!==null && startingLocation1.googlePosition!==null){
            var travelMode = $('input[name="travel-mode1"]:checked').val();
        if(platform===2){

            plugin.google.maps.external.launchNavigation({
                "from": startingLocation1.googlePosition,
                "to": startingLocation2.googlePosition,
                "mode": travelMode
            });
        }else{
            var string;
            //on iOS use app maps otherwise go to google
            //maybe want to do it also on macos?
            if (displayInfo.derivedOS==="iOS") {
                string="https://maps.apple.com/?saddr="+startingLocation1.googlePosition+"&daddr="+startingLocation2.googlePosition;
            }else
                string="https://maps.google.com/maps?saddr="+startingLocation1.googlePosition+"&daddr="+startingLocation2.googlePosition+"&mode="+travelMode;
            window.location.href = string;
            //should be google.navigation:q:lat,lng
            //mode d driving w walking b bicycling &mode=d
            //google.navigation:q=lat,lng&mode=b
        }
    }
}
function routeNavigate(args) {
    var from, to;
    var mode=displayInfo.travelMode;
    if (displayInfo.routeType === 'A') {

        if (navigateFlag === 1) {// its starting1 to starting2
            from=startingLocation1.googlePosition;
            to=startingLocation2.googlePosition;
            //code
        }else{//starting1 to midpoint
            from=startingLocation1.googlePosition;
            to=displayInfo.midlocation;
        }
        //this is startingLocation1 to either startingLocation2 or midlocation
        //code
    }else{//this is startingLocation2 to midlocation
        from=startingLocation2.googlePosition;
        to=displayInfo.midlocation;
    }
    if(platform===2){
        plugin.google.maps.external.launchNavigation({
            "from": from,
            "to": to,
            "mode": mode
        });
    }else{
        var string="https://maps.google.com/maps?saddr="+from+"&daddr="+to+"&mode="+mode;
        window.location.href = string;
            //should be google.navigation:q:lat,lng
            //mode d driving w walking b bicycling &mode=d
            //google.navigation:q=lat,lng&mode=b
    }
    //code
}
/*********
 * this will open the event screen and populate a few things
 * .. have to find out why the input field on android isn't allowing input
 *
 * 08/30/2013 - modifications to allow the create of non-place_id events which
 * will come from bookmarks.  The fields that must be sent up in the event
 * object can be seen in closeEventDetails().  both will look in venueDetails to load
 * the event object which won't exist in this case.  Note the displayInfo.eventLocationId is used
 * for this search.
 *
 * eventObject.name (see here) (Bookmarked location)
 * eventObject.place_id
 * eventObject.formatted_address
 * eventObject.origin (note that it is hardcoded atm)
 * eventObject.geometry.location.latLng
 *
 * @param {type} object given by bookmark routines
 * @returns {undefined}
 */
function createEventDetails(object) {
    closeWindows('#event-ui');
    if (object === undefined || object === null)
        eventObject = _.find(venueDetails, function (object) {
            return object.place_id === displayInfo.eventLocationId;
        });
    else
        eventObject = object;
    $('#eventLocation').text(eventObject.name);
    $("#eventTime").val(moment().format("hh:mm A"));

    if (displayInfo.selector === null || displayInfo.selector === 'null') {
        $('#eventLoginButton').removeClass('ui-disabled');
        $('#createEventButton').addClass('ui-disabled');
    } else {
        $('#eventLoginButton').addClass('ui-disabled');
        $('#createEventButton').removeClass('ui-disabled');
    }
}

function callVenueNavigate(args){
    if(displayInfo.narrow===true){
        var retval=closeWindows();
        retval.done(function(){
            venueNavigate(args);
        });
    }else
        venueNavigate(args);
}
function findVenue(object){
    var eventObject = _.find(venueDetails, function (object) {
        return object.place_id === displayInfo.eventLocationId;
    });
    return eventObject;
}

/****************************
 * venueNavigate will create route information from the starting location to the current
 * venue.
 *
 */
function venueNavigate() {
    //code
    var eventObject = _.find(venueDetails, function (object) {
        return object.place_id === displayInfo.eventLocationId;
    });
    navigateFlag = 1;
    var gposition = eventObject.geometry.location;
    var position;
    //problem with synchronization with _handeInviteCode
    eventObject.placeId=eventObject.place_id;
    eventObject.placeName=eventObject.name;
    _setupStartingLocation2wPlaceObject(eventObject,gposition);
    updateSearchBox(gposition, '#startInput2');
    //this will calculate route
    if(platform===2){
        position=convert2pluglatLng(gposition);
        startingLocation2.setPosition(position,true,true);
    }else
        startingLocation2.setPosition(gposition,true,true);
}
function inviteLogin() {
    closeWindows('#loginPage');
}
function openInviteScreen() {
    if (displayInfo.eventInformation !== undefined && displayInfo.eventInformation !== null) {
        displayEvent();
        closeWindows('#displayInviteData');
    } else
        closeWindows('#hInviteCodeScreen');
}
function getDirections() {
    openWebPage();
}
function quickSearchPreCall() {
    clearCheckedTypes();
    var oldPosition;
    if (displayInfo.midlocation === null)
        oldPosition = startingLocation1.googlePosition;
    else
        oldPosition = displayInfo.midlocation;// startingLocation1.googlePosition;
    lastKnownLocation = oldPosition;
}
function restaurantSearch(type) {
    quickSearchPreCall();
//    $('#google-type-bar').prop('checked', true).checkboxradio('refresh');
//    $('#google-type-cafe').prop('checked', true).checkboxradio('refresh');
    $('#google-type-restaurant').prop('checked', true);//.checkboxradio('refresh');
    aroundMe(type);
}
function barSearch(type) {
    quickSearchPreCall();
    $('#google-type-bar').prop('checked', true);//.checkboxradio('refresh');
    aroundMe(type);
}
function atmSearch(type) {
    quickSearchPreCall();
    $('#google-type-atm').prop('checked', true);//.checkboxradio('refresh');
    aroundMe(type);
}
function gasSearch(type) {
    quickSearchPreCall();
    $('#google-type-gas-station').prop('checked', true);//.checkboxradio('refresh');
    aroundMe(type);
}
function clearCheckedTypes() {
    $(".googletype").each(function () {
       // $(this).prop('checked', false).checkboxradio('refresh');
    });
}
/*****
 * handleSearchTypes() will be given a google or location table type and search
 * for those venues.  Note only used in _handleInviteCode
 * @param {type} searchType - is based on google types (atm, restaurant, etc)
 * @param {type} type - is not currently used
 */
function handleSearchTypes(searchType, type){
    quickSearchPreCall();
    string = $("#google-type-"+searchType).prop('checked', true);//.checkboxradio('refresh');
    aroundMe(searchType);
}
/******
 * Given a parameter, aroundMe will either search around a given location (pop)
 * or around the marker StartLocation1, or startLocation2 (otherwise)
 *
 * It will get the types of venues from the query-types-div page
 *
 * @param {type} type - restaurant, atm etc
 * @param {type} keywords - qualifierers
 * @returns {undefined}
 */
function aroundMe(type, keywords) {
    console.log('called aroundMe');
    displayInfo.touristMode=false;
    /* two possibilityes
     * if navigate flag === 1 or 2 then calculate route
     *   otherwise turn it into search mode
     * if not navigating search around the first location if set
     */
    if (type) {
        searchFlag = true;
        //note that if the popupMenuPosition is not set then what?  should
        //be the center of the screen
            hmenu_instance.setPosition(startingLocation1.googlePosition);
        if (platform === 2)
            searchForVenues(convert2latLng(hmenu_instance.getPosition()), null, null, type);
        else
            searchForVenues(hmenu_instance.getPosition(),type);
    } else
    if (navigateFlag === false || (startingLocation1.googlePosition===null|| startingLocation2.googlePosition===null)) {
        //if navigating then search mode has to be off
        //might not want to reset if in map mode
        clearVenues();
        if (startingLocation1.googlePosition !== null && startingLocation2.googlePosition !== null) {
            navigateFlag = 2;
            calculateRoute();
        } else if (startingLocation1.googlePosition !== null) {
            searchFlag = true;
            searchForVenues(startingLocation1.googlePosition,null,null,keywords);
        } else if (startingLocation2.googlePosition !== null) {
            searchFlag = true;
            searchForVenues(startingLocation2.googlePosition,null,null,keywords);
        } else {
            searchFlag = true;
            if (platform === 2) {//the plugin does not have the function getCenter... lets use the camera
                map.getCameraPosition(function (camera) {
                    searchForVenues(new google.maps.LatLng(camera.target.lat, camera.target.lng),null,null,keywords);
                });
            } else {
                searchForVenues(map.getCenter(),null,null,keywords);
            }
        }
    } else {
    //navigate flag is either 1 or 2... since the venue button was pressed, make it 2
        clearVenues();
        if (navigateFlag === 1) {
            navigateFlag = 2;
            calculateRoute();
        } else {
            //searchForVenues(displayInfo.midlocation);
            //calculateRoute();
            findSubRoutes();
        }
    }
    closeWindowsReset();
    //closeWindows();
}
/*************************
 * this will open up google maps and have the destination set to the dlat, lng
 * from the event location
 *
 *
 * @returns {undefined}
 */
function openWebPage() {
    dlat = $('#lat').text();
    dlng = $('#lng').text();
    url = "https://maps.google.com/maps?daddr=(" + dlat + "," + dlng + ")";
    console.log('Opening google maps' + url);
    window.open(url, '_blank');
}
function searchReplace(object,search,replace){
    for(var key in object){
        if(object.hasOwnProperty(key))
            if(typeof object[key] ==="string"){
                object[key]=object[key].replace(search,replace);
            }else if (typeof object[key] === "object" && object[key]!==null) {
                searchReplace(object[key],search,replace);
            }
    }
}
function handleDetailRequest(google_id) {
    //remember devurl or liverul
    var loolcall = $.ajax({type: 'POST',
        url: venueDataUrl,
        crossDomain: true,
        data: {
            action: 'checkVendorDetails',
            place_id: google_id
        },
        xhrFields: {
            withCredientials: false
        },
        success: function (data, status) {
            return data;
        },
        error: function (xhr, desc, err) {
            console.log('error retrieving invite information' + xhr);
            console.log('Details: ' + desc + '\nError:' + err);
        },
        dataType: "json"
    });
    return loolcall;
}
function handleYelpRequest(phonenumber) {
    //remember devurl or liverul
    var yelpcall = $.ajax({type: 'POST',
        url: yelpQuery,
        crossDomain: true,
        data: {
            action: 'findBusiness',
            phone: phonenumber
        },
        xhrFields: {
            withCredientials: false
        },
        success: function (data, status) {
            console.log('Yelp retrieved data' + data + ':' + status);
            return data;
        },
        error: function (xhr, desc, err) {
            console.log('error retrieving yelp information' + xhr);
            console.log('Details: ' + desc + '\nError:' + err);
        },
        dataType: "json"
    });
    return yelpcall;
}
function inviteCodeCheckEnterKey(key) {
    if (key.keyCode === 13)
        handleInviteCode();
}
/**************
 * this is called to open up the screen and query given the invite code
 *
 * @returns {undefined}
 */
function handleInviteCode() {
    displayInfo.touristMode=false;
    var code = $('#inviteCode').val().toUpperCase().trim(); //8RQG8PT';
    if(code.length===0)
        return;
    _handleInviteCode(code,startingLocation1.googlePosition);
}
/* Being removed to simplify the interface 9/17/2015
 * added back 11/9/2014
 */
  function clearInvite() {
    _resetDestination();
    closeWindows("#mainPanel");
}
//note that inviteRoute is no longer needed as the route is autogenerated
/*
function inviteRoute() {
    console.log('inviteRoute called');
    //note that we must have a valid starting location
    if (displayInfo.retrievedStartingLocation === -1) {
        alert("You must enter the starting location manually or enable location services for this session.");
    } else {
        navigateFlag = 1;
        calculateRoute();
    }
}
*/
function copyEventInformation2event(eventInfo){
    var event = {};
    event.name = eventInfo.placeName;
    event.address = eventInfo.placeAddress;
    event.eventTime = eventInfo.eventTime;
    event.endTime = eventInfo.endTime;
    event.looltype= eventInfo.looltype;//this is for the enterprise hcode
    event.description = eventInfo.placeDescription;
    return event;
}
/*********
 * this is a subfunction that setsup startingLocation2 when the item is retrieved
 * from several palces, must be given the eventObject and the position, will
 * setup startingLocation2 correctly.
 * Normally the eventObject is an item from the venueDetails or from invite
 * hiacode retrieval
 *
 *
 */
function _setupStartingLocation2wPlaceObject(eventObject,gposition){
    var position;
    if (platform === 2)
	position = new convert2pluglatLng(gposition);
    else
        position = gposition;
    //this is to make sure the data is tehre
    var placeObject = new placeDetailObject(eventObject);//creating a palceobject
    placeObject.place_id = eventObject.placeId;
    placeObject.geometry = {};
    placeObject.geometry.location = gposition;
    placeObject.name=eventObject.placeName;

    startingLocation2.googlePosition=gposition;
    startingLocation2.position=position;
    startingLocation2.place_id=placeObject.placeId;
    startingLocation2.place=placeObject;
    startingLocation2.setVisible(true);
    startingLocation2.types=placeObject.types;
    startingLocation2.record=placeObject.record;
    //startingLocation2.setPosition(position,true,true);
    return position;
}
/***********************
 * _handleInviteCode() will get the details, given the inviteCode
 *
 * @param {type} inviteCode
 * @param {type} currentPosition - used for data collecting where the invite was invoked
 * @returns {undefined}
 */
function _handleInviteCode(inviteCode, currentPosition) {
    var lat=null, lng=null;
    displayInfo.inviteCode=inviteCode;
    //this code is to handle if TYPE=RESTAURANT or a google places type
    if(!inviteCode){
        handleSearchTypes(displayInfo.searchType);
        return;
    }
    if(currentPosition!==undefined && currentPosition!==null){
        lat=currentPosition.lat();
        lng=currentPosition.lng();
    }
    searchWait('show');
    console.log('ajax call for invite');
    var code = inviteCode.toUpperCase().trim(); //8RQG8PT';
    $('#inviteCode').val(code);
    //remember devurl or liverul
    $.ajax({type: 'POST',
        url: getInviteUrl,
        data: {
            action: 'getEnhancedEvent',
            inviteCode: code,
            lat: lat,
            lng: lng,
            token: displayInfo.token,
            selector: displayInfo.selector
        },
        xhrFields: {
            withCredientials: false
        },
        success:
                processHandleInviteCodeReturn,
        error: function (xhr, desc, err) {
            alert('Unable to find invite:' + desc);
            console.log('error retrieving invite information' + xhr);
            console.log('Details: ' + desc + '\nError:"+err');
            closeWindows("#mainPanel");
        }
    });
}
//support function for handleInviteCode
    function processHandleInviteCodeReturn(data2, status) {
        var data;
        if (data2 !== "")
            data = JSON.parse(data2);
        else {
            data = {};
            data.status = "error";
        }
        //
        //with the advent of the enterprise query, it can return more than one row.... 11/10/2015
        if (data.status === 'ok' && data !== '') {
            console.log('retrieved invite information' + data);
            //note that more than 1 can be returned...
            //if so then
            _resetMarkerObject(startingLocation2);
            displayInfo.eventInformation = data.data[0];
            //this must be converted to displayInfo.event
            var event = copyEventInformation2event(displayInfo.eventInformation);
            //event.inviteCode = code;//save the hcode

            if (event.description !== "" && event.description !== null) {
                $("#inviteNotes").show();
            } else {
                $("#inviteNotes").hide();
            }
            displayInfo.event = event;
            displayEvent();

            // setup midlocation and calculate route?
            $('#basePanel').panel('close');
            clearVenues();
            _removeRoutes();

            var gposition = new google.maps.LatLng(displayInfo.eventInformation.lat, displayInfo.eventInformation.lng);
            var position = _setupStartingLocation2wPlaceObject(displayInfo.eventInformation, gposition);

//this sets the destination marker to the type
            if (displayInfo.eventInformation.customMarkerName !== "" && displayInfo.eventInformation.customMarkerName !== null && displayInfo.eventInformation !== null) {
                startingLocation2.image = vendorIconPath + displayInfo.eventInformation.customMarkerName;
                startingLocation2.customImage = true;
                if (startingLocation2.marker !== null) {
                    startingLocation2.marker.setIcon(vendorIconPath + displayInfo.eventInformation.customMarkerName);
                }
            } else {
                startingLocation2.customImage = false;
            }

            startingLocation2.setPosition(position, true, true);

            updateSearchBox(position, '#startInput2');
            startingLocation2.looltype = event.looltype;

            closeWindows('#displayInviteData');
            console.log('startingLocation2' + startingLocation2.marker);
        } else {
            closeWindows('#hInviteCodeScreen');
            $('#inviteResult').html('Invalid Code, please Re-enter');
        }
    }
function callhiacode(){
    _handleAFQuery('AFSN7KLK5B8IAG7N0CXENU5N2');
}
function _handleAFQuery(code) {

    var retval = $.ajax({
        type: 'POST',
        url: 'http://localhost/postSearch.php',
        data: {
            action: 'hiaSearch',
            hiacode: code
        },
        xhrFields: {
            withCredientials: false
        }
    });
    return retval;
}
/*********************
 * handleBlockCode queries an enterprise code and returns
 * all the locations associated with it.
 *
 * Does not do pagination currently so it expects to return all
 * the items.
 *
 * Called by getClusterData()
 * @param {type} code
 * @returns {jqXHR}
 */
function handleBlockCode(code){
  var retval = $.ajax({type: 'POST',
        url: getBlocksUrl,
        data: {
            action: 'getdrops',
            inviteCode: code,
            token: displayInfo.token,
            selector: displayInfo.selector
        },
        xhrFields: {
            withCredientials: false
        },
        error: function (xhr,desc,err){
            alert('Unable to find invite:' + desc);
            console.log('error retrieving invite information' + xhr);
            console.log('Details: ' + desc + '\nError:"+err');
            closeWindows("#mainPanel");

        }
    });
    return retval;
}
/**********
 * processClusterData() is used by Tourism, and other block search.  Cluster Data
 * is an enterprise version of the hiacode and displays all the icons that is
 * associated with a hcode.
 *
 * This is also used by hiaMapSearch() which calls the mapSearch.php for posting
 * Note that the posting should probably have scope='posting'
 *
 * Based on getVenueDetailFromGoogle
 */
function processClusterData(data,status){
    var array = [];

    retstuff=JSON.parse(data);
    if(retstuff.rowcount===0 || retstuff.data.length===0)
        return;
    if(retstuff.status==="ok"){
        array=retstuff.data;
        queryString = [];
    if (platform === 2)
        var bounds = new plugin.google.maps.LatLngBounds();
    else
        var bounds = new google.maps.LatLngBounds();
    array = _.sortBy(array,"name");
    //note that this should go through the array and remove duplicate place_id's
    //and combine event_name/event_description into an array for vendorData.
venueDetails=[];
    for(var i=0;i<array.length;i++){
        var placeObject  = new placeDetailObject(array[i]);
        //this data is retrieved from process cluster query similar to tier data
        placeObject.index=i;
        copyPlaceData(placeObject);
	placeObject.imageArray=checkImagePlaceObject(placeObject);
        var position2;
        var position=new google.maps.LatLng(array[i].lat,array[i].lng);
        if(platform===2)
            position2 = convert2pluglatLng(position);

        /*******************************************/
        //note that unlike google we do not have venueDetails[i].phpos
        //placeObject.marker=marker;
        venueDetails.push(placeObject);
        queryString.push(placeObject.placeId);
        if(platform===2)
            bounds.extend(position2);
        else
            bounds.extend(position);
    }
        //center the map on the data
//note that this is similar to function in getcluterdata()
    if(displayInfo.staticZoom===true){
                //center on starting 1 and setZoom
        map.setCenter(displayInfo.start);
        map.setZoom(displayInfo.defaultZoom);
        updateSearchBox(displayInfo.start,'#startInput1');
        updateSearchBounds();
    }else{
        if (platform !== 2){
            map.fitBounds(bounds);
            updateSearchBounds();
        }else
            map.moveCamera({
                'target': bounds
            }, function () {
            updateSearchBounds();
        });
        }
    }

    //checkAdditionalVenues(results);
    createVenueList();
    if(displayInfo.touristData)
            touristData=venueDetails;
        //processExtendedData(queryString);
}
/*********
* note tht this has to take two parallel arrays and make
* object.image and object.posting_id
* a single image array
*/
function checkImagePlaceObject(object){
	var image =[];
	if(object.images){
		var image_array=object.images.split(',');
		var id_array=object.posting_id.split(',');
		for(var i =0; i<image_array.length; i++){
			image.push({image: image_array[i], id: id_array[i]});
		}
	}
	return image;//empty array
}
/*****************
 * createVenueList - is used to create the cards used in the venue-ui
 */
function createVenueList(){
    var iconAddress, photo;
    for (var i = 0; i < venueDetails.length; i++) {
        $('#venue-text').append(venueDetails[i].venueUiFormatText(venueDetails[i]));
        //for block wewon't have photo's, just the icons if any

        if(venueDetails[i].location_icon){
            iconAddress=vendorIconPath+replaceIconSize(venueDetails[i].location_icon,'l');
        }else if(venueDetails[i].loolgroup_icon){
            iconAddress=vendorIconPath+replaceIconSize(venueDetails[i].loolgroup_icon,'l');
        }else if(venueDetails[i].imageArray && venueDetails[i].imageArray.length>0){
		iconAddress=postingHost+postingPicturePath+venueDetails[i].imageArray[0].id+'/thumb_'+venueDetails[i].imageArray[0].image;
	}else{
            iconAddress='none';
        }
        photo="url('"+iconAddress+"')";
        $("#"+venueDetails[i].place_id+'-pic').css("background-image",photo);
    }
    for (var i = 0; i < venueDetails.length; i++) {
        venueDetails[i].createClickHandler(venueDetails[i]);
    }
}
/**********
 * gets pins for a particular code
 */
function getClusterData(code){
    var closewindow=closeWindowsReset();
    closewindow.done(function(){
        setTimeout(function(){
            console.log('blurring input');
            if(platform===2)
                Keyboard.hide();
        }, 300);//300 for android what for iOS?
    });

    _removeRoutes();
    clearVenues();
    if(startingLocation2){
        $(startingLocation2.inputfield.name).next().trigger("click");
        resetInputField(startingLocation2);
    }
    var retval;
    if(code && code!=="+NYCTOURIST"){
        displayInfo.touristMode=false;
        retval=handleBlockCode(code);
        retval.done(processClusterData);
    }else{
        displayInfo.touristMode=true;
        if(!displayInfo.touristData){
            retval=handleBlockCode("+NYCTOURIST");
            displayInfo.touristData=true;
            retval.done(processClusterData);
            //copy everything from touristblock to VenueDetails
        }else{
            venueDetails=touristData;
            createVenueList();
            var position;
            var bounds;
            if (platform === 2)
                bounds = new plugin.google.maps.LatLngBounds();
            else
                bounds = new google.maps.LatLngBounds();

            for(var i=0;i<venueDetails.length;i++){
                position=new google.maps.LatLng(venueDetails[i].lat,venueDetails[i].lng);
                if(platform===2)
                    bounds.extend(convert2pluglatLng(position));
                else
                    bounds.extend(position);

                venueDetails[i].marker=null;
                venueDetails[i].markerFlag=false;
            }
            if(displayInfo.staticZoom===true){
                //center on starting 1 and setZoom
                map.setCenter(displayInfo.start);
                map.setZoom(displayInfo.defaultZoom);
                updateSearchBox(displayInfo.start,'#startInput1');
                updateSearchBounds();
            }else{
                if (platform !== 2)
                    map.fitBounds(bounds);
                else
                    map.moveCamera({
                        'target': bounds
                    }, function () {
                });
                updateSearchBounds();
            }
        }
    }
    console.log('getblock data done');
}

/*****
 * if this finds -xx in a string, replaces it with either 24 or 100
 */
function replaceIconSize(string,size){
    var retstring,pix;
    switch(size){
        case 's':
            pix='-24';
            break;
        case 'm':
                pix='-50';
            break;
        case 'l':
            pix='-100';
            break;
        case null:
        case undefined:
            if(platform===2)
                pix='-32';
            else
                pix='-50';
            break;
    }
//    console.log('size='+size+'pix'+pix);
    return retstring=string.replace('-xx',pix);
}

function processVenueMarkers(){
    console.log('processing venue Markers:'+displayInfo.zoom);
    for (var i = 0; i < venueDetails.length; i++) {
        venueDetails[i].venueMarkerDraw();
    }
}
function displayEvent() {
    $('#inviteLocation').text(displayInfo.eventInformation.placeName);
    $('#inviteDescription').text(displayInfo.eventInformation.placeDescription);
    $('#inviteAddress').text(displayInfo.eventInformation.placeAddress);
    if(displayInfo.eventInformation.looltype!=="0"){
        $('#inviteDateDiv').hide();
    }else{
        $('#inviteDateDiv').show();
    }
    $('#inviteDate').text(moment(displayInfo.eventInformation.eventTime).format("ddd MMM Do YYYY h:mm A"));
    $('#inviteTime').text(displayInfo.eventInformation.eventTime);
    $('#lat').text(displayInfo.eventInformation.lat);
    $('#lng').text(displayInfo.eventInformation.lng);
}
/*******************
 * NOTE this must handle if a venue is not given (ie only a lat,lng)
 * This will call the server (either liveurl or devurl)
 * and create the invite.  Upon success it will open up the contact page
 *
 * @param {type} venue this lists the venue information (lat,lng, id, name etc
 * @returns {undefined}
 */
function createInviteEvent(venue) {
    /* with the place, we have the location,placeId, placeDescription, we need to get
     * the eventTime and the expirationTime
     *
     */
    console.log('entering Create Event');
    if (!venue)
        return;
    /*
     lat = venue.geometry.location.lat();
     lng = venue.geometry.location.lng();
     placeId = venue.place_id; //note that the user can pick anyplace on the map so the placeId can be null
     placeName = venue.name; //but the lat and lng cannot, if placeId is null, placeDescription should not be
     placeDescription = venue.description;
     placeAddress = venue.formatted_address;
     eventTime = venue.eventTime; //how will this be set?
     endTime = venue.endTime;
     console.log('event Time:' + eventTime);
     expirationTime = new Date(eventTime); //new Date();
     expirationTime.setDate(eventTime.getDate() + 1);
     console.log('expiration:' + expirationTime);
     length = 7;
     userId = 'none'; //this should be set before hand
     */
    length = 7;
    var retval = $.ajax({type: 'POST',
        url: createInviteUrl,
        data: {
            action: 'createEvent',
            lat: venue.geometry.location.lat(), //lat,
            lng: venue.geometry.location.lng(), //lng,
            placeId: venue.place_id, // placeId,
            placeName: venue.name, //placeName,
            placeDescription: venue.description, //placeDescription,
            placeAddress: venue.address, //placeAddress,
            length: length,
            token: displayInfo.token,
            selector: displayInfo.selector,
            userId: "none", //note that on the server side, the id is determined by the token and selector
            eventTime: venue.eventTime,
            endTime: venue.endTime,
            expirationTime: venue.expirationTime,
            origin: venue.origin
        },
        xhrFields: {
            withCredientials: false
        },
        success: function (data, status) {
            //note that the inviteCode should be returned with status==ok or something
            eventInformation = JSON.parse(data);
            inviteCode = eventInformation.inviteCode;
            status = eventInformation.status;
            //open the invite code page and get contacts if available

            eventObject.inviteCode = inviteCode;
            displayInfo.event.inviteCode = inviteCode;
            closeWindows('#inviteCodePage');
            $('#hInviteCode').text(inviteCode);
        },
        error: function (xhr, desc, err) {
            console.log(xhr);
            var string = 'unable to create Invite\ndetails: ' + desc + '\nError:' + err;
            console.log(string);
            alert(string);
        }
    });
    return retval;
}
// these functions convert between the cordova plugin and google maps
function convert2latLng(position) {
    return new google.maps.LatLng(position.lat, position.lng);
}
//position given in google coordinates, cvonert to plugin
function convert2pluglatLng(position) {
    return new plugin.google.maps.LatLng(position.lat(), position.lng());
}
function convertArray2latLng(inputArray) {
    var output = [];
    for (var i = 0; i < inputArray.length; i++) {
        output.push(convert2latLng(inputArray[i]));
    }
    return output;
}
function convertArray2pluglatLng(inputArray) {
    var output = [];
    for (var i = 0; i < inputArray.length; i++) {
        output.push(convert2pluglatLng(inputArray[i]));
    }
    //for(i=0;i<output.length;i++)
    //console.log('i:'+i+':'+output[i]);
    return output;
}
//what functions are needed?
// set interva
// checkSearchtime (diff between current time and saved time
// searchTimestamp (save the timestamp into callbacktimestamp)
// callGoogleSearch (funcionNotCalled=true, reset callbacktimestamp to 0
//
//at this point will call routine that loops through and gets all the venues

var googleSearchBoxObject = function (name) {
    this.name = name;
};
googleSearchBoxObject.prototype.setListener = function (name) {
    this.listener = name;
};
//basically looks for a file.
function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status !== 404;
}
var searchBox1 = new googleSearchBoxObject('#startInput1');
var searchBox2 = new googleSearchBoxObject('#startInput2');
var searchBox3 = new googleSearchBoxObject('#miniInput');
var searchBox4 = new googleSearchBoxObject('#queryString1');
var popupArray = [];
var popupMarkerArray = [];

    function popupMenuMarkerDisplay(){
        zoomMarker(startingLocation1.googlePosition);
        hmenu_instance.popupMenuCreate(hmenu_instance.popupMenuDefinitions, popupArray, startingLocation1.googlePosition);
    }

var checkTravelMode = function (givenmode) {
    var mode = displayInfo.travelMode;
    return mode === givenmode;//bicycling. transit, driving
};
var checkNavigateMode = function () {
    return navigateFlag === 1;
};
/* helper founction for moving/dragging the start1 marker
 *
 */
function _moveStart(markerObject, googleLocation){
    console.log('called _moveStart'+markerObject.inputfield.name);
    markerObject.googlePosition= googleLocation;//
    if(platform===2)
        markerObject.position=convert2pluglatLng(googleLocation);
    else
        markerObject.position=googleLocation;
    if(markerObject.type===miniLocation.type)
        updateSearchBox(markerObject.googlePosition, '#miniInput');

    updateSearchBox(markerObject.googlePosition, markerObject.inputfield.name);//or "#startInput1
}
/*******************
 * _moveStartSub() made some changes to take into account an enterprise hcode that
 * can have multipe locations.  must requery for the closest location 11/10/2015
 *
 *
 */
function _moveStartSub(position){
    if(navigateFlag=== false){
        if (startingLocation1.googlePosition !== null && startingLocation2.googlePosition !== null) {
            if(!navigateFlag){
                navigateFlag = 1;
            }
            //this might be called before startingLocation2 is set
                calculateRoute();
        }else if (searchFlag === true) {
            clearVenues();
            searchForVenues(position);
        }
    } else{
        //note that if startingLocation2 is being dragged then forget this...
         if(startingLocation2.looltype==='2'){
             clearVenues();
             _removeRoutes();
                 _handleInviteCode(displayInfo.event.inviteCode,startingLocation1.googlePosition);

            }else{
                calculateRoute();
            }
        }
}
/*********************
 * _resetMarkerObject will clear the place_id if it is given.
 * If it is set, then check the eventinfo as well
 */
function _resetMarkerObject(markerObject){
    if(markerObject.place_id){
        //should also remove venues in this case as this likely
        //a hcode/permanent destination
        clearVenues();
        displayInfo.eventInformation = null;
        markerObject.customImage=false;
        markerObject.place_id=null;
        markerObject.place=null;//should probably update #mainPanel
        markerObject.looltype=null;
        if(markerObject.type==='A')
            markerObject.image=marker.markerA();//markera;
        else
            markerObject.image=marker.markerB();
        if(markerObject.marker!==null)
            markerObject.marker.setIcon(markerObject.image);
    }
}
/****
 * similarity with this and _markerdragworker
 */
function _updateStart(markerObject,position){
    var location;
    var googleLocation;
    _resetMarkerObject(markerObject);
    if (platform !== 2) {
        location = hmenu_instance.getPosition();
        googleLocation = location;
    } else {
        location = hmenu_instance.getPosition();
        googleLocation = convert2latLng(location);
    }

    //if(!navigateFlag)
        //navigateFlag=1;
    _moveStart(markerObject,googleLocation);
    markerObject.setPosition(location, true);
    //setVisible will move the map center
    markerObject.setVisible(true);
    //_moveStartSub(markerObject.googlePosition);
}
function updateStart1() {
    _updateStart(startingLocation1);
}
function updateStart2() {
    _updateStart(startingLocation2);
}
function radiusOpenPanel() {
    if (platform === 2)
        clearVenues();
    closeWindows("#search-options-div");
    popupDrawRadius();
}
/******
 * there are only three possible location where a search radius can be
 * 1.  startingLocation1
 * 2. the searchLocation if in navigation mode
 *     navigateFlag===1 then it is a&b
 *     naviagetflag===2 then 1 &2 to some intermediate pointin between
 * 3. the center of the screen if either of the first two is null.
 *
 * @returns {undefined}
 */
function popupDrawRadius() {
    console.log('drawing circle navigation:' + navigateFlag);
    circlesOn = true;
    var center;
    switch (navigateFlag) {
        case 1:
            center = startingLocation1.position;
            displayInfo.searchLocation = startingLocation1.googlePosition;
            break;
        case 2:
            if (platform === 2) {
                center = convert2pluglatlng(displayInfo.searchLocation);
            } else
                center = displayInfo.searchLocation;
            break;
        default:
            if (startingLocation1.position !== null) {
                center = startingLocation1.position;
                displayInfo.searchLocation = startingLocation1.googlePosition;
            } else {
                if (platform === 2) {//the plugin does not have the function getCenter... lets use the camera
                    map.getCameraPosition(function (camera) {
                        center = new plugin.google.maps.LatLng(camera.target.lat, camera.target.lng);
                        displayInfo.radiusCircle = drawcircle(center, 2);
                        displayInfo.searchLocation = center;
                    });
                    return;
                } else {
                    center = map.getCenter();
                    displayInfo.searchLocation = center;
                }
            }
    }
    //when the circle is clicked on, close the circle and let the user select a new size
    displayInfo.radiusCircle = drawcircle(center, 2);
		fitCircleInScreen(center);
    if (platform !== 2) {
        console.log('platform 1 centering for radius');
        map.setCenter(center);
    } else {
        console.log('platform2 centering for radius');
        map.getCameraPosition(function (camera) {
            map.moveCamera({
                'target': center,
                'zoom': camera.zoom
            }, function () {
            });
        });

    }
}

function fitCircleInScreen(){
    if (platform === 2) {//the plugin does not have the function getCenter... lets use the camera
        map.getCameraPosition(function (camera) {
            var center = new plugin.google.maps.LatLng(camera.target.lat, camera.target.lng);
			_fitCircleInScreen(center);
        });
    } else {
        center = map.getCenter();
        _fitCircleInScreen(center);
    }
}
function _fitCircleInScreen(center){
    var radius=$("#radius").val()/1000;
        if(radius>(displayInfo.distanceNS/2)||radius>(displayInfo.distanceEW/2)){
            zoomOut(-1,center);
        }

        if(radius<(displayInfo.distanceNS/20)||radius<(displayInfo.distanceEW/20)){
            console.log('radius:'+radius+' height:'+displayInfo.distanceNS/5+' width:'+displayInfo.distanceEW/5);
            zoomOut(1,center);
        }
}
function zoomOut(value,center){

    if(platform!==2){
        var zoom=map.getZoom();
        if(value<0 && zoom<=0)
            return;
        if(value>0 && zoom>=20)
            return;

        console.log('zoom:'+zoom+' value:'+value);
        zoom+=value;
        map.setZoom(zoom);
        console.log('returned from map.setZoom()');
    }else{
        map.getCameraPosition(function (camera) {
            var zoom=camera.zoom+value;
            if(value<0 && zoom<=0)
                return;
            if(value>0 && zoom>=20)
            return;
            map.moveCamera({
                'target': center,
                'zoom': zoom
            }, function () {
			console.log('zoomed'+zoom);
            });
        });
	}
}
function radiusActiveCheckClose() {
    if (displayInfo.radiusCircle) {
        console.log("stopping radius routine");
        radiusClosePanel();
        return true;
    }
    return false;
}
/***********
 * radiusClosePanel() will close the panel and turn off
 * the map clicking (done by setting displayInfo.radiusCircle=null
 *
 * this is done also in closeWindows() code
 *
 * @returns {undefined}
 */
function radiusClosePanel() {
	console.log("closing radius panel");
    _radiusClosePanel();
    displayInfo.radiusCircle = null;
    if (searchFlag === true)
        aroundme();//lets call the search based on the new radius if it was called
    else if (navigateFlag === 2) {
        clearVenues();
        searchForVenues(displayInfo.searchLocation);
    }
    closeWindowsReset();
}
function _radiusClosePanel() {
	console.log("_sub function radiusClosePanel()");
    circlesOn = false;
    _radiusClose();
}
function _radiusClose() {
    if (displayInfo.radiusCircle === null)
        return;
    if (platform === 2)
        displayInfo.radiusCircle.remove();
    else
        displayInfo.radiusCircle.setMap(null);
    //sanity check to make sure that the minimum is 50 and the maximum is 50,000
    var strg = $("#radius").val();
    var val = parseInt(strg);
    if (val < 50 || strg === "") {
        $("#radius").val(50);
        //$('#radius2').slider("refresh");
    }
    if (val > 50000) {
        $("#radius").val(50000);
        //$('#radius2').slider("refresh");
    }
//    displayInfo.radiusCircle = null; dont' destroy the circle just undisplay it to reset the radius
}
    /***************
     * markerObject used for startingLocation1 and startingLocation2
     * object to keep track of the current position (in native latlng)
     * google g current imate, animation marker information etc...
     *
     * @param {type} marker is the google or plugin object
     * @param {type} position lat,lng
     * @param {type} image png,jpg etc file
     * @param {type} animation bounce, drop etc
     * @param {type} input html object
     * @param {type} type -
     * @returns {powaintMarkerObject}
     */
    var powaintMarkerObject = function (marker, position, image, animation, input, type) {
        this.marker = marker; //platform dependent object
        this.position = position; //the platform  dependent latlng
        if (position !== null) {
            if (platform === 2)
                this.googlePosition = convert2latLng(position); //this location is platformIndependent for google
            else
                this.googlePosition = position; //this location is platformIndependent for google
        } else
            this.googlePosition = null;
        this.image = image;//addUrlPrefix(image); //location of marker image
        this.animation = animation; //only applicable for javascript/web version
        this.inputfield = input;
        this.type = type;
    };
    powaintMarkerObject.prototype.setVisible = function (flag) {
        console.log('marker visible:' + flag);
        if (this.marker !== null && this.marker !== 1) {
            if (flag === true) {
                if (platform === 2) {
                    console.log('moving map center plugin')
                    this.marker.setVisible(true);
                    //map.setCenter(this.position);
                    zoomMarker(this.googlePosition);
                } else {
                    console.log('moving map center web')
                    //map.setCenter(this.googlePosition);
                    zoomMarker(this.googlePosition);
                    this.marker.setMap(map);
                }
            } else {
                if (platform === 2) {
                    this.marker.setVisible(false);
                } else {
                    this.marker.setMap(null);
                }
            }
        }else{
            console.log('marker not set, skipping')
        }
    };
    powaintMarkerObject.prototype.setOpacity = function (opacity){
        if(this.marker !== null && this.marker !== 1)
            this.marker.setOpacity(opacity);
    }
    /********
     * powaintMarkerObject.setPosition will create the marker and set it if it does not
     * exist
     *
     */
    powaintMarkerObject.prototype.setPosition = function (location, navFlag, visFlag) {
        this.position=location;
        if (platform === 2) {
            this.googlePosition = convert2latLng(location);
        } else {
            this.googlePosition = location;
        }
        if (this.marker === null) {// no marker create one? should this ever be null?
            if (platform === 2) {
                value = {
                    'draggable': true,
                    'position': location,
                    //possible values drop, bounce to stop bouncing set to null
                    'icon': this.image
                };
                //this is an asynchronous call to add marker listeners
                //won't work?
                this.marker = 1;
                function _setPosition(markerObject, navFlag) {
                    //with this check, won't be able to add another marker to this
                    if (markerObject.marker === null || markerObject.marker === 1) {
                        console.log('**** pre-adding marker');
                        map.addMarker(value, function (mark1) {

                            markerObject.marker = mark1;
                            console.log('****** adding marker, text box:' + markerObject.inputfield.name);
                            markerPluginListeners(markerObject);
                            console.log("finished plugin listeners"+location);
                            //because this is in an asynch call we have to be careful about
                            //setting the position~
                            markerObject.setVisible(true);
                            markerObject.marker.setPosition(location);
                            markerObject.marker.getPosition(function(data){
                                console.log('retrieved location'+data);
                            });
                            console.log("finished setting position");
                            if (visFlag) {
                                markerObject.marker.setVisible(true);
                                zoomMarker(markerObject.googlePosition);
                                //map.setCenter(location);
                                //code
                            }
                            console.log("finished zooming navingating now");
                            if (navFlag)
                                navigate(true);
                        });
                    }
                }
                _setPosition(this, navFlag);
            } else {
                value = {
                    draggable: true,
                    position: location,
                    //possible values drop, bounce to stop bouncing set to null
                    icon: this.image,
                    animation: this.animation
                };
                this.marker = new google.maps.Marker(value); // end setup marker
                this.marker.setMap(map); //moved from panelsetup()
                markerWebListeners(this);
                this.marker.setPosition(location);
                if (visFlag) {
                    zoomMarker(this.googlePosition);
                    //map.setCenter(this.googlePosition);
                    this.marker.setMap(map);
                    //code
                }
                if (navFlag === true)
                    navigate(true);
            }
        } else {//marker does exist
            if (this.marker !== 1){
                console.log("moving marker");
                this.setVisible(true);
                this.marker.setPosition(location);
                zoomMarker(this.googlePosition);
            }else{
                console.log("marker=1");
            }
            if (navFlag === true)
                navigate(true);
    }

    this.position = location;
};
function openMainPanel(args) {
    console.log("open mainPanel clicked");
    initializeMainPanel(args);
    closeWindows("#mainPanel");
    //code
}
function initializeInvitePanel(){

}
function initializeMainPanel(args) {
    $("#mainPanelTopMenu").show(200);
    $("#mainPanelInviteData").hide(200);
    $("#mainPanelInputA").show(200);
    $("#mainPanelInputB").show(200);
    displayInfo.mainPanelType=1;
    //this should change the class of #swipbutton to uparrow
    $("#swipebutton").removeClass('hia-down-arrow').addClass('hia-up-arrow')
    //has to resize map()
    setTimeout( function(){
        $("#mainPanel").trigger("updatelayout");
        handleMapSize();
    },
    300);
    //code
}
/*********
 *initilizeminipanel is to be changed from the minipanel to hiding different parts of the mainPanel
 */
function initializeMiniPanel(){
    var address;
    $("#mainPanelTopMenu").hide(200);
    $("#mainPanelInviteData").hide(200);
    if(miniLocation.type==='a'){
        $("#mainPanelInputA").show(200);
        $("#mainPanelInputB").hide(200);
    }else{
        $("#mainPanelInputA").hide(200);
        $("#mainPanelInputB").show(200);
    }
    setTimeout(function(){
        $("#mainPanel").trigger("updatelayout");
        handleMapSize();
    },
    300);
    displayInfo.mainPanelType=2;
    $("#swipebutton").removeClass('hia-up-arrow').addClass('hia-down-arrow')
}
function _markerClickWorker(markerObject,position){
    radiusActiveCheckClose();
        //this is necessary because venueinformation is cleared upon searching for a route
        if(markerObject.place_id){
            //check if venueDetails is tehre
            if(markerObject.place_id==="1" || markerObject.place_id===null||markerObject.place_id===""){
                openInviteScreen();
            }else{
                if(!searchvenueDetailsList(markerObject.place_id)){
                    venueDetails.push(markerObject.place);
                   $('#venue-text').append(markerObject.place.venueUiFormatText(markerObject.place));
                   markerObject.place.createClickHandler(markerObject.place);
                }
                transitionToDetail(markerObject);
            }
            return;
        }
        //this is now always on
            miniLocation.type=markerObject.type;
            //must initialize the mini panel
            initializeMiniPanel();
            console.log('location marker clicked');
            if(displayInfo.popupMenuDisplay===true)
	            hmenu_instance.popupMenuCreate(hmenu_instance.popupMarkerMenuDefinitions, popupMarkerArray, position);

        if(more_screen){
            initializeMiniPanel();
            //closeWindows("#miniPanel");
            closeWindows("#mainPanel");
            handleMapSize();
        }else
            closeWindows("#mainPanel");
}
/*********
 * markerWebListeners is used by the location markers setPosition routine.
 *
 */
function markerWebListeners(markerObject) {
    google.maps.event.addListener(markerObject.marker, 'click', function (evt) {

        _markerClickWorker(markerObject,evt.latLng);

    });

    //code to listen to where the marker is, should display the 'street address'?
    //does evt provide latlng?
    google.maps.event.addListener(markerObject.marker, 'dragend', function (evt)
    {

        _markerDragWorker(markerObject,evt.latLng);

    }); // end of marker addListener for dragging marker
}
function _markerDragWorker(markerObject,position){
        hmenu_instance.popupMenuHide();
        displayInfo.eventInformation=null;
        _resetMarkerObject(markerObject);
        _moveStart(markerObject,position);
        _moveStartSub(markerObject.googlePosition);
}
function  markerPluginListeners(markerObject) {
    markerObject.marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function (mark1) {
        mark1.getPosition(function (position) {
            var position2 = convert2latLng(position);
            _markerDragWorker(markerObject,position2);
        });
    });
    markerObject.marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function (mark1) {
        console.log('marker plugin clicked');
        mark1.getPosition(function (position) {
            var position2 = convert2latLng(position);
            markerObject.position = position;
            markerObject.googlePosition = position2;
            _markerClickWorker(markerObject,position);
        });
    });
}
var lineObject = function () {
    this.polyline = null;
    this.index = 0;
};
/*
 * This function will call the search routine via callSearchCircle
 * and put a yellow marker where the center is
 * @returns {circleDraw}
 */
var circleDraw = function () {
    this.clocation = null;
    this.ccircle = null;
    this.cmarker = null;
    this.visible = true;
    ;
    //priveleged function
    this.clearCircle = function () {
        if (this.clocation !== '') {
            if (this.ccircle !== null)
                if (platform !== 2)
                    this.ccircle.setMap(null);
                else
                    this.ccircle.remove();
        }
        if (this.cmarker) {
            console.log('clearing marker');
            if (platform !== 2)
                this.cmarker.setMap(null);
            else
                this.cmarker.remove();
            this.cmarker = null;
        }

    };
    /*******************
     *
     * @param {type} point google latLng format
     * @param {type} search true or false flag
     * @param {type} draggable true or false flag*
     * @returns {undefined}
     */
    this.drawSearchCircle = function (point, search, draggable) {
        //if this was draw, clear out the marker and circle
        //console.log('search circle routein' + point + ' search flag:' + search + ' draggable: ' + draggable);
        /*this.clocation = point;
         this.ccircle = drawCircle(point, 1); */
        clearVenues();
        var draggableFlag;

        if (draggable) {
            draggableFlag = true;
        } else {
            draggableFlag = false;
        }
        //note that the circle is dragable... shoud move marker if it is dragged...
        //
        //note toclean up I have to save them to remove them the nexttime we come here
        //phonegap change to map.addMarker(), only thing it won't take is
        if (platform === 2) {
            var newPoint = convert2pluglatLng(point);
            if (this.cmarker !== null && typeof midCircle.cmarker !== "undefined") {
                if (this.cmarker !== 1) {
                    console.log('updating circle marker');
                    this.cmarker.setPosition(newPoint);//this.clocation));
                } else {
                    console.log('updating cmarker');
                }
            } else {
                this.cmarker = 1;
                console.log('adding circle marker');
                //bitten by closure again...

                function _pluginAddMarker(circle) {
                    map.addMarker({
                        'draggable': draggableFlag,
                        'position': newPoint,
                        //possible values DROP, BOUNCE to stop bouncing set to null
                        'icon': marker.yellowMarker()
                    }, function (marker) {
                        //phonegap
                        //marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function(marker) {
                        console.log('adding listener to the yellow marker');
                        circle.cmarker = marker;
                        marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function (marker) {
                            console.log('plugin yellow dragged');
                            marker.getPosition(function (oldpos) {
                                var pos = convert2latLng(oldpos);
                                //note that this can only be called if search was true, if false then marker is not draggable
                                //searchForVenues(pos);
                                //note that the fact that midlocation here is
                                //in plugin latlng format while elsewhere it's in google format
                                // findSubRoutes() uses localized format
                                displayInfo.midlocation = pos;
                                console.log('search for subroutes drawingSearchCircle');
//call subroutes would prevent the midcenter from being calculated again
                                findSubRoutes();
                            });
                        });
                        marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
                            marker.getPosition(function (pos) {
                                console.log('plugin yellow click');
                                displayInfo.midlocation = convert2latLng(pos); //converting to google location
                                zoomMarker(displayInfo.midlocation);
                                closeWindows("#mainPanel");
                            });
                        });
                    });
                }
                _pluginAddMarker(midCircle);
            }
        } else {
            if (this.cmarker !== null) {
                this.cmarker.setPosition(point);
            } else {
                console.log('adding circle marker');
                this.cmarker = new google.maps.Marker({
                    draggable: draggableFlag,
                    position: point,
                    map: map,
                    //possible values DROP, BOUNCE to stop bouncing set to null
                    icon: marker.yellowMarker(),
                    animation: null
                }); // end setup marker)
                this.cmarker.setMap(map);
                //phonegap
                //marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function(marker) {
                //
                google.maps.event.addListener(this.cmarker, 'dragend', function (evt) {
                    hmenu_instance.popupMenuHide();
                    if (midCircle.ccircle !== null)
                        midCircle.ccircle.setMap(null);
                    console.log('yellow marker drag listener');
                    displayInfo.midlocation = evt.latLng;
                    if (navigateFlag !== false)
                        findSubRoutes();
                    midCircle.cmarker.setMap(map);
                });
                console.log('yellow marker added' + this.cmarker);
                google.maps.event.addListener(this.cmarker, 'click', function (evt) {
                    displayInfo.midlocation = evt.latLng;
                    zoomMarker(evt.latLng);
                    closeWindows("#mainPanel");
                });
            }
        }
    };
};
var midCircle = new circleDraw();
function drawMidCircle(point) {
    drawCircle(point, 1);
    if (platform === 2)
        searchForVenues(convert2latLng(point));
    else
        searchForVenues(point);
    //note toclean up I have to save them to remove them the nexttime we come here
    if (platform === 2) {
        map.addMarker({
            'draggable': false,
            'position': point,
            //possible values DROP, BOUNCE to stop bouncing set to null
            'icon': marker.yellowMarker()
        }); // end setup marker)
    } else {
        var marker = new google.maps.Marker({
            draggable: false,
            position: point,
            //possible values DROP, BOUNCE to stop bouncing set to null
            icon: marker.yellowMarker(),
            animation: null
        }); // end setup marker)
        marker.setMap(map);
    }
}
/********
 * point is in local latLng
 *
 * @param {type} point location in platform latLng
 * @param {type} color 1 or 2 to display a particular color
 */
//original basic circle functions
function drawCircle(point, color) {
    //remove the old one
    if (displayInfo.radiusCircle) {
        if (platform === 2)
            displayInfo.radiusCircle.remove();
        else
            displayInfo.radiusCircle.setMap(null);
    }
    var CircleColor;
    if (color === 1)
        CircleColor = '#FFFF00';
    else if (color === 2)
        CircleColor = '#FF0000';
    else
        CircleColor = '#0000FF';
    var radius = $("#radius").val();
    var circle = {
        strokeColor: CircleColor,
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: CircleColor,
        map: map,
        center: point,
        radius: parseFloat(radius), //parseFloat($('#radius2').val()),
        ///3.2808,
        draggable: false
    };
    //note unlike searchCircle, we are not keeping the circle around
    console.log('circlesflag:' + circlesOn + ' radius:' + radius);
    if (circlesOn)
        if (platform === 2) {
            map.addCircle(circle, function (circleValue) {
                displayInfo.radiusCircle = circleValue;
                circleValue.on(plugin.google.maps.event.OVERLAY_CLICK, function (overlay) {
                    _radiusClosePanel();
                });
            });
            return null;
        } else
            return new google.maps.Circle(circle);
    else
        return null;
}

/**********
 * this searches for the initial list of venues
 *
 * 04/22/2016 search on price has to be changed to allow the search of undefined which is when there is no prrice...
 * also the markers will be based on the displayInfo.type, rather than the values of the google search
 *
 * @param {type} circleCenter is the LatLng location of the circle's center
 *               for google.mi
 * @param {type} type will choose between google or hiamaps search
 * @param {type} smart if the value is greater than 0, then increase the radius of the search by smart*5
 * @returns {undefined}
 */
function searchForVenues(circleCenter, type, smartflag, keywords) {
    displayInfo.searchLocation = circleCenter;//searchForVenues can be called from several locations
    //setup details-text
    var string = getCheckedTypes();
    displayInfo.type=string;
    console.log('search circle types:' + string);
    //additional parameters for search
    // keyword - seaches all fields
    //name -checks names (associated names as well)
    //openNow
    var radius =$('#radius').val();
    if(smartflag && smartflag>0){
        radius *= smartflag*5;
        if(smartflag>4){
            popupMessage("Enhanced search radius of "+radius+" returned 0 results. Increase base search radius.");
            return;
        }

        console.log("Radius increased to "+radius);
    }
    var minPrice;
    if ($("#pricingForm :radio:checked").length == 0) {
        minPrice=0;
    } else {
        minPrice=$('input:radio[name=pricing]:checked').val();
    }
    request = {
//        bounds: bounds,
        location: circleCenter,
        radius: radius,
//        minPriceLevel: minPrice,
//        maxPriceLevel: 4,//max price is defined as 4 by google
        // this should come from a box
        //valid types are bar, restaurant, store,
        //note that keyword,opennow,zagatselected
        //zagatselected is not suppose to have any value
        zagatselected: '',

        /*
         * Note that the search ingoogle maps api has changed in 23
         * from
         * types :[ string1,string2 ] to
         * type : string
         */
        types: [ string ]//['food'] //what other types are there?'food','restaurant'

    };
    console.log('calling google search:' + circleCenter);
    if(type){
        //note that if type is seet, that the supersearch is not done as we do not have that
        //kind of search yet....
        var object=[];
        object.push(type);
	clearVenues();
        var value= hiaMapSearch(request,type);
        //can the following be moved to processClusterData
        value.success(processClusterData);
    }else
        googlePlaceSearch(request,keywords);
}

//asynchronous function, how to deal?

function getCheckedTypes() {
    var string=$('input:radio[name=googletype]:checked').val();
    return string;
}
// routeline object is to help keep track of the route and alternate routes and draw the mask that the user can click on.
// at opacity 0.01, the user can't see it on the map but can still touch/click on it.  The mask will always be wider
// than the route
//<div>Icons made by <a href="http://www.flaticon.com/authors/icons8" title="Icons8">Icons8</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a>             is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a></div>
var routeLine = function (first, second) {
    this.route = first;
    this.mask = second;
};
routeLine.setRoute = function (line) {
    this.route = line;
};
routeLine.setMask = function (line) {
    this.mask = line;
};
function routeMask(array, color, index, type) {
    var lineValue = new lineObject;
    lineValue.index = index;
    if (platform !== 2) {
        lineValue.polyline = new google.maps.Polyline({
            path: array,
            strokeColor: color,
            strokeOpacity: .01,
            strokeWeight: 60,
            zIndex: 1

        });
        lineValue.polyline.setMap(map);
        function _sublistener (type,index){
            google.maps.event.addListener(lineValue.polyline, 'click', function () {
                hmenu_instance.popupMenuHide();
                console.log('listening ' + type + ' index:' + index);
                displayRouteText(type, index); //why is this done twice?
            });
        }
        _sublistener(type,index);
    } else {
        //console.log('drawing mask' + color);
        var newArray = convertArray2pluglatLng(array);
        map.addPolyline({
            'points': newArray,
            'color': color,
            'width': 60,
            'visible': false,
            'zIndex': 1
        }, function (polyline) {
            lineValue.polyline = polyline;
            polyline.on(plugin.google.maps.event.OVERLAY_CLICK, function () {
                console.log('mask clicked ' + type + ':' + index);
                displayRouteText(type, index);
            });
        });
    }
    return lineValue;
}
/******
 * altRouteDraw is different from alternateRouteDraw because it is specifically for the plugin
 * when the rourtes are to be redrawn upon choosing a new route.  Not needed for the webversion
 * because google maps api will automatically draw it
 *
 * @param {type} array the points that comprise the line to be drawn
 *                 this is already converted which in alternateRouteDraw it was not
 * @param {type} color line color blue and red currently
 * @param {type} index which line is it?
 * @param {type} type is A or B
 * @param {type} zindex - zplane for line
 * @returns {undefined}
 */
function altRouteDraw(array, color, index, type, zindex) {
    var lineValue = new lineObject();
    lineValue.index = index;
    //added closure for iOS
    function _addpoly(array, color, index, type, lineValue) {
        map.addPolyline({
            'points': array,
            'color': color,
            'width': 6,
            'zIndex': 2
        }, function (polyline) {
            lineValue.polyline = polyline; //problem, this is a callback
            polyline.on(plugin.google.maps.event.OVERLAY_CLICK, function () {
                console.log('polyline clicked ' + type + ':' + index);
                displayRouteText(type, index);
            });
        });
    }
    ;
    _addpoly(array, color, index, type, lineValue);
    return lineValue;
}
function alternateRouteDraw(array, color, index, type, zindex) {
    var lineValue = new lineObject();
    lineValue.index = index;
    if (platform !== 2) {
        lineValue.polyline = new google.maps.Polyline({
            path: array,
            strokeColor: color,
            strokeOpacity: .5,
            strokeWeight: 6,
            zIndex: zindex
        });
        lineValue.polyline.setMap(map);
    } else {
        function _subAlternateRouteDraw(array, color, index, type, zindex, lineValue) {
            map.addPolyline({
                'points': convertArray2pluglatLng(array),
                'color': color,
                'width': 6,
                'zIndex': 2
            }, function (polyline) {
                //console.log('alternateRouteDraw: added polyline' + index + ' for type' + type);
                lineValue.polyline = polyline; //problem, this is a callback
                polyline.on(plugin.google.maps.event.OVERLAY_CLICK, function () {
                    console.log('polyline clicked ' + type + ':' + index);
                    displayRouteText(type, index);
                });
            });
        }
        _subAlternateRouteDraw(array, color, index, type, zindex, lineValue);
        //console.log('calling subAlternateRouteDraw array' + array + ' color:' + color + ' index:' + index + ' type:' + type);
    }
    return lineValue;
}
/* note that each step is composed as
 * start_location (LatLng)
 * end_location (LatLng)
 * distance (local length
 * duration in seconds (or undefined)
 * travel_mode in this step (you might have to walk)
 * path (array of LatLngs)
 * Potential change... for transit routes, search around junctions, or stops (can they be found?)
 * Also some searches are pulling back too many options, can be problematic
 * Might want to add a waypoint in the middle so that the user can move the route around.
 *
 * For drawing purposes, as the steps are being drawn, the route can be draw by addeding to
 * the polyline which is an MVCArray but just adding to it
 * @param (type) steps is returned from google route
 */
function calculateStepDistance(steps, midlength) {
    var distanceTravelled = 0, previousTravelled, pathLength = 0;
    var currentCalculatedLocation;
    var increment = 50 * 1.75;//$('#radius').val() * 1.75;
    var pathWalked = 0;
    var pathLeftToWalk = 0;
    var distanceOvershot = 0;
    var searchCount = 0;
    var distanceTravelledThisPath = 0;
    var midlocation = '';
    //console.log('Traversing route steps-midpoint' + midlength); //this is the distance
    for (var i = 0; i < steps.length; i++) {
        //console.log('distance of step i:' + i + ' distance:' + steps[i].distance.value);
        //console.log('step' + i + ' has ' + steps[i].path.length + ' paths');
        var distanceStep = 0;
        pathWalked = 0;
        for (var j = 1; j < steps[i].path.length; j++) {
            //we have to iterate through the length of each path
            //console.log('i,j'+i+':'+j);
            if (j === 1) {
                currentCalculatedLocation = steps[i].path[0];
            }
            pathLength = google.maps.geometry.spherical.computeDistanceBetween(currentCalculatedLocation, steps[i].path[j]);
            distanceTravelledThisPath = 0;
            pathLeftToWalk = pathLength;
            //console.log('distance in path ' + pathLength);
            //case 1 pathLength=100, increment=50
            //case 2 pathLegth 10
            //case 2 step 2 pathLength 42, pathLeftToWalk will be 42-40=2
            pathWalked = 0;
            do {
                //record keeping
                previousTravelled = pathWalked;
                //update the path to walk before incrementing with how far overshot the last iteration
                //console.log('distanceOvershot check' + distanceOvershot + 'pathLeftToWalk' + pathLeftToWalk);
                if (distanceOvershot > 0) {
                    pathLeftToWalk = pathLeftToWalk - distanceOvershot;
                    //check for midpoint and search circle has to be made evertime the pathWalked is incremented
                    //there is two possible iterations with this logic that can happen when this path is first
                    //entered, causing the possibility that a search circle and midpoint be missed.

                    //only time pathLeftToWalk can be <0 is if distanceOvershot >0 and pathLeftToWalk < that.. when first entered.
                    if (pathLeftToWalk < 0) {//ok increment>distance
                        pathWalked += pathLength;
                        distanceOvershot = -pathLeftToWalk;
                    } else {
                        pathWalked = distanceOvershot;
                        distanceOvershot = 0;
                    }
                    distanceTravelledThisPath += pathWalked;
                } else {
                    //we don't want to run this in the first iteration
                    pathLeftToWalk = pathLeftToWalk - increment;
                    if (pathLeftToWalk < 0) {//ok increment>distance
                        pathWalked += (increment + pathLeftToWalk) + distanceOvershot;
                        distanceOvershot = -pathLeftToWalk;
                    } else {
                        //case 1 step 2 pathWalked=50
                        //case 2 step
                        pathWalked += increment + distanceOvershot;
                        distanceOvershot = 0;
                    }
                }
                if (midlocation === '' && midlength <= (distanceTravelled + pathWalked)) {
                    //displayInfo.midlocation =
                    midlocation = google.maps.geometry.spherical.interpolate(currentCalculatedLocation, steps[i].path[j], (midlength - distanceTravelled) / pathLength);
                    //console.log('midpoint calculated at ' + midlocation);
                    return midlocation;
                }
                //this is old code, we don't have to draw search circles because it's too resource heavy
                if (parseInt((distanceTravelled + pathWalked) / increment, 10) > searchCount) {
                    //the pathWalked might have been too far, we want to get it as it steps over the increment in whole units
                    /*
                     if (pathLeftToWalk < 0) {//if the overshot goes beyond the path, then the search is less than that
                     //console.log('CIRCLE pathlength' + pathLength + 'negative overshoot' + distanceOvershot + 'increment' + increment);
                     drawCircle(google.maps.geometry.spherical.interpolate(currentCalculatedLocation, steps[i].path[j], ((((searchCount + 1) * increment) - (distanceTravelled + previousTravelled)) / pathLength)), 2);
                     } else {
                     //console.log('CIRCLE distance ' + pathLength + ' distanceStep:' + pathLeftToWalk + ' prevous walked:' + previousTravelled);
                     drawCircle(google.maps.geometry.spherical.interpolate(currentCalculatedLocation, steps[i].path[j], 1 - (pathLeftToWalk / pathLength)), 2);
                     }
                     */
                    searchCount++;
                }
                //console.log('distanceTravelledThisStep:' + pathWalked + ' searchCount:' + searchCount);
            } while (pathLeftToWalk > 0);
            //console.log('-----------------');
            distanceTravelled += pathWalked;
            currentCalculatedLocation = steps[i].path[j];
        }

        //console.log('distance travelled:' + distanceTravelled + ' distance travelled this step:' + pathWalked);
    }
    //console.log('distance travelled:' + distanceTravelled);
}
function hiaMapSearch(locationData,keywords){
    var retval = $.ajax({type: 'POST',
        url: mapSearchUrl,
        data: {
            action: 'mapSearch',
            lat: locationData.location.lat,
            lng: locationData.location.lng,
            //this is normally
            //locationData.radius,
            radius: 50000,
            search_types: JSON.stringify(keywords)
        }
    });
    return retval;
}

    function ajaxKeyWordSearch(string){
        var locationData = displayInfo.mapCenter;
        var retval = $.ajax({type: 'POST',
            url: 'http://ec2-54-164-25-8.compute-1.amazonaws.com/postSearch.php',
            data: {
                action: 'keySearch',
                lat: locationData.lat,
                lng: locationData.lng,
                //this is normally
                //locationData.radius,
                radius: 50000,
                key_words: string
            }
        });
        return retval;
    }
/*************
 * cluterData and hiaSearch should be have similar data format and should be
 * the same for copying datya over, as well as the permanent marker search.
 * This is called after the placeDetailObject is created.
 */
function copyPlaceData(placeObject){
    if(placeObject.place_id===null || placeObject.place_id===''){
        placeObject.place_id = placeObject.id;
        placeObject.long=true;
        placeObject.formatted_address = placeObject.address_1;
        placeObject.formatted_phone_number = placeObject.phone;
        placeObject.vicinity = placeObject.address_1;
        var vendorData = [];
        if(vendorData.event_id){
            vendorData.event_id = placeObject.event_id;
            vendorData.event_name = placeObject.event_name;
            vendorData.event_description = placeObject.event_description;
        }else{
            vendorData.event_id = placeObject.id;
            vendorData.event_name = placeObject.posting_name;
            vendorData.event_description = placeObject.posting_description;
        }
        placeObject.vendorData= [];
        placeObject.vendorData.push(vendorData);

    }else{
            //this is the case where the cluster data is not set, and we
            //need the vicinity data
        placeObject.vicinity=placeObject.formatted_address= placeObject.address_1;
    }
    var position2;
    var position=new google.maps.LatLng(placeObject.lat,placeObject.lng);
    if(platform===2)
        position2 = convert2pluglatLng(position);
        //change with VenueObject? must have place.geometry
    var data=[];
    data.location=position;
    placeObject.geometry=data;
}
function handleTierSearch(){
    var request;
    request = {
        location: displayInfo.currentLocation,
        radius: 100000
    };
    var retval=tierSearch(request);
    retval.done(function(data,status){
        var retval=JSON.parse(data);
        permMarker=retval.data;
        for(var i=0;i<permMarker.length;i++){
        var placeObject  = new placeDetailObject(permMarker[i]);
        placeObject.index=i;
        copyPlaceData(placeObject);
        //the above contains processing for the entry
        //the following displays it, but should be extracted possibly to the
        //updateVenueMarkerVisibilityFlag... this attempts to display all
        /******************************************/
        function _subfunction(placeObject){
            console.log('displayed'+placeObject.name);
            var retval=new VenueObject(placeObject);//turn that off
            retval.done(function(marker){
                placeObject.marker=marker;
                });
        }
        _subfunction(placeObject);
        /*******************************************/
        //note that unlike google we do not have venueDetails[i].phpos
        //placeObject.marker=marker;
        permanentMarkers.push(placeObject);
        venueDetails=$.extend(true,[],permanentMarkers);

        }
        console.log('retrieved'+data);
    });

}

function tierSearch(locationData){
    var retval = $.ajax({type: 'POST',
        url: tierSearchUrl,
        crossDomain: true,
        data: {
            action: 'mapSearch',
            lat: locationData.location.lat,
            lng: locationData.location.lng,
            radius: locationData.radius,
        }
    });
    return retval;
 }
/*****
 * The difference between googlePlaceSearch(locationData) and
 * googlePlaceSearchList, is that the latter is designed to go through an
 * and perform a search on each latLng tuple.
 *
 * @param {type} locationData is an object that contains venue type, location, search Radius
 * @returns {undefined}
 */
function googlePlaceSearch(locationData,keywords)
{
    var service;
    var keywordSearch = $('#keywordString').val();
    var querySearch = $('#queryString').val();
    if(keywords) {
        querySearch = keywords;
        displayInfo.querySearch=keywords;
    }else
        displayInfo.querySearch=null;
    console.log('before getting places information' + locationData);
    //stopSearch has to be set=false
    // and venueSearchStatus=false before this can continue
    if (stopSearchFlag === true) {
        if (venueSearchStatus === true) {
            var _temp1 = setInterval(function () {
                console.log('venueSearchWaiting:' + venueSearchStatus);
                if (venueSearchStatus === false) {
                    clearTimeout(_temp1);
                    clearInterval(_temp1);
                    //_temp1 = null;
                }
            }, 2000);
            //wait for venueSearchStatus=false;
        } else {
            stopSearchFlag = false;
        }
    }
    venueSearchStatus = true; //searching begins
    if (platform === 2) {
        console.log('plugin search');
        //plugin search actually has a different search mechanism
        //uses google play store and iOS?

        //google search works for now with fake gmap
        //note that gmap should change
        service = new google.maps.places.PlacesService(gmap);
    }
    else
        service = new google.maps.places.PlacesService(map);
    console.log('searching');
    //service.textSearch() is also possible where query: is a text string such as pizza in new york
    //some bookkeeping before this is called, clear the venueDetails
    venueDetails = [];
        venueDetails=$.extend(true,[],permanentMarkers);

    searchWait();
    if (keywordSearch !== null && keywordSearch !== '') {
        console.log("searchString" + keywordSearch+ ' radius '+locationData.radius);
        locationData.keyword = keywordSearch;
    }
    if (querySearch !== undefined && querySearch !== null && querySearch !== '') {//note hae to setit to null when? closeWindows
        console.log('queryString' + querySearch+ ' radius '+locationData.radius);
        locationData.query = querySearch;
        service.textSearch(locationData, getVenueDetailsFromGoogle);
    } else
        service.nearbySearch(locationData, getVenueDetailsFromGoogle);
    console.log('searching submitted');
}
/**
 * This is the object for the placeDetail that is stored from the results of calling the Google function
 * @param place_id is the Google reference number for the venue
 * @param {type} object location is the latLng for the place
 * @returns {placeDetailObject}
 */
// callback function for google nearbySearch()
//note that results is the returned value from places service
var placeDetailObject = function (object) {//place_id, location) {
    jQuery.extend(this, object);
    //this.result=object;
    //this.place_id = place_id;
    //this.location = location;
    //this.marker = null;
    //this.long = false;
};
placeDetailObject.prototype.addDetails = function (results) {
    if (results.place_id !== null) {
        jQuery.extend(this, results);
        this.long = true;
        /*
         this.place_id = results.place_id;
         this.formatted_address = results.formatted_address;
         this.formatted_phone_number = results.formatted_phone_number;
         this.website = results.website;
         this.types = results.types;
         this.price_level = results.price_level;
         this.name = results.name;
         this.icon = "bluefeedmarker.svg"; //results.icon;
         this.open_hours = results.opening_hours;
         this.rating = results.rating;
         this.reviews = results.reviews;
         //in the future menu?
         //opening hours?
         */
        return this;
    }
    else
        return null;
};
/**
 * formattedOutput is designed to place the data formatted into an infowindow.  Should have the option to
 * create an invite code on it
 *
 * @param {placedetail} obj1
 * @returns {String}
 */
placeDetailObject.prototype.venueUiFormatText = function (obj1) {
    var string = venueCardSize();
    var photo = null;
    var string1;
	if(obj1.record==='postings'){
    string1 = '<div id=\"' + obj1.place_id + '\" class="card ' + string + '"' +
            '><div id=\"' + obj1.place_id + '\-pic" class="card-image"'+
            '></div> <div id="'+obj1.place_id+ '-text" class="center">'+generateGrid(obj1)+
            '</div>'+//<button onClick=\"transitionToDetail(\'' + obj1.place_id + '\')\" data-mini="true" class="ui-btn ui-icon-lool-info ui-nodisc-icon ui-icon-notext" style="top: -50px;float:right;height: 40px;width: 40px"></button>' +
            '<div id=\"' + obj1.place_id + '-special\" class="special-icons" style="position: relative;"></div></div>';
	}else{
    string1 = '<div id=\"' + obj1.place_id + '\" class="card ' + string + '"' +
            //'onmouseout=\"closeZoom(\'' + obj1.place_id + '\')\"> <div class="center"><h3>' + this.name + '</h3>' + generateBottomLine(obj1) +
            '><div id=\"' + obj1.place_id + '\-pic" class="card-image"'+
            '></div> <div id="'+obj1.place_id+ '-text" class="center">'+generateGrid(obj1)+//'<h3>' + this.name + '</h3>' + generateBottomLine(obj1) +
            '</div>'+//<button onClick=\"transitionToDetail(\'' + obj1.place_id + '\')\" data-mini="true" class="ui-btn ui-icon-lool-info ui-nodisc-icon ui-icon-notext" style="top: -50px;float:right;height: 40px;width: 40px"></button>' +
            '<div id=\"' + obj1.place_id + '-special\" class="special-icons" style="position: relative;"></div></div>';
	}
    return string1;
};
placeDetailObject.prototype.createClickHandler = function (obj1) {
    $('#'+obj1.place_id).on('click',function(){
        openZoom(obj1.place_id);
    });
};
placeDetailObject.prototype.setMarker = function (marker) {
    this.marker = marker;
};
placeDetailObject.prototype.highlightMarker = function (flag) {
    var url = VenueObject.prototype.getMarkerUrl(this.types, flag, this);
    this.marker.setIcon(url);
};
placeDetailObject.prototype.removeMarker = function () {
    if (this.marker)
        if (platform !== 2)
            this.marker.setMap(null);
        else
            this.marker.remove();
};
placeDetailObject.prototype.clearMarkers = function () {
    _.each(venueDetails, function (object) {
        object.removeMarker();
    });
};
/*****
 *
 * @param {type} place object from googel
 * @return {string} either a string with the rating or blank
 */
function returnRatingLevel(place) {
    if (place.rating) {
        var value=(place.rating/5)*100;
    //    return '<tr class=""><td class="venue_rating venue_label">Rating:</td><td class="venue_rating venue_value"> '+place.rating+'</td><td class="place_rating"><span style="width:'+value+'%" class="rating"></span></td></tr>';
        return '<tr class=""><td class="venue_rating venue_label">Rating:</td><td class="venue_rating venue_value container"><div>'+place.rating+'&nbsp</div><div class="rating_bar price_small" style="";><span style="width:'+value+'%" class="rating-www small"></span></div></td></tr>';

    }
    return '<tr><td></td><td></td></tr>';
}
/*****
 *
 * @param {type} place object from googel
 * @return {string} either a string with the rating or blank
 */
function returnPriceLevel(place) {
	 if(place.record==='postings' && place.posting_price){
        return '<tr><td class="venue_price venue_label">Price:</td><td class="venue_price venue_value container"><div>'+place.posting_price+'</div></td></tr>';
    }else if (place.price_level) {
        var value=(place.price_level/5)*100;
        return '<tr><td class="venue_price venue_label">Price:</td><td class="venue_price venue_value container"><div>'+place.price_level+'&nbsp</div><div class="price_bar price_small" style="";><span style="width:'+value+'%" class="pricing-www price_small"></span></div></td></tr>';
    }
    return '<tr><td></td><td></td></tr>';
}
function returnAddressLine(place){
	 if(place.record==='postings' && place.address_1){
        return '<tr><td class="venue_address venue_label">Address:</td><td class="venue_address venue_value"> '+place.address_1+'</td></tr>';
    }else if(place.vicinity){
        return '<tr><td class="venue_address venue_label">Address:</td><td class="venue_address venue_value"> '+place.vicinity+'</td></tr>';
    }
    return '<tr><td></td><td></td></tr>';
}
function returnNameLine(place) {
	 if(place.record==='postings' && place.posting_title){
    return '<tr><td class="venue_name venue_label">Name:</td><td class="venue_name venue_value">'+place.posting_title+'</td></tr>';
		}else
    return '<tr><td class="venue_name venue_label">Name:</td><td class="venue_name venue_value">'+place.name+'</td></tr>';
}
function generateGrid(place){
    value = '<table>'+returnNameLine(place)+returnAddressLine(place)+
            returnPriceLevel(place)+returnRatingLevel(place)+'</table>';
    return value;
}
function generateBottomLine(place) {
    var price = returnPriceLevel(place);
    var rating = returnRatingLevel(place);
    var address = place.vicinity;
    if (price !== null || rating !== null) {
        return address+ price +rating;
    }
    return null;
}

function searchVenueDetailsList(id) {
    return searchListById(venueDetails, id);
    /*
     for (var count = 0; count < array.length; count++) {
     if (array[count].place_id === id)
     return array[count];
     }
     return;
     */
}
function searchListById(array, id) {
    if(array)
    for (var count = 0; count < array.length; count++) {
        if (array[count].place_id === id)
            return array[count];
    }
    return null;
}
/*****
 * Open marker currently opens a small infowindow and displays the name and some small information.  Should
 * probably highlight the venue instead and change the marker to highlight it.
 *
 * This will occur when the user hovers over the venue list.
 *
 * @param {type} place_id results is the marker that holds the event
 * @returns {}
 */
function openMarkerInfoWindow(place_id) {
    var current = searchVenueDetailsList(place_id);
    var data = "";
    var image = "";
    //note that the only case where this would not be set is is if the user had entered the
    //venue in the address box
    if(!current || !current.marker)
        return;
    //display only the name of the place if it is in app mode OR there is no vendorData
    //because there is limited space on the app version (phones)
    //if the vendor is not tier 2 or 3, don't display the information
    if (platform === 2 || !current.vendorData) {
        //only display the restaurant name
        if (platform === 2) {
            current.marker.setTitle(current.name);//current.name);
            current.marker.setSnippet(data);
            current.marker.showInfoWindow();
        } else {
            infowindow.setContent('<div id="pointerMessage" class="scrollFix" style=\'height: 100%; \'>' + current.name + '</div>');
            infowindow.open(map, current.marker);
        }
    } else {//at this point it should be the web with data to be displayed
	if(current.imageArray && current.imageArray.length>0){
		if(current.description)
			data += current.description;//limit to 200 worlds
		image = '<img src="'+postingPicturePath+current.imageArray[0].id+'/thumb_'+current.imageArray[0].image+'" alt="image" style="height:100px;width:100px;">';
                infowindow.setContent('<div id="pointerMessage" class="scrollFix">' + current.name + '</div><div>' + data + '</div>' + image);
         //       infowindow.open(map, current.marker);
        //        $("#pointerMessage").parent().css('overflow','hidden');
	}else if(current.vendorData!==null){
            //will hvae to loop
            if(current.vendorData[0].event_description!==null && parseInt(current.vendorData[0].persistent)>1){
                data += current.vendorData[0].event_description;
                //the following will only work for web version
                if(current.vendorData[0].picture)
                    image = '<img src="images/'+picture+' alt="cannoli" style="height:100px;width:100px;">';
                else
                    image="";
                infowindow.setContent('<div id="pointerMessage" class="scrollFix">' + current.name + '</div><div>' + data + '</div>' + image);
      //          infowindow.open(map, current.marker);
            }else{
                infowindow.setContent('<div id="pointerMessage" class="scrollFix" style=\'height: 100%; \'>' + current.name + '</div>');

            }
        }
      infowindow.open(map, current.marker);
		$("#pointerMessage").parent().css('overflow','hidden');
    }
    return current;
}
function closeMarker(place_id) {

    var current = searchVenueDetailsList(place_id);

    infowindow.close(map, current.place_id);
}

//results is an array of placesObjects
function clearVenues() {
    hideClusterNavigation();
    $('#venue-text').text('');
    console.log('removing venue markers' + venueDetails.length); //note didn't remove from the screen?
    if (venueDetails.length > 0)
        for (var i = 0; i < venueDetails.length; i++) {
            venueDetails[i].removeMarker();
        }
    venueDetails = [];
        venueDetails=$.extend(true,[],permanentMarkers);

}
/*****************
 * the following routines will dim the markers when the popupMenus appear
 * and set them to full opacity once the popup menus are closed.  Note that
 * this required that the relevant markerObjects have opacity methods created.
 */
function dimAllMarkers(){
    _markersSetOpacity(.3);
    dimVenues();
}
function activeAllMarkers(){
    _markersSetOpacity(1);
    activeVenues();
}
function _markersSetOpacity(opacity){
    startingLocation1.setOpacity(opacity);
    startingLocation2.setOpacity(opacity);
    if(midCircle.cmarker)
        midCircle.cmarker.setOpacity(opacity);
    if(routeDetails1)
        routeDetails1.routeMarker.setOpacity(opacity);
    if(routeDetails2)
        routeDetails2.routeMarker.setOpacity(opacity);
}
function dimVenues() {
    displayInfo.venuesInactive=true;
    processVenueMarkers();
}
function activeVenues() {
    displayInfo.venuesInactive=false;
    processVenueMarkers();

}
/*****
 *
 * @param {type} event_type int 0 nothing
 *                              1 dinner special
 *                              2 drink special
 *                              3 music special
 *                              4 jazz special
 *                              5 comedy special
 * @returns {undefined} icon string
 */
function specialEventIcon(event_type) {
    var pre = '<img src="';
    var post = '" alt="special">';
    switch (event_type) {
        case '0':
            return null;
            break
        case '1':
            return pre + specialdinner + post;
            break;
        case '2':
            return pre + specialdrink + post;
            break;
        case '3':
            return pre + specialmusic + post;
            break;
        case '4':
            return pre + specialjazz + post;
            break;
        case '5':
            return pre + specialcomedy + post;
            break;
        default:
            return null;
            break;

    }
}

/***************
 * make this more intelligent so that it can page between the venues
 *
 */
function moreGoogle(){
    //clearVenues();
    displayInfo.pagination.nextPage();
}
/***********************
 * Note that because this can be in the middle of searching while the user reselects
 * the route and can cause issues.  Must stop the search if it is running and restart it
 *
 * note that if pagination.hasNextPage===TRUE then this can be called again... how to know that it's a pagination call and not a new call?
 * this function is a callback from only 2 places (currently), googlePlaceSearch and googlePlaceSearchList
 *
 *
 * @param {type} results is the response from google query
 * @param {type} status return value of google.maps.places.PlacesSericeStatus
 * @param {type} pagination helper  pagination.hasNextPage==TRUE then pagination.nextPage will return
 * @returns {null}
 */
function getVenueDetailsFromGoogle(results, status, pagination)
{
    console.log('venue details from google: more data:' + results.length + ':' + pagination.hasNextPage);
    //venueDetails = [];//venueDetails should not be cleared if this is a paginationRequest.
    var count1 = parseInt(results.length);
    var count2 = parseInt(venueDetails.length);
    var count3 = count1 + count2;
    var photo;
    searchDone();
    if (results.length === 0) {
        smart ++;
        if(displayInfo.querySearch!==null){
            searchForVenues(displayInfo.searchLocation, null, smart, displayInfo.querySearch);
        }else
        {
            searchForVenues(displayInfo.searchLocation, null, smart);
        }
        return;
        //popupTimed('Search returned 0 results');
    }
    smart =0;
    if (venueSearchFlag)//if search is running, then stop it... this is to prevent multiple searches from happening at the same time
        clearTimeout(venueSearchFlag);
    venueSearchFlag = null;
    //note tha tif it's over_quer_limit, keep searching
    if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
        if (pagination.hasNextPage)
            setTimeout(pagination.nextPage(), 3000);
        else {
            console.log('pagination error');
        }
    }
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        displayInfo.pagination=pagination;
        //turn on patination button else turn it off
        if (pagination.hasNextPage===true) {
            if(platform!==2){
                showClusterNavigation();
                //$("#moreGoogleMain").show();
            }
            showClusterNavigation();
            //$("#moreGoogle").removeClass("ui-disabled");
        }else{
            $("#moreGoogle").addClass("ui-disabled");
            $("#moreGoogleMain").hide();
        }
        console.log('Venues found:' + results.length);
        //must go through the array and search for each one, noting the time delta
        results = _.sortBy(results, "name");
        var queryList = [];
        //why is the stopSearchFlag === false?

        //note that this section does two passes, one for the results
        // the second to handle the images
        for (var i = 0; i < results.length/* && stopSearchFlag === false*/; i++)
        {
            var placeObject = new placeDetailObject(results[i]);//results[i].place_id, results[i].geometry.location); //this object will probably have to be created based on the place_id, so the marker is stored and when
            //the getDetails function returns, it will update the object
            //because this is a callback, it is done asynchrouns, so that what the callback is processing may not be where the loop is
            venueDetails.push(placeObject);
            //$('#venue-text').append(placeObject.venueUiFormatText(placeObject));
            queryList.push(placeObject.place_id);
        }
        if(displayInfo.narrow === true){
            //his should be done dynamically .card.outerWidth() originally 201
            var width=$(".card").outerWidth(true);
            $('#venue-text').css('width', (venueDetails.length + 1) * 220 + 'px');//container must be able to hold all the cards horizontally
            $('#venue-text').css('height','200px');
        }else{
            $('#venue-text').css('height','');
        }
        checkAdditionalVenues(results);
        venueDetails = _.sortBy(venueDetails, "name");
        $('#venue-text').text('');
        for (var i = 0; i < venueDetails.length; i++) {
            $('#venue-text').append(venueDetails[i].venueUiFormatText(venueDetails[i]));
            venueDetails[i].createClickHandler(venueDetails[i]);
	    if(venueDetails[i].record==='postings'){
            if(venueDetails[i].imageArray && venueDetails[i].imageArray.length>0){
                photo="url('"+postingHost+postingPicturePath+'/'+venueDetails.imageArray[0].id+'/thumbs_'+venueDetails[i].imageArray[0].image+"')";

	    }
		}else
            if(venueDetails[i].photos && venueDetails[i].photos.length===1){
                photo="url('"+venueDetails[i].photos[0].getUrl({'maxWidth': displayInfo.panelWidth, 'maxHeight': 200})+"')";
            }else{
                photo="url('none')";
            }
            $("#"+venueDetails[i].place_id+'-pic').css("background-image",photo);
        }
        processExtendedData(queryList);

    }
    venueSearchStatus = false;
    console.log('fitting bounds');
    fitVenueBounds(2);
    updateSearchBounds();
}
/*********************
 * function to find the events associated with the queryList if there are any.  Sets the flag if once
 * checked to prevent rechecking
 * @param {type} queryList list of placeId's
 */
function processExtendedData(queryList){
        /***********************
         * this query will get any events that the vendor has
         * advertised with hiamaps
         */
        console.log('called processExtendeData'+queryList);
    retval = ajaxQueryVendorData(queryList);
    retval.done(function (data, status) {
        console.log('retrieve' + data);
            var results = JSON.parse(data);
            for (var i = 0; i < results.length; i++) {
                var venue = searchVenueDetailsList(results[i].place_id);
                if (!venue.vendorData)
                    venue.vendorData = [];
                //vendor might have more than one event, therefore push
                venue.vendorData.push(results[i]);
//                $('#' + results[i].place_id + '-special').append(specialEventIcon(results[i].event_type));
                /***************
                 * If there is an event, then the vendor should  have a special icon
                 * lowest tier allows a special icon.
                 * If they hvae a location_icon, then that is displayed.
                 * When there are tiers implemented thenit goes here ie results[i].tier===1 highlight icon
                 * tier===2 it should be permanent (note
                 *
                 */
                if(results[i].persistent && results[i].persistent>0){
                    if(results[i].location_icon && results[i].location_icon!==''){
                        var location=vendorIconPath+results[i].location_icon;
                        console.log('vendor data:'+location);
                        venue.marker.setIcon(location);
                    }else
                    if (venue.marker) {
                        console.log('highlighting' + venue.name);
                        venue.highlightMarker(true);
                    }
                }
            }
            //update venue.vendorDataChecked=true;
            for(var i = 0; i<venueDetails.length;i++){
                venueDetails[i].vendorDataCheck=true;
            }
        });

}
/**********
 * getVenueDetailsMinute() gets detailed information from google, and updates
 * the venueDetails List
 *
 * should this also update the venue-ui?
 * @param {type} place_id - venues google id
 */
function getVenueDetailsMinute(place_id) {
    var service;
    var retval=$.Deferred();
    if (platform === 2)
        service = new google.maps.places.PlacesService(gmap);
    else
        service = new google.maps.places.PlacesService(map);
    //var placeObject = new placeDetail(place_id, results[i].geometry.location); //this object will probably have to be created based on the place_id, so the marker is stored and when
    //check if stopSearch===true remove markers?
    service.getDetails({placeId: place_id}, function (place, status) {
        console.log(place_id+' search returned:'+status);
        if (place !== null) {
            var current = searchVenueDetailsList(place_id);

            if (!current.found) {//note because of synchronicity, itmight have been foudn before
                /*
                 * Information in the place object is name, price_level, formatted_address, formatted_phone_number, website, opening_hours [OBJECT]
                 * Note that types constains things like 'restaurant','meal_delivery','food','establishment'
                 * should this object  be saved? in a hash table by prlace_id? use prototype and create an object ditching mostof the unneeded data?
                 *
                 */
                //when this is entered, the placeDetail item has to be found (prototype?), the placeObject updated with the detailed information
                current.found = true;
                current = searchVenueDetailsList(place_id);

                if (!current)
                    console.log("****** not in venueDetails" + place.place_id + ':' + place.name);
                else {
                    console.log('adding details:' + place.name);
                    current.addDetails(place);
                    //should the div bit updated here?
                    var string = current.venueUiFormatText(current);
                    $('#'+place_id).replaceWith(string);
                    current.createClickHandler(current);
                }
                //major bug... i might be one value but the return could be
                //associated with a different result, must search by place_id
                //console.log('details for' + place.name);
                retval.resolve(place);
            }
        } else {
            //current.found = false;
            //if the info is not retrieved, put a delay and call again..
            popupMessage("Unable to retrieve venue details, please check network connection");
            console.log('could not retrieve:' + place_id + ' because ' + status);
            //results[i].submitted = null;
        }
    });
    venueSearchStatus = false;
    return retval;
}
function checkAdditionalVenuesAjax(lat, lng, radius, search, venueList) {
    var ids = returnGoogleIds(venueList);
    var retval = $.ajax({type: 'POST',
        url: venueDataUrl,
        data: {
            action: 'checkAdditionalVenues',
            lat: lat,
            lng: lng,
            radius: radius,
            search_types: search,
            location_vendor: "GOOGLE",
            placeIds: ids
        },
        xhrFields: {
            withCredentials: false
        },
        success: function (data, status) {

        },
        error: function (xhr, desc, err) {

        }
    });
    return retval;


}
function returnGoogleIds(venues) {
    var string = "";
    for (var i = 0; i < venues.length; i++) {
        string += venues[i].place_id + ",";
    }
    return string.substring(0, string.length - 1);
}
function checkAdditionalVenues(venues) {
    var searchString = convertTypesToString(getCheckedTypes());
    var lat, lng, radius;//where to get the lat,lng and radius?
    radius = $('#radius').val();//
    var googlePlace = displayInfo.searchLocation;
    lat = googlePlace.lat();
    lng = googlePlace.lng();
    var retval = checkAdditionalVenuesAjax(lat, lng, radius, searchString, venues);
    retval.done(function (data, status) {
    });
}
function convertTypesToString(types) {
    var result = "";
    if(types instanceof Array){
    for (var i = 0; i < types.length; i++) {
        result += types[i] + ",";
    }
    //remove the last comma
    return result.substring(0, result.length - 1);
    }else{
	return types;
    }
}
/*************
 *
 * @type type
 * @returns {bounds} bounds array of all the venues suitable for using
 * in map.fitBounds()
 */
getVenueBounds = function () {
    var bounds;
    if (platform === 2)
        bounds = new plugin.google.maps.LatLngBounds();
    else
        bounds = new google.maps.LatLngBounds();
    if (venueDetails.length < 4)
        return false;
    for (var count = 0; count < venueDetails.length; count++) {
        if(venueDetails[count].record!=='permanent'){
            if (platform === 2)
                bounds.extend(convert2pluglatLng(venueDetails[count].geometry.location));
            else
                bounds.extend(venueDetails[count].geometry.location);
        }
    }
    return bounds;
};
/*
 * 08/23/2015 - logic determined to be faulty if results are not within search radius of zoom-14
 * In sparse area, while the midpoint will be shown, the venue results will not
 *
 * Changed 06/24/2015 if the free form seach is used, then the fac that fitVenueBounds is using
 * either the midlocation or startLocation1 which is not necessarily used in free-form search.
 * Main problem is that fitVenueBounds() is at the end of both searches in getVenueDetailsFromGoogle()
 * A flag might have to be set in the search to specify the type and adjust fitVenueBounds accordingly
 *
 * Changed 06/03/2015 changed to center on the midpoint and at a particular zoom level 15?
 * firVenueBounds has to check to see if the zoom is too close when there is just 1 or 2 venues
 *
 * if type ===2 includes only the search results
 * if type ===1
 *
 * @param (type) type - 1 or 2
 * @returns {undefined}
 */
fitVenueBounds = function (type) {
    if (type === 1) {//1
        if (venueDetails.length > 0) {
            var location;
            //var bounds = getVenueBounds();
            if (displayInfo.midlocation === null) {
                console.log('location = starting location1:' + startingLocation1.googlePosition);
                location = startingLocation1.googlePosition;

            } else {
                console.log('location = starting midlocation:' + displayInfo.midlocation);
                location = displayInfo.midlocation;
            }
            if (platform === 2) {
                if (location === null) {
                    map.moveCamera({
                        'zoom': 14 // 13 was too far either 14 or 15 note that 14 on web is further out than 14 on app
                    }, function () {
                    });
                } else {
                    zoomMarkerAt(location,14);
                    /*
                    map.moveCamera({
                        'target': convert2pluglatLng(location),
                        'zoom': 14
                    }, function () {
                    });
                    */
                }
            } else {
                if (location !== null) {
                    zoomMarkerAt(location,14);
                    //map.setCenter(location);
                }else
                    map.setZoom(14);
                //map.fitBounds(bounds);
            }
        }
    } else {
        var bounds = getVenueBounds();
        if (bounds !== false) {
            if (navigateFlag === 2) {//include at least the starting and end points if 2
                bounds.extend(startingLocation1.position);
                bounds.extend(startingLocation2.position);
            }
            if (platform === 2) {
                map.moveCamera({
                    'target': bounds
                });
            } else {
                map.fitBounds(bounds);
            }
        } else {
            var location;
            //var bounds = getVenueBounds();
            if (displayInfo.midlocation === null) {
                //note that this might be null
                if(startingLocation1.googlePosition===null){
                    //get teh center of the screen
                    location=displayInfo.mapCenter;
                }else{
                   console.log('location = starting location1:' + startingLocation1.googlePosition);
                    location = startingLocation1.googlePosition;
                }
            } else {
                console.log('location = starting midlocation:' + displayInfo.midlocation);
                location = displayInfo.midlocation;
            }
            if (platform === 2) {
                zoomMarkerAt(location,14);
                /*
                map.moveCamera({
                    'target': convert2pluglatLng(location),
                    'zoom': 14 // 13 was too far either 14 or 15 note that 14 on web is further out than 14 on app
                }, function () {
                });
                */
            } else {
                if (location !== null) {
                    zoomMarkerAt(location,14);
                    //map.setCenter(location);
                }else
                map.setZoom(14);
            }
        }
        /*
         if(platform!==2){
         map.fitBounds(bounds);
         }else {
         map.moveCamera({
         'target': bounds
         });
         }
         */
    }
};
function addUrlPrefix(filename) {
    if (platform === 2) {
        //console.log('adding www');
        return 'www/' + filename;
    } else {
        //console.log('did not add prefix');
        return filename;
    }
}
/******
 * checkTypes is a helper function that searches an array for a given string
 *
 * @param {type} string
 * @param {type} type
 */
function checkTypes(string, type) {
    if(!type)
        return;
    if($.isArray(type)){
        for (var count = 0; count < type.length; count++) {
            if (string === type[count])
                return true;
        }
    }else
        if(type===string)
            return true;
    return false;
}
function newObject(oldObject) {
    var params = Array.prototype.slice.call(arguments, 1);
    function F() {
    }
    F.prototype = oldObject;
    var obj = new F();
    if (params.length) {
        obj.init.apply(obj, params);
    }
    return obj;
}
/******************
 * VenueObject was designed to replace the marker

//note that the marker type should change depending upon venue type? currently only does restaurant
//the marker should be saved somewhere so the little window can be opened.
//how to control the size of the infowindow

//should transition the screen making the map smaller and details of the venue should appear
*/
var VenueObject = function (placeObject)
{
    /*********************************
     *
     * if placeObject.vendorData then this is not false but true
     */
    var highlight = false;
    if (placeObject.vendorData)
        highlight = true;
    var retval = $.Deferred();
    var reval = getIconAddress(placeObject);
    reval.done(function(iconAddress){
    if (platform === 2) {
        //change the default marker?
        //console.log(place);
        //different icons for the different type of venues?
        //icon: 'https://maps.google.com/mapfiles/kml/pal2/icon19.png', //drinks
        //icon: 'https://maps.google.com/mapfiles/kml/pal2/icon54.png', //coffee
        displayInfo.pluginCounter++;
        checkLoading();
        console.log("marker counter is at:"+displayInfo.pluginCounter);
        function _plugAddMarker(place, iconAddress, vO) {
            console.log('plugin adding icon:'+iconAddress);
            map.addMarker(
                    {
                        'icon': iconAddress,
                        //plate
                        'draggable': false,
                        'position': convert2pluglatLng(place.geometry.location),
                        'title': place.name,
                        'markerClick': function (marker) {
                            if(displayInfo.popupMenuVisible===true)
                                return;
                            if(displayInfo.eventLocationId===place.place_id){
                                var ret=closeWindows();
                                ret.done(function(){
                                    venueNavigate();
                                });
                                return;
                            }else{
                                displayInfo.eventLocationId=place.place_id;
                            }

                            $('.detailHighlight').removeClass('detailHighlight');
                            if (displayInfo.currentDisplayDiv !== 'venue-ui')
                                closeWindows(venueUi);
                            openMarkerInfoWindow(place.place_id);
                            //if something is happening with the window, delay putting the highlight in
                            if (displayInfo.windowProcessing === true) {
                                console.log('window processing set timer and wait');
                                var timer = setInterval(function () {
                                    if (displayInfo.windowProcessing === false) {
                                        clearInterval(timer);
                                        console.log('window processing end-exit timer');
                                        $('#venue-ui-container').scrollTo($('#' + place.place_id), {duration: 'fast', onAfter: function () {
                                                console.log('highlight added to [' + place.place_id + ']');
                                                setTimeout(function(){
                                                    $('#' + place.place_id).addClass('detailHighlight').show();
                                                	$('#venue-ui-container').scrollTo($('#' + place.place_id), {duration: 'fast', onAfter: function(){
                                                    $('#' + place.place_id).hide().show();
                                                    }});
                                                },100);
                                            }});
                                    }
                                }, 100);
                            } else {
                                console.log('no processing -add highlight' + place.place_id);
                                $('#venue-ui-container').scrollTo($('#' + place.place_id), {duration: 'fast', onAfter: function () {
                                        console.log('highlight added to [' + place.place_id + ']');
                                        setTimeout(function(){
                                            $('#' + place.place_id).addClass('detailHighlight').css("display:block");
                                            $('#venue-ui-container').scrollTo($('#' + place.place_id), {duration: 'fast', onAfter: function(){
                                            $('#' + place.place_id).hide().show();
                                            }});
                                        },100);
                                    }});
                            }

                            //$('#' + place.place_id).addClass('detailHighlight');
                            //see if tihs will fix the reraw issue
                            $('#' + place.place_id).hide().show(0);
                        }
                    }, function (marker) {
                        displayInfo.pluginCounter--;
                        console.log("marker counter is at:"+displayInfo.pluginCounter);
                        checkLoading();
                //because of closure, place is not updated
                jQuery.extend(marker, vO);
                var current = searchVenueDetailsList(place.place_id);
                if(current!==null)
                    current.marker = marker;
                //placeObject.setMarker(marker);

                venueArray.push(marker);
                //on platform==2 the iconaddress is not saved
                place.icon=iconAddress;
                retval.resolve(marker);
            });
        }
        _plugAddMarker(placeObject, iconAddress, this);
        /**************************************
         * infowindow has to contain more informatin
         * Google will provide
         * -rating
         * -address
         * -price
         * -opening-hours
         * -types [food, restaurant, establishment, store, bar]
         * html_attributions can contain events
         */

         //return the promis
    } else {
        //change the default marker?
        //console.log(place);
        //different icons for the different type of venues?
        //icon: 'https://maps.google.com/mapfiles/kml/pal2/icon19.png', //drinks
        //icon: 'https://maps.google.com/mapfiles/kml/pal2/icon54.png', //coffee
        var marker = new google.maps.Marker(
                {
                    icon: //    restaurantIcon,
                            //'https://maps.google.com/mapfiles/kml/pal2/icon32.png',
                            //icon: './images/restaurant.svg', //
                            iconAddress,
                    //plate
                    animation: google.maps.Animation.DROP,
                    map: map,
                    position: placeObject.geometry.location,
                    title: placeObject.name
                });
        jQuery.extend(marker, this);
        /**************************************
         * infowindow has to contain more informatin
         * Google will provide
         * -rating
         * -address
         * -price
         * -opening-hours
         * -types [food, restaurant, establishment, store, bar]
         * html_attributions can contain events
         */
        //some planned changes
        //click will open venue detail window, the google map
        //mouseover is only good in web version since mobile doesn't hvae hover
        var infoimg = '<img src="images/info.png" onclick=\"transitionToDetail(\'' + placeObject.place_id + '\')\"  style="top: -50px: right: 0px;float:right;height: 20px;width: 20px; margin-left: 20px;">';
        google.maps.event.addListener(marker, 'click', function ()
        {
            if(displayInfo.popupMenuVisible===true)
                return;
            //check if the current selected place is already highlighted, if so
            //route to this location
            //
            //
            //var string;
            //check to see if in detail mode
            //no transition
            //yes scroll to the venue
            hmenu_instance.popupMenuHide(); //note that with the above check, this can't happen
            if(displayInfo.eventLocationId===placeObject.place_id){
                var ret=closeWindows();
                ret.done(function(){
                    venueNavigate();
                });
                return;
            }
            openMarkerInfoWindow(placeObject.place_id);
            transitionToDetail(placeObject.place_id);

        });
        //note that mouseover and mouseout will only apply to desktop version, except for note that has a hover type thing
        google.maps.event.addListener(marker, 'mouseover', function ()
        {
            if(displayInfo.popupMenuVisible===true)
                return;
            var string;
            var data = "";
            $('#' + placeObject.place_id).addClass('detailHighlight');
            if(clusterCount(venueDetails)>25){
            //    if(displayInfo.zoom<15){
            //        zoomMarkerAt(marker.position,16);
            //    }
            }
            if(displayInfo.windowedMode!==true){
                displayInfo.venueUiDiv.scrollTo($('#' + placeObject.place_id), {duration: 'fast'});
            }

            if (platform !== 2)
                string = infoimg;
            else
                string = '';
            openMarkerInfoWindow(placeObject.place_id);
        });
        google.maps.event.addListener(marker, 'mouseout', function ()
        {
            if(displayInfo.popupMenuVisible===true)
                return;
            $('#' + placeObject.place_id).removeClass('detailHighlight');
            infowindow.close();
        });
        placeObject.marker = marker;

        //placeObject.setMarker(marker);
        venueArray.push(marker);
        retval.resolve(marker);
        //return marker;
    }
    });
    return retval;
};
function cacheFilter(url){

    var retval=$.Deferred();
/*
    if(platform===2){
    ImgCache.isCached(url,function(path,success){
       if(success) {
           ImgCache.getCachedFileURL(url,function(url,data){
           console.log('image cached, loading:'+data);
           retval.resolve(data);
           });
       }else{
           ImgCache.cacheFile(url,function(){
           console.log('caching image:'+url);
               ImgCache.getCachedFileURL(url,function(url,data){
                console.log('image cached, loading:'+data);
            retval.resolve(data);
               });
           });
       }
    });
    }else{
        retval.resolve(url);
    }
    /*
    ImgCache.cacheFile(url).then(function(path,success){
        return QImgCache.getCachedFile(url);
    }).fail(function(){
        console.log('cahce file error:'+url);
    }).then(function(file_entry){
        console.log('got file_entry'+file_entry);
        return file_entry.toURL();//fullPath;
    }).fail(function(){
       console.log('failed file entry');
       return url;
    });
    */
   retval.resolve(url);
    return retval;
}
//redraw the marker depending on the size, using internal fnctions
//called when there is a resize or possibly that it is wasn't displayed.
//does the opacity have to be checked?
//where is place coming from?
var getIconAddress = function (place){
    var highlight=false;
    var retval = $.Deferred();
    if(displayInfo.zoom<14){
        if(platform===2){
            retval.resolve(vendorIconPath+"Point-of-Interest-32.png");
        }else{
            retval.resolve(vendorIconPath+"Point-of-Interest-50.png");
        }
        return retval;
    }
    if(place.vendorData && place.vendorData[0].persistent>0)//indication this this is a subscription
        highlight=true;
    if(place.location_icon && place.location_icon!==null){
        retval=vendorIconPath+replaceIconSize(place.location_icon);
        retval=cacheFilter(retval);
        return retval;
    }else
    if(place.loolgroup_icon && place.loolgroup_icon!==null){
        retval= vendorIconPath+replaceIconSize(place.loolgroup_icon);
        retval=cacheFilter(retval);
        return retval;
    }else{
        retval = VenueObject.prototype.getMarkerUrl(place.types, highlight, place);
        retval=cacheFilter(retval);
        return retval;
    }

};
VenueObject.prototype.drawMarkerIcon = function (icon){
    if(this.marker){
        marker.setIcon(iconAddress);//for the web
    }
}
/*************
 * this will draw the marker and handle the various requirements, if it is dim, displayed or resized
 */
 placeDetailObject.prototype.venueMarkerDraw = function(){
    //note that this is dependent on the weight of the marker, a weight of
    if(displayInfo.zoom>10){
        //get the icon using getIconAddress, then see
        //how it should be displayed
        if(this.marker){
            //var iconAddress = getIconAddress(this);
            //this.marker.setIcon(iconAddress);
                if(displayInfo.venuesInactive===true){
                    this.marker.setOpacity(.1);
                }else{
                //set opacity 1.0 if displayZoom >threshold
                    this.marker.setOpacity(1.0);
                }
        }else{
//            console.log('orphan creator');
        }
    }else {
        //basically turn it off
        if(this.marker){
            this.marker.setOpacity(0.0);
        }

    }
}
/******
 *  update venue marker to marker.hi if true else back to base if false
 *
 * @param {type} types type of marker (bar,food,etc)
 * @param {type} highlight whether this is using a .hi.png marker or not
 * @param {type} record - is the type of posting (favorites, etc to handle special types)
 * @returns {undefined}
 */
VenueObject.prototype.getMarkerUrl = function (types, highlight, record) {
    var iconAddress = "data:image/png;base64,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";
    //'images/base.png';//what other images should we have?? note based on teh type we might want different markers
    var restaurant_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABLhJREFUeNrsWktoE0EYnt0Eqa+6WlEPmqZFVDylvhAVTETEk7RQsLcmKoIPsAEVRKjVk+ChUakHQRMvUlFI9SC+k0IV6aUpgiD4iA+wgtoHtqlJmvj/6W6wcbPZZGd3EpMPhlmy2Zn9vvnn//+ZWULKHJxRHXlr99uhwlILxZpxuxdKGErI9fFa6L8RQCTdCsWZx2MoxA0oHhBjpCQFEImfEUdcC87qLQSnA/lOqNooNokW4QIRgkUtABAXoApAsek0WCiCrygFMIC8BB+I4KLZoKmEyCNsjcK6j3dHB6hFCp5CG50GkU9rLjpZ9lMAXqQRKr/cvVnVc8iitStS1z9ffybRsQlVbeJz85bXpJ7J4RgbaEQHM4XRlyWxu/tEWgDE2zsvSP+5bkUhpOd+fflOnh3sUurXKkaaDmZTAEbfKZPRpWDZ1TCDPGJl8xbS3Hf+n98zySNeX3+SvlbAMdH/MPMBZ7KP5Gyi1jIyyaOV7Lh6BKzgB1m7bydMh8XZuhHyzDDpCQDK27KNPmLo5RtFM99x9eg/5LGWyH96NO3kbW17cr1KKysLaFS6iQ5MSQR0ctLIShaBv+G1RN6yy0YetFxI+QOlsKh1GhQqwPZcfwh57ineR8KIzOmwbPPqNPkckUCCnYUAOeM+WkDfcW/W+xgN5Bwi+o88yKt6Fz0EUGV2b+88T4kgF/qmTd8y4x5e50meTSIE8y6Zz///Toqw3tTekibcf+5Wqsa5Hh2L5JrzcghCQuRglQipAhKUnCKGNwSKgMJsat9r+KjTXguoBo7+nvvtkBRtTYU8pdwgD4RYCDBSCHkp3uM1WoLkJDWKMMpCgFCh5BFI/NOjgbST1ChCqKgFkCOPxDMjhQYRmAjQS4M8BRHCEAHChgsAnfaIa3LN5DWKcINlFFDsXApzashnE0HKFxTgYymARykaSHFdLXk5EXLkBj6t5k9jS6wt266QzkDh62hsiWlKhOAF0AqCDARw0zotopEJNhWSGGmAj+YBiWYBxJFwGCQC9YMRmkdjuC4PqF0qFwN5qosh8Vy/Tief4NaDPFULyLAGpxgdtFpDUCSv20cTun0gIW5WohDHiMIOchZgpnlRryNxQwSQ8Q92Mr2ZKpCZG5lhseAoDyJ5I74MYY56S60dSpL1e/CkzFERoCJARYCKABUBKgJUBCh9JJNJL5SBfJ8z/wfEcZ3hF9cb7rKygEQigV+qSKPu4DjOVzYCTE1N4XLbDxYQFMkXtGQuuSkQjcYEjpv+NBfIu00mk0dLeyUlQCQSsQNpmO/cCNQNZrNZ80ZJyUyB0bGxDpjzgUQyEUwSOuRLwgK+fh0STGazPzGVsCc4/uzcuVUdNNsvagHevf9gi8XjfsJxAs9zjoXzhWDZJEKhwVdtsVhsIB6Ph6HULa6pCerRT9FZwMPHT4XZVVXeWCzayPO8Z83qVW49+ysqAW5237ZFIpNenuOtvMnUtHHD+p6yWQt4LnU5JyYmApOTk+R39HfDti2be4zol7kFHDp8VKiuXtA5Pj7uxFT2wL5Wl5H9MxdgeHg4AMStkNG5Tp866TO6f+YCfBsaIkDecaXrcoiUE+ottVYoHUuWLBVIBezwR4ABAFg6BB5vgIBcAAAAAElFTkSuQmCC';
    var atm_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABUFJREFUeNrsWl1oW2UYPvmplVS2KFg7dRrXgOCYS+ZVx3CJV70QmskYgmhPRe/EJuiFF9Om4MUuhORiIoiQTG9kDBIRIXfJYHaobKu6DoROA51YOtd16cnaE/Pj+5yeE47hJE1yfmPywMdJ0vQ73/N87/O+3/fl2BiT8MnC8YD4cuP9oxcXzRqHzSCyPrpMU8M10ORrG9Ry1C5SS5Mo+Z4WgEi76cJSm6Xm6aILiDFPQuR6TgAiH6JLrEviSkLM6BURNh1mPUEtpPE4YY8IiZC0rAAi+azoc72QJBFmLCeAQeR1EcHeY+QBlu4ZtowAhDkDyUuIydYR5gkgDiLMmIOEFSIgxpgHD01A1DQBxFrvY8zFrJkRMM2YDzdNBKumA6eKzK+42NkzPMbspaY1VgpN90tTKI2GCqBE3vvIMSboeUcQQA/wZY65unqBWVhJ7joWIyxwWP7m4KOTzNSzH+tGHhh2PsRMPMkyk94PWm2tDRPAJx8YZt4oQGy0xopgtAXq2L/HJ4jQDtaKy8zNu5cU/zb+8DFmdMTbVj+w29LtjKkC1COg3UEX+FXm/I2w4GXg6H627mf0gfDuxA5aoVsB3NKLe9urbSWwb347XSeO2UaluL6WYfgKJ+QPKULwHn/TM59oIQAOKQK7lKc6svmzAjkQhWW+/OWtelRIyRP9nF8KC7N76rk4fda8v6W1jGYCqN4MgcTVvy40Hyx5VfIrrpjht498Lfwfkhn8LI8QJNRWtoKQDf4H8kYLsNg4w5dvJRUHm1k+IxA6dTAuzD4gfSZVD5CHCBBDIcP/ZzGEPKKAvNEW+LnxAyS0KxQJL+w7KSQ0EJIPdtTlFSJlQRQKYY5wh3AgBhtMju/U+EYxkWdu318WBFWCmoNTNTmgaTmTz6oUCWd/ern+HSxmEAEgLlUC5AIIgmhqZSkFpA1PgjihpdVXPRHWiY3vEAPxCcr2Ey3WDkq+X16/1Cl5QWszqgBwrlEAeFiq05Lfm45a5vsjZBskxczNM52OYUNtBKg6FKUo+EO+Cmt3J3iPyIIwvv/G818Ign1FpbGZx1sAP5xEzYoAIEItJS+JaCCEpNcMe0WhYBMpEXZBHpk/rraMqz4WpyhINW5JUefbXclJC6AucIJmP612/Ko3Q4QZ0QY++bqg3T3Clc6THhDXgrwmESBGAchn5XsEHWGtH0bEsoiVYVDNiswM8poJIBPB32qRpBLzWpPXzAIKlkBWm9PIEhB2Rq+nSPR+QAJCzHYpRF6c9aSenjLqERkc9xwXV46eXWYbFjpn1HNDhgigIEjg10zB9/uP92NTH40heZr6oJQpOPDU0wFqNbPHYWf6HAMBBgIMBBgIMBBgIMD/ALVazUct1JcCEHFWPI+Y6zsBiDyeVMMjc2nxTKIjOHuVeLVaxaYqJW6uZmw2W7JvckC5XA7RzF/DNpuuwW7J96QAfKkUJdIpajlqfrvdrmoX2TMW2Nzk3A6HHcQDNcYWGRpyxrXotycE+PvOnUClUknZdk4v/A+6hjU7O7C8BVZu/RktlyvZSrWyWKlUn3G5XJoenFg2Aq4v3XAPDT2QQMIjn8+PPTYa1eM+lhTg+8s/+Hi+RCFvg++DTzy+L9c3S+Fvv8uE+W3+WqlU2iiV/vF7xw/k9LyfZSLg088+d4+MjMR4fpt1Ohzxl4IvRoy4ryUEOP1h1FcsFhMU8h6Hw3Hi5CuhtFH3Nt0C0+ybLMdtZoscx2xtbflff+3VtJH3N12Au+vriUKhkOY4Lvhe5N183xxESL8LHDp0mGUGMA//CjAACh0scYCgYWYAAAAASUVORK5CYII=';
                  //unchaged
    var bank_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABVJJREFUeNrsWktvGlcUvjzsQGJULLWLSnWM46bvB1Y33VRAl1bU2tlXwV1UaqLK5heAF63UlfEvwNlUlSqBu6yqCqxu2qoVpJtumoZkkVRKJSYqJDAeoOebmUvGsWHGnRlmyHCkA8iMGb7vfOdx74WxqXnbfGO7U7GRpEd4gjxKHte8WyMXyA/IK+zyfOXpIKDYiNFjmnxTBW3U6uTXyfNEhjCZBBQbuf8B/EkD+F0iITc5BBQbkHbhCYmbNaTIOhFRdzcBCviyyaiPUkOKSKi5kwB7wdtGgs8i8Ch2VZvBa0lYsqo4+i36UqUxgWfqfUruUYBS7bOn+Zf4MwEWnfGx5HPB4+EV+6z2oMvqD3uyj7ANUsGeswQUG4jGLaPRj531s+r7ERm8Edu7I7KN3x7amgpBkwRunUb6iGjm90csQZEHGSACahggOlSiDzv4R2KV+5JeKqyBJycVgOjHjF6efDbIsq+G2Ld3D2WgWsAyIg0hSI9FImmEApT54PL8ijMEKG2vOjJEBGjrxTPsw+dnjkTaqFVIBakfm3qXLZkZkMykQFKv0JXePSdLHdLP3+ywBxRxRHWNCNGrAwC/+2fH6PfYc4KAt0dFvvzenPwaOQ/wkD/IyP3RZhl6f+etMEufn5VTANdoawDIg6NW7N871K2tThXBoTcGOJAA+SKSeL1JqQBQsXN+lqfIIrcBeGv5zICsk1RgwBJuGISOtDpEFi2MA0Drg+yRCtlXQvI1XB3Dej3IOTBGAHNKAUNzH3b9tniEFN4C8Qxw3CBxqEBb7LRpMHkERAMDEFqQUACUAFWs/9QakHC7pSgA7VE7JfIUQP2w0yxPAYyyPOrcAJjXAxRDtMZBwZz1DWYEuLY76IzC2onQEQXUTmqFPO8BhqsA7fCGOvgcq2B0Hf6+q0aaT38Aj88wYDecIuDEG/OFDKo+CiGXNVKAp0Ne7e886iAgoYJNqO0SDjL5Z+gEwpFJMKYuhI4ZwCLqIAPSB8Ac5TjA8WIHUtD+Rg1EIAvpo2PzZhZEZtcC5WETYeGds3I7hBq2afgBGBAht8nFWba5rNSB3ROKXJ0KI8jTFtJhHBH4dScXQ2mmbICyYUrAUKQtiNpagbZoAOQoS5k9Q7BiQ0R3RQgieHtElwB4k8BlDgl8yg07QkiBMhu/paw4QbJqUxRpkB4jeJwYZdyxJ/h4awwqiI8BvOlNEOsnQaUNpcz2ZIPDV8rKD7T6ZMhOJSDf160+LLXncLTY2GHKhqlVtm3XAamdp8PoDlm9rTMDUc9YfR44HgKOEnGFKVvYRrbQBXnCw+8DxvBDifH9QuQxGagP0Zn7d674281oZ+G1irqwEtQKX2FesAvnF3PkZae/h5953KYETAmYEjAlYErA02D9fj8K9yQBBJwf1Wc9RwCB31LBC/KiySsE9Hq9KDl+LYaVZ97n862Qn3qpHJxE8N1uN06RLxDgGD2v+/3+fc8UQVE8TBNovoZYMQN+oghotVrRR+12oc/6hV6vvx8IBAC+bvZzJyIFGoIQU/M9Rr4RDoX2PDMH3L3395okdatSt0uFr5+yErzrCbj5162driSVyPep8KUikTnLt8ZcmQI///JrLBwOlSRJivt8/szCwgt5u+7lOgK++/6HpCiKJSpyAnr7yy9dtPWswVUp8NXX3+Q6nU65I4oVel55843X7T5ocYcCPv/iy+hcJFJqt9vJYDC4/cGl1dy47u04AVevfRZvNv8tU09nBD71cfqjimeWw6FwOC4IQrXZbNbIl659+kmFecWwLX7xwnJ/dfVSjnnRiIAkeZpNbWqO2n8CDAA1Z07lm89QMAAAAABJRU5ErkJggg==';
    var restaurant_hi = "data:image/png;base64,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";

    var gas_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABIZJREFUeNrsWstrE0EYn93Nwwe1WxAVlJr2qGiTW8GCiUJLT21PHm3Ui+8W/4C2UgqekoI3H0nRS0FIFEEUJCl4EEVaEVQ8aNTqxUdCpLVNNrt+k06kLckmm53Z3Tw++FhKpjPz+83vm8c3g1CDG2dkY3+vt4vw8YK7wbvAxU1F5sAT4PGtF74k6oYAAD4MnwHwQQ3/tgA+DR4FMlI1SQAAx4AD4C4d1WDwE0BCsGYIIFIPaRzxShThByIWLE0AgMfxHdE56mpqwCRELUkAAR8rMrnRNkxC2FIEAHg84vMGgC+YD0iIW4mAebK8FTV7zxgSuk5VVJf87TnKRE8gzrkDcS37kPzzbalw8OhdLnlK4MfVwGOrFHy+U3u717yjFzkGZxG/80CxYoWJ1lwFEOl/Klduy/nP+a/yZxEp6cXincEjTsBiBWAlFAjI/11cCUN6JkUbBQGMaSmcme1Hymq6LFEFk14G8iRgL0ECbj9qSgiQ9X5Yy/+ogVc1UAcmoYi5oR9es+YAmhud4oStDxcgoYSdNIuAAeYEwJyRfXqlXDHTFKC5Ya70KG74zdZ1+v/sn3t/D0nPJtSqdZHJ2LhJkMS/5k2P88ybyogC8DjmV/GkCSoosQJsIIEcpQ1TgJul9AuyFzp7mfaHRxa2/Kg7WystLtYdAUZYkwCdCQorWdxQAljm6XQkSwwPgThziZK9gNDRl18OS4GvNlWml4D7LMHnXt/KH4nxAQkfp6UXgVJFTTsN4oYDzAj49AQpsBHiO/uQ/PGx2mao6oHQpQCSjYmW2/ri5EY10i9kg/DIq4BP6MkH0FgGp9V+tPffKHWMVZdmzxhynnhUSdEJU/cBJDEZZhIDKgenwlKsNztso9TVUZIbEItNZPL351XmAr6WK+LX23GaWWF8GJk3cN2ncjdAbStM1mG/QeCDtC5GqJ4FSKf81e7KKg03aGeUVmWsLkdxOIQo5wyo3wsyOw2ScPCRJYqGGrCyOmiDZ6aATWpwobXU+WWNSYsU2WRNsHwtYvQTGS9aS6QeJWSsD5EEcayeORajbUnrbN8fAx+vxYRIXViTgCYBTQKaBDQJaBLQJKB+TFGUkYYkAICL4PiRZgC+3oYiAAAXslH46+M4Lt4wBMiyPAIEzJODVIcW8DVNQDabFXO5XATA44uZIADHI68592CrRfCrmYxbURAGLwLoIZ7nTb0YMdSWlpaGQfYxBSkpIMAjCIKuvEHNEPDj5y8xmUqFAHxIkeWw0+Hw2O32hN56ayIEvnxddEuSFOI45OIQ529paQk3zEbo3fsPg9msFAMCkCTlfKLYGqZZv6UJePHyVQBm+4gkZaNAgm/P7l3Un+VYMgSiDx66tm/bHslksm6B5/2HDx0Ms2rLcgTcvD3jXVlZjQiCLcXznKfnSDfTx1iWCoHJqWvjy8vLMfA4uOf4MS/zl2iWUIDD6Ww9d/4iAF/y2m220UsXzgaNatsSBIhtbSPpdDpltzt8U5NX40a2bQkCksnkQvL3b9/dOzNWe3vI3jrb97vBXWa1/0+AAQCPzKyyGYBCeAAAAABJRU5ErkJggg==';
    var cafe_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABHlJREFUeNrsWk1ME0EUnt2Cloi46lGBxb+oUbOcvJjY6klNtHgRYyKUmKhRI5xM5ABESQwX8MjFolGsB21NjD+J2hI18b8ewAOCEI0/MVpKoNKWlvqmTI1BpPs3O1vbl7zMZboz73vfe/PmTXmU41Jg5GJL3RcEGCRQkWha/KChH9V1b4wGgDPAaGxwDahjhtGzSYiAcRHA8GY1AGC4DYYmUJvKTwyDtgAQXVkFAKG5i3hcD8FAVNEKD54C3Yd0NB6RsAnAt+tNDQBssBYGH6hAia3tsIbLlAAQz7soGp+WWlir3VQAwIZE4nmjpJ6wzTQMMMLzs4WDyBwA4gkbMl4w4O1mYEATwyrWQWoNNqUw8X5GGrZWbkaH16xX9O3RyRhaeeOKnKk1pHJkwoA9ciZtEJYo/vCiwnkp4L7vc6LBvQfQ/opVc50KguEAkEUdNPmdZg0G4yyAMVcosGAA9cSHw+Dg4wfoY3g8BcIcspUFAJLcib2hoKoFnnz7mlIZ3xBZAFAud+KH8Jjqzd3ctgOVLihGnf191Nio9hQQlXhSjexcVpYaO/vfoqtDA9RCjXpHCNMXxzH2pFxp65u++bqH3gGDxqnuz5CWWGPgGbq0ZbusuW7wdltvwLBqSm0OUNScuP3pQ8owOWzBYCmUEAsARpX+4PjzR7+p/a9csefhndTxR9MZeoWAX809AFMbx/XMfDAai6k+LpkA8KO6zg/VYMYsLjfu5woJ272bmab1sLoLeDPF/QmgvRbjcUhkin+t7XMtp8D5THU4Pr8xvasrVmcqZ/8yHoeLjHyg+e1AU1scwiCgpCymIBXAgGGWDZEGhsZ3aDVeMwA4GepBQxWCDW9hWQj9KU6tR5EKwS9FIVMAQDbi1FqRKQFcz2cyXR5GyIbsBoDg1PuxVLenMQJCBaVwwMDaabwUU3keh+OxGYaTSJ8HEy/xPBV20fx/gEjuCw6VQOATpoWcNNTEiH+IpDvIuI1uywAGNhYX/149znhTAPAPQKSi67dquLFx6WdtNS6mho0y2DSyoqy8GdTHeh88ynHJA5AHIA9AHoD/QpLJpIA1JwEAw3FXCnenXDkHABhfT4wfJtfy3ABgampKAPWg6T9LdXAcZwdVfGEqyEbj4/G4BJ53gcEijFU8z6tuy2UdA2KxyVowOl1CV2oxPqsACIfDwsTEhAt7PplEXovFgo3XfIHKihAIjoxIicQUzvAi4jhn0XxrV87UAZ8/f3HE4wlfIpFAAIK9yKqf8aYHYGDwfXs8kfCA8V4Y7SUlC3XvN5oyBJ4+eyFarVbP5GRcgkzvLCtd3kVrLdMBcPfefRtkeg8kuRDPc5Xr1q6h+uhiqhC43H2tORKN+qLRqB/Gyk0bN1B/cTIFA860nhOKi4s9kUjEVlhY0ODYvavDqLWZA3Dk6DFpfGzMx3McAtrbD9XV+I1cnykAVmuRFBoZCfC8xQ/Jrqrx9KmQ0XtgCkAkGhGCwWCL293dzGoPFlYLL16U6l30vHz9qgPlhZ3kfE/wlwADAEv0r1TEIJJaAAAAAElFTkSuQmCC';
    var bar_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABLhJREFUeNrsWk1oE2kY/maaSX8kcYp1EZU1/lRWdDVlFUEPJuCe9mAqoniQtldFbE9b9GALKt6qLOtBhES8eWgiXsVEdlfY9eBc/MNL6s+lrZq0xGSan/F9x083lCQznfnmJyQPvJSSmfnyPN/7PvN97xdC2mhtcFYP0H93RoQ/EYhDEAGIUI3LJBqPIFKvj29KN70AQBzJXoQYNnB7AuI6CJFqOgHojE8ZJL4cKMCIlRnBMSaP6R2HEBk+NgMxBiLEXC0AkMcZj1qYrTEQYcSVAthA3jIReAbkI6zJb1jlUaMGhmG8UdcIQJ2eKXm/wJMbB/rI0cCqepdMUa9xRQZEGRseubpvDVksKuSPZ1mtcZ31ADoLyXqf71/bteJnHt7QTYb6feRUapb8O1fQunwS/GDCrAAeE/derPcBkji7czV5mSnqr/ueDuLz8uS/OZn8ebBPFeFFZqnRLUMQzghAa79uHSJxrOXL0ictEt9N796v68gVuB5xPthLFooVrdsC+PYxuz4w6gENV3mYvkj+TugHVQgtoOk9eJ8HsYoq+fEnH8j7XEnP9zjiVAkc0rrg9utFskP0koe/rf/u7lrujx6A96EYOmH6bWA0A3QNjCmNM7m41DidMd3V+p+Vtdx/OUQog6CtAtD61wUkdvrxvEqukRegQCgUpr4BiHZnQGAlFyOxM//Mq+VQSwT8HAUaf/JRj/ExLwPTS2E9+GaKKEK1uf1P/oOut4UV4O0aCM1tOp1TCeNMfyO/QtNrXgFqmaIB06uFtN0CSEYHqzZFhEHTc1YAWHllaJfGEDADcKU4PZMzanrMJsRMCaSIO5CmE2K7APdcIkDCKRNMmCkDli8XRwSgaZdwmDweoEhOZYDakHA4CyYdXQfQw4rrTtU+q1MjUwsh2pKy+42AwjNrjXsYPGMQ4qnWJgn3ATtEQe3+/AR/fcLXdiTuAbARorMBgiU3aPbVVw1WByO4J0/W2ppeCPaqPUI9wJUh7hcakA+zMD7mAlT1CfBcMLh85vW0xRDvPpfqZYIl5JkKQEXADMBuMcvTmxTrtLdMgCohQlQIM80KNDs8FbZ0vWHpL0SoENi/jxD9rauE2j6wmLgtAtQQA/1BVN48H+J6/IT0bcRZflS1snPLJstabPlxUxJiwg3fhSctjrYAbQHaArQFaAvQzFAURYSYwr8tJwCQDtKt+DBZ4Zll0wsA5IfpFhw3SQMcx0ktIUC5XBYrlUoUBMBfiiWAOJJPG32ep5nIF4tFTHkkHwDSIxCxljHBgixHFIUkYfbx3zDP8zEWz20KAXK5HLp8XCFKAkQId3R0MOsMuboEZufmA4LHEy+XK5j6I91dXTHWY7hWgJk3b0PlUikOdZ4hHBnw+32SFeO4sgRevHw1USqVkhApiIFeUZSsGstVGfDX34/Fzs7OOLh9CExubOuWzdesHtM1Akwn7ofy+UJcTUueD+/+eVeqZfYCN29FR2VZThbkgiTLS5v3/jKQsmtsRzPg9/ELos/ni+bz+YggCJMnTxybsPs7OCaAXxT3ZLOZpxzPiR5BGDx39rQjvzdwTACv1xtZyGYlmPnw1SuX0qSVgG3x7Vu3xUkbbTiOLwIMAHjc6zqDcUfVAAAAAElFTkSuQmCC';


    var doctor_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABQJJREFUeNrsWktsG0UYnl2vcQK1sxKnNinYFRySVmrModATtlQop5K2SntBqiMOVIjSuBXiEKQ4Ry4pjwMXKgPiVAS2KiSoQIo5AIVLzAEKKhJVG26kjU0t2/E++P/VbGuU3XV2d/bh2p80mniz2tn/m+9/zMwSMsQQQwwyOL8GWp94QoRumv7EHn9X6O/qo2t/bjxwBIDRaOgpaJku481wA1oZ2sdARrWvCQDD0eBFargTIAFLQES5rwigMi9Cm2H0SHSROSDiRugJoHJfob7NEhuUBE/UwDMyPgfdqgfGE/rMEh0jfAqAF0O5l3yKWaiEj0JDgIeyt0KaZZZw6wJFn40n1B2YjSm4mP35beT2/7M9MU4iuye2XJdvrRFl7e/tPiZJU2w+MBegM/CXndmPHnyaxC99SuRfrxG1Xr9PChDCJeKkdviIHRIQKRbp0akCcnalLwAB7c++II1zb27539jXl8lDh58jrYu24ttZFipwSsCpXjdE9k5qRt1TwDMHtH703OtbZTiWgHsPab2O9qXPeykix4IAzoH8k1T+pni4sEBGXnaftlEtqBoLZMENKn4rwLK+x5m0Ml768SfSufrz/fufP6SpxQiPLL9NOnC/hRIyXStK39LgfksCZo8bXsfA9++Jl0gd2uaVbzQisK+9cMQwLuiInThuNdyzQcQAy9THQ0Q3AhqOGUCb2cUFLSgiCXhdlznOuN/g/RgEo7tuvBmQBCSE5WR4WgjZQefKt1odgLOu536917MCRv1NuE+/x8ZCKfwE6HXAaP7MlspQv4azL/92zclSOfwusO2cbBI/euwc+U7Ad7YHgZluLr9Hbu9+Umu6r2OvX8N0F+0qnMKsANv1N/o5l0j0JAlrCJv4JQgCKk4UgNXhvWIIfB1nX6I+j+TEP/ygJ0kGcL1NZjsI4goMyuGqWQrCKs8oksdmjxFhalJLic3l97XCCInB66gQ/NsICiyVzZTIYmPE6XI4RzdDDAJZgiRg2WtW3tqBXiiZALfNC4EQQEm4Y5aHkQSUvLbCsy9rrfbHwggDp0XwS7E4TXJDgKkKfACT2XdVB9Dd2UoAxmMWeicsa4E5FrnYZt4/yvIg1RUBdE8u6yMJedYHp0yOxnw6H2B+KMKMgC4S8IQo6ZHsPYk3zBZDVJpplgGKVnopr4xnqgADNeDhhdNj8gpNdZ5nGa+/EElSEl4kvT+WqFLD3/XyewBfCTBRhhYoT/PSSlbl8ydVvuLnJzGhwZ7HHlehZYJ+D/5BIFNVVRHa/EASAIbrNcgiEjFQBIDBOWo8Is1x3MZAECDLsqgoShEIwNVoGQxH4x1lDqHfjJckKdlVcc6B4a7K475SQHtzc0ZR1VWYeZR/lud512uDviGg0WhcANmXwPAyGh+JRJjUDqF3gX/W10UhIqwoijrNcUo+NjLCcq0RbgJu3lrLSB2pRFeE6Xh8B/OKMbQu8Psf1wsQ8FYkWa5IkpwWxTFPyuXQKeD7H66KsVisJEmdDAS5pT2pXQUvxwsVAZe//Gq62WpphQ0Yn923d8rz5XBoXOBi8ZP5ZrO52m61q5DuUk+l91f8GDdwBSy8tSjuiMeLYPxMNBpdOjl7rODn+IESsHN8fLperxU5nhcFQTj62quvlP1+h0BdIDYyeqFeq2007t5Nv3F+vkwGCbghMjU5VQz6PYJ0gWyr0Ri8rbAhhhgiVPhPgAEAZ3DmApP9/tMAAAAASUVORK5CYII=';
    var dentist_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABEZJREFUeNrsms1rE0EUwHe3TaoplD3UYg9q9CrY7V10FxGv6UEQDzZF8VoD3k0FQVRIehNBkt6kIol/QeJJRWzjwY+DYqpQQbTEmDRN0258r05KLLaZ2Z3d2Tb74LGQTGb2/ebNmzdvIkm+dLfIbg30Q7qnwUMHHQENb/m6CLoAmh+Uruf3DAAwGg2dBI38x+jtpASaBZ1xA4bskOEqPBKgUZtdIYAYgCjsGgBgPM52ClTl2O0UQIh7HgAYj7N+zaHJQm8YAxAlTwIA41McXL6T4FIweEJQOM6808aj4E6S85QHkDWf2XEQtU/qTxhSX/T45mdrhe9Ss1SXAvqhzc9Wsx+l2tTzje86SBK8ICYcAIn2n3cKeGi8On9JUsIDVH0ilLIxSwPB4LFN2l0CiU7RHmee1vgWsFBCpx1bXAwgSU7Hdd/u4rSCv0EQneIBvENUpAdMUg3AMPvt0qsN0TQbFwkgQrumrch68RdNM514orsAyMGGauBG/itz/2axvKE8J4K3B+i0DVem55g7r02/Zmk+IgLAEdqG6AEUW9o/S6aefsvyLmERADSWxixegMYzxg1dBAAmwQyPGsDMW8lNcQUAzijtMmBZLrsGgJfFKgDmCg1lYkPdbkudwHUAC3bJY7DDk9//zgKMYqs20GujOmMrJlRjuY1n3/hxy+kykWeuewApUlomj7tCa6vjEPWFLAGULEvj9uhuLpS3TZUZU+eC3YqxHQBTLI0bTz9xzReITAvbBoF8kcULasnXHTM8xnNDEd4hLToPoK7LtQLfVunRDvw1PjnH6v7ia4LkaIz3ANTlKdznzdLK5nEXdwBF3ceaAWZh9sc8AYBAcONOoD0J43Y3wCsVjlnJDi0IGj3muYsR8kIG69ZoYeZHSfDlJk5cjsbhcYNztwh2gve9oCMACASNBEbdZlc423g97phnOf0HCQTQ+oMEq7tP89jnhQJoA6ESCFjAbFWUw22BrUBm+w3Z4orSXpdjh4/EQXOi38OvCPkAfAA+AB+AD2APSLPZjIBqXQkADMe0O2Mh47RcFveK4Zhh5kh2GZNlOdk1AEzT1AFABozGVHoUnoWuiQFra2txMB5nPg9Py8bvOg9YqddVRVYyYLQORk8pihK32+euAVCpVLSmaWZMRVIVSTF6enryXbMN/lxaugZrfh60CBCOBoOBPK++Pe0BxYUvaiAQSK2vmxFZXk8ODAzEeI/hWQDv3n/QINilYK2HFVkeGzow6EhZzJNL4MXLV9HV1dVco9HAiD86PHzQsZqgpzzgSeapGgr1J+r1ehRmPq2NnJhwekzPALj/4KFWq62kYGsLK4o8cfrUyXTXHIbiN29FlpeXc6ASQDDOnT2Tdmts4QAuX7maqFZ+Z6qVSrZarRoXL5wvuDm+0CWwPxTSy+WyHgwGY3fv3E6KeAehAGq1Wunb4qLxePZRQfLFFyHyR4ABAHXum+09oe3/AAAAAElFTkSuQmCC';

    var clothes_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABIFJREFUeNrsWktv01gUPrajkBYIRswseIgmIJAooDZsBjaQ8NggFimwQkIkLGBGLGgWsALUzLAYzWgU+gdIEag7SBACdsQseEooQUJIIESL6GiERDWZiuZBHp5z0wtqoYlJfG3f4BzpyHZi+9zvu+dxHwboSEdsLYLRBia9Zzx48KPuQP10PlsU1CzqXdTksrHz498FAQg8hIcj8wDWkgzqMBIx0pYEIHACOE57W48QT4ggEcm2IQDBx/AwyLiNhIAwEpHllgAELuMhhdpvUEeRsAgYQYLQBuANJUFk8I6ECeCB2khRwvkgABsz1EKW10tCjIsQQPCkMWmt+5x7NoDzoA+Erm7IxxQop1/N+d+xeT24rx+G8qMxqExkIffbLVCnClqvHWBVHRw6ntXsie6ze8EV3vb5upxaB2pxGirP/5lxvxVLwbm7d6YhP3lRZwibOnTx8z0NbCct8wBa61ON7ln4535YcMA35zc1W4Ti5WdQevy6du7c1QuuwS1fPUs84MPPo1B6ONbIRJjFYKlVAshAJzTvC92uGnjSk3pl+tQ1KF6tG2UZJMBnFQFqPfDu0aMg9S5nlqTywynUO/X+9uqdO4gtur8p4Il0nQzMySNfiO4K1EoZrGtUXLWUed0jybBBGOywgoC++X4kiYtkb5ZSS4anE43KoscKAuRGvUXq+GwA31DT6wqpBBrlUDcBDtYuW4g/AMdWb+2ckLEIKwKp8c0kPSLViX+1yiCfBNR67viozsx/x7SxtQicibiqqblOxgoCmqq7zbg/Eak5ArJWEPCGI4exxAMUjgh4ajoBOPRUWLhe3QatbGowlbTCA5gYZpAEkyyWx1olIMqB+w9bVgbpDExzLs56YjQ7D9FQtHQcENXKBSLOEFuao2s/F2HFpK5lcbr9FTfZ9aPY+0NcEEBJqLs6ZICMIPgwV0Nh2qARE8BnWLo+07mACSSQd/O5NfZFOARpTmC1e5OlMX/BKGaN2B4n4GMM8gIZbEWM/mDCyA8kyGLFSdRgEwsXWQo8ataXIoIZRug2mh+1B+hG6hP1nX+tIGdkWKDQGSYZ3GTALrJmdY+K6re6HSLYXDoEdAjoENAh4LsQVVWDtiQAgXtQye5pgpzbigAETMYRaTr38AmCMG4bAqrV6hDMfKajUPAtjSId7Qa8XC7LCJZ8m+hHD4iIoqhrpthWBBQ/fiSgE/QyIEmSYpsqkMvlBtVqNVVV1QyS4GUBvi084P3kpOyQHPFKpRoEQYh2O51DLN/PNQFvJ/7uL5crCYx5EveBxV2LFNY2uA2BFy9fhTDhpVGz2Pu+JUvcihF2uPOAe/cfyi6XK1YqlUKiKFzwenoiRtrjioAbN2/3F4rFOLq7B8EPbNq4IWm0TW5CIH7pSiifL6QKhQIgCQFff1/SDLtcEPD7H3/FsMzF8/l8EkkI7PRvN21t0NIQWPbDj559AwfSuelpjySK4RO/HBsxuw2WEuCW5fjU1H/jkiQGfo2es8+KMBGyKty3uS8RDO6XwY5ClsRR7QmeJ/lfgAEAlIqdzy50oX0AAAAASUVORK5CYII=';
    var shoes_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABH9JREFUeNrsW01oE1EQfrvZ2lL/YtVSf2pjKQh6SfUgLQU3eLCiaIri1fQuthUP3kzVg4hiC71KouBFhMRbL5otiBd/WhA9aMGCgrUeTEJS2qSbOFNfZI3ZJM2+3bdpMjBskqab933zzbzZ2UQgFtrdV8fccHBqXope7Z2aIRxNsADwRXAZ3F3krUiCAj4FhISrngAA7oPDdXBXBf8+Bz4ORIxVHQE04oES0V4LEYNAhGImASJD8H44TDMCT6h6InDe+7ZXACwSo+4zcZ1hqoao7RRgAXg0L3jIdilAZW82+JzJlGx7EACLkWmlZ2oe1yXSurFL788++FyvXRTAPBr9XdfI4V3nyYWDY8VICAAJTq4E0H3exRJ8b7uPHNrZv/q4UdpEzh64pfdWBD/MWwFMpb+lsY307PX99xqqQceGWKlArCD6XjOiX8hyitBRgZeXAs6yjr4e0CJ1gNk6KiFAZknAEX2Zl9MbcCGAqfy7Wvp0/7a8kijn2sM6Aujez8xQ+pgCejb762WpUzh5KMD04pezDwuTpU7hrloCCkVfK/n48jz5Gp9ZnwrARkcbfQQemZsgE69Pkw8//0T97fenlqxF4kEAVn5t9J98HCYLydm/kUf7SZ+XMMVqBRgeYOLeru36MPILGrC5xzFKhNm2JgLoQGLOiPS1PT7m+Ls8qefqQLwMAliMyyqpAUql4PEqTyt9BaJvwBTLFUBtqpJ2N/8SF4vdQnl5rmfPuBRBkF2QDiqdepHu2tZH2re6V4FvBS/U7Lz6GjS69jAXAqiNF7okxr0dJzpIQtEGB6IfN1bkghCIOV4pgIY3LaL5MseJTinw5XR4ZaTGKNc+AHcDSINBopnUNgHwMjq3v9Vf9wJITZBvxc8zyir6aIbuC1g0Ev+n8gN4D7c+oICNsGiO1tCEDbA+qeE7Q3Q2FyHsbonpgffY8s4QXZSH1bZkJXgmCshTwzDdHlnN7bHg+c3MK+bfDwASXJQEI8UxyLraW0ZAXm1AEnB6K5cp9YeYSlYAN52AAoQgCS7q5P1k/KKjQVAOHt+MoGfMynHbWue+jgi4n/c6RFLjViegTkCdgDoBdQLqBKwDy2azzpolAMBjy/0Fjt6aIgCjDo5TKfSwIAhrviSXqhV8JpPJfTEbry0GAXywZlJAVVWUegSij089lYKvSgLS6fR9AB4CD1PwhmaSVZMCi4uLLlEUQ5ls1g1RG5QkKcjivFVBQDQak1U1g/cgoqIgdDds2MBsEm37FJif/+FfUdWImlEVKHzdTY2NTMfwtlXAp8+zTklqCAF4WRDFkR3bW0z5DZEtCXjzdlpOpdIhnNhB3nv27tmt1Ewr/PyFMpxKpSLgM+l0ar+ro10x8/Nso4Dgo8fO5ubmwNLystfhcIz29hz1W/G5tiDg9p177mQyGYI93QngB06dPGHZjye5p8DloSu+ZCIxvZhMRpeWlrrPDZyx9JejXBXQ2tY2FI/HoNpLYzdvXB/hsQauBCQSCRKPxQaCgQdhUmvWua/DBy6TuvG13wIMAGHHmGweAGprAAAAAElFTkSuQmCC';
    var gym_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABMJJREFUeNrsW01oE0EUnmzWxoptFqR6qqZeLdqgXjwleNGDmApi8dL04kWw7UlBxBQFvbX1qEjjQbQXk4Kgt0RFT0J78A8PWikitkq29ieJiYnvuROTbLPpJju7syF58JjubrKz3zdv3t+mTtLkIlo5Wf7TTg8MnpJTsmPv4hxPAhwmA+6DYRDUB9pX5aNIQhx0BgiJNzwBADwIw1XVauuVedAxICLccATQFZ/aZLVrIWLIbIsQGIIfgWGWEXhCrScG9x23vQXAQ+KqB018zii1Btl2UcAC8CgBOvbbagsA+JCp4MXuMhIo2fYgAB7GRz09G9l+hpCe74R03Soed79WxqIEYd6AXbaAcee045oyrkyXA0dp20dIbpmQ32/V35oCEuKs/IFY5+oHDXt7BPwfbK8CVnAXSVh/QsjSMBDwRv1NCRQjTojnFjBm+luPlJs2HmcXFBIKsu04Ie5zWncYhkWQuBBA977H0KypV4SsTpefQytQk4AkdVYkQSqJDJZbwEkm3mfpgj4S8NjE56jHB7DzwkhCqeMrkID7PgfOb+Wh4gsqi4+XBXiYEYDAky+1LUF9XrUNaO1hnQXQ/c8OPEYCNPeFwxstAf8uWEgVEmxTDNUN/tspZVT7hOqrX5A+Hj6gtjivBqYGXxrn8bNpevzrtp5ZJHsSgBlewZwLGR6SUA18QfQBt081qKOIKZLg6q0OvnaJW+0D9DUwK6WwSAKa99ejrMBbXw3SAkTe1MHt+aiEsUokYNrLqpvDoF1WTxSIal7B+F0wd8zltUgoL3G5mX+9BDzTvKIGXI0EvGZMZrgQQNvVlbdBJQenRYLaUbK0RAsSoUnNK9uOKU0MNQnrT4vnMCQaC3dhWIh5Jn6kzoYIJiCfNyQiCHRXuGgJXZOKX0D5HlTKYOz04GhMergSUNIVKm9SYkcHCfh5RVltPMamBoY/7aquVsG3RiFWNzP0XgBIiDAtj3XkIQDeyy0PqCBDupMjBuBB/VwTIY3EyG8BCXh/U94MGS6HS0iImrnyZv2OgEk/AEkAxddWo5umyrU7PK8ZK29KQwQedAIGdFJhg7cK01AXMtuxmPYLEfpzGIwQgzo7N3M0vWWW5HAloAIhPqI0VFHJvUfioGsLiQ+cyN6j4U0mzSR7d++JgYZ4P4dAmlxaBLQIaBHQIqDhJZ/PS6AhHJuOAACNSVYMdJjU8cZYaHDwAQqe/CuYHI5o0xCQy+XGgYAIrUIRfF3VothowDOZjEcQhAiaPoAeAjVUeDUUAal02pfPkwisvgwkeEEN9wgaZgusrq6F8rlcDFY+DiR4nU4nkwaJ7S1gcemHJIpOXHWfw0FG29vbJ1je39YEzH9Z8GWz2QgAJ4JD8Hd2dsSbJhF69/7DCICPgc5ls396JMkdN2Me21nA8xcvJZfLNZXJZAOwz8d2d/eY2jOwFQGRmcd9yVQKTN4hAfj+A/t7o2bPaZstcOduOJhMJmdTqZScTqe9hw56o1bMy90CLl66LHV0dIyvra0FIa5PnB04PWrl/FwJ6HS7D8iyHAOT9zhFsX/kwvmo1c/AlYAtbW2BX8vyHOx3/80b17n8BylXAuREIppIJIYePLjfXC1xO4mzRUCTy18BBgB1ydozbZOIygAAAABJRU5ErkJggg==';
    var pharmacy_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABKVJREFUeNrsW1lrU0EUnjsJSV0qV7HgErUtriDYFGl90hYVcaOtf8AE9K3QBhQXEFsQxBdbUYuikiCIqA+pQsEHJWnxwQVs9MGKSw3S4tKKSdNS0+YmngmD1Nom996Zu8TkwOFeyGznm2/OOTNzg1BB8lsEvTpav+VCKTyIVoCKU34KgobfPm0K/3cAgNE18DgIWkONzyQR0E7Q+wBGZ04DAIbXw6NNhtGzCWFDKwDhyykAKM29dMZ5SAjUDUCEtAIAc571Xo7GI+ovAtC2y9QMoAP0asxWtxZLApvN+Ia9G9CJ5q2oeL59+k9eLZhgYTSeUPQ2aBEXJq0pQdfa6tCmjUvQp88/0dv3w9OL1C927O4eHngYNgsDvNNiOpPxNzsOpN8Hv4wgf1ffbEX9ALxoOAAwiBbqpJiF0P3sqR1/aH/yzKNMxUUaYo0DgM5AE69BXDq3L80AIo97+tHzlwPZqrhoyGUWq8p6Ll7UJ06PyPOXg+nn2fYeuVVPk8hgSBgE9D9lyvLIbO7YVs40sJFYHN28kzH/iUBYXKg7A6ZsamaVxkPVaPvWcmZ2kCiQYTmIZK8BIAT1XgJZMz1/15uZ4rgiiY3GUd+7ITljYQJAjRPclK0AcWSPez6yOcbrz9IgZJFtRjhBWaFvQbEdVVUuZ6D/ENJDsFYNk2SGhf68lqNhAPS9GzakrmkAIBRWMJN/yYveAblFI6YFgMij7n6t64WMAKBbbkE1kYD4DgUO0BAGhOUD0K/YGV6+8UxJ8VdGAKAo8VCQ22fbBs8knboDQM/vQ0pYIMco4jAbj3UpYiKPw1JVJ0KLHbuJe69XAoIA264Na0uQ3WadceYPex4oTX4uDA88DLICoPpQNNuOcDapqnT8Y7yKpIk4vzJgALMTtDLUbUUqDkNlHHbImn0exjMxgLIggPjeA8iK/WC80yyZYAOPWKyQ+m6eDTIBQGlYqyMI3K/JmFNhOiCtQYhQ47nfGnO7HKWXJF7E6ah8WubZoNUFqYVXQxCTv0J+cAde4xwdo48aH9aKWlp9H0DyA3Js7VLZBKF6q5bX4poCMAUIkWaMdZQVYoY1Toy9T4zX83MZ3b4RmgJI2kckftwLCEWrPZZ5Th+vpCanpHzlqhRojdHjwCjPpQBAAYACAAUAcl5SqVQ9aC+omHcAgNHkcxk/UnlHYM1Vw5PJZKkgCH6aWLnh3Zc3S0CSpPRXqZTyTrXG5yQAk5OTLWC4HzRIjWfaMOXMEhgfHxcFjMFwsqlKeaxWazuPdnMCgGh0pAbWvJ/QNYmRs8hm57ZNNv0S+PZ9qFlKSgFJSoYAhLIiu53rGYFpGfD+w0fRZrN5icPDGLcuWljcokU/pgQg9Op1RSKR8AsCFjEWapctXRLMm0ywu+eJKx6f6J2YmIhIUsK5wuEIatmfaRhw6/Zdce7cOW2/4nEXUL69umqzR49+TQHA+faLFWNjY16I6aUYWxp27dyu27/GDF8CR44ed42OjgYAAARaW7d/T6ee/RvKgNXr1rfFYiMVFovFZ8HY42lq1P1w1FAAYrFYaTQadV+90uFD+SblK1cFykxwKlyQfJffAgwA0+O9pW3lWVwAAAAASUVORK5CYII=';
    var spa_marker = 'data:image/png;base64,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';
    var hospital_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABUFJREFUeNrsWl2IG1UUvvOTjcvS2Tz0pWtts1VkVXATZEt92yAICmIKKwsiNqn4VmiCFnxz81JQkGxBQZS6eRFZVLL1pVCQpKggguxUUPvkrtX6YAtN0kp+Z6bnTO60+ZmMm+nM3AnJgcvdZDN37vnud75z7p0RiYdW/fBQGLpwx1e706eu7RKGxrnscAS6E9CwX7b4qQytCO0CAFIceQDA8QR0p6njwxoyIgNA5EYOALriGzYdNwMi6TYjeAedT0G37ZDzhGpFAcbN+p4BMElc9YSL88RwSAMbSr5jgAfOEzr+hu9CgNLebecNi1Ow/QEAFbws8dYScN+4XxhguRrC/PN6c8E2AIQQUwBonh+o9ty+gyTw4qck8NwHbgCAzqeYZgEAYKenpG0PFpSIsPgG4aYkwu1/Uv9O/edH+7Orl4ly9Sui1Su9/8FsMO9EVhBtOL9s5rxOe3BeWFhpT7rDcfHpk4QAOHZMWHiF1DdfMGNBnKZHbwEAe9mUSuAgOtq4+CZRr3evOj93jPAPH7NHUWASXts7Jp1HjoUGmKqwuJQm6s3fzCZqavi72keHiQbX2LRlViIYNhM9YfEkaX771tCDmcT3nsWQpmLvQoDGf/8gR9P6imq3/6Zxu0I46ZH7AEkHu1a+sbV677Pxd3D14j3hHDIjeK4BpjlfpVTGeLVKfwgGAqZV/tLF0gALWdSfBSrtcQezJELPERjvBkEAUQTRCdSCLgd2LvWFi7iU0tXdUHn8bJYltEZFT6MWYRJioQH9EwXqI32Dr//QrfbgFD+gGjSYwFvQ3gCrM4T8eR5gskKo7oYmWDnXtfLImOtDFU5FrwGQ+waAFTcTL/xOj+thVB4ZgwyynxncBYCWnqVuAJ41ZQSqe+v7jO7UXnM9imIDqj5kzl6uceK4zE4W2Oo8A1B+/7J75WEfgE4jlbGhyClX4TfB2cEacuNXffPU+imrO489ltWKDuDsIDCKTjDADgCXOwEwJny/dl/R06AujHRTpPxxyVIP9InA/6cABAQLQcP017rymdUlF1juBm9ZpSBd3efa2UC5cp4oPanQNBYBKLyOAGg6qLD6/1MlzjvxUMUuAGvQvUvYWQ6cT7JMg+u9YuixZZjWATQbZFg57+TzRNuFEExinWYEL02G+675qRJMmhVHLhmuesxXpTANhZgHIKDzx335ZKgDBLfCAcGNwn1cAdnpp8Mpmh6dOrfPOB3z7uwGu4UxSh78sDJHC501t4XFtTdE6OsweIBqvCGyF6pjfX/Oy9dmOC9uQh9lIQhh2sjnP5MT0kNEfukpco6mN5aFlfd25NDhArQ11vPgyZjbBIAJABMAJgBMAJgAMAFgtE3TtBC0PLTw2AEATi9Dt0NL7dBYAQDOYyldMM4MOI6TxwIARVFCqqoi5fHsIQOOx6DZ2kyJo+Z8s9mMYLwj3anjxbERwVq9ntI0sg0A6O8J8jxffNAxRwKAcrkSunPnv7ymqllVU9cDgUBUEARHzg98HwL/3rgZUVRlA6ge5jhyfGZ62tHDV18zYPfPa4lWs1lotRQCIERnZmYcP3n2JQO25V9CweBUttVqJWDlc3NzB5Ju3ct3ABQufxduNBr5NuX55GOPHsmNTSn8df6beL1e34ZGAITYEwuP59y+p28A+PiT89lqtZqvVmtb1VotdnTpGU+eOTIPgbfPvBOSJKkAzkdEUUy/9urqupf3ZwrAPml2sVwu7UBBU+IFIZo+fUr2eg5MARBEMV4pl7dg5ZPvv3eWyYMRlgDI5dIteXPzizSZGDu7K8AAnioKBF8XCj4AAAAASUVORK5CYII=';
    var hotel_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABKlJREFUeNrsWr9v21YQfiSl2LJTmQ4SoF0c2c7QDrUlBCm6FJGydAkQyUOBIkPkvYBtoAGy2VqCoovlrSgQSP0DKgndulQyvHQJLGRIPKSwkwwF2gD60ToWLVLKHX/UTmNZFPnIR0E84CzZ1iP5fXf3veNRhPjGwAq1CHjcC5fCuQKWkCT4HfAouHjGp6q6b4OXyNJ0ffgJ0CK8Dj5opBF8HjzjBhGcQxHPWQB+FhFIQnZ4CCjU0vBzs0eaW7UKeMqpbOAog885FCjUh4QTJHBDAN5REnhKYuc0eKLvIEXaB+VtghetgI9fDpDa7Smye+sDEpkY6BLicM4NL2XAKnhkkAUbn4yT8hcXSeW1rP6OJCQ/Cg5yiBV9p2FMgBb9FbMfF4OcCnz943Gy9uSIpH4/JImdf1Uiip9Pks2FkOlD6f0FYxEs1Fb1Lc9UyiNINARuRP+/NJofUwmoNhSVlHq7a6ZHmKUhiHZKwFT0ERxGHsHN/tp8Dzxa9g+JxH77R82S/S/DKmEmsiDJrgS0Goz0S3kjtTN7rb6RRYKQBHxFwlAr+thNlhoQPfefU4IqbhhJjC7WPb43dOC06CFQo/5Xr42pa5EwXIOfxTU9dwQvEoDgEDxGGyPa0KMevxJQwSERUVE4CeNl7e/GewS88UzLGIPIHltlhCUB5xpGEMEfvOlYvwEAreilGf8rRVsWsLiuZ/2V/myrfp5heqOfBnum1EP2LD9+c96hkIADFgTYOikC3tZB35u5wHQiZJWAF3ZOiuCxzo26t2xL0xVWGmCpATHR4AxNBlQtLYI9Htvg0xqx9VyyMyhhRACmXqE20JKrsJXhFogk4LZmbG1GVhh9gtNBoJUBquCbaUfrxxrANIhdmq7g/cSagC0zBORfHhPxgvnIGoT1jf7SNJUMsDcSK9R2+7XFDtkyEJD3Qie4xgB8hRZ4+wRo+3DWRfB12qTTuBfI0FJkUxlHqfbpEaBNZRIukJChmfp0RPBdQcQpTdkhUVx2Ajzd2+GTTMhTrvmEU+DpZsC72YDTmpzNoUWWuPCE2NnvBxRq2CjdI+YHmAd6h5cH4AfEBeOIW6ZlRdwYqIy9ehrtBseqxx/Ob+vAq7QV3tM2N3O1DL7B+jp4MuLmE+AT4BPgE+AT4BMw5NbtdkXwIr6OHAEAGrvLfb3LjIwUAQB+Vb8FxxZ6luO46kgQoCiK2Ol0MOXxKzoZAJ4At3TXGBg28O12O4r1Dm9FAJ0CL42MCLYkKd3tkl0gAKMd43m+ZPeYQ0FAo9EUDw8Pc91OJwfgs8FgMCYIApV5gedL4K+/X0eVjpLjFA4VPhUKhUo0j+/pDHjx8lValuWyLCtEVuTE5ORkifY5PEvA02d7myB4OSCgpMhy4tK0M9Miz5VAeXsnMhEKFQF8BERu+dr8XN7J83mKgJ+LvyQlScoJvFDHvX1x4VPHZ4SeKYEffny02Wq1ilJLqrSkVuyzG9ddGZAyz4Bv7z8Qw+Fw8ejoKA7b29rdr79y82ErWwLCU1OLzWZjnxd4wgtCbG3lG9fH4kwJCASDyWajUYGmJvX9dw/rZJQMnwvMz84ViW+++cbS3gowAFs1wHiUYtLaAAAAAElFTkSuQmCC';

    var parking_marker = "data:image/png;base64,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";
    var school_marker = "data:image/png;base64,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";
    var park_marker = "data:image/png;base64,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";


    var church= "data:image/png;base64,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";
    var synagogue = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QAGgBeANethnCRAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH3wkBAQUnQ68qVwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAJQ0lEQVRo3tWae3DU1RXHP/f3293s5gl5SCAEEpWHBEqFaGHwWWFqOxgcdWwtiC1TOp3O2DrtTDu2HUdqp+0frdXRcep0FCQGEQshaSBgKmKEAkFAiBCJJAJ5EJLdze5mH9nH797+kd9GY2I2L0DPzE6y+7v3nvO953HPOfcnmBiyAEXAbcBiYC6QDVjN5xHACTQAx4AD5v8xrjFZgBJgE9AOSEAl+EigBXgF+C6gj0cAMY65i4D1wCNABoBmTzbsM2dpSTNuUNbrphuWjMkSlIh53CLS0SLCLU1a78UmVDikmWu4gC3Av4D6qwngYeAJYCmALTdfTbq7RGXcfq9MKbpFs2RMRrPatM9PkJGwinm78dcfMby1u+neV0HMddliPn4PeB4ovxoAfgQ8BRQihMwueUxlP7hOpN28TAhNG9F6SkrVc7RWdpW/IlxVZQKlBHAOeAbYPBphRmt/jwIbgEJb7nSV9/MN5D3+tLDn36AJIUa8GUIIkTS9QMtY9h301AwZbPhQyt5gNrAQuAycvhIAbgP+BMy1TZ2p8h7/I1N+8DNN6JYx+5FmtYm0Rcs0PSNTBU4fQwZ7MoEZpj+0TSSANHPnVwhbkjH9F8+o6x5aryWa1PPhISIdrSTl5g87LmXeIk1YLNL7vxpQajqgAW+PJMyOFMBa4DeAnvvoE2LaT38vhBjef4yAn9bn/0Dg1BEybrsXzWYbHkRRMTGPSwbq6zRgHtAMnEyoxREInwl8H7AmFy2WOQ+tV4mEB3BVldFds4Pumh24qsoS+4Vu0XIe/An2G+YZQJIZ6dInAsDdwDJAZa54UDkK5ySc03vhHM6KzWhWG5rVhrNiM70XziVklDJ3oSXz3ocxD7w7Tb8bFwBhAnDYpubLSXeXyC/EdmJe96CPs7KUwMnDZK5cTebKHxI4eRhnZemQY2UkPIDh5G+XYM2ZqoBU4K6RpAKJzOdWgJRvLMU+c9aA8f5TR2h99klUNDJgUqipAQDfoZr+3zo2/h1v7e6Bu2O1kf+rv5BWfEf/b46CuVry3JsNb9clDVgCTAI8Y9VALpAPkHLTzUKz2sQXogdJeQUEzxwn0tmGJTOHUGM9KhImfelyHDcW4bixiPSly1GRMKHGeiyZOUQ62wieOU5SXgHJ8xYNFMjuECnzi+N8CoGc8WhgKpAuLFZlL5g9OIQlp5K9ai2+uv3YcqbiKJyD7/A7ZJWsYcbvnkezJfWb2sU//xL3ri04CucQc3UCguxVa9GTUwetay+YDZqukEaGmdV+MlYNpAFWdF1aJmXJoQakL1tB1srVBBtO4CzfhCUji6yVq7GkpqPZktBsSVhS08lauRo9Iwtn+SaCDSfIWrma9GUrht7VjCyE1YoZjTLH68QI3SLQdDF0WqCRXbIGe8FsDL+PycvvJ33pPYOBLr2Hycvvx/D7sBfMIbtkDUJoXxJS+3MqkchKEgEIAIaKRoh5utSXJmdGDKVMBUkFaoihSvU9A5SSKOPLD9mYx61UNKqA3uEceCQA2gGvika03k/PiqEzSwNnxWbCF86hZ2TSXbMd74E9g8Z5D+zBXbMdPSOT8IVPcFZsRkljSKah5gaQhgb4gI7xAmgBCJ45IWQ0MmhrvbXVuKq2kFxUTM4D6zCCflxVW4h2OzFCQYxQkGi3E1fVFmTQT84D60guKsZVtQVvbfUghrI3pAIffRDn86mZnY45CrmBOqA4cPoo4fbzyjFzdr8mDL8PZ2UphsdFRAgCHx1FGQbuXW8QuXQRYenLf1Qsgv/4QdAtBD46SqT9PIbHhbOylLTiO9BTP8sYelubVfDsyfjGHhmvCSmzAI+EL10UPR/UDngYPHuKWLeT1MW3Y7/+JpSUpC5cgpaShv/4QSKdbUQ62/AfP4iWkkbqwiUoKbFffxOpi28n1u0kePbUgDV9h/fJaGebAEIm73GdxJiLnMUwFngP7JHZ962Rms2uAaQu/BazXtw5aELH5udof/Hp/hM2fL6R3B//mty1TwzewST7ZxlsKKB8h94WZvQ5bWpg3ABazNx8QU/dfuE/WafSb+kTTFis6BbroAnZq9bSc3gfroq+6jDtljvJXvUYekra8PXDsfcN39H34ia6F7g0EdkoQDXgjnlcmufdCqEUarjBSdNmklXyaP/3rPvWkDRtRqI6WXrerUQGenTTcasnsiJrBxYA86OuyzJ9yT1Ys64btiawF84h3NqM48Z5TF3/JJrVOvyB03BCtr20QciATwO2Ay8DxkSYEEAYqATuD7c227trdsjkWfOH3xlHsmnzAt2RnJBB9963RPRyqwb4gZ1mN4+JMiGAXcB/AVx73lShTz+WCQuUosWkFC1KuHDg45Mx99631Ods/+0RNwZGAcBnqjbS23RGd1dvm7D+pHvPmyLc0qQDQeDf5t8JB4Cp2hoAV/VWgo2n5HiF99d/YLj3bBOfCxZVo2rNjJKfB9gKhHqbGzRnVZlMFJESdehcu8sItzRpZuL4pukDVwxAXAtVAO5db9Bz7P0xa8FXt1+6d2+Nfy03AwVXGoDf7Ch7Ix0tFlfV60oZsVFrQUbC0lVZStTZoQNd5prhqwEgHpG29TngNr17f9WotdD9zk7l3tsfCLaNJvJMBICo2UW+YPR4hLN8oxHze0d82xJ1dxrOiteE7A3qQCNQOpJDayIBxJO8MkB59ldZXFVlI27yOitLpff96ni2WzaSpO1KAIC+q6VDKKk5d74mQk1nEppSsPGUcv3ndc3kXWvuPtcKwCemALFAfZ3o2vGqVFKq4cJm145XCX78oW7Wu5vMqmvMpDN+agRmA0W95xulY9Z86SiYPeS63TU7ZPtLG1CRsADeAP7KOG8qtQkA4AM2ApdiHpfFWb5RxHq8g0wp4r4c69r+ijL8Ps2sMV4zqy6utQag735rMnBHb3ODsGROkWnfXDJgczpKX5Bdb70c5/ecCforRdcD+wDlmLXAmLf1iHHraaVuPa3UnE37w7ZpMyNm1Nkb77d+FWk10AOo7AfWRYpPhGKLjvZEM7/3SFx4D30XF19Z0oEXACWsNlnw1D+N/N8+GzEdVQH/YHyX61eFFpoHk7JOyYtasqZETeEP0vc+xdeC1ptxPv5+RJC+C/KvDdnMojwO4MVR1N/XJIx+kQyzp5NH32s1fxtJj2cs9H/55+bbglgESwAAAABJRU5ErkJggg==";
    var mosque = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QAGgBeANethnCRAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH3wkBAQMzDy9ZrAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAH0klEQVRo3tWaa2xUxxXHf3P37voVZ+3F2Djg2JSaOEBLIClKRNqUqKjpi6QhDaFpmwgFKWmbClWq+g2VUqlVFLWNUlWJGl4hDu+XMZhHwjuhvBJe5hVsEkxsg3fXu157va870w+eRTiuvXdZY5IjXWnvvTsz5z9zzv+cM3MFgyMmMB54GLgfqAKKAKd+HwO8wFngGHBA/05wm8UEZgBLgWZAAirFJYEmYBHwA8CRiQIig7aTgbnAbMANYGTnWtnllUbW3WOUs3iUZboLJSiRCPhFrLVJRJsajMjlBlS029B9+IB3gf8Ap4YSwNPAPOAhANeIMlUwbYZyf/sxmTf+W4bpLsRwuowbG8hYVCWC7XSeOmQF922lfdcmEr6rpn69F3gN2DAUAJ4H5gOjEUIWzXhOFc2cI/InTRXCMGz1p6RUoSP7ZNuGRcJXWy1QSgAXgYXA2+kok679/RJYAIx2jRilRv56ASNf/pPILhtjCCFsT4YQQmSNqjDcU7+P4w63DJ89LmUkXARMBK4C9bcCwMPAX4AqV2m5Gvnynyl55kVDOEyRYrbpD5vhdIn8yVMNh9ujuuqPIcMhD3C39ofPBxNAvp756cKVZY363UJV/NRcw07D4Ic76DrzEblfH9/vf/LGTTaEacrghztBqVGAAeywQ7OGTQCzgJ8BlPz8t0bxrJfstiNy6TzemrdJhIID/q9k9m9E8TMvSX37rCYKBgOARwNw5o6/Xw5/aq4Swp7zK6WINjXS/clprKB/YL9wmMbwmS+QPWacBWRpAHcOBoBpwFRAeabPVDmj7zFsMg3+batof289WWVjcOS7U7bJq5poeh57Gh3wHtF+lxEAoQHkuErLZMG0GTJVhzIew7vlXS7Nf4HP/joPlYhT9JNfYLo9tkyu8NEZOIeXKuAO4LuZAvAAUwDyvvkQ2eWVZsoOnS6MrBxMtwcz303h9CcpeuJ521SXU1Fl5FZNSk7Ug0BBqlxmIBkBlAHk3TtJGE6XLdv3fO+nFD76OHF/G8KVlVagMbJzRN6EB0Rw/1aA0cBwIHCzK1AK3ClMp8quGJuWIpFL5+g8fpDOjz4g1tqUVtvsirFgOJTOsYoyMaF8wInDIc2CYTIdJYRpYmRlI1xZCIeZFgDTPQzhdKLZyJOJCQlNcQIjvazDVVpO7r33YeYX4vQUp5egOa7nVCKVjqkAdAGWiscciUCbssv9/h1rCezdQnB/HUZWNjIapmDa4xQ88iPspEyJgF+peBwgMpD92wHQDARVPFYSuXRe2VG++Y2FtCx+FRkOXX/etvYt2ndvpnTOHxjx3O9TguhuPAvSMoAOoDUTH2jW1RPhMx8LGY8NCMJXW03Lold6KX99Vn1XaVn0CoHdNQPHkUi36jp9NDnOJZ2d3jQAP3AYoKv+CNHmT/sFEPddw1uzHNnd1b9p+K/h3VyNFe7sn72uNKrw+RNJvQ6lMqFUAJQuwGPRlssidHRf/7Nft5KOg++ltO/Aro34t6/p933Hf3fJ+LXPBdCtx844FzoAnMeyRPDANiVjkT50Gm1twrdlBajUTKsScXxbV5II+Pq8s7q7VMfBHUKzT71egYwBNOncnNDhPaLzxOE+ZhRpPEf4/HHbNNl18hCRyxf7PA8d2291HNmbvN0OtAxWPVAH+BMBnxHYvUkoRS8QVrgTLMs2AJWII7vDX8xeZWB3DbIr5NCOWzdY9UDSjHYAtL+/UXVfPK3IWHp30XXuuGrfvTnJr9uAI3Y3puxIFKgBnoheacxu37le5lZO6JW7FM96kUQoYDtVcN1V3utZ+/Y1In71igF0Ahv1bt6gbqvcCVQDP84eM86qfG2dyBlddX0FVRom1JMuOG6Y/ROJi/NmimhTgwNYB/wKCA+mCaGj4jogFmk44/DXre6jUDpXr2CzbVVS+TCw1q7y6QJAL+3OJO+HL5yUmXpC56mjln/banEDWdSmVT+kOV4AWAl0RxrPGt7aavlFRkrLjaVUvq3VRJsaDJ04rtI+cMsAJFehFsC/ZQWhY/tvehU6Du+R/q0rk7cbNFFwqwF06h3lYKy1yfTVvqOUlUh7FWQsKn01y4l7Wx1Am+4zOhQAALYAq3sccLWjfU9t2qvQ/v5G5d9+nQhWJ+PMUAGI613kz6xQQHg3LLESnUHbpy1x/zXLu2mZkJGwA7gALAesoQSQjM7VgArsqTV9tdW2Y4q3ZrkM7q9LhuNqO0nbrQAAPUdLB1HS8G5cJrobzqQ0pfCFk8q3+R1Dj71Pzz63C8AnWoFE16nDom39YqmkVAPRZtv6xYTPHXfoeneprrpuWhxkLheAscD4yKcXZE7lBJlTMfb/9tu+c71s/vcCVCwqgBXA38jwpNIYBAAdwBKgJRHwmd4NS0QiFOxjSjH/1UTbukXK6uwwdI2xTFdd3O4VgJ7zrULgO5HGs8L0lMj8+x7sNTmty1+XbWveTI73Tw36SyVfA3YBKqfyG9a4lYesKfVKTalX6p6le6Kuu8pjmnW2J/dbv4zyLBACVNGTc2IPfNydmHwkFPf8cHZS+QA2T15ulziA1wElnC5ZMf8Nq+yPf49pR1XAP8jscH1IZKIOTMpZMjJuDiuJa+U/oOd7iq+EzNU8n/w+IkzPAflXRlzAmzcA+Fca9fdtodE+e1R6T2ckPZ/VvGpnj+dm5H8rOz8RtuE+GQAAAABJRU5ErkJggg==";

    var museum_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABHVJREFUeNrsWk1s00gYHTtmU6DZGiR+g7YtEgdaEMkBuCBIJPa0BxIQcELbnpAQCCqEhARSywGJW4s4cEIOPycOJCAkLohkD4v4k5rLChCHBpZelq1IS9MkrePwjZmgBjVOHM94HJwnjdzY7njem+/NfDM2Qm24G4JdD9py930ADjKU0A+X0lAy7450p386AYB0BA4HoEQIeSNkoaSg3AQxEi0tABAfgMMwlJ4mq8hAuQRCxFpKACCOCStLhHmzwLYYZGkPgXK4Kw2EejMYZBUNIsWQjzMij6HAM0YcGQGEvGLTmEU9EgSL5PHUNm7zzBWlOUtYtUDc7D/8ukxEFwKr0KvIJvTnFl+zdpC5C0A8aWqa272mA93/fb1OvCLEndA65F8pmakGkx/lagHSAxONDnqY7Kn+rpo9PrOgoWv/TEMG9MVMM3rBChleETDQKPnFvV7PFiajYZinBU436vXbobUNk9q1xquLdbBnZSO3R7hYgGR7E/V6/crO1Wa9XYXHk3l0/uWUbg8DhMEGKbsjwFB57HUzvV4L+/3L0ZM/NupiGiDEwwLdRhcnc6peaOBNdqHeLft4CBAwungvk0OTcyUqAjz/VNALS4gsKr2c/oxeZ+e//z6W+k8/t1gkfM7oHvw3vq8OLFtAYiEAJvZloVzVk1U2mVP1c0b34PCnZSXbI8BGZN0uQJqHAH+5PQIyDhLAcmc0Mwgm6m2A4FTWv8JTlRz5V0hVmSLqR4b3REk6XGcaTFkVoNnVYLLWFITJn+rrspwJYrz4VNRXiTVEwO8SenkNgjdr934nFfKVxdGutV7TbWAeASQKJpbaENkq/6KvBGnh49ySqXWW7AdkeYwBFQyhJbbEFmd3DHGVBnlLEVBvLGA59wP5oFMywSiNudjkvD/omFSYhGHYRhHCtF+TWR6tSINYi4DrjrJ4R0jz3WAPGRQDlNuYYUWeqgCLhBhBlHZsAWPo22tyZtHF6vuAHiLCQJNVxAhx5usO1l+I4HcHla9E8HQpG3g8RRY3MZY9bqsANUTR8wbt+umksH3vkLDnkK2EHYPNv3WXoYR4t0NELkdbgLYAbQFaH+VyWYYy4EoBgDhOvfGyfBQL4SoBSK8nyc+gIAhZVwhQKpVkTdMUEADvTuNd6jCQbyptllqNvKqqlVUnPg4C8ZhrBsHi/HxEK5fHoedx+IdFUYxZrbNlBMjlcqMQ9nEgnsDkPR4Plf0Bx1vg/6kpWfJISU0rBwRBG/J2dIzRrN/RAnz492NIVUtxslwO+nyd1HeFHGuBN2/fjcCAl4SSAhGCstzFZEvMcRHw99NnstfrjavqQggGuUubezeOsHyeowR48PBRIF8oxJEgyB5RDG/r70u5Zi1wQ7l1Jp/PjxcLxUyxWOwNBnek7Hgu9wi4cHFY7vT5FCAfkSRp7Ojhg0N2Pp+rABv8/sDMzLQCXpeBfPTkieMJu9vA1QLejuWjM9PT2dnZ2eC5s2cSyE3Am6J9W/sU3u3gaYFwIZdLozba4IqvAgwA90KwuTcXXYoAAAAASUVORK5CYII=';

    var art_gallery_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABKlJREFUeNrsWjts01AUfXE+bUGkBqlICAFNYASaIqZO8QgLyQJCDE13RItEJbaGASEEUoEJIaGkGyxNEEMnFAOiazMgYIIAA+IjkX4gLkls7iXPailx7NjPn5Bc6erFyrP9zvH9vQ8hPelu8dn5cOXtbh6aBOgp0BjocJNuJdAi6FPQvC/6pdTxBADwODSTFHy7IoJeASLEjiMAgOMXnjUJvBkRF4GIYkcQAOARdAaUZzzGCSAhaxcBHCPwU9DkbACPkoHnZzxLAAwuTc3eTknZRQJnEXwKmhmHAnaKku2NGACDwbRW0DT70GFCfr1s/A7sI2Tbicbv2sfGNbZ90Gcd+vxc2LhHXm78py0CywwRsHDvrCb4/jFC9uQaQFDxupWooJEAJONzqmVMAI24SgA1/bhmB/UL4pdG3SrSYpOR0H7yit7rh9EVwArSblrAZMt/kQA0fwTzKWnsiTunwZ4uEbL6wEjvcVB3CKC+H9PtiOaMXxrNf+iOtl9z4QZRqlWo9+lbQQKsIO+GBYzr9lADniprDwn5foNoxgv8+qrsOEPIyj0j48D5hWUCzKTBuG6PgTHjT9vq82gBxoRFuW2KAH3zbxb4tERNle0LT+cezhFA/V9ffiyYH1HrGuCfWOC0BRir9blBCyMKe5oAg369bOHelf+AADMWUP1gxgKINwloJwts9X0kz3gmEJ0moGSoV2XRmvuYzwz2FkK4YAmZoKwbDNVKTp0EYVrsN2gV0mI74xEdJWCT2SV0c7s67cWghu3maq9VLWA8hRYdtwAqjwxVYX8ywb5GUNMqg81VgMz839SCCF3rf9fSDRDM3ifmRoQuYGwGGWGxh9B2FoCXlnUnIWodgGDKN//2a/U/Nepji5Ofrxc2FlD0hdkGiqklMVqDL5F2VoExvaE7tFfqaskoq/0CU3UAZf922+mNDfhbLDdLLG2MgCUUDE2P2QkCF6gbeqISTBoujqwLgp5gCd4yAXQwSTo4u8ELduwTWp4L0EFFWBUmGuW3YNcmKZPJELUEAQMU4/HlWUZ85kFQIzBiUJyxGByxynPkjIBtJ0To8pl6SII36Of4xeecOhxhKwFNyPjriMzcfGB8aJdSOhmv49xCtPsghOckuv9AATTt9jg40uXSI6BHQI+AHgE9AjpdFEXhQTPYdh0BABoLrCVacca6igAAnyKNk2rlP5Mmn0/sCgLq9TovyzKaPJ4YywNwBF8y86xAp4GvVqsxCnwYQE+AZrsmCErr6wlFIQUgAC8FjuOyVp/ZMQSsrf2YVWQ5JytyHvALfr/fta0xR+XL12/DgYA/Bz4f8/nIxPaBgSzL53uagNL7j/FarZYD4GUMdOHwDu8titolr16/Sddq1QIQINZq9dGdPG/LgonnLODZ8xd8X19fDqJ9HILcxUMHo7fsfJ+nCJjPP45XJAlM3kf8HCeMHD0i2v1Oz7jA3Xv3pyqVSkGSpCKQEDl+/JjoxHtdt4BL05f5cDickSqVRDAYvHLu7Om0k+93lYDw4ODI6urKkj/g5wPBYHJq8nze6TG4SgCATiyXy8VQKCRcv3a1RLpJcFn8YCSaIz3piavyW4ABACtfrwYpg9hPAAAAAElFTkSuQmCC';
    var stadium_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABItJREFUeNrsWktoE0EYnk22NNWYLtXWt67Siy1oIoj4wKY3byp48KQNCCIIGlHwIDQ9K1iPYiGrCF6E1IOop0YQPYg2Hrz4wEDrAxVJq21M12z8/zCRdrutZnd2Ztvkh2HJbGZnvm/+1/6zhNS4SDwnu/ykS4WLaurOntv9KLsoCaCAD0I7AC36j7+nod2FNsiTEMlF4L3Qemw+AsnoAyLSC4oAAK5Q4GcYPVKDFgcicp4nAMCH4ZKEFma8RgTfDSRkPEsABT8ETXFRW2NAguY5AjiBr8ghIGHQMwRQm3/PCbwr5iA7HJ+aC3yocRU5unWANMrBv31PRzWya93swGDuL/z+Sa4PHylfTaJQPxNhRYDPwe73zBfbm4GA6eCrERzXtqR9rtthmDvhBQ3orXbA2K/P5d226q9STgMJ/SzCo+xg99Vqx+1vv8Bq4xSaayREmcBpD7zHHBPiA2iaG/YAASoNwdxNIOpkwvHCZ/L2+2MyMp4h60Nh0tm637azpC9aGd4EqHYn+zLxlowCcAS9ffXhcph7Ak4Rf7ctbbfzyG0ifECX3clefX1QBl7Zcbx2q6fK/Q6coZg8oFpBlW9v2Wt5D00B79sQIT7g/2J+YWbMr8T6UQugVvdwPA8NcI0AzASnp7fo/Eao/VulwttXHZ7hDEfGMuUxbgs3E8B3AwSEjtDsGBv9QbuRIC1CAzJ2QyFqxItPd8pOL1BxhAAeHaMosUPASycTMgb7SIQJpIl3JM2dAFqyzngAfI5F1dhuFLhhJwaj7Vt5dnSQVtHhH6KJrAdotB5QVRxGj2+VDOG7QWdr1Wu4KiwM0kLEvAsoFGeVs8qeH7M+cwtYhECr8dOkn9XpkdOi6PB8poAeP2BKbtY3z/67uR81BbViLtuHtonVYYlTAniWxCvSzfLIzFEmSMvTcY7gY6zPC1mdDGHSn+QAXmP9UJZng5gep1wwB7T1uBvgmb4MUdWMMM4U09TmNbfUyq3vA6I0T4jafASGuD43gbtKgClKYPkai5fqf4DGHb/B48MILgSYyFBozoBEqM/u5HrXdgT61nQEEKzQ74SEyOYNG0vQoqLX4SM1LnUC6gTUCVgcUiqV1JolAMDje8h7OyTIi2DXUzS3iEmSlK0ZDTAMA7PL4UqNAMBrNWMCxWLxCu48aECagrddpV5QJlCYmlJ8kjQEwDGljvv9/n6nz1wwBExOTkYBeKpEpBxYf0SWZSZnEwvCBHK5sQTY/FDJMDJGyYg0NDR45ktRV+XDx4+KLDekikYxKhlSXzAYTLCew7MEvH7zLqzrvyHESQo4ue7lLSFXagSeNIHnLzJndH1qGAjI6rq+qa11RdqtuTylAffuP1SampqSU7p+ED18Z8cW10vuniHg5q3b4Xz+V9Ln86l+n//Qrp07BnnM6wkTuHT5Ss/ExMRQPp8nhUIh0rVvzyCvuYVqwLJQSImfPZ8E8D0+v187eeJ4jPcahBKwcvWa5I/xcQL2Hkv0XtRErEEoAd++fc2GmptjAwPXvPDFCV/ZvGFjAppK6lKXuoiUPwIMAGwGr6POJ2JeAAAAAElFTkSuQmCC';
    var salon_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABZhJREFUeNrsW0+ME1UYfzPdFnZ1uzWrkYQFCpEDbCS7JyB66BoSPcmuiZ48dCOXNQhbPJjIgUKEhAu7evEgZCcGL5rYLsZEokl7QzEmvQDGmLC4y1GZLewW2s6M3zd9b5n+me50+uZPab/ky6TTzuv7fu/3/XszQ0iXi+DWH/078soYHCKg7CiD5vA4vPJ37pkDAAxGIydBj9LjZpIFXQSVABC5YwGghs+CnqQrbUck0LMAxFJHAQDG40ovtGG4UWQKwnxHAADGo+FxB+aIrjHllFsInCifocHNKcEgOeEECCKHMZw2ntDxMxRs/wBAae+08UYQUr5xARrwTCcUPHyw7pyyvELUlfv6d6UbvzVekZHtRMs/BM2bDZ3gGRiFNvz+bqNoL4TDJPztVRIY3Vd33XryPCle/5lEbmTJ6ltvE+XWnbrf4HdPvvueFC590Sw7jPNKkXZdYNYs1W159x0i7thO5MMxMPYXUoaVZqquVBiAhm/9IN6QNcgABKmJ4P+e8ToGnDSl1FBYNxANNaPx4ysSCb15RGeLUUIAHl7biBk1EucVEEWbvm/pzwOwmlWfR/frR2SGbjCAYHQdZA+CY1G41Bx9Nq45annwmkBYvl1ZWWQGgoBugP7OXIedb2Ee814AELP6QzRGDA9ufFaX71e5wdBP1/RgqceEY3H9902iv+15cHMB6ndRy+iCccgCplUpkfo6soAFvxboz+YTc5sBmxY92moessDIRk6vjgH76oLhQPK07v8Wgx93EXkPqICfM8Nr02CtgcZg2OrqW10Q1wGoBUOFqs6ULYag10Lwq60J/AVAma4y+rVy67a+umZxwFgyY/Fkc8/AXwAYozgGOKT2fzv26vro2EzDyg+vaVQZWmyT3QMA6u9s280HBLznL3+p1/wDZ07rcQF7BGQKpkU8byyQ/MgAy01I6debpG9/deTHqI/pEbtBzArIEPR/VhajCz136WJdmWyyIDkvAGjKApbq9NYXtNbvseLDTm/t1Cd6v4CGMrcpzFXO4zkLLEh7lQYXm30ZPHRQN4xpIzGex+bpafyo7ANgymS1hN15OAYA0C7dzA2YQWYURgORFbWtL4KC3SBe10czyCa+z4UBdjdEMGQvmO3oDF2/trGi6Ab5997f+L7/1AnSn/hIBwIDIPsOKY/BkZXJuGHSRHC7POn1lthds76AtbbIhseXpboGh+0FsE6wfkOkaVOEq7+b1w5xOwBgI5Ih7ss0GC/xGsx2IURrgnmXjZd4Gt92JQiTSZDKfTw3BHN+gvegXG6NOXhbzGi8I3eGeN4bnCOV3WInaD/tFLK87w7HaHqMchhOpgEv7aRfOfKABADBng+I2jT8cwywbjwo4egjMnQLHXdvY5uAsUR7jEWnV9xVAGrAiBi3sD4WlLlhCG6faoGEm4/E+Eb27NyVAU16PQ+RdLn0AOgB0AOgB8AzIZqmxbsSADA8AorPKi3AMdbq9X0dbjx7cgyLrClBELJdwwBVVeMAQIb2DuNgfLorXKBUKkUURUG6Y9cpgeFo/JLd8TrKBZ4Ui2Oapvt6FIyeFkVR6possLa2Ngm0z2hEA/prE4FAQOIxbkcA8OCBPAfGpzRVTcNxIhQKcnvDxNcucO+f5WgoFEqVFWUMKT84OCjx/g/fAnDnz78my+XyAvi5LECUf+nFYUfeK/KlC9z8/Y8kRPsUAJAtlcrj27a97NhLVb5iwOIPP0YG+vtTxWIpBkEuceDVUcdvvPgGgK+uSLH19UJKEEQiiOL4668dcuVVOl+4wGcXLs4WCoUMaA5095E3Yq69R+gpA0KhLUMzHx5PrUOODwaDZ08cn0m6PQdPAQi/EJnN5/MypLqJC+fPZb2Yg6cArMpy7mE+P/XN1a+XSLfJnp27xkCjpCc98VT+F2AAwrp4cqUCfTYAAAAASUVORK5CYII=';
    var bowling_marker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABTBJREFUeNrsWk1sG0UUnt2s04JTZKVAWhrRbaRU/KjFLoc2CBVbVEJKEU3UA1J7aCIkLhQlvfUASgxBBHFIKtQLEngrBFJPdg/0VGRTDgWJNm6RkKil1kJIqSsBBicxtbsO75mx2djr9d/M7rrrTxpNNrve2fe97817OzuEOBwC7wFGvh71QjcG7TloHmhe2iNitP8W/75y+GLsgSAAjEYDp6GdgCY38dM0NAXaGSAj2XEEaAyf0ni5VSxCCwIR6Y4ggEo9RCXOCqiCSZ6hITAyfgK6BQZerwUkQbElAdT4kAnhyoUEgYHsl0yctJmTILRhPMr9NkfZkz6Xm+x+ZIgsr90ly9lUKUv4WGYIqY3fhngaPwyGn90/XyQBMXdjgVz87ZKHjhtgNY7Yovf9tLjhhjeGj5WNR0w//WbpTz+dd6wjADDDO9i3uPqqwoHH+GIL3sfKzs+bgOEtQxuOQf7aQ5mq0BIFjBETUOFx8lniq8pLTlg1CR6pd8H2hwaIb+ueYl9C4u9b5HLqSksPid6nWUALv1UE+I0Mx8lrdPCQ7vmV/Co5n7wA3vzScICDAyP1vF8KA7ndlCg2Gf9eo7R17sVPqow/8/On5fhFWSNBZw/MV0lci9HBlzcoR8f7ZRLMngM8jeTsynPL2bvl49NX56CwSZGPnn9Xd4B9EDpaBazcXzV6HtMJ0MU7e0/V9CgqAr3+v7wPFAnx9e+pUgveY37fRmJuggJ4EiC1ewP0Fnq5UWiNRmK06Q1VUUnk7ibubYkC0KONAKVfkcuLk2aJvNflI0VVNIm42QRUzbjbHx5omCjtXFCOeTD6v8nxuH49ILmNbps2NQQw5UAmaGmgWqmxD0rewzsO1ZxD6oRX3IoQiLGMwZX8Cjm4bcTgfM0skGSxXtgKARe0B5jS2kEic8sw9vF8DUSsmgQ3DHztj5/a8P4qufa78e8N0uA5SwigpadSp05vCFgW18N3+u8P+BElbpUCEEHtwQc3FpqXPnj2fNJYxUugrhoKCVpaB1AVLJbDAB5yrgkS0Pi3fjhtNMHRlyDdl6YIy+8E7RRCQW0awlA4CUbVCwe8rtL4hE6cY3joeB9n/UmWWYjFsni08iUJX2h8/XuLPSIDqW4JjLmc+l6XIKwBsKTGYgmrQ7wGK0cdBFh/JWLxYUSXBA6w34cRk0hIU+MjPFhl+XEUjQ8TtgumcWp8nJesmO8PoGv2M22+q6PXcY/ALOew4rdDhBKB+wS8TXocKzyF974A7gRoiJBpWGD/Uun/+V+zXnFzT7rn8V6M7eu0uksSp2DoyZ1RaLNWP4dIHI4uAV0CugR0CegS8CBgfX1ddiwBYDzuTr0NfdPvIVKHG17aNIWbNhYFQYg5hoBCoeAFAsJgNJIwDn3EMSGgquoEXX8o7hts1fiOI+BeLufJ5/Mh8Dw2RRRFNL6tF6iOCYG1tTUvyD5ERFEGr01KkqQ4Jg2m03+NqWohul4o4MQXcLlcCqt7256AO3dSC/dVNawW1AgoILB50yamy2O2DYFfbiZk8HQYjPcSQZh8dGu/wmMcWxLw49UlP0x2mOLS0HyDO57gtihquxC49E10NpfLRXO5fAxI8O2Sd8Z5jmcbBXyufOFxu93hf+7l/D2SdOqFkf2LZoxrCwI+nP/YD2kuDHmdQHoLvDr6SsyssS0PgZNvT02D8dFsNhuHtuvo+GsxM8e3VAGPDWybymQynt7e3uD7783MOmohApfFn33qmT/Hx4/6iRMBBExAc6bxXdgI/wowAG3K8lFRmJ+tAAAAAElFTkSuQmCC';
    var nightclub_marker = 'data:image/png;base64,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';
    if(localinit_instance.getIconAddress){
        return localinit_instance.getIconAddress(types,highlight,record);
    }

    if(record){
        if (record.record && record.record==='favorites'){
    switch(record.menu_type){
        case 'home':
            return 'data:image/png;base64,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';
            break;
        case 'work':
            return 'data:image/png;base64,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';
            break;
        default:
            return 'data:image/png;base64,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';
            break;
    }
    }
        }
        if(displayInfo.type!==null)
            types=displayInfo.type;
    if (checkTypes('food', types)) {
        if (highlight === true)
            iconAddress = restaurant_hi;
        else
            iconAddress = restaurant_marker;
    }
    if (checkTypes('bar', types)) {
        if (highlight === true)
            iconAddress = 'images/bar.hi.png';
        else
            iconAddress = bar_marker;
    }
    if (checkTypes('cafe', types)) {
        if (highlight === true)
            iconAddress = 'images/cafe.hi.png';
        else
            iconAddress = cafe_marker;
    }
    if (checkTypes('restaurant', types)) {
        if (highlight === true)
            iconAddress = restaurant_hi;
        else
            iconAddress = restaurant_marker;
    }
    if (checkTypes('hotel', types))
        iconAddress = hotel_marker;

    if(checkTypes('doctor', types))
        iconAddress = doctor_marker;
    if(checkTypes('dentist', types))
        iconAddress = dentist_marker;
    if(checkTypes('pharmacy', types))
        iconAddress = pharmacy_marker;
    if(checkTypes('hospital', types))
        iconAddress = hospital_marker;

    if(checkTypes('gym', types))
        iconAddress = gym_marker;

    if(checkTypes('park', types))
        iconAddress = park_marker;


    if(checkTypes('spa', types))
        iconAddress = spa_marker;
    if(checkTypes('hotel', types))
        iconAddress = hotel_marker;
    if(checkTypes('lodging', types))
        iconAddress = hotel_marker;
    if(checkTypes('parking', types))
        iconAddress = parking_marker;

    if(checkTypes('shoe_store', types))
        iconAddress = shoes_marker;
    if(checkTypes('clothing_store', types))
        iconAddress = clothes_marker;
    if(checkTypes('beauty_salon', types))
        iconAddress = salon_marker;

    if (checkTypes('atm', types))
        iconAddress = atm_marker;
    if (checkTypes('bank', types))
        iconAddress = bank_marker;
    if (checkTypes('school', types))
        iconAddress = school_marker;
    if (checkTypes('university', types))
        iconAddress = school_marker;
    if (checkTypes('gas_station', types))
        iconAddress = gas_marker;

    if (checkTypes('church', types))
        iconAddress = church;
    if (checkTypes('synagogue', types))
        iconAddress = synagogue;
    if (checkTypes('mosque', types))
        iconAddress = mosque;

    if (checkTypes('museum', types))
        iconAddress = museum_marker;
    if (checkTypes('night_club', types))
        iconAddress = nightclub_marker;
    if (checkTypes('stadium', types))
        iconAddress = stadium_marker;
    if (checkTypes('bowling', types))
        iconAddress = bowling_marker;
    if (checkTypes('art_gallery', types))
        iconAddress = art_gallery_marker;

    return iconAddress;
};
function checkPrice(string){
    if (string) {
        var value=(string/5)*100;
        return '<div style="float:left">'+string+'</div><div class="price_bar_alt price_medium" style=""><span style="width:'+value+'%" class="pricing-www-alt price_medium"></span></div>';
    }
    return 'Unknown';
    /*
    if(string){
        switch(string){
            case 0:
                return '<img class="ui-icon-price-0 description-icon" style="width:49px;height: 15px">';
                break;
            case 1:
                return '<img class="ui-icon-price-1 description-icon" style="width:49px;height: 15px">';
                break;
            case 2:
                return '<img class="ui-icon-price-2 description-icon" style="width:49px;height: 15px">';
                break;
            case 3:
                return '<img class="ui-icon-price-3 description-icon" style="width:49px;height: 15px">';
                break;
            case 4:
                return '<img class="ui-icon-price-4 description-icon" style="width:49px;height: 15px">';
                break;
            default:
                return 'Unknown';
        }
    }
    return "Unknown";
    */
}
function checkNone(string) {
    if (string)
        return string;
    else
        return 'none';
}
function checkNoneReturnWindowOpen(string) {
    if (string)
        return 'onclick="window.open(\'' + string.replace(/[\/]/g, '/\/') + '\',\'_system\')"';
    else
        return '';
}
function checkNoneReturnNull(string) {
    if (string)
        return string;
    else
        return '';
}
function isValidTime(time) {
    if (time === null || time === undefined)
        return false;
    if (time === "00:00:00")
        return false;
    return true;
}
function createVenueString(venue) {
	var string;
    if(venue.record==='postings'){
	string =
		'<div class="venue-image" style="background:transparent">' +
        '<a id="prevImage" title="Retrieve previous set" class="tooltip cluster-icon" style="height: 45px;width: 45px;bottom:0px;right:0px;font-size:25px;background-color: white;border-radius:50%;border: 2px solid black" >&nbsp<&nbsp</a>'+
          '<a id="nextImage" title="Retrieve next set" class="tooltip cluster-icon" style="height: 45px;width: 45px;bottom:0px;right:0px;font-size:25px;background-color: white;border-radius:50%;border: 2px solid black" >&nbsp>&nbsp</a>'+

            '</div>'+
            '<div class="venue-block" style="border-top: 1px;border-style:solid none none none;border-width: 1px; border-color: black;"><img class="ui-icon-location description-icon">'+
            '<div style="" class="invite_display"><p class="description-text">' + venue.name + '</p>' +

            '<p class="description-text">' + venue.formatted_address + '</p></div></div>' +
            '<div class="venue-block"><img class="ui-icon-phone description-icon">'+
            '<p class="description-text"><a href="tel:' + venue.formatted_phone_number + '">' + checkNone(venue.formatted_phone_number) + '</a></p></div>' +

            //'<p><b>Website: </b><a href="' + checkNoneReturnNull(venue.website) + '" target="_blank">' + checkNone(venue.website) + '</a></p>' +
/*
            '<div class="venue-block"><img class="ui-icon-website description-icon">'+
            '<p class="description-text"><a href="#"' + checkNoneReturnWindowOpen(venue.website) + '>' + checkNone(venue.website) + '</a></p></div>' +
*/
            '<div class="venue-block"><img class="ui-icon-types description-icon">'+
            '<p class="description-text">' + venue.types + '</p></div>';
	}else {
   	string =
		'<div class="venue-image" style="background:transparent" >' +
        '<a id="prevImage" title="Retrieve previous set" data-nodisc="true" data-inline="true" data-icon="carat-l" data-iconpos="notext" data-role="button" class="tooltip ui-nodisc-icon cluster-icon" style="height: 45px;width: 45px;border-radius: 50%; padding-top: 4px;margin: 0px;right:0px;" ></a>'+
        '<a id="nextImage" title="Retrieve next set" data-nodisc="true" data-inline="true" data-icon="carat-r" data-iconpos="notext" data-role="button" class="tooltip ui-nodisc-icon cluster-icon" style="height: 45px;width: 45px;border-radius: 50%; padding-top: 4px;margin: 0px;right:0px;" ></a>'+

        '</div>'+
            '<div class="venue-block" style="border-top: 1px;border-style:solid none none none;border-width: 1px; border-color: black;"><img class="ui-icon-location description-icon">'+
            '<div style="" class="invite_display"><p class="description-text">' + venue.name + '</p>' +

            '<p class="description-text">' + venue.formatted_address + '</p></div></div>' +
            '<div class="venue-block"><img class="ui-icon-phone description-icon">'+
            '<p class="description-text"><a href="tel:' + venue.formatted_phone_number + '">' + checkNone(venue.formatted_phone_number) + '</a></p></div>' +

            //'<p><b>Website: </b><a href="' + checkNoneReturnNull(venue.website) + '" target="_blank">' + checkNone(venue.website) + '</a></p>' +
            '<div class="venue-block"><img class="ui-icon-website description-icon">'+
            '<p class="description-text"><a href="#"' + checkNoneReturnWindowOpen(venue.website) + '>' + checkNone(venue.website) + '</a></p></div>' +
            '<div class="venue-block"><img class="ui-icon-types description-icon">'+
            '<p class="description-text">' + venue.types + '</p></div>' +
            '<div class="venue-block"><img class="ui-icon-price description-icon">'+
            '<div class="description-text container">' + checkPrice(venue.price_level) + '</div></div>';
}
    //these are the vendor specials, note to include the time
    if (venue.vendorData) {
        for (var i = 0; i < venue.vendorData.length; i++) {
            if(venue.vendorData[i].event_name)
                string += "<hr style='clear:both'><br><b>" + venue.vendorData[i].event_name + "</b><br>";
            //time of the event as it can be happy hour or an early bird type special
            if (isValidTime(venue.vendorData[i].start_time) || isValidTime(venue.vendorData[i].end_time)) {
                var start = moment(venue.vendorData[i].start_time, "hh:mm:ss").format("h:mm a");
                var end = moment(venue.vendorData[i].end_time, "hh:mm:ss").format("h:mm a");
                string += "From " + start + " to " + end;
            }
            if(venue.vendorData[i].event_description)
                string += '<p>' + venue.vendorData[i].event_description + '</p>';
        }
    }
	if(venue.record!=='postings')
    string += '<div class="venue-block"><hr style="clear:both"><div id="yelpDetails"></div></div>' +
            '<div class="venue-block"><br><p style="clear:both"><b>Google Rating: </b>' + checkNone(venue.rating) + '</p></div>';

    if (venue.reviews) {
        for (var i = 0; i < venue.reviews.length; i++) {
            string += '<div class="review"><p style="float: left"><b>Review ' + (i + 1) + '</b> of ' + venue.reviews.length + '</p>'
                    + '<p style="float: right"><b>Rating:</b>' + venue.reviews[i].rating + '</p>'
                    + '<p style="clear: both"><b>Reviewer:</b>' + venue.reviews[i].author_name + '</p>'
                    + '<p><b>Review:</b>' + venue.reviews[i].text + '</p></div>';
        }
    }

    return string;
}
function setupVenueListeners(){
        $('#prevImage').click("displayVenuePhotoClick(-1)");
        $('#nextImage').click("displayVenuePhotoClick(1)")
}
function convertYelpData(data) {
    if (data.error)
        return '';
    string = '<p style="float: left"><b>Yelp Reviews:</b>' + data.review_count + '</p><div style="float: right"><p>Yelp Rating:<img src="' + data.rating_img_url_small + '" alt="rating"></div></p>';
    string += '<p style="clear: both"><b>Review Snippet</b> "' + data.reviews[0].excerpt + '" </p>' + data.reviews[0].user.name + '<img src="' + data.reviews[0].rating_image_small_url + '" alt="rating">';
    string += '<br><p style="float: left"><b>Yelp Page: <a href="#" onclick="window.open(\'' + data.url + '\',\'_system\')">More on Yelp</a></p>';
    string += '<img src="images/Powered_By_Yelp_Red.png" alt="Yelp logo" style="float: right">';
    string += '</div><hr style="clear:both">';
    return string;
}
function displayVenuePhoto(venue) {
    displayInfo.imagePointer=0;
    var url = '';
    var string;
	if (venue===''){
        $('#venue-details-image').css('background-image', 'url("")');
	    return;
	}

    if (venue.photos) {
	string=venue.photos[0];
	//geturl is a function from google
        url = string.getUrl({'maxWidth': displayInfo.panelWidth, 'maxHeight': 200});
    }else if(venue.imageArray && venue.imageArray.length>0){
	url=postingHost+postingPicturePath+'/'+venue.imageArray[0].id+'/'+venue.imageArray[0].image;
    }
    console.log('loading image:' + url);
    if (url !== '')
        $('#venue-details-image').css('background-image', 'url(' + url + ')');
    else
        $('#venue-details-image').css('background-image', 'url("")');

}
//when the image is clicked, we'll call this function to go to the next image if any
//
function displayVenuePhotoClick(increment){
    var string,maxLength;
    var url='';
    var venue=displayInfo.venue;
    displayInfo.imagePointer+=increment;
    console.log(' image counter: '+ displayInfo.imagePointer);
    //images will be either in the imageArray or photos
    //
    if(displayInfo.imagePointer <0 )
        displayInfo.imagePointer = 0;
    if (venue.photos) {
        if(displayInfo.imagePointer>=(venue.photos.length-1))
            displayInfo.imagePointer=venue.photos.length-1;
        string=venue.photos[displayInfo.imagePointer];
        //geturl is a function from google
        url = string.getUrl({'maxWidth': displayInfo.panelWidth, 'maxHeight': 200});

    }else if(venue.imageArray && venue.imageArray.length){
        if(displayInfo.imagePointer>=(venue.imageArray.length-1))
            displayInfo.imagePointer=venue.imageArray.length-1;
        url = postingHost+postingPicturePath+'/'+venue.imageArray[displayInfo.imagePointer].id+'/'+venue.imageArray[displayInfo.imagePointer].image;
    }

    console.log('loading image:' + url);
    if (url !== '')
        $('#venue-details-image').css('background-image', 'url(' + url + ')');
    else
        $('#venue-details-image').css('background-image', 'url("")');

}
/*********************
 * should turn on the little marker window
 *
 * @param {type} place_id is the place information with reviews
 * @returns {undefined}
 */
function transitionToDetail(place_id) {
    //console.log('calling transition');
    console.log('entering transitionToDetail');
    $('#venue-details-ui-text').text("");
    displayVenuePhoto("");
    displayInfo.eventLocationId = place_id; //displayInfo.eventLocationId is used to create the event
    closeWindows(venueDetailsUi);
}
function venueDetailUiSizeFix(){
    var headerHeight = parseInt($('#venue-details-ui-text-header').css('height').replace(/\D/g, ''));
    var copyrightHeight = 25;// parseInt($('#venue-details-copyright').css('height').replace(/\D/g, ''));
    if(displayInfo.windowedMode===true){
	$(venueDetailsUi).css('top','0');
	$(venueDetailsUi).css('position','absolute');
	$(venueDetailsUi).css('left','0');
	}
    $('venue-details-copyright').css('height','25px');

    //this is 0 when coming in from the venueList screen
    var textHeight = displayInfo.deviceHeight - (headerHeight + copyrightHeight +displayInfo.gmapTop) - 2;
    console.log('text height'+textHeight);
    $(venueDetailsUi).css('height',displayInfo.deviceHeight);
    $(venueDetailsUi).css('width',displayInfo.panelWidth);
    $("#venue-details-ui-text").css('top', headerHeight);
    $("#venue-details-ui-text").css('height', textHeight );
    $("#venue-details-ui-text").css('position', 'absolute');

}
function _transitionToDetail(){
    //tehcnically this is only needed if in platform===2 and narrow mode becuase
    //this will be overlapping the map
    //checkMapClickIn();
    var string;
    venueDetailUiSizeFix();
    var place_id=displayInfo.eventLocationId; //displayInfo.eventLocationId is used to create the event
    var venue = _.find(venueDetails, function (object) {
        return object.place_id === place_id;
    });
    //lets save the venue
    displayInfo.venue=venue;
    openMarkerInfoWindow(place_id);
    displayVenuePhoto(venue);

    if (venue) {//long indicates that the extended information has been retrieved
        $('#venue-details-ui-text').text('');
        if (venue.vendorData) {

        }
        if (venue.long) {
            string = createVenueString(venue);

        } else {
            venue.long = false;
            // venue details does not exist so query the minute function
            getVenueDetailsMinute(place_id);
                if(!venue.vendorDataCheck){
                    var queryString = [];
                    queryString.push(place_id);
                    processExtendedData(queryString);
                }
            var value = setInterval(function () {
                if (venue.long === true) {
                    clearTimeout(value);
                    displayVenuePhoto(venue);
                    $('#venueName').text("");
		    if(venue!=='postings'){
                    var yelp = handleYelpRequest(venue.formatted_phone_number);
                    var details = handleDetailRequest(place_id);
                    yelp.done(function (data, status) {
                        searchReplace(data,"http","https")
                        var yelpData = convertYelpData(data);
                        venue.yelpData = data;
                        //yelpData=yelpData.replace("http","https");
                        $('#yelpDetails').html(yelpData);
                        if (platform === 2) {
                            console.log('transitionToDetails yelp map refresh layout');
                            map.refreshLayout();
                        }
                    });
			}
                    string = createVenueString(venue);
                    //why is the append over here but the string contrustion below?
                    $('#venue-details-ui-text').append(string);
                    setupVenueListeners();
                    $(venueDetailsUi).trigger('create');
                    //we can ask for yelp only after we get the phone number
                    if (platform === 2) {
                        console.log('transitionToDetails map refresh layout');
                        map.refreshLayout();
                    }
                }
            }, 500); //test every half a second
            //retreiving please wait
        }
    }//where is the string being set?

    //}
    //why is the append over here but the string contrustion below?
    $('#venue-details-ui-text').append(string);
    if (venue.yelpData) {
        var nString = convertYelpData(venue.yelpData);
        $('#yelpDetails').html(nString);
    }
    if (platform === 2) {
        console.log('transitionToDetails map refresh layout');
        map.refreshLayout();
    }
    //shold center the map on the place
}
/***********************
 * calculateRoute() will, given point1 and point2, find the route between the two points
 * and draw them.  If it is suppose to do the midpoint/halfway it will find the route,
 * get the halfway point and find the subroutes.
 *
 * startingLocation1 has to exist and startingLocation2 might have to exist
 *
 */
//note to extended it to dropBouncingMarker, dropDropMarker etc
//note to add functionality for feedback when marker is moved
//add feedback when dragging marker
// we will call this routines whenever A and B are moved
// first mode will be to  get the midpoint
// second will be to draw from point A and point B to midpoiint
// note that if the midpoint is moved then the route does not have to be recalculated to find the midpoint
//phonegap plugin does not support search yet nor route
function calculateRoute() {
    var request = {
        origin: startingLocation1.googlePosition,
        destination: startingLocation2.googlePosition,
        provideRouteAlternatives: true,
        //valid travel modes DRIVING, BICYCLING, TRANSIT, WALKING
        travelMode: google.maps.TravelMode[displayInfo.travelMode]
    };
    var bounds;
    console.log("calculateRoute called");
    hmenu_instance.popupMenuHide();
    if (searchFlag === true && displayInfo.touristMode===false)
        clearVenues();
    searchFlag = false;//turn off search flag
    if (platform === 2)
        bounds = new plugin.google.maps.LatLngBounds();
    else
        bounds = new google.maps.LatLngBounds();
    if (navigateFlag === false) {
        if (startingLocation1.googlePosition !== null && startingLocation2.googlePosition !== null) {
            console.log('Navigation not set, setting bounds');
            bounds.extend(startingLocation1.position);
            bounds.extend(startingLocation2.position);
            if (platform !== 2)
                map.fitBounds(bounds);
            else
                map.moveCamera({
                    'target': bounds
                }, function () {
                });
        } else if (startingLocation1.googlePosition !== null){
            zoomMarker(startingLocation1.googlePosition);
            //map.setCenter(startingLocation1.position);
        }else {//(startingLocation2.googlePosition !== null)
            zoomMarker(startingLocation2.googlePosition);
            //map.setCenter(startingLocation2.position);
        }
        return;
    }


    console.log('calculating route ' + startingLocation1.position + ':' + startingLocation2.position);
    if (startingLocation1.position === null || startingLocation2.position === null)
        return;
    displayInfo.resetMapDisplay=true;
        startingLocation1.marker.setIcon(marker.markerA());//markera);
        if(startingLocation2.customMarker===false)
            startingLocation2.marker.setIcon(marker.markerB());
    if(startingLocation2.place_id && startingLocation2.customMarker===false){
        var iconAddress = VenueObject.prototype.getMarkerUrl(startingLocation2.place.types,false,startingLocation2);
        if(iconAddress)
            startingLocation2.marker.setIcon(iconAddress);
    }
    $('#route-text').text('');
    //closeWindowsReset();
    //closeWindows();
    //this google function gets the actual route

    console.log('calculateRoute calling directions service');
    searchWait();
    directionsService.route(request, function (response, status) {
        searchDone();
        console.log('calculateRoute directionServices returned:' + status);
        if (status === google.maps.DirectionsStatus.OK) {
            $('#distance ').text('routes ' + response.routes.length + ': ' + response.routes[0].legs[0].distance.value + ' feet ');
            /*note that a route was found... if this is in the find venue at the end
             * mode, then there is no need to find subroutes
             *
             */
            //this routine does the heavy lifting, and more than just the distance.
            if (navigateFlag === 1) {
                _removeRoutes();
                midCircle.clearCircle();
                routeDetails1 = drawLeg(request, routeDetails1, polylineRoute1, 'red', 'A');

                //default will not search for venues, but directly navigate
                //searchForVenues(startingLocation2.googlePosition);
                console.log('A route picked:' + routeDetails1.routeIndex);
                bounds.extend(startingLocation1.position);
                bounds.extend(startingLocation2.position);
                if (platform !== 2)
                    map.fitBounds(bounds);
                else
                    map.moveCamera({
                        'target': bounds
                    }, function () {
                    });

            } else {
                displayInfo.midlocation = calculateStepDistance(response.routes[0].legs[0].steps, response.routes[0].legs[0].distance.value / 2);
                midCircle.drawSearchCircle(displayInfo.midlocation, false, true);
                console.log('calculating subroutes');
                findSubRoutes();
            }
        } else {
            console.log('Error directionServices' + status);
            switch (status) {
                case "ZERO_RESULTS":
                    popupMessage("Problem retrieving route, no route found.");
                    break;
                case "NOT_FOUND":
                    popupMessage("Problem retrieving direction information, network appears to be down.");
                    break;
                case "UNKNOWN_ERROR":
                    popupMessage("direction information, server error.");
                    break;
            }
        }
    });
    console.log('setting bounds');
}//end calculateRoute()
//note that midlocation has the current location saved (is it saved when moved?
//
function updateSearchValuesAndClose(){
    if ($("#pricingForm :radio:checked").length === 0) {
        displayInfo.minPrice=0;
    } else {
        displayInfo.minPrice=$('input:radio[name=pricing]:checked').val();
    }
    aroundMe();
}
function searchAndClose() {
    aroundMe();
}
function saveAndReturn() {
    console.log('returning to [' + displayInfo.previousDisplayDiv + ']');
    closeWindows(displayInfo.previousDisplayDiv);
}
function venueCardSize() {
    if (displayInfo.narrow === true) {
        return "card-narrow";
    } else {

        return "card-wide";
    }
}
function venueCardSetup() {
    var card = venueCardSize();
    //$('#venue-text-scrolling').append($('#venue-text'));
    $('.card').each(function (element, object) {
        $(object).removeClass();
        $(object).addClass('card ' + card);
        if (platform !== 2)//this is the hover
            $(object).addClass('card-web ');
    });

if(displayInfo.windowedMode===true){
$('#venue-text').css('overflow','hidden');
$('#venue-text').css('width','');
return;
}
    if (displayInfo.narrow === true) {
        $('#venue-text').css('width', (venueDetails.length + 1) * 220 + 'px');//container must be able to hold all the cards horizontally
        $("#venue-text").css('height','220px');
        $(".venue-label").css('width','25%');
        $(".venue-value").css('width','75%');

    } else {//not narrow make sure settings are copacetic
        //to unimplement vertical cards
        //$('#venue-text').css('width', (venueDetails.length + 1) * 201 + 'px');//container must be able to hold all the cards horizontally
        $('#venue-text').css('width', '');//container must be able to hold all the cards horizontally
        $(".venue-label").css('width','');
        $(".venue-value").css('width','');
        $("#venue-text").css('height','');
    }
} // end venueCardSetup
function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}

/***************
 * venueUiSizeFix()
 * called before venue-ui is opened so that the calculations of the screen is done before
 * it is opened.  Needed because in the app, there is only one map, and that has to be manipulated.
 *
 * Must be re-enterant, when the screen is oriented.
 *
 * @returns {undefined}
 */
function venueUiSizeFix() {
    if (displayInfo.venueUiPanel === false) {
        displayInfo.venueUiPanel = true;
        // venueUiPanel();
    }
    //venueCardSetup();
    //if displayInfo.narrow==true
    // then we have to determine the size of the map by taking the displayInfo.height and subtracting everything from there
    // to get the minimap/googleMap height, otherwise minimap size is 0 and googleMap
    var copyrightHeight = 25;//$('#venue-ui-copyright').css('height').replace(/\D/g, '');
    var adHeight = $('#venue-ui-adcontainer').css('height').replace(/\D/g, '');
    var bottomHeight = parseInt(copyrightHeight) + parseInt(adHeight);
    var venueListHeight;
    var headerHeight = $('#venue-ui-text-header').css('height').replace(/\D/g, '');
    $("#venue-ui-container").css("position","fixed");
    if (displayInfo.windowedMode===true){
        $(venueUi).css('width', displayInfo.panelWidth);
        $(venueUi).css('height', displayInfo.deviceHeight);
        $(venueUi).css('left', 0);
        $(venueUi).css('top', 0);
        $(venueUi).css('position','absolute');
	var headerHeight=48;
        $('#venue-ui-text-header').css('height',headerHeight);
        venueListHeight = displayInfo.deviceHeight - parseInt(headerHeight) - parseInt(adHeight) - parseInt(copyrightHeight) -displayInfo.gmapTop - 15;
	$('#venue-text').css('width',displayInfo.panelWidth);
	$('#venue-text').css('overflow','hidden');
        $('#venue-ui-container').css('position','relative');
        $("#venue-ui-container").css('height', venueListHeight + 'px');
        $("#venue-ui-container").css('width', displayInfo.panelWidth);
	return;
	}
    if (displayInfo.narrow === true) {

        /*this should take into account the different height of the displays
         *the iphone 4s is too short so 300 wouldn't see the panels
         *With the possibility that ads will be placed here, the mapsize should be dynamic
         *googleMapHeight = deviceHeight-venueHeader-cardHeight-copyrightHeight-adHeight;
         *Because scrolling is in the venue-ui-container, ad must be below it
         */

        $('#minimap').append(GoogleMapDiv);
        displayInfo.movedGoogleMap = true;

        GoogleMapDiv.css('left', '0px');
        //the width will almost always be the device width
        $('#minimap').css('width', displayInfo.deviceWidth);
        GoogleMapDiv.css('width', displayInfo.deviceWidth);

        //if it is narrow then use vertical cards, rather than horizontal cards.
        GoogleMapDiv.css('position', 'relative');
        $('#uberpanel').hide();
        //*******************
        //the fixed heights
        // #venue-ui-adcontainer
        // #venue-ui-text header - contains the buttons
        // #venue-ui-copyright - contains the copyright information
        //
        //the variable heights
        // #venue-text-scrolling - this changes depending on orientation
        //                       -should be based on the cards cards height+scrollbar if any
        // #venue-ui-container - #venue-ui-text-scrolling + scrollbars
        // #googleMap
        //
        //note that teh venue-ui-container's height is #venue-text+ scrollbar height
        var gottenVenueHeight = $("#venue-text").css('height').replace(/\D/g, '');//should be the height of the card + scrolling attribute card is 165
        $('#venue-ui-container').css('height', gottenVenueHeight);
        console.log('gottenVenueHeight:'+gottenVenueHeight);
        var scroll = getScrollbarWidth() + 5;
        //theoretically these shouldn't be changing
        var height = displayInfo.deviceHeight - parseInt(headerHeight) - parseInt(gottenVenueHeight) - bottomHeight - scroll;
        GoogleMapDiv.css('height', height + 'px');
        $('#minimap').css('height', height + 'px');

//the top in this case is the height of the map + the header height\
//give a space of 10 for the arrow
	var total=height+parseInt(headerHeight)+displayInfo.gmapTop;
        $('#venue-ui-container').css('top', total+'px');
        //need the width and height?
console.log('display device width'+displayInfo.deviceWidth);
        $('#venue-ui-container').css('width', displayInfo.deviceWidth);
        $('#venue-ui-container').css('height', '220px');//width should be set
        $('#venue-ui-container').css('overflow-y', 'hidden');//width should be set
        displayInfo.gmapHeight = height;
        displayInfo.gmapWidth = displayInfo.width;
        //if the map is moved then the venue list height is shortened
	//note forgot the statusline on iOS
        venueListHeight = displayInfo.deviceHeight - parseInt(headerHeight) - parseInt(adHeight) - parseInt(copyrightHeight) - height -displayInfo.gmapTop - 2;

    } else {//not narrow make sure settings are copacetic
	var total=parseInt(headerHeight)+parseInt(displayInfo.gmapTop);
        $('#venue-ui-container').css('top', total + 'px');
        $('#venue-ui-container').css('position', 'absolute');
        $('#venue-ui-container').css('width', displayInfo.panelWidth);//width should be set
        $('#venue-ui-container').css('overflow-y', 'auto');//width should be set

        //note that the scrollbar at the bottom is not taken into account
        $('#minimap').css('height', '0px');
        GoogleMapDiv.css('right', '0px');
        GoogleMapDiv.css('left', '');
        //what should this width be?
        GoogleMapDiv.css('position', 'absolute');
        var width = $(venueUi).css('width').replace(/\D/g, '');
        GoogleMapDiv.css('width', displayInfo.deviceWidth - parseInt(width));
        //header height in this case is jsut the buttons
        var headerHeight = $('#venue-ui-text-header').css('height').replace(/\D/g, '');
        venueListHeight = displayInfo.deviceHeight - parseInt(headerHeight) - parseInt(adHeight) - parseInt(copyrightHeight) -displayInfo.gmapTop - 15;
        $("#venue-ui-container").css('height', venueListHeight + 'px');
    }
    //console.log('venue container height' + venueListHeight);
    //the map is contained in the venue-ui-text-header, and the advertisement has to be outside of it
    console.log('venueUi map refresh layout');
    /*
     if (platform === 2) {
     //note if this happens have to put it back when closing venueUI
     console.log('venue size fix refresh layout');
     map.refreshLayout();
     }
     else
     google.maps.event.trigger(map, 'resize');
     */
    GoogleMapDiv.css('float', '');
    GoogleMapDiv.css('top', '0px');
}

/*****
 * mutation observer allows dom manulations to observed, in this case, specifically route choice changes
 * that happens in the gool maps route display.
 *
 * @type @exp;window@pro;WebKitMutationObserver|@exp;window@pro;MutationObserver
 */
var MutationObserverObject = window.MutationObserver || window.WebKitMutationObserver;
function handleRouteUiSelection() {
    //this has to be disconnected when it's close?
    var targetNodes = $('#route-text');//.adp-listsel');//keep track of where this goes
    var observeOptions = {
        childList: true,
        characterData: false,
        subtree: true};
    var MutationObserver2 = new MutationObserverObject(function(mutations,observer){
        //note that we care about which mutations, ust that they happened
/*        for (var i = 0; i < mutations.length; i++) {
            var target=mutations[i].target;
            var childElement=mutations[i].target.childNodes;
            for(var j=0;j<childElement.length;j++){
                if(childElement===".adp-marker"){
                    console.log('yes');
                }
                */
            $(".adp-marker").each(function(i){
                var item=$(this);
                var src=$(this).attr("src");
                //this should look at the navigate flag and startingLocation1 and startingLocation2
                // to see if it's A, B or 1g and 2g and loolmarker
                if(src!==undefined && src.indexOf("text=A")>0){
                    item.data("type","A");
                    $(this).attr("src",null);
                        $(this).addClass("ui-marker-a");
                }
                if(src!==undefined && src.indexOf("text=B")>0){
                    item.data("type","B");
                    $(this).attr("src",null);
                    if(navigateFlag===1)
                        $(this).addClass("ui-marker-b");
                    else//note this is to be the loolmarker
                        $(this).addClass("ui-marker-loolmarker");

                }
            });

    });
    /* search for the class adp-listsel and look for jsinstance
     * if current row is td, go to parent
     * else if current row is <li then get current route
     *
     * li is if transit data is used
     * td is if all others is used.
     * not finished, suppose to change the highlighted route on
     * individual platforms.
     * how to tell which route, 1 or 2 was chosen?
     */
    var MutationObserver1 = new MutationObserverObject(function (mutations, observer) {
        var selectFlag = 0, updateMarkers=0;
        console.log("mutations["+mutations.length+"]");
        for (var i = 0; i < mutations.length; i++) {
            var target=mutations[i].target;
            var childElement=mutations[i].target.childNodes;
            for(var j=0;j<childElement.length;j++){
//                console.log(j+":class name:"+childElement[j].className);
                if(mutations[i].addedNodes.length>0){
                    if(childElement[j].className==="adp-list"){
//                        console.log(j+':detected route');
                        selectFlag=1;
                    }
                    if(childElement[j].className==="adp"){
//                        console.log(j+':detected markers');
                        updateMarkers=1;
                    }
                }
                if(mutations[i].removedNodes.length>0){
//                    console.log('remove node:'+i);
                }
            }
            /*
            if (mutations[i].addedNodes.length > 0 && mutations[i].target.firstChild.className === 'adp-list') {
//                console.log('added i:' + i + ' type: ' + mutations[i].type + ':' + mutations[i].target + ':' + mutations[i].target.firstChild.className);
                selectFlag = 1;
            }
            if (mutations[i].addedNodes.length > 0 && mutations[i].target.firstChild.className === 'adp') {            //this contains the marker...must search
//                console.log("detected marker");
            }
            */
        }
        if (selectFlag === 1) {
            var obj = $(".adp-listsel").get(0);
            var value,type;
            var color;
            console.log('Altering navigation route');
            if (obj) {
                if (obj.localName === 'li')
                    value = $(obj).attr('jsinstance');
                if (obj.localName === 'td')
                    value = $(obj).parent().attr('jsinstance');
                selectedRoute.routeIndex = value;
                if (selectedRoute === routeDetails1) {
                    color = 'red';
                    type = 'A';
                } else {
                    color = 'blue';
                    type = 'B';
                }
                //$('#route-ui').hide();

                selectedRoute.routeIndex = parseInt(value.replace(/\D/g, ''));
                //lets move the routeMarker
                var routeMarkerPlacement = calculateStepDistance(
                        selectedRoute.response.routes[selectedRoute.routeIndex].legs[0].steps,
                        selectedRoute.response.routes[selectedRoute.routeIndex].legs[0].distance.value / 2);
                selectedRoute.routeMarker.setPosition(selectedRoute.routeMarker, routeMarkerPlacement);
                //note that for web or platform===1 that the bounds should be set to something reasonable
                //to address bug #53
                if (platform === 2)
                    redrawLeg(selectedRoute.polyline, selectedRoute.routeIndex, color, type);
                else {
                    // the various routes should be redrawnusing DirectionsRenderer on platform===1 since it is
                    // not being reliablly done
                    //http://stackoverflow.com/questions/18974512/how-to-display-alternative-route-using-google-map-api
                    //for i=selectedIndex use the primary color otherwise red
                    var scolor;
                    //a problem is that the previous directions are not removed
                    //can i set it to null? http://stackoverflow.com/questions/35597394/how-to-change-color-of-route-in-google-map-api-after-route-is-build
                    //when a new route is chosen, the old display must be cleared out.
                    selectedRoute.setRouteIndex(selectedRoute.routeIndex);
                  for (var i = 0, len = selectedRoute.response.routes.length; i < len; i++) {
                      removeRoute(selectedRoute.response,i);
                      if(i===selectedRoute.routeIndex)
                          scolor=color;
                      else{
                          scolor='gray';
                        drawRoute(selectedRoute.response,i,scolor);
                    }
                    var value = routeMask(google.maps.geometry.encoding.decodePath(selectedRoute.response.routes[i].overview_polyline), 'gray', i, type);
                    selectedRoute.response.routes[i].mask = value;
/*
                        selectedRoute.response.routes[i].display=new google.maps.DirectionsRenderer({
                            map: map,
                            directions: selectedRoute.response,
                            routeIndex: i,
                            polylineOptions: { strokeColor: scolor },
                            suppressMarkers: true
                        });
*/
                    }
                    var bounds = new google.maps.LatLngBounds();
                    bounds.extend(startingLocation1.position);
                    bounds.extend(startingLocation2.position);
                    displayInfo.bounds = bounds;
                    map.fitBounds(bounds);//note that this will fail if it is in portrait mode
                }
            }

            if(displayInfo.routeIndex){
            //*******************if theh selectction is not done
            //this will have to go through each selection and on the displayInfo.routeIndex!==null then
            //select the item note that there is no class or id on the item.. will have to loop
            //through all the .adp-list<div<ol<li under adp-list
                $("div.adp-list > div > ol > li").each(function(i){
                    if(i===displayInfo.routeIndex){
                        var evt = new MouseEvent("click", {
                            view: window,
                            bubbles: true,
                            cancelable: true
    //clientX: 20,
    // whatever properties you want to give it
                            });
                        $(this)[0].dispatchEvent(evt);
                        //$(this).click();// lets see if simulating a click workseaddClass("adp-listsel");
                        console.log('clicking adp-list i:'+i);
                    }//
                    //else
                      //  $(this).removeClass("adp-listsel")
                });
                displayInfo.routeIndex=null;
            }

        }
        //if(updateMarkers===1)

        {
            //markers are in the class .adb-markers
            //note that text=A or =B will indicate the type of
            $(".adp-marker").each(function(i){
                var item=$(this);
                var src=$(this).attr("src");
                //this should look at the navigate flag and startingLocation1 and startingLocation2
                // to see if it's A, B or 1g and 2g and loolmarker
                if(src!==undefined && src.indexOf("text=A")>0){
                    item.data("type","A");
                    $(this).attr("src",null);
                        $(this).addClass("ui-marker-a");
                }
                if(src!==undefined && src.indexOf("text=B")>0){
                    item.data("type","B");
                    $(this).attr("src",null);
                    if(navigateFlag===1)
                        $(this).addClass("ui-marker-b");
                    else//note this is to be the loolmarker
                        $(this).addClass("ui-marker-loolmarker");

                }
            });
        }
    });
    /* *********** commented out 4/19/2016 for the web, might still
     * be needed for the app
     * note that this goes into an endless loop*/
    selectedRoute.observer = MutationObserver2;
    targetNodes = document.querySelector('#route-text');
    MutationObserver2.observe(targetNodes, observeOptions);
    //will have to do a MutationObjserver.disconnect();
    /**/
}
function handleGoogleMarkers() {
    //this has to be disconnected when it's close?
    var targetNodes = $('.adb-marker')[0];//.adp-listsel');//keep track of where this goes
    var observeOptions = {
        childList: true,
        characterData: false,
        subtree: true};
    /* search for the class adp-listsel and look for jsinstance
     * if current row is td, go to parent
     * else if current row is <li then get current route
     *
     * li is if transit data is used
     * td is if all others is used.
     * not finished, suppose to change the highlighted route on
     * individual platforms.
     * how to tell which route, 1 or 2 was chosen?
     */
    var MutationObserver1 = new MutationObserverObject(function (mutations, observer) {
        var flag = 0;
        console.log('retrieved mutations');
        mutations.forEach(function(mutation){
            for(var i=0;i<mutation.addedNodes.length;i++)
                console.log('muation'+mutation.target) ;
        });
        /*
        for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].addedNodes.length > 0 && mutations[i].target.firstChild.className === 'adp-marker') {
                console.log("detected marker");
            }
        }*/
        if (flag === 1) {
            }
        });
    selectedRoute.observer = MutationObserver1;
    targetNodes = document.querySelector('.adb-marker');
    //MutationObserver1.observe(targetNodes, observeOptions);
    MutationObserver1.observe(document,observeOptions);
}
function autoClearFields(screen) {
    if (screen === "#changePassword") {
        $("#change-new-password").val("");
        $("#change-new-password2").val("");
    }
    if (screen === "#registerPage") {
        $("#register-userid").val("");
        $("#register-email").val("");
        $("#register-password").val("");
        $("#register-password2").val("");
    }
    if (screen === "#forgotUserId") {
        $("#forgot-password-userid").val("");
    }
    if (screen === "#loginPage") {
        $("#login-userid").val("");
        $("#login-password").val("");
    }
    if (screen === "#types-div") {
        clearCheckedTypes();
    }
}
function checkClearScreens(screen) {
    var screenList = ["#changePassword", "#registerPage", "#forgotUserId", "#forgotPasswordPage", "#loginPage", "#types-div"];
    if (_.find(screenList, function (object) {
        return object === screen;
    })) {
        autoClearFields(screen);
    }
}
/****
 *  () will open mainPanel if deviceInfo.narrow is not set or nothing otherwise
 *
 * @returns {undefined}
 */
function closeWindowsReset() {
    //if (displayInfo.narrow === true && displayInfo.currentDisplayDiv !== "#route-ui") {
    //    closeWindows();
    //} else
/*    if(!more_screen)
        return closeWindows("#mainPanel");
    else{ */
        initializeMiniPanel();
	if(displayInfo.windowedMode===true){
		return closeWindows();
	}else{
        	return closeWindows("#mainPanel");
	}
//    }
}
function _handleOpenFunction(window, deferred){
	displayInfo.currentDisplayDiv = window;
	if (window === "#mainPanel") {
            console.log('open main panel');
            displayInfo.panelOpen = true;
	}
	if (window === venueUi) {
            if(displayInfo.narrow===false)
        	$(venueUi).css("width",displayInfo.panelWidth);
            else{
       		$(venueUi).css("width",displayInfo.deviceWidth+"px");
            }
            venueUiSizeFix();
            checkMapClickOut();
	}
    if (window === "#route-ui"){
        var copyrightHeight=25;
        var headerHeight=$("#route-ui-header").css('height').replace(/\D/g,'');
        var height=displayInfo.deviceHeight-copyrightHeight-parseInt(headerHeight);
        $("#route-text").css("height",height+"px");

    }
	if (window === '#listInvites') {
		retrieveList();
	}
        if (window === '#listFavorites') {
            favorite_instance.displayFavorites();
        }
	if (window === venueDetailsUi) {
		_transitionToDetail();
	}
	console.log('open:' + window);
	handleMapSize();
	displayInfo.windowProcessing = false;
        deferred.resolve();
        displayInfo.windowOpening = false;
}
/*******************************
 *
 * @param {type} window - this is the window to open (or keepopen) once the windows are closed
 * @returns {undefined}
 */
function closeWindows(window) {
    resetTravelModeButton(true);
	if(window && !$(window).length){
	console.log('window doe snot exist'+window);
		return;
	}
    if (window !== "" && window !=="#mainPanel" && displayInfo.popupMenuVisible === true)
        hmenu_instance.popupMenuHide();
    displayInfo.windowProcessing = true;
    var retval = $.Deferred();
    if(window!=='' && window!==null){
        displayInfo.windowOpening = true;
    }
    console.log('window:' + window + 'previous:' + displayInfo.currentDisplayDiv);

    //windowedMode?
    $('#control-div').css('left', '0');
    if (window !== '#route-ui') {
        if (displayInfo.currentDisplayDiv === '#route-ui') {
            if(selectedRoute.observer){
                console.log("attempt disconnect");
                try {
                    selectedRoute.observer.disconnect();
                }catch(error){
                    console.log('error:'+error.message);
                }
            }
            checkMapClickOut();
            displayInfo.routeHandler=false;
        }
        $('#route-ui').hide();
    } else {//setup a listener for the change of .adp-listsel
        if(displayInfo.routeHandler!==true){
            handleRouteUiSelection();
            displayInfo.routeHandler=true;
        }
    }
    if (window !== '#types-div2') {
        $('#queryString').val(null);
        $('#types-div').hide();
    } else {
        window = '#types-div';
        $('#query-types-div').show();
    }
    //close previous window if not the same
    if (window !== displayInfo.currentDisplayDiv) {
        //case where nothing to close
        if (displayInfo.currentDisplayDiv === '' || displayInfo.currentDisplayDiv === undefined) {
            if (window) {
		displayInfo.currentDisplayDiv=window;
                //do this before the screen is shown
                if (window === venueUi) {
                    venueCardSetup();
                }
                console.log('opening ' + window);
                checkClearScreens(window);
                $(window).slideDown(function () {
		    _handleOpenFunction(window,retval);
                });
            }
        }else {
        //return the map to the original div, as #venue-ui is closing
        if (displayInfo.currentDisplayDiv === venueUi && window !== venueUi) {
            $(displayInfo.googleMapParent).append(GoogleMapDiv);
            $('#uberpanel').show();
            displayInfo.movedGoogleMap = true;
            checkMapClickOut();
        }
        console.log('closing ' + displayInfo.currentDisplayDiv);
        if (displayInfo.currentDisplayDiv === '#where' && window !== '#where') {
            clearInterval(whereTimer);
        }
        if (displayInfo.currentDisplayDiv === '#search-options-div') {
            _radiusClosePanel();
            displayInfo.radiusCircle = null;
        }
        $(displayInfo.currentDisplayDiv).hide(function () {
		console.log('closed'+displayInfo.currentDisplayDiv);
            displayInfo.currentDisplayDiv = window;//might not be set though it should for handleMapSize
            if (window) {
                venueCardSetup();
                checkClearScreens(window);
                $(window).slideDown(function () {
		    _handleOpenFunction(window,retval);
                });
            } else {
                displayInfo.windowProcessing = false;

                var retval2=handleMapSize();
                retval2.done(function(){
                    retval.resolve();
                });
            }

        });
        if (displayInfo.currentDisplayDiv === "#mainPanel")
            displayInfo.panelOpen = false;
        if (window === 'inviteCodePage') {
            //this hides or shows the message about email, which is the only possible
            //sharing mechanism on webversion
            if (platform !== 2) {
                $('#shareMsg').hide();
            }
            else {
                $('#shareMsg').show();
            }
        }
	}
    } else {//if it is the same keep it open except for list
        displayInfo.windowProcessing = false;
        retval.resolve();
        if(window===venueDetailsUi)
            _transitionToDetail();

    }
    if (displayInfo.currentDisplayDiv === venueUi && window !== venueUi) {
        displayInfo.movedGoogleMap = false;
    }
    /*************************************
     *
     * with screen history, when closeWindows is called, the current screen is saved...
     * Data for the screen should be saved, but that can be problematic as that
     * may depend on what is being displayed on the map, and what data is in the
     * various fields...
     *
     * Venue data will change and this will affect what screens display, unless the
     * venue data is also saved
     *
     * venue-details-ui which is transitionToDetail might be difficult because it is called with place_id
     * venue-ui needs the venueDetails to be filled
     * route-ui has to be opened with route-data displayRouteText()
     * login screens isn't a problem since they should be blank
     * invite requires details
     *
     * some windows are part of the sidepanel
     */
    //on android it is possible to go back, so the screenHistory will be popped off.

    screenHistory.push(displayInfo.currentDisplayDiv);//note will it get ""
    if (screenHistory.length > screenMax) {//we have to move the items if it's too long
        for (var i = 0; i < screenMax; i++) {
            screenHistory[i] = screenHistory[i + 1];
        }
        screenHistory.pop();
    }
    //displayInfo.windowProcessing = false;
    console.log('history:' + screenHistory.length);
    displayInfo.previousDisplayDiv = displayInfo.currentDisplayDiv;
    displayInfo.currentDisplayDiv = window;
    //displayInfo.windowProcessing = false;
    //handleMapSize();
    /*if (platform === 2) { //map refresh should be occuring in thehandler
     console.log('closeWindows map refresh');
     map.refreshLayout();
     } else */
    google.maps.event.trigger(map, 'resize');
    return retval;
}
/**********
 * Main worker function to destroy routes
 * @returns {undefined}
 *
 */
function _removeRoutes() {
    stopSearchFlag = true;
//    displayInfo.midlocation = null; //stop search... midlocaion will be reset when
    // the locaion is retrieved
    removeRoutes(polylineRoute1);
    removeRoutes(polylineRoute2);
    //why do this only for the web?
    removeRouteDetails(routeDetails1);
    routeDetails1=null;
    removeRouteDetails(routeDetails2);
    routeDetails2=null;
}
/********************
 * _resetDestination() is to clear invite information
 */
function _resetDestination(){
    displayInfo.searchLocation = null;
    displayInfo.eventInformation = null;
    _removeRoutes();
    clearVenues();
    displayInfo.pagination=null;
    $("#moreGoogle").addClass("ui-disabled");
    $("#moreGoogleMain").hide();
    $(startingLocation2.inputfield.name).next().trigger("click");
    resetInputField(startingLocation2);
}
function _resetMapItems() {
    _resetDestination();

    //note that clearing the fields directly do not work,
    // as jquery mobile appears seems to cache the information
    //and will remove only if the clr btn is hit
    $(startingLocation1.inputfield.name).next().trigger("click");
    resetInputField(startingLocation1);

    displayInfo.type=null;

    lastKnownLocation = null;
    //either show yellow marker or marker1 and marker2 otherwise sho
    displayInfo.midlocation = lastKnownLocation;

    midCircle.clearCircle();
    map.getStreetView().setVisible(false);
    //closeWindows();
}
function resetMapItems() {
    closeWindowsReset();
    navigateFlag = false;
    platformMarkers = true;
    _resetMapItems();
    //note that this isn't called with true if aroundMe is called
    //clear the location for startingLocation2 note that the box listeners
    //should set this on
    //panto and zoom to marker1
    map.setZoom(displayInfo.defaultZoom);
    if (lastKnownLocation === null)
        lastKnownLocation = displayInfo.currentLocation;
    $('#startInput2').val("");
    $('#startInput1').val("");
    if(displayInfo.persistentStartingLocation===true) {
        startingLocation1.setPosition(displayInfo.currentLocation,false,true);
        startingLocation1.setVisible(true);
    }

}
function resetInputField(markerObject) {
    markerObject.googlePosition = null;
    markerObject.position = null;
    markerObject.setVisible(false);
    markerObject.marker = null;
    markerObject.inputfield.listener = null;
// change to service
    //setupInputListeners(markerObject.inputfield, markerObject);
    //why do this?
	//var object = googleAutocompleteService(markerObject.inputfield,markerObject);
    var field = $(markerObject.inputfield.name);
    field.val("");
}
function removeRoutes(polylineRoute) {
    if (polylineRoute) {
        console.log('polylineroute');
        for (counter = 0; counter < polylineRoute.length; counter++)
        {
            if (polylineRoute[counter] && polylineRoute[counter].route) {
                if (platform === 2) {
                    polylineRoute[counter].route.polyline.remove();
                    polylineRoute[counter].mask.polyline.remove();
                } else {
                    if (polylineRoute[counter] !== null) {
                        //if (counter > 0) {// note that the first one is drawn by the system, the rest by us
                        polylineRoute[counter].route.setMap(null);
                        //}
                        polylineRoute[counter].route = null;
                        //mask will be null for the 0 element
                        polylineRoute[counter].mask.polyline.setMap(null);
                        polylineRoute[counter].mask = null;
                    }
                }
            } else {
                console.log('skipped:' + counter);
            }
            polylineRoute[counter] = null;
        }
        polylineRoute = null;
    }
}
/* redrawLeg is called when a route is chosen from the list of routes presented
 * and will highlight the chosen route... kludge because this is for the
 * note that to redraw the routes that we may have to call removeRoutes which is destructive
 *
 * @param {type} polylineRoute
 * @param {type} index the route that is chose starts from 0
 * @returns {undefined}
 */
function redrawLeg(polylineRoute, index, color, type) {
    //type is A or B
    //zindex is defined below
    //drawColor is defined below
    //counter is the loop
    var counter;
    //the regualr expression is to remove extranious characters (* etc)
    //var value = parseInt(index.replace(/\D/g, ''));
    //console.log('redrawing ' + polylineRoute.length + ' new index:' + index);
    for (counter = 0; counter < polylineRoute.length && polylineRoute[counter] !== null; counter++) {
        polylineRoute[counter].route.polyline.remove();
    }
    for (counter = 0; counter < polylineRoute.length && polylineRoute[counter] !== null; counter++) {
        if (counter !== index) {
            drawColor = 'gray';
            zindex = -2;
            polylineRoute[counter].route = altRouteDraw(polylineRoute[counter].route.polyline.getPoints(),
                    drawColor, counter, type, zindex);
        }
    }
    drawColor = color;
    zindex = 1;
    polylineRoute[index].route = altRouteDraw(polylineRoute[index].route.polyline.getPoints(),
            drawColor, index, type, zindex);

}
/****
 *
 * @param {type} request array of parameters
 * @param {type} route
 * @param {type} polylineRoute
 * @param {type} color value 'red' 'blue'
 * @param {char} type 'A' or 'B'
 * @returns {undefined}
 */
function drawLeg(request, route, polylineRoute, color, type) {
    var newRoute;
    var drawColor, zindex;
    resetTravelModeButton(true);
//    $("#route-menu").show();
    newRoute = new google.maps.DirectionsRenderer();
    var routeImage;
    if (type === 'A') {
        if (navigateFlag === 1) {
            routeImage = marker.routei();
        } else {
            routeImage = marker.route1i();
        }
    } else
        routeImage = marker.route2i();
    if (platform !== 2) {
        newRoute.setMap(map); //this should draw the
    } else {
        newRoute.setMap(gmap);
    }
    console.log('newroute' + newRoute + ':' + newRoute.routeIndex+' type:'+type);
    directionsService.route(request, function (response, status) {//the response
        var routeMarkerPlacement = calculateStepDistance(response.routes[0].legs[0].steps, response.routes[0].legs[0].distance.value / 2);

        if (status === google.maps.DirectionsStatus.OK) {
            // google maps will allow only one directinDisplay to work, do I have
            //to make separate DirectionsRenderer object? (directionsDisplaY)?
            if (route && route !== null && platform !== 2) {
                route.setMap(null);
            }
            if (route && route.routeMarker) {
                if (platform === 2)
                    route.routeMarker.marker.setVisible(false);
                else
                    route.routeMarker.marker.setMap(null);
            }
            //this maps a route
            //phonegap does not seem to draw it yet... not hard to do though
            newRoute.setOptions({suppressMarkers: true, polylineOptions: {clickable: false, strokeColor: color, strokeWeight: 6}});
            console.log(type + " alternate Routes:" + response.routes.length);
            newRoute.setDirections(response);
            newRoute.response = response; //lets store response here

            newRoute.index = 0;

            newRoute.routeMarker = new RouteMarkerObject(routeMarkerPlacement, routeImage, type);
            newRoute.routeMarker.marker = null;
            newRoute.routeMarker.setPosition(newRoute.routeMarker/*polylineRoute1*/, routeMarkerPlacement);

            //this can be moved to an independent function
            //only response, polylineRoute, bounds, type,
            //remove the old lines
            console.log(type + ' removing ' + polylineRoute.length);
            //note that this has to remove the old route for both the web and app
            //for the web it will have to go through the current route and setMap(null)
            removeRoutes(polylineRoute);
            if (platform === 2) {
                //turns out if setDiretions is not called, setPanel is useless



                console.log(type + ' adding ' + response.routes.length);
                for (counter = 0; counter < response.routes.length; counter++) {
                    //note we may note have to create an array and draw the polyline
                    //possible that overview_polyline maybe used
                    polylineRoute[counter] = new routeLine();
                    //setMapBoundsForSteps(response.routes[counter].legs[0].steps, bounds, color);
                    if (counter === newRoute.routeIndex) {
                        drawColor = color;
                        zindex = 1;
                    } else {
                        drawColor = 'gray';
                        zindex = -2;
                    }
                    polylineRoute[counter].route = alternateRouteDraw(google.maps.geometry.encoding.decodePath(response.routes[counter].overview_polyline),
                            drawColor, counter, type, zindex);
                    var value = routeMask(google.maps.geometry.encoding.decodePath(response.routes[counter].overview_polyline), '#90EE90', counter, type);
                    polylineRoute[counter].mask = value;
                    //to here
                }
            } else {//platform !=2
//                            iterateThroughRoute(response);
                //note that with platform===2, we can't use google to render the direction, it'll have to be all done by us, though we can the the path to use

                for (counter = 0; counter < response.routes.length; counter++) {
                    if(counter === newRoute.routeIndex){
//                        drawRoute(response,counter,color);
                    }else {
                        drawRoute(response,counter,'gray');
                    }
                    //note we may note have to create an array and draw the polyline
                    //possible that overview_polyline maybe used
/*                    polylineRoute[counter] = new routeLine();
                    polylineRoute[counter].route = alternateRouteDraw(google.maps.geometry.encoding.decodePath(response.routes[counter].overview_polyline), 'gray', counter, type);
*/
                    var value = routeMask(google.maps.geometry.encoding.decodePath(response.routes[counter].overview_polyline), 'gray', counter, type);
                    response.routes[counter].mask = value;
                }
            }
            //this assumds that the position is in google coordinates
            //and shouldn't be necessary
        } else {
            console.log('ERROR:Route request 1' + status);
            alert('Network connection issues' + status);
        }
    });
    console.log('exiting drawleg');
    return newRoute;
}
function drawRoute(response,i,color){
    response.routes[i].display=new google.maps.DirectionsRenderer({
        map: map,
        directions: response,
        routeIndex: i,
        polylineOptions: { strokeColor: color },
        suppressMarkers: true
   });
}
function removeRouteDetails(routeDetails){
    if(routeDetails && routeDetails.response){
        for(var i=0;i<routeDetails.response.routes.length;i++){
            removeRoute(routeDetails.response,i);
        }
        routeDetails.response=null;
        routeDetails.setMap(null);
        if(platform===2)
            routeDetails.routeMarker.marker.setVisible(false);
        else
            routeDetails.routeMarker.marker.setMap(null);
        routeDetails.routeMarker.marker = null;
        routeDetails.routeMarker=null;
        if(platform===1)
            routeDetails1.setMap(null);
        routeDetails=null;
    }
}
function removeRoute(response,i){
    if(response.routes[i].display){
        response.routes[i].mask.polyline.setMap(null);
        response.routes[i].mask=null;
        response.routes[i].display.setMap(null);
        response.routes[i].display=null;

    }
}
/******************************
 * Two issues
 *   First does not always display both routes, only displays one
 *   Second does not take into account the popup window that shows route information or venue infomration
 *      Should check the projection, calculcate pixels and change bounds?
 *
 *      1. May have to put all the points of both routes into bounds.extend
 *      2. add the (horizontal) size of the window to the bounds
 *          a. get projection of the left most
 *          b. find the pixel
 *          c. get size of window
 *          d. add to pixel and convert back to latLng and extend.bounds
 * @param {flag} closeFlag whether to close the windows or not, not necessary if the transit mode is being changed
 * @returns {undefined}
 */
function findSubRoutes(closeFlag) {
    console.log('called findSubRoutes' + displayInfo.midlocation);
    if (displayInfo.midlocation === null || !displayInfo.midlocation)
        return;
    var both = 0, counter;
    //this might have to be changed for use with plugins



    if (platform === 2)
        var bounds = new plugin.google.maps.LatLngBounds();
    else
        var bounds = new google.maps.LatLngBounds();
    //directionsDisplay.setDirections(response);//this handles the drawing?
    //this is changed to draw two directions, allowing them to be different type (bike, transit etc)
    //origin to midpoint
    //destination to midpoint
    //note that if midlcoation is moved then the routes have to be redrawn
    var request1 = {
        origin: startingLocation1.googlePosition,
        destination: displayInfo.midlocation,
        provideRouteAlternatives: true,
        travelMode: displayInfo.travelMode//google.maps.TravelMode[$('#mode ').val()]
    };
    $('#route-text').text('');
    if (!closeFlag)
        closeWindowsReset();
        //closeWindows();
    bounds.extend(startingLocation1.position);
    if (platform === 2) {
        bounds.extend(convert2pluglatLng(displayInfo.midlocation));
    } else {
        bounds.extend(displayInfo.midlocation);
    }
    _removeRoutes();
    routeDetails1 = drawLeg(request1, routeDetails1, polylineRoute1, 'red', 'A');
    //routeIndex is not picked until the request is done
    //adding listener
    if (platform !== 2)
        google.maps.event.addListener(routeDetails1, 'directions_changed', function () {

            console.log('Route A changed');
        });
    console.log('position 1:' + startingLocation1.position);
    var request2 = {
        origin: startingLocation2.googlePosition,
        destination: displayInfo.midlocation,
        provideRouteAlternatives: true,
        travelMode: displayInfo.travelMode//google.maps.TravelMode[$('#modeb ').val()]
    };
    routeDetails2 = drawLeg(request2, routeDetails2, polylineRoute2, 'blue', 'B');
    if (platform !== 2)
        google.maps.event.addListener(routeDetails2, 'directions_changed', function () {
            console.log('Route B changed');
        });
    bounds.extend(startingLocation2.position);
    console.log('position 2:' + startingLocation2.position);
    clearVenues();
    searchForVenues(displayInfo.midlocation);
}
function getDeviceHeight(){
    return displayInfo.deviceHeight;
}
/*************************************
 *
 * @param {directionResult} directionResult is the route from Google maps directionService.route() function
 * @returns {undefined}
 * displays the individual routesteps as provided by google.  Note that currently it will show a marker
 * but it should eventually put it into a window.  There is also a warning that should be displayed
 */
function iterateThroughRoute(directionResult) {
    var myRoute = directionResult.routes[0];
    var description;
    console.log('****Routes:' + directionResult.routes.length);
    for (var routeCount = 0; routeCount < directionResult.routes.length; routeCount++) {
        console.log('Route' + routeCount + '***legs in route:' + directionResult.routes[routeCount].legs.length);
        for (var legCount = 0; legCount < directionResult.routes[routeCount].legs.length; legCount++) {
            description = 'leg:' + legCount;
            description += ' distance:' + directionResult.routes[routeCount].legs[legCount].distance.text;
            description += ' Starting From:' + directionResult.routes[routeCount].legs[legCount].start_address;
            description += ' going to:' + directionResult.routes[routeCount].legs[legCount].end_address;
            description += ' Leg duration:' + directionResult.routes[routeCount].legs[legCount].duration.text;
            description += ' steps in leg:' + directionResult.routes[routeCount].legs[legCount].steps.length;
            console.log(description);
            /*
             console.log('leg:' + legCount);
             console.log('distance:' + directionResult.routes[routeCount].legs[legCount].distance.text);
             console.log('Starting From:' + directionResult.routes[routeCount].legs[legCount].start_address);
             console.log('going to:' + directionResult.routes[routeCount].legs[legCount].end_address);
             console.log('Leg duration:' + directionResult.routes[routeCount].legs[legCount].duration.text);
             console.log('steps in leg:' + directionResult.routes[routeCount].legs[legCount].steps.length);
             */
            for (var i = 0; i < directionResult.routes[routeCount].legs[legCount].steps.length; i++) {

                console.log(' leg:' + legCount + 'step' + i + ' travel mode:' + directionResult.routes[routeCount].legs[legCount].steps[i].travel_mode +
                        ' instructions:' + directionResult.routes[routeCount].legs[legCount].steps[i].instructions +
//                        console.log(' start location:' + directionResult.routes[routeCount].legs[legCount].steps[i].start_location);
//                        console.log(' end location:' + directionResult.routes[routeCount].legs[legCount].steps[i].end_location);
                        ' Step duration:' + directionResult.routes[routeCount].legs[legCount].steps[i].duration.text);
                //myRoute.steps.[i].start_location;
                //this is only valid for transit
                if (directionResult.routes[routeCount].legs[legCount].steps[i].transit) {
                    console.log('  Exit Station:' + directionResult.routes[routeCount].legs[legCount].steps[i].transit.arrival_stop.name);
                    console.log('  Start Station:' + directionResult.routes[routeCount].legs[legCount].steps[i].transit.departure_stop.name);
                    console.log('  headsign' + directionResult.routes[routeCount].legs[legCount].steps[i].transit.headsign);
                    console.log('  name:' + directionResult.routes[routeCount].legs[legCount].steps[i].transit.name);
                    console.log('  agency name:' + directionResult.routes[routeCount].legs[legCount].steps[i].transit.line.agencies[0].name);
                    console.log('  url:' + directionResult.routes[routeCount].legs[legCount].steps[i].transit.line.agencies[0].url);
                    console.log('  phone:' + directionResult.routes[routeCount].legs[legCount].steps[i].transit.line.agencies[0].phone);
                    console.log('  url:' + directionResult.routes[routeCount].legs[legCount].steps[i].transit.line.url);
                    console.log('  icon:' + directionResult.routes[routeCount].legs[legCount].steps[i].transit.line.icon);
                    console.log('  color:' + directionResult.routes[routeCount].legs[legCount].steps[i].transit.line.color);
                    console.log('  vehicle type:' + directionResult.routes[routeCount].legs[legCount].steps[i].transit.line.vehicle.type);
                    console.log('  vehicle icon:' + directionResult.routes[routeCount].legs[legCount].steps[i].transit.line.vehicle.icon);
                    console.log('  shortname:' + directionResult.routes[routeCount].legs[legCount].steps[i].transit.line.short_name);
                }
                if (directionResult.routes[routeCount].legs[legCount].steps[i].steps) {
                    console.log('steps in step:' + directionResult.routes[routeCount].legs[legCount].steps[i].steps.length);
                    for (var j = 0; j < directionResult.routes[routeCount].legs[legCount].steps[i].steps.length; j++) {
                        console.log('**** sub step' + j);

                        description = ' travel mode:' + directionResult.routes[routeCount].legs[legCount].steps[i].steps[j].travel_mode;
                        description += ' distance:' + directionResult.routes[routeCount].legs[legCount].steps[i].steps[j].distance.text;
                        description += ' instructions:' + directionResult.routes[routeCount].legs[legCount].steps[i].steps[j].instructions;
                        description += ' start location:' + directionResult.routes[routeCount].legs[legCount].steps[i].steps[j].start_location;
                        description += ' end location:' + directionResult.routes[routeCount].legs[legCount].steps[i].steps[j].end_location;
                        console.log(description);
                        /*
                         console.log(' travel mode:' + directionResult.routes[routeCount].legs[legCount].steps[i].steps[j].travel_mode);
                         console.log(' distance:' + directionResult.routes[routeCount].legs[legCount].steps[i].steps[j].distance.text);
                         console.log(' instructions:' + directionResult.routes[routeCount].legs[legCount].steps[i].steps[j].instructions);
                         console.log(' start location:' + directionResult.routes[routeCount].legs[legCount].steps[i].steps[j].start_location);
                         console.log(' end location:' + directionResult.routes[routeCount].legs[legCount].steps[i].steps[j].end_location);
                         */

                    }
                }

            }
        }
    }
}
function showRouteStepInstructions(directionResult)
{
    // For each step, place a marker, and add the text to the marker'
    // info window. Also attach the marker to an array so we
    // can keep track of it and remove it when calculating new
    // routes.
    // note to put in choice for other routes somewhere also
    var myRoute = directionResult.routes[0].legs[0];
    for (var i = 0; i < stepMarkerArray.length; ++i)
    {
        stepMarkerArray[i].setMap(null);
    }
    stepMarkerArray = [];
    //myRoute.steps?
    $('#route-text').text('');
    $('#route-text').text('<p>' + directionResult.warnings + '<p>');
    $('#route-text').text('There are ' + directionResult.routes.length + ' routes available.');
    for (var i = 0; i < myRoute.steps.length; i++)
    {
        //lets not show the marker directions
        //phonegap replaced with map.addMarker
        var marker = new google.maps.Marker(
                {
                    position: myRoute.steps[i].start_location,
                    map: map
                });
        attachDirectionInstructionText(marker, myRoute.steps[i].instructions);
        stepMarkerArray[i] = marker;
        /**/
        $('#route-text').append('<p><b>' + (i + 1) + ':</b>' + myRoute.steps[i].travel_mode + myRoute.steps[i].instructions + '</p><p>' + myRoute.steps[i].path + '</p>');
    }
}
/* adds event to marker to display venue title when venue marker is clicked on
 */
function attachDirectionInstructionText(marker, text)
{
    google.maps.event.addListener(marker, 'click', function ()
    {
        // Open an info window when the marker is clicked on,
        // containing the text of the step.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
    });
}
/**
 * This iwll update the feedback with the location in position by calling
 * the geocoder.  Remember that it calls an asynchronous function
 * @param {position} position is latLng object
 * @param {feedback} feedback is the inputfield where the data is
 * @returns {undefined}
 *
 * Phonegap will not affect this but the position must be converted
 */
function updateSearchBox(position, feedback)
{
    console.log('updating searchBox');
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
        'latLng': position
    }, function (results, status)
    {
    	if(platform!==2){
    		map.setCenter(position);
    	}

        if (status === google.maps.GeocoderStatus.OK) {
            console.log('location found' + results[0].formatted_address);
            if (results[0]) {
                if ($(feedback).is("input"))
                    $(feedback).val(results[0].formatted_address);
                else
                    $(feedback).text(results[0].formatted_address);
            } else {
                popupTimed('No results found');
            }
        }
        else {
            switch (status) {
                case google.maps.GeocoderStatus.ZERO_RESULTS:
                    console.log('Geocoder returned 0');
                    break;
                case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
                    console.log('Geocoder returned over query');
                    break;
                case google.maps.GeocoderStatus.REQUEST_DENIED:
                    console.log('Geocoder returned REQUEST denied');
                    break;
                case google.maps.GeocoderStatus.INVALID_REQUEST:
                    console.log('Geocoder failed due to: ' + status);
                    break;
                default:
                    console.log('Geocoder unknown error' + status);
            }
            popupTimed("Cannot determine location, network appears to be down."+status);
        }
    });
}

/****************************
 * this function is called by the different function to setup the current
 * travel mode, which is stored in displayInfo.
 * mode will be of the form DRIVING, BICYCLING, WALKING or TRANSIT
 * It will subsequently update all three
 */
function setCurrentTravelMode(mode){

    //this sets the main-pane., this will return
    var string='input[value="'+mode+'"]';

    displayInfo.travelMode=mode;
    //this setsup the button

    updateDefaultTravelMode(mode);
            if (navigateFlag === 1) {
                calculateRoute();
            } else if (navigateFlag === 2) {
                calculateRoute();
            }

}
/*****************
 * selectTravelMode() is called by the buttons to select
 *
 *
 */
function selectTravelMode(mode){
    setCurrentTravelMode(mode);
    closeWindowsReset();
    $("#mode-menus").hide(200);
    $("#travel-mode-popup-menu").show();
}
function updateDefaultTravelMode(mode){
    switch(mode){
        case 'WALKING':
            $('#travel-mode-popup-menu').css('background-image',"url('"+pop_walkd+"')");
            break;
        case 'BICYCLING':
            $('#travel-mode-popup-menu').css('background-image',"url('"+pop_biked+"')");
            break;
        case 'TRANSIT':
            $('#travel-mode-popup-menu').css('background-image',"url('"+pop_transitd+"')");
            break;
        case 'DRIVING':
            $('#travel-mode-popup-menu').css('background-image',"url('"+pop_drived+"')");
            break;
        default://unknown setup the default

            break;
    }
}

function resetTravelModeButton(boolean){

    if(boolean){
        $("#mode-menus").hide();
        $("#travel-mode-popup-menu").show(200);

    }else{
        $("#travel-mode-popup-menu").hide(200);
        $("#mode-menus").show();
    }
}
//hide the popuptoken and display the menu
function displayTravelPopupMenu(){
    $("#travel-mode-popup-menu").hide();
    $("#mode-menus").show(200,function(){
        if(platform===2)
            map.refreshLayout();
    });

    $("#bike-pop").css('background-image',"url('"+pop_bike+"')");
    $("#walk-pop").css('background-image',"url('"+pop_walk+"')");
    $("#transit-pop").css('background-image',"url('"+pop_transit+"')");
    $("#drive-pop").css('background-image',"url('"+pop_drive+"')");
}

function popupRouteWindow(args) {
    if ((displayInfo.routeType===undefined||displayInfo.routeType==="A")&& routeDetails2) {
        displayRouteText("B");
        displayInfo.routeType='B';
        //code
    }else{
        displayRouteText("A");//if route-ui id open then toggle between A and B
        displayInfo.routeType='A';
    }
    //code
}
/*************************************
 * Lets use google to display the instruction for each step of the route
 * TODO - change the markers (either 1 and Center or Center and 2 to AB and BA
 *
 * @param {string} route either 'A' or 'B'
 * @param {int} index which route did the user click on
 * @returns {undefined}
 */
function displayRouteText(route, selectedIndex) {
    $("#route-text").text(''); //lets clear the panel
    displayInfo.routeType=route;
    displayInfo.routeIndex=selectedIndex;
    if (routeDetails1) {
        if (route === 'A') {
            selectedRoute = routeDetails1;
            selectedRoute.setRouteIndex(selectedIndex);
            selectedRoute.polyline = polylineRoute1;
            routeDetails1.routeIndex=selectedIndex;
            console.log('A chosen route' + routeDetails1.routeIndex);
            routeDetails1.setPanel($('#route-text')[0]);
            //modify the markers
            $(".adp-marker").each(function(index){
                console.log("index"+selectedIndex);
                console.log("src"+$(this).attr("src"));
            });
        } else if (routeDetails2) {
            selectedRoute = routeDetails2;
            selectedRoute.setRouteIndex(selectedIndex);
            selectedRoute.polyline = polylineRoute2;
            routeDetails2.routeIndex=selectedIndex;
            console.log('B chosen route' + routeDetails2.routeIndex);
            //why was this set?
            //displayInfo.currentDisplayDiv = '#route-ui';
            routeDetails2.setPanel($('#route-text')[0]);
        }
        //$('div#route-text > div.adp-list > div > ol > li').click(alert('help'));
        //$('#route-text').click(alert('help'));
        //should probably check to see if the route-ui window is open and not close it
        closeWindows('#route-ui');

        //setTimeout(function(){$('#route-ui').update();},100);
    }
}
function zoomStart()
{
    if (displayInfo.mainPanelType===2) {//small
        miniLocation.type='B';
        initializeMiniPanel();
        //code
    }else{
    if (startingLocation1.googlePosition === null) {
        //get the cente rof the map and put the marker there
        var location, googleLocation;
        if (platform === 2) {//the plugin does not have the function getCenter... lets use the camera
            map.getCameraPosition(function (camera) {
                location = new plugin.google.maps.LatLng(camera.target.lat, camera.target.lng);
                googleLocation = convert2latLng(location);
                startingLocation1.position = location;
                startingLocation1.googlePosition = googleLocation;
                updateSearchBox(googleLocation, "#startInput1");
                startingLocation1.setVisible(true);
                startingLocation1.setPosition(location); //currentLocation);
            });
        } else {
            googleLocation = location = map.getCenter();
            startingLocation1.position = location;
            startingLocation1.googlePosition = googleLocation;
            updateSearchBox(googleLocation, "#startInput1");
            startingLocation1.setVisible(true);
            startingLocation1.setPosition(location); //currentLocation);
        }
    } else
        zoomMarker(startingLocation1.googlePosition);
    }
}
function zoomDest()
{
    if (displayInfo.mainPanelType===2) {//small
        miniLocation.type='A';
        initializeMiniPanel();

        //code
    }else
        zoomMarker(startingLocation2.googlePosition);
}
//phonegap not sure if phonegap will affect this, do they support bounds
function openZoom(id) {
    //if a card is clicked, it will keep the highlight, it has to be removed
    //if the openzoom is moving around
    console.log('click on ' + id);
    var transition_flag=false;
    if($('#' +id ).hasClass('detailHighlight')){
        transitionToDetail(id);
    }
    $('.detailHighlight').each(function (index, object) {
        console.log('openzoom remove highlight');
        $(this).removeClass('detailHighlight');
    });
    $('#' + id).addClass('detailHighlight');
    console.log('called openMarker');
    //note that with clusterMarks() it's possible that the marker was removed
    //because it was off screen.  If so it has to be added back in
    //there are two situations here... either the marker is not onscreen
    //    where marker=null and markerGlag=false;
    // or the marker is null but markerFlag=true; where it hits the count
    //the first case is tougher because we have to zoom there and then try to make
    //    sure the marker is displayed...
    //the second case is easier because we just scroll the cluster to it

    var venue=searchVenueDetailsList(id);
    if(venue.marker===null){
        /*
        if(venue.markerFlag===true || venue.markerFlag===2){//indisplay regioun
            scrollClusterTo(id);

                //zoomMarker(venue.geometry.location);
                setTimeout(function(){
                openMarkerInfoWindow(id);
                },500);
        }else{*/
        function _subFunction(placeObject){
            placeObject.markerFlag=true;
            var retval=new VenueObject(placeObject);
            retval.done(function(marker){
                placeObject.marker=marker;
                //zoomMarker will cause issues because it will cause the screen
                //to recalculate the bounds and display the data...
                zoomMarker(venue.geometry.location);
                displayInfo.openZoomId=id;
                openMarkerInfoWindow(id);
            });
        }
        _subFunction(venue);
//        }
    }else{
        zoomMarker(venue.geometry.location);
                displayInfo.openZoomId=id;
        openMarkerInfoWindow(id);
    }
}
function closeZoom(id) {
    var flag = false;
    var current = searchVenueDetailsList(id);
    console.log('id:' + current.name);
    if (current.vendorData)
        flag = true;
    current.highlightMarker(flag);
}
function zoomMarkerAt(location, zoom) {
    if (location !== null) {
        if (platform !== 2) {//web
            map.panTo(location);
            map.setZoom(zoom);
        } else {
//            map.getCameraPosition(function (camera) {
            var value=convert2pluglatLng(location);
                map.animateCamera({
                    'duration': 500,
                    'zoom': zoom,
                    'target': value});

//            });
        }
    }
}
function zoomPlugMarker(location){
            map.getCameraPosition(function (camera) {
                map.animateCamera({
                    'zoom': camera.zoom,
                    'duration': 500,
                    'target': location});
            });

}
function zoomMarker(location) {
    if (location !== null) {
        if (platform !== 2) {//web
            map.panTo(location);
        } else {
            var value=convert2pluglatLng(location);
            map.getCameraPosition(function (camera) {
                map.animateCamera({
                    'zoom': camera.zoom,
                    'duration': 500,
                    'target': value});

            });
        }
    }
}

/***********************
 * call this to setup callbacks when the map is zoomed or moved around
 *
 * @returns {undefined}
 */
function mapChangeTracking() {
    if (platform === 2) {
        map.on(plugin.google.maps.event.CAMERA_CHANGE, _updateSearchBounds);

    } else {
        google.maps.event.addListener(map, 'idle', updateSearchBounds);
        //google.maps.event.addListener(map, 'bounds_changed', updateSearchBounds);
    }
}
function mapStyleOptions(local,artery){
    console.log('local:'+local+' atery:'+artery);
    var lvar,avar;
    var retval = [];
    for(var i=0;i<styles.length;i++){
        retval.push(styles[i]);
    }
    if(local===false){
        lvar={ "featureType": "road.local",
            "stylers": [ {"visibility": "off" }] };

    }else{
        lvar={ "featureType": "road.local",
            "stylers": [ {"visibility": "on" }] };

    }
    retval.push(lvar);
    if(artery===false){
        avar={ "featureType": "road.arterial",
            "stylers": [ {"visibility": "off" }] };

    }else{
        avar={ "featureType": "road.arterial",
            "stylers": [ {"visibility": "on" }] };

    }
    retval.push(avar);
    return retval;
}
function compareLatLng(ne,sw,location){
    var lat=location.lat(),lng=location.lng();
    //note that above 180 or below -180 there can be problems with comparing
    //lat lng
    if(ne.lat()<=lat && sw.lat()>=lat && ne.lng()<=lng && sw.lng()>=lng)
        return true;
    else
        return false;
}
/**********************************
 *  given the ne and sw corners of a block, display the markers inside it
 * give the array object.  Objectt must contain marker and markerFlag.
 *
 * Marker will be added and removed to improve performance.  The marker information
 * cannot be resused so it should be set to null.
 *
 * Note that resizing markers is different, since setIcon can be used, the function drawMarkerIcon can be used?
 * There was a delay in the android version which resulted in issues
 */
function updateVenueMarkerVisibilityFlag(ne,sw, markerObjectArray){
    clusterStartingPosition=0;
    //
    //We will hvae to take into account how many venues there are that is being displayed,
    //if teh count is more than a number say 100, then stop
    //if(venueDetails.length>60) only need this if a lot of reslts, remove for testing
    // we will display a max of 40 or 50 venues, and allow an starting offset to
    //page between them.  For restaurant week it's 331 or so, at 50 that would be 7 pages
    //
    var max, counter=0;
    pagingStart=0;
    for(var i=0;i<markerObjectArray.length;i++){
        //recalculate i to be pagingStart+i
        //note that just because the counter ran out doesn't mean that they should be displayed...
        //we should break up the calculation/display into calculation followed by display

        if(compareLatLng(ne,sw,markerObjectArray[i].geometry.location)){
            counter++;
            if(markerObjectArray[i].markerFlag!==true && markerObjectArray[i].markerFlag!==2)
                markerObjectArray[i].markerFlag=true;
        }else{
            markerObjectArray[i].markerFlag=false;
        }
    }
    console.log("number of markers visible"+counter);
    if(displayInfo.openZoomId!==null){
        console.log('preset zoom to');
        scrollClusterTo(displayInfo.openZoomId);
        openMarkerInfoWindow(displayInfo.openZoomId);
        displayInfo.openZoomId=null;
    }else {
        console.log('standard marker visibility');
    setMarkerVisibility(markerObjectArray);
    //this has to be integegrated with googleMore
    if(counter>20 || displayInfo.pagination){//then it's not the normal google quaery
        showClusterNavigation();
    }else{
        hideClusterNavigation();
    }
    }
}
function isMarkerVisible(placeId){
    for(var i=0;i<venueDetails.length;i++){
        if(venueDetails[i].place_id===placeId){
            if(venueDetails[i].markerFlag===false)
                return false;
            else
                return true;//note that it can be 2 or
        }
    }
    return false;
}
//page through cluster until marker is visible
function scrollClusterTo(placeId){
    clusterStartingPosition=0;
    var scrollCount=0,counter;
    for(var i=0;i<venueDetails.length;i++){
        if(venueDetails[i].place_id===placeId){
            scrollCount=Math.floor(i/displayInfo.clusterCounter);
            counter=i;
        }
    }
    console.log('cluster to scroll to '+scrollCount);
    clusterStartingPosition=scrollCount*displayInfo.clusterCounter;
    setMarkerVisibility(venueDetails);
}
function showClusterNavigation(){
    displayInfo.clusterCounter=25;
    $('#mainReset').hide();
        $("#clusterNavigation").show();
        $("#prevClusterButton").show();
        $("#nextClusterButton").show();

}
function hideClusterNavigation(){
    $('#mainReset').show();
        $("#prevClusterButton").hide();
        $("#nextClusterButton").hide();
        $("#clusterNavigation").hide();
}
function nextCluster(){
    clusterStartingPosition+=displayInfo.clusterIncrement;
    //make sure it's no greater than venueDetails[i].length nor counter?
    if(clusterStartingPosition>clusterCount(venueDetails)){
        if(displayInfo.pagination)
            displayInfo.pagination.nextPage();
        else
            clusterStartingPosition-=displayInfo.clusterIncrement;
    }
    setMarkerVisibility(venueDetails);
}
function prevCluster(){
    clusterStartingPosition-=displayInfo.clusterIncrement;
    if(clusterStartingPosition<0)
        clusterStartingPosition=0;
    setMarkerVisibility(venueDetails);
}
function clusterCount(markerObjectArray){
    var counter=0;
    for(var i=0;i<markerObjectArray.length;i++){
        if(markerObjectArray[i].markerFlag===true)
            counter++;
    }
    return counter;
}
/***************************
 * the markerObjectArray (to be venueDetails) will have the flag on each entry .markerFlag=true
 * to display the marker.
 */

function setMarkerVisibility(markerObjectArray){
    var counter2=0,counter3=0;
    var end =(parseInt(clusterStartingPosition)+displayInfo.clusterIncrement);
    var max=clusterCount(venueDetails);
    var to=displayInfo.clusterIncrement;
    if(end>max) {to=end-clusterStartingPosition;end=max;}
    var string=clusterStartingPosition+' to '+end+'/'+ max;
    console.log('to'+to);
    var string2=venueDetails.length+" total venues";
    $("#clusterText").text(string);
    $("#clusterTotal").text(string2);
    //the following can be used to display a limited set of venues, by 25
    //next and previous 25 button to allow paging.
    for(var i=0;i<markerObjectArray.length;i++){
        if(markerObjectArray[i].markerFlag===true || markerObjectArray[i].markerFlag===2){
            counter2++;
            if(counter2>=clusterStartingPosition && counter2<=end)
            {
                counter3++;
                //note that becasue .marker.icon was set to the string (it is set to this value in web version) marker was
                //not properly being detected as null... set object.icon rather than object.marker.icon
                if(markerObjectArray[i].marker=== undefined || markerObjectArray[i].marker===null){
                    if(markerObjectArray[i].markerFlag!==2){
                        console.log('adding non-existant marker:'+markerObjectArray[i].name+':'+markerObjectArray[i].markerFlag);
                        markerObjectArray[i].markerFlag=2;
                        function _subFunction(placeObject){
                            var retval=new VenueObject(placeObject);
                            retval.done(function(marker){
                                placeObject.marker=marker;
                                placeObject.markerFlag=true;
                            });
                        }
                        _subFunction(markerObjectArray[i]);
                    }
                }else{
                    //check to see if the marker should be redrawn
                    //the marker is redraw if it's not the same is the old
                    //note that there can be aproblem if the marker is to be redrawn but has not been allocated yet (markerFlag===2)
                    function subfunction(object){
                    var retval=getIconAddress(object);
                    retval.done(function(newString){
                    if(newString!==object.icon){
                        console.log('marker exists updating icon');
                        object.icon=newString;
                       object.marker.setIcon(newString);
                    }else {
                    }
                    });
                    }
                    subfunction(markerObjectArray[i]);
                }
            }else{
                if(markerObjectArray[i].marker!==null){
                markerObjectArray[i].removeMarker();
                    markerObjectArray[i].marker=null;
                }
            }
        }else{
            if(markerObjectArray[i].marker!==null){
                markerObjectArray[i].removeMarker();
                    markerObjectArray[i].marker=null;
            }
        }

    }
    console.log("number of markers set visible"+counter3);
        //compare
        //if(compareLatLng(ne,sw,venueData[i].place.geometry.location))
            //kee marker in if it's there
        //else
        // set marker=null else
}
/**********************************
 * on android/iOS, this will be called anytime the camera is moved
 * which is many times... should only do it after it stops for a while
 */
var searchBoundsTimer;

function _updateSearchBounds(){

    clearTimeout(searchBoundsTimer);
    searchBoundsTimer = setTimeout(function(){
            console.log("platform2 search idle test");
            updateSearchBounds();
    },500);//half a second or 1 second?

}
/***********************
 * Function to limit the search bounds on autocomplete ansd searchBox to the currently
 * displayed part of the map.  This should happen whenever the map is zoomed or moved
 * @returns {undefined}
 */
function updateSearchBounds() {
    var ns, ew;
    var neLimit,swlimit;
    console.log('updateSearchBounds entered');
    if (platform === 2) {
        //note that the map should be the plugin map which does not have a getbounds
        map.getCameraPosition(function (camera) {
            console.log('camera zoom' + camera.zoom);
            if (camera.zoom !== displayInfo.zoom) {
                displayInfo.zoom = camera.zoom;
                processVenueMarkers();
                if (displayInfo.popupMenuVisible === true)
                    console.log('handle menu');
                hmenu_instance.popupMenuMove(displayInfo.popupMenuStorage, null);
                displayInfo.mapCenter=new google.maps.LatLng(camera.target.lat,camera.target.lng)
            }
        });
        map.getVisibleRegion(function (latLngBounds) {
            //convert to google points
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(convert2latLng(latLngBounds.northeast));
            bounds.extend(convert2latLng(latLngBounds.southwest));
            //searchBox3.listener.setBounds(bounds);
            //searchBox4.listener.setBounds(bounds);
        if(!bounds){
            console.log("no bounds, return");
            return;
        }
        var NE = bounds.getNorthEast();
        var SW = bounds.getSouthWest();

        var SE = new google.maps.LatLng(SW.lat(), NE.lng());

        ns=distanceLatLng(NE,SE);
        var NE = bounds.getNorthEast();
        var SW = bounds.getSouthWest();

        var NW = new google.maps.LatLng(NE.lat(), SW.lng());
        swLimit=new google.maps.LatLng(SW.lat(),SW.lng());
        neLimit=new google.maps.LatLng(NE.lat(),NE.lng());
        ew=distanceLatLng(NE,NW);
        displayInfo.distanceEW=ew;
        displayInfo.distanceNS=ns;
        updateVenueMarkerVisibilityFlag(swLimit,neLimit,venueDetails);
        //console.log('map distance ns: '+displayInfo.distanceNS+' ew:'+displayInfo.distanceEW);

        });

    } else {
        var bounds = map.getBounds();
        var zoom=map.getZoom();
        if(displayInfo.zoom!==zoom){
            console.log('zoom: '+zoom);
            displayInfo.zoom=zoom;
            processVenueMarkers();
        }
        var options;
        if(zoom>12){
            if(zoom>13){
                options=mapStyleOptions(true,true);
            //display road.local
            }else
            options=mapStyleOptions(false,true);
            //turn off road.artery
        }
        if(zoom<=12){
            options=mapStyleOptions(false,false);
            //turn off road.local
        }
        if(options){
           var style= { 'styles': options };
            map.setOptions(style);
        }
        //searchBox4.listener.setBounds(bounds);//this was changed to sercie, so no standard listener
        if(map.get)
        displayInfo.mapCenter=map.getCenter();
        if(!bounds)
            return;
        var NE = bounds.getNorthEast();
        var SW = bounds.getSouthWest();

        var SE = new google.maps.LatLng(SW.lat(), NE.lng());
        ns=distanceLatLng(NE,SE);
        var NE = bounds.getNorthEast();
        var SW = bounds.getSouthWest();

        var NW = new google.maps.LatLng(NE.lat(), SW.lng());
        ew=distanceLatLng(NE,NW);
 //       if(ew===displayInfo.distanceEW&&displayInfo.distanceNS===ns)
//            return;
        displayInfo.distanceEW=ew;
        displayInfo.distanceNS=ns;
        swLimit=new google.maps.LatLng(SW.lat(),SW.lng());
        neLimit=new google.maps.LatLng(NE.lat(),NE.lng());
        updateVenueMarkerVisibilityFlag(swLimit,neLimit,venueDetails);
        //console.log('map distance ns: '+displayInfo.distanceNS+' ew:'+displayInfo.distanceEW);
    }

	if(displayInfo.radiusCircle){
            console.log('fittin circle');
		fitCircleInScreen();
	}
}
Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}
distanceLatLng = function(origin, destination) {
  var R = 6371; // Radius of the earth in km
  var dLat = (origin.lat()-destination.lat()).toRad();  // Javascript functions in radians
  var dLon = (origin.lng()-destination.lng()).toRad();
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(origin.lat().toRad()) * Math.cos(destination.lat().toRad()) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

/******************************
* the current action that this will do is to toggle between the two
* location markers.  Note that on the main panel that it will zoom to the particular points...
* should that be adopted?
*/
function miniAction(){
	if(miniLocation.type==='A'){
		miniLocation.type="B";
	}else{
		miniLocation.type="A";
	}
	initializeMiniPanel();
}

/******
* googleAutocompleteService() is to replace Autocomplete that is used setupInputListeners(),
* primarily for a bug on Android where the pac-container will appear and items can't be
* selected that are over the map.
*
* Note that this paves the way for allowing custom items to show up such as bookmarks and
* custom locations to appear.
*
* routine needs
* displayInfo.inputObject???
* displayInfo.touristMode (tot urn it off)
* map
* GoogleMapDiv (to append the pac-container)
* clearVenues()
* displayInfo.searchLocation/displayInfo.mapCenter
* getCheckedTypes
* getVenueDetailsFromGoogle (for textSearch
* convert2plugLatLng
* getMarkerUrl(displays marker type)
* startingLocation1
* startingLocation2
*/
var googleAutocompleteService = function (inputfield, markerObject){
    this.inputfield=inputfield;
    var object=this;
    this.object=this;
    this.markerObject=markerObject;
    this.results;
    this.field=document.getElementById("startInput1");
    this.drawerStatus=false;//closed... true is open
    this.itemSelection=0;//item that the highlight or the arrow is on
    var item_pre_header = '<div id="item_pre_';
    var item_pre='" class="pac-item">'+
                    '<span class="pac-icon pac-icon-marker"></span>'+
                    '<span class="pac-item-query';
    var item_preselect_header = '<div id="item_pre_';
    var item_pre_selected='" class="pac-item pac-item-selected">'+
                    '<span class="pac-icon pac-icon-marker"></span>'+
                    '<span class="pac-item-query';
    var item_post='</span></div>';
    //
//needs an onchange or inkeyup then search
    var service = new google.maps.places.AutocompleteService();
    var predictions;//this has to come from google...
    //
    //events to consider onblur (when focus leaves)
    // onfocus (cause dropdown?)
    // oncopy, onpaste, oncut?
    function _initialize(object){
        console.log('name:'+object.inputfield.name);
        $(object.inputfield.name)[0].addEventListener("keyup",function(event){
            //if key=tab or esc down or up, move the selection up 40 down 38
            console.log("event:"+event+ event.keyCode);//have to handle arrow down, up tab or return/enter
            //the keys have the potential to highlight and then select an item in the pacconainer
            displayInfo.inputObject=object;
            switch(event.keyCode){
                case 13:
                    console.log("enter");
                    object.selectResults(undefined,predictions);
                    //select the item that is this.itemSelection (from 1=5)
                    break;
                case 38://note in the official one it will look through when it is 0 it will be the original typed item
                    console.log("key up");
                    object.itemSelection--;
                    if(object.itemSelection<0)object.itemSelection=5;
                    redrawResults();
                    break;
                case 40:
                    console.log("key down");
                    object.itemSelection++;
                    if(object.itemSelection>5)object.itemSelection=0;
                    redrawResults();
                    break;
                case 27:
                    console.log("esc");
                    break;
                default:
                    save_text=$(object.inputfield.name).val();
                    //this will get the item
                    var searchString=$(object.inputfield.name).val();
                    //note that there are bounds and componentRestritioncs
                    object.itemSelection=0;
                    //if markerObject=null or markerObject===undefined then use getQueryPredictions()
                    console.log("center is"+displayInfo.mapCenter);
                    console.log('input is['+searchString+']');
                    var request = {
                        input: searchString,
                        location: displayInfo.mapCenter,
                        radius: 50000
                    };
                    if(this.markerObject===null || this.markerObject===undefined)
                        service.getQueryPredictions(request, parseSuggestions);
                    else
                        service.getPlacePredictions(request, parseSuggestions);
            }
        });
        $(object.inputfield.name)[0].addEventListener("blur",function(event){
            console.log("event:blur"+event);
            //$('#pac_holder').html("");
            $('#pac-container').empty().detach();
        });
        $(object.inputfield.name)[0].addEventListener("focusout",function(event){
            console.log("event: focusout"+event);
            //$('#pac_holder').html("");
            //$('#pac-container').empty().detach();
        });
        $(object.inputfield.name)[0].addEventListener("focusin", function(event){
            console.log("event: focusin"+event,false);
            displayInfo.inputObject=object;
        });

    }
    _initialize(this);
    function parseSuggestions(predict, status) {
        predictions=predict;//save the results as this is going to be used later
        this.results=[];
        var string="";
        var i=0;
        var save_text;
        var item;
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
            return;
        }
        predictions.forEach(function(prediction) {
            //this will take the data and append it to a dropdown that will appear below the
            //inp©utfield<
            item=item_pre_header+i+item_pre+i+'">'+prediction.description+item_post;
            string+=item;
            this.results.push(prediction);
            i++;
        });
        console.log("dropdown["+string+"]");
        displayResults(string,predictions);
    };
    function redrawResults(){
        var position=getInputBoxDimensions();
        var string="";
        var container='<div id="pac-container" class="pac-container" style="top:'+ position.top+'px; left:'+ position.left+'px; width:'+
                position.width+'px; display: block;" role="listbox" >';
        for(var i=0;i<this.results.length;i++){
            if(i===object.itemSelection-1){

                $(object.inputfield.name).val(this.results[i].description);//
                string+=item_preselect_header+i+item_pre_selected+i+'">'+this.results[i].description+item_post;
            }else
                string+=item_pre_header+i+item_pre+i+')">'+this.results[i].description+item_post;
        }
            if(object.itemSelection===0)
                $(object.inputfield.name).val(save_text);

        //$("#pac_holder").empty().html(container+string+"</div>");
	$("#pac-container").empty().detach();
        if(platform===2)
            GoogleMapDiv.append(container+string+"</div>");
        else
            $(displayInfo.googlePackParent).append(container+string+"</div>");
        for(i=0;i<predictions.length;i++){

            function _wrapper(b) {
               $('#item_pre_'+b).mousedown(function() {
                    console.log('mousedown detected'+b);
                    autocompletePick(b,predictions);
                });
            }
            _wrapper(i);
        }
        if(platform===2)
            map.refreshLayout();
    }


    function displayResults (results,predictions) {
        //note that sometimes it might be getting the wrong input box
        var position=getInputBoxDimensions(displayInfo.googlePackParent);
        var container='<div id="pac-container" class="pac-container" style="top:'+ position.top+'px; left:'+ position.left+'px; width:'+
                parseInt(position.width)+'px; display: block;" role="listbox" >'+
                results+
            '</div>';
        console.log(container);
	$("#pac-container").empty().detach();
        if(platform===2)
            GoogleMapDiv.append(container);
        else
            $(displayInfo.googlePackParent).append(container);
        for(i=0;i<predictions.length;i++){
            function _wrapper(b) {
                $('#item_pre_' + b).mousedown(function () {
                    console.log('mousedown detected' + b);
                    autocompletePick(b, predictions);
                });
            }
            _wrapper(i);
        }
        if(platform===2)
            map.refreshLayout();
        //get the dimensions
        //
        //if not open display it else replace previoius
    };
    function getInputBoxDimensions() {
                    var domEl = $(object.inputfield.name)[0],
                        rect = domEl.getBoundingClientRect(),
                        docEl = document.documentElement,
                        body = document.body,
                        scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop,
                        scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

                    return {
                        width: rect.width,
                        height: rect.height,
                        top: rect.top + rect.height + scrollTop,
                        left: rect.left + scrollLeft
                    };
    }
};
/**************
 * note that with using getQueryPredictions, this can return an array
 */
googleAutocompleteService.prototype.selectResults = function (item,results){
        console.log("manually select results");
        if(item===undefined){
            this.result=results[this.itemSelection-1];
        }else{
            this.result=results[item];
        }
        //should put a checkt for this.result.description... if it is null then search can't happen'
        $(this.object.inputfield.name).val(this.result.description);
	$("#pac-container").empty().detach();
        //now setup the markerObject, note that because this is the service, it will have to
        //get the information from the somewhere because things such as the geoemtry does not exist;
        //
        //this part is derived from setupInputlistener which might be removable
        //note that if the markerObject===null, then use getPlaces() for searchBox.
        var service;
        displayInfo.touristMode=false;
        if(this.object.markerObject===null || this.result.place_id===undefined){
            if(this.result.place_id===undefined){
                _removeRoutes();
                clearVenues();
                service = new google.maps.places.PlacesService(map);//use gmap if platform===2
                var radius =$('#radius').val();

                var string = getCheckedTypes();
                displayInfo.searchLocation=displayInfo.mapCenter;//this is from updateSearchBounds
                request = {
                    query: this.result.description,
                    location: displayInfo.searchLocation,//this should be the map center...
                    radius: radius,
                // this should come from a box
                //valid types are bar, restaurant, store,
                //note that keyword,opennow,zagatselected
                //zagatselected is not suppose to have any value
                    zagatselected: '',
                    types: string//['food'] //what other types are there?'food','restaurant'

                };
                service.textSearch(request, getVenueDetailsFromGoogle);
                return;
            }else{//ok it's a locatoin but markerObject is null... use destination2
//                this.object.markerObject=startingLocation2;
            }
        }
        if (platform === 2)
            service = new google.maps.places.PlacesService(gmap);
        else
            service = new google.maps.places.PlacesService(map);
        var object=this;
        //if not given a marker object, then it should be for the miniLocation
        if(object.inputfield.name==="#miniInput"){
	    console.log("update:"+miniLocation.type);
            if(miniLocation.type==='A' || (miniLocation.type===undefined && startingLocation1!==null)){
                object.markerObject=startingLocation1;
            }else if (miniLocation.type==='B'){
                object.markerObject=startingLocation2;
            }else{
                    object.markerObject=null;
                    return;
             }
        }
        service.getDetails({placeId: this.result.place_id}, function (place, status) {
            if(status=== google.maps.places.PlacesServiceStatus.OK){
                if(checkTypes("establishment",place.types)){
                    object.markerObject.place_id=place.place_id;
                    object.markerObject.place=new placeDetailObject(place);
                    var iconAddress = VenueObject.prototype.getMarkerUrl(object.markerObject.place.types,false);
                    if(iconAddress)
                        object.markerObject.image=iconAddress;
                }else{
                    _resetMarkerObject(object.markerObject);
                }
                var position;
                if (platform === 2) {
                    console.log('lat:' + place.geometry.location.lat() + ' lng:' + place.geometry.location.lng());
                    //note that this will be in
                    position = convert2pluglatLng(place.geometry.location);
                } else{
                    position = place.geometry.location;
                }
                object.markerObject.googlePosition = place.geometry.location;
                object.markerObject.position = position;
                object.markerObject.setPosition(position,true,true);
                //moved setVisible into setPosition so that the
                //callback will center the map
		updateSearchBox(place.geometry.location,object.markerObject.inputfield.name);
        //this shouldn't be needed... setPosition is suppose to calculate the route
                //_moveStartSub(null);
                //calculateRoute();
            }
        });
};
//send a changes event and it item_id? note tha tthe location, lat and lng will not be there
function autocompletePick(item,results){
    console.log("mouse select results");
    displayInfo.inputObject.selectResults(item,results);
    console.log('selected'+item);
    $("#pac-container").empty().detach();
}

var RouteMarkerObject = function (location, image, type) {
    this.location = location;
    this.image = image;
    this.marker = null;
    this.type = type;
    this.index = 0;
    return this;
};
RouteMarkerObject.prototype.setOpacity = function (opacity){
    if(this.marker)
        this.marker.setOpacity(opacity);
};
RouteMarkerObject.prototype.setPosition = function (polyline, location) {
    if (platform === 2)
        location = convert2pluglatLng(location);
    this.location = location;
    value = {
        position: location,
        //possible values DROP, BOUNCE to stop bouncing set to null
        icon: this.image
    };
    if (platform === 2) {
        //this is an asynchronous call to add marker listenersto
        if (polyline.marker === null) {
            //should just call markerObject.setPosition()?
            function _subAddMarker(options, markerObject) {
                map.addMarker(options, function (mark1) {
                    console.log('****************adding marker');
                    polyline.marker = mark1;
                    console.log('value of markers' + polyline.marker);
                    mark1.addEventListener(plugin.google.maps.event.MARKER_CLICK, function (mark1) {
                        displayRouteText(markerObject.type, markerObject.index);
                    });
                    polyline.marker = mark1;
                });
            }
            _subAddMarker(value, this);
        }//if it exists, then move the marker
        else {
            polyline.marker.setPosition(location);
        }
    } else {
        if (polyline.marker === null) {
            polyline.marker = new google.maps.Marker(value); // end setup marker
            polyline.marker.setMap(map); //moved from panelSetup()
            function _weblistener(object) {
                google.maps.event.addListener(polyline.marker, 'click', function (evt) {
                    hmenu_instance.popupMenuHide();
                    displayRouteText(object.type, object.index);
                });
            }
            _weblistener(this);
        }
        else
            polyline.marker.setPosition(location);
    }
};
function waitForLocation(inviteCode) {
    console.log('waiting for location' + displayInfo.retrievedStartingLocation);
    if (displayInfo.retrievedStartingLocation !== 1) {
        var urlhander = setInterval(function () {
            if (displayInfo.retrievedStartingLocation !== 0) {
                console.log('location retrieved, handling inviteCode');
                clearInterval(urlhander);
                //openInviteScreen();
                _handleInviteCode(inviteCode,startingLocation1.googlePosition);
            }
        }, 300);

    } else {
        console.log('location was retrieved, handling url');
        //openInviteScreen();
        _handleInviteCode(inviteCode,startingLocation1.googlePosition);
    }
}
/****************
* handleOpenURL() was made as the single entry point when
* WebIntent was switched to EddieVanBerger on android from
* borismus
* this means that we can get hcode in parameters[0] which is the iOS case
* or in parameter[1] where it's part of https://www.hiamaps.com/invite/?hcode=[inviteCode]
*
*/
//we assume that the url given will be of the` form hinvite://[inviteCode]
//this must wait until the startingtLocation1 is set
function handleOpenURL(url) {
    var parameters = url.toUpperCase().split("//");
	console.log(parameters);
	if(parameters[1].indexOf("HCODE")>=0){
		var temp=parameters[1].split("=");
		inviteCode=temp[1];
	}else{
		inviteCode = parameters[1].toUpperCase();
	}
    console.log('inviteCode=' + inviteCode);
    closeWindows();
    waitForLocation(inviteCode);
}

/***************
 * Big change.  Webintent plugin removed, so code not needed.
 * called on initialization to check to see if browser is called with an invite code
 * checkForInviteCode() is only used for the webversion, the rest of the handling
 * for invite code is in handleOpenURL();
 *
 * @returns {String|inviteCode|JSON@call;parse.inviteCode}
 */
function checkForInviteCode() {
    //format of the invoked string should be ?invite=[code]
    var string = window.location.search.substring(1).toUpperCase();
    var parameters = string.split("&");
    var temp = parameters[0].split('=');

    if (displayInfo.firefoxTimer === true) {
        console.log("invite code processged");
        return null;
    }
    displayInfo.firefoxTimer = true;
    console.log('invite code string' + temp);
    if (platform !== 2 && temp.length > 1) {
        console.log("["+temp[0]+"]");
        if (temp[0] === 'INVITE' || temp[0] === "LOOLCODE" || temp[0] === "HCODE") {
            console.log('found invite');
            inviteCode = temp[1];
        }
        if (temp[1].indexOf('invite.html') >= 0) {
            console.log('found invite.html');
            inviteCode = temp[2];
            console.log('passed:' + inviteCode);
        }
        //note that if this is =map then parse the rest of the string and don't search for the location
        if (inviteCode || displayInfo.searchType) {//note this will clash with the general opening
            waitForLocation(inviteCode);
        } else {
            //closeWindows#mainPanel needed if not invite since it would only
            //have the starting location.
            closeWindows("#mainPanel");
        }
    }
    if (!inviteCode) {
        console.log('no invite code');
        closeWindows("#mainPanel");
        $("#mainPanel").trigger('create');
    }
    return inviteCode;
}
/*
 * ?map=40.7079088,-74.0085145/zoom=14/hcode=lool143231
 */
function handleMapUrl(){
    var string=window.location.search.substring(1).toUpperCase();
    var array=string.split("/");
        if(array[0].indexOf("STATICMAP=")<0 && array[0].indexOf("TYPE=")<0)
            return false;
    for(var i=0;i<array.length;i++){
        if (array[i].indexOf("STATICMAP=")>=0){
            //parse the staring lat and lng = ,
            var j=array[i].split("=");
            if(j[1].indexOf(",")<0 && j[1].indexOf("+")>=0){
                getClusterData(j[1]);//if it returns 1 then center on that else
                //this is a hcode, or dropblock items
            }else{
                var location=j[1].split(",");
                _lat=parseFloat(location[0]);
                _lng=parseFloat(location[1]);
                displayInfo.currentLocation = new google.maps.LatLng(_lat, _lng);//
                }
            displayInfo.staticMode=true;
        }
        if(array[i].indexOf("START=")>=0){
            var j=array[i].split("=");
            if(j[1].indexOf(",")<0 && j[1].indexOf("+")>=0){
                getClusterData(j[1]);//if it returns 1 then center on that else
                //this is a hcode, or dropblock items
            }else{
                var location=j[1].split(",");
                _lat=parseFloat(location[0]);
                _lng=parseFloat(location[1]);
                displayInfo.currentLocation = displayInfo.start = new google.maps.LatLng(_lat, _lng);//
            }

        }
        if (array[i].indexOf("ZOOM")>=0){
            //parst string for zoom
            var j=array[i].split("=");
            displayInfo.defaultZoom = parseInt(j[1]);
            map.setZoom(displayInfo.defaultZoom);
            displayInfo.staticZoom=true;
        }
        if (array[i].indexOf("LOOLCODE")>=0){
            var j=array[i].split("=");
            inviteCode = j[1];
        }
        if (array[i].indexOf("HCODE")>=0){
            var j=array[i].split("=");
            inviteCode = j[1];
        }
        if (array[i].indexOf("TYPE")>=0){
            var j=array[i].split("=");
            //note that this can be several items bar, restaurant, animals
            var types=j[1].toLowerCase().split(",");
            displayInfo.searchType = types;
        }
    }
    return displayInfo.staticMode;
}
function setupMarkerBoxLink() {
    console.log('marker creation/setup');
    var image = marker.markerA();//markera; //'https://maps.google.com/mapfiles/kml/paddle/1.png';
    startingLocation1 = new powaintMarkerObject(null, displayInfo.currentLocation, image, null, searchBox1, 'A');
    var image = marker.markerB(); //'https://maps.google.com/mapfiles/kml/paddle/2.png';
    startingLocation2 = new powaintMarkerObject(null, null/*currentLocation */, image, null, searchBox2, 'B'); //google.maps.Animation.BOUNCE);
    displayInfo.object1=new googleAutocompleteService(searchBox1, startingLocation1);
    console.log('setup 1st listener');
    console.log('setup 2nd listener');
    displayInfo.object2 = new googleAutocompleteService(searchBox2, startingLocation2);
    if(displayInfo.windowedMode!==true){
	    displayInfo.object3 = new googleAutocompleteService(searchBox3, null);
		}
    console.log('setup interval');
    //first how will this determine the input, then it has to determine the staartingLocation and clear it
    $(".ui-input-clear").click(function () {
        if ($(this).prev("input")[0].id === "startInput1") {
            console.log("clear input1");
            _removeRoutes();
            clearVenues();
            navigateFlag = false;
            midCircle.clearCircle();
            resetInputField(startingLocation1);
        }
        if ($(this).prev("input")[0].id === "startInput2") {
            console.log("clear input2");
            _removeRoutes();
            clearVenues();
            navigateFlag = false;
            midCircle.clearCircle();
            resetInputField(startingLocation2);
        }
    });
    if(displayInfo.start!==null){
        startingLocation1.setPosition(displayInfo.start,false,true);
        /*
        if(platform===2)
            startingLocation1.position=convert2latLng(displayInf.start);
        else
            startingLocation1.position=displayInfo.start;
        */
    }
    //setupSearchBoxListener(searchBox4);
/*
    var object4= new googleAutocompleteService(searchBox4,null);
    */
    mapChangeTracking();

    //getCurrentLocalLocation(); //note that the mapmarkers might not be set at this point...

}
function panelSetup() {
    displayInfo.initialization = 3;
    console.log('setting up callbacks');
    //don't forget the initial values which should be transit?
    //if (!startingLocationA)
    {
        //directionsDisplay= new google.maps.DirectionRenderer(rendererOptions);
        //parameters for Marker draggable:
        //map:https://kml4earth.appspot.com/icons.html

        console.log('0 calculating route' + startingLocation1.position + ':' + startingLocation2.position);
        //these won't be set in platform===2, but aren't needed
        //the problem with marker manipulation is that the markers may not be set at this
        //point because the marker creation is an asynchronous call
        doOnOrientationChange();
        checkForCalendar();
    }
}
function checkForCalendar() {
    if (!window.plugins || !window.plugins.calendar) {
        $(".calendar_feature").each(function () {
            $(this).hide();
        });
    }
    /*
     if (window.plugins.calendar){
     displayInfo.calendar = true;
     }else {

     }    */
}
function closeEventDetails() {
//    eventObject = _.find(venueDetails, function (object) {
//        return object.place_id === displayInfo.eventLocationId;
//    });
    eventObject.inviteCode = inviteCode;//where is the code coming from?
    eventObject.name = $('#eventLocation').text();
    eventObject.description = $('#eventDescription').val();
    var dateString = $('#eventDate').val() + " " + $('#eventTime').val() ;
    eventObject.eventTime = new Date(dateString);
    eventObject.endTime = new Date(dateString);
    eventObject.endTime.setHours(eventObject.eventTime.getHours() + 1);
    eventObject.expirationTime = new Date();
    eventObject.expirationTime.setDate(eventObject.eventTime.getDate() + 1);
    eventObject.address = eventObject.formatted_address;
    if (displayInfo.eventLocationId === null)
        eventObject.origin = "BOOKMARK";
    else
        eventObject.origin = "GOOGLE";// currently all place_id is google based
    displayInfo.event = eventObject;
    var retval = createInviteEvent(eventObject);
    retval.done(function (data, status) {

    });
}
/******************
 * sharing gets called by default and will be for the web version
 * only supports email.
 * @returns {undefined}
 */
function sharing() {
    var body;
    var name;
    var description=displayInfo.event.description;
    //remember looltype===1 is a permanent loolcode, so don't create a date
    if (displayInfo.event.looltype!=="0"){
        name='\n\n' +displayInfo.event.name ;
    }else{
        name='\n\n' +displayInfo.event.name + ' on ' + moment(displayInfo.event.eventTime).format("ddd MMM Do YYYY h:mm A");
    }
     if(description===null)
        description="";
    if (platform === 2) {
        appSharing();
    } else {
        body = description +
                name+
//                '\n\n' +displayInfo.event.name + ' on ' + moment(displayInfo.event.eventTime).format("ddd MMM Do YYYY h:mm A") +
                '\n\n\nFor Web or Android' +
                '\nhttps://www.hiamaps.com/invite/?hcode=' + inviteCode +
                '\n\n\nFor iOS'+
                '\nHCODE://' + inviteCode;
        window.location.href = 'mailto:?subject=invite to venue&body=' + encodeURIComponent(body);
    }
}
function copyToClipboard(data){
    copyTextToClipboard(createInviteBody());
}
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}

function createInviteBody(){
    var body,name;
    var description=displayInfo.event.description;
    //remember looltype===1 is a permanent loolcode, so don't create a date
    if (displayInfo.event.looltype!=="0"){
        name='\n\n' +displayInfo.event.name ;
    }else{
        name='\n\n' +displayInfo.event.name + ' on ' + moment(displayInfo.event.eventTime).format("ddd MMM Do YYYY h:mm A");
    }
    if(description===null)
        description="";
    body = description +
           name+
           '\n\n\nFor Web or Android' +
           '\nhttps://www.hiamaps.com/invite/?hcode=' + inviteCode +
           '\n\n\nFor iOS'+
           '\nHCODE://' + inviteCode;
   return body;
}
/******
 * sharingNavigate will navigate the creator of the invite to the venue that they chose.
 * eventObject that was created for saving the invite data is still available so use that
 */
function sharingNavigate(){
/* from createInvite

            lat: venue.geometry.location.lat(), //lat,
            lng: venue.geometry.location.lng(), //lng,
            placeId: venue.place_id, // placeId,
            placeName: venue.name, //placeName,
            placeDescription: venue.description, //placeDescription,
            placeAddress: venue.address, //placeAddress,
            length: length,
            token: displayInfo.token,
            selector: displayInfo.selector,
            userId: "none", //note that on the server side, the id is determined by the token and selector
*/

    var gposition = eventObject.geometry.location;
    _setupStartingLocation2wPlaceObject(eventObject,gposition);
    navigateFlag=1;

    console.log('startingLocation2' + startingLocation2.marker);
    turnByTurn();
}
/***********************
 * saveToCalendar()
 * @returns {undefined}
 */
function saveToCalendar() {
    if (platform === 2) {
        var event = displayInfo.event;
        //closeEventDetails();
        var startDate = new Date(moment(displayInfo.event.eventTime));
        var endDate = new Date(moment(displayInfo.event.endTime));
        window.plugins.calendar.createEvent(
                displayInfo.event.name, //title
                "HCODE://" + displayInfo.event.inviteCode + '\r\nhttps://www.hiamaps.com/invite/?hcode=' + displayInfo.event.inviteCode, // suppose to be the location
                //displayInfo.event.address,//location
                "HCODE://" + displayInfo.event.inviteCode + '\r\nhttps://www.hiamaps.com/invite/?hcode=' + displayInfo.event.inviteCode + '\r\n' + displayInfo.event.description, //notes,
                startDate,
                endDate,
                //new Date(displayInfo.event.eventTime),//start date
                        //new Date(displayInfo.event.endTime),// endDate,
                                function (message) {
                                    popupMessage('Saved to Calendar');
                                }, //success
                                function (message) {
                                    popupMessage('Error:' + message);
                                });//error);
                    }

        }
/*******************
 * appSharing will call the socialsharing plugin which will allow messaging and
 * email.
 *
 * @returns {undefined}
 */
function appSharing() {
    var description=displayInfo.event.description;
    var name;
    if (displayInfo.event.looltype!=="0"){
        name='\r\n' +displayInfo.event.name ;
    }else{
        name='\r\n' +displayInfo.event.name + ' on ' + moment(displayInfo.event.eventTime).format("ddd MMM Do YYYY h:mm A");
    }
    if(description===null)
        description="";
    var message = description +
            name+
//            '\r\n'+ displayInfo.event.name + ' on ' + moment(displayInfo.event.eventTime).format("ddd MMM Do YYYY h:mm A") +
            '\r\n \r\nFor Web or Android' +
            '\r\nhttps://www.hiamaps.com/invite/?hcode=' + inviteCode +
            '\r\n\r\n\ For iOS'+
            '\r\nHCODE://' + inviteCode;
    window.plugins.socialsharing.share(
            message, // can contain HTML tags, but support on Android is rather limited:  https://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
            'Invite',
            null, //['to@person1.com', 'to@person2.com'], // TO: must be null or an array
            null, //['cc@person1.com'], // CC: must be null or an array
            null, // BCC: must be null or an array
            null, //['https://www.google.nl/images/srpr/logo4w.png', 'www/localimage.png'], // FILES: can be null, a string, or an array
            onSuccess, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
            onError // called when sh*t hits the fan
            );
}
function onSuccess() {
    console.log('success sending jinvite');
}
function onError() {
    console.log('error sending invite');
}

function getCurrentLocalLocation()
{
    console.log('Initial location retrieval');
    /*******
     * for firefox, setup timer if the user has selected not now
     * due to the way firefox is designed, this will not return to hiamaps
     * which will cause invite code to not be processed
     * Note that inviteCode processing has to be turned off so it won't run twice
     */
    displayInfo.firefoxTimer = false;
    if (displayInfo.isFirefox === true) {

        var timer = setTimeout(function () {
            if (displayInfo.firefoxTimer === false) {
                var inviteCode = checkForInviteCode();
                displayInfo.firefoxTimer = true;
                if(displayInfo.persistentStartingLocation===true) {
                    startingLocation1.setPosition(displayInfo.currentLocation,false,true);
                    startingLocation1.setVisible(true);
                }
                console.log('location denied,initialization invite:' + inviteCode);
                if (inviteCode)
                    _handleInviteCode(inviteCode,null);
                else
                    closeWindows("#mainPanel");
                console.log('finished panel setup');
            }
        }, 5000); //5 second timeout?
    }
    var locationcall;
    if (navigator.geolocation) {
        //note that if there is no position information then the user
        //has to enter it in.
        console.log('getting location');
        //in phonegap use map.getMyLocation
        locationcall = navigator.geolocation.getCurrentPosition(getGeoLocation, getGeoLocationError, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 4000
        });
        return true;
    } else {//browser does not support geolocation
        return false;
    }
    return locationcall;
}
/* called by aroundme and reset
 * @param {type} markersFlag is for the platformMarkers, true on false off (for 1 and 2)
 * @returns {undefined}
 */
function getCurrentLocation()
{
    //platformMarkers = markersFlag;
    var retval;
    if (platform === 2) {
        retval = map.getMyLocation({enableHighAccuracy: true}, getGeoLocation, getGeoLocation2Error);
    } else {
        retval = navigator.geolocation.getCurrentPosition(getGeoLocation, getGeoLocationError, {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 5000
        });
    }
    return retval;
}
function getGeoLocationError(error) {
    console.log('did not retrieve location:' + error.code + ':' + error.message);

    if (platform === 2) {
        displayInfo.retrievedStartingLocation = -1;
        console.log('phonegap retrieval attempt');
        map.getMyLocation(getGeoLocation, getGeoLocation2Error);
    } else {
        if (displayInfo.retrievedStartingLocation !== -1) {
            displayInfo.retrievedStartingLocation = -1;
            console.log("Web Location 2nd try");
            getCurrentLocation();
        } else {
            displayInfo.retrievedStartingLocation = -1;//failure
            var inviteCode = checkForInviteCode();
            console.log('location denied,initialization invite:' + inviteCode+' error:'+error.message);
            if (inviteCode)
                _handleInviteCode(inviteCode,null);
            else
                closeWindows("#mainPanel");
            console.log('finished panel setup');
            startingLocation1.googlePosition = null;
            startingLocation1.position = null;
            if(displayInfo.persistentStartingLocation===true) {
                startingLocation1.setPosition(displayInfo.currentLocation,false,true);
                startingLocation1.setVisible(true);
            }
        }
    }
}
function getGeoLocation2Error(error) {
    console.log('Phonegap did not retrieve location:' + error.code + ':' + error.message);
    displayInfo.retrievedStartingLocation = -2;//use refused or there is a problem
}
function findCity(data) {
    //console.log('formattedaddress' + data.formatted_address);
    //console.log('formattedaddress' + data.location);
    for (var i = 0; i < data.address_components.length; i++) {
        //this is the city/county level{
        if (data.address_components[i].types[0] === 'administrative_area_level_2') {
            if (cityDefaults(data.address_components[i].long_name))
                console.log('CITY yes');
            return true;
            //console.log('address component ' + data.address_components[i].long_name);
//                                for (var j = 0; j < data.address_components[i].types.length; j++) {
//                                    console.log('type ' + data.address_components[i].types[j]);
//                                }
        }
    }
    console.log('CITY no');
    return false;
}
//this function checks to see if tis is in a City that has good public transportation
// this should only be called once
function cityDefaults(data) {
    var transit = ['New York County', 'Bronx County', 'Queens County', 'Kings County', 'Richmond County'];
    console.log('comparing:[' + data + ']');
    if ($.inArray(data, transit)) {
        return true;

    } else
        return false;
}

function getGeoLocation(position)
{
    var location;//this will be platform specific location
    //myCenter2 contains the google format LatLng while the currentLocation holds it in the platform specific format
    //myCenter2 is necessary for either map (in web) or gmap (in app)
    //var myCenter2;
    //to be replaced with
    //if there is a provider then it's not html based location, which means that the
    // plugin is installed
    //unknown means usually it's html based
    console.log('provider:' + position.provider);
    if (position.provider === 'network' || position.provider === 'gps' || position.provider === 'fused') {
        location = new plugin.google.maps.LatLng(position.latLng.lat, position.latLng.lng);
        lastKnownLocation = convert2latLng(location); //make sure it's in google LatLng format
    } else {
        if (platform === 2) {
            if (position.coords === undefined) {
                console.log('position not defined, location not retrieved');
                displayInfo.retrievedStartingLocation = -1;
            } else {
                location = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                lastKnownLocation = convert2latLng(location); //make sure it's in google LatLng format
            }
        } else {
            location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            lastKnownLocation = location;
        }
    }

    displayInfo.retrievedStartingLocation = 1;
    //this check is really relevant only once the app is opened
    if(startingLocation1!==null && startingLocation1.googlePosition !==null && lastKnownLocation.lat()===startingLocation1.googlePosition.lat()&&
            lastKnownLocation.lng()===startingLocation1.googlePosition.lng()){
        console.log("Location unchanged");
    }else{
        displayInfo.currentLocation=location;
        $('#output').text('retrieved:' + displayInfo.currentLocation);
        updateSearchBox(lastKnownLocation, '#startInput1');
        console.log('map updated');

    if (map) {
        if (platform === 2) {
            console.log('using plugin location info');
            zoomMarkerAt(lastKnownLocation, 14);
        } else {
            console.log('using web location info');
            zoomMarker(lastKnownLocation);//map.setCenter(lastKnownLocation);
        }
    }
    console.log('trying gmap');
    if (gmap)
        gmap.setCenter(lastKnownLocation);
    //there is a chance that the map and startingLocations are not setup yet

    console.log('updating markers:' + platform + ':' + platformMarkers);
    //note that the markers might not be setup at this point
    //Lets not setup the 2nd location to the current location

    startingLocation1.setVisible(true);
    if(navigateFlag===false){
        startingLocation1.setPosition(displayInfo.currentLocation,false,true); //currentLocation);

    }else{
        startingLocation1.setPosition(displayInfo.currentLocation,true,true); //currentLocation);
    }
    map.setZoom(displayInfo.defaultZoom);
    if (!platformMarkers) {// note that these might not be set
        //the only time the markers will be turned off will be for the aroundMe functionality
        {//this should be to some extent the same as resetMaapItems routine-
            //only difference is that platformMarkers=false is set
            _resetMapItems();
            displayInfo.midlocation = lastKnownLocation;
            midCircle.drawSearchCircle(lastKnownLocation, true, true);
        }
    }
    if (displayInfo.locationRetrieved === 0) {
        var inviteCode = checkForInviteCode();
        console.log('initialization invite:' + inviteCode);
        console.log('finished panel setup');
    }
    }//else
    displayInfo.locationRetrieved = 1;

    //with the location get the tiered information
    if(displayInfo.backgroundSearch===true)
	    handleTierSearch();
    console.log('markers updated');
}//getGeoLocation() finished
// phonegap - will these be supported? how?
var styles = [
    {
    "featureType": "poi.attraction",
    "stylers": [
        { "visibility": "off" }
        ]
    },
    {
    "featureType": "poi.government",
    "stylers": [
        { "visibility": "off" }
        ]
    },
    {
    "featureType": "poi.school",
    "stylers": [
        { "visibility": "off" }
        ]
    },
    {
    "featureType": "poi.sports_complex",
    "stylers": [
        { "visibility": "off" }
        ]
    },

    {
    "featureType": "poi.business",
    "stylers": [
        { "visibility": "off" }
        ]
    },
    {
    "featureType": "transit.line",
    "stylers": [
        { "visibility": "off" }
        ]
    }
    ];
var mapProp;
function mapInitialize() {
    displayInfo.initialization = 2;
    var mapProp2;
    if (platform === 2) {
        try {
            var latLng=new plugin.google.maps.LatLng(_lat,_lng);//41.796875,140.757007);
            mapProp2 = {'backgroundColor': 'white',
                'mapType': plugin.google.maps.MapTypeId.ROADMAP,
                'controls': {
                    'compass': true,
                    'myLocationButton': true,
                    'indoorPicker': true,
                    'zoom': true
                },
                'gestures': {
                    'scroll': true,
                    'tilt': true,
                    'rotate': true,
                    'zoom': true
                            /*       },
                             //fix for camera on iphone... always zoomed out if this is not set. */
                },
                'camera': {
                    'latLng': latLng,
                    'zoom': 15
                },
                'styles': styles
            };
        } catch (err) {
            console.log(err);
        }
    }
    //the google maps plugin has no problem mixing custom controls
    //while the html version seems to have issues

    console.log('map initializing');
    displayInfo.panelOpen = false;
    var mapDiv = document.getElementById("googleMap");
    initializeMainPanel();

    if (platform === 2) {
        console.log('initializing map plugin');
        map = plugin.google.maps.Map.getMap(mapDiv, mapProp2);
        // You have to wait the MAP_READY event.
        map.on(plugin.google.maps.event.MAP_READY, onMapInit);
        console.log('map plugin initialized');
    } else {
    	if(displayInfo.windowedMode!==true){
        if(displayInfo.detectedPlatform==="Win32"||displayInfo.detectedPlatform==="MacIntel")
            $("#fb_like").show();
        else
            $("#fb_like").hide();
         }
console.log('web map initialization');
        map = new google.maps.Map(mapDiv, mapProp);
        /*
            layer = new google.maps.FusionTablesLayer({
                query:
                    {select: 'lat,lng', from: '1e6qeVnug-fjMS2MqhQg2mfl28WAkwqWYyUaNhh9s'},
                styles: [{
                    markerOptions: {
                    iconName: "large_green"
                    }
                }]
            });
         layer.setMap(map);
        */
//note that this is the eweb.. if staticMode=true don't get the currentlocation
        if(handleMapUrl()===false)
            getCurrentLocalLocation(); //note that the mapmarkers might not be set at this point...
        map.setCenter(displayInfo.currentLocation);
        setupMarkerBoxLink(); //this can only be called after the map is setup
        panelSetup();
        //code needed to handle zooming and popupMenus
        google.maps.event.addListener(map, 'zoom_changed', function () {
            console.log("zoom changed");
            //updateSearchBounds();
            if (displayInfo.popupMenuVisible === true)
                hmenu_instance.popupMenuMove(displayInfo.popupMenuStorage, null);
            //timeout needed because sometimes the markers do not appear.... a problem
            //only on the web
                setTimeout(function() {
                    var cnt = map.getCenter();
                    cnt.e+=0.000001;
                    map.panTo(cnt);
                    cnt.e-=0.000001;
                    map.panTo(cnt);
                },400);
        });
         google.maps.event.addListener(map, 'click', function (evt) {
            console.log("map click" + evt);

            if (!displayInfo.radiusCircle && displayInfo.popupMenuDisplay===true) {

                    hmenu_instance.popupMenuCreate(hmenu_instance.popupMarkerMenuDefinitions, popupArray, evt.latLng);
            }
            //if choosing the radius, then
        });
    }
    //setup all the click handlers
    appInitializePanel();

    stepDisplay = new google.maps.InfoWindow();
    //the panel asking for the location should appear first in the middle of the
    //screen
    console.log('finished mapInitialize');
    $("#mainPanel").on("swipeleft", function () {
        if (venueDetails.length > 0)
            closeWindows(venueUi);
        console.log('swipeleft');
    });
    $("#mainPanel").on("swiperight", function () {
        console.log('swiperight');
        if (routeDetails1)
            displayRouteText('A', 0);
    });

    $("#swipebutton").on("click", function () {
        if(displayInfo.mainPanelType===1)
            closeWindowsReset();
        else
            initializeMainPanel();
        //this should now toggle teh mainPanel
        //checkPanelOpen();
    });
    if(displayInfo.windowedMode!==true){
    var slider = document.getElementById('radius2');
    /* noUiSlider is used for the searchRardius
     **/
    noUiSlider.create(slider, {
    	start: [ 500 ], // Handle start position
    	//connect: true, // Display a colored bar between the handles
        //	direction: 'rtl', // Put '0' at the bottom of the slider
    	//  orientation: 'horizontal', // Orient the slider vertically
        //	behaviour: 'tap-drag', // Move handle on tap, bar is draggable
    	range: { // Slider can select '0' to '100'
    		'min': 50,
            '50%': 1000,
            '75%': 25000,
    		'max': 50000
    	},
       	pips: { // Show a scale with the slider
    		mode: 'steps',
    		density: 2
    	}
    });
    var inputNumber = document.getElementById('radius');

    slider.noUiSlider.on('update', function( values, handle ) {

	var value = values[handle];
        inputNumber.value = Math.round(value);
        if(displayInfo.radiusCircle){
            popupDrawRadius();
            if ( handle ) {
            	inputNumber.value = value;
            } else {
    		slider.value = Math.round(value);
            }
        }
    });

    slider.addEventListener('change', function(){
    	slider.noUiSlider.set([this.value]);
    });

    inputNumber.addEventListener('change', function(){
    	slider.noUiSlider.set([this.value]);
    });
 }else {
 	GoogleMapDiv.parent().append($(venueDetailsUi));
 	$(venueDetailsUi).css('top',0);
 	$(venueDetailsUi).css('left',0);
 	$(venueDetailsUi).css('position','absolute');
 	GoogleMapDiv.parent().append($(venueUi));
 	$(venueUi).css('position','absolute');
    GoogleMapDiv.parent().append($("#types-div"));
        $("#types-div").css('position','absolute');
    GoogleMapDiv.parent().append($("#route-ui"));
        $("#route-ui").css('position','absolute');
    GoogleMapDiv.append($("#clusterNavigation"));
    GoogleMapDiv.append($('#mainReset'));

 }//end windowed mode
    GoogleMapDiv.append($("#system-menu"));
    GoogleMapDiv.append($('#travel-mode-popup-menu'));
    GoogleMapDiv.append($("#mode-menus"));
    GoogleMapDiv.append($("#clusterNavigation"));
    GoogleMapDiv.append($('#mainReset'));
    var value =getCookie('displayTour');
if(displayInfo.windowedMode!==true){
    if (value===''){
        setTimeout( function(){
            if(displayInfo.staticMode===true){
                clusterHelp();
            }else
                displayTour();
        },2000);

    }
 }

    //**********
    //popupMenu definititions
    hmenu_instance = new hmenu;
    hmenu_instance.init(platform,displayInfo.platform,displayInfo.pixelRatio,window.app, marker_calls);
    localinit_instance = new localinit;
    localinit_instance.init(marker_calls);
    if(displayInfo.favoritesLoad===true){
       favorite_instance = new favorite;
       favorite_instance.init(marker_calls);
        favorite_instance.favoritesLoad();
    }

$('.circle').on("click", function(){
    if($(this).css("background-color") === 'rgb(77, 77, 77)') {
        $(this).find('.googletype').prop('checked', true);
        $(this).css({'background-color':'rgb(0, 255, 255)'});
    }
    else {
        $(this).find('.googletype').prop('checked', false);
        $(this).css({'background-color':'rgb(77, 77, 77)'});
    }
});
    //add code to change the radio button to a circle
}//end of mapInitializae
function clusterHelp(){
    var options;
    if(displayInfo.narrow===true){
    options = { data:[
            { element: '#travel-mode-popup-menu','tooltip':'Change travel mode between car, transit, walk or bike.',
                'position':'R',
                'text':'<p>Click on a pin for more information on a venue. </p>',
            'controlsPosition': 'TR'},
            { element: '#prevClusterButton','tooltip':'<p>Show different pages of venue results','position':'T',
                'text':'<p>Clicking twice will route you to the venue. Touch the map for more options!</p>',
            'controlsPosition': 'TR'}
        ],
            welcomeMessage: '<p>Welcome to Hiamaps, Click start for a quick tour.</p>',
            controlsPosition: 'TR' };
    }else{
        options = { data:[
            { element: '#travel-mode-popup-menu','tooltip':'Change travel mode between car, transit, walk or bike.',
                'position':'R',
                'text':'<p>Click on a pin for more information on a venue. </p>',
            'controlsPosition': 'BR'},
            { element: '#prevClusterButton','tooltip':'<p>Show different pages of venue results','position':'T',
                'text':'<p>Clicking twice will route you to the venue.</p>',
            'controlsPosition': 'BR'},
            { element: '#fb_like','tooltip':'Like us on Facebook!',
                text :"<p>Touch the map for options!</p>",
            'controlsPosition': 'BR'}
        ],
            welcomeMessage: '<p>Welcome to Hiamaps, Click start for a quick tour.</p>',
            controlsPosition: 'BR' };
        }
    $.aSimpleTour(options);//this should be called aftger the initial window?
    setCookie('displayTour', 'yes',3);
}
function displayTour(){
    console.log('tour start');
    var options = { data:[
        { element: '#travel-mode-popup-menu','tooltip':'Change from car to transit, walk or bike mode.',
            'position':'R',
            'text':'<p>Touch anywhere on the map!</p>' },
        { element: '#touristButton','tooltip':'Clicking on one of these buttons will search around the marker.',
            'text':'<p>The popup menu will also have these choices as well.</p>' }
    ],
        welcomeMessage: '<p>Welcome to Hiamaps.  Click start for a quick tour.</p> ',
        controlsPosition: 'BR' };

    $.aSimpleTour(options);//this should be called aftger the initial window?
    setCookie('displayTour', 'yes',7);
}

function venueUiPanel()
{
    //note have to take into account that there is a mouseenter and a subsequent mouseleave
    if (platform === 2 && displayInfo.platform === 'iOS') {
        //    $("div.card, button, a").mouseenter(function (event) {
        $("#venue-ui div.card,#venue-ui button,#venue-ui a").on('mouseenter', function (event) {

            var id = $(this).attr('id');
            event.stopImmediatePropagation();
            event.preventDefault();
            console.log(event.type + ':hover event in:' + id);
            $(this).click();
        });
        $("#venue-ui div.card,#venue-ui button,#venue-ui a").mouseout(function (event) {
            var id = $(this).attr('id');
            console.log('hover event out:' + id);
            //openZoom(id);
        });
        /**/
    }
}
function validateUser(selector, token) {
    var retval = $.ajax({type: 'POST',
        url: UserUrl,
        data: {
            action: 'validateUser',
            selector: selector,
            token: token
        },
        xhrFields: {
            withCredientials: false
        },
        success: function (data, status) {
            console.log('User system retrieved data' + data + ':' + status);
            return data;
        },
        error: function (xhr, desc, err) {
            console.log('error retrieving invite information' + xhr);
            console.log('Details: ' + desc + '\nError:"+err');
        }
    });
    return retval;
}
function checkUserid(userId) {
    var retval = $.ajax({type: 'POST',
        url: UserUrl,
        data: {
            action: 'checkUserid',
            userId: userId
        },
        xhrFields: {
            withCredientials: false
        },
        success: function (data, status) {
            console.log('User system retrieved data' + data + ':' + status);
            return data;
        },
        error: function (xhr, desc, err) {
            console.log('error retrieving invite information' + xhr);
            console.log('Details: ' + desc + '\nError:"+err');

        }
    });
    return retval;
}
function checkEmail(email) {
    var retval = $.ajax({type: 'POST',
        url: UserUrl,
        data: {
            action: 'checkEmail',
            email: email
        },
        xhrFields: {
            withCredientials: false
        },
        success: function (data, status) {
            console.log('User system retrieved data' + data + ':' + status);
            return JSON.parse(data);
        },
        error: function (xhr, desc, err) {
            console.log('error retrieving invite information' + xhr);
            console.log('Details: ' + desc + '\nError:"+err');
        }
    });
    return retval;
}
function resendValidationEmail() {
    var userId = $('#login-userid').val();
    if (userId.length > 0) {
        var retval = $.ajax({type: 'POST',
            url: UserUrl,
            data: {
                action: 'resendValidationEmail',
                userId: userId
            },
            xhrFields: {
                withCredientials: false
            },
            success: function (data, status) {
                console.log('User system retrieved data' + data + ':' + status);
                var retvar = JSON.parse(data);
                if (retvar.status === "ok") {
                    popupMessage('Validation email requested.');
                    closeWindowsReset();
                }
            },
            error: function (xhr, desc, err) {
                console.log('error retrieving invite information' + xhr);
                console.log('Details: ' + desc + '\nError:"+err');
            }
        });
        return retval;
    }
}
function getUserProfile(userId) {
    var retval = $.ajax({type: 'POST',
        url: UserUrl,
        data: {
            action: 'getUserProfile',
            selector: displayInfo.selector,
            token: displayInfo.token
        },
        xhrFields: {
            withCredientials: false
        },
        success: function (data, status) {
            console.log('User system retrieved data' + data + ':' + status);
            return JSON.parse(data);
        },
        error: function (xhr, desc, err) {
            console.log('error retrieving invite information' + xhr);
            console.log('Details: ' + desc + '\nError:"+err');
        }
    });
    return retval;

}
/****
 * popupMessage() to display a message.  Note that on the app version
 * @param {type} message to be displayed
 * @returns {undefined} none
 */
function popupMessage(message) {
    $('#message').text(message);
    console.log('popup message' + message);
    if (platform === 2)
        map.setClickable(false);
    $('#popupMessage').popup('open');
}
function popupTimed(message) {
    $('#message').text(message);
    $('#popupMessage').popup('open');
    setTimeout(function () {
        $('#popupMessage').popup("close");
    }, 2000);
}
function popupTimer(id, message) {
    $('#popupMessage').text(message);
    $('#popupMessage').popup({arrow: "t,b", positionTo: id});
    $('#popupMessage').popup("open");
    setTimeout(function () {
        $('#popupMessage').popup("close");
    }, 2000);
}
function closePopup() {
    $('#popupMessage').popup('close');
    if (platform === 2)
        map.setClickable(true);
}
function justMessage(id, message) {
    $(id).html(message);
}
function messageTimer(id, message) {
    $(id).text(message);
    setTimeout(function () {
        $(id).text('');
    }, 2000);
}
function validateUserId(userid) {
    var text = $(userid).val();
    if (text.length < 6)
        return -1;

}
/****
 * validateEmail will make sure that the email string is of the form string@string.string
 * @param {type} email an email stree
 * @returns {Boolean}
 */
function validateEmailFormat(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
function checkRegisterEmailField1() {
    var val = validateEmailFormat($('#register-email').val());
    if (val === false)
        justMessage('#register-message-email', 'invalid email format');
    else
        justMessage('#register-message-email', '');
    return val;
}

function validatePasswordFields(password1, password2) {
    var pass1 = $(password1).val();
    if (pass1 !== $(password2).val()) {
        return -1;
    }//they should contain at least 2 non-alpha
    if (pass1.length < 8)
        return -2;
    var nonalpha = pass1.replace(/[A-za-z]/g, '');
    if (nonalpha.length > 1)
        return true;
    else
        return -3;
}
function validateEmailFields() {
    var email1 = $('#register-email').val();

    /* both equal
     * now it should be of the right format
     */
    if (validateEmailFormat($('#register-email').val()) === false) {
        return -2;
    }
    return true;
}
function processRegisterId() {
    //are we showing anything particular for this?
    $('#register-message-message').val('Please enter a user id');
}
function processRegisterEmail() {
    //are we showing anything particular for this?
}
function processRegisterEmail2() {
    //are we showing anything particular for this?
    messageTimer('#register-email2', 'Please re-enter email address');
    return true;

}
function checkRegisterUserid() {
    var id = $('#register-userid').val();
    var retval = checkUserid(id);
    retval.done(function (data, status) {
        var values = JSON.parse(data);
        if (values.status === "err") {
            messageTimer('#register-message-userid', 'User Id not unique, please change');//move to
        } else {
            messageTimer('#register-message-userid', 'User Id accepted');//move to
        }
        //message data.accepted, move to email
    }, function (data, status) {

        //message data.not accepted change userId
    });
}
function checkRegisterPageEmail() {
    var email = $('#register-email').val();
    var retval = checkEmail(email);
    retval.done(function (value, status) {
        data = JSON.parse(value);
        if (data.status === 'ok' || data.message_code === 130) {
            justMessage('#register-message-email', 'Warning, email address is in use.<button onclick="openforgotPassword()">Recover</button>');
            return false;
        }
        //message data.accepted, move to email
    });
}
function processRegisterPagePassword() {
    var email1 = $('#register-email').val();
    {
        var retval = checkEmail(email1);
        retval.done(function (data, status) {
            console.log(data);
            //message data.accepted, move to password
            return true;
        }, function (data, status) {
            //message data.not accepted, change email
            //or ask to recover email
            return false;
        });
    }
}
/*
 * newUserWindow() can be called from login
 * Only the userId and Email is checked to make sure it does not exist.
 * If it does, will ask if the user wants a recovery email sent
 *
 * @param {} map
 * @returns {undefined}
 */
function newUserWindow(popup) {
    //dismiss the popup if open
    if (popup) {
        $('#loginPage').popup("close");

    }
    closeWindows("#registerPage");
}
function forgotUserid() {
    var email = $('#forgotuserid-email').val();
    var retval = ajaxForgotUserid(email);
    retval.done(function (data, status) {
        results = JSON.parse(data);
        popupMessage('User Id request submitted.');
        closeWindows("#mainPanel");
    });
}
function updatePassword() {
    var password = $('#change-password').val();
    var value = validatePasswordFields('#change-new-password', '#change-new-password2');
    if (value < 0) {
        if (value === -1) {//not the same
            messageTimer('#change-message-password1', 'Error: Passwords must match.');
        } else if (value === -2) {//invalid format
            messageTimer('#change-message-password1', 'Error: Password is in invalid format.');
        }
    } else {
        var retval = ajaxChangePassword(displayInfo.userId, password, $('#change-new-password').val());
        retval.done(function (data, status) {
            var results = JSON.parse(data);
            if (results.status === 'ok') {
                popupMessage('Password successfully changed.');
                closeWindows("#mainPanel");
            } else {
                if (results.message_code === -102) {
                    messageTimer("#change-message-password1", "Unverified email, cannot change password until verified.");
                } else if (results.message_code === -103) {
                    messageTimer("#change-message-password1", "Internal error, please contact support");
                } else if (results.message_code === -104) {
                    messageTimer("#change-message-password1", "Validation error");
                } else if (results.message_code === -105) {
                    messageTimer("#change-message-password1", "Invalid Password");
                }
            }

        });
    }
}

function ajaxQueryVendorData(list) {
    var string = JSON.stringify(list);
    var retval = $.ajax({type: 'POST',
        url: venueDataUrl,
        data: {
            action: 'checkVenues',
            placeIds: string
        },
        xhrFields: {
            withCredientials: false
        },
        success: function (data, status) {
            return data;
        },
        error: function (xhr, desc, err) {
            console.log('error retrieving invite information' + xhr);
            console.log('Details: ' + desc + '\nError:"+err');
        }
    });
    return retval;
}
function ajaxListInvites() {
    var retval = $.ajax({type: 'POST',
        url: UserUrl,
        data: {
            action: 'retrieveInvites',
            selector: displayInfo.selector,
            token: displayInfo.token
        },
        xhrFields: {
            withCredientials: false
        },
        success: function (data, status) {
            return data;
        },
        error: function (xhr, desc, err) {
            console.log('error retrieving invite information' + xhr);
            console.log('Details: ' + desc + '\nError:"+err');
        }
    });
    return retval;

}
function ajaxChangePassword(userId, password, newpassword) {
    var retval = $.ajax({type: 'POST',
        url: UserUrl,
        data: {
            action: 'changePassword',
            userId: userId,
            password: password,
            newpassword: newpassword
        },
        xhrFields: {
            withCredientials: false
        },
        success: function (data, status) {
            console.log('User system retrieved data' + data + ':' + status);
            return data;
        },
        error: function (xhr, desc, err) {
            console.log('error retrieving invite information' + xhr);
            console.log('Details: ' + desc + '\nError:"+err');

        }
    });
    return retval;
}
function ajaxAddUser(userId, email, password) {
    var retval = $.ajax({type: 'POST',
        url: UserUrl,
        data: {
            action: 'createLogin',
            userId: userId,
            email: email,
            password: password
        },
        xhrFields: {
            withCredientials: false
        },
        success: function (data, status) {
            console.log('User system retrieved data' + data + ':' + status);
            return data;
        },
        error: function (xhr, desc, err) {
            console.log('error retrieving invite information' + xhr);
            console.log('Details: ' + desc + '\nError:"+err');

        }
    });
    return retval;
}
function ajaxForgotUserid(email) {
    var retval = $.ajax({type: 'POST',
        url: UserUrl,
        data: {
            action: 'forgotUserid',
            email: email
        },
        xhrFields: {
            withCredientials: false
        },
        success: function (data, status) {
            console.log('User system retrieved data' + data + ':' + status);
            return data;
        },
        error: function (xhr, desc, err) {
            console.log('error retrieving invite information' + xhr);
            console.log('Details: ' + desc + '\nError:"+err');

        }
    });
    return retval;
}
function ajaxForgotPassword(email) {
    var retval = $.ajax({type: 'POST',
        url: UserUrl,
        data: {
            action: 'forgotPassword',
            userId: email
        },
        xhrFields: {
            withCredientials: false
        },
        success: function (data, status) {
            console.log('User system retrieved data' + data + ':' + status);
            return data;
        },
        error: function (xhr, desc, err) {
            console.log('error retrieving invite information' + xhr);
            console.log('Details: ' + desc + '\nError:"+err');

        }
    });
    return retval;
}
function ajaxLoginUser(userId, password_hash) {
    var retval = $.ajax({type: 'POST',
        url: UserUrl,
        data: {
            action: 'loginUser',
            userid: userId,
            password: password_hash
        },
        xhrFields: {
            withCredientials: false
        },
        success: function (data, status) {
            return JSON.parse(data);
        },
        error: function (xhr, desc, err) {
            console.log('Details: ' + desc + '\nError:"+err');

        }
    });
    return retval;
}
function createProfile() {
    var value = validateUserId('#register-userid');
    if (value < 0) {
        if (value === -1) {//too short

        } else if (value === -2) {//not unique

        }
    }
    var value = validateEmailFields("#register-email", "#register-email2");
    if (value < 0) {
        if (value === -1) {//not the same
            messageTimer('#register-message-email', 'Error: Email addresses must match.');
        } else if (value === -2) {//invalid format
            messageTimer('#register-message-email', 'Error: Email is in invalid format.');
        }
    } else {
        value = validatePasswordFields("#register-password", "#register-password2");
        if (value < 0) {
            if (value === -1) {//not the same
                messageTimer('#register-message-email', 'Error: Passwords must match.');
            } else if (value === -2) {//invalid format
                messageTimer('#register-message-email', 'Error: Password must be at least 8 characters in length.');
            } else if (value === -3) {//invalid format
                messageTimer('#register-message-email', 'Error: Password must contain at least two non-alpha characters.');
            }
        } else {
            var userid = $('#register-userid').val();
            var email = $('#register-email').val();
            var password = $('#register-password').val();

            console.log('adding user');
            var retval = ajaxAddUser(userid, email, password);
            retval.done(function (data, status) {
                var response = JSON.parse(data);
                if (response.status === 'ok') {
                    popupMessage('User profile created, validation email sent.\r  If you do not see this within 5 minutes, please check your spam folder.');
                    closeWindows("#mainPanel");

                } else if (response.message_code === -102) {//email in use
                    messageTimer('#register-message-email', 'Email in use, please use password recovery');
                } else if (response.message_code === -106) {
                    messageTimer('#register-message-email', 'Duplicate user id');
                }
            });
        }
    }
    /*
     var email = $('#register-email').val();
     var password = $('#register-password').val();
     if (password.length < 8) {
     justMessage('#register-message-password', 'Must be 8 characters or more');
     return false;
     }
     if (checkRegisterEmailField2() === false)
     return false;
     */
}
function openforgotPassword() {
    $('#loginPage').popup("close");
    $('#forgotPasswordPage').popup();
    $('#forgotPasswordPage').popup("open");
}
function resetPassword() {
    var userid = $('#forgot-password-userid').val();
    //if (validateEmailFormat(email)) {
    messageTimer("#forgot-message-userid", "Email request submitted.");
    var retval = ajaxForgotPassword(userid);
    retval.done(function (data, status) {
        var result = JSON.parse(data);
        console.log(result);
    });
    setTimeout(function () {
        //note that reseting the password will mean that the panel options will
        //be different
        closeWindows("#mainPanel");
    }, 2000);
}
function loginCheckEnterKey(key) {
    if (key.keyCode === 13)
        loginUserForm();
}
function searchScreenHistory(screen) {
    for (var i = 0; i < screenHistory.length; i++) {
        if (screenHistory[i] === screen)
            return true;
    }
    return false;
}
/****
 * Invoked when the use clicks the login button
 * loginUserForm()
 *
 * @returns {undefined}
 */
function loginUserForm() {
    $('#login-message').text('');
    var userid = $("#login-userid").val();
    var password = $("#login-password").val();
    if (password.length < 8) {

        messageTimer('#login-message', 'Password must be at least 8 characters');
        return;
    }
    if ($('#login-autologin').is(':checked')) {
        console.log("autologin checked");
    }
    var retval = ajaxLoginUser(userid, password);
    retval.done(function (data, status) {
        var response = JSON.parse(data);
        if (response.status === 'err') {
            console.log('logging in error');
            if (response.message_code === -102) {
                var message = response.message;
                closeWindows('#validateEmailPage');
                messageTimer('#login-message', message);
            } else {
                message = "Invalid ID/Password combination";
                messageTimer('#login-message', message);
            }
        } else if (response.status === 'ok') {
            displayInfo.token = response.token;
            displayInfo.selector = response.selector;
            displayInfo.userId = userid;
            saveStorage();
            //message code should be checked to see if it's a temporary password, if so
            // bring up the new password page
            console.log('logging in success selector:' + displayInfo.selector + ' token:' + displayInfo.token);
            panelLoggedInOptions();
            //note that if they came from #inviteDisplay, they should go back
            if (searchScreenHistory("#event-ui"))
                createEventDetails();
            else
                closeWindows("#mainPanel");
        }
        console.log(data);
    });
}
/*******
 * detectBrowser() will query various defaults such as userAgent, etc to determine
 * the type of browser and the platform (using navigator.platform)
 *
 * Note that while it can be running in a linux browser, at of this point 6/22/2015, if
 * platform===2 then it is on android.
 * Processor can be arm, intel etc. * @returns {undefined}
 */
function detectBrowser() {
    displayInfo.isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    displayInfo.isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    displayInfo.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
    displayInfo.isChrome = !!window.chrome && !displayInfo.isOpera;              // Chrome 1+
    displayInfo.isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6
    //it's either linux arm71 or iPad iPhone iPod
    //win32 macintel http://stackoverflow.com/questions/19877924/what-is-the-list-of-possible-values-for-navigator-platform-as-of-today
    var detectedPlatform = navigator.platform;
    displayInfo.detectedPlatform=detectedPlatform;
    //alert(detectedPlatform);
    var detectedBrowser = 'opera:' + displayInfo.isOpera + " firefox:" + displayInfo.isFirefox + " Chrome:" + displayInfo.isChrome + " isIe:" + displayInfo.isIE + " Safari:" + displayInfo.isSafari;
    console.log('DetectPlatform:' + detectedPlatform + ' detectedBrowser' + detectedBrowser);
}
function handleWebDownload(){
    if(displayInfo.detectedPlatform==="iPad"||displayInfo.detectedPlatform==="iPod" || displayInfo.detectedPlatform==="iPhone" || displayInfo.derivedOS==='iOS'){
        /*
        $("#appleApp").show();
        $("#appleApp2").show();
        */
        //$(".appleApp").show();
        $("#googlePlay").hide();
        $("#googlePlay2").hide();

    }
    if(displayInfo.derivedOS==="Android"){
        //$(".androidApp").show();
        /*
        $("#googlePlay").show();
        $("#googlePlay2").show();
        */
        $("#appleApp").hide();
        $("#appleApp2").hide();

    }
    $('#downloadApp').show();
}
function dismiss_download(){
    $('#downloadApp').hide();
}

/***************************************************
 * Handler for basePanel to invoke functionality
 *
 * @param {type} action
 * @returns {undefined}
 */
function panelAction(action) {
    console.log('panel:' + action);
    if (action === 'exit')
        navigator.app.exitApp();
    if (action === 'login') {
        $('#basePanel').panel('close');
        closeWindows('#loginPage');
    }
    if (action === 'logout') {
        $('#basePanel').panel('close');
        logout();
    }
    if (action === 'open-invite') {
        $('#basePanel').panel('close');
        openInviteScreen();
    }
    if (action === 'about') {
        $('#basePanel').panel('close');
        closeWindows("#about");
    }
    if (action === 'defaults') {
        $('#basePanel').panel('close');
        defaultsSetup();
        closeWindows("#defaults");
    }
    if (action === 'profile') {
        $('#basePanel').panel('close');
        retrieveProfile();
        closeWindows('#profilePage');
    }
    if (action === 'where') {
        $('#basePanel').panel('close');
        whereAmIStart();
        closeWindows('#where');
    }
    if (action === 'list') {
        $('#basePanel').panel('close');
        var timer = setInterval(function () {
            if ($('#basePanel').hasClass("ui-panel-closed")) {
                clearInterval(timer);
                closeWindows('#listInvites');
                //retrieveList();
            }
        }, 200);
    }
}
/******
 * aboutsetup will initialize the screen
 */
function aboutSetup(){

}
var base_defaults = {
    advanced_mode : true,
    more_screen: true,
    transport_mode : "DRIVING"
};

/************
* getUserSelect() gets the login information
* @returns {{}}
*/
function getUserSelect(){
    var object = {};
    object.selector = displayInfo.selector;
    object.token = displayInfo.token;
    return object;
}
/**************
* drop_favorite should be similar to processClusterData()
* favorites should have an event window and allow you to get more details (if
* there is a place_id).
*
* The pin should appear in the venueList and the venueDetails if the information
* has a googlecode.  If there is no googlecode, then this might only have an
* Address, Description and a pin_type
*
* The marker should be clickable which it is currently not
*
* Should call placeDetailObject, though the datafields are not all set
* place_id=this.googlecode
* this.location must be created
* marker = null
* long is not set
* Note that unlike clusterdata there will be no event_id/event_name/event_description

 */
function drop_favorite(type){

    var item=favorite_instance.findFavorite(type);
    createFavoriteMapObject(item);
    updateSearchBounds();
    createVenueList();
}
/************************
* createFavoriteMapObject gets the information for the favorite and places it on the map, so that
*
*
* @param {type} item
*/
function createFavoriteMapObject(item){
    var position;
    var placeObject = new placeDetailObject(item);

    //pin should be pulled from
    // var pin=retrieve_pin_image(type);
    //this gets the favorite that has that particular type.

    placeObject.place_id=placeObject.googlecode;
    placeObject.location = new google.maps.LatLng(item.lat,item.lng);
//for platform==2 this should be using the plugin
    placeObject.geometry = {};
    placeObject.geometry.location=placeObject.location;
    placeObject.googlePosition=placeObject.location;
    venueDetails.push(placeObject);
    if(!placeObject.long || placeObject.long===false){
        getVenueDetailsMinute(placeObject.place_id);
        var venue = _.find(venueDetails, function (object) {
            return object.place_id === placeObject.place_id;
        });
        if(!venue.vendorDataCheck){
            var queryString = [];
            queryString.push(placeObject.place_id);
            processExtendedData(queryString);
        }
    }
    return placeObject;
}

/*******
* retrieve_pin_image given a favorite type, drop the pin somewhere on the screen
 */
function retrieve_pin_image(type){
    switch(type){
        case 'home':
            return 'data:image/png;base64,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';
            break;
        case 'work':
            return 'data:image/png;base64,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';
            break;
        default:
            return 'data:image/png;base64,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';
            break;
    }
    //
}

/*************
* create the favorite data object.  Initial menu item is blank,
* what menu items for the popup can there be?  H/W/F1/F2?  if they assign one
* in the edit then it will appear in the popup menu, we can have 5 popup menu
* items.
* Note that if data.menu_type is home or work that there is only one.  So it will
* replace any new items.
 */
function favoriteSave(name, address, googlecode, description, lat, lng, scope, menu_item){
    var data = {};
        data.name=name;
        data.address_1=address;
        data.description=description;
        data.googlecode=googlecode;
        data.lat=lat;
        data.lng=lng;
        data.scope=scope;
        data.menu_type=menu_item;
        return data;
}

function afavoritesLoad(){
    var retval=_favoritesLoad();
    retval.done(function(data,status){
        favs=data.data;
        if(data.found>0){
            displayInfo.favorites=JSON.parse(favs);
            buildFavoritesPopup();
        }
    });
    retval.error(function(data,status){
        favoritesLoadLocal();
        buildFavoritesPopup();
    });
    hmenu_instance.updatePopupMenu();
}
function updatePopupMenu(){
    hmenu_instance.updatePopupMenu();
}
function buildFavoritesPopup(){
    var favorites=displayInfo.favorites;
    for(var i=0;i<favorites.length;i++){
        favorites[i].googlePosition=new google.maps.LatLng(favorites[i].lat, favorites[i].lng);
        if(platform===2)
            favorites[i].location=convert2latLng(favorites[i].googlePosition);
        else
            favorites[i].location=favorites[i].googlePosition;
        favorites[i].vicinity = favorites[i].address_1;
        if(favorites[i].menu_type && favorites[i].menu_type!==null){
            var item=processFavoriteMenu(favorites[i],i);
            hmenu_instance.popupMenuDefinitions.push(item);
            hmenu_instance.popupMarkerMenuDefinitions.push(item);
        }
    }
}
function processFavoriteMenu(item,offset){
    var item;
    if(item.menu_type==='home')
        return { name: 'home_favorite', icon: pop_home, hover: pop_home, activate: pop_home };
    if(item.menu_type==='work')
        return { name: 'work_favorite', icon: pop_work, hover: pop_work, activate: pop_work };
    if(item.menu_type==='place1')
        return { name: 'place1', icon: pop_place1, hover: pop_place1, activate: pop_place1 };
    if(item.menu_type==='place2')
        return { name: 'place2', icon: pop_place1, hover: pop_place1, activate: pop_place1 };
    if(item.menu_type==='place3')
        return { name: 'place3', icon: pop_place1, hover: pop_place1, activate: pop_place1 };
    if(item.menu_type==='place4')
        return { name: 'place4', icon: pop_place1, hover: pop_place1, activate: pop_place1 };
    if(item.menu_type==='place5')
        return { name: 'place5', icon: pop_place1, hover: pop_place1, activate: pop_place1 };
}

/*****
 * save defaults
 */
function defaultsSetup(){
    if(advanced_mode)
        $('#advanced_mode').val("true");
    else
        $("#advanced_mode").val("false");
    if(more_screen)
        $('#more_screen').val("true");
    else
        $("#more_screen").val("false");
    $("#more_screen").flipswitch("refresh");
    $('#advanced_mode').flipswitch("refresh");
    updateDefaultTravelModeIcon();
}
/*****
* updateefaultTravelModeIcon will set the default travelModeIcon to an ungreyed version
* all the icons must be set to the greyed version first
 */
function updateDefaultTravelModeIcon(){
    resetDefaultTravelModeIcons();
    switch(displayInfo.travelMode){
        case 'WALKING':
            $('#walkingl').removeClass('ui-icon-lool-walking-grey').addClass('ui-icon-lool-walking');
            break;
        case 'DRIVING':
            $('#drivingl').removeClass('ui-icon-lool-driving-grey').addClass('ui-icon-lool-driving');
            break;

        case 'BICYCLING':
            $('#bikingl').removeClass('ui-icon-lool-biking-grey').addClass('ui-icon-lool-biking');
            break;

        case 'TRANSIT':
            $('#transitl').removeClass('ui-icon-lool-transit-grey').addClass('ui-icon-lool-transit');
            break;

        default:
            break;//undefinsed case
    }
}
function resetDefaultTravelModeIcons(){
    $('#walkingl').removeClass('ui-icon-lool-walking').addClass('ui-icon-lool-walking-grey');
    $('#transitl').removeClass('ui-icon-lool-transit').addClass('ui-icon-lool-transit-grey');
    $('#bikingl').removeClass('ui-icon-lool-biking').addClass('ui-icon-lool-biking-grey');
    $('#drivingl').removeClass('ui-icon-lool-driving').addClass('ui-icon-lool-driving-grey');
}
function defaultsLoad(){
    var string=localStorage.getItem("default");
    var defaults=JSON.parse(string);
    if(defaults===null){
        defaults=base_defaults;
    }
    advanced_mode=defaults.advanced_mode;
    more_screen=defaults.more_screen;
    displayInfo.travelMode=defaults.transport_mode;
    string='input[value="'+defaults.transport_mode+'"]';
    $(string).prop('checked','checked');
    $('input[name="travel-moded"]').checkboxradio('refresh', true);
    updateDefaultTravelMode(defaults.transport_mode);
}

function defaultsSave(){
    defaults=base_defaults;
    var string=$('#advanced_mode').val();
    if(string==="true")
        advanced_mode=true;
    else
        advanced_mode=false;
    var string=$('#more_screen').val();
    if(string==="true")
        more_screen=true;
    else
        more_screen=false;
    defaults.advanced_mode=advanced_mode;
    defaults.more_screen=more_screen;
    defaults.transport_mode=$('input[name="travel-moded"]:checked').val();
    var string= JSON.stringify(defaults);
    localStorage.setItem("default",string);
    console.log("defaults saved");
    displayInfo.travelMode=defaults.transport_mode;
    resetDefaultTravelModeIcons();
    updateDefaultTravelModeIcon();
}
function defaultsClear(){
    localStorage.setItem("default",null);
}
function setCookie(cname,cvalue,exdays){
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 *60 *60 * 1000));
    var expires = "expires = "+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; "+expires;
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1);
        if (c.indexOf(name) === 0) { console.log('getCookie found '+ c);
            return c.substring(name.length,c.length);
        }
    }
    console.log('getCookie did not find'+cname);
    return "";
}
/****
 * Logging out should probably ask if we want to
 * @returns {undefined}
 */
function logout() {
    displayInfo.token = null;
    displayInfo.selector = null;
    displayInfo.userId = null;
    saveStorage();
    panelLoggedOutOptions();

}
/*
 * remove the exit option
 * @returns {undefined}
 */
function setupiOS() {
    $('#exit-panel-item').hide();
    displayInfo.pixelRatio = 1;
}
function setupAndroid() {
    $('#exit-panel-item').show();
    displayInfo.pixelRatio = window.devicePixelRatio;
}
function panelLoggedInOptions() {
    console.log('panel logged in');
    $('#login-panel-item').hide();
    $('#list-panel-item').show();
    $('#profile-panel-item').show();
    $('#logout-panel-item').show();
    $('#name').text(displayInfo.userId);
    $('#basePanel').trigger('updatelayout');
}
function panelLoggedOutOptions() {
    console.log('panel logged out');
    $('#logout-panel-item').hide();
    $('#list-panel-item').hide();
    $('#profile-panel-item').hide();
    $('#login-panel-item').show();
    $('#basePanel').trigger('updatelayout');
    $('#name').text('');
}
function retrieveProfile() {
    $('#profile-userid').val(displayInfo.userId);
    var retval = getUserProfile(displayInfo.userId);
    retval.done(function (data, status) {
        var results = JSON.parse(data);
        if (results.status === 'ok') {
            $('#profile-email').val(results.email);
        }
    });
}
/********
* open favorites, note if not logged in nothing to show
*
*/
function mapFavorites(){
    if (platform === 2)
        var bounds = new plugin.google.maps.LatLngBounds();
    else
        var bounds = new google.maps.LatLngBounds();

    var id=null;
    $(".favorite-select").each(function(){
       id=$(this).attr('id');
       id=parseInt(id.replace('favorite_',''));
       console.log("MAP:"+id);
       var object=favorite_instance.favorites(id);
       var mapObject = createFavoriteMapObject(object);
       bounds.extend(mapObject.googlePosition);
    });
    if(id!==null){

            if (platform !== 2)
                map.fitBounds(bounds);
            else
                map.moveCamera({
                    'target': bounds
                }, function () {
                });
                createVenueList();
            }

}

function retrieveList() {
    var retval = ajaxListInvites();
    var headerHeight = $('#listInvites-text-header').css('height').replace(/\D/g, '');
    var footerHeight = $('#listInvites-text-footer').css('height').replace(/\D/g, '');
    var height = displayInfo.deviceHeight - parseInt(headerHeight) - parseInt(footerHeight) - 16;
    console.log('retrievin invites');
    $('#listInvites-container').css('height', height);
    retval.done(function (data, status) {
        var results = JSON.parse(data);
        var string = "";
        if (results.status === 'ok') {
            var rows = results.found;
            eventList = results.data[0];
            var date,time;
            for (var i = 0; i < rows; i++) {
                var row = eventList[i];
                //change for enterprise hcodes
                if(row[7]!=="0"){
                    date="";
                    time="";
                }else{
                    var d = moment(row[4]);
                    date = d.format('MMM DD');
                    time = d.format('LT');
                }
                string += "<tr id='listDetail"+ i +"'><td class='listInvite'>" + row[1] + "</td><td class='listInvite'>" + date + "</td><td class='listInvite'>" + time + "</td></tr>";
            }
            $('#listInviteBody').html(string);
            for (var i = 0; i < rows; i++) {
                $('#listDetail'+i).on('click',{number: i},function(event){
                    listDetail(event.data.number);
                });
            }
            $('#listInviteBody').trigger('create');
        }
    });
}
function listDetail(data) {
    console.log(eventList[data]);
    var row = eventList[data];
    var eventInformation = [];
    eventInformation.looltype = row[7];
    eventInformation.name = row[1];//Details.=eventList[data];
    eventInformation.address = row[3];
    eventInformation.description = row[2];
    eventInformation.eventTime = row[4];
    eventInformation.endTime = row[5];
    eventInformation.expirationTime = row[6];
    eventInformation.inviteCode = row[0];
    eventInformation.lat = row[8];
    eventInformation.lng = row[9];
    /*
     event.name=row[1];
     event.description=row[2];
     inviteCode=row[0];
     event.eventTime=row[4];
     event.expirationTime=row[5];
     event.address=row[3];
     */
    inviteCode = row[0];
    displayInfo.event = eventInformation;
    $('#listInviteLocation').text(eventInformation.name);
    if(eventInformation.description===""||eventInformation.description===null)
        $('#listDescriptionDiv').hide();
    else
        $('#listDescriptionDiv').show();
    if(eventInformation.looltype!=="0")
        $('#listInviteTimeBlock').hide();
    else
        $('#listInviteTimeBlock').show();
    $('#listInviteDescription').text(eventInformation.description);
    $('#listInviteAddress').text(eventInformation.address);
    $('#listInviteDate').text(moment(eventInformation.eventTime).format("ddd MMM Do YYYY h:mm A"));
    closeWindows('#listInviteData');
}
function mapEventLocation(){
    _handleInviteCode(displayInfo.event.inviteCode,startingLocation1.googlePosition);
//    var gposition = new google.maps.LatLng(eventInformation.lat,
//        eventInformation.lng);
//    var position=_setupStartingLocation2wPlaceObject(displayInfo.eventInformation,gposition);


}
//only used for plugin, called when plugin is ready
function onMapInit(map) {
	var timer=2000;
	if(displayInfo.derivedPlatform==="Android")
		timer=50;
 /*       else{

        } */
	setTimeout(function(){
		console.log("timed initialization:"+timer);
		_onMapInit(map);
	},timer);
}
function _onMapInit(map) {
    map.clear();
            if (displayInfo.detectedPlatform==='iPad') {
               var so = cordova.plugins.screenorientation;
               var old = screen.orientation;
               console.log("current orientation:"+old);
               if (old==='landscape') {
                   so.setOrientation('portrait');
               }else{
                   so.setOrientation('landscape');
               }
               setTimeout(function(){
                console.log("resetting orientation to:"+old);
                    so.setOrientation(old);
                },300);
            }
           checkMapClickOut();
    console.log('map plugin ready');
    var mapDiv = document.getElementById("googleMap");
    map.setDiv(mapDiv);
//                map.setClickable(false);
    setupMarkerBoxLink(); //this can only be called after the map is setup
    getCurrentLocalLocation(); //note that the mapmarkers might not be set at this point...

    panelSetup();
    console.log('map internal setup');
    map.on(plugin.google.maps.event.MAP_CLICK, function (latLng) {
		if(displayInfo.popupMenuDisplay===true){
        console.log('Map clicked');
                hmenu_instance.popupMenuCreate(hmenu_instance.popupMarkerMenuDefinitions, popupArray, latLng);
             }

    });

    GoogleMapDiv.append($('#yellowDrag'));
    GoogleMapDiv.append($('#uberpanel'));
    GoogleMapDiv.append($('#inviteStatusPage'));
    GoogleMapDiv.append($('#search-options-div'));
    GoogleMapDiv.append($('#types-div'));
    GoogleMapDiv.append($('#control-ui'));
    GoogleMapDiv.append($('#displayInviteData'));
//these might have to be moved if the display is not small <450/500 like on a tablet
//which would affect venue-ui
    GoogleMapDiv.append($('#route-ui'));
    GoogleMapDiv.append($(venueDetailsUi));
//does not work on iOS
    GoogleMapDiv.append($('#user-id-pages'));
    GoogleMapDiv.append($('#loginPage'));
    GoogleMapDiv.append($('#profilePage'));
    GoogleMapDiv.append($('#forgotPasswordPage'));
    GoogleMapDiv.append($('#registerPage'));
    GoogleMapDiv.append($('#validateEmailPage'));
    GoogleMapDiv.append($('#changePassword'));
    GoogleMapDiv.append($('#basePanel'));
    GoogleMapDiv.append($('#forgotUserId'));
    GoogleMapDiv.append($('#about'));
    GoogleMapDiv.append($('#where'));
    GoogleMapDiv.append($('#defaults'));
    GoogleMapDiv.append($('#bookmark-control'));
    /*
     if (displayInfo.narrow === true)
     $(venueUi).removeClass('map-control').addClass('map-control-transparent');
     else
     GoogleMapDiv.append($(venueUi));
     */
    GoogleMapDiv.append($('#invite-listing-ui'));
    GoogleMapDiv.append($('#event-ui'));

    GoogleMapDiv.append($('#hInviteCodeScreen'));
    GoogleMapDiv.append($("#listInvites"));
    GoogleMapDiv.append($("#listFavorites"));
    GoogleMapDiv.append($("#listInviteData"));
    GoogleMapDiv.append($("#bookmark-container"));
    GoogleMapDiv.prepend($('#inviteCodePage'));
    GoogleMapDiv.append($("#miniPanel"));
    GoogleMapDiv.append($("#freeform-search-div"));
    GoogleMapDiv.append($("#popupWrapper"));
    $("#popupWrapper").popup();
    var pac_holder=document.createElement("div");
    pac_holder.id="pac_holder";

    GoogleMapDiv.append($("#pac_holder"));
    mapProp.center = convert2latLng(displayInfo.currentLocation);//lastKnownLocation;
    gmap = new google.maps.Map(document.getElementById('unMap', mapProp));
    zoomMarkerAt(lastKnownLocation, 14);
    map.setZoom(14);

    $('#about').on("panelbeforeopen", function () {
        console.log('changing map click to false');
        map.setClickable(false);
    });
    $('#about').on("panelbeforeclose", function () {
        console.log('changing map click to true');
        map.setClickable(true);
    });
    $('#popupMessage').on("popupbeforeposition", function () {
        console.log('changing map click to false popup');
        map.setClickable(false);
    });
    $('#popupMessage').on("popupafterclose", function () {
        console.log('changing map click to true popup');
        map.setClickable(true);
    });
    //this is to remove hover on iOS (will do android too)
    if ('createTouch' in document)
    {
        try
        {
            var ignore = /:hover/;
            for (var i = 0; i < document.styleSheets.length; i++)
            {
                var sheet = document.styleSheets[i];
                for (var j = sheet.cssRules.length - 1; j >= 0; j--)
                {
                    var rule = sheet.cssRules[j];
                    if (rule.type === CSSRule.STYLE_RULE && ignore.test(rule.selectorText))
                    {
                        sheet.deleteRule(j);
                    }
                }
            }
        }
        catch (e) {
        }

    }
    if (displayInfo.derivedPlatform !== "Android") {
        $('#system-menu').show();
    }
    $("#fb_like").hide();
    //ImgCache.init(function(){
    //    ImgCache.clearCache();
    //    console.log('ImgCache init: success');
    //}, function(){
    //    console.log('ImgCache init: error');
    //})

}
function appInitializePanel(){
    //
    $('#firstImage').click(function(){
        zoomStart();
    });
    $('#secondImage').click(function(){
        zoomDest();});
    //$('#mainPanelTurn').click(('click',turnByTurn());

    $('#moreGoogleMain').click(function(){
        moreGoogle();});
    $('#miniPanelOpen').click(function(){
        openMainPanel('#mainPanel');
    });

    $('#typesDivSaveReturn').click(function(){
        saveAndReturn();});
    $('#typesDivSave').click(function(){
        searchAndClose();});

    $('#routeClose').click(function(){
        closeWindowsReset();});
    $('#routeNavigate').click(function(){
        routeNavigate();});

    $('#venueSearchClose').click(function(){
        updateSearchValuesAndClose();});
    $('#venue-dismiss').click(function(){
        closeWindowsReset();});

    $('#inviteClose').click(function(){
        closeWindowsReset();});

    $('#eventClose').click(function(){
        closeWindowsReset();});
    $('#eventOpenVenueDetails').click(function(){
        closeWindows("#venue-details-ui");
    });

    $('#reset').click(function(){
        resetMapItems();});
    $('#nextClusterButton').click(function(){
        nextCluster();});
    $('#prevClusterButton').click(function(){
        prevCluster();});
    $('#mainResetButton').click(function(){
        resetMapItems();
    });


    //main panel buttons
    $('#system-menu').click(function(){
       menubutton(this);
    });
    $('#travel-mode-popup-menu').click(function(){
        displayTravelPopupMenu();
    });
    $('#bike-pop').click(function(){
        selectTravelMode('BICYCLING');
    });
    $('#walk-pop').click(function(){
        selectTravelMode('WALKING');
    });
    $('#transit-pop').click(function(){
        selectTravelMode('TRANSIT');
    });
    $('#drive-pop').click(function(){
        selectTravelMode('DRIVING');
    });

    //event panel
    $('#eventLoginButton').click(function(){
        inviteLogin();
    });
    $('#createEventButton').click(function(){
        closeEventDetails();
    });
    $('#venue-details-close-event').click(function(){
        closeWindows(venueUi);
    });
    $('#venue-details-create-event').click(function(){
        createEventDetails();
    });

    $('#venue-details-venue-navigate').click(function(){
        callVenueNavigate();
    });
    $('#venue-details-close').click(function(){
        closeWindowsReset();
    });
    $('#hInviteCodeScreenClose').click(function(){
        closeWindowsReset();
    });
    $('#inviteCode').keyup(function(event){
        inviteCodeCheckEnterKey(event);
    });
    $('#hInviteCodeHandleInvite').click(function(){
        handleInviteCode();
    });
    $('#displayInvite-turn-by-turn').click(function(){
        turnByTurn();
    });
    $('#displayInvite-save-calendar').click(function(){
        saveToCalendar();
    });
    $('#displayInvite-clear-invite').click(function(){
        clearInvite();
    });
    $('#displayInvite-close-window').click(function(){
        closeWindowsReset();
    });
    $('#inviteCodeSharing').click(function(){
        sharing();
    });
    $('#inviteCodeNavigate').click(function(){
        sharingNavigate();
    });
    $('#inviteCodeCalendar').click(function(){
        saveToCalendar();
    });
    $('#login-forgot-userid').click(function(){
        closeWindows('#forgotUserId');
    });
    $('#login-forgot-password').click(function(){
        closeWindows('#forgotPasswordPage');
    });
    $('#login-register').click(function(){
        closeWindows('#registerPage');
    });
    $('#login-main-panel').click(function(){
        openMainPanel('#mainPanel');
    });
    $('#login-user-form').click(function(){
        loginUserForm();
    });
    $('#profilePage-change-password').click(function(){
        closeWindows('#changePassword');
    });
    $('#profilePage-main-panel').click(function(){
        openMainPanel('#mainPanel');
    });
    $('#forgotUserIdQuery').click(function(){
        forgotUserid();
    });
    $('#forgotUserIdMain').click(function(){
        openMainPanel('#mainPanel');
    });
    $('#forgotPasswordResetPassword').click(function(){
        resetPassword();
    });
    $('#forgotPasswordOpenMain').click(function(){
        openMainPanel('#mainPanel');
    });
    $('#registerPage-create-profile').click(function(){
        createProfile();
    });
    $('#registerPage-open-main').click(function(){
        openMainPanel('#mainPanel');
    });
    $('#popupClose').click(function(){
        closePopup();
    });
    $('#validateEmail-resend-validation-email').click(function(){
        resendValidationEmail();
    });
    $('#validateEmail-main-panel').click(function(){
        openMainPanel('#mainPanel');
    });
    $('#changePassword-update-password').click(function(){
        updatePassword();
    });
    $('#changePassword-main-panel').click(function(){
        openMainPanel('#mainPanel');
    });
    $('#listInvites-close-window').click(function(){
        closeWindowsReset();
    });
    $('#listFavorites-close-window').click(function(){
        closeWindowsReset();
    });
    $('#listFavorites-mapFavorites').click(function(){
        mapFavorites();
    });

    $('#list_favorite_button').click(function(){
        closeWindows('#listFavorites');
    });
    $('#close_favorite_button').click(function(){
        closeWindowsReset();
    });
    $('#inviteCode-close-window').click(function(){
        closeWindowsReset();
    });
    $('#inviteStatus-close-window').click(function(){
        closeWindowsReset();
    });

    $('#listInviteData-sharing').click(function(){
        sharing();
    });
    $('#listInviteSaveCalendar').click(function(){
        saveToCalendar();
    });
    $('#listInviteOpenWindowListInvites').click(function(){
        closeWindows('#listInvites');
    });
    $('#listInviteMapLocation').click(function(){
        mapEventLocation();
    });
    $('#login-panel-item').click(function(){
        panelAction('login');
    });
    $('#profile-panel-item').click(function(){
        panelAction('profile');
    });
    $('#list-panel-item').click(function(){
        panelAction('list');
    });
    $('#list-panel-defaults').click(function(){
        panelAction('defaults');
    });
    $('#basePanelHandleInvite').click(function(){
        panelAction('open-invite');
    });
    $('#logout-panel-item').click(function(){
        panelAction('logout');
    });
    $('#exit-panel-item').click(function(){
        panelAction('exit');
    });
    $('#defaults-close-window').click(function(){
        closeWindowsReset();
    });
    $('#freeform-close-window').click(function(){
        closeWindowsReset();
    });
    $('#about-panel-item').click(function(){
        panelAction('about');
    });
    $('#about-close-window').click(function(){
        closeWindowsReset();
    });

    $('#downloadApp-dismiss').click(function(){
        dismiss_download();
    });
}
function basepanelListenerInitialize(){
    if(displayInfo.basePanelInit)
        return;
    else displayInfo.basePanelInit=true;
    $('#basePanel').on("panelbeforeopen", function () {
        console.log('changing map click to false basepanel');
        if(platform===2)
            map.setClickable(false);
    });
    $('#basePanel').on("panelbeforeclose", function () {
        console.log('changing map click to true basepanel');
        setTimeout(function(){
            if(displayInfo.currentDisplayDiv===""|| displayInfo.currentDisplayDiv===undefined)
                closeWindowsReset();

        },500);
        if(platform===2)
            map.setClickable(true);
    });
}
function initialize()
{

if(platform!==2)
    $('#splashscreen').css('position','absolute').css('background-size','cover').css('height','100%').css('width','100%').show();
    moment().format();
    moment.locale('en');
    displayInfo.initilization = 1;
    displayInfo.locationRetrieved = 0;
    //device information is available when cordova is setup
    deviceInformation();
    //note that this does not always return Android
    $('#startInput2').val('');
    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    //app=null;//this will turn on or off android routines on mobile
    console.log('path:' + window.location.pathname);
    if (app) {
        // PhoneGap application
        platform = 2;
        try {
            displayInfo.currentLocation = new plugin.google.maps.LatLng(_lat, _lng);
        } catch (err) {
            console.log('Error initialization');
            console.log(err);
            alert('Error initializing map module, app must exit.' + err);
            navigator.app.exitApp();
        }
        lastKnownLocation = convert2latLng(displayInfo.currentLocation);
    } else {
        // Web page
        platform = 0;
    }
    detectBrowser();
    processPlatform();
    if(platform===0 && (displayInfo.derivedOS==='iOS'||displayInfo.derivedOS==='Android')) {
        handleWebDownload();

    } else { //for desktop browser and app, don't display the downlaods
        $("#googlePlay").hide();
        $("#googlePlay2").hide();
        $("#appleApp").hide();
        $("#appleApp2").hide();
        if(platform!==2){
            console.log("added tooltip*************")
            $('.tooltip').tooltipster({ timer: 1000});
        }
    }

    console.log('Platform:[' + displayInfo.derivedPlatform + ']');
    displayInfo.pixelRatio = 1;
    if (displayInfo.derivedPlatform === 'iOS')
        setupiOS();
    if (displayInfo.derivedPlatform === 'Android')
        setupAndroid();
    if (displayInfo.derivedPlatform === 'iOS' && displayInfo.version >= 7.0) {
        displayInfo.statusBar = true;
        displayInfo.gmapTop = 20;
        console.log('offset gmaptop');
    }
    else {
        displayInfo.gmapTop = 0;
        console.log('gmaptop normal');
    }
    $('.map-control').css('top', displayInfo.gmapTop + 'px');
    if (displayInfo.derivedPlatform === "Android") {
        console.log("moving to portrait");
        screen.lockOrientation("portrait");
    }
    //platformMarkers are the A+B
    platformMarkers = true;
    //platform=0;
    console.log('initialize called, platform is:' + platform + ':' + displayInfo.currentLocation + 'platform' + platformMarkers);
    infowindow = new google.maps.InfoWindow();
    mapInitialize();
    if (window.StatusBar) {
        console.log('status bar installed');
        displayInfo.statusbar = true;
    } else {
        displayInfo.statusbar = false;
    }
    /***
     * if these are!=null then the options for the panel is different
     * there will be no login option, however the user may
     *
     * see profile
     * set defaults (search radius, default zipcode)
     * change password
     * logout
     *
     * reset map
     * login
     */


    loadStorage();
    defaultsLoad();
    if(displayInfo.favoriteProcessing===true)
    	favoritesLoad();
    console.log('User Id[' + displayInfo.userId + ']');
    //this should check to make sure token and selector are valid
    //if not then the token and selector should be invalidated
    panelLoggedOutOptions();//default logged out
    if (displayInfo.selector !== null && displayInfo.selector !== 'null') {
        var retvar = validateUser(displayInfo.selector, displayInfo.token);
        retvar.done(function (data, status) {
            var response = JSON.parse(data);
            console.log('validateUser response ' + response.status);
            if (response.status === 'ok') {
                panelLoggedInOptions();
            } else {
                displayInfo.selector = null;
                panelLoggedOutOptions();
            }

        });

    } else {
        panelLoggedOutOptions();
    }
    displayInfo.autologin = localStorage.getItem('autologin');
    console.log(displayInfo.selector + ':' + displayInfo.token);

    if (displayInfo.derivedPlatform === "Android") {
        screen.unlockOrientation("portrait");
    }
    //checkFileSystem();
    //function to remove the focus from a button note that ui-btn-active will affect
    //radiobutton default settings
    jQuery(function ($) {
        $(document).on('click', '.ui-btn', function () {
            //$('.ui-btn-active').removeClass('ui-btn-active ui-focus');
            $('.ui-focus').removeClass('ui-focus');
        });
    });
    displayInfo.venueUiDiv = $("#venue-ui-container");
//http://stackoverflow.com/questions/1131760/unwanted-flickering-effect-when-using-hide-and-show-in-jquery
//http://stackoverflow.com/questions/18223750/show-hide-not-working-in-firefox-yet-working-in-all-other-browsers
    var timer=setTimeout(function(){
    $('#splashscreen').fadeOut(600, function(){
        $('#content').show(function(){
            if(platform===2)
                map.refreshLayout();
            else
                google.maps.event.trigger(map, 'resize');
            map.setCenter(startingLocation1.googlePosition);
            console.log('splashscreen closed');
        });
        });
    },4000);

    console.log('splashscreen start');
}
function checkFileSystem() {
    openPDF("loolmapsTOS.pdf");
}
/********************************
 * The PDF file will always be downloaded, even if it exists, so that the latest
 * version is displayed (there is no other way to know, unless the date is
 * compared but that is inaccurate).  It must be assumed that the latest version
 * is on www.hiamaps.com/legal
 *
 * On Android, we cannot just open up www.hiamaps.com/legal as that will
 * assumingly open up hiamaps.
 *
 * @param {type} filepath -path to file
 * @param {type} filename
 * @returns {undefined}
 */
function pdfOpen(filepath, filename) {
    console.log("opening " + filename);
    if (displayInfo.platform === "Android") {
        //iOS documentsDirectory
        //android dataDirectory
        //var destination=cordova.file.dataDirectory+filename;
        //var destination=cordova.file.cacheDirectory+filename;
        var destination = cordova.file.externalApplicationStorageDirectory + filename;
        findFile(destination, filename);
    } else {
        window.open(filepath, '_system');//,'location=yes,closebuttoncaption=Close,enableViewportScale=yes');
    }


}
/************
 * try to open the file, if not then download it and open it
 * only necessary on android and maybe iOS.  Note that the file
 * should be downloaded to make sure that it is the latest.
 *
 * @param {type} filepath
 * @param {type} filename
 */
function findFile(filepath, filename) {
    console.log('filepath:' + filepath);

    var fileTransfer = new FileTransfer();
    var source = encodeURI("https://www.hiamaps.com/legal/" + filename);
    fileTransfer.download(
            source,
            filepath,
            function (entry) {
                console.log("download complete");
                //	window.open(entry.toURL(),'_system');
                window.plugins.fileOpener.open(filepath);
            },
            function (error) {
                console.log("source [" + error.source + "]");
                console.log("target [" + error.target + "]");
                console.log("download error" + error.code);
            },
            true,
            null
            );
}
var whereTimer;
function whereAmIStart() {
    whereTimer = setInterval(function () {
        whereLocation();
    }, 1500);
}
function whereAmIStop() {
    clearInterval(whereTimer);
    closeWindows("#mainPanel");
}
function whereLocation() {
    var retval;
    if (platform === 2) {
        retval = map.getMyLocation({enableHighAccuracy: true}, getWhereLocation, whereLocationError);
    } else {
        retval = navigator.geolocation.getCurrentPosition(getWhereLocation, whereLocationError, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 1000
        });
    }
    return retval;
}
function updateWhere() {
    startingLocation1.googlePosition = where.location;
    if (platform === 2)
        startingLocation1.position = convert2pluglatLng(where.location);
    else
        startingLocation1.position = where.location;
    startingLocation1.setPosition(startingLocation1.position);
}
function getWhereLocation(position) {
    var latitude, longitude, altitude, accuracy;
    if (position.provider === 'network' || position.provider === 'gps' || position.provider === 'fused') {
        latitude = position.latLng.lat;
        longitude = position.latLng.lng;
        altitude = position.altitude;
        accuracy = position.accuracy;
    } else {
        if (platform === 2) {
            if (position.latLng === undefined) {
                console.log('position not defined, location not retrieved');
            } else {
                latitude = position.latLng.lat;
                longitude = position.latLng.lng;
                altitude = position.altitude;
                accuracy = position.accuracy;
            }
        } else {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            if (position.coords.altitude === null || position.coords.altitude === undefined)
                altitude = "No Data";
            else
                altitude = position.coords.altitude;
            accuracy = "No Data";
        }
    }
    console.log("current" + latitude + ":" + longitude + ":" + altitude);
    var item = [];
    where.location = new google.maps.LatLng(latitude, longitude);
    where.latitude = latitude;
    where.longitude = longitude;
    where.altitude = altitude;
    where.accuracy = accuracy;
    where.datetime = new Date();//use moment
    $("#where-lat").val(latitude);
    $("#where-lng").val(longitude);
    $("#where-alt").val(altitude);
    $("#where-acc").val(accuracy);
}
function whereLocationError(error) {
    console.log("Where location error:" + error);
}
//saves the data into local storage
function bookmarkWhere() {
    var string = JSON.stringify(where);
    localStorage.setItem('whereBookmark', string);
}
//this will setup the bookmark pin
//code from powaintMarkerObject
function bookmarkDropPin(icon) {
    var image = icon;//pointed to bookmark previously
    var position;
    if (platform === 2)
        position = convert2pluglatLng(where.location);
    else
        position = where.location;
    if (bookmarkObject === null) {
        bookmarkObject = new powaintMarkerObject(null, where.location, image, null, searchBox1, 'P');

        if (platform === 2) {
            var value = {
                draggable: false,//no longer draggable
                position: position,
                //possible values DROP, BOUNCE to stop bouncing set to null
                icon: image,
                //anchor: [0.0,56.0],
                animation: null//how about drop?
            };

            function _bookmarkDropPin(bookmarkObject, value) {
                map.addMarker(value, function (marker) {
                    marker.setIconAnchor(0.0, 56.0);
                    bookmarkObject.marker = marker;
                    marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function (marker) {
                        closeWindows("#bookmark-container");
                    });
                });
            }
            _bookmarkDropPin(bookmarkObject, value);
        } else {
            var image1 = {
                url: image,
                anchor: new google.maps.Point(0, 56)
            };
            var value = {
                draggable: false,
                position: position,
                //possible values DROP, BOUNCE to stop bouncing set to null
                icon: image1,
                animation: null//how about drop?
            };

            bookmarkObject.marker = new google.maps.Marker(value); // end setup marker
            bookmarkObject.marker.setMap(map); //moved from panelSetup()
            google.maps.event.addListener(bookmarkObject.marker, 'click', function (evt)
            {
                closeWindows("#bookmark-container");
            });
        }
    } else {
        bookmarkObject.setPosition(position);
    }
}
/****
 * remove the marker
 */
function bookmarkClear() {
    if (platform === 2) {
        bookmarkObject.marker.remove();
    } else {
        bookmarkObject.marker.setMap(null);
    }
    bookmarkObject = null;
    closeWindowsReset();
    //closeWindows();
}
function bookmarkSetup() {
    if (platform === 2) {
        where.location = convert2latLng(displayInfo.popupMenuPosition);
    } else {
        where.location = displayInfo.popupMenuPosition;
    }
    where.latitude = where.location.lat();
    where.longitude = where.location.lng();
    where.datetime = "";
    where.altitude = 0;
    where.accuracy = 0;
}
function bookmarkSave() {
    where.datetime = new Date();
    var string = JSON.stringify(where);
    localStorage.setItem('whereBookmark', string);
    console.log('bookmark saved');
}
function updateBookmarkContainer() {
    var object = bookmarkCheck();
    if (object && object.location)
        $('#book-message').text("You have a bookmark saved on " + moment(object.datetime).format("ddd MMM Do YYYY h:mm A"));
    _updateBookmarkContainer();
    bookmarkDropPin();
}
function _updateBookmarkContainer() {
    var date;
    if (where.datetime)
        date = moment(where.datetime).format("ddd MMM Do YYYY h:mm A");
    else
        date = "";
    $('#book-date').text(date);
    $('#book-lat').val(where.latitude);
    $('#book-lng').val(where.longitude);
    updateSearchBox(new google.maps.LatLng(where.latitude, where.longitude), $('#book-address'));
}
function bookmarkCheck() {
    var string = localStorage.getItem('whereBookmark');
    object = JSON.parse(string);
    return object;
}
function bookmarkNavigate() {
    bookmarkClear();
    startingLocation2.googlePosition = where.location;
    if (platform === 2)
        startingLocation2.position = convert2pluglatLng(where.location);
    else
        startingLocation2.position = where.location;
    startingLocation2.setVisible(true);
    startingLocation2.setPosition(startingLocation2.position, true);
    //navigate();
}
function bookmarkLoolEvent() {
    displayInfo.eventLocationId = null;
    eventObject.name = "Bookmarked location";
    eventObject.formatted_address = $('#book-address').text();
    eventObject.geometry = {};
    eventObject.geometry.location = where.location;
    createEventDetails(eventObject);
}
function bookmarkLoad() {
    var string = localStorage.getItem('whereBookmark');
    if (string === null || string === undefined) {
        where.location = null;
        where.latitude = null;
        where.longitude = null;
        where.datetime = null;
        return;
    }
    var position;
    where = JSON.parse(string);
    where.location = new google.maps.LatLng(where.latitude, where.longitude);
    if (platform === 2) {
        position = convert2pluglatLng(where.location);
    } else {
        position = where.location;
    }
    bookmarkObject.location = position;
    bookmarkObject.setPosition(position);
    zoomMarker(where.location);
    //map.setCenter(position);
    updateBookmarkContainer();
    console.log('bookmark loaded');
}
function bookmarkGo() {
    whereAmIStop();
    var string = localStorage.getItem('whereBookmark');
    var location = JSON.parse(string);
    var gpos = new google.maps.LatLng(location.latitude, location.longitude);
    if (platform === 2)
        var position = new plugin.google.maps.LatLng(location.latitude, location.longitude);
    else
        var position = gpos;
    updateSearchBox(position,"#startInput2");
    startingLocation2.setVisible(true);
    startingLocation2.setPosition(position,true,true);
    displayInfo.retrievedStartingLocation = 1;
    displayInfo.eventInformation = {};
    displayInfo.eventInformation.status = 1;
    //_handleSetupStartingLocation2(position);
}
function saveStorage() {
    localStorage.setItem('selector', displayInfo.selector);
    localStorage.setItem('token', displayInfo.token);
    localStorage.setItem('userId', displayInfo.userId);
}
function loadStorage() {
    displayInfo.token = localStorage.getItem('token');
    displayInfo.selector = localStorage.getItem('selector');
    displayInfo.userId = localStorage.getItem('userId');
}
function processPlatform() {
    displayInfo.derivedPlatform = null;
    console.log('device:' + displayInfo.platform + ' navigator:' + navigator.platform);
    //another check would be if there is webkit
    if (displayInfo.platform === null)
        displayInfo.platform = "";
    var string = navigator.platform.toLowerCase();
    var pos = string.indexOf('linux');
    console.log('POS' + pos);
    if (displayInfo.platform === "Android" || (platform === 2 && pos >= 0)){
        displayInfo.derivedPlatform = "Android";
        displayInfo.derivedOS="Android";
    }
    if(pos>=0 && navigator.platform.indexOf("armv71")){
        if(platform===2){
            displayInfo.derivedPlatform="Android";
            displayInfo.derivedOS="Android";
        }else{
            displayInfo.derivedPlatform="browser";
            displayInfo.derivedOS="Android";
        }

    }
    if (displayInfo.platform === 'iOS' || navigator.platform.indexOf("iPad") >= 0 || navigator.platform.indexOf("iPhone") >= 0) {
        if(platform===2){
            displayInfo.derivedPlatform = "iOS";
            displayInfo.derivedOS="iOS";
        }else{
            displayInfo.derivedPlatform = "browser";
            displayInfo.derivedOS="iOS";
        }

    }
    if (displayInfo.derivedPlatform === null && platform === 0) {
        displayInfo.derivedPlatform = "browser";
    }
}
/*******
 * this uses cordova device to determine the platform information.
 * We also look at the browser detectBrowser() for information.
 * Note that it sometimes will return null for the platform.
 *
 * @returns {undefined}
 */
function deviceInformation() {
    try {
        if (device) {
            displayInfo.cordova = device.cordova;
            displayInfo.model = device.model;
            displayInfo.platform = device.platform;//concern is iOS
            displayInfo.version = parseFloat(device.version);//and version >=7.0
        }
    } catch (error) {
        console.log('cordova device not installed');
    }

}
function checkMapClickOut() {
    if (platform === 2) {
        console.log('checkMapClickOut true');
        map.setClickable(true);
    }
}
function checkMapClickIn() {
    if (platform === 2) {
        console.log('checkMapClickIn false');
        map.setClickable(false);
    }
}
/******
 * because of the callbacks that is necessary inthe app version, closeWindows()
 * can return before it finished processing.  We must wait until the flag is
 * set to false before we open the panel.
 *
 * @param {type} object
 */
function menubutton(object) {
    var retval=closeWindows();
    retval.done(function(){
        $('#basePanel').panel("toggle");
        basepanelListenerInitialize();
    });
    /*
     var timer = setInterval(function () {
        console.log('window processing');

        if (displayInfo.windowProcessing === false && displayInfo.mapHandling=== false) {
            clearInterval(timer);

            $('#basePanel').panel("toggle");
            basepanelListenerInitialize();
            //retrieveList();
        }
    }, 500);
*/
}
function fitMapMarkers() {
    console.log("called fitMapMarkers()");
     if (platform === 2)
        var bounds = new plugin.google.maps.LatLngBounds();
    else
        var bounds = new google.maps.LatLngBounds();
    if (startingLocation1.googlePosition !== null && startingLocation2.googlePosition !== null) {
            console.log('Navigation not set, setting bounds');
            bounds.extend(startingLocation1.position);
            bounds.extend(startingLocation2.position);
            if (platform !== 2)
                map.fitBounds(bounds);
            else
                map.moveCamera({
                    'target': bounds
                }, function () {
                });
    } else if (startingLocation1.googlePosition !== null){
            zoomMarker(startingLocation1.googlePosition);
            //map.setCenter(startingLocation1.position);
    }else {//(startingLocation2.googlePosition !== null)
            zoomMarker(startingLocation2.googlePosition);
            //map.setCenter(startingLocation2.position);
    }
    return;
}
/****************************
 * This is called when the app/website starts up whenever the map has to change size
 * handles the 'proper' sizes for the map by calculating what is open and what is left for the map.
 *
 * In portrait mode, the map can be shrunk in height to make sure that everything is dispilayed.
 * In landscape mode the map should be clipped at the edge of large panels (venue-ui, route-ui, venue-details)
 *
 *
 * @returns {undefined}*
 */
var globalMapTimer;

function handleMapSize(){
    var retval= $.Deferred();
        displayInfo.mapHandling=true;
	console.log("called handleMapSize()"+Date());
	clearTimeout(globalMapTimer);
	globalMapTimer=setTimeout( function(){_handleMapSize(retval);},300);
        return retval;
}
function _handleMapSize(deferredObject) {

    console.log('handle map size:current div' + displayInfo.currentDisplayDiv+':'+Date());
	//this part must be more integrated
    if(displayInfo.windowedMode===true){
		var parent=GoogleMapDiv.parent();
		var height=parent.css('height').replace(/\D/g,'');
		var width=parent.css('width').replace(/\D/g,'');
		GoogleMapDiv.css("position","relative");
		GoogleMapDiv.css("top","0px");
		GoogleMapDiv.css("right","0px");
		GoogleMapDiv.css("float","right");
		//this shouldn't be hardcoded but for afrikelist it has to.
		GoogleMapDiv.css("height",height);//581px
		GoogleMapDiv.css("width",width);//728px
		displayInfo.deviceHeight=height;
		displayInfo.deviceWidth=width;
		google.maps.event.trigger(map,'resize')
	}

    //if (displayInfo.currentDisplayDiv) {

        /* note that if the app is started automatically without the screen being
         * that the css height and width will be 0
         *
         */
        var height,width;


        if (displayInfo.currentDisplayDiv === "#mainPanel") {
            height = parseInt($('#uberpanel').css('height').replace(/\D/g, ''));
            width = parseInt($('#uberpanel').css('width').replace(/\D/g, ''));
        }
        if (!displayInfo.currentDisplayDiv || displayInfo.currentDisplayDiv === undefined) {
            height = 0;//displayInfo.deviceHeight;
            width = 0;//displayInfo.deviceWidth;
        }
        else {
		try {
            height = parseInt($(displayInfo.currentDisplayDiv).css('height').replace(/\D/g, ''));
            width = parseInt($(displayInfo.currentDisplayDiv).css('width').replace(/\D/g, ''));
		} catch (ex){
			console.log('exception '+ex);
			height=0;
			width=0;
		}
        }
        console.log('height '+height+' width:'+width);
        var calculatedHeight = displayInfo.deviceHeight - height;
        var calculatedWidth = displayInfo.deviceWidth - width;
        if(calculatedWidth !== displayInfo.deviceWidth){
            displayInfo.mapDisplay=true;//code
            displayInfo.saveCenter=displayInfo.mapCenter;
        }else{
            displayInfo.mapDisplay=false;
        }
        /*
        if (calculatedHeight < 25 || (calculatedWidth===0 && !displayInfo.narrow)) {
		if(displayInfo.mapDisplay===true){
            console.log("map closing, saving info["+calculatedHeight+"]["+calculatedWidth+"]");
            displayInfo.mapDisplay=false;//code
            displayInfo.saveCenter=displayInfo.mapCenter;
	    displayInfo.saveZoom=displayInfo.zoom;
		}
        }*/
        console.log('calculated map height:' + calculatedHeight + ' offset:' + height);
    if(displayInfo.windowedMode===true){
		var parent=GoogleMapDiv.parent();
		var height=parent.css('height').replace(/\D/g,'');
		var width=parent.css('width').replace(/\D/g,'');
		GoogleMapDiv.css("position","relative");
		GoogleMapDiv.css("top","0px");
		GoogleMapDiv.css("left","0px");
		//this shouldn't be hardcoded but for afrikelist it has to.
		GoogleMapDiv.css("height",displayInfo.deviceHeight);//581px
		GoogleMapDiv.css("width",calculatedWidth);//728px
		displayInfo.deviceHeight=height;
		displayInfo.deviceWidth=width;
		google.maps.event.trigger(map,'resize')
	}else

        if (displayInfo.portrait === true) {
            //narrow mode screen will be smaller than the device screen size
            if (displayInfo.movedGoogleMap === true) {
                //the map is being restored to the full size
                GoogleMapDiv.css('position', 'relative');
                GoogleMapDiv.css('float', false);
                GoogleMapDiv.css('top', '0px');
                GoogleMapDiv.css('left', '0px');
                GoogleMapDiv.css('height', displayInfo.gmapHeight);//displayInfo.deviceHeight);
                GoogleMapDiv.css('width', displayInfo.gmapWidth);//displayInfo.deviceWidth);
                //this toggling is causing problems
                //displayInfo.movedGoogleMap = false;
            } else if (displayInfo.narrow) {
                GoogleMapDiv.css('width', displayInfo.deviceWidth);
                GoogleMapDiv.css('position', 'fixed');
                GoogleMapDiv.css('top', height + 'px');
                GoogleMapDiv.css('height', calculatedHeight);
            } else {
                GoogleMapDiv.css('width', displayInfo.deviceWidth);
                GoogleMapDiv.css('position', 'fixed');
                GoogleMapDiv.css('top', '0px');
                GoogleMapDiv.css('height', displayInfo.deviceHeight);
            }

            //map.setDebuggable(true);
        }//non narrow mode
        else {
            GoogleMapDiv.css('position', 'fixed');
            GoogleMapDiv.css('top', '0px');
            GoogleMapDiv.css('right', '0px');
            GoogleMapDiv.css('left', '');
            //we will always move the map so that it abuts the open panel if that is
            //full height
            if (height >= (displayInfo.deviceHeight - displayInfo.gmapTop)) {
//if in landscape mode and the height==displayInfo.deviceHeight, then set the width to
                GoogleMapDiv.css('height', displayInfo.deviceHeight);
                GoogleMapDiv.css('width', calculatedWidth);
            } else {
                GoogleMapDiv.css('height', displayInfo.deviceHeight);
                GoogleMapDiv.css('width', displayInfo.deviceWidth);
            }
        }
        /*if(displayInfo.mapDisplay===true){
            map.setCenter(displayInfo.saveCenter);
            displayInfo.mapDisplay=false;
        }*/
        /*
        if (calculatedHeight>25 && !(calculatedWidth!==0 && displayInfo.narrow) ) {
		console.log("Restore check triggered");
            if (displayInfo.mapDisplay===false) {
                displayInfo.mapDisplay=true;
                if (displayInfo.resetMapDisplay) {
                    //code

                console.log("Restoring map location and zoom"+displayInfo.zoom);
                fitMapMarkers();
                displayInfo.resetMapDisplay=false;
                }
            }
        }else{
            displayInfo.resetMapDisplay=false;
        }
    */
        // note display googleMaps causes widows not to display
    // in all cases reset the map depending on platform
    if (platform === 2) {
        //map.setDebuggable(true);
        map.setDiv(GoogleMapDiv[0]);
        map.refreshLayout();
        console.log('map handler map refresh');
    } else {
        google.maps.event.trigger(map, 'resize');
        if (displayInfo.bounds !== null) {
            map.fitBounds(displayInfo.bounds);
            displayInfo.bounds = null;
        }
    }
    displayInfo.mapHandling=false;
    deferredObject.resolve();
}
function onDeviceReady() {
    document.addEventListener("backbutton", androidBackKeyEvent, false);
    // Initial execution if needed
    //document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("menubutton", menubutton, false);
    //document.addEventListener("menubutton", checkFileSystem, false);
    //for testing in Chrome browser uncomment
    google.maps.event.addDomListener(window, 'load', initialize);
}
/****************************
 * Called when the app starts to get the screen size
 *
 *
 *
 * @returns {undefined}*
 */
//should check the device width and height and adjust window sizes accordingly
function doOnOrientationChange() {
    var dWidth, dHeight;
    var ewidth, eheight;
    console.log('orientation change called');
	if(displayInfo.windowedMode===true){
            eWidth = dWidth = displayInfo.deviceWidth;
            eHeight = dHeight = displayInfo.deviceHeight;
//came from below
    $(venueDetailsUi).css('max-height', eheight);
    $('.scrollableWindow').css('max-height', eheight);
    $(venueDetailsUi).css('height', eheight + 'px');
    $(venueUi).css('height', eheight + 'px');
    $('#route-ui').css('height', eheight + 'px');
        //shouldn't be done in windowedmode
    //$('#control-div').css('width', ewidth + 'px');
		}else{
    console.log('window orientation:'+window.orientation);
    switch (window.orientation)
    {
        case -90:
        case 90://landscape mode
            dWidth = window.screen.availWidth;
            dHeight = window.screen.availHeight;
            ewidth = $(window).width();
            eheight = $(window).height();
            console.log('displayInfo.portrait window size (h:w):' + eheight + ':' + ewidth + '(h:w)' + dHeight + ':' + dWidth + " inner height:" + window.innerHeight + " inner width:" + window.innerWidth + 'device pixel ratio' + window.devicePixelRatio);
            var string = "platform:["+displayInfo.derivedPlatform+"]["+displayInfo.derivedOS+"]";
            $('#dpi').val(string);
            if (displayInfo.gmapTop > 0) {
                eheight = dHeight + displayInfo.gmapTop;
            }
            break;
        default://displayInfo.portrait mode
            dWidth = window.screen.availWidth;
            dHeight = window.screen.availHeight;
            ewidth = $(window).width();
            eheight = $(window).height();
            console.log('displayInfo.portrait window size (h:w):' + eheight + ':' + ewidth + '(h:w)' + dHeight + ':' + dWidth + " inner height:" + window.innerHeight + " inner width:" + window.innerWidth + 'device pixel ratio' + window.devicePixelRatio);
            var string = " innerheight:" + window.innerHeight + " inner width:" + window.innerWidth + 'device pixel ratio' + window.devicePixelRatio;
            var string = "platform:["+displayInfo.derivedPlatform+"]["+displayInfo.derivedOS+"]";
            $('#dpi').val(string);
            break;
    }
    if (displayInfo.statusbar === true)
        eheight -= 20;
	}
    if (eheight === 0 && ewidth === 0) {
        eheight = dHeight;
        ewidth = dWidth;
    }
    /* if the width of the screen is great enough then use the maximum width of 600
     * usually will happen in landscape mode or on tablets.  In that case, certain
     * screens will take up the entire height of the panel to handle the plugin
     * issue of clickability.
     * Because the width of the panels is 400, that gives a rather narrow viewing
     *
     */
    if (ewidth > 600) {
        displayInfo.narrow = false;
        //specific to venueui
        console.log('moving venue ui');

        if (displayInfo.movedGoogleMap === true) {
            closeWindows();
            //only move venue-ui in app mode
            if (platform === 2) {
                GoogleMapDiv.append($(venueUi));
                $(venueUi).removeClass('map-control-transparent').addClass('map-control');
//                $(venueUi).removeClass('map-control-transparent').addClass('map-control');
            }
            closeWindows(venueUi);
        }
        displayInfo.portrait = false;
        //$('#control-div').css('max-width', 400);
        $(venueDetailsUi).css('max-width', displayInfo.panelWidth);
        $('#contacts').css('max-width', displayInfo.panelWidth);
        $('.map-control').css('width', displayInfo.panelWidth);
//        $('.map-control-transparent').css('width', 400);
        $('.map-control').css('width', displayInfo.panelWidth);
        $('#venue-ui-container').css('position', 'fixed');
        //$(venueUi).css('width', '400');
    } else {
        displayInfo.narrow = true;
        $("#fb_like").hide();
        //only if
        $('#venue-ui-container').css('position', 'fixed');
        //specific to venueui
        console.log('moving venue ui');

	//the following will only work if the map
        //was moved which only happens if venue-ui is opened.
        //closeWindows() has special code if venue-ui is opened
        if (displayInfo.movedGoogleMap === true) {
            closeWindows();
            $(displayInfo.googleMapParent).append($(venueUi));
//            $(venueUi).removeClass('map-control').addClass('map-control-transparent');
            closeWindows(venueUi);
        } else {
            $(displayInfo.googleMapParent).append($(venueUi));
//            $(venueUi).removeClass('map-control').addClass('map-control-transparent');
        }
        displayInfo.portrait = true;
        $(displayInfo.googleMapParent).css('max-width', ewidth);
        $(venueDetailsUi).css('max-width', ewidth);
        $('#contacts').css('max-width', ewidth);
console.log("map control width"+ewidth);
        $('.map-control').css('width', ewidth);
//        $('.map-control-transparent').css('width', ewidth);
        $('.map-control').css('width', ewidth);
        displayInfo.swipeNavigation = true;
    }
    displayInfo.deviceHeight = eheight;
    displayInfo.deviceWidth = ewidth;
    if (platform === 2) {
        if (displayInfo.portrait === false) {

            $('.mapControl').css('height', eheight);
        } else {
            $('.mapControl').css('height', null);
        }
// why is thi sneeded 10/8/2015        handleMapSize();//but this is clled below
        $('.map-control').css('top', displayInfo.gmapTop + 'px');
    }

    eheight -= displayInfo.gmapTop;
    $(venueDetailsUi).css('max-height', eheight);
    $('.scrollableWindow').css('max-height', eheight);
    $(venueDetailsUi).css('height', eheight + 'px');
    $(venueUi).css('height', eheight + 'px');
    $('#route-ui').css('height', eheight + 'px');
    //this shouldn't be done in WindowedMode
    $(displayInfo.googleMapParent).css('width', ewidth + 'px');
    //this is only applicable on devices that an change orientation
    if (displayInfo.currentDisplayDiv === venueUi) {
        venueCardSetup();
        venueUiSizeFix();
    }
    if (displayInfo.currentDisplayDiv === venueDetailsUi){
        venueDetailUiSizeFix();
    }
    handleMapSize();
}

function androidBackKeyEvent() {
    return false;
}
var globalTimer;
function resize() {
    console.log('resize orientation calling');
	clearTimeout(globalTimer);
	globalTimer=setTimeout(doOnOrientationChange(),400);
    //doOnOrientationChange();
}

function inviteHandle(event){
    console.log("inviteHandle"+event.detail+event.detail.path);
}
/* the following is code to display
 * loading gif
 */
var $body = $("body");

function checkLoading(){
    if(displayInfo.searchFlag===false && displayInfo.ajaxFlag===false && displayInfo.pluginCounter === 0)
        $("body").removeClass("loading");
    else
        $("body").addClass("loading");
}
function searchWait(){
    displayInfo.searchFlag=true;
    checkLoading();
}
function searchDone(){
    displayInfo.searchFlag=false;
    checkLoading();
}
$(document).on({
    ajaxStart: function() { displayInfo.ajaxFlag=true;checkLoading();},
     ajaxStop: function() { displayInfo.ajaxFlag=false;checkLoading();}
});
//end following
function onResumeFunction(){
    var retval=closeWindows();
    retval.done(function(){//close any windows upon resume to fix problem with iOS
        doOnOrientationChange();
        getCurrentLocalLocation()
    });
}
var google_ready_def = $.Deferred();
window.google_ready = function (){
    google_resolved_def.resolve(google.maps);
    google_init();
}
function google_ready(){
    console.log('google initi called:'+_lat+':'+_lng);
    directionsService = new google.maps.DirectionsService();
    displayInfo.currentLocation = new google.maps.LatLng(_lat, _lng);
    mapProp = {
    center: displayInfo.currentLocation,
    zoom: 15,
    mapTypeControl: false,
    /*mapTypeControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_CENTER
    }, */
    zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    panControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styles

};
    initialize();
}
var    ready = function () {
    console.log('ready callrd');
    google_ready();
    var viewportScale = 1 / window.devicePixelRatio;
    //window.addEventListener('orientationchange', doOnOrientationChange);
    document.addEventListener('resume', onResumeFunction);
    window.addEventListener('resize', resize);
    document.addEventListener('normal', initialize, false);
    document.addEventListener('invite', inviteHandle, false);
    onDeviceReady();
    GoogleMapDiv=$('#googleMap');
};

$(document).ready(ready);
$(document).on('page:load', ready);

//this is the hammerjs wrapper
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'hammerjs'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'), require('hammerjs'));
    } else {
        factory(jQuery, Hammer);
    }
}(function($, Hammer) {
    function hammerify(el, options) {
        var $el = $(el);
        if(!$el.data("hammer")) {
            $el.data("hammer", new Hammer($el[0], options));
        }
    }

    $.fn.hammer = function(options) {
        return this.each(function() {
            hammerify(this, options);
        });
    };

    // extend the emit method to also trigger jQuery events
    Hammer.Manager.prototype.emit = (function(originalEmit) {
        return function(type, data) {
            originalEmit.call(this, type, data);
            $(this.element).trigger({
                type: type,
                gesture: data
            });
        };
    })(Hammer.Manager.prototype.emit);
}));

/******
* hia_init
* initialization constants to be moved to their own file
*/
displayInfo.ajaxFlag=false;
displayInfo.windowedMode=true;
displayInfo.popupMenuDisplay=true;
displayInfo.favoritesLoad=true;
displayInfo.backgroundSearch=false;

//
//platformmarkers to be removed
});
