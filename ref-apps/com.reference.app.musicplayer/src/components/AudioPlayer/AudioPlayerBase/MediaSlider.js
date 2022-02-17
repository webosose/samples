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

import React, { memo } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Slider from "@enact/sandstone/Slider";

import MediaKnob from "./MediaKnob";
import MediaSliderDecorator from "./MediaSliderDecorator";

import css from "./AudioPlayer.module.less";

/**
 * The base component to render a customized [Slider]{@link goldstone/Slider.Slider} for use in
 * [VideoPlayer]{@link goldstone/VideoPlayer.VideoPlayer}.
 *
 * @function MediaSliderBase
 * @memberof goldstone/VideoPlayer
 * @ui
 * @private
 */
const MediaSliderBase = ({
  children,
  forcePressed,
  preview,
  previewProportion,
  visible,
  ...rest
}) => {
  return (
    <div
      className={classNames({
        [css.sliderFrame]: true,
        [css.hidden]: !visible,
      })}
    >
      <Slider
        {...rest}
        tooltip={children}
        aria-hidden="true"
        className={classNames({
          [css.pressed]: forcePressed,
          [css.mediaSlider]: true,
        })}
        css={css}
        knobComponent={
          <MediaKnob preview={preview} previewProportion={previewProportion} />
        }
        max={1}
        min={0}
        step={0.00001}
      />
    </div>
  );
};
MediaSliderBase.displayName = "MediaSlider";
MediaSliderBase.propTypes = {
  /**
   * When `true`, the knob will expand. Note that Slider is a controlled
   * component. Changing the value would only affect pressed visual and
   * not the state.
   *
   * @type {Boolean}
   * @public
   */
  forcePressed: PropTypes.bool,

  /**
   * Allow moving the knob via pointer or 5-way without emitting `onChange` events
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  preview: PropTypes.bool,

  /**
   * The position of the knob when in `preview` mode
   *
   * @type {Number}
   * @public
   */
  previewProportion: PropTypes.number,

  /**
   * The visibility of the component. When `false`, the component will be hidden.
   *
   * @type {Boolean}
   * @default true
   * @public
   */
  visible: PropTypes.bool,
};
MediaSliderBase.defaultProps = {
  preview: false,
  visible: true,
};

const MediaSlider = memo(
  MediaSliderDecorator(MediaSliderBase),
  (prevProp, nextProp) => {
    if (
      !prevProp.visible &&
      prevProp.visible === nextProp.visible &&
      prevProp.value !== nextProp.value
    ) {
      return true;
    }

    return false;
  }
);

export default MediaSlider;
export { MediaSlider, MediaSliderBase };
