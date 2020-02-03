#include "MyOpenGLWindow.h"
#include <QtGui/QOpenGLContext>
#include <QtGui/QOpenGLPaintDevice>
#include <QtGui/QPainter>

MyOpenGLWindow::MyOpenGLWindow(QWindow *parent)
    : QWindow(parent)
{
    setSurfaceType(QWindow::OpenGLSurface);
    create();

    m_context = new QOpenGLContext(this);
    m_context->create();

    m_context->makeCurrent(this);
    initializeOpenGLFunctions();
}

MyOpenGLWindow::~MyOpenGLWindow()
{
    delete m_device;
}

void MyOpenGLWindow::render()
{
    m_context->makeCurrent(this);

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);

    m_device = new QOpenGLPaintDevice;
    m_device->setSize(size() * devicePixelRatio());
    m_device->setDevicePixelRatio(devicePixelRatio());

    QRect rect = geometry();
    QPainter painter(m_device);

    QFont font = painter.font();
    font.setPointSize(50);
    font.setStyleHint(QFont::Helvetica, QFont::PreferAntialias);

    painter.setFont(font);
    painter.setRenderHint(QPainter::HighQualityAntialiasing);
    painter.setPen(Qt::yellow);
    painter.drawText(rect, Qt::AlignCenter, "Hello, Native Qt Application!!");

    m_context->swapBuffers(this);
}

void MyOpenGLWindow::exposeEvent(QExposeEvent *event)
{
    Q_UNUSED(event);
    if (isExposed()){
        render();
    }
}
