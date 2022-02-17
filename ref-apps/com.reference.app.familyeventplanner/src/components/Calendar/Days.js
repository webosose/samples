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

import LabeledIcon from '@enact/moonstone/LabeledIcon';

const Days = (props) => {
 let blanks = [];
 for (let i = 0; i < props.firstDayOfMonth(); i++) {
  blanks.push(<td key={i * 80} className="emptySlot">
   {''}
  </td>
  );
 }
 let daysInMonth = [];
 const getEvents = (d) => {
  let events = null;
  if (props.monthsData[props.month][d.toString()]) {
   let daysData = props.monthsData[props.month][d.toString()];
   if (daysData.length > 3) {
    events = [];
    events[0] = <div key="0" className="event-element">{daysData[0].title}</div>;
    events[1] = <div key="1" className="event-element">{daysData[1].title}</div>;
    events[2] = <LabeledIcon key="2" className="more-event-element" icon="arrowsmallright" labelPosition="before">Click to view more</LabeledIcon>;
   } else {
    events = daysData.map((ev, i) => {
     return (
      <div key={i} className="event-element">{ev.title}</div>
     );
    } );
   }
  }

  return events;
 };
 let currentDate = props.currentDay();
 for (let d = 1; d <= props.daysInMonth(); d++) {
  let className = (d === parseInt(currentDate)) ? ' day current-day' : 'day';
  if (props.monthsData && props.monthsData[props.month]) {
   daysInMonth.push(
    <td
     key={d} onClick={(e) => {
      props.onDayClick(e, d);
     }} className={className}
    >
     <span className="day-text">{d}</span>
     {getEvents(d)}
    </td>
   );
  } else {
   daysInMonth.push(
    <td
     key={d} onClick={(e) => {
      props.onDayClick(e, d);
     }} className={className}
    >
     <span className="day-text">{d}</span>
    </td>
   );
  }
 }
 let totalSlots = [...blanks, ...daysInMonth];
 let rows = [];
 let cells = [];

 totalSlots.forEach((row, i) => {
  if ((i % 7) !== 0 || i === 0) {
   cells.push(row);
  } else {
   let insertRow = cells.slice();
   rows.push(insertRow);
   cells = [];
   cells.push(row);
  }
  if (i === totalSlots.length - 1) {
   let insertRow = cells.slice();
   rows.push(insertRow);
  }
 });

 let trElems = rows.map((d, i) => {
  return (
   <tr key={i * 100} className="dates-row">
    {d}
   </tr>
  );
 });
 return (
  <>
   {trElems}
  </>
 );
};

export default Days;
