cmake_minimum_required(VERSION 2.8.7)
project(com.example.service.native CXX)
set(CMAKE_BUILD_TYPE Debug)

include(webOS/webOS)
webos_modules_init(1 6 3)
webos_component(0 0 1)

include(FindPkgConfig)

pkg_check_modules(GLIB2 REQUIRED glib-2.0)
include_directories(${GLIB2_INCLUDE_DIRS})
webos_add_compiler_flags(ALL ${GLIB2_CFLAGS_OTHER})

pkg_check_modules(LUNASERVICE2 REQUIRED luna-service2)
include_directories(${LUNASERVICE2_INCLUDE_DIRS})
webos_add_compiler_flags(ALL ${LUNASERVICE2_CFLAGS_OTHER})

pkg_check_modules(PMLOG REQUIRED PmLogLib)
include_directories(${PMLOG_INCLUDE_DIRS})
webos_add_compiler_flags(ALL ${PMLOG_CFLAGS_OTHER})

pkg_check_modules(PBNJSON_CPP REQUIRED pbnjson_cpp)
include_directories(${PBNJSON_CPP_INCLUDE_DIRS})
webos_add_compiler_flags(ALL ${PBNJSON_CPP_CFLAGS_OTHER})

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")
set(SRCS main.cpp)

add_executable(${PROJECT_NAME} ${SRCS})

SET (EXT_LIBS
    ${GLIB2_LDFLAGS}
    ${LUNASERVICE2_LDFLAGS}
    ${PMLOG_LDFLAGS}
    ${PBNJSON_CPP_LDFLAGS}
)

target_link_libraries(${PROJECT_NAME} ${EXT_LIBS})

install(TARGETS ${PROJECT_NAME} DESTINATION ${WEBOS_INSTALL_SBINDIR})

webos_build_system_bus_files()
webos_build_configured_file(files/systemd/com.example.service.native.service SYSCONFDIR systemd/system)