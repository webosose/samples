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

/**
 * Provides Goldstone-themed video player components.
 *
 * @module goldstone/VideoPlayer
 * @exports Video
 * @exports VideoPlayer
 * @exports VideoPlayerBase
 * @exports MediaControls
 */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/exhaustive-deps */
import ApiDecorator from '@enact/core/internal/ApiDecorator';
import {on, off} from '@enact/core/dispatcher';
import {memoize} from '@enact/core/util';
import {adaptEvent, call, forKey, forward, forwardWithPrevent, handle, preventDefault, stopImmediate, returnsTrue} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import {platform} from '@enact/core/platform';
import EnactPropTypes from '@enact/core/internal/prop-types';
import {perfNow, Job} from '@enact/core/util';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import {toUpperCase} from '@enact/i18n/util';
import Spotlight from '@enact/spotlight';
import {SpotlightContainerDecorator} from '@enact/spotlight/SpotlightContainerDecorator';
import {Spottable} from '@enact/spotlight/Spottable';
import Announce from '@enact/ui/AnnounceDecorator/Announce';
import ComponentOverride from '@enact/ui/ComponentOverride';
import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import {FloatingLayerContext} from '@enact/ui/FloatingLayer/FloatingLayerDecorator';
import Slottable from '@enact/ui/Slottable';
import Touchable from '@enact/ui/Touchable';
import DurationFmt from 'ilib/lib/DurationFmt';
import equals from 'ramda/src/equals';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useState, useEffect, useCallback, useContext, useRef, memo} from 'react';
import ReactDOM from 'react-dom';
import $L from '@enact/sandstone/internal/$L';
import Skinnable from '@enact/sandstone/Skinnable';
import Spinner from '@enact/sandstone/Spinner';
import Button from '@enact/sandstone/Button';
import {calcNumberValueOfPlaybackRate, secondsToTime} from './util';
import Overlay from './Overlay';
import Media from './Media';
import MediaControls from './MediaControls';
import MediaTitle from './MediaTitle';
import MediaSlider from './MediaSlider';
import FeedbackContent from './FeedbackContent';
import FeedbackTooltip from './FeedbackTooltip';
import Times from './Times';
import Video from './Video';
import css from './VideoPlayer.module.less';

const SpottableDiv = Touchable(Spottable('div'));
const RootContainer = memo(
 SpotlightContainerDecorator(
  {
   enterTo: 'default-element',
   defaultElement: [`.${css.controlsHandleAbove}`, `.${css.controlsFrame}`]
  },
  'div'
 )
);

const ControlsContainer = memo(
 SpotlightContainerDecorator(
  {
   enterTo: '',
   straightOnly: true
  },
  'div'
 )
);

const memoGetDurFmt = memoize((/* locale */) => new DurationFmt({
 length: 'medium', style: 'clock', useNative: false
}));

const getDurFmt = (locale) => {
 if (typeof window === 'undefined') return null;

 return memoGetDurFmt(locale);
};

const forwardWithState = (type) => adaptEvent(call('addStateToEvent'), forwardWithPrevent(type));

// provide forwarding of events on media controls
const forwardControlsAvailable = forward('onControlsAvailable');
// const forwardPlay = forwardWithState('onPlay');
const forwardPlay = forward('onPlay');
const forwardPause = forwardWithState('onPause');
const forwardFastForward = forwardWithState('onFastForward');

const AnnounceState = {
 // Video is loaded but additional announcements have not been made
 READY: 0,

 // The title should be announced
 TITLE: 1,

 // The title has been announce
 TITLE_READ: 2,

 // The infoComponents should be announce
 INFO: 3,

 // All announcements have been made
 DONE: 4
};

// Function to get previous value from the state
const usePrevious = (value) => {
 const ref = useRef();
 useEffect(() => {
  ref.current = value;
 });
 return ref.current;
};


/**
 * Every callback sent by [VideoPlayer]{@link goldstone/VideoPlayer} receives a status package,
 * which includes an object with the following key/value pairs as the first argument:
 *
 * @typedef {Object} videoStatus
 * @memberof sandstone/VideoPlayer
 * @property {String} type - Type of event that triggered this callback
 * @property {Number} currentTime - Playback index of the media in seconds
 * @property {Number} duration - Media's entire duration in seconds
 * @property {Boolean} paused - Playing vs paused state. `true` means the media is paused
 * @property {Number} playbackRate - Current playback rate, as a number
 * @property {Number} proportionLoaded - A value between `0` and `1` representing the proportion of the media that has loaded
 * @property {Number} proportionPlayed - A value between `0` and `1` representing the proportion of the media that has already been shown
 *
 * @public
 */

/**
 * A set of playback rates when media fast forwards, rewinds, slow-forwards, or slow-rewinds.
 *
 * The number used for each operation is proportional to the normal playing speed, 1. If the rate
 * is less than 1, it will play slower than normal speed, and, if it is larger than 1, it will play
 * faster. If it is negative, it will play backward.
 *
 * The order of numbers represents the incremental order of rates that will be used for each
 * operation. Note that all rates are expressed as strings and fractions are used rather than decimals
 * (e.g.: `'1/2'`, not `'0.5'`).
 *
 * @typedef {Object} playbackRateHash
 * @memberof goldstone/VideoPlayer
 * @property {String[]} fastForward - An array of playback rates when media fast forwards
 * @property {String[]} rewind - An array of playback rates when media rewinds
 * @property {String[]} slowForward - An array of playback rates when media slow-forwards
 * @property {String[]} slowRewind - An array of playback rates when media slow-rewinds
 *
 * @public
 */

/**
 * A player for video {@link goldstone/VideoPlayer.VideoPlayerBase}.
 *
 * @class VideoPlayerBase
 * @memberof goldstone/VideoPlayer
 * @ui
 * @public
 */
