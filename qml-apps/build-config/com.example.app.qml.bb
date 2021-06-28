# Copyright (c) 2020 LG Electronics, Inc.

SUMMARY = "QML App"
SECTION = "webos/apps"
LICENSE = "Apache-2.0"
LIC_FILES_CHKSUM = "file://${COMMON_LICENSE_DIR}/Apache-2.0;md5=89aea4e17d99a7cacdbeed46a0096b10"

DEPENDS = "qtbase qt-features-webos qtdeclarative pmloglib"
RDEPENDS_${PN} += "qml-webos-framework qml-webos-bridge"

WEBOS_VERSION="1.0.0"
PR = "r0"

inherit webos_qmake6
inherit webos_submissions
inherit webos_app

FILES_${PN} += "${webos_applicationsdir}"
