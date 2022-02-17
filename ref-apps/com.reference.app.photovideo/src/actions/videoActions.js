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

import {types} from './types';
import {Video} from '../services';
import LS2Request from '@enact/webos/LS2Request';
// import mockVideoList from '../../assets/mock/videoList.json';

const getCurrentVideoRequest = () => {
 return {
  type: types.FETCH_CURRENT_VIDEO_REQUEST
 };
};

const setCurrentVideoSuccess = (videoMetaData, index) => {
 return {
  type: types.FETCH_CURRENT_VIDEO_SUCCESS,
  payload: videoMetaData,
  index: index
 };
};

const setCurrentVideoError = (message) => {
 return {
  type: types.FETCH_CURRENT_VIDEO_ERROR,
  payload: message
 };
};

const getVideoListRequest = () => {
 return {
  type: types.FETCH_VIDEO_LIST_REQUEST
 };
};

const setVideoListSuccess = (videoList) => {
 return {
  type: types.FETCH_VIDEO_LIST_SUCCESS,
  payload: videoList
 };
};

const setVideoListError = (message) => {
 return {
  type: types.FETCH_VIDEO_LIST_ERROR,
  payload: message
 };
};

const getVideoList = ({uri}) => (dispatch) => {
 dispatch(getVideoListRequest());
 // if(!window.palm){
 //  dispatch(setVideoListSuccess(mockVideoList.videoList.results));
 //  // console.log(mockVideoList.videoList.results);
 // }
 // else{
 Video.getVideoList({
  uri: uri,
  onSuccess: (res) => {
   const {returnValue, videoList} = res;
   if (returnValue) {
    dispatch(setVideoListSuccess(videoList.results));
   }
  },
  onFailure: (err) => {
   dispatch(setVideoListError(err.errorText));
  }
 });
// }
};

const getCurrentVideoMetaData = ({uri, videoIndex}) => (dispatch) => {
 dispatch(getCurrentVideoRequest());
 return new LS2Request().send({
  service: 'luna://com.webos.service.mediaindexer',
  method: 'getVideoMetadata',
  parameters: {uri:uri},
  onSuccess: ({metadata}) => {
   dispatch(setCurrentVideoSuccess(metadata, videoIndex));
  },
  onFailure: (err) => {
   dispatch(setCurrentVideoError(err.errorText));
  }
 });
};

export {
 getCurrentVideoMetaData,
 getCurrentVideoRequest,
 getVideoList,
 getVideoListRequest,
 setCurrentVideoError,
 setCurrentVideoSuccess,
 setVideoListError,
 setVideoListSuccess
};
