# Copyright (c) 2020 LG Electronics, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0

TARGET = nativeqt

CONFIG += qt
QT += core gui-private
# if you use QT 6.x , you should include opengl. because opengl is not included by default.
# but if you use QT 5.x under, opengl is included by default so you do not include opengl.
greaterThan(QT_MAJOR_VERSION, 5) {
    QT += opengl
}

CONFIG += link_pkgconfig
PKGCONFIG += luna-service2 glib-2.0 pbnjson_cpp PmLogLib

SOURCES += ServiceRequest.cpp MyOpenGLWindow.cpp main.cpp
HEADERS += ServiceRequest.h MyOpenGLWindow.h

INSTALL_APPDIR = $${WEBOS_INSTALL_WEBOS_APPLICATIONSDIR}/com.example.app.nativeqt

target.path = $${INSTALL_APPDIR}

icon.path = $${INSTALL_APPDIR}
icon.files = icon.png

appinfo.path = $${INSTALL_APPDIR}
appinfo.files = appinfo.json

INSTALLS += target icon appinfo
