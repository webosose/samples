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

import {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import Button from '@enact/moonstone/Button';
import DatePicker from '@enact/moonstone/DatePicker';
import Input from '@enact/moonstone/Input';
import ImageItem from '@enact/ui/ImageItem';
import {getDeviceList} from '../../actions/deviceActions';
import './createForm.css';
const CreateForm = ({getListDevice, imageList, deviceList, currentSelectedDate, postObj, triggerNotification}) => {

 useEffect(() => {
  getListDevice();
 }, []);

 const [datePickerVal, setdatePickerVal] = useState(currentSelectedDate);
 const [eventTitle, seteventTitle] = useState(null);
 const [eventDesc, seteventDesc] = useState(null);
 const [pickedImage, setpickedImage] = useState(null);
 let deviceInfo = [];

 const getDevices = () => {
  let list = [];
  list.push('Default Images');
  deviceInfo.push( {
   'name': 'Default Images',
   'uri': 'DefaultImages'
   });
  deviceList.map((device) => {
   if (device.deviceList.length > 0) {
    device.deviceList.map((deviceList) => {
     deviceInfo.push(deviceList);
     list.push(deviceList.name);
    });
   }
  });
  return list;
 };
 let devices = getDevices();

 const onDatePickerChange = (date) => {
  setdatePickerVal(date.value);
 };
 const onEventTitleChange = (title) => {
  if(title !== undefined && title.value !== undefined) {
   if(title.value.length <=50) { 
    seteventTitle(title.value); 
   } else {
    triggerNotification({message: 'Title - Maximum characters reached '});
   } 
  }
 };
 const onEventDescChange = (desc) => {
  seteventDesc(desc.value);
 };
 const onSelectImage = (index) => {
  if (pickedImage !== null) {
   imageList.results[pickedImage].selected = false;
   if (pickedImage === index) {
    setpickedImage(null);
   }
   else {
    setpickedImage(index);
    imageList.results[index].selected = true;
   }
  } else {
   setpickedImage(index);
   imageList.results[index].selected = true;
  }
 };

 const onButtonSubmit = () => {
  if (eventTitle && eventTitle !== '') {
   if (eventDesc && eventDesc !== '') {
    let month = moment(datePickerVal).month() + 1;
    let obj = {};
    obj['year'] = moment(datePickerVal).year().toString();
    obj['month'] = month.toString();
    obj['date'] = moment(datePickerVal).date().toString();
    obj['event'] = {
     'title' : eventTitle,
     'description' : eventDesc
    };
    if (pickedImage !== null) {
     obj['image'] = imageList.results[pickedImage];
    } else {
     obj['image'] = {};
    }
    console.log(obj);
    postObj(obj);
   } else {
    triggerNotification({message: 'Event Description is Mandatory'});
   }
  } else {
   triggerNotification({message: 'Event Title is Mandatory'});
  }
 };

 return (
  <>
   <DatePicker
    onChange={onDatePickerChange}
    title="Select Date"
    value={datePickerVal}
   />
   <div className="event-input">
    <Input className="event-input-internal" placeholder="Enter Event Title Here" onChange={onEventTitleChange} value={eventTitle} autoFocus={true} dismissOnEnter={true} />
   </div>
   <div className="event-input">
    <Input className="event-input-internal" placeholder="Description of Event Here" onChange={onEventDescChange} value={eventDesc} autoFocus={true} dismissOnEnter={true}/>
   </div>
   <Button onClick={onButtonSubmit}>Create Event</Button>
  </>
 );
};

const mapStateToProps = ({device, image}) => {
 return {
  imageList: image.imageList,
  deviceList: device.deviceList
 };
};

const mapDispatchToState = dispatch => {
 return {
  getListDevice: () => dispatch(getDeviceList({
   subscribe: true
  })),
 };
};

export default connect(mapStateToProps, mapDispatchToState)(CreateForm);

