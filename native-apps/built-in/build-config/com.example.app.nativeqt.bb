# Copyright (c) 2020 LG Electronics, Inc.

SUMMARY = "Native Qt App"
SECTION = "webos/apps"
LICENSE = "Apache-2.0"
LIC_FILES_CHKSUM = "file://${COMMON_LICENSE_DIR}/Apache-2.0;md5=89aea4e17d99a7cacdbeed46a0096b10"

WEBOS_VERSION = "1.0.0"
PR = "r0"

DEPENDS = "qtbase luna-service2 glib-2.0 libpbnjson"

inherit webos_submissions
inherit webos_qmake6
inherit webos_app

OE_QMAKE_PATH_HEADERS = "${OE_QMAKE_PATH_QT_HEADERS}"

FILES_${PN} += "${webos_applicationsdir}"
