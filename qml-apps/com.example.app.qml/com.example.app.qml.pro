TEMPLATE = aux
!load(webos-variables):error("Cannot load webos-variables.prf")

# install
defined(WEBOS_INSTALL_WEBOS_APPLICATIONSDIR, var) {
    INSTALL_APPDIR = $$WEBOS_INSTALL_WEBOS_APPLICATIONSDIR/com.example.app.qml
    target.path = $$INSTALL_APPDIR

    appinfo.path = $$INSTALL_APPDIR
    appinfo.files = appinfo.json

    base.path = $$INSTALL_APPDIR
    base.files = main.qml

    icon.path = $$INSTALL_APPDIR
    icon.files = icon.png

    INSTALLS += target appinfo base icon
}