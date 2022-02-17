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

import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@enact/sandstone/Icon/Icon';
import componentCss from './Navigation.module.less';

const Navigation = ({iconSize = 'large', isPlaying = true, leftIconClick, rigthIconClick, togglePlay}) => {
 return (
  <div className={componentCss.navigationWrapper} >
   <Icon
    className={componentCss.icon}
    disabled={isPlaying}
    onClick={leftIconClick}
    size={iconSize}
    title=""
   >
    jumpbackward
   </Icon>
   <Icon
    className={componentCss.icon}
    onClick={togglePlay}
    size={iconSize}
    title=""
   >
    {isPlaying ? 'pause' : 'play'}
   </Icon>
   <Icon
    className={componentCss.icon}
    disabled={isPlaying}
    onClick={rigthIconClick}
    size={iconSize}
    title=""
   >
    jumpforward
   </Icon>
  </div>
 );
};


Navigation.propTypes = {
 /**
  * Size of the Icons.
  *
  * @type {String}
  * @public
  */
 iconSize: PropTypes.string,

 /**
  * Size of the isPlaying.
  *
  * @type {String}
  * @public
  */
 isPlaying: PropTypes.bool,

 /**
  * Callback for letfIcon.
  *
  * @type {String}
  * @public
  */

 leftIconClick: PropTypes.func,
 /**
  * Callback for rightIcon.
  *
  * @type {String}
  * @public
  */

 rigthIconClick: PropTypes.func,
 /**
  * Callback for toggleButton.
  *
  * @type {String}
  * @public
  */

 togglePlay: PropTypes.func
};

export default React.memo(Navigation);
