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

import React from "react";
/**
 * Create a time object (hour, minute, second) from an amount of seconds
 *
 * @param  {Number|String} value A duration of time represented in seconds
 *
 * @returns {Object}       An object with keys {hour, minute, second} representing the duration
 *                        seconds provided as an argument.
 * @private
 */
const parseTime = (value) => {
  value = parseFloat(value);
  const time = {};
  const hour = Math.floor(value / (60 * 60));
  time.minute = Math.floor((value / 60) % 60);
  time.second = Math.floor(value % 60);
  if (hour) {
    time.hour = hour;
  }
  return time;
};

/**
 * Generate a time usable by <time datetime />
 *
 * @param  {Number|String} seconds A duration of time represented in seconds
 *
 * @returns {String}      String formatted for use in a `datetime` field of a `<time>` tag.
 * @private
 */
const secondsToPeriod = (seconds) => {
  return "P" + seconds + "S";
};

/**
 * Make a human-readable time
 *
 * @param  {Number|String} seconds A duration of time represented in seconds
 * @param {DurationFmt} durfmt An instance of a {@link i18n/ilib/lib/DurationFmt.DurationFmt} object
 *                             from iLib confugured to display time used by the {@Link VideoPlayer}
 *                             component.
 * @param  {Object} config Additional configuration object that includes `includeHour`.
 *
 * @returns {String}      Formatted duration string
 * @private
 */
const secondsToTime = (seconds, durfmt, config) => {
  const includeHour = config && config.includeHour;

  if (durfmt) {
    const parsedTime = parseTime(seconds);
    const timeString = durfmt.format(parsedTime).toString();

    if (includeHour && !parsedTime.hour) {
      return "00:" + timeString;
    } else {
      return timeString;
    }
  }

  return includeHour ? "00:00:00" : "00:00";
};

/**
 * Calculates numeric value of playback rate (with support for fractions).
 *
 * @private
 */
const calcNumberValueOfPlaybackRate = (rate) => {
  const pbArray = String(rate).split("/");
  return pbArray.length > 1
    ? parseInt(pbArray[0]) / parseInt(pbArray[1])
    : parseInt(rate);
};

/**
 * Safely count the children nodes and exclude null & undefined values for an accurate count of
 * real children
 *
 * @param {component} children React.Component or React.PureComponent
 * @returns {Number} Number of children nodes
 * @private
 */
const countReactChildren = (children) =>
  React.Children.toArray(children).filter((n) => n != null).length;
const getEncodedPath = (path) => {
  let encodedPath = "";
  if (path && path.length > 0) {
    encodedPath = encodeURIComponent(path);
    if (path && path.substring(0, 1) === "/") {
      encodedPath = "file:///" + encodedPath;
    }
    encodedPath = encodedPath.replace(/ /g, "%20");
  }
  return encodedPath;
};

export {
  calcNumberValueOfPlaybackRate,
  countReactChildren,
  parseTime,
  secondsToPeriod,
  secondsToTime,
  getEncodedPath,
};
