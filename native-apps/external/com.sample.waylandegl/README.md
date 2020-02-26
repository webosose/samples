Summary
-------
Simple external native application using wayland and EGL

Description
-----------

Simple external native application using wayland and EGL
Please refer to below link for more details
"Developing External Native Apps" section at [webOS OSE](https://www.webosose.org)

Dependencies
---------------------

Below are the tools required to build:

* cmake
* make
* pkg-config
* webOS Native Development Kit at [webOS OSE](https://www.webosose.org)

## Building

Please make, install and setup the native development kit based on
"Native Development Kit Setup" section at [webOS OSE](https://www.webosose.org)

Then enter the following commands to build it after changing into the directory
under which it was downloaded:
    $ mkdir BUILD
    $ cd BUILD
    $ cmake ..
    $ make

Then you can find the results at ../pkg_arm

Copyright and License Information
=================================
Unless otherwise specified, all content, including all source code files and
documentation files in this repository are:

Copyright (c) 2020 LG Electronics, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
