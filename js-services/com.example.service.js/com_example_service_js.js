var Service = require('webos-service');
var pmloglib = require('pmloglib');
var context = new pmloglib.Context("exampleJSService");

// Register com.example.service.js
var service = new Service("com.example.service.js");

// A method that always returns the same value
service.register("hello", function(message) {
    message.respond({
        answer: "Hello, JS Service!!"
    });
});

// Call another service
service.register("locale", function(message) {
    service.call("luna://com.webos.settingsservice/getSystemSettings", {"key":"localeInfo"}, function(m2) {
        context.log(pmloglib.LOG_INFO, "LOCALE_CALLBACK", {"SERVICE_NAME": "exampleJSService"}, "get locale response");
        var response = "You appear to have your locale set to: " + m2.payload.settings.localeInfo.locales.UI;
        message.respond({
            message: response
        });
    });
});
