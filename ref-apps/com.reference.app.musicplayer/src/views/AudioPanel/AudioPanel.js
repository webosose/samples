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

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { changePath } from "../../actions/navigationActions";
import { getCurrentAudioMetaData } from "../../actions/audioActions";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";

const AudioPanel = ({
  audioMetaData,
  audioList,
  audioIndex,
  handleBack,
  getAudioMetaData,
}) => {
  const handleNextAudio = () => {
    if (audioList && audioList.length > 0) {
      if (audioIndex === audioList.length - 1) {
        getAudioMetaData(audioList[0].uri, 0);
      } else {
        getAudioMetaData(audioList[audioIndex + 1].uri, audioIndex + 1);
      }
    }
  };

  const handlePreviousAudio = () => {
    if (audioList && audioList.length > 0) {
      if (audioIndex === 0) {
        getAudioMetaData(
          audioList[audioList.length - 1].uri,
          audioList.length - 1
        );
      } else {
        getAudioMetaData(audioList[audioIndex - 1].uri, audioIndex - 1);
      }
    }
  };

  return (
    <AudioPlayer
      autoCloseTimeout={7000}
      disabled={false}
      feedbackHideDelay={3000}
      handleBack={() => handleBack("home")}
      handleNext={handleNextAudio}
      handlePrevious={handlePreviousAudio}
      miniFeedbackHideDelay={2000}
      muted={false}
      noAutoPlay={false}
      noAutoShowMediaControls={false}
      noMediaSliderFeedback={false}
      noSlider={false}
      pauseAtEnd
      playlist={audioMetaData}
      seekDisabled={false}
      spotlightDisabled={false}
      thumbnailSrc={audioMetaData.thumbnail}
      title={"Music Player"}
      titleHideDelay={4000}
    />
  );
};

AudioPanel.propTypes = {
  getAudioMetaData: PropTypes.func,
  handleBack: PropTypes.func,
  audioIndex: PropTypes.number,
  audioList: PropTypes.array,
  audioMetaData: PropTypes.object,
};

const mapStateToProps = ({
  audio: { currentAudioMetaData, audioList, audioIndex },
}) => {
  return {
    audioMetaData: currentAudioMetaData,
    audioList: audioList,
    audioIndex: audioIndex,
  };
};

const mapDispatchToState = (dispatch) => {
  return {
    handleBack: (path) => dispatch(changePath(path)),
    getAudioMetaData: (uri, index) =>
      dispatch(
        getCurrentAudioMetaData({
          uri: uri,
          audioIndex: index,
        })
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToState)(AudioPanel);
