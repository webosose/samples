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

import ApiDecorator from "@enact/core/internal/ApiDecorator";
import Cancelable from "@enact/ui/Cancelable";
import kind from "@enact/core/kind";
import hoc from "@enact/core/hoc";
import { is } from "@enact/core/keymap";
import { on, off } from "@enact/core/dispatcher";
import Pause from "@enact/spotlight/Pause";
import Slottable from "@enact/ui/Slottable";
import Spotlight from "@enact/spotlight";
import {
  SpotlightContainerDecorator,
  spotlightDefaultClass,
} from "@enact/spotlight/SpotlightContainerDecorator";
import { forward } from "@enact/core/handle";

import onlyUpdateForKeys from "recompose/onlyUpdateForKeys";
import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";

import $L from "@enact/sandstone/internal/$L";
import { compareChildren } from "@enact/sandstone/internal/util";
import Button from "@enact/sandstone/Button";

import css from "./MediaControls.module.less";

const OuterContainer = SpotlightContainerDecorator(
  {
    defaultElement: [`.${spotlightDefaultClass}`],
  },
  "div"
);
const Container = SpotlightContainerDecorator(
  {
    enterTo: "default-element",
  },
  "div"
);
const MediaButton = onlyUpdateForKeys([
  "children",
  "className",
  "disabled",
  "icon",
  "onClick",
  "spotlightDisabled",
])(Button);

const forwardToggleMore = forward("onToggleMore");

/**
 * A set of components for controlling media playback and rendering additional components.
 *
 * @class MediaControlsBase
 * @memberof sandstone/VideoPlayer
 * @ui
 * @private
 */
