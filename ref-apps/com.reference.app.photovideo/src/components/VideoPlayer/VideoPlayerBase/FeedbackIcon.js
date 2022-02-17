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

import PropTypes from 'prop-types';
import Skinnable from '@enact/sandstone/Skinnable/Skinnable';
import Icon from '@enact/sandstone/Icon/Icon';
import iconMap from './FeedbackIcons.js';
import classNames from 'classnames';

import css from './Feedback.module.less';

/**
 * Feedback Icon for {@link goldstone/VideoPlayer.Feedback}.
 *
 * @function FeedbackIcon
 * @memberof sandstone/VideoPlayer
 * @mixes sandstone/Skinnable
 * @ui
 * @private
 */
const FeedbackIconBase = ({children, className}) => {
 return (
  children && <Icon className={`${classNames({[css.icon]: true})} ${className}`}>{children && iconMap[children] && iconMap[children].icon}</Icon>
 );
};

FeedbackIconBase.displayName = 'FeedbackIcon';
FeedbackIconBase.propTypes = {
 /**
  * Refers to one of the following possible media playback states.
  * `'play'`, `'pause'`, `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`,
  * `'jumpBackward'`, `'jumpForward'`, `'jumpToStart'`, `'jumpToEnd'`, `'stop'`.
  *
  * @type {String}
  * @public
  */
 children: PropTypes.oneOf(Object.keys(iconMap))
};

const FeedbackIcon = Skinnable(FeedbackIconBase);
export default FeedbackIcon;
export {
 FeedbackIcon,
 FeedbackIconBase
};
