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
import {connect} from 'react-redux';
import {changePath} from '../../actions/navigationActions';
import {getCurrentVideoMetaData} from '../../actions/videoActions';
import VideoPlayer from '../../components/VideoPlayer';

const VideoPanel = ({videoMetaData, videoList, videoIndex, handleBack, getVideoMetaData}) => {

 const handleNextVideo = () => {
  if(videoList && videoList.length > 0) {
   if(videoIndex === videoList.length - 1) {
    getVideoMetaData(videoList[0].uri, 0);
   } else {
    getVideoMetaData(videoList[videoIndex + 1].uri, videoIndex + 1);
   }
  }
 };

 const handlePreviousVideo = () => {
  if(videoList && videoList.length > 0) {
   if(videoIndex === 0) {
    getVideoMetaData(videoList[videoList.length - 1].uri, videoList.length - 1);
   } else {
    getVideoMetaData(videoList[videoIndex - 1].uri, videoIndex - 1);
   }
  }
 };

 return (
  <VideoPlayer
   actionGuideLabel={'Press Down Button to Scroll'}
   autoCloseTimeout={7000}
   disabled={false}
   feedbackHideDelay={3000}
   handleBack={() => handleBack('home')}
   handleNext={handleNextVideo}
   handlePrevious={handlePreviousVideo}
   // loop={boolean('loop', Config, false)}
   miniFeedbackHideDelay={2000}
   muted={false}
   noAutoPlay={false}
   noAutoShowMediaControls={false}
   noMediaSliderFeedback={false}
   noMiniFeedback={false}
   noSlider={false}
   pauseAtEnd
   playlist={videoMetaData}
   // poster={poster}
   seekDisabled={false}
   spotlightDisabled={false}
   // thumbnailSrc={poster}
   thumbnailUnavailable
   title={'Sandstone VideoPlayer Sample Video'}
   titleHideDelay={4000}
  />
 );
};

VideoPanel.propTypes = {
 getVideoMetaData: PropTypes.func,
 handleBack: PropTypes.func,
 videoIndex: PropTypes.number,
 videoList: PropTypes.array,
 videoMetaData: PropTypes.object
};

const mapStateToProps = ({video: {currentVideoMetaData, videoList, videoIndex}}) => {
 return {
  videoMetaData: currentVideoMetaData,
  videoList: videoList,
  videoIndex: videoIndex
 };
};

const mapDispatchToState = dispatch => {
 return {
  handleBack: (path) => dispatch(changePath(path)),
  getVideoMetaData: (uri, index) => dispatch(getCurrentVideoMetaData({
   uri: uri,
   videoIndex: index
  }))
 };
};

export default connect(mapStateToProps, mapDispatchToState)(VideoPanel);
