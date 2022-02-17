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
 isAudioListLoading: false,
 isCurrentAudioLoading: false,
 audioList: [],
 currentAudioMetaData: {},
 audioIndex: -1,
 audioListError: '',
 currentAudioError: ''
};

const audioListReducer = (state = initialState, action) => {
 switch (action.type) {
  case types.FETCH_AUDIO_LIST_REQUEST: {
   return {
    ...state,
    isAudioListLoading: true,
    audioList: [],
    audioListError: ''
   };
  }
  case types.FETCH_AUDIO_LIST_SUCCESS: {
   return {
    ...state,
    isAudioListLoading: false,
    audioList: action.payload,
    audioListError: ''
   };
  }
  case types.FETCH_AUDIO_LIST_ERROR: {
   return {
    ...state,
    isAudioListLoading: false,
    audioList: [],
    audioListError: action.payload
   };
  }
  case types.FETCH_CURRENT_AUDIO_REQUEST: {
   return {
    ...state,
    isCurrentAudioLoading: true,
    currentAudioMetaData: {},
    currentAudioError: ''
   };
  }
  case types.FETCH_CURRENT_AUDIO_SUCCESS: {
   return {
    ...state,
    isCurrentAudioLoading: false,
    audioIndex: action.index,
    currentAudioMetaData: action.payload,
    currentAudioError: ''
   };
  }
  case types.FETCH_CURRENT_AUDIO_ERROR: {
   return {
    ...state,
    isCurrentAudioLoading: false,
    currentAudioMetaData: {},
    currentAudioError: action.payload
   };
  }
  default: return state;
 }
};

export default audioListReducer;
