SECTION = "webos/apps"
LICENSE = "Apache-2.0"
LIC_FILES_CHKSUM = "file://${COMMON_LICENSE_DIR}/Apache-2.0;md5=89aea4e17d99a7cacdbeed46a0096b10"

WEBOS_VERSION = "1.0.0"
PR = "r0"

inherit webos_component
inherit webos_submissions
inherit webos_cmake
inherit webos_app
inherit webos_arch_indep

FILES_${PN} += "${webos_applicationsdir}"