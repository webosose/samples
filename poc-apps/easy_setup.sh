#!/bin/s

wget --no-check-certificate https://github.com/webosose/samples/archive/refs/heads/master.zip
unzip master.zip -d poc
TEST=$(pwd)
cd poc/samples-master/poc-apps/

opkg install voiceui_1.0.0-r0_raspberrypi4.ipk
cd IPK/Python_packages
opkg install libopencv-core4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-flann4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-imgproc4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-features2d4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-calib3d4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-aruco4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-video4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-bgsegm4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-bioinspired4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-highgui4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libtiff5_4.1.0-r0_raspberrypi4.ipk
opkg install libopencv-imgcodecs4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-ccalib4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-datasets4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-dnn4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-dnn-objdetect4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-dpm4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-objdetect4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-face4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-fuzzy4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-gapi4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-hfs4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-img-hash4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-line-descriptor4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-ml4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-ximgproc4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-optflow4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-phase-unwrapping4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-photo4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-plot4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-quality4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-reg4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-rgbd4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-saliency4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libunwind_1.3.1-r0_raspberrypi4.ipk
opkg install libglog0_0.3.5-r0_raspberrypi4.ipk
opkg install libopencv-sfm4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-shape4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-stereo4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-stitching4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-structured-light4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-videoio4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-superres4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-surface-matching4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-tracking4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-videostab4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-xfeatures2d4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-xobjdetect4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install libopencv-xphoto4.1_4.1.0-r0webos2_raspberrypi4.ipk
opkg install opencv-apps_4.1.0-r0webos2_raspberrypi4.ipk
opkg install opencv-samples_4.1.0-r0webos2_raspberrypi4.ipk
opkg install python3-nose_1.3.7-r0_raspberrypi4.ipk
opkg install python3-numpy_1.17.4-r0_raspberrypi4.ipk
opkg install python3-opencv_4.1.0-r0webos2_raspberrypi4.ipk
opkg install opencv_4.1.0-r0webos2_raspberrypi4.ipk
opkg install wikipedia_1.4.0-r0_raspberrypi4.ipk
opkg install libxslt_1.1.34-r0_raspberrypi4.ipk --nodeps
opkg install python3-lxml_4.5.0-r0_raspberrypi4.ipk
opkg install python3-webencodings_0.5.1-r0_raspberrypi4.ipk
opkg install python3-html5lib_1.0.1-r0_raspberrypi4.ipk
opkg install python3-soupsieve_1.9.4-r0_raspberrypi4.ipk
opkg install python3-beautifulsoup4_4.8.2-r0_raspberrypi4.ipk
opkg install bs4_0.0.1-r0_raspberrypi4.ipk
opkg install libsamplerate0_0.1.9-r1_raspberrypi4.ipk
opkg install libjack_1.19.14-r0_raspberrypi4.ipk
opkg install portaudio-v19_v190600-r0_raspberrypi4.ipk
opkg install python3-pyaudio_0.2.11-r0_raspberrypi4.ipk
opkg install python3-speech-recognition_3.8.1-r0_raspberrypi4.ipk --nodeps
opkg install google-api-core_1.26.3-r0_raspberrypi4.ipk
opkg install google-api-python-client_1.0-r0_raspberrypi4.ipk
opkg install httplib2_0.19.1-r0_raspberrypi4.ipk
opkg install python3-pyparsing_2.4.6-r0_raspberrypi4.ipk
opkg install python3-uritemplate_3.0.1-r0_raspberrypi4.ipk
opkg install google-auth_1.30.1-r0_raspberrypi4.ipk
opkg install google-auth-oauthlib_1.0-r0_raspberrypi4.ipk
opkg install python3-cachetools_4.1.0-r0_raspberrypi4.ipk
opkg install oauth2client_1.0-r0_raspberrypi4.ipk
opkg install python3-protobuf_3.14.0-r0_raspberrypi4.ipk --nodeps
opkg install googleapis-common-protos_1.53.0-r0_raspberrypi4.ipk
opkg install proto-plus_1.19.2-r0_raspberrypi4.ipk
opkg install python3-packaging_20.3-r0_raspberrypi4.ipk
opkg install python3-atomicwrites_1.3.0-r0_raspberrypi4.ipk
opkg install python3-attrs_19.3.0-r0_raspberrypi4.ipk
opkg install python3-pathlib2_2.3.5-r0_raspberrypi4.ipk
opkg install python3-more-itertools_8.2.0-r0_raspberrypi4.ipk
opkg install python3-zipp_0.6.0-r0_raspberrypi4.ipk
opkg install python3-importlib-metadata_1.5.2-r0_raspberrypi4.ipk
opkg install python3-pluggy_0.13.1-r0_raspberrypi4.ipk
opkg install python3-py_1.8.1-r0_raspberrypi4.ipk
opkg install python3-wcwidth_0.1.8-r0_raspberrypi4.ipk
opkg install python3-pytest_5.3.5-r0_raspberrypi4.ipk
opkg install google-cloud-speech_2.9.1-r0_raspberrypi4.ipk
opkg install python3-grpcio_1.37.0-r0_raspberrypi4.ipk --nodeps
opkg install python3-pytz_2019.3-r0_raspberrypi4.ipk
opkg install libprotobuf26_3.15.2-r0webos2_raspberrypi4.ipk --nodeps
opkg install gtts_1.0-r0_raspberrypi4.ipk
opkg install python3-pip_20.0.2-r0_raspberrypi4.ipk
pip3 install oauthlib==3.1.1
pip3 install google-auth-httplib2

cd $TEST
rm -rf poc
rm master.zip
