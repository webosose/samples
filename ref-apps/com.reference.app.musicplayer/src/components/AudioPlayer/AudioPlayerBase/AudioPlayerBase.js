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
import ApiDecorator from "@enact/core/internal/ApiDecorator";
import { on, off } from "@enact/core/dispatcher";
import { memoize } from "@enact/core/util";
import {
  adaptEvent,
  call,
  forKey,
  forward,
  forwardWithPrevent,
  handle,
  preventDefault,
  stopImmediate,
  returnsTrue,
} from "@enact/core/handle";
import { is } from "@enact/core/keymap";
import { platform } from "@enact/core/platform";
import EnactPropTypes from "@enact/core/internal/prop-types";
import { Job } from "@enact/core/util";
import { I18nContextDecorator } from "@enact/i18n/I18nDecorator";
import { toUpperCase } from "@enact/i18n/util";
import Spotlight from "@enact/spotlight";
import { SpotlightContainerDecorator } from "@enact/spotlight/SpotlightContainerDecorator";
import { Spottable } from "@enact/spotlight/Spottable";
import ComponentOverride from "@enact/ui/ComponentOverride";
import { FloatingLayerDecorator } from "@enact/ui/FloatingLayer";
import { FloatingLayerContext } from "@enact/ui/FloatingLayer/FloatingLayerDecorator";
import Slottable from "@enact/ui/Slottable";
import Touchable from "@enact/ui/Touchable";
import DurationFmt from "ilib/lib/DurationFmt";
import equals from "ramda/src/equals";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
  memo,
} from "react";
import ReactDOM from "react-dom";
import Skinnable from "@enact/sandstone/Skinnable";
import Spinner from "@enact/sandstone/Spinner";
import Button from "@enact/sandstone/Button";
import { calcNumberValueOfPlaybackRate } from "./util";
import Overlay from "./Overlay";
import Media from "./Media";
import MediaControls from "./MediaControls";
import MediaTitle from "./MediaTitle";
import MediaSlider from "./MediaSlider";
import Times from "./Times";
import Audio from "./Audio";
import css from "./AudioPlayer.module.less";
import AlbumInfo from "./AlbumInfo";

const SpottableDiv = Touchable(Spottable("div"));
const RootContainer = memo(
  SpotlightContainerDecorator(
    {
      enterTo: "default-element",
      defaultElement: [`.${css.controlsHandleAbove}`, `.${css.controlsFrame}`],
    },
    "div"
  )
);

const ControlsContainer = memo(
  SpotlightContainerDecorator(
    {
      enterTo: "",
      straightOnly: true,
    },
    "div"
  )
);

const memoGetDurFmt = memoize(
  (/* locale */) =>
    new DurationFmt({
      length: "medium",
      style: "clock",
      useNative: false,
    })
);

const getDurFmt = (locale) => {
  if (typeof window === "undefined") return null;

  return memoGetDurFmt(locale);
};

const forwardWithState = (type) =>
  adaptEvent(call("addStateToEvent"), forwardWithPrevent(type));

// provide forwarding of events on media controls
const forwardControlsAvailable = forward("onControlsAvailable");
const forwardPlay = forward("onPlay");
const forwardPause = forwardWithState("onPause");

// Function to get previous value from the state
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

/**
 * A player for audio
 *
 * @class AudioPlayerBase
 * @ui
 * @public
 */
