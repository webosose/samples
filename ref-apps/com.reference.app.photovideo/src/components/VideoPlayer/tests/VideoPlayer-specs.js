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

import {shallow} from 'enzyme';
import {VideoPlayer} from '../VideoPlayer';

describe('VideoPlayer', () => {
 test(
  'should render `Video Player`',
  () => {
   const subject = shallow(
    <VideoPlayer />
   );
   const videoWrapper = subject.find('.videoPlayer');
   const expected = true;
   const actual = videoWrapper.exists();
   expect(expected).toBe(actual);
  }
 );

 test(
  'should render `video`',
  () => {
   const subject = shallow(
    <VideoPlayer />
   );
   const videoWrapper = subject.find('.videoPlayer');

   let videoPlayer =  videoWrapper.children().children();
   const expected = 3;
   const actual = videoPlayer.length;

   expect(expected).toBe(actual);
  }
 );
});
