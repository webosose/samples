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

import {useReducer, useCallback} from 'react';
import settingsReducer from '../Reducers/settingsReducer';
import Menu from '../Menu';

const initialState = {
 heading: 'Video Settings',
 type: 'subMenu',
 level: '',
 disable: false,
 items: {
  resumePlay: {
   name: 'Resume Play',
   type: 'toggle',
   value: false,
   disabled: false
  },
  customizeSpeed: {
   name: 'Customize Speed',
   type: 'subMenu',
   disabled: false,
   children: {
    heading: 'Customize Speed',
    subHeading: 'Adjust speed between 0.1x and 2.0x by 0.1',
    type: 'slider',
    index: 0,
    items: [
     {
      type: 'slider',
      value: 1.0,
      name: 1.0
     }
    ]
   }
  },
  audioTrack: {
   name: 'Audio Track',
   type: 'subMenu',
   disabled: false,
   children: {
    heading: 'Audio Track',
    type: 'radio',
    index: 0,
    items: [
     {
      type: 'radio',
      name: '1 English VP8',
      value: 'english'
     },
     {
      type: 'radio',
      name: '2 Spanish MPEG-4',
      value: 'Spanish'
     },
     {
      type: 'radio',
      name: '3 French MPEG-4',
      value: 'French'
     }
    ]
   }
  },
  dualMonoSetting: {
   name: 'Dual Mono Setting',
   type: 'subMenu',
   disabled: false,
   children: {
    heading: 'Dual Mono Setting',
    type: 'radio',
    index: 0,
    items: [
     {
      type: 'radio',
      name: 'Main',
      value: 'main'
     },
     {
      type: 'radio',
      name: 'Sub',
      value: 'sub'
     },
     {
      type: 'radio',
      name: 'Main + Sub',
      value: 'main'
     }
    ]
   }
  }
 }
};

const Settings = ({position}) => {

 const [state, dispatch] = useReducer(settingsReducer, initialState);
 const itemLevel = state.level;
 const menuItem = state.items;

 const handleNavigate = useCallback((value) => {
  dispatch({type: 'navigate', payload: value});
 }, []);

 const handleSelect = useCallback((item) => {
  dispatch({type: 'selected', payload: item.selected});
 }, []);

 return (!state.disable &&
 <Menu
  handleNavigate={handleNavigate}
  handleSelect={handleSelect}
  heading={itemLevel !== '' ? menuItem[itemLevel].children.heading : state.heading}
  list={itemLevel !== '' ? menuItem[itemLevel].children.items : menuItem}
  radioIndex={itemLevel !== '' && menuItem[itemLevel].children.index}
  subHeading={itemLevel !== '' ? menuItem[itemLevel].children.subHeading : ''}
  type={itemLevel !== '' ? menuItem[itemLevel].children.type : state.type}
  {...{position}}
 />
 );
};

export default Settings;
