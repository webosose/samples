// Copyright (c) 2021 LG Electronics, Inc.
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

import LS2Request from '@enact/webos/LS2Request';

export const dbServices = {
 createKind : (cb) => {
  return new LS2Request().send({
   service: 'luna://com.webos.service.db',
   method: 'putKind',
   parameters: {
    'id':'com.reference.app.service.familyeventplanner:4',
    'owner':'com.reference.app.familyeventplanner',
    'indexes':[
     {'name':'year', 'props':[{'name':'year'}]},
     {'name':'month', 'props':[{'name':'month'}]},
     {'name':'date', 'props':[{'name':'date'}]},
     {'name':'fullDate', 'props':[{'name':'year'}, {'name':'month'}, {'name':'date'}]}
    ]
   },
   onSuccess: (res) => {
    console.log('Success response :: ', res);
    cb(res);
   },
   onFailure: (res) => {
    console.log('Failed response :: ', res);
    cb(res);
   }
  });
 },
 putData : (obj, cb) => {
  return new LS2Request().send({
   service: 'luna://com.webos.service.db',
   method: 'put',
   parameters: {
    'objects':[
     obj
    ]
   },
   onSuccess: (res) => {
    console.log('Success response :: ', res);
    cb(res);
   },
   onFailure: (res) => {
    console.log('Failed response :: ', res);
    cb(res);
   }
  });
 },
 findData : (queryObj, cb) => {
  return new LS2Request().send({
   service: 'luna://com.webos.service.db',
   method: 'find',
   parameters: {
    'query': queryObj
   },
   onSuccess: (res) => {
    console.log('Success response :: ', res);
    cb(res);
   },
   onFailure: (res) => {
    console.log('Failed response :: ', res);
    cb(res);
   }
  });
 },
 deleteEvent: (id) => {
  return new LS2Request().send({
   service: 'luna://com.webos.service.db',
   method: 'del',
   parameters: {
    'ids' : [id]
   },
   onSuccess: (res) => {
    console.log('Success response :: ', res);
   },
   onFailure: (res) => {
    console.log('Failed response :: ', res);
   }
  });
 }
};