function AudioPlayerBase({
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
  noSlider,
  noSpinner,
  onBack,
  onJumpBackward,
  onJumpForward,
  seekDisabled,
  selection,
  spotlightDisabled,
  spotlightId,
  style,
  thumbnailSrc,
  title,
  titleHideDelay,
  videoComponent: VideoComponent,
  ...mediaProps
}) {
  /* eslint no-use-before-define: ["error", { "variables": false }]*/
  let handleSpotlightUpFromSlider = null;
  const titleRef = useRef(null);
  const player = useRef({});
  const playbackRate = useRef(null);
  // Internal State
  const audio = useRef(null);
  const prevCommand = useRef(noAutoPlay ? "pause" : "play");
  const speedIndex = useRef(0);
  const id = Math.random().toString(36).substr(2, 8);
  const sliderScrubbing = useRef();
  const sliderKnobProportion = useRef(0);
  const pulsedPlaybackRate = useRef();
  const pulsedPlaybackState = useRef();
  const mediaControlsSpotlightId = useRef(`${spotlightId}_mediaControls`);
  const showMiniFeedback = useRef(false);
  const [state, setSettings] = useState({
    currentTime: 0,
    duration: 0,
    error: false,
    loading: false,
    paused: noAutoPlay,
    playbackRate: 1,

    // Non-standard state computed from properties
    bottomControlsRendered: true,
    feedbackAction: "idle",
    feedbackVisible: false,
    infoVisible: false,
    mediaControlsVisible: true,
    mediaSliderVisible: true,
    miniFeedbackVisible: false,
    proportionLoaded: 0,
    proportionPlayed: 0,
    sourceUnavailable: false,
    titleVisible: true,
  });

  const prevStateRef = usePrevious(state);
  const prevPropsRef = usePrevious(arguments[0]);
  const context = useContext(FloatingLayerContext);
  const floatingLayerController = useRef();
  const hideFeedback = () => {
    if (state.feedbackVisible && state.feedbackAction !== "focus") {
      setSettings((prevState) => ({
        ...prevState,
        feedbackVisible: false,
        feedbackAction: "idle",
      }));
    }
  };

  const hideTitle = () => {
    setSettings((prevState) => ({ ...prevState, titleVisible: false }));
  };

  const stopDelayedFeedbackHide = useCallback(() => {
    new Job(hideFeedback).stop();
  }, [hideFeedback]);

  const stopDelayedTitleHide = useCallback(() => {
    new Job(hideTitle).stop();
  }, [hideTitle]);

  const doAutoClose = () => {
    stopDelayedFeedbackHide();
    stopDelayedTitleHide();
    setSettings((prevState) => ({
      ...prevState,
      feedbackVisible: false,
      mediaControlsVisible: false,
      mediaSliderVisible:
        prevState.mediaSliderVisible && prevState.miniFeedbackVisible,
      infoVisible: false,
    }));
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
    setSettings((prevState) => ({
      ...prevState,
      bottomControlsRendered: true,
      feedbackAction: "idle",
      feedbackVisible: true,
      mediaControlsVisible: true,
      mediaSliderVisible: true,
      miniFeedbackVisible: false,
      titleVisible: true,
    }));
  }, [disabled, startDelayedFeedbackHide, startDelayedTitleHide, state]);

  const showControlsFromPointer = () => {
    Spotlight.setPointerMode(false);
    showControls();
  };

  const handleGlobalKeyDown = handle(
    returnsTrue(activityDetected),
    forKey("down"),
    () =>
      !state.mediaControlsVisible &&
      !Spotlight.getCurrent() &&
      Spotlight.getPointerMode() &&
      !spotlightDisabled,
    preventDefault,
    stopImmediate,
    showControlsFromPointer
  );

  const showFeedback = useCallback(() => {
    if (state.mediaControlsVisible) {
      setSettings((prevState) => ({ ...prevState, feedbackVisible: true }));
    } else {
      const shouldShowSlider =
        pulsedPlaybackState.current !== null ||
        calcNumberValueOfPlaybackRate(playbackRate.current) !== 1;

      if (
        showMiniFeedback.current &&
        (!state.miniFeedbackVisible ||
          state.mediaSliderVisible !== shouldShowSlider)
      ) {
        setSettings((prevState) => ({
          ...prevState,
          mediaSliderVisible: shouldShowSlider && !noMediaSliderFeedback,
          miniFeedbackVisible: !(
            prevState.loading ||
            !prevState.duration ||
            prevState.error
          ),
        }));
      }
    }
  }, [
    noMediaSliderFeedback,
    state.mediaControlsVisible,
    state.mediaSliderVisible,
    state.miniFeedbackVisible,
  ]);

  /**
   * Set the media playback time index
   *
   * @function
   * @memberof goldstone/VideoPlayer.VideoPlayerBase.prototype
   * @param {Number} timeIndex - Time index to seek
   * @public
   */
  const seek = useCallback(
    (timeIndex) => {
      if (
        !seekDisabled &&
        !isNaN(audio.current.duration) &&
        !state.sourceUnavailable
      ) {
        audio.current.currentTime = timeIndex;
      } else {
        forward("onSeekFailed", {}, arguments[0]);
      }
    },
    [seekDisabled, state.sourceUnavailable]
  );

  const hideMiniFeedback = () => {
    if (state.miniFeedbackVisible) {
      showMiniFeedback.current = false;
      setSettings((prevState) => ({
        ...prevState,
        mediaSliderVisible: false,
        miniFeedbackVisible: false,
      }));
    }
  };

  const hideMiniFeedbackJob = new Job(hideMiniFeedback);

  const startDelayedMiniFeedbackHide = useCallback(
    (delay = miniFeedbackHideDelay) => {
      if (delay) {
        hideMiniFeedbackJob.startAfter(delay);
      }
    },
    [hideMiniFeedbackJob, miniFeedbackHideDelay]
  );

  /**
   * Step a given amount of time away from the current playback position.
   * Like [seek]{@link goldstone/VideoPlayer.VideoPlayer#seek} but relative.
   *
   * @function
   * @memberof goldstone/VideoPlayer.VideoPlayerBase.prototype
   * @param {Number} distance - Time value to jump
   * @public
   */
  const jump = useCallback(
    (distance) => {
      if (state.sourceUnavailable) {
        return;
      }

      pulsedPlaybackRate.current = toUpperCase(
        new DurationFmt({ length: "long" }).format({ second: jumpBy })
      );
      pulsedPlaybackState.current =
        distance > 0 ? "jumpForward" : "jumpBackward";
      showFeedback();
      startDelayedFeedbackHide();
      seek(state.currentTime + distance);
      startDelayedMiniFeedbackHide();
    },
    [
      jumpBy,
      seek,
      showFeedback,
      startDelayedFeedbackHide,
      startDelayedMiniFeedbackHide,
      state.currentTime,
      state.sourceUnavailable,
    ]
  );

  const stopDelayedMiniFeedbackHide = useCallback(() => {
    hideMiniFeedbackJob.stop();
  }, [hideMiniFeedbackJob]);

  const clearPulsedPlayback = () => {
    pulsedPlaybackRate.current = null;
    pulsedPlaybackState.current = null;
  };

  const stopAutoCloseTimeout = useCallback(() => {
    autoCloseJob.stop();
  }, [autoCloseJob]);

  const renderBottomControl = new Job(() => {
    if (!state.bottomControlsRendered) {
      setSettings((prevState) => ({
        ...prevState,
        bottomControlsRendered: true,
      }));
    }
  });

  useEffect(() => {
    on("mousemove", activityDetected);
    if (platform.touch) {
      on("touchmove", activityDetected);
    }
    document.addEventListener("keydown", handleGlobalKeyDown, {
      capture: true,
    });
    document.addEventListener("wheel", activityDetected, { capture: true });
    startDelayedFeedbackHide();
    if (context && typeof context === "function") {
      floatingLayerController.current = context(() => {});
    }

    // Cleanup
    return () => {
      off("mousemove", activityDetected);
      if (platform.touch) {
        off("touchmove", activityDetected);
      }
      document.removeEventListener("keydown", handleGlobalKeyDown, {
        capture: true,
      });
      document.removeEventListener("wheel", activityDetected, {
        capture: true,
      });
      stopAutoCloseTimeout();
      stopDelayedTitleHide();
      stopDelayedFeedbackHide();
      stopDelayedMiniFeedbackHide();
      renderBottomControl.stop();
      if (floatingLayerController.current) {
        floatingLayerController.current.unregister();
      }
    };
  }, [
    activityDetected,
    context,
    handleGlobalKeyDown,
    renderBottomControl,
    startDelayedFeedbackHide,
    stopAutoCloseTimeout,
    stopDelayedFeedbackHide,
    stopDelayedMiniFeedbackHide,
    stopDelayedTitleHide,
  ]);

  const getHeightForElement = (elementName) => {
    const element = player.current.querySelector(`.${css[elementName]}`);
    if (element) {
      return element.offsetHeight;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    if (
      titleRef.current &&
      state.infoVisible &&
      (!prevStateRef.infoVisible ||
        !equals(infoComponents, prevPropsRef.infoComponents))
    ) {
      titleRef.current.style.setProperty(
        "--infoComponentsOffset",
        `${getHeightForElement("infoComponents")}px`
      );
    }

    if (
      (!state.mediaControlsVisible &&
        prevStateRef &&
        prevStateRef.mediaControlsVisible !== state.mediaControlsVisible) ||
      (!state.mediaSliderVisible &&
        prevStateRef &&
        prevStateRef.mediaSliderVisible !== state.mediaSliderVisible)
    ) {
      if (typeof floatingLayerController.current !== "undefined") {
        floatingLayerController.current.notify({ action: "closeAll" });
      }
    }

    if (
      spotlightId !== prevPropsRef &&
      prevPropsRef &&
      prevPropsRef.spotlightId
    ) {
      mediaControlsSpotlightId.current = `${spotlightId}_mediaControls`;
    }

    if (
      !state.mediaControlsVisible &&
      prevStateRef &&
      prevStateRef.mediaControlsVisible
    ) {
      forwardControlsAvailable({ available: false }, arguments[0]);
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
    } else if (
      state.mediaControlsVisible &&
      prevStateRef &&
      !prevStateRef.mediaControlsVisible
    ) {
      forwardControlsAvailable({ available: true }, arguments[0]);
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
    if (
      state.bottomControlsRendered &&
      prevStateRef &&
      !prevStateRef.bottomControlsRendered &&
      !state.mediaControlsVisible
    ) {
      showControls();
    }
  }, [
    arguments,
    infoComponents,
    prevPropsRef,
    prevStateRef,
    showControls,
    spotlightDisabled,
    spotlightId,
    startAutoCloseTimeout,
    state.bottomControlsRendered,
    state.infoVisible,
    state.mediaControlsVisible,
    state.mediaSliderVisible,
    stopAutoCloseTimeout,
  ]);

  const preventTimeChange = useCallback(
    (time) => {
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
        !forwardWithPrevent(
          "onSeekOutsideSelection",
          { type: "onSeekOutsideSelection", time },
          arguments[0]
        )
      );
    },
    [selection]
  );

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
    setSettings((prevState) => ({
      ...prevState,
      feedbackAction: "idle",
      feedbackVisible: false,
      mediaControlsVisible: false,
      mediaSliderVisible: false,
      miniFeedbackVisible: false,
      infoVisible: false,
    }));
  }, [
    state,
    stopAutoCloseTimeout,
    stopDelayedFeedbackHide,
    stopDelayedMiniFeedbackHide,
    stopDelayedTitleHide,
  ]);

  // only show mini feedback if playback controls are invoked by a key event
  const shouldShowMiniFeedback = (ev) => {
    if (ev.type === "keyup") {
      showMiniFeedback.current = true;
    }
    return true;
  };

  const handleLoadStart = () => {
    prevCommand.current = noAutoPlay ? "pause" : "play";
    speedIndex.current = 0;
    setSettings((prevState) => ({
      ...prevState,
      currentTime: 0,
      sourceUnavailable: true,
      proportionPlayed: 0,
      proportionLoaded: 0,
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
    forward("onEnded", {}, arguments[0]);
  };

  const handlePlay = handle(forwardPlay, shouldShowMiniFeedback, () => play());

  const handlePause = handle(forwardPause, shouldShowMiniFeedback, () =>
    pause()
  );

  const handleJump = useCallback(
    ({ keyCode }) => {
      if (seekDisabled) {
        forward("onSeekFailed", {}, arguments[0]);
      } else {
        const jumpByLeft = (is("left", keyCode) ? -1 : 1) * jumpBy;
        const time = Math.min(
          state.duration,
          Math.max(0, state.currentTime + jumpByLeft)
        );

        if (preventTimeChange(time)) return;

        showMiniFeedback.current = true;
        jump(jumpByLeft);
      }
    },
    [
      seekDisabled,
      jumpBy,
      state.duration,
      state.currentTime,
      preventTimeChange,
      jump,
      locale,
    ]
  );

  //
  // Media Interaction Methods
  //
  const handleEvent = () => {
    const el = audio.current;
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
      // note: `el.loading && state.sourceUnavailable == false` is equivalent to `oncanplaythrough`
      sourceUnavailable: (el.loading && state.sourceUnavailable) || el.error,
    };

    // If there's an error, we're obviously not loading, no matter what the readyState is.
    if (updatedState.error) updatedState.loading = false;
    if (
      mediaProps.pauseAtEnd &&
      (el.currentTime === 0 || el.currentTime === el.duration)
    ) {
      pause();
    }

    setSettings((prevState) => {
      if (
        typeof prevStateRef !== "undefined" &&
        !prevStateRef.miniFeedbackVisible &&
        prevStateRef.miniFeedbackVisible === state.miniFeedbackVisible &&
        !prevStateRef.mediaSliderVisible &&
        prevStateRef.mediaSliderVisible === state.mediaSliderVisible &&
        prevStateRef.loading === state.loading &&
        prevPropsRef.loading === loading &&
        (prevState.currentTime !== updatedState.currentTime ||
          prevState.proportionPlayed !== updatedState.proportionPlayed)
      ) {
        return prevState;
      }
      return {
        ...prevState,
        ...updatedState,
      };
    });
  };

  /**
   * The primary means of interacting with the `<audio>` element.
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
    audio.current[action](props);
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
    prevCommand.current = "play";
    setPlaybackRate(1);
    send("play");
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
    prevCommand.current = "pause";
    setPlaybackRate(1);
    send("pause");
    stopDelayedMiniFeedbackHide();
  };

  /**
   * Sets [playbackRate]{@link goldstone/VideoPlayer.VideoPlayer#playbackRate}.
   *
   * @param {String} rate - The desired playback rate.
   * @private
   */
  const setPlaybackRate = (rate) => {
    // Make sure rate is a string
    playbackRate.current = rate = String(rate);
    const pbNumber = calcNumberValueOfPlaybackRate(rate);

    if (platform.webos) {
      // ReactDOM throws error for setting negative value for playbackRate
      audio.current.playbackRate = pbNumber < 0 ? 0 : pbNumber;
    } else {
      // Set native playback rate
      audio.current.playbackRate = pbNumber;
    }
  };

  const onSliderChange = useCallback(
    ({ value }) => {
      const time = value * state.duration;

      if (preventTimeChange(time)) return;

      seek(time);
      sliderScrubbing.current = false;
    },
    [state.duration, preventTimeChange, seek]
  );

  const handleKnobMove = useCallback(
    (ev) => {
      sliderScrubbing.current = true;

      // prevent announcing repeatedly when the knob is detached from the progress.
      // TODO: fix Slider to not send onKnobMove when the knob hasn't, in fact, moved
      if (sliderKnobProportion.current !== ev.proportion) {
        sliderKnobProportion.current = ev.proportion;
        const seconds = Math.floor(
          sliderKnobProportion.current * audio.current.duration
        );

        if (!isNaN(seconds)) {
          forward("onScrub", { ...ev, seconds }, arguments[0]);
        }
      }
    },
    [locale]
  );

  const handleSliderFocus = useCallback(() => {
    const seconds = Math.floor(
      sliderKnobProportion.current * audio.current.duration
    );
    sliderScrubbing.current = true;

    setSettings((prevState) => ({
      ...prevState,
      feedbackAction: "focus",
      feedbackVisible: true,
    }));
    stopDelayedFeedbackHide();

    if (!isNaN(seconds)) {
      forward(
        "onScrub",
        {
          detached: sliderScrubbing.current,
          proportion: sliderKnobProportion.current,
          seconds,
        },
        arguments[0]
      );
    }
  }, [locale, stopDelayedFeedbackHide]);

  const handleSliderBlur = useCallback(() => {
    sliderScrubbing.current = false;
    startDelayedFeedbackHide();
    setSettings((prevState) => ({
      ...prevState,
      feedbackAction: "blur",
      feedbackVisible: true,
    }));
  }, [startDelayedFeedbackHide]);

  const handleSliderKeyDown = useCallback((ev) => {
    const { keyCode } = ev;

    if (is("enter", keyCode)) {
      setSettings((prevState) => ({ ...prevState, slider5WayPressed: true }));
    } else if (is("down", keyCode)) {
      Spotlight.setPointerMode(false);

      if (Spotlight.focus(mediaControlsSpotlightId.current)) {
        preventDefault(ev);
        stopImmediate(ev);
      }
    } else if (is("up", keyCode)) {
      Spotlight.setPointerMode(false);
      preventDefault(ev);
      stopImmediate(ev);
    }
  }, []);

  const handleToggleMore = useCallback(
    ({ showMoreComponents, liftDistance }) => {
      if (!showMoreComponents) {
        startAutoCloseTimeout(); // Restore the timer since we are leaving "more.
        // Restore the title-hide now that we're finished with "more".
        startDelayedTitleHide();
      } else {
        // Interrupt the title-hide since we don't want it hiding autonomously in "more".
        stopDelayedTitleHide();
      }

      if (player.current && typeof player.current.style !== "undefined") {
        player.current.style.setProperty("--liftDistance", `${liftDistance}px`);
      }

      setSettings((prevState) => ({
        ...prevState,
        infoVisible: showMoreComponents,
        titleVisible: true,
      }));
    },
    [startAutoCloseTimeout, startDelayedTitleHide, stopDelayedTitleHide]
  );

  const handleMediaControlsClose = useCallback(
    (event) => {
      hideControls();
      event.stopPropagation();
    },
    [hideControls]
  );

  const setPlayerRef = (node) => {
    // TODO: We've moved SpotlightContainerDecorator up to allow VP to be spottable but also
    // need a ref to the root node to query for children and set CSS variables.
    // eslint-disable-next-line react/no-find-dom-node
    player.current = ReactDOM.findDOMNode(node);
  };

  const setAudioRef = useCallback((refAudio) => {
    if (refAudio !== null) {
      audio.current = refAudio;
    }
  }, []);

  const setTitleRef = (node) => {
    titleRef.current = node;
  };

  delete mediaProps.autoCloseTimeout;
  delete mediaProps.children;
  delete mediaProps.feedbackHideDelay;
  delete mediaProps.jumpBy;
  delete mediaProps.miniFeedbackHideDelay;
  delete mediaProps.noAutoShowMediaControls;
  delete mediaProps.noMediaSliderFeedback;
  delete mediaProps.onControlsAvailable;
  delete mediaProps.onJumpBackward;
  delete mediaProps.onJumpForward;
  delete mediaProps.onPause;
  delete mediaProps.onPlay;
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
  mediaProps.className = css.audio;
  mediaProps.controls = false;
  mediaProps.mediaComponent = "audio";
  mediaProps.onLoadStart = handleLoadStart;
  mediaProps.onUpdate = handleEvent;
  mediaProps.onEnded = handleEndedEvent;
  mediaProps.ref = setAudioRef;

  let proportionSelection = selection;
  if (proportionSelection != null && state.duration) {
    proportionSelection = selection.map((t) => t / state.duration);
  }

  const durFmt = getDurFmt(locale);

  return (
    <RootContainer
      className={classNames({ [css.audioPlayer]: true }, "enact-fit", {
        [className]: className,
      })}
      onClick={activityDetected}
      ref={setPlayerRef}
      spotlightDisabled={spotlightDisabled}
      spotlightId={spotlightId}
      style={style}
    >
      <AlbumInfo
        title={title}
        artist={mediaProps.artist}
        album={mediaProps.album}
        thumbnail={thumbnailSrc}
        isPlaying= {prevCommand.current === "play"}
      />
      {(VideoComponent &&
        (((typeof VideoComponent === "function" ||
          typeof VideoComponent === "string") && (
          <VideoComponent {...mediaProps} />
        )) ||
          (React.isValidElement(VideoComponent) &&
            React.cloneElement(VideoComponent, mediaProps)))) ||
        null}
      <Overlay bottomControlsVisible>
        {!noSpinner && (state.loading || loading) && <Spinner centered />}
      </Overlay>
      {state.bottomControlsRendered && (
        <div className={css.fullscreen}>
          {onBack instanceof Function && state.mediaSliderVisible && (
            <Button
              icon="arrowhookleft"
              className={css.back}
              iconOnly
              size="large"
              onClick={onBack}
              backgroundOpacity="transparent"
            />
          )}
          {
            <ControlsContainer
              className={classNames({
                [css.bottom]: true,
                [css.hidden]: !state.mediaControlsVisible,
                [css.lift]: state.infoVisible,
              })}
              spotlightDisabled={
                spotlightDisabled || !state.mediaControlsVisible
              }
            >
              {/*
        Info Section: Title, Description, Times
        Only render when `state.mediaControlsVisible` is true in order for `Marquee`
        to make calculations correctly in `MediaTitle`.
       */}
              {state.mediaSliderVisible && (
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
                  {noSlider && (
                    <Times
                      current={state.currentTime}
                      total={state.duration}
                      formatter={durFmt}
                    />
                  )}
                </div>
              )}
              {!noSlider && (
                <div className={css.sliderContainer}>
                  {state.mediaSliderVisible && (
                    <Times
                      noTotalTime
                      current={state.currentTime}
                      formatter={durFmt}
                    />
                  )}
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
                  ></MediaSlider>
                  {state.mediaSliderVisible && (
                    <Times
                      noCurrentTime
                      total={state.duration}
                      formatter={durFmt}
                    />
                  )}
                </div>
              )}
              <ComponentOverride
                component={mediaControlsComponent}
                mediaDisabled={disabled || state.sourceUnavailable}
                onClose={handleMediaControlsClose}
                onJump={handleJump}
                onJumpBackwardButtonClick={onJumpBackward}
                onJumpForwardButtonClick={onJumpForward}
                onPause={handlePause}
                onPlay={handlePlay}
                onToggleMore={handleToggleMore}
                paused={state.paused}
                spotlightId={mediaControlsSpotlightId.current}
                spotlightDisabled={
                  !state.mediaControlsVisible || spotlightDisabled
                }
                visible={state.mediaControlsVisible}
              />
            </ControlsContainer>
          }
        </div>
      )}
      <SpottableDiv
        // This captures spotlight focus for use with 5-way.
        // It's non-visible but lives at the top of the VideoPlayer.
        className={css.controlsHandleAbove}
        onClick={showControls}
        onSpotlightDown={showControls}
        spotlightDisabled={state.mediaControlsVisible || spotlightDisabled}
      />
    </RootContainer>
  );
}

AudioPlayerBase.propTypes = {
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
   * * `onClose` - Called when cancel key is pressed when the media controls are visible
   * * `onJump` - Called when the media jumps either forward or backward
   * * `onJumpBackwardButtonClick` - Called when the jump backward button is pressed
   * * `onJumpForwardButtonClick` - Called when the jump forward button is pressed
   * * `onKeyDown` - Called when a key is pressed
   * * `onPause` - Called when the media is paused via a key event
   * * `onPlay` - Called when the media is played via a key event
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
  videoPath: PropTypes.func,
};

AudioPlayerBase.defaultProps = {
  autoCloseTimeout: 5000,
  feedbackHideDelay: 3000,
  jumpBy: 30,
  mediaControlsComponent: MediaControls,
  miniFeedbackHideDelay: 2000,
  spotlightId: "audioPlayer",
  titleHideDelay: 5000,
  videoComponent: Media,
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
 * ref to the `AudioPlayer` within your component:
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
 *    <AudioPlayer ref={setVideoPlayer} />
 *   );
 *  }
 * ```
 *
 * @function AudioPlayer
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */
const AudioPlayer = memo(
  ApiDecorator(
    {
      api: [
        "areControlsVisible",
        "getMediaState",
        "getVideoNode",
        "hideControls",
        "jump",
        "pause",
        "play",
        "seek",
        "showControls",
        "showFeedback",
        "toggleControls",
      ],
    },
    I18nContextDecorator(
      { localeProp: "locale" },
      Slottable(
        {
          slots: [
            "infoComponents",
            "mediaControlsComponent",
            "source",
            "track",
            "thumbnailComponent",
            "videoComponent",
          ],
        },
        FloatingLayerDecorator(
          { floatLayerId: "videoPlayerFloatingLayer" },
          Skinnable(AudioPlayerBase)
        )
      )
    )
  )
);

export default AudioPlayer;
export { MediaControls, Audio, AudioPlayer, AudioPlayerBase };
