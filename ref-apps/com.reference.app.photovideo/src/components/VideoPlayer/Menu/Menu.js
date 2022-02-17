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
import Group from '@enact/ui/Group';
import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import Icon from '../../Icon';
import RadioButton from '../../RadioButton';
import Slider from '../../Slider';
import FeedbackTooltip from '../VideoPlayerBase/FeedbackTooltip';
import css from './Menu.module.less';

const Menu = ({handleNavigate, handleSelect, heading, list, position, radioIndex, subHeading, type}) => {

 const radioButtonGroup = useCallback(({selected, ...rest}) => {
  return (
   <RadioButton
    style={{margin:0, fontSize: '1rem', padding: '1rem 0.5rem', borderRadius: '1rem'}}
    selected={selected}
    {...rest}
   />
  );
 }, []);

 return (
  <div className={css.menu} style={{left: `${position - 190}px`}}>
   <div className={css.header}>
    {
     heading &&
     <div className={css.mainHeader}>
      {heading}
     </div>
    }
    {
     subHeading &&
     <div className={css.mainSubHeader}>
      {subHeading}
     </div>
    }
   </div>
   <ul className={css.list}>
    {
     type === 'subMenu' &&
     Object.keys(list).map( (item, index) => (
      <React.Fragment key={`${index}-${item}`}>
       {
        list[item].type === 'subMenu' &&
        <li key={`${index}-${item}`} onClick={() => handleNavigate(item)}>
         <div className={css.leftContainer}>
          {list[item].name}
          <div className={css.subHeading}>
           {list[item].children.items[list[item].children.index].name}
          </div>
         </div>
         {
          list[item].type === 'subMenu' &&
          <div className={css.rightContainer}>
           <Icon size="small">
            arrowsmallright
           </Icon>
          </div>
         }
        </li>
       }
      </React.Fragment>
     ))
    }
    {
     type === 'radio' &&
     <Group
      childComponent={radioButtonGroup}
      itemProps={{inline: false}}
      onSelect={handleSelect}
      select="radio"
      selectedProp="selected"
      selected={radioIndex}
     >
      {[...list.map( radioItem => radioItem.name)]}
     </Group>
    }
    {
     type === 'slider' &&
     <div>
      <Slider
       tooltip={
        <FeedbackTooltip />
       }
       max={2}
       min={1}
       step={0.1}
      />
     </div>
    }
   </ul>
  </div>
 );
};

Menu.propTypes = {
 handleNavigate: PropTypes.func,
 handleSelect: PropTypes.func,
 heading: PropTypes.string,
 list: PropTypes.array,
 position: PropTypes.number,
 radioIndex: PropTypes.any,
 subHeading: PropTypes.string,
 type: PropTypes.any
};

export default Menu;
