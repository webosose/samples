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

import {Component} from 'react';
import moment from 'moment';
import Dialog from '@enact/moonstone/Dialog';
import Scroller from '@enact/moonstone/Scroller';
import Notification from '@enact/moonstone/Notification';

import './calendar.css';
import {dbServices} from '../../services/dbServices';
import {generateQuery} from '../../services/generateQuery';
import CreateForm from '../CreateForm/CreateForm';
import Days from './Days';
import CalendarHeader from './CalendarHeader';
import EventsList from '../EventsList/EventsList';
import Button from '@enact/moonstone/Button';
import Header from "./Header";
const _kind = 'com.reference.app.service.familyeventplanner:4';

export default class Calendar extends Component {
    state = {
     dateContext: moment(),
     today: moment(),
     selectedDay: null,
     dailog : false,
     dailogSubTitle: null,
     monthsData : [],
     notification: false,
     notificationMsg: '',
     dailogType: 'form'
    };

    constructor (props) {
     super(props);
     this.width = props.width || '100%';
     this.style = props.style || {};
     this.style.width = '100%'; // add this
    }

    componentDidMount () {
     dbServices.createKind((resp) => {
      console.log('Response in callback :: ', resp);
      if (resp.returnValue) {
       this.getDataFromDb();
      }
     });
    }

    getDataFromDb = () => {
     let month = this.months.indexOf(this.month()) + 1;
     let query = generateQuery.findQuery({
      'year': this.year(),
      'month': month.toString()
     });
     console.log('Query here :: ', query);
     dbServices.findData(query, (res) => {
      console.log('Find data response :: ', res);
      if (res.returnValue) {
       let monthsData = generateQuery.filterData(res.results);
       console.log('This month data here :: ', monthsData);
       this.setState({monthsData});
      }
     });
    };


    weekdays = moment.weekdays(); // ["Sunday", "Monday", "Tuesday", "Wednessday", "Thursday", "Friday", "Saturday"]
    weekdaysShort = moment.weekdaysShort(); // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    months = moment.months();

    year = () => {
     return this.state.dateContext.format('Y');
    };
    month = () => {
     return this.state.dateContext.format('MMMM');
    };
    daysInMonth = () => {
     return this.state.dateContext.daysInMonth();
    };
    currentDate = () => {
     return this.state.dateContext.get('date');
    };
    currentDay = () => {
     return this.state.dateContext.format('D');
    };

    firstDayOfMonth = () => {
     let dateContext = this.state.dateContext;
     let firstDay = moment(dateContext).startOf('month').format('d'); // Day of week 0...1..5...6
     return firstDay;
    };

    setDateContext = (dateContext) => {
     this.setState({
      dateContext: dateContext
     }, () => {
      this.getDataFromDb();
     });
    };

    setMonth = (month) => {
     let monthNo = this.months.indexOf(month);
     let dateContext = Object.assign({}, this.state.dateContext);
     dateContext = moment(dateContext).set('month', monthNo);
     this.setDateContext(dateContext);
    };

    nextMonth = () => {
     let dateContext = Object.assign({}, this.state.dateContext);
     dateContext = moment(dateContext).add(1, 'month');
     this.setDateContext(dateContext);
     this.props.onNextMonth && this.props.onNextMonth();
    };

    prevMonth = () => {
     let dateContext = Object.assign({}, this.state.dateContext);
     dateContext = moment(dateContext).subtract(1, 'month');
     this.setDateContext(dateContext);
     this.props.onPrevMonth && this.props.onPrevMonth();
    };

    onSelectChange = (data) => {
     this.setMonth(data.data);
     this.props.onMonthChange && this.props.onMonthChange();
    };

    SelectList = (props) => {
     let popup = props.data.map((data) => {
      return (
    <div key={data}>
     <a
      href="#" 
      onClick={(e) => {
       this.onSelectChange(e, data);
      }}
     >
      {data}
     </a>
    </div>
   );
  });

     return (
   <div className="month-popup">
    {popup}
   </div>
     );
    };

    setYear = (year) => {
     let dateContext = Object.assign({}, this.state.dateContext);
     dateContext = moment(dateContext).set('year', year);
     this.setDateContext(dateContext);
    };

    onYearChange = (e) => {
     this.setYear(e.value);
    };

