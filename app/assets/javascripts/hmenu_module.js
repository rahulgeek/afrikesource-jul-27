/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global pop_lool, pop_favorite,
 * global pop_query, pop_queryh, pop_querya
 * global pop_atm, pop_atmh, pop_atma
 * global pop_bar, pop_barh, pop_bara
 * global pop_gas, pop_gash, pop_gasa
 * global pop_food, pop_foodh, pop_fooda
 * global pop_tourist, pop_tourish, pop_touristh
 * global pop_marka, pop_markah, pop_markaa
 * global pop_markb, pop_markbh, pop_markba
 * global pop_loolc
 * global plugin
 * global map, google
 * */

define([

    'jquery',
    'markers'

], function ( $, mark) {
    var platform, os;
    var popupMenuPosition;
    var popupMenu;
    var popupMenuVisible = false;
    var pixelRatio;
    var menu;
    var popupMenuDefinitions;
    var popupMarkerMenuDefinitions;
    var popupMenuStorage;
    var app;
    var calls;

    var init = function (plat, osversio, pixel, apple, call)
    {
        platform = plat;
        os = osversio;
        pixelRatio = pixel;
        menu = new hMenu;
        popupMenuDefinitions = $.extend(true, [], popupMenuDefinitionDefault);
        popupMarkerMenuDefinitions = $.extend(true, [], popupMarkerMenuDefinitionDefault);
        app = apple;
        calls = call;


        return {
            init: init,
            popupMenuMove: popupMenuMove,
            popupMenuCreate: popupMenuCreate,
            popupMenuHide: popupMenuHide,
            poupMenuShow: popupMenuShow,
            popupMarkerObject: popupMarkerObject,
            popupMenuDefinitions: popupMenuDefinitions,
            popupMarkerMenuDefinitions: popupMarkerMenuDefinitions,
            getPosition: getPosition,
            setPosition: setPosition,
            setVisible: setVisible,
            getVisibility: getVisiblity,
            updatePopupMenu: updatePopupMenu
        };
    };
    var hMenu = function () {

    };
    var setPosition = function (position) {
        popupMenuPosition = position;
    };
    var getPosition = function () {
        return popupMenuPosition;
    };
    var setVisible = function (boolean) {
        popupMenuVisible = boolean;
    };
    var getVisiblity = function () {
        return popupMenuVisible;
    };

    /*************
     * displayInfo.popupMenuDisplay should be moved
     * displayInfo.platform is static
     *
     * transient flags that should be stored internally?
     * hmenu.setPosition
     * hmenu.getPosition
     * hmenu.displayMenu
     * hmenu.setVisible
     * hmenu.getVisibility
     *
     * displayInfo.popupMenuPosition
     * displayInfo.popupMenuStorage
     * displayInfo.popupMenu
     * displayInfo.popupMenuVisible
     *
     * displayInfo.pixelRatio shouldn't change
     *
     * map external
     * google external
     * platform - static information
     *
     * \getDisplayRatio
     * createmarker (from popupMarkerObject?)
     *
     * @type Array
     */

    /*note that these will be the default menus for main and context, and favorites
     * will get added on tomenu definititions
     * these custom menu definitions will be limited to maybe home, work, and numbered
     * from 1-5, users can drop all the menu favorites onto the screen regardless
     * note that when the user edits a favorite that this can cause the popup menu to
     * change
     */
    var popupMenuDefinitionDefault = [
//        {name: "lool", icon: pop_lool, hover: pop_lool, activate: pop_lool},
//        {name: "favorite", icon: pop_favorite, hover: pop_favorite, activate: pop_favorite},
//    {name: "reset", icon: pop_reset, hover: pop_reseth, activate: pop_reseta},
//    {name: "bookmark", icon: pop_bookmark, hover: pop_bookmarkh, activate: pop_bookmarka},
//    {name: "radius", icon: pop_radius, hover: pop_radiush, activate: pop_radiusa},
//    {name: "input", icon: pop_input, hover: pop_inputh, activate: pop_inputa},
        {name: "query", icon: pop_query, hover: pop_queryh, activate: pop_querya},
        {name: "atm", icon: pop_atm, hover: pop_atmh, activate: pop_atma},
        {name: "gas", icon: pop_gas, hover: pop_gash, activate: pop_gasa},
        {name: "bar", icon: pop_bar, hover: pop_barh, activate: pop_bara},
        {name: "food", icon: pop_food, hover: pop_foodh, activate: pop_fooda},
        {name: "tourist", icon: pop_tourist, hover: pop_touristh, activate: pop_tourist},
        {name: "start", icon: pop_marka, hover: pop_markah, activate: pop_markaa},
        {name: "dest", icon: pop_markb, hover: pop_markbh, activate: pop_markba},
    ];


    var popupMarkerMenuDefinitionDefault = [
//        {name: "loolcreate", icon: pop_loolc, hover: pop_loolc, activate: pop_loolc},
//    {name: "radius", icon: pop_radius, hover: pop_radiush, activate: pop_radiusa},
        //   {name: "input", icon: pop_input, hover: pop_inputh, activate: pop_inputa},
        {name: "query", icon: pop_query, hover: pop_queryh, activate: pop_querya},
        {name: "atm", icon: pop_atm, hover: pop_atmh, activate: pop_atma},
        {name: "gas", icon: pop_gas, hover: pop_gash, activate: pop_gasa},
//    {name: "bar", icon: pop_bar, hover: pop_barh, activate: pop_bara},
        {name: "food", icon: pop_food, hover: pop_foodh, activate: pop_fooda},
        {name: "tourist", icon: pop_tourist, hover: pop_touristh, activate: pop_tourist}
    ];

    var popupMenuDefinition, popupMarkerMenuDefinition;
    function getDisplayRatio() {
        // retrieve the lat lng for the far extremities of the (visible) map
        var latLngBounds = map.getBounds();
        var neBound = latLngBounds.getNorthEast();
        var swBound = latLngBounds.getSouthWest();

        // convert the bounds in pixels
        var neBoundInPx = map.getProjection().fromLatLngToPoint(neBound);
        var swBoundInPx = map.getProjection().fromLatLngToPoint(swBound);
        var diffX = Math.abs(neBoundInPx.x - swBoundInPx.x);
        var diffY = Math.abs(swBoundInPx.y - neBoundInPx.y);
        // compute the percent of x and y coordinates related to the div containing the map; in my case the screen
        var googmap = $('#googleMap');
        var procX = googmap.width();
        var procY = googmap.height();
        console.log('procX:' + procX + ' procY:' + procY);
        console.log('difx:' + diffX + ' dify:' + diffY);

        var ratio = {};
        ratio.x = diffX / procX;
        ratio.y = diffY / procY;
        ratio.x = ratio.y;
        return ratio;
    }
//note that this is for web, app has different projections
    function popupMenuMove(menuStorage, position) {

        var angle = -1.57;
        if (position === null) {
            position = popupMenuPosition;
        } else
            popupMenuPosition = position;
        if (popupMenuVisible === false)
            return;
        popupMenuStorage = menuStorage;
        if (popupMenu === true) {
            calls.dimAllMarkers();
//        closeWindows("");
            $('#basePanel').panel('close');
            var radius = (menuStorage.length * 50) / 6;
            var increment = 2 * Math.PI / menuStorage.length;
            //note that for app that this is different
            if (platform === 2) {
                map.fromLatLngToPoint(position, function (point) {
                    for (var i = 0; i < menuStorage.length; i++) {
//              console.log("i:"+i+"["+menuStorage[i].name+"]");
                        var record = menuStorage[i].findRecord();
                        var cosx = Math.cos(angle);
                        var siny = Math.sin(angle);
                        var x = radius * cosx * pixelRatio + point[0] * pixelRatio;
                        var y = radius * siny * pixelRatio + point[1] * pixelRatio;
                        function _popupMenuMove(x, y, i) {
                            map.fromPointToLatLng([x, y], function (position) {
                                var location = new plugin.google.maps.LatLng(position[0], position[1]);
                                var item = menuStorage[i];
                                item.setPosition(location);
                                item.setVisible(true);
                            });
                        }
                        _popupMenuMove(x, y, i);
                        angle += increment;
                    }
                });
            } else {
                var ratio = getDisplayRatio();
                var proj = map.getProjection();
                var wc = proj.fromLatLngToPoint(position);
                var scale = Math.pow(2, map.getZoom());
                //popup menu is created, move it
//        displayInfo.popupMenu = false;
                console.log('ratio.x:' + ratio.x + ' ratio.y:' + ratio.y);
                for (var i = 0; i < menuStorage.length; i++) {
                    var record = menuStorage[i].findRecord();

                    var x = radius * ratio.x * Math.cos(angle) + wc.x;
                    var y = radius * ratio.y * Math.sin(angle) + wc.y;
                    var point = new google.maps.Point(x, y);
//                console.log("[i]" + i + "scale: " + scale + "radius: " + radius + " x: " + x + " y:" + y);

                    var position = proj.fromPointToLatLng(point);
                    var item = menuStorage[i];
                    item.setPosition(position);
                    item.setVisible(true);
                    angle += increment;
                }
            }
        }
    }
    function popupMenuHide() {
        calls.activeAllMarkers();
        console.log("hiding popupMenu");
        popupMenuVisible = false;
        var menuStorage = popupMenuStorage;
        if (popupMenu === true) {
            for (i = 0; i < menuStorage.length; i++) {
                var record = menuStorage[i];
//	    console.log(i+";"+record.name);
                record.setVisible(false);
            }
        }
    }
    function popupMenuShow(menuStorage) {
        calls.dimAllMarkers();
        console.log("showing popupMenu");
        popupMenuStorage = menuStorage;
        popupMenuVisible = true;
        if (popupMenu === true) {
            for (i = 0; i < menuStorage.length; i++) {
                var record = menuStorage[i];
//	    console.log(i+";"+record.name);
                record.setVisible(true);
            }
        }
    }

    function popupMenuCreate(menuDefinition, menuStorage, position) {
        var increment = 2 * Math.PI / menuDefinition.length;
        //note that for app that this is different
        var angle = -1.57;

        //**************
        //where is this coming from
        //**** temrporaty resetTravelModeButton(true);
        //if the menu is visible, then turn it off
        //otherwise turn it on..
        if (popupMenuVisible === true) {
            console.log('popup menu visible, turning off');
            popupMenuHide();
            return;
        } else if (menuStorage.length !== 0) {
            console.log('popup menu non-visible, turning on');
            popupMenuVisible = true;
            popupMenuMove(menuStorage, position);
            return;
        }
        console.log('creating popup menu');
        //closeWindows("");
        $('#basePanel').panel('close');
        calls.dimAllMarkers();
//if menuStorage.length===0
        {//create the popup menu
            popupMenuPosition = position;
            popupMenuStorage = menuStorage;
            //it is activate
            popupMenu = true;
            popupMenuVisible = true;
            var counter = 0;
            var radius = (menuDefinition.length * 50) / 6;
            if (platform === 2) {

                map.fromLatLngToPoint(position, function (point) {
                    for (var i = 0; i < menuDefinition.length; i++) {
                        var record = menuDefinition[i];

                        var x = radius * pixelRatio * Math.cos(angle) + point[0] * pixelRatio;
                        var y = radius * pixelRatio * Math.sin(angle) + point[1] * pixelRatio;
//                        console.log("[i]" + i + "radius: " + radius + " x: " + x + " y:" + y + "point x:" + point[0] + " point y:" + point[1] + ' ratiox: ' + ratio.x + ' ratioy: ' + ratio.y);
                        function _popupMenuCreate(x, y, record, menuStorage, menuDefinition, index) {
                            map.fromPointToLatLng([x, y], function (position) {
                                var item = new popupMarkerObject(record.name, record.icon, position, menuDefinition, menuStorage);
                                //console.log("lat: " + position[0] + " lng: " + position[1]);
                                //has to be done inside                    item.setPosition(position);
                                item.createMarker(position, record.icon);
                                menuStorage[index] = item;
                            });
                        }
                        _popupMenuCreate(x, y, record, menuStorage, menuDefinition, i);
                        angle += increment;
                    }
                });
            } else {
                var ratio = getDisplayRatio();
                var proj = map.getProjection();
                var wc = proj.fromLatLngToPoint(position);
                var scale = Math.pow(2, map.getZoom());
                for (var i = 0; i < menuDefinition.length; i++) {

                    var record = menuDefinition[i];
                    var x = radius * ratio.x * Math.cos(angle) + wc.x;
                    var y = radius * ratio.y * Math.sin(angle) + wc.y;

//                console.log("scale: " + scale + "radius: " + radius + " x: " + x + " y:" + y);
                    var point = new google.maps.Point(x, y);
                    var location = proj.fromPointToLatLng(point);
                    var item = new popupMarkerObject(record.name, record.icon, location, menuDefinition, menuStorage);
                    menuStorage.push(item);
                    angle += increment;
                }
            }
        }
    }
//keep the infomration that can change, such as the position and marker
    var popupMarkerObject = function (name, icon, position, array, storage) {

        this.name = name;
        this.position = position;
        this.arrayName = array;
        this.storage = storage;
        this.record = this.findRecord();
//note that for the plugin, it won't return like this
        if (platform !== 2) {
            this.marker = this.createMarker(position, icon);
            this.marker.setMap(map);
        }
        if (position !== null) {
            if (platform === 2)
                this.googlePosition = convert2latLng(position); //this location is platformIndependent for google
            else
                this.googlePosition = position; //this location is platformIndependent for google
        } else
            this.googlePosition = null;
        if (platform !== 2) {
            this.popupMarkerWebListeners(this);
        }
    };
    popupMarkerObject.prototype.createMarker = function (position, icon) {
        if (platform === 2)
            var location = new plugin.google.maps.LatLng(position[0], position[1]);
        else
            var location = position;
        var string;
        var retval = this.checkPopupStateColor();
        if (retval !== false)
            string = retval;
        else
            string = icon;//"images/" + icon;
        var value = {
            draggable: false,
            position: location,
            //possible values drop, bounce to stop bouncing set to null
            icon: string, //addUrlPrefix(string),
            animation: null
        };
        if (platform === 2) {
            function _createMarker(markerObject) {
                map.addMarker(value, function (mark) {
                    markerObject.marker = mark;
                    popupMarkerPluginListeners(markerObject);
                    markerObject.setPosition(location);
                });
            }
            _createMarker(this);
        } else
            var marker = new google.maps.Marker(value); // end setup marker

        return marker;
    };
    popupMarkerObject.prototype.displayMarker = function (position, icon) {
        var marker = this.createMarker(position, icon);
        if (platform !== 2)
            marker.setMap(map);
        return marker;

    };
    popupMarkerObject.prototype.findRecord = function () {
        for (i = 0; i < this.arrayName.length; i++) {
            if (this.arrayName[i].name === this.name)
                return (this.arrayName[i]);
        }
    };
    popupMarkerObject.prototype.setPosition = function (location) {
        this.marker.setPosition(location);
        if (platform === 2) {
            this.googlePosition = convert2latLng(location);
        } else {
            this.googlePosition = location;
        }
        this.position = location;
    };

    /*****
     * setVisible will turn on/off the popupMenu
     * if there is a state, it will check the value and if true, display
     *
     * @param {type} flag
     * @returns {undefined}~
     */
    popupMarkerObject.prototype.setVisible = function (flag) {
        if (flag === true) {
            this.popupSetStateColor();
            if (platform === 2 && os === "iOS") {
                //this.marker.setVisible(true);
                this.marker.setOpacity(1);
            } else {
                this.marker.setVisible(flag);//setMap(map);
            }
        } else {
            if (platform === 2 && os === "iOS") {
                //this.marker.setVisible(false);
                this.marker.setOpacity(0);
            } else {
                this.marker.setVisible(flag);//setMap(null);
            }
        }
    };
    popupMarkerObject.prototype.setOpacity = function (opacity) {
        if (platform === 2) {
            this.marker.setOpacity(opacity);
        } else {
            this.marker.setOptions({'opacity': opacity});
        }
    };
    popupMarkerObject.prototype.setVisiblePosition = function (flag, location) {
        if (platform === 2) {
            this.marker.setVisible(flag, function () {
                console.log("marker visible now set position");
                this.marker.setPosition(location);
            });
        }
    };
    function  popupMarkerPluginListeners(markerObject) {
        var record = markerObject.findRecord();
        var object = markerObject;
        markerObject.marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function (mark1) {
            //note that if opacity===0 and there is a click, then the popupMenuCreate should be called?
            console.log('marker click');
            if (object.marker.getOpacity() === 0) {
                //must check this code, why get the search radius distance when the marker is clicked
                popupMenuCreate(popupMenuDefinition, popupArray, object.position);
            } else {
                object.popupMenuColor(record.name, record.activate);
                popupMenuActivate(record.name, object);
            }
        });
    }
//function popupMarkerWebListeners(markerObject) {
    popupMarkerObject.prototype.popupMarkerWebListeners = function (markerObject) {
        var object = markerObject;
        var record = markerObject.findRecord();
        var someting = this;
        function setupListeners(record) {

            google.maps.event.addListener(markerObject.marker, 'click', function (evt) {
                object.popupSetActivateColor();
                setTimeout(function () {
                    popupMenuActivate(record.name, object);
                }, 300);
                //activate
            });

            google.maps.event.addListener(markerObject.marker, 'mouseover', function (evt)
            {
                object.popupSetHoverColor();
                //set hover colord
            }); // end of marker addListener for dragging marker

            google.maps.event.addListener(markerObject.marker, 'mouseout', function (evt)
            {
                object.popupSetStateColor();

            }); // end of marker addListener for dragging marker
        }
        setupListeners(record);
    };
//update TravelMode, called with #walking1, #biking1, #driving1 or #transit1
    function popupupdateTravelMode(mode) {
        setCurrentTravelMode(mode);
//*** this is not needed because of the listener on travel-mode1   calculateRoute();
    }
    function popupCreateLoolCode(markerObject) {
        displayInfo.eventlocationid = null;
        //this will be a markerObject
        calls.eventObject.name = "bookmarked location";
        calls.eventObject.formatted_address = $('#miniInput').val();
        calls.eventObject.geometry = {};
        if (miniLocation.type === 'a')
            calls.eventObject.geometry.location = calls.startingLocation1.googlePosition;
        else
            calls.eventObject.geometry.location = calls.startingLocation2.googlePosition;
        createEventdetails(calls.eventObject);
    }
    function popupMenuActivate(menu, markerObject) {
//    displayInfo.popupMenuVisible = false;
        console.log("menu activate:" + menu);
        popupMenuHide();
        switch (menu) {
            case 'loolcreate':
                popupCreateLoolCode(markerObject);
                break;
            case 'reset':
                calls.resetMapItems();
                break;
            case 'start':
                calls.updateStart1();
                break;
            case 'dest':
                calls.updateStart2();
                break;
            case 'radius':
                radiusOpenPanel();
                break;
            case 'query':
                calls.closeWindows('#types-div');
                //closeWindows('#freeform-search-div');
                break;
            case "bookmark":
                bookmarksetup();
                updateBookmarkContainer();
                calls.closeWindows("#bookmark-container");
                //bookmarkStart();
                break;
            case "bookmarkGo":
                calls.updateStart1();
                bookmarkGo();
                break;
            case "gas":
                calls.clearVenues();
                calls.gasSearch();//"pop"); pop will cause search to center around click point
                break;
            case "bar":
                calls.clearVenues();
                calls.barSearch();//"pop");
                break;
            case "food":
                calls.clearVenues();
                calls.restaurantSearch();//"pop");
                break;
            case "atm":
                calls.clearVenues();
                calls.atmSearch();//"pop");
                break;
            case "favorite":
                calls.clearVenues();
                calls.closeWindows("#listFavorites");
                break;
            case "lool":
                calls.openInviteScreen();
                break;
            case "input":
                initializeMainPanel();
                closeWindows("#mainPanel");
                break;
            case "walk":
                popupupdateTravelMode("WALKING");
                navigate();
                break;
            case "bike":
                popupupdateTravelMode("BICYCLING");
                navigate();
                break;
            case "drive":
                popupupdateTravelMode("DRIVING");
                navigate();
                break;
            case "transit":
                popupupdateTravelMode("TRANSIT");
                navigate();
                break;
            case "tourist":
                calls.aroundMe(null,'african');
                //calls.getClusterData();
                break;
            case 'home_favorite':
                drop_favorite('home');
                break;
            case 'work_favorite':
                drop_favorite('work');
                break;
            case 'place1':
                drop_favorite('place1');
                break;
            case 'place2':
                drop_favorite('place2');
                break;
            case 'place3':
                drop_favorite('place3');
                break;
            case 'place4':
                drop_favorite('place4');
                break;
            case 'place5':
                drop_favorite('place5');
                break;

        }
    }
    popupMarkerObject.prototype.popupSetHoverColor = function () {
        if (this.record.hover) {
            var retval = this.checkPopupStateColor("hover");
            if (retval !== false)
                this.marker.setIcon(retval);//addUrlPrefix("images/" + retval));
            else
                this.marker.setIcon(this.record.hover);//addUrlPrefix("images/" + this.record.hover));
        }
    };
    popupMarkerObject.prototype.popupSetActivateColor = function () {
        if (this.record.activate) {
            var retval = this.checkPopupStateColor("activate");
            if (retval !== false)
                this.marker.setIcon(retval);//addUrlPrefix("images/" + retval));
            else
                this.marker.setIcon(this.record.activate);//addUrlPrefix("images/" + this.record.activate));
        }
    };
    popupMarkerObject.prototype.popupSetNormalColor = function () {
        this.marker.setIcon(this.record.icon);//addUrlPrefix("images/" + this.record.icon));
    };
    popupMarkerObject.prototype.popupSetStateColor = function () {
        var retval = this.checkPopupStateColor();
        if (retval)
            this.marker.setIcon(retval);//addUrlPrefix(retval));
        else
            this.popupSetNormalColor();
    };
    popupMarkerObject.prototype.checkPopupStateColor = function (type) {
        if (this.record.stateCheck) {
            if ((!this.record.stateParameter && this.record.stateCheck()) ||
                    (this.record.stateParameter && this.record.stateCheck(this.record.stateParameter))) {
                //console.log('state function:' + this.record.stateCheck);
                switch (type) {
                    case 'hover':
                        if (this.record.stateTrueHover)
                            return this.record.stateTrueHover;
                        else
                            return false;
                        break;
                    case 'activate':
                        if (this.record.stateTrueHover)
                            return this.record.stateTrueActivate;
                        else
                            return false;
                        break;
                    case 'normal':
                        if (this.record.stateTrueHover)
                            return this.record.stateTrue;
                        else
                            return false;
                        break;
                    default:
                        return this.record.stateTrue;
                        break;
                }
                /*        if (this.record.stateCheck(this.record.stateParameter)) {
                 return "images/" + this.record.stateTrue;
                 } else {
                 return false;
                 }*/
            }
        }
        return false;
    };
    popupMarkerObject.prototype.popupMenuColor = function (name, color) {
        /*
         * get the record of the marker
         * update the background color
         * display the marker itself
         */
        var item = this.findPopupMarker(name);
        item.marker.setIcon(color);
    };
    popupMarkerObject.prototype.findPopupMarker = function (name) {
        for (i = 0; i < this.storage.length; i++) {
            if (this.storage[i].name === name)
                return this.storage[i];
        }
        return null;
    };

function updatePopupMenu(){
    popupMenuDefinition=$.extend(true,[],popupMenuDefinitionDefault);
    popupMarkerMenuDefinition=$.extend(true,[],popupMarkerMenuDefinitionDefault);
}
    return init;
    /*{
     init: init,
     popupMenuMove: popupMenuMove,
     popupMenuCreate: popupMenuCreate,
     popupMenuHide: popupMenuHide,
     poupMenuShow: popupMenuShow,
     popupMarkerObject: popupMarkerObject
     };*/
});
