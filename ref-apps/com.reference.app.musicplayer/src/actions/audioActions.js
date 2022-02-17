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

import { types } from "./types";
import { Audio } from "../services";
import LS2Request from "@enact/webos/LS2Request";
import mockAudioList from "../../assets/mock/audioList.json";

const getCurrentAudioRequest = () => {
  return {
    type: types.FETCH_CURRENT_AUDIO_REQUEST,
  };
};

const setCurrentAudioSuccess = (audioMetaData, index) => {
  return {
    type: types.FETCH_CURRENT_AUDIO_SUCCESS,
    payload: audioMetaData,
    index: index,
  };
};

const setCurrentAudioError = (message) => {
  return {
    type: types.FETCH_CURRENT_AUDIO_ERROR,
    payload: message,
  };
};

const getAudioListRequest = () => {
  return {
    type: types.FETCH_AUDIO_LIST_REQUEST,
  };
};

const setAudioListSuccess = (audioList) => {
  return {
    type: types.FETCH_AUDIO_LIST_SUCCESS,
    payload: audioList,
  };
};

const setAudioListError = (message) => {
  return {
    type: types.FETCH_AUDIO_LIST_ERROR,
    payload: message,
  };
};

const updateAudioMetaData = (metaData) => {
  if (metaData !== undefined && metaData !== null) {
    let title = metaData.title;
    if (title.length === 0) {
      let pbArray = String(metaData.file_path).split("/");
      metaData.title = pbArray[pbArray.length - 1];
    }
    if (metaData.thumbnail === 0) {
      metaData.thumbnail = "";
    }
  }
  return metaData;
};

const updateAudioList = (audiolist) => {
  if (audiolist && audiolist.length > 0) {
    for (let i in audiolist) {
      audiolist[i] = updateAudioMetaData(audiolist[i]);
    }
  }
  return audiolist;
};

const getAudioList =
  ({ uri }) =>
  (dispatch) => {
    dispatch(getAudioListRequest());
    /*
    if (!window.palm) {
      dispatch(setAudioListSuccess(mockAudioList.audioList.results));
      console.log(mockAudioList.audioList.results);
    } else */ {
      Audio.getAudioList({
        uri: uri,
        onSuccess: (res) => {
          const { returnValue, audioList } = res;
          if (returnValue) {
            dispatch(setAudioListSuccess(updateAudioList(audioList.results)));
          }
        },
        onFailure: (err) => {
          dispatch(setAudioListError(err.errorText));
        },
      });
    }
  };

const getCurrentAudioMetaData =
  ({ uri, audioIndex }) =>
  (dispatch) => {
    dispatch(getCurrentAudioRequest());
    return new LS2Request().send({
      service: "luna://com.webos.service.mediaindexer",
      method: "getAudioMetadata",
      parameters: { uri: uri },
      onSuccess: ({ metadata }) => {
        dispatch(
          setCurrentAudioSuccess(updateAudioMetaData(metadata), audioIndex)
        );
      },
      onFailure: (err) => {
        dispatch(setAudioListError(err.errorText));
      },
    });
  };

export {
  getCurrentAudioMetaData,
  getCurrentAudioRequest,
  getAudioList,
  getAudioListRequest,
  setCurrentAudioError,
  setCurrentAudioSuccess,
  setAudioListError,
  setAudioListSuccess,
};
