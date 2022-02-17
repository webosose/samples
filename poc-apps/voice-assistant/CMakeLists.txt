cmake_minimum_required(VERSION 2.8.7)
project(voiceui NONE)
set(CMAKE_BUILD_TYPE Debug)

include(webOS/webOS)

webos_modules_init(1 6 3)
webos_component(1 0 0)

set(INSTALL_DIR ${WEBOS_INSTALL_WEBOS_SERVICESDIR}/${CMAKE_PROJECT_NAME})
#install necessary files to destination directory
install(DIRECTORY . DESTINATION ${INSTALL_DIR}
        USE_SOURCE_PERMISSIONS
        PATTERN "*~" EXCLUDE
        PATTERN "CMake*" EXCLUDE
        PATTERN "BUILD*" EXCLUDE
        PATTERN "*~" EXCLUDE
        PATTERN "*.in" EXCLUDE
        PATTERN ".git" EXCLUDE
        PATTERN ".gitignore" EXCLUDE
        PATTERN ".project" EXCLUDE
        PATTERN ".settings" EXCLUDE
        PATTERN "files" EXCLUDE
        PATTERN "test" EXCLUDE
        PATTERN "tempdb" EXCLUDE
        PATTERN "*.qmlproject" EXCLUDE
        PATTERN "README.md" EXCLUDE)

#webos_build_daemon()
webos_build_system_bus_files()