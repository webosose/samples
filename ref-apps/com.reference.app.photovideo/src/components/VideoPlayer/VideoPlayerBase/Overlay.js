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

import Touchable from '@enact/ui/Touchable';
import {memo} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './VideoPlayer.module.less';

/**
 * Overlay {@link goldstone/VideoPlayer}. This covers the Video piece of the
 * {@link goldstone/VideoPlayer} to prevent unnecessary VideoPlayer repaints due to mouse-moves.
 * It also acts as a container for overlaid elements, like the {@link goldstone/Spinner}.
 *
 * @function
 * @memberof goldstone/VideoPlayer
 * @ui
 * @public
 */
const OverlayBase = ({bottomControlsVisible, children, ...rest}) => {
 return (
  <div
   className={classNames({[css.overlay]: true, [css['high-contrast-scrim']]: bottomControlsVisible})}
   {...rest}
  >
   {children}
  </div>
 );
};

OverlayBase.displayName = 'Overlay';
OverlayBase.propTypes = {
 bottomControlsVisible: PropTypes.bool,
 children: PropTypes.node
};

const Overlay = memo(Touchable(OverlayBase));
export default Overlay;
export {
 Overlay,
 OverlayBase
};
