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

const SettingsReducer = (state, action) => {
 switch (action.type) {
  case 'SET_SIZE':
   return {
    ...state,
    currentSettings: {...state.currentSettings, Size: action.value}
   };
  case 'SET_TRANSITION':
   return {
    ...state,
    currentSettings: {...state.currentSettings, Transition: action.value}
   };
  case 'SET_SPEED':
   return {
    ...state,
    currentSettings: {...state.currentSettings, Speed: action.value}
   };
  case 'SET_SONG':
   return {
    ...state,
    song: action.value[0]
   };
  default:
   return state;
 }
};

export default SettingsReducer;