const MediaControlsBase = kind({
  name: "MediaControls",

  // intentionally assigning these props to MediaControls instead of Base (which is private)
  propTypes: /** @lends sandstone/VideoPlayer.MediaControls.prototype */ {
    /**
     * These components are placed below the action guide. Typically these will be media playlist controls.
     *
     * @type {Node}
     * @public
     */
    bottomComponents: PropTypes.node,

    /**
     * Jump backward [icon]{@link sandstone/Icon.Icon} name. Accepts any
     * [icon]{@link sandstone/Icon.Icon} component type.
     *
     * @type {String}
     * @default 'jumpbackward'
     * @public
     */
    jumpBackwardIcon: PropTypes.string,

    /**
     * Disables state on the media "jump" buttons; the outer pair.
     *
     * @type {Boolean}
     * @public
     */
    jumpButtonsDisabled: PropTypes.bool,

    /**
     * Jump forward [icon]{@link sandstone/Icon.Icon} name. Accepts any
     * [icon]{@link sandstone/Icon.Icon} component type.
     *
     * @type {String}
     * @default 'jumpforward'
     * @public
     */
    jumpForwardIcon: PropTypes.string,

    /**
     * Disables the media buttons.
     *
     * @type {Boolean}
     * @public
     */
    mediaDisabled: PropTypes.bool,

    /**
     * When `true`, more components are rendered. This does not indicate the visibility of more components.
     *
     * @type {Boolean}
     * @public
     */
    moreComponentsRendered: PropTypes.bool,

    /**
     * The spotlight ID for the moreComponent container.
     *
     * @type {String}
     * @public
     * @default 'moreComponents'
     */
    moreComponentsSpotlightId: PropTypes.string,

    /**
     * Removes the "jump" buttons. The buttons that skip forward or backward in the video.
     *
     * @type {Boolean}
     * @public
     */
    noJumpButtons: PropTypes.bool,

    /**
     * Called when cancel/back key events are fired.
     *
     * @type {Function}
     * @public
     */
    onClose: PropTypes.func,

    /**
     * Called when the user clicks the JumpBackward button
     *
     * @type {Function}
     * @public
     */
    onJumpBackwardButtonClick: PropTypes.func,

    /**
     * Called when the user clicks the JumpForward button.
     *
     * @type {Function}
     * @public
     */
    onJumpForwardButtonClick: PropTypes.func,

    /**
     * Called when the user presses a media control button.
     *
     * @type {Function}
     * @public
     */
    onKeyDownFromMediaButtons: PropTypes.func,

    /**
     * Called when the user clicks the Play button.
     *
     * @type {Function}
     * @public
     */
    onPlayButtonClick: PropTypes.func,

    /**
     * `true` when the video is paused.
     *
     * @type {Boolean}
     * @public
     */
    paused: PropTypes.bool,

    /**
     * A string which is sent to the `pause` icon of the player controls. This can be
     * anything that is accepted by [Icon]{@link sandstone/Icon.Icon}. This will be temporarily replaced by
     * the [playIcon]{@link sandstone/VideoPlayer.MediaControls.playIcon} when the
     * [paused]{@link sandstone/VideoPlayer.MediaControls.paused} boolean is `false`.
     *
     * @type {String}
     * @default 'pause'
     * @public
     */
    pauseIcon: PropTypes.string,

    /**
     * A string which is sent to the `play` icon of the player controls. This can be
     * anything that is accepted by {@link sandstone/Icon.Icon}. This will be temporarily replaced by
     * the [pauseIcon]{@link sandstone/VideoPlayer.MediaControls.pauseIcon} when the
     * [paused]{@link sandstone/VideoPlayer.MediaControls.paused} boolean is `true`.
     *
     * @type {String}
     * @default 'play'
     * @public
     */
    playIcon: PropTypes.string,

    /**
     * Disables the media "play"/"pause" button.
     *
     * @type {Boolean}
     * @public
     */
    playPauseButtonDisabled: PropTypes.bool,

    /**
     * When `true`, more components are visible.
     *
     * @type {Boolean}
     * @private
     */
    showMoreComponents: PropTypes.bool,

    /**
     * `true` controls are disabled from Spotlight.
     *
     * @type {Boolean}
     * @public
     */
    spotlightDisabled: PropTypes.bool,

    /**
     * The spotlight ID for the media controls container.
     *
     * @type {String}
     * @public
     * @default 'mediaControls'
     */
    spotlightId: PropTypes.string,

    /**
     * The visibility of the component. When `false`, the component will be hidden.
     *
     * @type {Boolean}
     * @default true
     * @public
     */
    visible: PropTypes.bool,
  },

  defaultProps: {
    jumpBackwardIcon: "jumpbackward",
    jumpForwardIcon: "jumpforward",
    moreComponentsSpotlightId: "moreComponents",
    spotlightId: "mediaControls",
    pauseIcon: "pause",
    playIcon: "play",
    visible: true,
  },

  styles: {
    css,
    className: "controlsFrame",
  },

  computed: {
    className: ({ visible, styler }) => styler.append({ hidden: !visible }),
    moreButtonsClassName: ({ styler }) =>
      styler.join("mediaControls", "moreButtonsComponents"),
    moreComponentsClassName: ({
      styler,
      showMoreComponents,
      moreComponentsRendered,
    }) =>
      styler.join("moreComponents", {
        lift: showMoreComponents && moreComponentsRendered,
      }),
    moreComponentsRendered: ({ showMoreComponents, moreComponentsRendered }) =>
      showMoreComponents || moreComponentsRendered,
  },

  render: ({
    children,
    jumpBackwardIcon,
    jumpButtonsDisabled,
    moreComponentsClassName,
    jumpForwardIcon,
    bottomComponents,
    mediaDisabled,
    moreComponentsSpotlightId,
    noJumpButtons,
    onJumpBackwardButtonClick,
    onJumpForwardButtonClick,
    onKeyDownFromMediaButtons,
    onPlayButtonClick,
    paused,
    pauseIcon,
    playIcon,
    playPauseButtonDisabled,
    showMoreComponents,
    moreComponentsRendered,
    moreButtonsClassName,
    spotlightDisabled,
    spotlightId,
    ...rest
  }) => {
    delete rest.onClose;
    delete rest.visible;
    return (
      <OuterContainer {...rest} spotlightId={spotlightId}>
        <Container
          className={css.mediaControls}
          spotlightDisabled={spotlightDisabled}
          onKeyDown={onKeyDownFromMediaButtons}
        >
          {noJumpButtons ? null : (
            <MediaButton
              aria-label={$L("Previous")}
              backgroundOpacity="transparent"
              disabled={mediaDisabled || jumpButtonsDisabled}
              icon={jumpBackwardIcon}
              onClick={onJumpBackwardButtonClick}
              size="large"
              spotlightDisabled={spotlightDisabled}
            />
          )}
          <MediaButton
            aria-label={paused ? $L("Play") : $L("Pause")}
            className={spotlightDefaultClass}
            backgroundOpacity="transparent"
            disabled={mediaDisabled || playPauseButtonDisabled}
            icon={paused ? playIcon : pauseIcon}
            onClick={onPlayButtonClick}
            size="large"
            spotlightDisabled={spotlightDisabled}
          />
          {noJumpButtons ? null : (
            <MediaButton
              aria-label={$L("Next")}
              backgroundOpacity="transparent"
              disabled={mediaDisabled || jumpButtonsDisabled}
              icon={jumpForwardIcon}
              onClick={onJumpForwardButtonClick}
              size="large"
              spotlightDisabled={spotlightDisabled}
            />
          )}
        </Container>
        {moreComponentsRendered ? (
          <Container
            spotlightId={moreComponentsSpotlightId}
            className={moreComponentsClassName}
            spotlightDisabled={!showMoreComponents || spotlightDisabled}
          >
            <Container className={moreButtonsClassName}>{children}</Container>
            <div>{bottomComponents}</div>
          </Container>
        ) : null}
      </OuterContainer>
    );
  },
});

