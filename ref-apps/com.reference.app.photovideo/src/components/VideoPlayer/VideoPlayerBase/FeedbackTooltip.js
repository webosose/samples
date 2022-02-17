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


import {memo, useCallback} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ComponentOverride from '@enact/ui/ComponentOverride';
import EnactPropTypes from '@enact/core/internal/prop-types';

import Image from '@enact/sandstone/Image';
import Skinnable from '@enact/sandstone/Skinnable';

import FeedbackContent from './FeedbackContent';
import states from './FeedbackIcons.js';
import {secondsToTime} from './util';

import css from './FeedbackTooltip.module.less';

/**
 * FeedbackTooltip {@link goldstone/VideoPlayer}. This displays the media's playback rate and
 * time information.
 *
 * @function FeedbackTooltip
 * @memberof goldstone/VideoPlayer
 * @ui
 * @private
 */
const FeedbackTooltipBase = ({
 action,
 children,
 className,
 duration,
 formatter,
 hidden,
 playbackRate,
 playbackState,
 thumbnailComponent,
 thumbnailDeactivated,
 thumbnailSrc,
 ...rest
}) => {

 const thumbnailComponentUpdated = useCallback(() => {
  if (action === 'focus') {
   if (thumbnailComponent) {
    return <ComponentOverride
     component={thumbnailComponent}
     className={css.thumbnail}
     key="thumbnailComponent"
    />;
   } else if (thumbnailSrc) {
    return (
     <div className={css.thumbnail} key="thumbnailComponent">
      <Image src={thumbnailSrc} className={css.image} />
     </div>
    );
   }
  }
 }, [action, thumbnailComponent, thumbnailSrc]);

 delete rest.action;
 delete rest.duration;
 delete rest.formatter;
 delete rest.hidden;
 delete rest.orientation;
 delete rest.thumbnailDeactivated;
 delete rest.thumbnailSrc;
 delete rest.visible;

 return (
  <div className={classNames({[css.feedbackTooltip]: true, [css.hidden]: hidden && states[playbackState] && states[playbackState].allowHide, [css.thumbnailDeactivated]: thumbnailDeactivated, [css.shift]: action === 'focus' && (thumbnailComponent || thumbnailSrc), className})} {...rest} >
   <div className={css.alignmentContainer}>
    {thumbnailComponentUpdated(action, thumbnailComponent, thumbnailSrc)}
    <FeedbackContent
     className={css.content}
     feedbackVisible={(action !== 'focus' || action === 'idle') && !(action === 'blur' && playbackState === 'play')}
     key="feedbackContent"
     playbackRate={playbackRate}
     playbackState={playbackState}
    >
     {secondsToTime(children * duration, formatter)}
    </FeedbackContent>
    <div className={classNames({[css.arrowContainer]: true, [css.hidden]: action !== 'focus' || (!thumbnailComponent && !thumbnailSrc)})}>
     <div className={css.arrow} />
    </div>
   </div>
  </div>
 );
};
FeedbackTooltipBase.displayName = 'FeedbackTooltip';
FeedbackTooltipBase.propTypes = {
 /**
  * Invoke action to display or hide tooltip.
  *
  * @type {String}
  * @default 'idle'
  */
 action: PropTypes.oneOf(['focus', 'blur', 'idle']),

 /**
  * Duration of the curent media in seconds
  *
  * @type {Number}
  * @default 0
  * @public
  */
 duration: PropTypes.number,

 /**
  * Instance of `NumFmt` to format the time
  *
  * @type {Objct}
  * @public
  */
 formatter: PropTypes.object,

 /**
  * If the current `playbackState` allows this component's visibility to be changed,
  * this component will be hidden. If not, setting this property will have no effect.
  * All `playbackState`s respond to this property except the following:
  * `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`.
  *
  * @type {Boolean}
  * @default false
  * @public
  */
 hidden: PropTypes.bool,

 /**
  * Part of the API required by `ui/Slider` but not used by FeedbackTooltip which only
  * supports horizontal orientation
  *
  * @type {String}
  * @private
  */
 orientation: PropTypes.string,

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
 playbackState: PropTypes.oneOf(Object.keys(states)),

 /**
  * This component will be used instead of the built-in version. The internal thumbnail style
  * will be applied to this component. This component follows the same rules as the built-in
  * version; hiding and showing according to the state of `action`.
  *
  * This can be a tag name as a string, a rendered DOM node, a component, or a component
  * instance.
  *
  * @type {String|Component|Element}
  * @public
  */
 thumbnailComponent: EnactPropTypes.renderableOverride,

 /**
  * `true` if Slider knob is scrubbing.
  *
  * @type {Boolean}
  * @public
  */
 thumbnailDeactivated: PropTypes.bool,

 /**
  * Set a thumbnail image source to show on VideoPlayer's Slider knob. This is a standard
  * {@link goldstone/Image} component so it supports all of the same options for the `src`
  * property. If no `thumbnailSrc` is set, no tooltip will display.
  *
  * @type {String|Object}
  * @public
  */
 thumbnailSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

 /**
  * Required by the interface for sandstone/Slider.tooltip but not used here
  *
  * @type {Boolean}
  * @default true
  * @public
  */
 visible: PropTypes.bool
};
FeedbackTooltipBase.defaultProps = {
 action: 'idle',
 hidden: false,
 thumbnailDeactivated: false
};

const FeedbackTooltip = Skinnable(memo(FeedbackTooltipBase));
export default FeedbackTooltip;
export {
 FeedbackTooltip,
 FeedbackTooltipBase
};
