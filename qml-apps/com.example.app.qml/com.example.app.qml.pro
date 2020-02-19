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

TEMPLATE = aux
!load(webos-variables):error("Cannot load webos-variables.prf")

# install
defined(WEBOS_INSTALL_WEBOS_APPLICATIONSDIR, var) {
    INSTALL_APPDIR = $$WEBOS_INSTALL_WEBOS_APPLICATIONSDIR/com.example.app.qml
    target.path = $$INSTALL_APPDIR

    appinfo.path = $$INSTALL_APPDIR
    appinfo.files = appinfo.json

    base.path = $$INSTALL_APPDIR
    base.files = main.qml

    icon.path = $$INSTALL_APPDIR
    icon.files = icon.png

    INSTALLS += target appinfo base icon
}