function VideoPlayerBase (
  {
   announce,
   autoCloseTimeout,
   className,
   feedbackHideDelay,
   disabled,
   infoComponents,
   jumpBy,
   loading,
   locale,
   mediaControlsComponent,
   miniFeedbackHideDelay,
   noAutoPlay,
   noAutoShowMediaControls,
   noMediaSliderFeedback,
   noMiniFeedback,
   noSlider,
   noSpinner,
   onBack,
   onJumpBackward,
   onJumpForward,
   playbackRateHash,
   seekDisabled,
   selection,
   spotlightDisabled,
   spotlightId,
   style,
   thumbnailComponent,
   thumbnailSrc,
   title,
   titleHideDelay,
   videoComponent: VideoComponent,
   ...mediaProps
  }
)  {
 /* eslint no-use-before-define: ["error", { "variables": false }]*/
 let handleSpotlightUpFromSlider = null;
 const titleRef = useRef(null);
 const announceRef = useRef(null);
 const playbackRates = useRef([]);
 const player = useRef({});
 const playbackRate = useRef(null);
 const rewindBeginTime = useRef(null);
 // Internal State
 const video = useRef(null);
 const prevCommand = useRef(noAutoPlay ? 'pause' : 'play');
 const speedIndex = useRef(0);
 const id = Math.random().toString(36).substr(2, 8);
 const sliderScrubbing = useRef();
 const sliderKnobProportion = useRef(0);
 const pulsedPlaybackRate = useRef();
 const pulsedPlaybackState = useRef();
 const mediaControlsSpotlightId = useRef(`${spotlightId}_mediaControls`);
 const showMiniFeedback = useRef(false);
 const [state, setSettings] = useState({
  announce: AnnounceState.READY,
  currentTime: 0,
  duration: 0,
  error: false,
  loading: false,
  paused: noAutoPlay,
  playbackRate: 1,
  titleOffsetHeight: 0,
  bottomOffsetHeight: 0,

  // Non-standard state computed from properties
  bottomControlsRendered: true,
  feedbackAction: 'idle',
  feedbackVisible: false,
  infoVisible: false,
  mediaControlsVisible: false,
  mediaSliderVisible: false,
  miniFeedbackVisible: false,
  proportionLoaded: 0,
  proportionPlayed: 0,
  sourceUnavailable: true,
  titleVisible: true
 });

 const prevStateRef = usePrevious(state);
 const prevPropsRef = usePrevious(arguments[0]);
 const context = useContext(FloatingLayerContext);
 const floatingLayerController = useRef();

 /**
  * Returns an object with the current state of the media including `currentTime`, `duration`,
  * `paused`, `playbackRate`, `proportionLoaded`, and `proportionPlayed`.
  *
  * @function
  * @memberof goldstone/VideoPlayer.VideoPlayerBase.prototype
  * @returns {Object}
  * @public
  */
 const getMediaState = () => {
  return {
   currentTime       : state.currentTime,
   duration          : state.duration,
   paused            : state.paused,
   playbackRate      : video.current.playbackRate,
   proportionLoaded  : state.proportionLoaded,
   proportionPlayed  : state.proportionPlayed
  };
 };

 const hideFeedback = () => {
  if (state.feedbackVisible && state.feedbackAction !== 'focus') {
   setSettings(prevState => (
    {
     ...prevState,
     feedbackVisible: false,
     feedbackAction: 'idle'
    })
   );
  }
 };

 const hideTitle = () => {
  setSettings(prevState => ({...prevState, titleVisible: false}));
 };

 const stopDelayedFeedbackHide = useCallback(() => {
  new Job(hideFeedback).stop();
 }, [hideFeedback]);

 const stopDelayedTitleHide = useCallback(() => {
  new Job(hideTitle).stop();
 }, [hideTitle]);

 /**
  * If the announce state is either ready to read the title or ready to read info, advance the
  * state to "read".
  *
  * @returns {Boolean} Returns true to be used in event handlers
  * @private
  */
 const markAnnounceRead = useCallback(() => {
  if (state.announce === AnnounceState.TITLE) {
   setSettings(prevState => ({...prevState, announce: AnnounceState.TITLE_READ}));
  } else if (state.announce === AnnounceState.INFO) {
   setSettings(prevState => ({...prevState, announce: AnnounceState.DONE}));
  }

  return true;
 }, [state.announce]);

 const doAutoClose = () => {
  stopDelayedFeedbackHide();
  stopDelayedTitleHide();
  setSettings(prevState => ({
   ...prevState,
   feedbackVisible: false,
   mediaControlsVisible: false,
   mediaSliderVisible: prevState.mediaSliderVisible && prevState.miniFeedbackVisible,
   infoVisible: false
  }));
  markAnnounceRead();
 };

 const autoCloseJob = new Job(doAutoClose);

 const startAutoCloseTimeout = useCallback(() => {
  // If state.more is used as a reference for when this function should fire, timing for
  // detection of when "more" is pressed vs when the state is updated is mismatched. Using an
  // instance variable that's only set and used for this express purpose seems cleanest.
  if (autoCloseTimeout && state.mediaControlsVisible) {
   // autoCloseJob.startAfter(autoCloseTimeout);
  }
 }, [autoCloseTimeout, state.mediaControlsVisible]);

 const activityDetected = useCallback(() => {
  startAutoCloseTimeout();
 }, [startAutoCloseTimeout]);

 const startDelayedFeedbackHide = useCallback(() => {
  if (feedbackHideDelay) {
   new Job(hideFeedback).startAfter(feedbackHideDelay);
  }
 }, [feedbackHideDelay, hideFeedback]);

 const startDelayedTitleHide = useCallback(() => {
  if (titleHideDelay) {
   new Job(hideTitle).startAfter(titleHideDelay);
  }
 }, [hideTitle, titleHideDelay]);

 /**
  * Shows media controls.
  *
  * @function
  * @memberof goldstone/VideoPlayer.VideoPlayerBase.prototype
  * @public
  */
 const showControls = useCallback(() => {
  if (disabled) {
   return;
  }
  startDelayedFeedbackHide();
  startDelayedTitleHide();
  let announceType = '';
  if (state.announce === AnnounceState.READY) {
   // if we haven't read the title yet, do so this time
   announceType = AnnounceState.TITLE;
  } else if (state.announce === AnnounceState.TITLE) {
   // if we have read the title, advance to INFO so title isn't read again
   announceType = AnnounceState.TITLE_READ;
  }
  setSettings(prevState => ({
   ...prevState,
   announce: announceType,
   bottomControlsRendered: true,
   feedbackAction: 'idle',
   feedbackVisible: true,
   mediaControlsVisible: true,
   mediaSliderVisible: true,
   miniFeedbackVisible: false,
   titleVisible: true
  }));
 }, [disabled, startDelayedFeedbackHide, startDelayedTitleHide, state]);

 const showControlsFromPointer = () => {
  Spotlight.setPointerMode(false);
  showControls();
 };

 const handleGlobalKeyDown = handle(
  returnsTrue(activityDetected),
  forKey('down'),
  () => (
   !state.mediaControlsVisible &&
   !Spotlight.getCurrent() &&
   Spotlight.getPointerMode() &&
   !spotlightDisabled
  ),
  preventDefault,
  stopImmediate,
  showControlsFromPointer
 );

 const showFeedback = useCallback(() => {
  if (state.mediaControlsVisible) {
   setSettings(prevState => ({...prevState, feedbackVisible: true}));
  } else {
   const shouldShowSlider = pulsedPlaybackState.current !== null || calcNumberValueOfPlaybackRate(playbackRate.current) !== 1;

   if (showMiniFeedback.current && (!state.miniFeedbackVisible || state.mediaSliderVisible !== shouldShowSlider)) {
    setSettings(prevState => ({
     ...prevState,
     mediaSliderVisible: shouldShowSlider && !noMediaSliderFeedback,
     miniFeedbackVisible: !(prevState.loading || !prevState.duration || prevState.error)
    }));
   }
  }
 }, [noMediaSliderFeedback, state.mediaControlsVisible, state.mediaSliderVisible, state.miniFeedbackVisible]);

 /**
  * Set the media playback time index
  *
  * @function
  * @memberof goldstone/VideoPlayer.VideoPlayerBase.prototype
  * @param {Number} timeIndex - Time index to seek
  * @public
  */
 const seek = useCallback((timeIndex) => {
  if (!seekDisabled && !isNaN(video.current.duration) && !state.sourceUnavailable) {
   video.current.currentTime = timeIndex;
  } else {
   forward('onSeekFailed', {}, arguments[0]);
  }
 }, [seekDisabled, state.sourceUnavailable]);

 const hideMiniFeedback = () => {
  if (state.miniFeedbackVisible) {
   showMiniFeedback.current = false;
   setSettings(prevState => ({
    ...prevState,
    mediaSliderVisible: false,
    miniFeedbackVisible: false
   }));
  }
 };

 const hideMiniFeedbackJob = new Job(hideMiniFeedback);

 const startDelayedMiniFeedbackHide = useCallback((delay = miniFeedbackHideDelay) => {
  if (delay) {
   hideMiniFeedbackJob.startAfter(delay);
  }
 }, [hideMiniFeedbackJob, miniFeedbackHideDelay]);

 /**
  * Step a given amount of time away from the current playback position.
  * Like [seek]{@link goldstone/VideoPlayer.VideoPlayer#seek} but relative.
  *
  * @function
  * @memberof goldstone/VideoPlayer.VideoPlayerBase.prototype
  * @param {Number} distance - Time value to jump
  * @public
  */
 const jump = useCallback((distance, isRewind = false) => {
  if (state.sourceUnavailable) {
   return;
  }

  pulsedPlaybackRate.current = toUpperCase(new DurationFmt({length: 'long'}).format({second: jumpBy}));
  pulsedPlaybackState.current = distance > 0 ? 'jumpForward' : 'jumpBackward';
  showFeedback();
  startDelayedFeedbackHide();
  if (!isRewind) {
   seek(state.currentTime + distance);
  } else {
   const currentTime = video.current.currentTime;
   video.current.currentTime = (currentTime >= 3.0) ? currentTime + distance : 0;
  }
  startDelayedMiniFeedbackHide();
 }, [jumpBy, seek, showFeedback, startDelayedFeedbackHide, startDelayedMiniFeedbackHide, state.currentTime, state.sourceUnavailable]);

 const stopDelayedMiniFeedbackHide = useCallback(() => {
  hideMiniFeedbackJob.stop();
 }, [hideMiniFeedbackJob]);

 const clearPulsedPlayback = () => {
  pulsedPlaybackRate.current = null;
  pulsedPlaybackState.current = null;
 };

 /**
  * Calculates the time that has elapsed since. This is necessary for browsers until negative
  * playback rate is directly supported.
  *
  * @private
  */
 const rewindManually = () => {
  const now = perfNow(),
   distance = now - rewindBeginTime.current,
   pbRate = calcNumberValueOfPlaybackRate(playbackRate.current),
   adjustedDistance = (distance * pbRate) / 1000;
  jump(adjustedDistance, true);
  stopDelayedMiniFeedbackHide();
  clearPulsedPlayback();
  startRewindJob(); // Issue another rewind tick
 };

 const rewindJob = new Job(rewindManually, 100);

 /**
  * Starts rewind job.
  *
  * @private
  */
 const startRewindJob = () => {
  rewindBeginTime.current = perfNow();
  if (prevCommand.current === 'rewind') {
   // rewindJob.start();
   setTimeout(() => {rewindManually()}, 100)
  }
 };

 /**
  * Stops rewind job.
  *
  * @private
  */
 const stopRewindJob = useCallback(() => {
  rewindJob.stop();
 }, [rewindJob]);

 const stopAutoCloseTimeout = useCallback(() => {
  autoCloseJob.stop();
 }, [autoCloseJob]);

 const announceJob = new Job(msg => (announceRef.current && announceRef.current.announce(msg)), 200);
 const renderBottomControl = new Job(() => {
  if (!state.bottomControlsRendered) {
   setSettings(prevState => ({...prevState, bottomControlsRendered: true}));
  }
 });

 const slider5WayPressJob = new Job(() => {
  setSettings(prevState => ({...prevState, slider5WayPressed: false}));
 }, 200);

 const sliderTooltipTimeJob = new Job((time) => setSettings(prevState => ({...prevState, sliderTooltipTime: time})), 20);

 useEffect(() => {
  on('mousemove', activityDetected);
  if (platform.touch) {
   on('touchmove', activityDetected);
  }
  document.addEventListener('keydown', handleGlobalKeyDown, {capture: true});
  document.addEventListener('wheel', activityDetected, {capture: true});
  startDelayedFeedbackHide();
  if (context && typeof context === 'function') {
   floatingLayerController.current = context(() => {});
  }


  // Cleanup
  return () => {
   off('mousemove', activityDetected);
   if (platform.touch) {
    off('touchmove', activityDetected);
   }
   document.removeEventListener('keydown', handleGlobalKeyDown, {capture: true});
   document.removeEventListener('wheel', activityDetected, {capture: true});
   stopRewindJob();
   stopAutoCloseTimeout();
   stopDelayedTitleHide();
   stopDelayedFeedbackHide();
   stopDelayedMiniFeedbackHide();
   announceJob.stop();
   renderBottomControl.stop();
   sliderTooltipTimeJob.stop();
   slider5WayPressJob.stop();
   if (floatingLayerController.current) {
    floatingLayerController.current.unregister();
   }
  };
 }, [activityDetected, announceJob, context, handleGlobalKeyDown, renderBottomControl, slider5WayPressJob, sliderTooltipTimeJob, startDelayedFeedbackHide, stopAutoCloseTimeout, stopDelayedFeedbackHide, stopDelayedMiniFeedbackHide, stopDelayedTitleHide, stopRewindJob]);

 const getHeightForElement = (elementName) => {
  const element = player.current.querySelector(`.${css[elementName]}`);
  if (element) {
   return element.offsetHeight;
  } else {
   return 0;
  }
 };

 useEffect(() => {

  if (titleRef.current && state.infoVisible &&
   (!prevStateRef.infoVisible || !equals(infoComponents, prevPropsRef.infoComponents))
  ) {
   titleRef.current.style.setProperty('--infoComponentsOffset', `${getHeightForElement('infoComponents')}px`);
  }

  if (
   !state.mediaControlsVisible && prevStateRef && prevStateRef.mediaControlsVisible !== state.mediaControlsVisible ||
   !state.mediaSliderVisible && prevStateRef && prevStateRef.mediaSliderVisible !== state.mediaSliderVisible
  ) {
   if (typeof floatingLayerController.current !== 'undefined') {
    floatingLayerController.current.notify({action: 'closeAll'});
   }
  }

  if (spotlightId !== prevPropsRef && prevPropsRef && prevPropsRef.spotlightId) {
   mediaControlsSpotlightId.current = `${spotlightId}_mediaControls`;
  }

  if (!state.mediaControlsVisible && prevStateRef && prevStateRef.mediaControlsVisible) {
   forwardControlsAvailable({available: false}, arguments[0]);
   stopAutoCloseTimeout();

   if (!spotlightDisabled) {
    // If last focused item were in the media controls or slider, we need to explicitly
    // blur the element when MediaControls hide. See ENYO-5648
    const current = Spotlight.getCurrent();
    const bottomControls = document.querySelector(`.${css.bottom}`);
    if (current && bottomControls && bottomControls.contains(current)) {
     current.blur();
    }
    // when in pointer mode, the focus call below will only update the last focused for
    // the video player and not set the active container to the video player which will
    // cause focus to land back on the media controls button when spotlight restores
    // focus.
    if (Spotlight.getPointerMode()) {
     Spotlight.setActiveContainer(spotlightId);
    }
    // Set focus to the hidden spottable control - maintaining focus on available spottable
    // controls, which prevents an additional 5-way attempt in order to re-show media controls
    Spotlight.focus(`.${css.controlsHandleAbove}`);
   }
  } else if (state.mediaControlsVisible && prevStateRef && !prevStateRef.mediaControlsVisible) {
   forwardControlsAvailable({available: true}, arguments[0]);
   startAutoCloseTimeout();
   if (!spotlightDisabled) {
    const current = Spotlight.getCurrent();
    if (!current || player.current.contains(current)) {
     // Set focus within media controls when they become visible.
     Spotlight.focus(mediaControlsSpotlightId.current);
    }
   }
  }
  // Once video starts loading it queues bottom control render until idle
  if (state.bottomControlsRendered && prevStateRef && !prevStateRef.bottomControlsRendered && !state.mediaControlsVisible) {
   showControls();
  }

  if (state.slider5WayPressed) {
   slider5WayPressJob.start();
  }

 }, [arguments, infoComponents, prevPropsRef, prevStateRef, showControls, slider5WayPressJob, spotlightDisabled, spotlightId, startAutoCloseTimeout, state.bottomControlsRendered, state.infoVisible, state.mediaControlsVisible, state.mediaSliderVisible, state.slider5WayPressed, stopAutoCloseTimeout]);

 announce = (msg) => {
  announceJob.start(msg);
 };

 const preventTimeChange = useCallback((time) => {

  const isTimeBeyondSelection = () => {
   // if selection isn't set or only contains the starting value, there isn't a valid selection
   // with which to test the time
   if (selection != null && selection.length >= 2) {
    const [start, end] = selection;

    return time > end || time < start;
   }

   return false;
  };

  return (
   isTimeBeyondSelection(time) &&
   !forwardWithPrevent('onSeekOutsideSelection', {type: 'onSeekOutsideSelection', time}, arguments[0])
  );
 }, [selection]);

 /**
  * Hides media controls.
  *
  * @function
  * @memberof goldstone/VideoPlayer.VideoPlayerBase.prototype
  * @public
  */
 const hideControls = useCallback(() => {
  stopDelayedFeedbackHide();
  stopDelayedMiniFeedbackHide();
  stopDelayedTitleHide();
  stopAutoCloseTimeout();
  setSettings(prevState => ({
   ...prevState,
   feedbackAction: 'idle',
   feedbackVisible: false,
   mediaControlsVisible: false,
   mediaSliderVisible: false,
   miniFeedbackVisible: false,
   infoVisible: false
  }));
  markAnnounceRead();
 }, [markAnnounceRead, state, stopAutoCloseTimeout, stopDelayedFeedbackHide, stopDelayedMiniFeedbackHide, stopDelayedTitleHide]);

 // only show mini feedback if playback controls are invoked by a key event
 const shouldShowMiniFeedback = (ev) => {
  if (ev.type === 'keyup') {
   showMiniFeedback.current = true;
  }
  return true;
 };

 const handleLoadStart = () => {
  prevCommand.current = noAutoPlay ? 'pause' : 'play';
  speedIndex.current = 0;
  setSettings(prevState => ({
   ...prevState,
   announce: AnnounceState.READY,
   currentTime: 0,
   sourceUnavailable: true,
   proportionPlayed: 0,
   proportionLoaded: 0
  }));

  if (!noAutoShowMediaControls) {
   if (!state.bottomControlsRendered) {
    renderBottomControl.idle();
   } else {
    showControls();
   }
  }
 };

 const handleEndedEvent = () => {
  forward('onEnded', {}, arguments[0]);
 };

 const handlePlay = handle(
  forwardPlay,
  shouldShowMiniFeedback,
  () => play()
 );

 const handlePause = handle(
  forwardPause,
  shouldShowMiniFeedback,
  () => pause()
 );

 const handleFastForward = handle(
  forwardFastForward,
  shouldShowMiniFeedback,
  () => fastForward()
 );

 const handleJump = useCallback(({keyCode}) => {
  if (seekDisabled) {
   forward('onSeekFailed', {}, arguments[0]);
  } else {
   const jumpByLeft = (is('left', keyCode) ? -1 : 1) * jumpBy;
   const time = Math.min(state.duration, Math.max(0, state.currentTime + jumpByLeft));

   if (preventTimeChange(time)) return;

   showMiniFeedback.current = true;
   jump(jumpByLeft);
   announceJob.startAfter(500, secondsToTime(video.current.currentTime, getDurFmt(locale), {includeHour: true}));
  }
 }, [seekDisabled, jumpBy, state.duration, state.currentTime, preventTimeChange, jump, announceJob, locale]);



 //
 // Media Interaction Methods
 //
 const handleEvent = () => {
  const el = video.current;
  const updatedState = {
   // Standard media properties
   currentTime: el.currentTime,
   duration: el.duration,
   paused: el.playbackRate !== 1 || el.paused,
   playbackRate: el.playbackRate,

   // Non-standard state computed from properties
   error: el.error,
   loading: el.loading,
   proportionLoaded: el.proportionLoaded,
   proportionPlayed: el.proportionPlayed || 0,
   sliderTooltipTime: sliderScrubbing.current ? (sliderKnobProportion.current * el.duration) : el.currentTime,
   // note: `el.loading && state.sourceUnavailable == false` is equivalent to `oncanplaythrough`
   sourceUnavailable: el.loading && state.sourceUnavailable || el.error
  };

  // If there's an error, we're obviously not loading, no matter what the readyState is.
  if (updatedState.error) updatedState.loading = false;

  const isRewind = prevCommand.current === 'rewind' || prevCommand.current === 'slowRewind';
  const isForward = prevCommand.current === 'fastForward' || prevCommand.current === 'slowForward';
  if (mediaProps.pauseAtEnd && (el.currentTime === 0 && isRewind || el.currentTime === el.duration && isForward)) {
   pause();
  }

  setSettings(prevState => {
   if (
    typeof prevStateRef !== 'undefined' &&
     !prevStateRef.miniFeedbackVisible && prevStateRef.miniFeedbackVisible === state.miniFeedbackVisible &&
     !prevStateRef.mediaSliderVisible && prevStateRef.mediaSliderVisible === state.mediaSliderVisible &&
     prevStateRef.loading === state.loading && prevPropsRef.loading === loading &&
     (
      prevState.currentTime !== updatedState.currentTime ||
      prevState.proportionPlayed !== updatedState.proportionPlayed ||
      prevState.sliderTooltipTime !== updatedState.sliderTooltipTime
     )
   ) {
    return prevState;
   }
   return {
    ...prevState,
    ...updatedState
   };
  }
  );
 };



 /**
  * The primary means of interacting with the `<video>` element.
  *
  * @param  {String} action The method to preform.
  * @param  {Multiple} props  The arguments, in the format that the action method requires.
  *
  * @private
  */
 const send = (action, props) => {
  clearPulsedPlayback();
  showFeedback();
  startDelayedFeedbackHide();
  video.current[action](props);
 };

 /**
  * Programmatically plays the current media.
  *
  * @function
  * @memberof goldstone/VideoPlayer.VideoPlayerBase.prototype
  * @public
  */
 const play = () => {
  if (state.sourceUnavailable) {
   return;
  }
  speedIndex.current = 0;
  // must happen before send() to ensure feedback uses the right value
  // TODO: refactor into state member
  prevCommand.current = 'play';
  setPlaybackRate(1);
  send('play');
  announce($L('Play'));
  startDelayedMiniFeedbackHide(5000);
 };

 /**
  * Programmatically plays the current media.
  *
  * @function
  * @memberof goldstone/VideoPlayer.VideoPlayerBase.prototype
  * @public
  */
 const pause = () => {

  if (state.sourceUnavailable) {
   return;
  }

  speedIndex.current = 0;
  // must happen before send() to ensure feedback uses the right value
  // TODO: refactor into state member
  prevCommand.current = 'pause';
  setPlaybackRate(1);
  send('pause');
  announce($L('Pause'));
  stopDelayedMiniFeedbackHide();
 };

 /**
  * Changes the playback speed via [selectPlaybackRate()]{@link goldstone/VideoPlayer.VideoPlayer#selectPlaybackRate}.
  *
  * @function
  * @memberof goldstone/VideoPlayer.VideoPlayerBase.prototype
  * @public
  */
 const fastForward = () => {

  if (state.sourceUnavailable) {
   return;
  }

  let shouldResumePlayback = false;

  switch (prevCommand.current) {
   case 'slowForward':
    if (speedIndex.current === playbackRates.current.length - 1) {
     // reached to the end of array => fastforward
     selectPlaybackRates('fastForward');
     speedIndex.current = 0;
     prevCommand.current = 'fastForward';
    } else {
     speedIndex.current = clampPlaybackRate(speedIndex.current + 1);
    }
    break;
   case 'pause':
    selectPlaybackRates('slowForward');
    if (state.paused) {
     shouldResumePlayback = true;
    }
    speedIndex.current = 0;
    prevCommand.current = 'slowForward';
    break;
   case 'fastForward':
    speedIndex.current = clampPlaybackRate(speedIndex.current + 1);
    prevCommand.current = 'fastForward';
    break;
   default:
    selectPlaybackRates('fastForward');
    speedIndex.current = 0;
    prevCommand.current = 'fastForward';
    if (state.paused) {
     shouldResumePlayback = true;
    }
    break;
  }

  setPlaybackRate(selectPlaybackRate(speedIndex.current));

  if (shouldResumePlayback) send('play');

  stopDelayedFeedbackHide();
  stopDelayedMiniFeedbackHide();
  clearPulsedPlayback();
  showFeedback();
 };

 /**
  * Changes the playback speed via [selectPlaybackRate()]{@link goldstone/VideoPlayer.VideoPlayer#selectPlaybackRate}.
  *
  * @function
  * @memberof goldstone/VideoPlayer.VideoPlayerBase.prototype
  * @public
  */
 const rewind = () => {
  if (state.sourceUnavailable) {
   return;
  }
  const rateForSlowRewind = playbackRateHash['slowRewind'];
  let shouldResumePlayback = false,
   command = 'rewind';
  if (video.current.currentTime === 0) {
   // Do not rewind if currentTime is 0. We're already at the beginning.
   return;
  }
  switch (prevCommand.current) {
   case 'slowRewind':
    if (speedIndex.current === playbackRates.current.length - 1) {
     // reached to the end of array => go to rewind
     selectPlaybackRates(command);
     speedIndex.current = 0;
     prevCommand.current = command;
    } else {
     speedIndex.current = clampPlaybackRate(speedIndex.current + 1);
    }
    break;
   case 'pause':
    // If it's possible to slowRewind, do it, otherwise just leave it as normal rewind : QEVENTSEVT-17386
    if (rateForSlowRewind && rateForSlowRewind.length >= 0) {
     command = 'slowRewind';
    }
    selectPlaybackRates(command);
    if (state.paused && state.duration > state.currentTime) {
     shouldResumePlayback = true;
    }
    speedIndex.current = 0;
    prevCommand.current = command;
    break;
   case 'rewind':
    speedIndex.current = clampPlaybackRate(speedIndex.current + 1);
    prevCommand.current = command;
    break;
   default:
    selectPlaybackRates(command);
    speedIndex.current = 0;
    prevCommand.current = command;
    break;
  }
  setPlaybackRate(selectPlaybackRate(speedIndex.current));
  if (shouldResumePlayback) send('play');
  stopDelayedFeedbackHide();
  stopDelayedMiniFeedbackHide();
  clearPulsedPlayback();
  showFeedback();
 };

 const handleRewind = () => {
  rewind();
 };

 /**
  * Sets the playback rate type (from the keys of [playbackRateHash]{@link goldstone/VideoPlayer.VideoPlayer#playbackRateHash}).
  *
  * @param {String} cmd - Key of the playback rate type.
  * @private
  */
 const selectPlaybackRates = (cmd) => {
  playbackRates.current = playbackRateHash[cmd];
 };

 /**
  * Changes [playbackRate]{@link goldstone/VideoPlayer.VideoPlayer#playbackRate} to a valid value
  * when initiating fast forward or rewind.
  *
  * @param {Number} idx - The index of the desired playback rate.
  * @private
  */
 const clampPlaybackRate = (idx) => {
  if (!playbackRates.current) {
   return;
  }

  return idx % playbackRates.current.length;
 };

 /**
  * Retrieves the playback rate name.
  *
  * @param {Number} idx - The index of the desired playback rate.
  * @returns {String} The playback rate name.
  * @private
  */
 const selectPlaybackRate = (idx) => {
  return playbackRates.current[idx];
 };

 /**
  * Sets [playbackRate]{@link goldstone/VideoPlayer.VideoPlayer#playbackRate}.
  *
  * @param {String} rate - The desired playback rate.
  * @private
  */
 const setPlaybackRate = (rate) => {
  // Stop rewind (if happening)
  stopRewindJob();

  // Make sure rate is a string
  playbackRate.current = rate = String(rate);
  const pbNumber = calcNumberValueOfPlaybackRate(rate);

  if (platform.webos) {
   // ReactDOM throws error for setting negative value for playbackRate
   video.current.playbackRate = pbNumber < 0 ? 0 : pbNumber;

   // For supporting cross browser behavior
   if (pbNumber < 0) {
    beginRewind();
   }
  } else {
   // Set native playback rate
   video.current.playbackRate = pbNumber;
  }
 };

 /**
  * Implements custom rewind functionality (until browsers support negative playback rate).
  *
  * @private
  */
 const beginRewind = () => {
  send('pause');
  startRewindJob();
 };

 //
 // Player Interaction events
 //
 const onVideoClick = useCallback(() => {

  /**
   * Toggles the media controls.
   *
   * @function
   * @memberof goldstone/VideoPlayer.VideoPlayerBase.prototype
   * @public
   */
  if (state.mediaControlsVisible) {
   hideControls();
  } else {
   showControls();
  }

 }, [hideControls, showControls, state.mediaControlsVisible]);

 const onSliderChange = useCallback(({value}) => {
  const time = value * state.duration;

  if (preventTimeChange(time)) return;

  seek(time);
  sliderScrubbing.current = false;
 }, [state.duration, preventTimeChange, seek]);


 const handleKnobMove = useCallback((ev) => {
  sliderScrubbing.current = true;

  // prevent announcing repeatedly when the knob is detached from the progress.
  // TODO: fix Slider to not send onKnobMove when the knob hasn't, in fact, moved
  if (sliderKnobProportion.current !== ev.proportion) {
   sliderKnobProportion.current = ev.proportion;
   const seconds = Math.floor(sliderKnobProportion.current * video.current.duration);

   if (!isNaN(seconds)) {
    sliderTooltipTimeJob.throttle(seconds);
    const knobTime = secondsToTime(seconds, getDurFmt(locale), {includeHour: true});

    forward('onScrub', {...ev, seconds}, arguments[0]);

    announce(`${$L('jump to')} ${knobTime}`);
   }
  }
 }, [announce, locale, sliderTooltipTimeJob]);

 const handleSliderFocus = useCallback(() => {
  const seconds = Math.floor(sliderKnobProportion.current * video.current.duration);
  sliderScrubbing.current = true;

  setSettings(prevState => ({...prevState, feedbackAction: 'focus', feedbackVisible: true}));
  stopDelayedFeedbackHide();

  if (!isNaN(seconds)) {
   sliderTooltipTimeJob.throttle(seconds);
   const knobTime = secondsToTime(seconds, getDurFmt(locale), {includeHour: true});

   forward('onScrub', {
    detached: sliderScrubbing.current,
    proportion: sliderKnobProportion.current,
    seconds
   }, arguments[0]);

   announce(`${$L('jump to')} ${knobTime}`);
  }
 }, [announce, locale, sliderTooltipTimeJob, stopDelayedFeedbackHide]);

 const handleSliderBlur = useCallback(() => {
  sliderScrubbing.current = false;
  startDelayedFeedbackHide();
  setSettings(prevState => ({
   ...prevState,
   feedbackAction: 'blur',
   feedbackVisible: true,
   sliderTooltipTime: prevState.currentTime
  }));

 }, [startDelayedFeedbackHide]);

 const handleSliderKeyDown = useCallback((ev) => {
  const {keyCode} = ev;

  if (is('enter', keyCode)) {
   setSettings(prevState => ({...prevState, slider5WayPressed: true}));
  } else if (is('down', keyCode)) {
   Spotlight.setPointerMode(false);

   if (Spotlight.focus(mediaControlsSpotlightId.current)) {
    preventDefault(ev);
    stopImmediate(ev);
   }
  } else if (is('up', keyCode)) {
   Spotlight.setPointerMode(false);
   preventDefault(ev);
   stopImmediate(ev);
  }
 }, []);

 // const onJumpBackward = () => {
 //  forward('onJumpBackward', {
 //   ...getMediaState()
 //  }, arguments[0]);
 //  jump(-1 * jumpBy);
 // };

 // const onJumpForward = () => {
 //  forward('onJumpForward', {
 //   ...getMediaState()
 //  }, arguments[0]);
 //  jump(jumpBy);
 // };

 const handleToggleMore = useCallback(({showMoreComponents, liftDistance}) => {
  if (!showMoreComponents) {
   startAutoCloseTimeout(); // Restore the timer since we are leaving "more.
   // Restore the title-hide now that we're finished with "more".
   startDelayedTitleHide();
  } else {
   // Interrupt the title-hide since we don't want it hiding autonomously in "more".
   stopDelayedTitleHide();
  }

  if (player.current && typeof player.current.style !== 'undefined') {
   player.current.style.setProperty('--liftDistance', `${liftDistance}px`);
  }

  setSettings(prevState => ({
   ...prevState,
   infoVisible: showMoreComponents,
   titleVisible: true,
   announce: prevState.announce < AnnounceState.INFO ? AnnounceState.INFO : AnnounceState.DONE
  }));
 }, [startAutoCloseTimeout, startDelayedTitleHide, stopDelayedTitleHide]);

 const handleMediaControlsClose = useCallback((event) => {
  hideControls();
  event.stopPropagation();
 }, [hideControls]);

 const setPlayerRef = (node) => {
  // TODO: We've moved SpotlightContainerDecorator up to allow VP to be spottable but also
  // need a ref to the root node to query for children and set CSS variables.
  // eslint-disable-next-line react/no-find-dom-node
  player.current = ReactDOM.findDOMNode(node);
 };

 const setVideoRef = useCallback((refVideo) => {
  if (refVideo !== null) {
   video.current = refVideo;
  }
 }, []);

 const setTitleRef = (node) => {
  titleRef.current = node;
 };

 const setAnnounceRef = (node) => {
  announceRef.current = node;
 };

 const getControlsAriaProps = () => {
  if (state.announce === AnnounceState.TITLE) {
   return {
    'aria-labelledby': `${id}_title`,
    'aria-live': 'off',
    role: 'alert'
   };
  } else if (state.announce === AnnounceState.INFO) {
   return {
    'aria-labelledby': `${id}_info`,
    role: 'region'
   };
  }

  return null;
 };

 const controlsAriaProps = getControlsAriaProps();


 delete mediaProps.announce;
 delete mediaProps.autoCloseTimeout;
 delete mediaProps.children;
 delete mediaProps.feedbackHideDelay;
 delete mediaProps.jumpBy;
 delete mediaProps.miniFeedbackHideDelay;
 delete mediaProps.noAutoShowMediaControls;
 delete mediaProps.noMediaSliderFeedback;
 delete mediaProps.onControlsAvailable;
 delete mediaProps.onFastForward;
 delete mediaProps.onJumpBackward;
 delete mediaProps.onJumpForward;
 delete mediaProps.onPause;
 delete mediaProps.onPlay;
 delete mediaProps.onRewind;
 delete mediaProps.onScrub;
 delete mediaProps.onSeekFailed;
 delete mediaProps.onSeekOutsideSelection;
 delete mediaProps.pauseAtEnd;
 delete mediaProps.playbackRateHash;
 delete mediaProps.seekDisabled;
 delete mediaProps.setApiProvider;
 delete mediaProps.thumbnailUnavailable;
 delete mediaProps.titleHideDelay;
 delete mediaProps.videoPath;

 mediaProps.autoPlay = !noAutoPlay;
 mediaProps.className = css.video;
 mediaProps.controls = false;
 mediaProps.mediaComponent = 'video';
 mediaProps.onLoadStart = handleLoadStart;
 mediaProps.onUpdate = handleEvent;
 mediaProps.onEnded = handleEndedEvent;
 mediaProps.ref = setVideoRef;

 let proportionSelection = selection;
 if (proportionSelection != null && state.duration) {
  proportionSelection = selection.map(t => t / state.duration);
 }

 const durFmt = getDurFmt(locale);

 return (
  <RootContainer
   className={classNames({[css.videoPlayer]: true}, 'enact-fit', {[className]: className})}
   onClick={activityDetected}
   ref={setPlayerRef}
   spotlightDisabled={spotlightDisabled}
   spotlightId={spotlightId}
   style={style}
  >
   {/* Video Section */}
   {

    // Duplicating logic from <ComponentOverride /> until enzyme supports forwardRef
    VideoComponent && (
     (typeof VideoComponent === 'function' || typeof VideoComponent === 'string') && (
      <VideoComponent {...mediaProps} />
     ) || React.isValidElement(VideoComponent) && (
      React.cloneElement(VideoComponent, mediaProps)
     )
    ) || null
   }
   <Overlay
    bottomControlsVisible
    onClick={onVideoClick}
   >
    {(!noSpinner && (state.loading || loading)) && <Spinner centered />}
   </Overlay>
   {state.bottomControlsRendered &&
    <div className={css.fullscreen} {...controlsAriaProps}>
     {
      onBack instanceof Function && state.mediaSliderVisible && <Button icon="arrowhookleft" className={css.back} iconOnly size="large" onClick={onBack} backgroundOpacity="transparent" />
     }

     <FeedbackContent
      className={css.miniFeedback}
      playbackRate={pulsedPlaybackRate.current || selectPlaybackRate(speedIndex.current)}
      playbackState={pulsedPlaybackState.current || prevCommand.current}
      visible={state.miniFeedbackVisible && !noMiniFeedback}
     >
      {secondsToTime(state.sliderTooltipTime, durFmt)}
     </FeedbackContent>
     {
      <ControlsContainer
       className={classNames({
        [css.bottom]: true,
        [css.hidden]: !state.mediaControlsVisible,
        [css.lift]: state.infoVisible
       })}
       spotlightDisabled={spotlightDisabled || !state.mediaControlsVisible}
      >
       {/*
        Info Section: Title, Description, Times
        Only render when `state.mediaControlsVisible` is true in order for `Marquee`
        to make calculations correctly in `MediaTitle`.
       */}
       {state.mediaSliderVisible &&
        <div className={css.infoFrame}>
         <MediaTitle
          id={id}
          infoVisible={state.infoVisible}
          ref={setTitleRef}
          title={title}
          visible={state.titleVisible && state.mediaControlsVisible}
         >
          {infoComponents}
         </MediaTitle>
         {noSlider &&
          <Times current={state.currentTime} total={state.duration} formatter={durFmt} />
         }
        </div>
       }
       {!noSlider &&
        <div className={css.sliderContainer}>
         {state.mediaSliderVisible &&
          <Times noTotalTime current={state.currentTime} formatter={durFmt} />
         }
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
          spotlightDisabled={spotlightDisabled || !state.mediaControlsVisible}
          value={state.proportionPlayed}
          visible={state.mediaSliderVisible}
         >
          <FeedbackTooltip
           action={state.feedbackAction}
           duration={state.duration}
           formatter={durFmt}
           hidden={!state.feedbackVisible || state.sourceUnavailable}
           playbackRate={selectPlaybackRate(speedIndex.current)}
           playbackState={prevCommand.current}
           thumbnailComponent={thumbnailComponent}
           thumbnailDeactivated={mediaProps.thumbnailUnavailable}
           thumbnailSrc={thumbnailSrc}
          />
         </MediaSlider>
         {state.mediaSliderVisible &&
          <Times noCurrentTime total={state.duration} formatter={durFmt} />
         }
        </div>
       }
       <ComponentOverride
        component={mediaControlsComponent}
        mediaDisabled={disabled || state.sourceUnavailable}
        onBackwardButtonClick={handleRewind}
        onClose={handleMediaControlsClose}
        onFastForward={handleFastForward}
        onForwardButtonClick={handleFastForward}
        onJump={handleJump}
        onJumpBackwardButtonClick={onJumpBackward}
        onJumpForwardButtonClick={onJumpForward}
        onPause={handlePause}
        onPlay={handlePlay}
        onRewind={handleRewind}
        onToggleMore={handleToggleMore}
        paused={state.paused}
        spotlightId={mediaControlsSpotlightId.current}
        spotlightDisabled={!state.mediaControlsVisible || spotlightDisabled}
        visible={state.mediaControlsVisible}
       />
      </ControlsContainer>
     }
    </div>
   }
   <SpottableDiv
    // This captures spotlight focus for use with 5-way.
    // It's non-visible but lives at the top of the VideoPlayer.
    className={css.controlsHandleAbove}
    onClick={showControls}
    onSpotlightDown={showControls}
    spotlightDisabled={state.mediaControlsVisible || spotlightDisabled}
   />
   <Announce ref={setAnnounceRef} />
  </RootContainer>
 );
}

