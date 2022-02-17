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

// import React from 'react';
import PropTypes from 'prop-types';
import ImageItem from '@enact/sandstone/ImageItem';
import {VirtualGridList} from '@enact/sandstone/VirtualList';
import ri from '@enact/ui/resolution';
import VideoImg from '../../../assets/icons/video.png';
import placeHolderImg from '../../../assets/icons/image.png';

const MediaList = ({videoList, imageList, handleNavigate}) => {
 for(var i=0;i<videoList.length;i++){
  videoList[i].mediaType="video";
 }
 let mediaList = imageList.concat(videoList);
    const renderItem = ({index, ...rest}) => {
  let thumbPath = mediaList[index].mediaType && mediaList[index].mediaType === "video" ? mediaList[index].thumbnail : mediaList[index].file_path;
  let encodedPath = thumbPath.replace(/ /g, '%20');
  if (thumbPath && thumbPath.substring(0, 1) === '/') {
   encodedPath = 'file:///' + encodedPath;
  }
  return (
   <ImageItem
    {...rest}
    src={encodedPath}
    placeholder={mediaList[index].mediaType && mediaList[index].mediaType === "video"? VideoImg : placeHolderImg}
    onClick={() => mediaList[index].mediaType && mediaList[index].mediaType === "video" ? 
      handleNavigate('/videoplayer', mediaList[index], index-imageList.length): 
      handleNavigate('/photoPlayer', mediaList[index], index)
    }
   >
    {mediaList[index].title}
   </ImageItem>
  );
 };
 videoList = videoList || [];
 imageList = imageList || [];

 return(
  mediaList.length === 0 ?
   <h3>No Photo or Video folders are exists in storage device</h3 > :
   <VirtualGridList
    direction='vertical'
    dataSize={mediaList.length}
    itemRenderer={renderItem}
    itemSize={{
     minWidth: ri.scale(500),
     minHeight: ri.scale(500)
    }}
   />
 );
}

MediaList.propTypes = {
 handleNavigate: PropTypes.func.isRequired,
 videoList: PropTypes.array,
 imageList: PropTypes.array
};

MediaList.default = {
 videoList: [],
 imageList:[]
};


export default MediaList;
