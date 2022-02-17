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

import {types} from '../actions/types';

const initialState = {
 isLoading: false,
 deviceList: [],
 error: ''
};

const deviceListReducer = (state = initialState, action) => {
 switch (action.type) {
  case types.FETCH_DEVICE_LIST_REQUEST : {
   return {
    ...state,
    isLoading: true,
    deviceList: [],
    error: ''
   };
  }
  case types.FETCH_DEVICE_LIST_SUCCESS: {
   return {
    ...state,
    isLoading: false,
    deviceList: action.payload,
    error: ''
   };
  }
  case types.FETCH_DEVICE_LIST_ERROR: {
   return {
    ...state,
    isLoading: true,
    deviceList: [],
    error: action.payload
   };
  }
  default: return state;
 }
};

export default deviceListReducer;
