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


import {memo} from 'react';
import PropTypes from 'prop-types';

import Feedback from './Feedback';
import states from './FeedbackIcons.js';
/**
 * FeedbackContent {@link goldstone/VideoPlayer}. This displays the media's playback rate and other
 * information.
 *
 * @function FeedbackContent
 * @memberof goldstone/VideoPlayer
 * @ui
 * @private
 */
const FeedbackContentBase = ({children, playbackRate, playbackState, feedbackVisible, visible, ...rest}) => {
 return (
  <div {...rest} style={!visible ? {display: 'none'} : null}>
   <Feedback
    playbackState={playbackState}
    visible={feedbackVisible}
   >
    {playbackRate}
   </Feedback>
   {children}
  </div>
 );
};

FeedbackContentBase.displayName = 'FeedbackContent';
FeedbackContentBase.propTypes = {
 /**
  * If the current `playbackState` allows the feedback component's visibility to be changed,
  * the feedback component will be hidden. If not, setting this property will have no effect.
  * All `playbackState`s respond to this property except the following:
  * `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`.
  *
  * @type {Boolean}
  * @default true
  * @public
  */
 feedbackVisible: PropTypes.bool,

 /**
  * Value of the feedback playback rate
  *
  * @type {String|Number}
  * @public
  */
 playbackRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

 /**
  * Refers to one of the following possible media playback states.
  * `'play'`, `'pause'`, `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`,
  * `'jumpBackward'`, `'jumpForward'`, `'jumpToStart'`, `'jumpToEnd'`, `'stop'`.
  *
  * Each state understands where its related icon should be positioned, and whether it should
  * respond to changes to the `visible` property.
  *
  * This string feeds directly into {@link goldstone/FeedbackIcon.FeedbackIcon}.
  *
  * @type {String}
  * @public
  */
 // playbackState: PropTypes.oneOf(Object.keys(states)),
 playbackState: PropTypes.oneOf(Object.keys(states)),

 /**
  * The visibility of the component. When `false`, the component will be hidden.
  *
  * @type {Boolean}
  * @default true
  * @public
  */
 visible: PropTypes.bool
};
FeedbackContentBase.defaultProps = {
 feedbackVisible: true,
 visible: true
};

const FeedbackContent = memo(
 FeedbackContentBase,
 (prevProp, nextProp) => {
  if (!prevProp.visible && prevProp.visible === nextProp.visible &&
   (prevProp.children !== nextProp.children)
  ) {
   return true;
  }

  return false;
 }
);

export default FeedbackContent;
export {
 FeedbackContent,
 FeedbackContentBase
};
