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

import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {TabLayout, Tab} from '@enact/sandstone/TabLayout';
import {changePath} from '../../actions/navigationActions';
import {getVideoList, getCurrentVideoMetaData} from '../../actions/videoActions';
import {getImageList} from '../../actions/imageActions';
import {setCurrentDevice} from '../../actions/deviceActions';
import css from './DeviceTabLayout.module.less';
import MediaList from '../../components/MediaList/MediaList';

const DeviceTabLayout = ({devices, handleNavigate, getListVideo, getListImage, getVideoMetaData, setSelectedDevice, videoList, imageList}) => {
 useEffect(() => {
  if (devices && devices[0]) {
   getListImage(devices[0].deviceList[0].uri);
   getListVideo(devices[0].deviceList[0].uri);
  }
 }, [devices])

 const onSelectDevice = (uri) =>{
  setSelectedDevice(uri);
  getListImage(uri);
  getListVideo(uri);
 }

 const handleVideoNavigate = (url, videoMetaData, index) => {
  getVideoMetaData(videoMetaData.uri, index);
  handleNavigate(url,index);
 };

 return (
  <TabLayout>
    {devices.map((device) => {
     return device.deviceList.length > 0 && device.deviceList.map((deviceList, index) => {
      return (
       <Tab
        className={css.tab} key={deviceList.uri}
        icon='usb'
        onTabClick={() => onSelectDevice(deviceList.uri)}
        title={deviceList.name}
       >
        <MediaList
         key={index}
         videoList={videoList}
         imageList={imageList}
         handleNavigate={handleVideoNavigate}
        />
      </Tab>
      )
     })
    })}
   </TabLayout>
 );
};

DeviceTabLayout.propTypes = {
 devices: PropTypes.array,
 getListVideo: PropTypes.func,
 getListImage: PropTypes.func,
 getVideoMetaData: PropTypes.func,
 handleNavigate: PropTypes.func,
 videoList: PropTypes.array,
 imageList: PropTypes.array
};

const mapStateToProps = ({device, video, image}) => {
 return {
  devices: device.deviceList,
  videoList: video.videoList,
  imageList: image.imageList
 };
};

const mapDispatchToState = dispatch => {
 return {
  handleNavigate: (path, index) => dispatch(changePath(path, index)),
  getListVideo: (uri) => dispatch(getVideoList({
   uri: uri
  })),
  getListImage: (uri) => dispatch(getImageList({
   uri: uri
  })),
  getVideoMetaData: (uri, index) => dispatch(getCurrentVideoMetaData({
   uri: uri,
   videoIndex: index
  })),
  setSelectedDevice: (device) => dispatch(setCurrentDevice({
   device:device
  }))
 };
};

export default connect(mapStateToProps, mapDispatchToState)(DeviceTabLayout);