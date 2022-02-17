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
import classNames from 'classnames';
import FeedbackIcon from './FeedbackIcon';
import states from './FeedbackIcons.js';

import css from './Feedback.module.less';
/**
 * Feedback {@link goldstone/VideoPlayer}. This displays the media's playback rate and other
 * information.
 *
 * @function Feedback
 * @memberof goldstone/VideoPlayer
 * @ui
 * @private
 */
const FeedbackBase = ({children, playbackState, visible, ...rest}) => {
 const childrenUpdated = () => {
  if (states[playbackState]) {
   // Working with a known state, treat `children` as playbackRate
   if (states[playbackState].message && children !== 1) { // `1` represents a playback rate of 1:1
    return children.toString().replace(/^-/, '') + states[playbackState].message;
   } else {
    // Custom Message
    return children;
   }
  }
 };

 return (
  <div className={classNames({[css.feedback]: true, [css.hidden]: !visible})} {...rest}>
   {(states[playbackState] && states[playbackState].position === 'before') && <FeedbackIcon>{playbackState}</FeedbackIcon>}
   {childrenUpdated() && <div className={css.message}>{childrenUpdated()}</div>}
   {states[playbackState] && states[playbackState].position === 'after' && <FeedbackIcon>{playbackState}</FeedbackIcon>}
  </div>
 );
};

FeedbackBase.displayName = 'Feedback';
FeedbackBase.propTypes = {
 children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
 /**
  * Refers to one of the following possible media playback states.
  * `'play'`, `'pause'`, `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`,
  * `'jumpBackward'`, `'jumpForward'`, `'jumpToStart'`, `'jumpToEnd'`, `'stop'`.
  *
  * Each state understands where its related icon should be positioned, and whether it should
  * respond to changes to the `visible` property.
  *
  * This string feeds directly into {@link sandstone/FeedbackIcon.FeedbackIcon}.
  *
  * @type {String}
  * @public
  */
 playbackState: PropTypes.oneOf(Object.keys(states)),
 /**
  * If the current `playbackState` allows this component's visibility to be changed,
  * this component will be hidden. If not, setting this property will have no effect.
  * All `playbackState`s respond to this property except the following:
  * `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`.
  *
  * @type {Boolean}
  * @default true
  * @public
  */
 visible: PropTypes.bool



};
FeedbackBase.defaultProps = {
 visible: true
};

const Feedback = memo(FeedbackBase);
export default Feedback;
export {
 Feedback,
 FeedbackBase
};
