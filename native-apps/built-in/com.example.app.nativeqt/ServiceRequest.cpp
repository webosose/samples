// Copyright (c) 2020 LG Electronics, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-License-Identifier: Apache-2.0

#include "ServiceRequest.h"

static pbnjson::JValue convertStringToJson(const char *rawData)
{
    pbnjson::JInput input(rawData);
    pbnjson::JSchema schema = pbnjson::JSchemaFragment("{}");
    pbnjson::JDomParser parser;
    if (!parser.parse(input, schema))
    {
        return pbnjson::JValue();
    }
    return parser.getDom();
}

static std::string convertJsonToString(const pbnjson::JValue json)
{
    return pbnjson::JGenerator::serialize(json, pbnjson::JSchemaFragment("{}"));
}

ServiceRequest::ServiceRequest(std::string appId)
    : m_mainLoop(g_main_loop_new(nullptr, false))
    , m_serviceHandle(nullptr)
{
    m_appId = appId;
    m_serviceHandle = acquireHandle();
}

ServiceRequest::~ServiceRequest()
{
    clearHandle();
    if (m_mainLoop)
    {
        g_main_loop_quit(m_mainLoop); // optional!
        g_main_loop_unref(m_mainLoop);
        m_mainLoop = nullptr;
    }
}

LSHandle* ServiceRequest::acquireHandle()
{
    LSError lserror;
    LSErrorInit(&lserror);

    LSHandle* handle = nullptr;
    if (!LSRegister(m_appId.c_str(), &handle, &lserror))
    {
        LSErrorPrint(&lserror, stderr);
        return nullptr;
    }

    if (!LSGmainAttach(handle, m_mainLoop, &lserror))
    {
        LSErrorPrint(&lserror, stderr);
        return nullptr;
    }
    return handle;
}

void ServiceRequest::clearHandle()
{
    LSError lserror;
    LSErrorInit(&lserror);
    if (m_serviceHandle)
    {
        LSUnregister(m_serviceHandle, &lserror);
        m_serviceHandle = nullptr;
    }
}

static bool registerAppCallback(LSHandle* sh, LSMessage* msg, void* ctx)
{
    PmLogInfo(getPmLogContext(), "REGISTER_CALLBACK", 1, PMLOGJSON("payload", LSMessageGetPayload(msg)),  " ");

    pbnjson::JValue response = convertStringToJson(LSMessageGetPayload(msg));
    bool successCallback = response["returnValue"].asBool();
    if (successCallback)
    {
        std::string event = response["event"].asString();
        PmLogInfo(getPmLogContext(), "REGISTER_CALLBACK", 1, PMLOGKS("event", event.c_str()),  " ");

        if (event == "registered")
        {
            //handle "registered" event
        }
        else if (event == "relaunch")
        {
            //handle "relaunch" event
            if (response.hasKey("parameters"))
            {
                pbnjson::JValue launchParams = response["parameters"];
                PmLogInfo(getPmLogContext(), "REGISTER_CALLBACK", 1,
                            PMLOGJSON("parameters", convertJsonToString(launchParams).c_str()),  " ");
            }
        }
        else if (event == "close")
        {
            //handle "close" event
        }
    }
    else
    {
        PmLogError(getPmLogContext(), "REGISTER_CALLBACK", 0, "RegisterApp Callback error" );
        // error handling..
    }
    return true;
}

void ServiceRequest::registerApp()
{
    PmLogInfo(getPmLogContext(), "APP_REGISTER", 0, "RegisterApp called");
    LSError lserror;
    LSErrorInit(&lserror);
    LSHandle* handle = getHandle();
    if (!handle)
    {
        PmLogError(getPmLogContext(), "APP_REGISTER", 0, "LSHandle is NULL" );
    }

    if (!LSCall(handle,
                "luna://com.webos.service.applicationmanager/registerApp",
                "{}",
                registerAppCallback,
                NULL,
                NULL,
                &lserror))
    {
        LSErrorPrint(&lserror, stderr);
    }
}
