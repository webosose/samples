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

const AudioPlayerReducer = (state, action) => {
  switch (action.type) {
    case "repeat": {
      let repeatType = 0;
      let isLoop = false;
      if (state.repeat.type === 0) {
        repeatType = 1;
        isLoop = true;
      } else if (state.repeat.type === 1) {
        repeatType = 2;
        isLoop = false;
      } else {
        repeatType = 0;
        isLoop = false;
      }

      return {
        ...state,
        repeat: {
          type: repeatType,
          loop: isLoop,
        },
      };
    }

    case "jump": {
      let isRepeat = 0;
      if (state.repeat.type === 0) {
        if (action.payload.playlistDirection === "next") {
          isRepeat =
            action.payload.playlistLength === state.current
              ? 0
              : state.current + 1;
        } else {
          isRepeat =
            state.current === 0
              ? action.payload.playlistLength
              : state.current - 1;
        }
      } else if (state.repeat.type === 1) {
        isRepeat = state.current;
      } else {
        isRepeat = state.current;
      }
      return {
        ...state,
        current: isRepeat,
      };
    }

    case "toggle": {
      return {
        ...state,
        [action.payload]: {
          isOpen: !state[action.payload].isOpen,
          position: action.position,
        },
      };
    }

    default:
      return state;
  }
};

export default AudioPlayerReducer;
