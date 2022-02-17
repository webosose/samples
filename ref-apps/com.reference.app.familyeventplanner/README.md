##Overview
This tutorial demonstrates the usage of Enact components to create a typical Calendar app for webOS OSE.
The enact UI theme used:
 - Moonstone Theme
The features offered by the calendar app:
 - Monthly calendar display
 - Create a new event with a specific Date
 - Highlighting the current date to the user
 - Display the list of events when the user selected on the same date
 - Multiple event creation on the same date

You can use this calculator reference app as follows:
 - Install the app as-is on a webOS OSE target device.
 - Update the source code as required and then deploy on a webOS OSE target device.
 - Analyze the source code to understand the usage of the different Enact components.

## Folder Structure

After creation, your project should look like this:

```
com.reference.app.familyeventplanner/
 assets/
 Licences/
 node_modules/
   resources/
   src/
  actions/
  App/
   App.js
   App.module.less
   package.json
    components/
 reducers/
 services/
 store/
 styles/
 views/
 index.js
 webos-meta/
  appinfo.json
  icon-large.png
  icon-mini.png
  icon.png
  index.html
 LICENSE
 npm-shrinkwrap.json
 oss-pkg-info.yaml
 package-lock.json
   package.json
 README.md
```

For the project to build, **these files must exist with exact filenames**:

* `package.json` is the core package manifest for the project
* `src/index.js` is the JavaScript entry point.

You can delete or rename the other files.

You can update the `license` entry in `package.json` to match the license of your choice. For more
information on licenses, please see the [npm documentation](https://docs.npmjs.com/files/package.json#license).

## Available Scripts

In the project directory, you can run:

### `npm run serve`

Builds and serves the app in the development mode.<br>
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run pack` and `npm run pack-p`

Builds the project in the working directory. Specifically, `pack` builds in development mode with code un-minified and with debug code included, whereas `pack-p` builds in production mode, with everything minified and optimized for performance. Be sure to avoid shipping or performance testing on development mode builds.

### `npm run watch`

Builds the project in development mode and keeps watch over the project directory. Whenever files are changed, added, or deleted, the project will automatically get rebuilt using an active shared cache to speed up the process. This is similar to the `serve` task, but without the http server.

### `npm run clean`

Deletes previous build fragments from ./dist.

### `npm run lint`

Runs the Enact configuration of Eslint on the project for syntax analysis.

### `npm run test` and `npm run test-watch`

These tasks will execute all valid tests (files that end in `-specs.js`) that are within the project directory. The `test` is a standard single execution pass, while `test-watch` will set up a watcher to re-execute tests when files change.

## Source Code
The source code is available at XXXXXXXXXXXXXXXX.

Analyze the source code to get an understanding of the functionalities implemented in the calendar app. Refer to the snippets provided in this section.

Note: Clone/download this code on your local development system.

###Using Enact UI Components
 Dialog: A modal dialog component, ready to use in Moonstone applications. Here we use it for creating events and displaying event lists to the user.
 Scroller: This scroll bar is visible when many events are present in the list.
 Notification: This triggers the user to set the event name and description if its missed.
```js
import Dialog from '@enact/moonstone/Dialog';
import Scroller from '@enact/moonstone/Scroller';
import Notification from '@enact/moonstone/Notification';
...
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
```
###Luna Service Usage
The application uses the "com.webos.service.db" luna service for finding, creating, and deleting events on devices. The API calls are as follows:

 putKind - Creates the DB for the application if it does not exist on the system.
   Registers a kind with the database.
   Kinds define the owner, and the indexes for a JSON data object.
   Indexes can be composed of single or multiple properties.
 When you create your index, be aware that queries can only return results that are indexed, and are contiguously ordered.

 put  -  Stores JSON data objects of a particular Kind into the database.
    The method will:
    Assign an ID field to each object, if it was not set.
    Return the ID and rev for each stored object.
 find - Returns a set of objects that match the query specified in the query parameter.
 del  - Deletes JSON data objects from the database.

```js
import LS2Request from '@enact/webos/LS2Request';

export const dbServices = {
    createKind : (cb) => {
        return new LS2Request().send({
            service: 'luna://com.webos.service.db',
            method: 'putKind',
            parameters: {
                'id':'com.reference.app.service.familyeventplanner:4',
                'owner':'com.reference.app.familyeventplanner',
                'indexes':[
                    {'name':'year', 'props':[{'name':'year'}]},
                    {'name':'month', 'props':[{'name':'month'}]},
                    {'name':'date', 'props':[{'name':'date'}]},
                    {'name':'fullDate', 'props':[{'name':'year'}, {'name':'month'}, {'name':'date'}]}
                ]
            },
...
        });
    },
    putData : (obj, cb) => {
        return new LS2Request().send({
            service: 'luna://com.webos.service.db',
            method: 'put',
            parameters: {
                'objects':[
                    obj
                ]
            },
...
        });
    },
    findData : (queryObj, cb) => {
        return new LS2Request().send({
            service: 'luna://com.webos.service.db',
            method: 'find',
            parameters: {
                'query': queryObj
            },
...
        });
    },
    deleteEvent: (id) => {
        return new LS2Request().send({
            service: 'luna://com.webos.service.db',
            method: 'del',
            parameters: {
                'ids' : [id]
            },
...
        });
    }
};
```
###Custom Components Used in the App
####Calendar Header
This component populates the UI with the year, month selection by using dropdown and arrows.
````js
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
```
####Days
Displays the days of the selected month along with an event list that was created for the specific date in order.
if more events are present on the day, The "Click to view more" option will be displayed to the user
Highlights the current day to the user.
```js
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
    ...
};
```
###Utility - Find Query & Filter Data
  findQuery - This is a utility method that is helpful during event list preparation and deletion of events.
  filterData - Prepares the data for the current year/month and date, and filters the data to display for the specific month.
```js
export const generateQuery = {
    findQuery : (obj) => {
        let query = {
            'from':_kind,
            'where':[]
        };
        for (let key in obj) {
            query['where'].push({
                'prop' : key,
                'op': '=',
                'val': obj[key]
            });
        }
        return query;
    },
    filterData : (arr) => {
        let filteredData = {};

        for (let i = 0; i < arr.length; i++) {
...
            let temp = {};
            temp['title'] = arr[i]['event']['title'];
            temp['description'] = arr[i]['event']['description'];
            temp['image'] = arr[i]['image'];

            filteredData[arr[i].year][arr[i].month][arr[i].date].push(temp);
        }

        return filteredData;
    }
```
## Installing the App on the Target Device
Go to the app folder and execute the following commands:

###Package the enact source code.
`enact pack` A dist folder will be created.

###Package the app to create an IPK.
`ares-package dist`
An IPK named com.reference.app.familyeventplanner_1.0.2_all.ipk is created.

###Install the IPK
`ares-install --device <TARGET_DEVICE> com.reference.app.familyeventplanner_1.0.2_all.ipk`