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
import {secondsToPeriod, secondsToTime} from './util';
import css from './VideoPlayer.module.less';

/**
 * Times {@link goldstone/VideoPlayer}.
 *
 * @function Times
 * @memberof goldstone/VideoPlayer
 * @ui
 * @private
 */
const TimesBase = ({current, formatter, noCurrentTime, noTotalTime, total, ...rest}) => {
 const currentPeriod = secondsToPeriod(current);
 const currentReadable = secondsToTime(current, formatter);
 const noSeparator = noCurrentTime || noTotalTime;
 const totalPeriod = secondsToPeriod(total);
 const totalReadable = secondsToTime(total, formatter);

 return (
  <div {...rest}>
   {
    !noCurrentTime && <time className={css.currentTime} dateTime={currentPeriod}>{currentReadable}</time>
   }
   {
    !noSeparator && <span className={css.separator}>/</span>
   }
   {
    !noTotalTime && <time className={css.totalTime} dateTime={totalPeriod}>{totalReadable}</time>
   }
  </div>
 );
};

TimesBase.displayName = 'Times';
TimesBase.propTypes = {
 /**
  * An instance of a Duration Formatter from i18n. {@link i18n/ilib/lib/DurationFmt.DurationFmt}
  *
  * @type {Object}
  * @required
  * @public
  */
 formatter: PropTypes.object.isRequired,

 /**
  * The current time in seconds of the video source.
  *
  * @type {Number}
  * @default 0
  * @public
  */
 current: PropTypes.number,

 /**
  * Removes the current time.
  *
  * @type {Boolean}
  * @public
  */
 noCurrentTime: PropTypes.bool,

 /**
  * Removes the total time.
  *
  * @type {Boolean}
  * @public
  */
 noTotalTime: PropTypes.bool,

 /**
  * The total time (duration) in seconds of the loaded video source.
  *
  * @type {Number}
  * @default 0
  * @public
  */
 total: PropTypes.number
};

TimesBase.defaultProps = {
 current: 0,
 total: 0
};

const Times = memo(TimesBase);

export default Times;
export {
 Times,
 TimesBase
};
