cmake_minimum_required(VERSION 2.8.7)
project(com.example.service.js NONE)
set(CMAKE_BUILD_TYPE Debug)

include(webOS/webOS)

webos_modules_init(1 6 3)
webos_component(0 0 1)

set(INSTALL_DIR ${WEBOS_INSTALL_WEBOS_SERVICESDIR}/${CMAKE_PROJECT_NAME})
#install necessary files to destination directory
install(DIRECTORY . DESTINATION ${INSTALL_DIR}
        USE_SOURCE_PERMISSIONS
        PATTERN "*~" EXCLUDE
        PATTERN "CMake*" EXCLUDE
        PATTERN "build*" EXCLUDE
        PATTERN "oe-*" EXCLUDE
        PATTERN "*.lock" EXCLUDE
        PATTERN "*.in" EXCLUDE
        PATTERN "files" EXCLUDE
        PATTERN "README.md" EXCLUDE)

webos_build_system_bus_files()