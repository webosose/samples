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
 * Provides Goldstone-themed Audio player component with out of the box features.
 *
 * @exports AudioPlayer
 */
import PropTypes from "prop-types";
import React, { useReducer } from "react";
import AudioPlayerBase from "./AudioPlayerBase/AudioPlayerBase";
import AudioPlayerReducer from "./Reducers/AudioPlayerReducer";

const initialState = {
  current: 0,
  repeat: {
    type: 0,
    loop: false,
  },
};
const AudioPlayer = ({
  handleBack,
  handleNext,
  handlePrevious,
  playlist,
  ...rest
}) => {
  const [state] = useReducer(AudioPlayerReducer, initialState);
  const getAudioType = (file_path) => {
    let mimeType = "audio/mp3";
    if (file_path && file_path.length > 0) {
      let extension = file_path.substring(file_path.lastIndexOf(".") + 1);
      if (extension && extension.length > 0) {
        mimeType = "audio/" + extension;
      }
    }
    return mimeType;
  };
  let extType = getAudioType(playlist.file_path);
  return (
    <AudioPlayerBase
      {...rest}
      onJumpForward={handleNext}
      onJumpBackward={handlePrevious}
      onBack={handleBack}
      loop={state.repeat.loop}
      poster={playlist.thumbnail}
      thumbnailSrc={playlist.thumbnail}
      title={playlist.title}
      artist={playlist.artist}
      album={playlist.album}
      infoComponents={playlist.title}
    >
      <source src={playlist.file_path} type={extType} />
    </AudioPlayerBase>
  );
};

AudioPlayer.propTypes = {
  /**
   * Function to handle navigation
   *
   * @type {Function}
   */
  handleBack: PropTypes.func,

  /**
   * Function to handle Next audio
   *
   * @type {Function}
   */
  handleNext: PropTypes.func,

  /**
   * Function to handle Previous audio
   *
   * @type {Function}
   */
  handlePrevious: PropTypes.func,

  /**
   * Contains the list of audios to be played
   *
   * @type {Array}
   */
  playlist: PropTypes.object,
};

export default AudioPlayer;
