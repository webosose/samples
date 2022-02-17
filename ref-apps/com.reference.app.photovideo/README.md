## Overview
This tutorial demonstrates the usage of Enact components to create a typical Photo & Video app for webOS OSE.
The enact UI theme used:
 - Sandstone Theme
The Photo & Video app offers the following features:
 - Displays the Videos and Images in a Single Grid Layouts
 - Support for the External Storage
 - Launching the Photo/Video player based on the Content
 - Photo Player features
  - Display details such as Size, Resolution, and title
  - Slide show with Controls
  - Zoom/Setting/Rotate Images
  - Display option to support "Full" Or "Fit" sizes
  - Transition effects on slide shows such as "Fade In" / "Slide"
  - Slide show with speed controls "Slow" / "Normal" and "Fast"
  - Thumbnail view on the selected device
 - Video Player features
  - Play/Pause/Previous/Next video controls
  - Fast forward and Backward Operations
  - Drag and Drop support on the slider

You can use this reference app as follows:
 - Install the app as-is on a webOS OSE target device.
 - Update the source code as required and then deploy on a webOS OSE target device.
 - Analyze the source code to understand the usage of the different Enact components.


## Prerequisites
    Node JS v10 or later                -    Link to download: https://nodejs.org/en/download/
    npm install -g @enact/cli    -  Install the Enact CLI globally.
    npm install -g @webosose/ares-cli   -    Install the webOS OSE CLI.

## Folder Structure
The Photo & Video App project should look like this:

```
com.reference.app.photovideo/
 assets/
 Licences/
 node_modules/
   resources/
   src/
    actions/
  deviceActions.js
  imageActions.js
  navigationActions.js
  types.js
  videoActions.js
    App/
  App.js
  App.module.less
  package.json
    components/
  MediaList/
  PhotoPlayer/
  VideoPlayer/
  README.md
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



## Source Code

Analyze the source code to get an understanding of the functionalities implemented in the Photo & Video app.
Refer to the snippets provided in this section.

### Using Enact Components
 - Panels - Provides a way to manage the different screens of an app.
 - TabLayout - Provides the space for displaying connected devices on the Tab in webOS OSE device
 - MediaList - Component list the Media files i.e Video and Image that are available on the device

``` js
 import { TabLayout, Tab } from "@enact/sandstone/TabLayout";
 import { Panel, Header } from "@enact/sandstone/Panels";
 ...
 <Panel {...rest}>
  <Header
   onClose={handleClose}
  />
  <TabLayout>
   {devices.map((device) => {
    return device.deviceList.length > 0 && device.deviceList.map
    ((deviceList, index) => {
     return (
      <Tab
       className={css.tab} key={deviceList.uri}
       icon='usb'
       onTabClick={() => onSelectDevice(deviceList.
       uri)}
       title={deviceList.name}
       >
        <MediaList
        key={index}
        videoList={videoList}
        imageList={imageList}
        handleNavigate={handleVideoNavigate}
        />
       </Tab>
      )
     })
    })
   }
  </TabLayout>
 </Panel>
```

 - The VirutalGridList populates the Grid list display by using media files.
 - The Media files are rendered with name using the ImageItem component

```js
 import ImageItem from "@enact/sandstone/ImageItem";
 import { VirtualGridList } from "@enact/sandstone/VirtualList";
 ...
 <ImageItem
   {...rest}
   src={encodedPath}
   placeholder={mediaList[index].mediaType && mediaList[index].mediaType ===
   "video"? VideoImg : placeHolderImg}
   onClick={() => mediaList[index].mediaType && mediaList[index].mediaType ===
   "video" ?
   handleNavigate('/videoplayer', mediaList[index], indeximageList.length):
   handleNavigate('/photoPlayer', mediaList[index], index)
  }>
   {mediaList[index].title}
 </ImageItem>
 ...
 <VirtualGridList
  direction='vertical'
  dataSize={mediaList.length}
  itemRenderer={renderItem}
  itemSize={{
  minWidth: ri.scale(500),
  minHeight: ri.scale(500)
  }}
 />
