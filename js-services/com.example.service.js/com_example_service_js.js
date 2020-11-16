// Copyright (c) 2020 LG Electronics, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-License-Identifier: Apache-2.0

var Service = require('webos-service');

// Register com.example.service.js
var service = new Service("com.example.service.js");

// A method that always returns the same value
service.register("hello", function(message) {
    console.log("[com.example.service.js]", "SERVICE_METHOD_CALLED:hello");
    message.respond({
        answer: "Hello, JS Service!!"
    });
});

// Call another service
service.register("time", function(message) {
    service.call("luna://com.webos.service.systemservice/clock/getTime", {}, function(m2) {
        console.log("[com.example.service.js]", "SERVICE_METHOD_CALLED:com.webos.service.systemservice/clock/getTime");
        const response = "You appear to have your UTC set to: " + m2.payload.utc;
        message.respond({message: response});
    });
});
