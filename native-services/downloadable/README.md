Summary
-------
Simple downloadable native service and dummy web application

Description
-----------

Simple downloadable native service and dummy web application
For more details, refer to [Developing Downloadable Native Services | webOS OSE](https://www.webosose.org/docs/tutorials/native-services/developing-downloadable-native-services/).

Dependencies
---------------------

Below are the tools required to build:

* cmake
* make
* pkg-config
* [webOS Native Development Kit | webOS OSE](https://www.webosose.org/docs/guides/setup/setting-up-native-development-kit/)

## Building

Please build, install, and set up the [webOS Native Development Kit | webOS OSE](https://www.webosose.org/docs/guides/setup/setting-up-native-development-kit/)

Then enter the following commands to build it after changing into the directory
under which it was downloaded:
    $ cd com.sample.echo.service
    $ mkdir BUILD
    $ cd BUILD
    $ cmake ..
    $ make

Then you can find the results at output

## Test

Enter the following command to test the service:
    $ luna-send -n 1 -f luna://com.sample.echo.service/echo '{"input":"Hello!"}'
Then you will get the following result.
    {
        "echoMessage": "Hello!",
        "returnValue": true
    }

Copyright and License Information
=================================
Unless otherwise specified, all content, including all source code files and
documentation files in this repository are:

Copyright (c) 2020-2024 LG Electronics, Inc.

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