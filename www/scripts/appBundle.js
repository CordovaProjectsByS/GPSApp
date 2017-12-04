// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var GPSApp;
(function (GPSApp) {
    "use strict";
    var Application;
    (function (Application) {
        function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            var geoloactionSuccess, geolacationOptions;
            navigator.geolocation.getCurrentPosition(onSuccess);
        }
        function onSuccess(position) {
            console.log(position.coords.latitude);
        }
        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }
        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }
    })(Application = GPSApp.Application || (GPSApp.Application = {}));
    window.onload = function () {
        Application.initialize();
    };
})(GPSApp || (GPSApp = {}));
//# sourceMappingURL=appBundle.js.map