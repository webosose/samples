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
 isImageListLoading: false,
 imageList: [],
 imageIndex: -1,
 imageListError: ''
};

const imageListReducer = (state = initialState, action) => {
 switch (action.type) {
  case types.FETCH_IMAGE_LIST_REQUEST: {
   return {
    ...state,
    isImageListLoading: true,
    imageList: [],
    imageListError: ''
   };
  }
  case types.FETCH_IMAGE_LIST_SUCCESS: {
   return {
    ...state,
    isImageListLoading: false,
    imageList: action.payload,
    imageListError: ''
   };
  }
  case types.FETCH_IMAGE_LIST_ERROR: {
   return {
    ...state,
    isImageListLoading: false,
    imageList: [],
    imageListError: action.payload
   };
  }
  default: return state;
 }
};

export default imageListReducer;
