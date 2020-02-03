TARGET = nativeqt

CONFIG += qt
QT += core gui-private

CONFIG += link_pkgconfig
PKGCONFIG += luna-service2 glib-2.0 pbnjson_cpp PmLogLib

SOURCES += ServiceRequest.cpp MyOpenGLWindow.cpp main.cpp
HEADERS += ServiceRequest.h MyOpenGLWindow.h

INSTALL_APPDIR = $${WEBOS_INSTALL_WEBOS_APPLICATIONSDIR}/com.example.app.nativeqt

target.path = $${INSTALL_APPDIR}

icon.path = $${INSTALL_APPDIR}
icon.files = icon.png

appinfo.path = $${INSTALL_APPDIR}
appinfo.files = appinfo.json

INSTALLS += target icon appinfo