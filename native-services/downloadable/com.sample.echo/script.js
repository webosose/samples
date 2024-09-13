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

// Private function
var Debug = {
    log: function (str) {
        console.log(str);
        document.getElementById('result').innerHTML = str;
    },
    error: function (str) {
        document.getElementById('result').innerHTML = '<font color="#FF0000">' + str + '</font>';
        console.error(str);
    }
}

// Template code for calling Luna APIs
function LSCall(service, method, parameters, callback) {
    var lunaURL = 'luna://' + service + '/' + method;
    var params = JSON.stringify(parameters);
    var bridge = new WebOSServiceBridge();
    bridge.url = lunaURL;
    bridge.onservicecallback = callback;
    bridge.call(lunaURL, params);
}

/***
* Usage Example. Call luna://com.sample.echo.service/getDataByKey with
* { key : ["name", "age", "gender"] }
* Object parameter
***/
LSCall('com.sample.echo.service', 'echo',
    { input: "WebOSServiceBridge test string" },
    function (returnString) {
        // Response data is JSON-formatted string value. So before using it, it must be parsed
        var returnObject = JSON.parse(returnString);
        // If returnValue is true, then its API operation is successfully done
        // Response data is based on service API implementation
        if (returnObject.returnValue === true) {
            // Assume that its Luna API responds with 'result' data
            Debug.log('Data : ' + JSON.stringify(returnObject));
        }
        // If returnValue is false, then its API operation is failure during running.
        // You can see errorCode and errorText
        else {
            Debug.error('errorCode : ' + returnObject.errorCode);
            Debug.error('errorText : ' + returnObject.errorText);
        }
    }
);