VideoPlayerBase.propTypes = {
 /**
  * passed by AnnounceDecorator for accessibility
  *
  * @type {Function}
  * @private
  */
 announce: PropTypes.func,

 /**
  * The time (in milliseconds) before the control buttons will hide.
  *
  * Setting this to 0 or `null` disables closing, requiring user input to open and close.
  *
  * @type {Number}
  * @default 5000
  * @public
  */
 autoCloseTimeout: PropTypes.number,

 /**
  * Video Plays automatically on load
  *
  * @type {function}
  * @private
  */
 autoPlay: PropTypes.func,

 /**
  * To enable controls or not
  *
  * @type {function}
  * @private
  */
 controls: PropTypes.func,
 /**
  * Removes interactive capability from this component. This includes, but is not limited to,
  * key-press events, most clickable buttons, and prevents the showing of the controls.
  *
  * @type {Boolean}
  * @public
  */
 disabled: PropTypes.bool,

 /**
  * Amount of time (in milliseconds) after which the feedback text/icon part of the slider's
  * tooltip will automatically hidden after the last action.
  * Setting this to 0 or `null` disables feedbackHideDelay; feedback will always be present.
  *
  * @type {Number}
  * @default 3000
  * @public
  */
 feedbackHideDelay: PropTypes.number,

 /**
  * Components placed below the title.
  *
  * Typically these will be media descriptor icons, like how many audio channels, what codec
  * the video uses, but can also be a description for the video or anything else that seems
  * appropriate to provide information about the video to the user.
  *
  * @type {Node}
  * @public
  */
 infoComponents: PropTypes.node,

 /**
  * The number of seconds the player should skip forward or backward when a "jump" button is
  * pressed.
  *
  * @type {Number}
  * @default 30
  * @public
  */
 jumpBy: PropTypes.number,

 /**
  * Manually set the loading state of the media, in case you have information that
  * `VideoPlayer` does not have.
  *
  * @type {Boolean}
  * @public
  */
 loading: PropTypes.bool,

 /**
  * The current locale as a
  * {@link https://tools.ietf.org/html/rfc5646|BCP 47 language tag}.
  *
  * @type {String}
  * @public
  */
 locale: PropTypes.string,

 /**
  * Type of Media
  *
  *
  * @type {function}
  * @public
  */
 mediaComponent: PropTypes.func,
 /**
  * Overrides the default media control component to support customized behaviors.
  *
  * The provided component will receive the following props from `VideoPlayer`:
  *
  * * `mediaDisabled` - `true` when the media controls are not interactive
  * * `onBackwardButtonClick` - Called when the rewind button is pressed
  * * `onClose` - Called when cancel key is pressed when the media controls are visible
  * * `onFastForward` - Called when the media is fast forwarded via a key event
  * * `onForwardButtonClick` - Called when the fast forward button is pressed
  * * `onJump` - Called when the media jumps either forward or backward
  * * `onJumpBackwardButtonClick` - Called when the jump backward button is pressed
  * * `onJumpForwardButtonClick` - Called when the jump forward button is pressed
  * * `onKeyDown` - Called when a key is pressed
  * * `onPause` - Called when the media is paused via a key event
  * * `onPlay` - Called when the media is played via a key event
  * * `onRewind` - Called when the media is rewound via a key event
  * * `onToggleMore` - Called when the more components are hidden or shown
  * * `paused` - `true` when the media is paused
  * * `spotlightId` - The spotlight container Id for the media controls
  * * `spotlightDisabled` - `true` when spotlight is disabled for the media controls
  * * `visible` - `true` when the media controls should be displayed
  *
  * @type {Component|Element}
  * @default `goldstone/VideoPlayer.MediaControls`
  * @public
  */
 mediaControlsComponent: EnactPropTypes.componentOverride,

 /**
  * Amount of time (in milliseconds), after the last user action, that the `miniFeedback`
  * will automatically hide.
  * Setting this to 0 or `null` disables `miniFeedbackHideDelay`; `miniFeedback` will always
  * be present.
  *
  * @type {Number}
  * @default 2000
  * @public
  */
 miniFeedbackHideDelay: PropTypes.number,

 /**
  * Disable audio for this video.
  *
  * In a context, this is handled by the remote control, not programmatically in the
  * VideoPlayer API.
  *
  * @type {Boolean}
  * @default false
  * @public
  */
 muted: PropTypes.bool,

 /**
  * Prevents the default behavior of playing a video immediately after it's loaded.
  *
  * @type {Boolean}
  * @default false
  * @public
  */
 noAutoPlay: PropTypes.bool,

 /**
  * Prevents the default behavior of showing media controls immediately after it's loaded.
  *
  * @type {Boolean}
  * @default false
  * @public
  */
 noAutoShowMediaControls: PropTypes.bool,

 /**
  * Hides media slider feedback when fast forward or rewind while media controls are hidden.
  *
  * @type {Boolean}
  * @default false
  * @public
  */
 noMediaSliderFeedback: PropTypes.bool,

 /**
  * Removes the mini feedback.
  *
  * @type {Boolean}
  * @default false
  * @public
  */
 noMiniFeedback: PropTypes.bool,

 /**
  * Removes the media slider.
  *
  * @type {Boolean}
  * @default false
  * @public
  */
 noSlider: PropTypes.bool,

 /**
  * Removes spinner while loading.
  *
  * @type {Boolean}
  * @public
  */
 noSpinner: PropTypes.bool,

 /**
  * Functio to go back
  *
  * @type {Function}
  * @public
  */
 onBack: PropTypes.func,

 /**
  * Called when video ends
  *
  * @type {Function}
  * @public
  */
 onControlsAvailable: PropTypes.func,

 /**
  * Called when the player's controls change availability, whether they are shown
  * or hidden.
  *
  * The current status is sent as the first argument in an object with a key `available`
  * which will be either `true` or `false`. (e.g.: `onControlsAvailable({available: true})`)
  *
  * @type {Function}
  * @public
  */
 onEnded: PropTypes.func,


 /**
  * Called when the video is fast forwarded.
  *
  * @type {Function}
  * @public
  */
 onFastForward: PropTypes.func,

 /**
  * Called when the user clicks the JumpBackward button.
  *
  * Is passed a {@link goldstone/VideoPlayer.videoStatus} as the first argument.
  *
  * @type {Function}
  * @public
  */
 onJumpBackward: PropTypes.func,

 /**
  * Called when the user clicks the JumpForward button.
  *
  * Is passed a {@link goldstone/VideoPlayer.videoStatus} as the first argument.
  *
  * @type {Function}
  * @public
  */
 onJumpForward: PropTypes.func,

 /**
  * Called when Video starts.
  *
  * Is passed a {@link goldstone/VideoPlayer.videoStatus} as the first argument.
  *
  * @type {Function}
  * @public
  */
 onLoadStart: PropTypes.func,
 /**
  * Called when video is paused
  *
  * @type {Function}
  * @public
  */
 onPause: PropTypes.func,

 /**
  * Called when video is played
  *
  * @type {Function}
  * @public
  */
 onPlay: PropTypes.func,

 /**
  * Called when video is rewound.
  *
  * @type {Function}
  * @public
  */
 onRewind: PropTypes.func,

 /**
  * Called when the user is moving the VideoPlayer's Slider knob independently of
  * the current playback position.
  *
  * It is passed an object with a `seconds` key (float value) to indicate the current time
  * index. It can be used to update the `thumbnailSrc` to the reflect the current scrub
  * position.
  *
  * @type {Function}
  * @public
  */
 onScrub: PropTypes.func,

 /**
  * Called when seek is attempted while `seekDisabled` is true.
  *
  * @type {Function}
  */
 onSeekFailed: PropTypes.func,

 /**
  * Called when seeking outside of the current `selection` range.
  *
  * By default, the seek will still be performed. Calling `preventDefault()` on the event
  * will prevent the seek operation.
  *
  * @type {Function}
  * @public
  */
 onSeekOutsideSelection: PropTypes.func,

 /**
  * Called when update happens
  *
  *
  * @type {Function}
  * @public
  */
 onUpdate: PropTypes.func,

 /**
  * Pauses the video when it reaches either the start or the end of the video during rewind,
  * slow rewind, fast forward, or slow forward.
  *
  * @type {Boolean}
  * @default false
  * @public
  */
 pauseAtEnd: PropTypes.bool,

 /**
  * Mapping of playback rate names to playback rate values that may be set.
  *
  * @type {goldstone/VideoPlayer.playbackRateHash}
  * @default {
  * fastForward: ['2', '4', '8', '16'],
  * rewind: ['-2', '-4', '-8', '-16'],
  * slowForward: ['1/4', '1/2'],
  * slowRewind: ['-1/2', '-1']
  * }
  * @public
  */
 playbackRateHash: PropTypes.shape({
  fastForward: PropTypes.arrayOf(PropTypes.string),
  rewind: PropTypes.arrayOf(PropTypes.string),
  slowForward: PropTypes.arrayOf(PropTypes.string),
  slowRewind: PropTypes.arrayOf(PropTypes.string)
 }),

 /**
  * Refrence to video.
  *
  * @type {function}
  * @public
  */
 ref: PropTypes.func,

 /**
  * Disables seek function.
  *
  * Note that jump by arrow keys will also be disabled when `true`.
  *
  * @type {Boolean}
  * @public
  */
 seekDisabled: PropTypes.bool,

 /**
  * A range of the video to display as selected.
  *
  * The value of `selection` may either be:
  * * `null` or `undefined` for no selection,
  * * a single-element array with the start time of the selection
  * * a two-element array containing both the start and end time of the selection in seconds
  *
  * When the start time is specified, the media slider will show filled starting at that
  * time to the current time.
  *
  * When the end time is specified, the slider's background will be filled between the two
  * times.
  *
  * @type {Number[]}
  * @public
  */
 selection: PropTypes.arrayOf(PropTypes.number),

 /**
  * Registers the VideoPlayer component with an
  * {@link core/internal/ApiDecorator.ApiDecorator}.
  *
  * @type {Function}
  * @private
  */
 setApiProvider: PropTypes.func,

 /**
  * Disables spotlight navigation into the component.
  *
  * @type {Boolean}
  * @public
  */
 spotlightDisabled: PropTypes.bool,

 /**
  * The spotlight container ID for the player.
  *
  * @type {String}
  * @public
  * @default 'videoPlayer'
  */
 spotlightId: PropTypes.string,

 /**
  * Style for video player.
  *
  * @type {Object}
  * @public
  */
 style: PropTypes.object,

 /**
  * The thumbnail component to be used instead of the built-in version.
  *
  * The internal thumbnail style will not be applied to this component. This component
  * follows the same rules as the built-in version.
  *
  * @type {String|Component|Element}
  * @public
  */
 thumbnailComponent: EnactPropTypes.renderableOverride,

 /**
  * Thumbnail image source to show on the slider knob.
  *
  * This is a standard {@link goldstone/Image} component so it supports all of the same
  * options for the `src` property. If no `thumbnailComponent` and no `thumbnailSrc` is set,
  * no tooltip will display.
  *
  * @type {String|Object}
  * @public
  */
 thumbnailSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

 /**
 * Enables the thumbnail transition from opaque to translucent.
 *
 * @type {Boolean}
 * @public
 */
 thumbnailUnavailable: PropTypes.bool,

 /**
  * Title for the video being played.
  *
  * @type {Node}
  * @public
  */
 title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

 /**
  * The time (in milliseconds) before the title disappears from the controls.
  *
  * Setting this to `0` disables hiding.
  *
  * @type {Number}
  * @default 5000
  * @public
  */
 titleHideDelay: PropTypes.number,

 /**
   * Video component to use.
   *
   * The default renders an `HTMLVideoElement`. Custom video components must have a similar
   * API structure, exposing the following APIs:
   *
   * Properties:
   * * `currentTime` {Number} - Playback index of the media in seconds
   * * `duration` {Number} - Media's entire duration in seconds
   * * `error` {Boolean} - `true` if video playback has errored.
   * * `loading` {Boolean} - `true` if video playback is loading.
   * * `paused` {Boolean} - Playing vs paused state. `true` means the media is paused
   * * `playbackRate` {Number} - Current playback rate, as a number
   * * `proportionLoaded` {Number} - A value between `0` and `1`
   * representing the proportion of the media that has loaded
   * * `proportionPlayed` {Number} - A value between `0` and `1` representing the
   * proportion of the media that has already been shown
   *
   * Events:
   * * `onLoadStart` - Called when the video starts to load
   * * `onUpdate` - Sent when any of the properties were updated
   *
   * Methods:
   * * `play()` - play video
   * * `pause()` - pause video
   * * `load()` - load video
   *
   * The [`source`]{@link sandstone/VideoPlayer.Video.source} property is passed to
   * the video component as a child node.
   *
   * @type {Component|Element}
   * @default {@link ui/Media.Media}
   * @public
   */
 videoComponent: EnactPropTypes.componentOverride,

 /**
 * Path of the video.
 *
 * @type {Function}
 * @public
 */
 videoPath: PropTypes.func
};

