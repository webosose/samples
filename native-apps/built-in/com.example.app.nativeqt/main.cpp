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

#include "MyOpenGLWindow.h"
#include "ServiceRequest.h"
#include <QtGui/QGuiApplication>
#include <QtGui/QWindow>
#include <QtGui/QScreen>
#include <qpa/qplatformnativeinterface.h>

int main(int argc, char **argv)
{
    QGuiApplication app(argc, argv);
    PmLogInfo(getPmLogContext(), "MAIN_ARGV1", 1, PMLOGKFV("argv", "%s", argv[1]),  " ");

    QString displayId = (getenv("DISPLAY_ID") ? getenv("DISPLAY_ID") : "0");
    PmLogInfo(getPmLogContext(), "DISPLAY", 1, PMLOGKFV("Id", "%s", displayId.toStdString().c_str()),  " ");

    QScreen *screen = QGuiApplication::primaryScreen();
    QRect screenGeometry = screen->geometry();
    MyOpenGLWindow window(screenGeometry);
    window.resize(screenGeometry.width(), screenGeometry.height());
    window.show();

    ServiceRequest s_request("com.example.app.nativeqt", window);
    s_request.registerApp();

    QGuiApplication::platformNativeInterface()->setWindowProperty(window.handle(), "appId", "com.example.app.nativeqt");
    QGuiApplication::platformNativeInterface()->setWindowProperty(window.handle(), "displayAffinity", displayId);

    return app.exec();
}
