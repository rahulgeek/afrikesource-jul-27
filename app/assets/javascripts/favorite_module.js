/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * needs access to

 * pop_home, pop_work, pop_place1, pop_place2???
 *
 * hmenu_instance
 *
 * updateSearchBounds();
 * createVenueList();
 * convert2pluglatLng()
 *
 * venueDetails
 * venue
 *
 * favorites[]
 *
 * closeWindows
 *
 * localStorage
 *
 * popupMenuDefinition
 * popupMarkerMenuDefinition
 * getVenueDetailsMinute()
 * processExtendedData
 *
 * favoriteUrl
 * @param {type} $
 * @param {type} mark
 * @returns {undefined}
 */

define([

    'jquery',
    'markers'

], function ( $, mark) {
    var favoriteUrl="https://www.hiamaps.com/favorites.php";
    var favorites=[];
    var calls;
    var init = function (call)
    {
        if(call!== null && call!==undefined){
        /* setup these listeners
         */
        $('#edit_favorite_button').click(function(){
            editFavorites();
        });
        $('#delete_favorite_button').click(function(){
            deleteFavorites();
        });
        $('#save_favorite_button').click(function(){
            saveFavoriteEdit();
        });
    $('#venue-details-create-favorite').click(function(){
        createFavorite();
    });        
        }
     //   $('#listFavoritesBody').on('click','tr',function(event){
     //       selectFavorite($(event.currentTarget).data('id'));
     //   });
        calls = call;


        return {
            init: init,
            findFavorite: findFavorite, //internal? called by drop_favorite
            favoritesLoad: favoritesLoad, //called in initialization
            favoritesSave: favoritesSave,
            displayFavorites: displayFavorites, //called by window opening function and deleteFavorites (upon update)
            favorites: getFavorites

        };
    };
function getFavorites(i){
    return favorites[i];
}
function findFavorite(type){

    for(var i=0;i<favorites.length;i++){
        if(favorites[i].menu_type===type)
            return favorites[i];
    }
    return null;
}
function createFavorite(object){
    if (object === undefined || object === null)
        var eventObject = calls.findVenue(object);
//        eventObject = _.find(venueDetails, function (object) {
//            return object.place_id === displayInfo.eventLocationId;
//        });
    else
        eventObject=object;
    var favorite=favoriteSave(eventObject.name,
        eventObject.formatted_address,
        eventObject.place_id,
        "",
        eventObject.geometry.location.lat(),
        eventObject.geometry.location.lng(),
        eventObject.scope,
        '');
    favorites.push(favorite);
    favorites=_.uniq(favorites,false,function(value){
        return value.name;
    });
    favoritesSave();
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
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAKL2lDQ1BJQ0MgcHJvZmlsZQAASMedlndUVNcWh8+9d3qhzTDSGXqTLjCA9C4gHQRRGGYGGMoAwwxNbIioQEQREQFFkKCAAaOhSKyIYiEoqGAPSBBQYjCKqKhkRtZKfHl57+Xl98e939pn73P32XuftS4AJE8fLi8FlgIgmSfgB3o401eFR9Cx/QAGeIABpgAwWempvkHuwUAkLzcXerrICfyL3gwBSPy+ZejpT6eD/0/SrFS+AADIX8TmbE46S8T5Ik7KFKSK7TMipsYkihlGiZkvSlDEcmKOW+Sln30W2VHM7GQeW8TinFPZyWwx94h4e4aQI2LER8QFGVxOpohvi1gzSZjMFfFbcWwyh5kOAIoktgs4rHgRm4iYxA8OdBHxcgBwpLgvOOYLFnCyBOJDuaSkZvO5cfECui5Lj25qbc2ge3IykzgCgaE/k5XI5LPpLinJqUxeNgCLZ/4sGXFt6aIiW5paW1oamhmZflGo/7r4NyXu7SK9CvjcM4jW94ftr/xS6gBgzIpqs+sPW8x+ADq2AiB3/w+b5iEAJEV9a7/xxXlo4nmJFwhSbYyNMzMzjbgclpG4oL/rfzr8DX3xPSPxdr+Xh+7KiWUKkwR0cd1YKUkpQj49PZXJ4tAN/zzE/zjwr/NYGsiJ5fA5PFFEqGjKuLw4Ubt5bK6Am8Kjc3n/qYn/MOxPWpxrkSj1nwA1yghI3aAC5Oc+gKIQARJ5UNz13/vmgw8F4psXpjqxOPefBf37rnCJ+JHOjfsc5xIYTGcJ+RmLa+JrCdCAACQBFcgDFaABdIEhMANWwBY4AjewAviBYBAO1gIWiAfJgA8yQS7YDApAEdgF9oJKUAPqQSNoASdABzgNLoDL4Dq4Ce6AB2AEjIPnYAa8AfMQBGEhMkSB5CFVSAsygMwgBmQPuUE+UCAUDkVDcRAPEkK50BaoCCqFKqFaqBH6FjoFXYCuQgPQPWgUmoJ+hd7DCEyCqbAyrA0bwwzYCfaGg+E1cBycBufA+fBOuAKug4/B7fAF+Dp8Bx6Bn8OzCECICA1RQwwRBuKC+CERSCzCRzYghUg5Uoe0IF1IL3ILGUGmkXcoDIqCoqMMUbYoT1QIioVKQ21AFaMqUUdR7age1C3UKGoG9QlNRiuhDdA2aC/0KnQcOhNdgC5HN6Db0JfQd9Dj6DcYDIaG0cFYYTwx4ZgEzDpMMeYAphVzHjOAGcPMYrFYeawB1g7rh2ViBdgC7H7sMew57CB2HPsWR8Sp4sxw7rgIHA+XhyvHNeHO4gZxE7h5vBReC2+D98Oz8dn4Enw9vgt/Az+OnydIE3QIdoRgQgJhM6GC0EK4RHhIeEUkEtWJ1sQAIpe4iVhBPE68QhwlviPJkPRJLqRIkpC0k3SEdJ50j/SKTCZrkx3JEWQBeSe5kXyR/Jj8VoIiYSThJcGW2ChRJdEuMSjxQhIvqSXpJLlWMkeyXPKk5A3JaSm8lLaUixRTaoNUldQpqWGpWWmKtKm0n3SydLF0k/RV6UkZrIy2jJsMWyZf5rDMRZkxCkLRoLhQWJQtlHrKJco4FUPVoXpRE6hF1G+o/dQZWRnZZbKhslmyVbJnZEdoCE2b5kVLopXQTtCGaO+XKC9xWsJZsmNJy5LBJXNyinKOchy5QrlWuTty7+Xp8m7yifK75TvkHymgFPQVAhQyFQ4qXFKYVqQq2iqyFAsVTyjeV4KV9JUCldYpHVbqU5pVVlH2UE5V3q98UXlahabiqJKgUqZyVmVKlaJqr8pVLVM9p/qMLkt3oifRK+g99Bk1JTVPNaFarVq/2ry6jnqIep56q/ojDYIGQyNWo0yjW2NGU1XTVzNXs1nzvhZei6EVr7VPq1drTltHO0x7m3aH9qSOnI6XTo5Os85DXbKug26abp3ubT2MHkMvUe+A3k19WN9CP16/Sv+GAWxgacA1OGAwsBS91Hopb2nd0mFDkqGTYYZhs+GoEc3IxyjPqMPohbGmcYTxbuNe408mFiZJJvUmD0xlTFeY5pl2mf5qpm/GMqsyu21ONnc332jeaf5ymcEyzrKDy+5aUCx8LbZZdFt8tLSy5Fu2WE5ZaVpFW1VbDTOoDH9GMeOKNdra2Xqj9WnrdzaWNgKbEza/2BraJto22U4u11nOWV6/fMxO3Y5pV2s3Yk+3j7Y/ZD/ioObAdKhzeOKo4ch2bHCccNJzSnA65vTC2cSZ79zmPOdi47Le5bwr4urhWuja7ybjFuJW6fbYXd09zr3ZfcbDwmOdx3lPtKe3527PYS9lL5ZXo9fMCqsV61f0eJO8g7wrvZ/46Pvwfbp8Yd8Vvnt8H67UWslb2eEH/Lz89vg98tfxT/P/PgAT4B9QFfA00DQwN7A3iBIUFdQU9CbYObgk+EGIbogwpDtUMjQytDF0Lsw1rDRsZJXxqvWrrocrhHPDOyOwEaERDRGzq91W7109HmkRWRA5tEZnTdaaq2sV1iatPRMlGcWMOhmNjg6Lbor+wPRj1jFnY7xiqmNmWC6sfaznbEd2GXuKY8cp5UzE2sWWxk7G2cXtiZuKd4gvj5/munAruS8TPBNqEuYS/RKPJC4khSW1JuOSo5NP8WR4ibyeFJWUrJSBVIPUgtSRNJu0vWkzfG9+QzqUvia9U0AV/Uz1CXWFW4WjGfYZVRlvM0MzT2ZJZ/Gy+rL1s3dkT+S453y9DrWOta47Vy13c+7oeqf1tRugDTEbujdqbMzfOL7JY9PRzYTNiZt/yDPJK817vSVsS1e+cv6m/LGtHlubCyQK+AXD22y31WxHbedu799hvmP/jk+F7MJrRSZF5UUfilnF174y/ariq4WdsTv7SyxLDu7C7OLtGtrtsPtoqXRpTunYHt897WX0ssKy13uj9l4tX1Zes4+wT7hvpMKnonO/5v5d+z9UxlfeqXKuaq1Wqt5RPXeAfWDwoOPBlhrlmqKa94e4h+7WetS212nXlR/GHM44/LQ+tL73a8bXjQ0KDUUNH4/wjowcDTza02jV2Nik1FTSDDcLm6eORR67+Y3rN50thi21rbTWouPguPD4s2+jvx064X2i+yTjZMt3Wt9Vt1HaCtuh9uz2mY74jpHO8M6BUytOdXfZdrV9b/T9kdNqp6vOyJ4pOUs4m3924VzOudnzqeenL8RdGOuO6n5wcdXF2z0BPf2XvC9duex++WKvU++5K3ZXTl+1uXrqGuNax3XL6+19Fn1tP1j80NZv2d9+w+pG503rm10DywfODjoMXrjleuvyba/b1++svDMwFDJ0dzhyeOQu++7kvaR7L+9n3J9/sOkh+mHhI6lH5Y+VHtf9qPdj64jlyJlR19G+J0FPHoyxxp7/lP7Th/H8p+Sn5ROqE42TZpOnp9ynbj5b/Wz8eerz+emCn6V/rn6h++K7Xxx/6ZtZNTP+kv9y4dfiV/Kvjrxe9rp71n/28ZvkN/NzhW/l3x59x3jX+z7s/cR85gfsh4qPeh+7Pnl/eriQvLDwG/eE8/vMO7xsAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AMSEyQmWqUtlAAADMlJREFUeNrtmnuMXNddxz+/c++dmTs7O7vrtfcR27P2Ok7tOH4mKAkpIW4lihRapUIUEAgIlShtpjQ8gopAIlVJECDEa5uESpVDpVaqELURolSijU0faZOixqkdv+2sx2/venf2MXvnce/58ce5a68TB5J6vXawjzQazeiex+97vr/3hZt8yHwuFg2VDOABcViuaPpfFrgT2ATcBhjApnsLUAOOAT8My5VKNFSSsFzRaKgkgBeWK/G7AoBoqOQDNixXbDRUygPryOgDkteHabFFI+nCioC++Qi+NiWrhzSRndTlReClsFx5PQXBAHKtgJCrENjd1DMDBtUApZUe9l5ptx8n4WGtSyd2zjZG37yjBVRwwAh4GuPzMg35J+CFsFw5En1uIAD1wscq9RsCgGhohYTlYY2GBnxskg1/52QtGir1Eervo/w2DQpOKEDSG9e3cRK9DKwEw8vE8jTHT/w7pWU+In5YrkQ3BgOeWemTtHI2Ojlj8svXSJs+o5E8eGWa/1/b6Vs/62kVK39Kvu0LTFQb+JkgLB+PrisAjS9tNXZ0X+j1/3pko11bVMe/wkwyiG39L8sriAcmABGwifs4HXlrMEwAvjRJ+GuUp/D8hGak4ScrjfkAwPw4k+zIwSD81LlaUnl2jU7v/RdGzw4STzvBLgr+Rmw9sDFaO49OnoTm1BWEnzvXuO/WNEyOZGhOPYGN/yj82ME6iB8NLfeuCwNm/nGNb48fsGbFyh6v4H9VZ/L3q+chjSrabIAxV1j2kpGTbAd4WbRZhThKBdUrzFFQhSBE8p1ovQbNiTqS/UT42LFt0dBAOB+q8I4YED13h9GRA7btKTW0Tvyx2p77gq1/SfCBZzG3f8gJ34pA/EtCGw80gVYNWbIO/31/ReaDX8Tb8FEk1+2eN/7l8ouAbYGfw7vrVwl+5jm8O38BkiRHEHw2+ofSe/HCeup6F1AF8j1e259gm1//+L3E8pvabIj0bsDr+wnMig9AdhG0ZpwAs+ogPiQNVBXpvxez7AFk8Rq8tR+BrtVoc9Lp+VzhAaxF8j2Y0vsxvVswnXc4m6HeUkQ/SWC8+Yhj3hkAmUIc/R55Gt/7tNj2PLVzJCe/AyJIcTkmXIyqdTc+S31VNGlBfjGmdyOSyQOKKQ4gnaucYVTLRbcJjvoYyHYiuS6I6+jYQdQFDeDrz1KffjgsV1ppsLQwAIS/9HVloG+dTlTfR6YDtQ2SY99EG5OYth6k0Iv4ObDxpeU1ARsjhdswXasgaWGrwyCK6d2A5HugVUttx+ycVHU6VyLt/VC/gL1w0P2vFmLagQ+nwsuCegFZHHxIp1t5gjwkMTq6D23WINsJi94DuQ6wTXcuY8A2ERMgxRVIoR+tnSc5+h/Y6jCm/25ov815BJOqsxjQGDwfb+n9SK4Le+Ewduq0k1TV6UmgDwKDbyPEmkcjOFTKiq8/51IZRUSQZhWmT4IXIN2rIdMOccMJYnxo1iDTjlf6KSTsxo7tx57+Pjp5AulYhelekwo1xwaoBZNFulYDkIwfgfoYeAGQOHAt/cDm2aRroRhwp9ZZDQaSpnNnjUns6e+DJkjHIJrrRmcFEkGTCM13YXo3Ott28nvohQOQ1BHPxyxeB34IScMBpuqutH0pJr8IbU6j44ccAH7ukn2x5ICfXlAbAGzSGWlzbsq6G2nV0LO7oTGFLFqN6ViBzLo120JNgOlYiYTdaCvCjuxFR/Ziq6+7FRfdDmEPtOrgZSCuIzbBK70X6VgJjSo6cRxtTDhvYdPgSQWMvh/ILBgAUrB3k4jL6jQB8VAUO30ajUYwuU6kuAz13E3SqGGCAqbvbqStH62dQadOQSNCx4+gjQlM72akdyPaqjkAEgvWR5beB8ZDq8NQG0EQp1boJbVX+gF/4RjgkXcxvVwEAASdOoEdPwpikI4ByHWBTdC4Dtkipm8L+Fn0/KswdRqCDDp+FL1wAFNcjllyF5o0ESwQQ74L07ESNMGOHUKnzji2vTnANAvtBezlvloQMTAzih074jDqvxvTMQDNSacKHYNIxwpASc6+4lQlaEMv7MeO7ndydKxA2ktoNAbESN8GJOxBm9PY6jGIzqNeJr34uQaTq84H3ikA8iY8TOBue+wgOnMe070W6ViJ1qdcKLt4LRIuRqfOoOdfdfFOth1qI2j1mDtE/z14y+5Hx8+gNodZeh+S74ZGFcYOo0kDCQrO8M5vFe8qABBxAY8XgFp0dD926hT4IVIccOrhh0j3GiS/BJ08jp5/zelxtojGM9jR19DqMaT7DliyDm0qZLow3WsdyWZG0LEjkMSQKUDcvPzIltbCAtDidOqD0zDXpqGswuRJ9wHM4rXQ1gWZNqRnIypCcu5VaFSdWiCICDp2GDt2yCW/xQEoFjCFIlJc7uQbP4zOnEu9irw55hGSNDBYGAB0xvw3geqluD01CV6ANibR6lGwMaZnA9JWQvwipn2psxEnvg1GwM9CXIdsB1o7gx3d5w7Svhyz6D1orujoX6+ip34A8TTkF0FzxoXHc1NnKz+Cq2PBO1WBH0pBzzlPwKUIzgTY1jR29CDanEIK/UjXHVC4zVn/6dPoyGvucS/rQuVMAaIJ9NweJ1KhD+leh7QvhyCPrVexZ1+BZgPCbpcviHeJBUYt8I0FZUBYrlTE6MuO/nO8gedjbNMlOdE4ajykbx1m2T1ItohWj0M0ntI/TWjwEOM7ml/YjxR6MH134fWsR4IC2hjDTlZQk4bUGr/x5BHw4oKGwtFQSey0+Vd8dRSYLVxI4MLUqWHs2GEQD9O7GbPsQdQmJGdeQuOa8xiaONBsDPludOIISeW/IFPELNkAfVscrqd+gCQRkuuARjr3MvpzCNizsOlwuaI0ZKcU9OTF6TYG46NBHp08gb2w3xWCejZhetajU6fQ0b3obOCkaU6PBb8NnRlHz//I2bQl6/G612Knz5IM/6ez+tkuZwcup3+Cla+F5cqFBQ2E0mbI67R4FqN6qdaniMlA0sROHIVGFVPohSBEq6+jk6cc/T0/jeVnt40x6TN2ZB+mvR/JL4L6GDpzDrUtN2dugcV9HQO+nLbiFjQb9KKhkmjN/LOEeswZwzQzND4ShOjoQZLxo2lPJMGOHUYnKq40Jp7TZTFpFSiBbDs6MYxNK0uKwU6cgJnxNEtsze2aAGpJ5CthubIv7R3qQqpADJiwXDmiNfM4gTacUE0wggYFl+qeegkaE9ixw9jRPZA0EDNL/zdUfcVzLm9kLzSnoXoUO/wNaEyk1aXm5acUXgCeSZuudsHL4mklVoCYQP8Qy9MkGHwP4gTiBtKzHtO7BZ0+hR3ZA9GYE3S22HGJym4kFin0YZb9JIhiT3wXnTrn6G/SeMMKeHqIRH4xLFd2R0OlfFiuzFyn3mApl/rfjOTt32tdHsWKuDTZg+ZUmr9nkGx7WsjQt6j/p0SMI7Q+ChIguU6XGl+kvYDRo1j5WFiufDMaKrUD01dL/6vtDodpFJbF18+gPE4iLjszJo3ajIvj9W3EKuKneUXiXOvcMpm7+U+kwheA2nwIz9W6kBQEDcuVevT55Y8Bf0ZTOi/vBunb3ErnFEVnf6tFeAGVJ1LaF8JyZfp6ZoNvNIoRoNFQqS38rROfoykfJKe7yGgDsVfoE+pbfOY8pwrGJvh6DORpVH4tFb4d9zbJvI55Sa6joZKX1ubqrgvKw2T1o2L0AY2lixi5rPFxxatQTcPbYWLZDnw5LFf2pdbeA6L5ov28A/BGDzGnYzMIbCanP0/CA1i6Z6+8EZMzgg08ZhAOEcsO4EVgT1iuXJjzvpENy5WEazTkWiw6p2Ojc154yqQFTAG47+/4WsbjO98q89nUmCZznr04l/+vY7A0sHOwNPDk9T6H4SYftwC4BcAtAG4B8K4fqtqpqttUtfOmA0BVNwGvAI/gXsi+eQBQ1d8AdgJVYLOI7LopAEiSpNNau01VtwE7RGSziAz/OGv57zbhW63WplTwFSLyqIg8f9MYwXqj8YgqO9NXcLYaY56/2jXfNQBMT9f+Rq3dbtXuUGWr53m752PdG14Fzo+MrvB9b7u1dpMIj7aF4fPzuf4NDcDw8RMPxXG8XYSqiGwuFtt3z/ceN6wK7Nt/4Mk4bu2M43hXHCebuzo7d1+LfW44Bnzr29/tzGaz21ut1kPGmN+9fdXg317L/W4oAL66498eiur17SKCZ8zWjRvW77rWe94wKvDc57/weBRFO+v1+u6oXl95zz1bdi3EvtedAX/wxKc7i8XitnoUPRIEwWd+5Zc/8uRC7n9dASh2dGycmpp8xfO9Tj8IPvz4p8o7FvoM1xUAPwgemahWd2cyma1/8edPDXMzjcHSwM5VKwe3c2vcGtd1/A9wBQVB9YZV1gAAAABJRU5ErkJggg==';
            break;
        default:
            return 'data:image/png;base64,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';
            break;
    }
    //
}
/*************
* users can edit the description of a favorite and assign a menu item.. will
* display the name and address
* params offset - from 0-max
* if the menu item does not have to be assigned
 */
function favoriteEdit(offset){
    var item=favorites[parseInt(offset)];//is this less than the max?
    $('#edit_favorite_name').text(item.name);
    $('#edit_favorite_description').val(item.description);
    $('#edit_favorite_address').text(item.address_1);
    $('#edit_favorite_menu_type').val(item.menu_type);
    $('#edit_favorite_id').data('id',offset);
}
/**************
* saveFavoriteEdit()
* must go through all the favorites and remove the menu_type if it is the same
* as this one
 */
function saveFavoriteEdit(){
    var offset = parseInt($('#edit_favorite_id').data('id'));
    var item = favorites[offset];
    item.menu_type=$('#edit_favorite_menu_type').val();
    removePreviousFavoriteMenuType(item.menu_type);
    item.description=$('#edit_favorite_description').val();
    item.menu_type=$('#edit_favorite_menu_type').val();
    favoriteUpdate(offset);
    //note that if fje favorite is updated should it go back to the edit panel or main panel
    calls.closeWindows('#listFavorites');
}

    /*********
     * removePrevousFavoriteMenuType will search through the favorite list, and remove the
     * menu_type from the item to prevent multiple home or work
      * @param menu_type
     */
    function removePreviousFavoriteMenuType(menu_type){
    if(menu_type==='' || menu_type===null)
        return;
    for(var i=0;i<favorites.length;i++){
        if(favorites[i].menu_type===menu_type){
            favorites[i].menu_type=null;
            favoriteUpdate(i);
        }
    }
}
/*************
* create the favorite data element.  Initial menu item is blank,
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

//note that this has to possibly be sent to the server for a given user
//there will be a limit of 10 locations?
function favoritesSaveLocal(){
    var data = JSON.stringify(favorites);
    localStorage.setItem('favorites',data);
}
//note that local items will not have the individual record='favorite'
function addKeyToArray(array,key,value){
    for(var i=0;i<array.length;i++){
        array[i][key]=value;
    }
}

function favoritesLoadLocal(){
    data=localStorage.getItem("favorites");
    if(data!==null){
        favorites=JSON.parse(data);
        addKeyToArray(favorites,'record','favorite')
    }else
        favorites=[];
}
/*********
* do a default check tha tht eid is there?
 */
function favoriteDelete(id){
    var object = calls.getUserSelect();
    var retval = $.ajax({type: 'POST',
        url: favoriteUrl,
        crossDomain: true,
        data: {
            action: 'deleteFavorite',
            selector: object.selector,
            token: object.token,
            id: id
        },
        dataType: "json"
        });
        //saving local doesn't remove the old item
        retval.error(function(data,status){
            console.log('error delete'+status);
                    var index=_.findIndex(favorites,function(item){
                        return item.id===data.id;
                    });
                    favorites.splice(index,1);
                    displayFavorites();            
            favoritesSaveLocal();
        });
        return retval;
}
/******
* If this is ebing updated then the id should be set
 */
function favoriteUpdate(id){
    console.log('update favorites');
    var string=JSON.stringify(favorites[id]);
    var object = calls.getUserSelect();

    var retval = $.ajax({type: 'POST',
        url: favoriteUrl,
        crossDomain: true,
        data: {
            action: 'updateFavorite',
            selector: object.selector,
            token: object.token,
            favorite: string
        },
        dataType: "json"
        });
        retval.error(function(data,status){
            console.log('error update'+status);
            favoritesSaveLocal();
        });

        return retval;

}
function favoritesLoad(){
    console.log('load favorites');
    var retval=_favoritesLoad();
    retval.done(function(data,status){
        favs=data.data;
        if(data.found>0){
            favorites=JSON.parse(favs);
            buildFavoritesPopup();
        }
    });
    retval.error(function(data,status){
        favoritesLoadLocal();
        calls.buildFavoritesPopup();
    });
    calls.updatePopupMenu();
}

function processFavoriteMenu(item,offset){
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
    /********
     * open favorites, note if not logged in nothing to show
     *
     */
    function displayFavorites(){
        var headerHeight = $('#listFavorites-text-header').css('height').replace(/\D/g, '');
        var footerHeight = $('#listFavorites-text-footer').css('height').replace(/\D/g, '');
        var height = calls.getDeviceHeight() - parseInt(headerHeight) - parseInt(footerHeight) - 16;
        console.log('retrieving favorites');
        $("#listFavoritesBody").html('');
        $('#listFavorites-container').css('height', height);
        var displayString=null;
        for(var i=0;i<favorites.length;i++){
            displayString+="<tr id='favorite_"+i+"' data-id='"+i+"'><td class='listFavorites'>"+
                favorites[i].name+"</td><td class='listFavorites'>"+favorites[i].description+"</td></tr>";
        }
        $("#listFavoritesBody").html(displayString);
        
        for(var i=0;i<favorites.length;i++){
            $('#favorite_'+i).on('click',{number: i},function(event){
                    selectFavorite(event.data.number);
            });
        }
        /* create callbacks for favorite

         */
    }
    function selectFavorite(item){
        if($("#favorite_"+item).hasClass('favorite-select'))
            $("#favorite_"+item).removeClass('favorite-select');
        else
            $("#favorite_"+item).addClass('favorite-select');
    }
    function editFavorites(){
        $(".favorite-select").each(function(){
            var id=$(this).attr('id');
            var id=id.replace('favorite_','');
            console.log("EDIT:"+id);
            favoriteEdit(id);

        });
        calls.closeWindows('#editFavoriteData')

    }

    /********
     *  deleteFavorites()   delete the entries that the user has selected
     *
     *
     */

    function deleteFavorites(){
        $(".favorite-select").each(function(){
            var id=$(this).attr('id');
            id=id.replace('favorite_','');
            var retval=favoriteDelete(favorites[id].id);//make ajax call
            retval.done(function(data,status){
                if(data.status==='ok'){
                    var index=_.findIndex(favorites,function(item){
                        return item.id===data.id;
                    });
                    favorites.splice(index,1);
                    displayFavorites();
                }
            });
            console.log("DELETE:"+id);
        });
    }
/*********
* _favoritesLoad() or even update will require that the popmenus be reprocessed
*
 */
function _favoritesLoad(){
    console.log('retrieve favorites ajax');
    var string=JSON.stringify(favorites);
    var object = calls.getUserSelect();
    var retval = $.ajax({type: 'POST',
        url: favoriteUrl,
        crossDomain: true,
        data: {
            action: 'retrieveFavorites',
            selector: object.selector,
            token: object.token,
            favorites: string
        },
        dataType: "json"
        });
        return retval;
}
function favoritesSave(){
    console.log('save favorites ajax');    
    var retval=_favoritesSave();
    retval.done(function(data,status){
        favs=data.data;
        if(data.found>0)
            favorites=JSON.parse(favs);

    });
    //error use favoriteSaveLocal
    retval.error(function(data,status){
        favoritesSaveLocal();
    });
}
function _favoritesSave(){
    console.log('save favorite ajax');       
    var string=JSON.stringify(favorites);
    var retval;
    var object = calls.getUserSelect();
    //note that if the selector and token is null that means that the
    //user isn't logged in, should just fail
        retval = $.ajax({type: 'POST',
        url: favoriteUrl,
        crossDomain: true,
        data: {
            action: 'saveFavorites',
            selector: object.selector,
            token: object.token,
            favorites: string
        },
        dataType: "json"
        });
    return retval;
}
function ajaxListFavoritesSave(favorites){
    var object = calls.getUserSelect();

    var retval = $.ajax({type: 'POST',
        url: favoriteUrl,
        crossDomain: true,
        data: {
            action: 'retrieveFavorites',
            selector: object.selector,
            token: object.token
        },
        xhrFields: {
            withCredientials: false
        }
    });
    return retval;
}

return init;
});