#include "MyOpenGLWindow.h"
#include "ServiceRequest.h"
#include <QtGui/QGuiApplication>
#include <QtGui/QWindow>
#include <QtGui/QScreen>
#include <qpa/qplatformnativeinterface.h>

int main(int argc, char **argv)
{
    QGuiApplication app(argc, argv);
    PmLogInfo(getPmLogContext(), "MAIN_ARGV1", 1, PMLOGKFV("argv", "%s", argv[1]),  " ");

    QScreen *screen = QGuiApplication::primaryScreen();
    QRect screenGeometry = screen->geometry();
    MyOpenGLWindow window;
    window.resize(screenGeometry.width(), screenGeometry.height());
    window.show();

    ServiceRequest s_request("com.example.app.nativeqt");
    s_request.registerApp();

    QGuiApplication::platformNativeInterface()->setWindowProperty(window.handle(), QStringLiteral("appId"), QStringLiteral("com.example.app.nativeqt"));

    return app.exec();
}
