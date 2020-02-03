#ifndef SERVICEREQUEST_H
#define SERVICEREQUEST_H

#include <glib.h>
#include <string>
#include <luna-service2/lunaservice.h>
#include <pbnjson.hpp>
#include <PmLog.h>

static PmLogContext getPmLogContext()
{
    static PmLogContext s_context = 0;
    if (0 == s_context)
    {
        PmLogGetContext("NativeQtApp", &s_context);
    }
    return s_context;
}

class ServiceRequest
{
public:
    ServiceRequest(std::string appId);
    virtual ~ServiceRequest();
    LSHandle* getHandle() const { return m_serviceHandle; }
    void registerApp();

protected:
    LSHandle* acquireHandle();
    void clearHandle();

private:
    GMainLoop* m_mainLoop;
    LSHandle* m_serviceHandle;
    std::string m_appId;
};
#endif
