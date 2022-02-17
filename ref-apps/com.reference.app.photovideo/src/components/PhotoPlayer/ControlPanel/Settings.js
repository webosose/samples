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

/* eslint-disable react/jsx-no-bind */

import {useContext, useState} from 'react';
import classNames from 'classnames';
import {$L} from '@enact/i18n/$L';
import {spotlightDefaultClass} from '@enact/spotlight/SpotlightContainerDecorator';
import Group from '@enact/ui/Group';
import PropTypes from 'prop-types';
import {SettingsContext} from '../Context/SettingsContext';
import Icon from '@enact/sandstone/Icon';
import RadioItem from '@enact/sandstone/RadioItem';
import componentCss from './ControlPanel.module.less';

const options = {
 Size: ['Original', 'Full'],
 Transition: ['Fade In', 'Slide', 'None'],
 Speed: ['Slow', 'Normal', 'Fast']
};
const SETTING_HEADER = 'Photo Settings';

const Settings = (props) => {

 const {state: {currentSettings, settings}, dispatch} = useContext(SettingsContext);
 const [index, setIndex] = useState(0);
 const [toggle, setToggle] = useState(false);
 const [header, setHeader] = useState(SETTING_HEADER);

 const subSettingsHandler = (id) => {
  const {text} = settings[id - 1];
  setHeader(text);
  setToggle(true);
  setIndex(options[text].findIndex(el => el === currentSettings[text]));
 };

 const handleClick = e => {
  setIndex(e.selected);
  dispatch({type: `SET_${header.toUpperCase()}`, value: options[header][e.selected]});
 };

 const CustomRadioItem = ({selected, ...rest}) => (
  <RadioItem
   style={{margin: 0, fontSize: '1rem', padding: '1rem 0.5rem', borderRadius: '1rem'}}
   selected={selected} {...rest}
   className={selected ? spotlightDefaultClass : null}
  />
 );

 const renderSubSettings = () => (
  <Group
   childComponent={CustomRadioItem}
   itemProps={{inline: false}}
   select="radio"
   selectedProp="selected"
   selected={index}
   onSelect={handleClick}
  >
   {options[header]}
  </Group>
 );

 const closeSettings = () => {
  if (header === SETTING_HEADER) {
   props.settingsHandler(false);
  } else {
   setToggle(false);
   setHeader(SETTING_HEADER);
  }
 };

 const renderSettings = () => (
  <div>
   {settings.map((setting, indexKey) =>
    <div
     key={indexKey}
     name={setting.id}
     onClick={() => subSettingsHandler(setting.id)}
     className={classNames({
      [componentCss.subHeader]: true,
      [componentCss.lastSubHeader]: indexKey === currentSettings.length - 1
     })}
    >
     <div>
      {setting.text}
      <div
       className={componentCss.value}
      >
       {currentSettings[setting.text]}
      </div>
     </div>
     <Icon size="small" className={componentCss.button}>
      arrowsmallright
     </Icon>
    </div>
   )}
  </div>
 );

 return (
  <div className={componentCss.setting}>
   <div className={componentCss.header}>
    {header}
    <Icon
     aria-label={$L('Go to Previous')}
     className={componentCss.backButton}
     onClick={closeSettings}
     size="small"
     title=""
    >
     arrowhookleft
    </Icon>
   </div>
   {!toggle ? renderSettings() : renderSubSettings()}
  </div>
 );
};

Settings.propTypes = {
 /**
  * Show the selected settings.
  *
  * @type {Boolean}
  * @public
  */
 selected: PropTypes.bool,
 /**
  * Callback for settings menu.
  *
  * @type {Function}
  * @public
  */
 settingsHandler: PropTypes.func
};

export default Settings;
