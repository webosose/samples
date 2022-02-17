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
import {Panels, Routable, Route} from '@enact/sandstone/Panels';

import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import PhotoPlayer from '../components/PhotoPlayer/PhotoPlayer';
import {changePath} from '../actions/navigationActions';

import MainPanel from '../views/MainPanel';
import VideoPanel from '../views/VideoPanel';

const RoutablePanels = Routable({navigate: 'onBack'}, Panels);

const App = ({path, index, imageList, handleBack, ...rest}) => {
 return (
  <RoutablePanels {...rest} path={path} index={index}>
   <Route path="home" component={MainPanel} title="Home Page" />
   <Route path="videoplayer" component={VideoPanel} title="Video Player" />
   <Route path="photoPlayer" component={PhotoPlayer} slides={imageList} startSlideIndex={index} handleNavigate={() => handleBack('home')} title="Photo player" />
  </RoutablePanels>
 );
};

App.propTypes = {
 path: PropTypes.string,
 index: PropTypes.number,
 imageList: PropTypes.array,
 handleBack: PropTypes.func
};

const mapStateToProps = ({image, path}) => {
 return {
  path: path.path,
  imageList: image.imageList,
  index: path.index
 };
};

const mapDispatchToState = dispatch => {
 return {
  handleBack: (path) => dispatch(changePath(path))
 }
}

export default connect(mapStateToProps, mapDispatchToState)(ThemeDecorator(App));
