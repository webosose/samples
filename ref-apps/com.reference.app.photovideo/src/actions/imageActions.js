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
import {Image} from '../services';
// import mockImageList from '../../assets/mock/imageList.json';

const getImageListRequest = () => {
 return {
  type: types.FETCH_IMAGE_LIST_REQUEST
 };
};

const setImageListSuccess = (imageList) => {
 return {
  type: types.FETCH_IMAGE_LIST_SUCCESS,
  payload: imageList
 };
};

const setImageListError = (message) => {
 return {
  type: types.FETCH_IMAGE_LIST_ERROR,
  payload: message
 };
};

const getImageList = ({uri}) => (dispatch) => {
 dispatch(getImageListRequest());
 // if(!window.plam){
 //  dispatch(setImageListSuccess(mockImageList.imageList.results));
 // }
 // else{
 Image.getImageList({
  uri: uri,
  onSuccess: (res) => {
   const {returnValue, imageList} = res;
   if (returnValue) {
    dispatch(setImageListSuccess(imageList.results));
   }
  },
  onFailure: (err) => {
   dispatch(setImageListError(err.errorText));
  }
 });
// }
};



export {
 getImageList,
 getImageListRequest,
 setImageListError,
 setImageListSuccess
};
