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
