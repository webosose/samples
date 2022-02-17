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

export default {
 heading: 'Subtitle',
 type: 'subMenu',
 level: '',
 disable: false,
 items: {
  track: {
   name: 'Track',
   type: 'subMenu',
   disabled: false,
   children: {
    heading: 'Track',
    type: 'radio',
    index: 0,
    items: [
     {
      type: 'radio',
      name: '1 (KR)',
      value: '1kr'
     },
     {
      type: 'radio',
      name: '2 (US)',
      value: '2us'
     },
     {
      type: 'radio',
      name: '3 (XX)',
      value: '3xx'
     },
     {
      type: 'radio',
      name: '4 (XX)',
      value: '4xx'
     },
     {
      type: 'radio',
      name: '5 (XX)',
      value: '5xx'
     },
     {
      type: 'radio',
      name: '6 (XX)',
      value: '6xx'
     },
     {
      type: 'radio',
      name: '7 (XX)',
      value: '7xx'
     },
     {
      type: 'radio',
      name: '8 (XX)',
      value: '8xx'
     }
    ]
   }
  },
  codePage: {
   name: 'Code Page',
   type: 'subMenu',
   disabled: false,
   children: {
    heading: 'Code Page',
    subHeading: 'Language List',
    type: 'radio',
    index: 0,
    items: [
     {
      type: 'radio',
      name: '{Language 1}',
      value: 'Language 1'
     },
     {
      type: 'radio',
      name: '{Language 2}',
      value: 'Language 2'
     },
     {
      type: 'radio',
      name: '{Language 3}',
      value: 'Language 3'
     },
     {
      type: 'radio',
      name: '{Language 4}',
      value: 'Language 4'
     },
     {
      type: 'radio',
      name: '{Language 5}',
      value: 'Language 5'
     },
     {
      type: 'radio',
      name: '{Language 6}',
      value: 'Language 6'
     },
     {
      type: 'radio',
      name: '{Language 7}',
      value: 'Language 7'
     },
     {
      type: 'radio',
      name: '{Language 8}',
      value: 'Language 8'
     }
    ]
   }
  },
  sync: {
   name: 'Sync',
   type: 'subMenu',
   disabled: false,
   children: {
    heading: 'Sync',
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
  position: {
   name: 'Position',
   type: 'subMenu',
   disabled: false,
   children: {
    heading: 'Position',
    type: 'radio',
    index: 4,
    items: [
     {
      type: 'radio',
      name: '4',
      value: 4
     },
     {
      type: 'radio',
      name: '3',
      value: 3
     },
     {
      type: 'radio',
      name: '2',
      value: 2
     },
     {
      type: 'radio',
      name: '1',
      value: 1
     },
     {
      type: 'radio',
      name: '0(Default)',
      value: 0
     },
     {
      type: 'radio',
      name: '-1',
      value: -1
     },
     {
      type: 'radio',
      name: '-2',
      value: -2
     },
     {
      type: 'radio',
      name: '-3',
      value: -3
     }
    ]
   }
  },
  size: {
   name: 'Size',
   type: 'subMenu',
   disabled: false,
   children: {
    heading: 'Size',
    type: 'radio',
    index: 2,
    items: [
     {
      type: 'radio',
      name: 'Very Small',
      value: 'vsmall'
     },
     {
      type: 'radio',
      name: 'Small',
      value: 'small'
     },
     {
      type: 'radio',
      name: 'Normal',
      value: 'normal'
     },
     {
      type: 'radio',
      name: 'Big',
      value: 'big'
     },
     {
      type: 'radio',
      name: 'Very Big',
      value: 'vbig'
     }
    ]
   }
  },
  color: {
   name: 'Color',
   type: 'subMenu',
   disabled: false,
   children: {
    heading: 'Color',
    type: 'radio',
    index: 0,
    items: [
     {
      type: 'radio',
      name: 'White',
      value: 'white'
     },
     {
      type: 'radio',
      name: 'Gray',
      value: 'gray'
     },
     {
      type: 'radio',
      name: 'Yellow',
      value: 'yellow'
     },
     {
      type: 'radio',
      name: 'Green',
      value: 'green'
     },
     {
      type: 'radio',
      name: 'Blue',
      value: 'blue'
     },
     {
      type: 'radio',
      name: 'Red',
      value: 'red'
     }
    ]
   }
  }
 }
};
