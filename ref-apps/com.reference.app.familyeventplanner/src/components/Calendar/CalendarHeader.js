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

import Icon from '@enact/moonstone/Icon';
import Dropdown from '@enact/moonstone/Dropdown';
import EditableIntegerPicker from '@enact/moonstone/EditableIntegerPicker';

const CalendarHeader = (props) => {
 return (
  <tr className="calendar-header">
   <td colSpan="1">
    <Icon
     onClick={() => {
      props.prevMonth();
     }}
    >arrowsmallleft</Icon>
   </td>
   <td colSpan="5" className="nav-content">
    <Dropdown
     selected={props.months.indexOf(props.month())}
     width="medium"
     onSelect={(d) => {
      props.onSelectChange(d);
     }}
    >
     {props.months}
    </Dropdown>

    {' '}
    <EditableIntegerPicker
     editMode
     max={3000}
     min={1000}
     value={parseInt(props.year())}
     onChange={(d) => {
      props.onYearChange(d);
     }}
     width="small"
    />
   </td>
   <td colSpan="1" className="nav-month">
    <Icon
     onClick={() => {
      props.nextMonth();
     }}
    >arrowsmallright</Icon>
   </td>
  </tr>
 );
};

export default CalendarHeader;
