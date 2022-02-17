## Overview
This tutorial demonstrates the usage of Enact components to create a typical MusicPlayer for webOS OSE.

The enact UI theme used:
 - Sandstone Theme

The features offered by the MusicPlayer app:

 - Displays the music files in grid Layouts
 - Support for the External Storage
 - Support for mp3 and Ogg files formats
MusicPlayer features
 - Display Time duration on screen
 - Album details with Thumbnail information
 - Play/Pause/Previous/Next video controls
 - Fast forward and Backward Operations
 - Seek support on the slider
You can use this reference app as follows:

 - Install the app as-is on a webOS OSE target device.
 - Update the source code as required and then deploy on a webOS OSE target device.
 - Analyze the source code to understand the usage of the different Enact components.

## Prerequisites
    Node JS v10 or later                -    Link to download: https://nodejs.org/en/download/
    npm install -g @enact/cli    -  Install the Enact CLI globally.
    npm install -g @webosose/ares-cli   -    Install the webOS OSE CLI.

## Folder Structure
The MusicPlayer App project should look like this:

```
com.reference.app.musicplayer/
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
  AudioList/
  AudioPlayer/
 reducers/
 services/
 store/
 styles/
 util/
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

##Source Code
Analyze the source code to get an understanding of the functionalities implemented in the music player app. Refer to the snippets provided in this section.

Note: Clone/download this code on your local development system.

###Using Enact Components
 - Panels - Provides a way to manage the different screens of an app.
 - TabLayout - Provides the space for displaying connected devices on the Tab in the webOS OSE device.
 - AudioList - Component lists the music files that are available on the device.
```js
import { TabLayout, Tab } from "@enact/sandstone/TabLayout";
import { Panel, Header } from "@enact/sandstone/Panels";
...
 <Panel {...rest}>
      <Header onClose={handleClose} />
      <TabLayout>
        {devices.map((device) => {
          return (
            device.deviceList.length > 0 &&
            device.deviceList.map((deviceList, index) => {
              return (
                <Tab
                  className={css.tab}
                  key={deviceList.uri}
                  icon="usb"
                  onTabClick={() => getListAudio(deviceList.uri)}
                  title={deviceList.name}
                >
                  <AudioList
                    key={index}
                    audiolist={audioList}
                    handleNavigate={handleAudioNavigate}
                  />
                </Tab>
              );
            })
          );
        })}
      </TabLayout>
    </Panel>
```

 - VirutalGridList - Populates grid list display by using music files.
 - ImageItem - Component used to render the music files with name and duration.
```js
import ImageItem from "@enact/sandstone/ImageItem";
import { VirtualGridList } from "@enact/sandstone/VirtualList";
...
      <ImageItem
        {...rest}
        centered={true}
        src={encodedPath}
        placeholder={placeHolderImg}
        label={"Time : " + duration}
        onClick={() => handleNavigate("/audioplayer", audiolist[index], index)}
      >
        {audiolist[index].title}
      </ImageItem>
...
    <VirtualGridList
      direction="vertical"
      spacing={5}
      dataSize={audiolist.length}
      itemRenderer={renderItem}
      itemSize={{
        minWidth: ri.scale(500),
        minHeight: ri.scale(500),
      }}
    />
```
###Luna Service usage
The application uses the "com.webos.service.mediaindexer" luna service for listing devices, music files, and getting metadata information.

The methods are as follows

- getDeviceList
 Gets the list of all the attached storage devices.
 The list can contain devices that are currently attached or the devices attached in the past.
- getAudioList
 Gets the available audio file list included in attached devices.
 If the uri is specified, the audio file list for the specified URI is provided. Else the audio file list for all attached devices is provided.
- getAudioMetadata
 Gets the detailed metadata information of the specified URI for the given audio file.
 For Ex: "file_size", "thumbnail", "duration", "file_path" ,"album", "title" etc

```js
    getDeviceList: ({subscribe, ...rest}) => {
        let params = {
            subscribe: subscribe
        };
        return luna('com.webos.service.mediaindexer', 'getDeviceList', params)(rest);
    }
    getAudioList: ({uri, ...rest}) => {
        let params = {
            uri: uri
        };
        return luna('com.webos.service.mediaindexer', 'getAudioList', params)(rest);
    },

    getAudioMetaData: ({uri, ...rest}) => {
        let params = {
            uri: uri
        };
        return luna('com.webos.service.mediaindexer', 'getAudioMetadata', params)(rest);
    }
