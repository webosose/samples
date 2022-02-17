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

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */

import {useCallback, useRef, useState} from 'react';
import classNames from 'classnames';
import Image from '@enact/ui/Image';
import PropTypes from 'prop-types';

import {getHeight, getWidth} from '../util/util';
import {useSettingsContext} from '../Context/SettingsContext';
import onErrorImg from '../../../../assets/photovideo_splash.png';
import cssComponet from './Slide.module.less';

const Slide = ({currentSlide, fallBackImg = onErrorImg, imgHeight, imgWidth, isPlaying, setControlsHidden, url, width, rotation = 0}) => {
 const [isImageFailed, setImageFailed] = useState(false);
 const imageSrc = url;
 const sliceRef = useRef();
 const stateSettingsContext = useSettingsContext();
 const contextSettingsState = stateSettingsContext.state || stateSettingsContext;
 const {currentSettings: {Size}} = contextSettingsState;
 const innerHeight = getHeight();
 const innerWidth = getWidth();

 const fitImgWidth =  imgWidth > innerWidth ? innerWidth : imgWidth;
 const fitImgHeight = imgHeight > innerHeight ? innerHeight : imgHeight;

 let fitImageBackground;
 if (Size === 'Original') {
  fitImageBackground = {backgroundSize: `${fitImgWidth}px ${fitImgHeight}px`};
 } else {
  fitImageBackground = (imgWidth > innerWidth && imgHeight > innerHeight || imgWidth > innerHeight) ?
   {backgroundSize: `${innerWidth}px ${innerHeight}px`} :
   {backgroundSize: 'contain'};
 }

 if ([90, 270].includes(rotation)) {
  fitImageBackground = {backgroundSize: `${innerHeight}px auto`};
 }

 const style = {
  minWidth: `${width}px`,
  transform: `rotate(${rotation}deg)`,
  ...fitImageBackground
 };

 const onImgError = useCallback(() => {
  setImageFailed(true);
 }, []);

 const enableControls  = () => {
  if (isPlaying) {
   setControlsHidden(false);
  }
 };

 return (
  <Image
   onClick={enableControls}
   ref={sliceRef}
   key={currentSlide}
   sizing={Size === 'Full' ? 'fill' : 'none'}
   src={isImageFailed ? fallBackImg : imageSrc}
   className={classNames({
    [cssComponet['slide']]: Size === 'Full'
   })}
   style={style}
   onError={onImgError}
  />
 );
};

Slide.propTypes = {
 /**
  * Current slide value.
  *
  * @type {Number}
  * @public
  */
 currentSlide: PropTypes.number,
 /**
  * Current slide value.
  *
  * @type {Number}
  * @public
  */
 fallBackImg: PropTypes.string,
 /**
  * Current slide index.
  *
  * @type {Number}
  * @public
  */
 imgHeight: PropTypes.number,
 imgWidth: PropTypes.number,
 index: PropTypes.number,
 isPlaying: PropTypes.bool,
 /**
  * Slider direction.
  *
  * @type {Number}
  * @public
  */
 rotation: PropTypes.number,
 /**
  * Callback on next slide value change
  *
  * @type {Number}
  * @public
  */
 setControlsHidden: PropTypes.func,
 setNextSlide: PropTypes.func,
 /**
  * Slide URL
  *
  * @type {String}
  * @public
  */
 url: PropTypes.string,
 /**
  * Split width
  *
  * @type {Number}
  * @public
  */
 width: PropTypes.number
};

export default Slide;
