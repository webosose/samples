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
import ImageItem from "@enact/sandstone/ImageItem";
import { VirtualGridList } from "@enact/sandstone/VirtualList";
import ri from "@enact/ui/resolution";
import placeHolderImg from "../../../assets/images/defaultalbum.png";
import { getEncodedPath } from "../../components/AudioPlayer/AudioPlayerBase/util";
import { memoize } from "@enact/core/util";
import DurationFmt from "ilib/lib/DurationFmt";
import { secondsToTime } from "../AudioPlayer/AudioPlayerBase/util";

const memoGetDurFmt = memoize(
  () =>
    new DurationFmt({
      length: "medium",
      style: "clock",
      useNative: false,
    })
);

const getDurFmt = () => {
  if (typeof window === "undefined") return null;
  return memoGetDurFmt();
};

const audioList = ({ audiolist, handleNavigate }) => {
  const renderItem = ({ index, ...rest }) => {
    let encodedPath = getEncodedPath(audiolist[index].thumbnail);
    const durFmt = getDurFmt();
    const duration = secondsToTime(audiolist[index].duration, durFmt);

    return (
      <ImageItem
        {...rest}
        centered={true}
        src={encodedPath}
        placeholder={placeHolderImg}
        label={"Time : " + duration}
        onClick={() => handleNavigate("/audioplayer", audiolist[index], index)}
      >
        {audiolist[index].title}
      </ImageItem>
    );
  };
  audiolist = audiolist || [];
  return audiolist.length === 0 ? (
    <h3>Audio folders does not exist in storage device</h3>
  ) : (
    <VirtualGridList
      direction="vertical"
      spacing={5}
      dataSize={audiolist.length}
      itemRenderer={renderItem}
      itemSize={{
        minWidth: ri.scale(500),
        minHeight: ri.scale(500),
      }}
    />
  );
};

audioList.propTypes = {
  handleNavigate: PropTypes.func.isRequired,
  audioList: PropTypes.array,
};

audioList.default = {
  audioList: [],
};

export default audioList;