...
...
 const luna =  (
   service,
   method,
   {subscribe = false, timeout = 0, ...params} = {},
   map
 ) => (
  ({onSuccess, onFailure, onTimeout, onComplete, ...additionalParams} = {}) => {
   const req = new LS2Request();
   req.send({
    service: 'luna://' + service,
    method,
    parameters: Object.assign({}, params, additionalParams),
    onSuccess: handler(onSuccess, map),
    onFailure: handler(onFailure),
    onTimeout: handler(onTimeout),
    onComplete: handler(onComplete, map),
    subscribe,
    timeout
   });
   return req;
  }
 );
```
###Custom Components used in App

####Audio Player
This is the main component derived from the "audio" HTML base which helps to play/pause audio files on the device.
Displays the current playing information on the device.
Handles to play previous or next audio files on the list.

####Album Info
Displays the album information such as "Title", "Artist", "Album name" and "Thumbnail" image for each music file.

####Media Slider
Seek the audio file at a particular position. So the audio starts playing from the current position.
Hides the media knob when seeking disabled.
 ```js
  <AudioPlayer
    autoCloseTimeout={7000}
    disabled={false}
    feedbackHideDelay={3000}
    handleBack={() => handleBack("home")}
    handleNext={handleNextAudio}
    handlePrevious={handlePreviousAudio}
 ...
    playlist={audioMetaData}
    seekDisabled={false}
    spotlightDisabled={false}
    thumbnailSrc={audioMetaData.thumbnail}
    title={"Music Player"}
    titleHideDelay={4000}
  />
 ...
...
       <AlbumInfo
        title={title}
        artist={mediaProps.artist}
        album={mediaProps.album}
        thumbnail={thumbnailSrc}
        isPlaying= {prevCommand.current === "play"}
      />
...
        <MediaSlider
         backgroundProgress={state.proportionLoaded}
         disabled={disabled || state.sourceUnavailable}
         forcePressed={state.slider5WayPressed}
         onBlur={handleSliderBlur}
         onChange={onSliderChange}
         onFocus={handleSliderFocus}
         onKeyDown={handleSliderKeyDown}
         onKnobMove={handleKnobMove}
         onSpotlightUp={handleSpotlightUpFromSlider}
         selection={proportionSelection}
         spotlightDisabled={
         spotlightDisabled || !state.mediaControlsVisible
         }
         value={state.proportionPlayed}
         visible={state.mediaSliderVisible}
         />
```
####Utility Method
 - secondsToTime
  Takes the seconds value as input and represents the values in user understandable format.

 - getEncodedPath
  Encodes the image URI path to avoid reading issues from the system.
  It adds the "file:///" when the path directly starts with "/".
  Replaces the "/" with "%20" format to avoid file read issues.
```js
 const secondsToTime = (seconds, durfmt, config) => {
   const includeHour = config && config.includeHour;

   if (durfmt) {
  const parsedTime = parseTime(seconds);
  const timeString = durfmt.format(parsedTime).toString();

  if (includeHour && !parsedTime.hour) {
    return "00:" + timeString;
  } else {
    return timeString;
  }
   }

   return includeHour ? "00:00:00" : "00:00";
 };
 ...
 const getEncodedPath = (path) => {
   let encodedPath = "";
   if (path && path.length > 0) {
  encodedPath = encodeURIComponent(path);
  if (path && path.substring(0, 1) === "/") {
    encodedPath = "file:///" + encodedPath;
  }
  encodedPath = encodedPath.replace(/ /g, "%20");
   }
   return encodedPath;
 };
```
## Installing the App on the Target Device
Go to the app folder and execute the following commands:

###Package the enact source code.
`enact pack` A dist folder will be created.

###Package the app to create an IPK.
`ares-package dist`
An IPK named com.reference.app.musicplayer_1.0.2_all.ipk is created.

###Install the IPK
`ares-install --device <TARGET_DEVICE> com.reference.app.musicplayer_1.0.2_all.ipk`