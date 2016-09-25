/* global Console */

$(document).ready(function() {
    document.addEventListener("deviceready", onDeviceReady, false);
    document.getElementById("submitBtn").addEventListener("click", connect);
    showAlert("caca", "caca");
    //uncomment for testing in Chrome browser
//    onDeviceReady();
});

function onDeviceReady() {
    $(window).unbind();
    $(window).bind('pageshow resize orientationchange', function(e) {
        maxHeight();
    });
    maxHeight();
}

function maxHeight() {
    var h = $('div[data-role="header"]').outerHeight(true);
    var f = $('div[data-role="footer"]').outerHeight(true);
    var w = $(window).height();
    var c = $('div[data-role="content"]');
    var c_h = c.height();
    var c_oh = c.outerHeight(true);
    var c_new = w - h - f - c_oh + c_h;
    var total = h + f + c_oh;
    if (c_h < c.get(0).scrollHeight) {
        c.height(c.get(0).scrollHeight);
    } else {
        c.height(c_new);
    }
}

function connect() {
    var addr = document.getElementById("addrInput").value;
    var pass = document.getElementById("passwordInput").value;
    
    showAlert("caca", "caca");
}

function showAlert(message, title) {
    if (window.navigator.notification) {
        window.navigator.notification.alert(message, null, title, 'OK');
    } else {
        alert(title ? (title + ": " + message) : message);
    }
}
