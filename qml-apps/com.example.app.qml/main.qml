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

import QtQuick 2.4
import WebOSServices 1.0
import Eos.Window 0.1
import PmLog 1.0

WebOSWindow {
    id: root
    width: 1920
    height: 1080
    visible: true
    appId: "com.example.app.qml"
    title: "QML app"
    color: "lightblue"

    Text {
        id: mainText
        anchors.centerIn: parent
        font.family: "Helvetica"
        font.pointSize: 50
        text: "Hello, QML Appplication!!"
    }

    property var launchParams: params
    onLaunchParamsChanged: {
        pmLog.info("LAUNCH_PARAMS", {"params": launchParams})
    }

    Service {
        id: systemService
        appId: "com.example.app.qml"

        function getTime() {
            call("luna://com.webos.service.systemservice","/clock/getTime","{}")
        }

        onResponse: {
            var jsonObject = JSON.parse(payload);
            pmLog.info("GETTIME", {"utc": jsonObject.utc});
            mainText.text = "UTC : " + jsonObject.utc
        }

        onError: {
            var jsonObject = JSON.parse(payload);
            pmLog.error("GETTIME", {"error": jsonObject});
        }
    }

    MouseArea {
        anchors.fill: parent
        onClicked: systemService.getTime()
    }

    onWindowStateChanged: {
        pmLog.info("WINDOW_CHANGED", {"status": windowState})
    }

    PmLog {
        id: pmLog
        context: "QMLApp"
    }
}