VideoPlayerBase.defaultProps = {
 autoCloseTimeout: 5000,
 feedbackHideDelay: 3000,
 jumpBy: 30,
 mediaControlsComponent: MediaControls,
 miniFeedbackHideDelay: 2000,
 playbackRateHash: {
  fastForward: ['2', '4', '8', '16'],
  rewind: ['-2', '-4', '-8', '-16'],
  slowForward: ['1/4', '1/2'],
  slowRewind: ['-1/2', '-1']
 },
 spotlightId: 'videoPlayer',
 titleHideDelay: 5000,
 videoComponent: Media
};

/**
 * A standard HTML5 video player for Sandstone. It behaves, responds to, and operates like a
 * `<video>` tag in its support for `<source>`.  It also accepts custom tags such as
 * `<infoComponents>` for displaying additional information in the title area and `<MediaControls>`
 * for handling media playback controls and adding more controls.
 *
 * Example usage:
 * ```
 * <VideoPlayer title="Hilarious Cat Video" poster="http://my.cat.videos/boots-poster.jpg">
 *  <source src="http://my.cat.videos/boots.mp4" type="video/mp4" />
 *  <infoComponents>A video about my cat Boots, wearing boots.</infoComponents>
 *  <MediaControls>
 *   <leftComponents><Button backgroundOpacity="translucent" icon="star" /></leftComponents>
 *   <rightComponents><Button backgroundOpacity="translucent" icon="flag" /></rightComponents>
 *
 *   <Button backgroundOpacity="translucent">Add To Favorites</Button>
 *   <Button backgroundOpacity="translucent" icon="search" />
 *  </MediaControls>
 * </VideoPlayer>
 * ```
 *
 * To invoke methods (e.g.: `fastForward()`) or get the current state (`getMediaState()`), store a
 * ref to the `VideoPlayer` within your component:
 *
 * ```
 *  ...
 *
 *  setVideoPlayer = (node) => {
 *   videoPlayer = node;
 *  }
 *
 *  play () {
 *   videoPlayer.play();
 *  }
 *
 *  render () {
 *   return (
 *    <VideoPlayer ref={setVideoPlayer} />
 *   );
 *  }
 * ```
 *
 * @function VideoPlayer
 * @memberof goldstone/VideoPlayer
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */
const VideoPlayer = memo(
 ApiDecorator(
  {api: [
   'areControlsVisible',
   'fastForward',
   'getMediaState',
   'getVideoNode',
   'hideControls',
   'jump',
   'pause',
   'play',
   'rewind',
   'seek',
   'showControls',
   'showFeedback',
   'toggleControls'
  ]},
  I18nContextDecorator(
   {localeProp: 'locale'},
   Slottable(
    {slots: ['infoComponents', 'mediaControlsComponent', 'source', 'track', 'thumbnailComponent', 'videoComponent']},
    FloatingLayerDecorator(
     {floatLayerId: 'videoPlayerFloatingLayer'},
     Skinnable(
      VideoPlayerBase
     )
    )
   )
  )
 )
);

export default VideoPlayer;
export {
 MediaControls,
 Video,
 VideoPlayer,
 VideoPlayerBase
};
