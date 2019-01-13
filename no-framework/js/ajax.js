
( function(window) {

    'use strict';
    var ajax = {
        get : get
    };

    function get(url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url + (data ? '?' + dataToUrl(data) : ''));
        xhr.onload = function () {
            if (xhr.status === 200) {
                callback(null, JSON.parse(xhr.responseText));
            }
            else {
                callback(new Error('Request failed.  Returned status of ' + xhr.status));
            }
        };
        xhr.send();
    }

    function dataToUrl(object) {
        var encodedString = '';
        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                if (encodedString.length > 0) {
                    encodedString += '&';
                }
                encodedString += encodeURI(prop + '=' + object[prop]);
            }
        }
        return encodedString;
    }

    window.ajax = ajax;

})(window);