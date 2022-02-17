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

const provider = require('./Luna');
const requests = {};

// Cancel an active request by name and remove from mapping
const cancelRequest = name => {
 if (requests[name]) {
  requests[name].cancel();
  requests[name] = null;
 }
};
// Cancel all active requests of all categories
const cancelAllRequests = (exclude = []) =>
 Object.keys(requests).filter(r => !exclude.includes(r)).forEach(cancelRequest);

// Utility wrapper function to auto-remove completed from requests object
const handleCleanup = (name, fn) => ({subscribe, onComplete, ...rest}) => (
 fn({
  subscribe,
  ...rest,
  onComplete: res => {
   if (!subscribe) cancelRequest(name);
   if (onComplete) onComplete(res);
  }
 })
);

// Service API endpoints and cancellation functions
const Service = {
 cancelAllRequests,
 cancelRequest
};

const categories = Object.keys(provider);
// const compositeService = composite(Service, requests);

// Add category provider APIs to service namespace
categories.forEach(c => {
 Service[c] = {};
 const endpoints = Object.keys(provider[c]);
 endpoints.forEach(name => {
  Service[c][name] = handleCleanup(name, provider[c][name]);
 });

 // Add any composite services for the category
 // Object.assign(Service[c], compositeService[c]);

 Service[c].cancelAllRequests = (exclude = []) =>
  Object.keys(Service[c]).filter(r => !exclude.includes(r)).forEach(cancelRequest);
});

export default Service;
export const {
 Device,
 Video,
 Image
} = Service;

export {
 Service,
 requests,
 categories,
 cancelRequest,
 cancelAllRequests
};
