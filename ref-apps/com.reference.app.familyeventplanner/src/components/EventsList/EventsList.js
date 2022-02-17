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

import ExpandableItem from '@enact/moonstone/ExpandableItem';
import Button from '@enact/moonstone/Button';
import IconButton from '@enact/moonstone/IconButton';
import './eventsList.css';

const EventsList = (props) => {
 return (
  <>
   {props.events.map((ev, i) => {
    return (
     <ExpandableItem key={i} title={ev.title} className="event">
      <div className="event-body">
       {ev.image.file_path != null ? <img src={ev.image.file_path} alt={ev.image.title} /> : ''}
       <div className="event-desc">{ev.description}</div>
       <IconButton
        onClick={() => props.deleteEvent(ev, props.date, props.month, props.year)}
        className="delete-button"
        size="small"
       >
        trash
       </IconButton>
      </div>
     </ExpandableItem>
    );
   })}
   <Button onClick={props.createNewEvent}>Create New Event</Button>
  </>
 );
};

export default EventsList;
