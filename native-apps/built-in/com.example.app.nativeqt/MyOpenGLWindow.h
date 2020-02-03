#ifndef MYOPENGLWINDOW_H
#define MYOPENGLWINDOW_H

#include <QtGui/QWindow>
#include <QtGui/QOpenGLFunctions>

QT_BEGIN_NAMESPACE
class QPainter;
class QOpenGLContext;
class QOpenGLPaintDevice;
QT_END_NAMESPACE

class MyOpenGLWindow : public QWindow, protected QOpenGLFunctions
{
    Q_OBJECT
public:
    explicit MyOpenGLWindow(QWindow *parent = 0);
    ~MyOpenGLWindow();

    virtual void render();

protected:
    void exposeEvent(QExposeEvent *event) override;

    QOpenGLContext *m_context;
    QOpenGLPaintDevice *m_device;
};
#endif
