# Copyright (c) 2020-2024 LG Electronics, Inc.

SUMMARY = "Native service sample"
AUTHOR = "Author's name <Author's e-mail>"
LICENSE = "Apache-2.0"
LIC_FILES_CHKSUM = "file://${COMMON_LICENSE_DIR}/Apache-2.0;md5=89aea4e17d99a7cacdbeed46a0096b10"

DEPENDS= "glib-2.0 luna-service2 pmloglib libpbnjson"

WEBOS_VERSION = "0.0.1"
PR = "r0"

inherit webos_component
inherit webos_submissions
inherit webos_daemon
inherit webos_cmake
inherit webos_system_bus

# systemd configuration move from component repository to meta layer
FILESEXTRAPATHS:prepend := "${THISDIR}/${BPN}:"
inherit webos_systemd
WEBOS_SYSTEMD_SERVICE = "com.example.service.native.service"