```

## Luna Service Usage

###Video Player Services
 - getVideoList
  - Gets the available video file list included in the attached devices.
  - If the uri is specified, the video file list for the specified URI is provided. Else the image file list for all attached devices is provided.
 - getVideoMetadata
  - Gets the detailed metadata information of the specified URI for the given video file.
  - For Ex: "file_size", "thumbnail", "file_path", "duration", "album","title", and so on.

```js
  getVideoList: ({uri, ...rest}) => {
  let params = {
   uri: uri
  };
  return luna('com.webos.service.mediaindexer', 'getVideoList', params)(rest);
 },
 getVideoMetaData: ({uri, ...rest}) => {
  let params = {
   uri: uri
  };
  return luna('com.webos.service.mediaindexer', 'getVideoMetadata ', params)(rest);
 }
```

###Photo Player Services
 - getImageList
  - Gets the available image file list included in attached devices.
  - If the uri is specified, the image file list for the specified URI is provided. Else the image file list for all attached devices is provided.
 - getAudioMetadata
  - Gets the detailed metadata information of the specified URI for the given image file.
  - For Ex: "file_size", "thumbnail", "file_path", "title", and so on.
``` js
 ...
 getImageList: ({uri, ...rest}) => {
  let params = {
   uri: uri
  };
  return luna('com.webos.service.mediaindexer', 'getImageList', params)(rest);
 },
 getImageMetaData: ({uri, ...rest}) => {
  let params = {
   uri: uri
  };
  return luna('com.webos.service.mediaindexer', 'getImageMetadata ', params)(rest);
 }
```
###Device Services
 - getDeviceList
  - Gets the list of all the attached storage devices.
  - The list can contain devices that are currently attached or the devices attached in the past

``` js
  ...
 getDeviceList: ({subscribe, ...rest}) => {
  let params = {
   subscribe: subscribe
  };
  return luna('com.webos.service.mediaindexer', 'getDeviceList', params)(rest);
 }
```
##Common Luna Service
 - All the service request calls fall into this generic request.
 - Handling of success and failure responses.

```js
 const luna = (
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
## Custom Components Used in the App
###Photo Player Component
 - Handling slideshow for the listed images
 - Thumbnail view on the bottom screen
 - Zoom control option and Rotate option for the user selection
 - Handling Transition events etc

``` js
 ...
 const PhotoPlayer = ({handleNavigate, slideDirection, slides, startSlideIndex}) => {
 return (
  <SettingsProvider>
   <PhotoPlayerBase
    handleNavigate={handleNavigate}
    slides={slides}
    startSlideIndex={startSlideIndex}
    slideDirection={slideDirection}
   />
  </SettingsProvider>
 );
 };
 ...
 const PhotoPlayerBase = ({handleNavigate, hideActionGuide, hideZoomUI, slides = [], slideDirection,
  startSlideIndex = 0}) => {
  ...
 }
 ...

```
###Video Player Component
 - Supports playing mp4 format.
 - handlePrevious and handleNext API will handle playing of previous and next file.
 - handleBack API moves from the video player to the media list screen.
 - Displays filename, duration, current time, and file size over the player screen.

``` js
 const VideoPlayer = (
  {
  // actionGuideLabel,
   handleBack,
   handleNext,
   handlePrevious,
   playlist,
   ...rest
  }) => {
   ...
   return (
    <VideoPlayerBase
    {...rest}
    onJumpForward={handleNext}
    onJumpBackward={handlePrevious}
    // onEnded={handleNext}
    onBack={handleBack}
    loop={state.repeat.loop}
    poster={playlist.thumbnail}
    thumbnailSrc={playlist.thumbnail}
    title={playlist.title}
    infoComponents={playlist.title}
    >
     <source src={playlist.file_path} type="video/mp4" />
    </VideoPlayerBase>
  );
 };
```

## Installing the App on the Target Device
Go to the app folder and execute the following commands:
###Package the enact source code.
`enact pack` A dist folder will be created.

###Package the app to create an IPK.
`ares-package dist`
An IPK named com.reference.app.photovideo_1.0.2_all.ipk is created.

###Install the IPK
`ares-install --device <TARGET_DEVICE> com.reference.app.photovideo_1.0.2_all.ipk`