    onDayClick = (e, day) => {
     let currentMonth = this.months.indexOf(this.month()) + 1;
     let currentYear = this.year().toString();
     let currentDate = day.toString();
     // console.log("Selected date data :: ", this.state.monthsData[currentYear][currentMonth.toString()][currentDate]);
     // let selectedDayData = this.state.monthsData[currentYear][currentMonth.toString()][currentDate]
     // let dailogSubTitle = selectedDayData ? "Events of the Day" : "Add new event"
     let dailogSubTitle = 'Add new event';
     if (this.state.monthsData[currentYear] && this.state.monthsData[currentYear][currentMonth.toString()] && this.state.monthsData[currentYear][currentMonth.toString()][currentDate]) {
      console.log('Data exists');
      this.setState({
       dailogType: 'list'
      });
      dailogSubTitle = 'Events of the Day';
     }
     this.setState({
      selectedDay: day,
      dailog: true,
      dailogSubTitle: dailogSubTitle
     });
  this.props.onDayClick && this.props.onDayClick(e, day);
 };

 onDailogClose = () => {
  this.setState({
   dailog: false,
   dailogType: 'form'
  });
 };

 postObj = (obj) => {
  obj['_kind'] = _kind;
  dbServices.putData(obj, (res) => {
   if (res.returnValue) {
    this.getDataFromDb();
   }
  });
  this.setState({
   dailog: false
  });
 };

 triggerNotification = (msg) => {
  let self = this;
  this.setState({
   notification: true,
   notificationMsg: msg.message
  }, () => {
   setTimeout(() => {
    self.setState({
     notification: false,
     notificationMsg: ''
    });
   }, 3000);
  });
 };

 deleteEvent = (event, date, month, year) => {
  this.onDailogClose();
  let query = generateQuery.findQuery({
   'year': year,
   'month': month.toString(),
   'date': date
  });
  console.log('Delete Event Query here :: ', query);
  dbServices.findData(query, (res) => {
   console.log('Find data response :: ', res);
   let ev = '';
   for (let i in res.results) {
    console.log(res.results[i]);
    if (res.results[i].event.title === event.title && res.results[i].event.description === event.description) {
     ev = res.results[i]._id;
    }
   }
   console.log(ev);
   dbServices.deleteEvent(ev);
   this.getDataFromDb();
  });
 };

 createNewEvent = () => {
  this.setState({
   dailogType: 'form',
   dailog: true
  });
 };
 

 render () {
  // Map the weekdays i.e Sun, Mon, Tue etc as <td>
  let weekdays = this.weekdaysShort.map((day) => {
   return (
    <td key={day} className="week-day">{day}</td>
   );
  });

  let formatedDate = this.state.selectedDay ? this.state.selectedDay + '-' + this.month() + '-' + this.year() : this.currentDate() + '-' + this.month() + '-' + this.year();
  let currentSelectedDate = new Date(formatedDate);
  let currentMonth = this.months.indexOf(this.month()) + 1;
  let currentYear = this.year().toString();
  let currentDate = this.state.selectedDay && this.state.selectedDay.toString();
  return (
   <>

    <Header />
    <div className="calendar-container">
     <table className="calendar">
      <thead>
       <CalendarHeader
        prevMonth={this.prevMonth}
        months={this.months}
        month={this.month}
        onSelectChange={this.onSelectChange}
        year={this.year}
        onYearChange={this.onYearChange}
        nextMonth={this.nextMonth}
       />
      </thead>
      <tbody>
       <tr className="week-day-nav">
        {weekdays}
       </tr>
       <Days
        firstDayOfMonth={this.firstDayOfMonth}
        daysInMonth={this.daysInMonth}
        currentDay={this.currentDay}
        onDayClick={this.onDayClick}
        year={this.year()}
        month={this.months.indexOf(this.month()) + 1}
        monthsData={this.state.monthsData[this.year()]}
       />
      </tbody>
     </table>
    <Button
     className="create-new-btn"
     onClick={() => {
      this.createNewEvent();
     }}
    >
     Create New Event
    </Button>
    <Dialog
     className="dialog-popup"
     open={this.state.dailog}
     onClose={() => {
      this.onDailogClose();
     }}
     showCloseButton
     title={formatedDate}
     titleBelow={this.state.dailogSubTitle}
    >
     <Scroller>
      <div className={"scrollbar"}>
       {
        this.state.dailogType === 'form' ?
         <CreateForm
          currentSelectedDate={currentSelectedDate}
          postObj={this.postObj}
          triggerNotification={this.triggerNotification}
         /> :
         <EventsList
          deleteEvent={this.deleteEvent}
          year={currentYear}
          date={currentDate}
          month={currentMonth}
          createNewEvent={this.createNewEvent}
          events={this.state.monthsData[currentYear][currentMonth.toString()][currentDate]}
         />
       }
      </div>
     </Scroller>
    </Dialog>
    <Notification open={this.state.notification}>
     {this.state.notificationMsg}
    </Notification>
   </div>
   </>
   
  );
 }
}
