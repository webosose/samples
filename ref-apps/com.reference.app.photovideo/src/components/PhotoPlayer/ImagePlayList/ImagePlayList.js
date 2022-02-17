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

/* eslint-disable react/jsx-no-bind */

import PropTypes from 'prop-types';
import ImageItem from '@enact/sandstone/ImageItem/ImageItem';
import {VirtualGridList} from '@enact/sandstone/VirtualList/VirtualList';
import ri from '@enact/ui/resolution';
import placeHolderImg from '../../../../assets/photovideo_splash.png';
import css from './ImagePlayList.module.less';

const ImagePlayList = ({imageList, updateCurrentIndex}) => {
 const renderItem = ({index, ...rest}) => {
  let thumbPath = imageList[index].file_path;
  let encodedPath = thumbPath.replace(/ /g, '%20');

  if (thumbPath && thumbPath.substring(0, 1) === '/') {
   encodedPath = 'file:///' + encodedPath;
  }

  return (
   <ImageItem
    {...rest}
    css={css}
    src={encodedPath}
    placeholder={placeHolderImg}
    onClick={() => updateCurrentIndex(index)}
   />
  );
 };
 imageList = imageList || [];
 return (
  imageList.length === 0 ?
   <h3>No Photo, Video or folders exist in storage device</h3 > :
   <VirtualGridList
    direction="horizontal"
    dataSize={imageList.length}
    itemRenderer={renderItem}
    itemSize={{
     minWidth: ri.scale(300),
     minHeight: ri.scale(200)
    }}
    spacing={ri.scale(0.2)}
   />
 );
};

ImagePlayList.propTypes = {
 imageList: PropTypes.array,
 index: PropTypes.number,
 updateCurrentIndex: PropTypes.func
};

ImagePlayList.default = {
 imageList: []
};

export default ImagePlayList;
