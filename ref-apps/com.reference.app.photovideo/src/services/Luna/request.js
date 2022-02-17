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

const fwd = res => res;

const handler = (callback, map = fwd) => callback && (res => {
 if ((res.errorCode || res.returnValue === false)) {
  const err = new Error(res.errorText);
  err.code = res.errorCode;
  callback(err);
 } else {
  callback(map(res));
 }
});

const luna =  (
  service,
  method,
  {subscribe = false, timeout = 0, ...params} = {},
  map
) => (
 ({onSuccess, onFailure, onTimeout, onComplete, ...additionalParams} = {}) => {
  const req = new LS2Request();
  req.send({
   service: 'luna://' + service,
   method,
   parameters: Object.assign({}, params, additionalParams),
   onSuccess: handler(onSuccess, map),
   onFailure: handler(onFailure),
   onTimeout: handler(onTimeout),
   onComplete: handler(onComplete, map),
   subscribe,
   timeout
  });
  return req;
 }
);

export default luna;
export {luna};
