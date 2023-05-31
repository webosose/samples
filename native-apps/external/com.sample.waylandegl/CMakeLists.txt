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

cmake_minimum_required(VERSION 2.8.7)
project(wayland_egl C CXX)

include_directories(${CMAKE_SOURCE_DIR})
include_directories(${CMAKE_SOURCE_DIR}/src)
include_directories(${CMAKE_SOURCE_DIR}/include)

include(FindPkgConfig)

pkg_check_modules(WLCLIENT REQUIRED wayland-webos-client)
include_directories(${WLCLIENT_INCLUDE_DIRS})

pkg_check_modules(WLEGL REQUIRED wayland-egl)
include_directories(${WLEGL_INCLUDE_DIRS})

pkg_check_modules(GLESV2 REQUIRED glesv2)
include_directories(${GLESV2_INCLUDE_DIRS})

set(BIN_NAME wayland_egl)

set(SRC_LIST
        ${CMAKE_SOURCE_DIR}/src/wayland_egl.c
)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/pkg_$ENV{OECORE_TARGET_ARCH}/")
add_executable(${BIN_NAME} ${SRC_LIST})
set_target_properties(${BIN_NAME} PROPERTIES LINKER_LANGUAGE C)

target_link_libraries (${BIN_NAME}
        ${WLCLIENT_LDFLAGS}
        ${WLEGL_LDFLAGS}
        -lEGL
        ${GLESV2_LDFLAGS}
)

# copy appinfo.json file to output folder
if(EXISTS "${CMAKE_SOURCE_DIR}/appinfo.json")
    file(COPY "${CMAKE_SOURCE_DIR}/appinfo.json" DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY})
else()
    MESSAGE( "'appinfo.json' file was not found !!")
endif()

# copy icon.png file to output folder
if(EXISTS "${CMAKE_SOURCE_DIR}/icon.png")
    file(COPY "${CMAKE_SOURCE_DIR}/icon.png" DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY})
else()
    MESSAGE( "'icon.png' file was not found !!")
endif()
