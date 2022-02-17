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

import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { TabLayout, Tab } from "@enact/sandstone/TabLayout";
import { Panel, Header } from "@enact/sandstone/Panels";
import AudioList from "../../components/AudioList/AudioList";

import { changePath } from "../../actions/navigationActions";
import { getDeviceList } from "../../actions/deviceActions";
import {
  getAudioList,
  getCurrentAudioMetaData,
} from "../../actions/audioActions";

import css from "./MainPanel.module.less";

const MainPanel = ({
  devices,
  handleNavigate,
  getListDevice,
  getListAudio,
  getAudioMetaData,
  audioList,
  ...rest
}) => {
  useEffect(() => {
    getListDevice();
  }, []);

  const handleAudioNavigate = (url, AudioMetaData, index) => {
    getAudioMetaData(AudioMetaData.uri, index);
    handleNavigate(url);
  };

  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.close();
    }
  };

  return (
    <Panel {...rest}>
      <Header onClose={handleClose} />
      <TabLayout>
        {devices.map((device) => {
          return (
            device.deviceList.length > 0 &&
            device.deviceList.map((deviceList, index) => {
              return (
                <Tab
                  className={css.tab}
                  key={deviceList.uri}
                  icon="usb"
                  onTabClick={() => getListAudio(deviceList.uri)}
                  title={deviceList.name}
                >
                  <AudioList
                    key={index}
                    audiolist={audioList}
                    handleNavigate={handleAudioNavigate}
                  />
                </Tab>
              );
            })
          );
        })}
      </TabLayout>
    </Panel>
  );
};

MainPanel.propTypes = {
  deviceList: PropTypes.array,
  getListDevice: PropTypes.func,
  getListAudio: PropTypes.func,
  getAudioMetaData: PropTypes.func,
  handleNavigate: PropTypes.func,
  audioList: PropTypes.array,
};

const mapStateToProps = ({ device, audio }) => {
  return {
    devices: device.deviceList,
    audioList: audio.audioList,
  };
};

const mapDispatchToState = (dispatch) => {
  return {
    handleNavigate: (path) => dispatch(changePath(path)),
    getListDevice: () =>
      dispatch(
        getDeviceList({
          subscribe: true,
        })
      ),
    getListAudio: (uri) =>
      dispatch(
        getAudioList({
          uri: uri,
        })
      ),
    getAudioMetaData: (uri, index) =>
      dispatch(
        getCurrentAudioMetaData({
          uri: uri,
          audioIndex: index,
        })
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToState)(MainPanel);
