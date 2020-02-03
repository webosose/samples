cmake_minimum_required(VERSION 2.8.7)
project(com.example.app.web NONE)
include(webOS/webOS)
webos_modules_init(1 0 0 QUALIFIER RC4)

set(INSTALL_DIR ${WEBOS_INSTALL_WEBOS_APPLICATIONSDIR}/${CMAKE_PROJECT_NAME})
#install necessary files to destination directory
install(DIRECTORY . DESTINATION ${INSTALL_DIR}
        PATTERN "*~" EXCLUDE
        PATTERN "CMake*" EXCLUDE
        PATTERN "build*" EXCLUDE
        PATTERN "README.md" EXCLUDE
        PATTERN "oe-*" EXCLUDE
        PATTERN "*.lock" EXCLUDE)