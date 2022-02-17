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
 isVideoListLoading: false,
 isCurrentVideoLoading: false,
 videoList: [],
 currentVideoMetaData: {},
 videoIndex: -1,
 videoListError: '',
 currentVideoError: ''
};

const videoListReducer = (state = initialState, action) => {
 switch (action.type) {
  case types.FETCH_VIDEO_LIST_REQUEST: {
   return {
    ...state,
    isVideoListLoading: true,
    videoList: [],
    videoListError: ''
   };
  }
  case types.FETCH_VIDEO_LIST_SUCCESS: {
   return {
    ...state,
    isVideoListLoading: false,
    videoList: action.payload,
    videoListError: ''
   };
  }
  case types.FETCH_VIDEO_LIST_ERROR: {
   return {
    ...state,
    isVideoListLoading: false,
    videoList: [],
    videoListError: action.payload
   };
  }
  case types.FETCH_CURRENT_VIDEO_REQUEST: {
   return {
    ...state,
    isCurrentVideoLoading: true,
    currentVideoMetaData: {},
    currentVideoError: ''
   };
  }
  case types.FETCH_CURRENT_VIDEO_SUCCESS: {
   return {
    ...state,
    isCurrentVideoLoading: false,
    videoIndex: action.index,
    currentVideoMetaData: action.payload,
    currentVideoError: ''
   };
  }
  case types.FETCH_CURRENT_VIDEO_ERROR: {
   return {
    ...state,
    isCurrentVideoLoading: false,
    currentVideoMetaData: {},
    currentVideoError: action.payload
   };
  }
  default: return state;
 }
};

export default videoListReducer;
