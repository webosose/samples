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

/**
 * Item for files
 *
 * @module PhotoHeader
 */
import classNames from 'classnames';
import {Marquee} from '@enact/sandstone/Marquee/Marquee';
import PropTypes from 'prop-types';
import {Component} from 'react';
import css from './PhotoHeader.module.less';

class PhotoHeader extends Component {
 static propTypes = {
  /**
   * The current image to be displayed.
   *
   * @type {Object}
   * @public
   */
  currentPhoto: PropTypes.object
 };

 constructor (props) {
  super(props);
  this.state = {
   animation: css.show
  };
 }

 hideHeader = () => {
  this.setState({animation: css.show});
 };

 showHeader = () => {
  this.setState({animation: css.show});
 };

 toggleHeader = () => {
  const {animation} = this.state;
  if (animation === css.hide) {
   this.showHeader();
  } else if (animation === null || animation === css.show) {
   this.hideHeader();
  }
 };

 changeFileSize (fileSize) {
  if (typeof fileSize === 'undefined' || !fileSize) {
   return '';
  }
  let bytes = parseInt(fileSize),
   s = ['Bytes', 'KB', 'MB'],
   e = Math.floor(Math.log(bytes) / Math.log(1024));

  if (!isFinite(e)) {
   return '0 ' + s[0];
  } else {
   return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + s[e];
  }
 }

 findResolution (width, height) {
  let res = width > 0 && height > 0 ? `${width} X ${height}` : '';
  return res;
 }

 getDateTimeFromString (date) {
  return new Date(date).toLocaleString().split(', ');
 }

 render = () => {
  const
   {className, currentPhoto, ...rest} = this.props,
   {animation} = this.state,
   classes = classNames(className, css.playerInfoHeader, animation),
   fileName = currentPhoto && currentPhoto.title ? currentPhoto.title : '',
   size = currentPhoto && currentPhoto.file_size ? this.changeFileSize(currentPhoto.file_size) : 0,
   resolution = this.findResolution(currentPhoto.width, currentPhoto.height),
   [date, time] = this.getDateTimeFromString(currentPhoto.last_modified_date),
   ariaText = fileName + '\n' + (size ? size : '') + '\n' + (resolution ? resolution : '');

  delete rest.currentPhoto;
  delete rest.dispatch;

  return (
   <div
    {...rest}
    aria-owns="IDpanel"
    data-spotlight-container-disabled={(animation === css.hide)}
    className={classes}
    role="region"
    aria-label={ariaText}
   >
    <Marquee marqueeOn="render" aria-label={fileName} className={css.playerInfoTitle}>{fileName}</Marquee>
    <div>
     {size ?
      <span>
       <div className={css.playerInfoSubTitle} aria-label={size}>{size}</div>
      </span> :
      null
     }
     {size && resolution ?
      <span>
       <div className={css.playerInfoSubTitle}>|</div>
      </span> :
      null
     }
     {resolution ?
      <span>
       <div className={css.playerInfoSubTitle} aria-label={resolution}>{resolution}</div>
      </span> :
      null
     }
    </div>
    <div>
     {date ?
      <span>
       <div className={css.playerInfoSubTitle} aria-label={date}>{date}</div>
      </span> :
      null
     }
     {date && time ?
      <span>
       <div className={css.playerInfoSubTitle}>|</div>
      </span> :
      null
     }
     {time ?
      <span>
       <div className={css.playerInfoSubTitle}>{time}</div>
      </span> :
      null
     }
    </div>
   </div>
  );
 };
}

export default PhotoHeader;