/**
 * Media control behaviors to apply to [MediaControlsBase]{@link sandstone/VideoPlayer.MediaControlsBase}.
 * Provides built-in support for showing more components and key handling for basic playback
 * controls.
 *
 * @class MediaControlsDecorator
 * @memberof sandstone/VideoPlayer
 * @mixes ui/Slottable.Slottable
 * @hoc
 * @private
 */
const MediaControlsDecorator = hoc((config, Wrapped) => {
  // eslint-disable-line no-unused-vars
  class MediaControlsDecoratorHOC extends React.Component {
    static displayName = "MediaControlsDecorator";

    static propTypes =
      /** @lends sandstone/VideoPlayer.MediaControlsDecorator.prototype */ {
        /**
         * These components are placed below the children. Typically these will be media playlist items.
         *
         * @type {Node}
         * @public
         */
        bottomComponents: PropTypes.node,

        /**
         * The number of milliseconds that the player will pause before firing the
         * first jump event on a right or left pulse.
         *
         * @type {Number}
         * @default 400
         * @public
         */
        initialJumpDelay: PropTypes.number,

        /**
         * The number of milliseconds that the player will throttle before firing a
         * jump event on a right or left pulse.
         *
         * @type {Number}
         * @default 200
         * @public
         */
        jumpDelay: PropTypes.number,

        /**
         * Disables the media buttons.
         *
         * @type {Boolean}
         * @public
         */
        mediaDisabled: PropTypes.bool,

        /**
         * Disables showing more components.
         *
         * @type {Boolean}
         * @public
         */
        moreActionDisabled: PropTypes.bool,

        /**
         * Setting this to `true` will disable left and right keys for seeking.
         *
         * @type {Boolean}
         * @public
         */
        no5WayJump: PropTypes.bool,

        /**
         * Removes the "rate" buttons. The buttons that change the playback rate of the video.
         * Double speed, half speed, reverse 4x speed, etc.
         *
         * @type {Boolean}
         * @public
         */
        noRateButtons: PropTypes.bool,

        /**
         * Called when media fast forwards.
         *
         * @type {Function}
         * @public
         */
        onFastForward: PropTypes.func,

        /**
         * Called when media jumps.
         *
         * @type {Function}
         * @public
         */
        onJump: PropTypes.func,

        /**
         * Called when media gets paused.
         *
         * @type {Function}
         * @public
         */
        onPause: PropTypes.func,

        /**
         * Called when media starts playing.
         *
         * @type {Function}
         * @public
         */
        onPlay: PropTypes.func,

        /**
         * Called when media rewinds.
         *
         * @type {Function}
         * @public
         */
        onRewind: PropTypes.func,

        /**
         * Called when the user clicks the More button.
         *
         * @type {Function}
         * @public
         */
        onToggleMore: PropTypes.func,

        /**
         * The video pause state.
         *
         * @type {Boolean}
         * @public
         */
        paused: PropTypes.bool,

        /**
         * Disables state on the media "play"/"pause" button
         *
         * @type {Boolean}
         * @public
         */
        playPauseButtonDisabled: PropTypes.bool,

        /**
         * Disables the media playback-rate control buttons; the inner pair.
         *
         * @type {Boolean}
         * @public
         */
        rateButtonsDisabled: PropTypes.bool,

        /**
         * Registers the MediaControls component with an
         * [ApiDecorator]{@link core/internal/ApiDecorator.ApiDecorator}.
         *
         * @type {Function}
         * @private
         */
        setApiProvider: PropTypes.func,

        /**
         * The visibility of the component. When `false`, the component will be hidden.
         *
         * @type {Boolean}
         * @public
         */
        visible: PropTypes.bool,
      };

    static defaultProps = {
      initialJumpDelay: 400,
      jumpDelay: 200,
    };

    constructor(props) {
      super(props);
      this.mediaControlsNode = null;

      this.keyLoop = null;
      this.pulsingKeyCode = null;
      this.pulsing = null;
      this.paused = new Pause("VideoPlayer");
      this.bottomComponentsHeight = 0;
      this.actionGuideHeight = 0;

      this.state = {
        showMoreComponents: false,
        moreComponentsRendered: false,
      };

      if (props.setApiProvider) {
        props.setApiProvider(this);
      }
    }

    static getDerivedStateFromProps(props) {
      if (!props.visible) {
        return {
          showMoreComponents: false,
        };
      }
      return null;
    }

    componentDidMount() {
      on("keydown", this.handleKeyDown);
      on("keyup", this.handleKeyUp);
      on("blur", this.handleBlur, window);
      on("wheel", this.handleWheel);
    }

    componentDidUpdate(prevProps, prevState) {
      // Need to render `moreComponents` to show it. For performance, render `moreComponents` if it is actually shown.
      if (
        !prevState.showMoreComponents &&
        this.state.showMoreComponents &&
        !this.state.moreComponentsRendered
      ) {
        // eslint-disable-next-line
        this.setState({
          moreComponentsRendered: true,
        });
      }

      if (
        (!prevState.moreComponentsRendered &&
          this.state.moreComponentsRendered) ||
        (this.state.moreComponentsRendered &&
          prevProps.bottomComponents !== this.props.bottomComponents) ||
        !compareChildren(this.props.children, prevProps.children)
      ) {
        this.calculateMoreComponentsHeight();
      }

      if (
        (this.state.showMoreComponents &&
          !prevState.moreComponentsRendered &&
          this.state.moreComponentsRendered) ||
        (this.state.moreComponentsRendered &&
          prevState.showMoreComponents !== this.state.showMoreComponents)
      ) {
        forwardToggleMore(
          {
            showMoreComponents: this.state.showMoreComponents,
            liftDistance: this.bottomComponentsHeight - this.actionGuideHeight,
          },
          this.props
        );
      }

      // if media controls disabled, reset key loop
      if (!prevProps.mediaDisabled && this.props.mediaDisabled) {
        this.stopListeningForPulses();
        this.paused.resume();
      }
    }

    componentWillUnmount() {
      off("keydown", this.handleKeyDown);
      off("keyup", this.handleKeyUp);
      off("blur", this.handleBlur, window);
      off("wheel", this.handleWheel);
      this.stopListeningForPulses();
    }

    calculateMoreComponentsHeight = () => {
      if (!this.mediaControlsNode) {
        this.bottomComponentsHeight = 0;
        return;
      }

      const bottomElement = this.mediaControlsNode.querySelector(
        `.${css.moreComponents}`
      );
      this.bottomComponentsHeight = bottomElement
        ? bottomElement.scrollHeight
        : 0;
    };

    handleKeyDownFromMediaButtons = (ev) => {
      if (
        is("down", ev.keyCode) &&
        !this.state.showMoreComponents &&
        !this.props.moreActionDisabled
      ) {
        this.showMoreComponents();
        ev.stopPropagation();
      }
    };

    handleKeyDown = (ev) => {
      const { mediaDisabled, no5WayJump, visible } = this.props;

      const current = Spotlight.getCurrent();

      if (
        !no5WayJump &&
        !visible &&
        !mediaDisabled &&
        (!current || current.classList.contains(css.controlsHandleAbove)) &&
        (is("left", ev.keyCode) || is("right", ev.keyCode))
      ) {
        this.paused.pause();
        this.startListeningForPulses(ev.keyCode);
      }
    };

    handleKeyUp = (ev) => {
      const {
        mediaDisabled,
        no5WayJump,
        noRateButtons,
        playPauseButtonDisabled,
        rateButtonsDisabled,
      } = this.props;

      if (mediaDisabled) return;

      if (!playPauseButtonDisabled) {
        if (is("play", ev.keyCode)) {
          forward("onPlay", ev, this.props);
        } else if (is("pause", ev.keyCode)) {
          forward("onPause", ev, this.props);
        }
      }

      if (!no5WayJump && (is("left", ev.keyCode) || is("right", ev.keyCode))) {
        this.stopListeningForPulses();
        this.paused.resume();
      }

      if (!noRateButtons && !rateButtonsDisabled) {
        if (is("rewind", ev.keyCode)) {
          forward("onRewind", ev, this.props);
        } else if (is("fastForward", ev.keyCode)) {
          forward("onFastForward", ev, this.props);
        }
      }
    };

    handleBlur = () => {
      this.stopListeningForPulses();
      this.paused.resume();
    };

    handleWheel = () => {
      if (
        !this.state.showMoreComponents &&
        this.props.visible &&
        !this.props.moreActionDisabled
      ) {
        this.showMoreComponents();
      }
    };

    startListeningForPulses = (keyCode) => {
      // Ignore new pulse calls if key code is same, otherwise start new series if we're pulsing
      if (this.pulsing && keyCode !== this.pulsingKeyCode) {
        this.stopListeningForPulses();
      }
      if (!this.pulsing) {
        this.pulsingKeyCode = keyCode;
        this.pulsing = true;
        this.keyLoop = setTimeout(
          this.handlePulse,
          this.props.initialJumpDelay
        );
        forward("onJump", { keyCode }, this.props);
      }
    };

    handlePulse = () => {
      forward("onJump", { keyCode: this.pulsingKeyCode }, this.props);
      this.keyLoop = setTimeout(this.handlePulse, this.props.jumpDelay);
    };

    handlePlayButtonClick = (ev) => {
      forward("onPlayButtonClick", ev, this.props);
      if (this.props.paused) {
        forward("onPlay", ev, this.props);
      } else {
        forward("onPause", ev, this.props);
      }
    };

    stopListeningForPulses() {
      this.pulsing = false;
      if (this.keyLoop) {
        clearTimeout(this.keyLoop);
        this.keyLoop = null;
      }
    }

    getMediaControls = (node) => {
      if (!node) {
        this.actionGuideHeight = 0;
        return;
      }
      this.mediaControlsNode = ReactDOM.findDOMNode(node); // eslint-disable-line react/no-find-dom-node

      const guideElement = this.mediaControlsNode.querySelector(
        `.${css.actionGuide}`
      );
      this.actionGuideHeight = guideElement ? guideElement.scrollHeight : 0;
      this.mediaControlsNode.style.setProperty(
        "--actionGuideComponentHeight",
        `${this.actionGuideHeight}px`
      );
    };

    areMoreComponentsAvailable = () => {
      return this.state.showMoreComponents;
    };

    showMoreComponents = () => {
      this.setState({ showMoreComponents: true });
    };

    hideMoreComponents = () => {
      this.setState({ showMoreComponents: false });
    };

    toggleMoreComponents() {
      this.setState((prevState) => {
        return {
          showMoreComponents: !prevState.showMoreComponents,
        };
      });
    }

    handleClose = (ev) => {
      if (this.props.visible) {
        forward("onClose", ev, this.props);
      }
    };

    handleTransitionEnd = (ev) => {
      if (
        ev.propertyName === "transform" &&
        ev.target.dataset.spotlightId === "moreComponents"
      ) {
        if (this.state.showMoreComponents && !Spotlight.getPointerMode()) {
          Spotlight.move("down");
        }
      }
    };

    render() {
      const props = Object.assign({}, this.props);
      delete props.initialJumpDelay;
      delete props.jumpDelay;
      delete props.moreActionDisabled;
      delete props.no5WayJump;
      delete props.onFastForward;
      delete props.onJump;
      delete props.onPause;
      delete props.onPlay;
      delete props.onRewind;
      delete props.onToggleMore;
      delete props.setApiProvider;

      return (
        <Wrapped
          ref={this.getMediaControls}
          {...props}
          moreComponentsRendered={this.state.moreComponentsRendered}
          onClose={this.handleClose}
          onKeyDownFromMediaButtons={this.handleKeyDownFromMediaButtons}
          onPlayButtonClick={this.handlePlayButtonClick}
          onTransitionEnd={this.handleTransitionEnd}
          showMoreComponents={this.state.showMoreComponents}
        />
      );
    }
  }

  return Slottable({ slots: ["bottomComponents"] }, MediaControlsDecoratorHOC);
});

const handleCancel = (ev, { onClose }) => {
  if (onClose) {
    onClose(ev);
  }
};

/**
 * A set of components for controlling media playback and rendering additional components.
 *
 * This uses [Slottable]{@link ui/Slottable} to accept the custom tags, `<bottomComponents>`
 * to add components to the bottom of the media controls. Any additional children will be
 * rendered into the "more" controls area. Showing the additional components is handled by
 * `MediaControls` when the user navigates down from the media buttons.
 *
 * @class MediaControls
 * @memberof sandstone/VideoPlayer
 * @mixes ui/Cancelable.Cancelable
 * @ui
 * @public
 */
const MediaControls = ApiDecorator(
  {
    api: [
      "areMoreComponentsAvailable",
      "showMoreComponents",
      "hideMoreComponents",
    ],
  },
  MediaControlsDecorator(
    Cancelable({ modal: true, onCancel: handleCancel }, MediaControlsBase)
  )
);

MediaControls.defaultSlot = "mediaControlsComponent";

export default MediaControls;
export { MediaControlsBase, MediaControls, MediaControlsDecorator };
