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

// Full List (Hash) of Feedback states and their icons with metadata
//

export default {
 play          : {icon: 'play',               position: 'after',   allowHide: true,   message: null},
 pause         : {icon: 'pause',              position: 'after',   allowHide: false,  message: null},
 rewind        : {icon: 'backward',           position: 'before',  allowHide: false,  message: 'x'},
 slowRewind    : {icon: 'pausebackward',      position: 'before',  allowHide: false,  message: 'x'},
 fastForward   : {icon: 'forward',            position: 'after',   allowHide: false,  message: 'x'},
 slowForward   : {icon: 'pauseforward',       position: 'after',   allowHide: false,  message: 'x'},
 jumpBackward  : {icon: 'pausejumpbackward',  position: 'before',  allowHide: false,  message: ' '},
 jumpForward   : {icon: 'pausejumpforward',   position: 'after',   allowHide: false,  message: ' '},
 jumpToStart   : {icon: 'skipbackward',       position: 'before',  allowHide: true,   message: null},
 jumpToEnd     : {icon: 'skipforward',        position: 'after',   allowHide: true,   message: null},
 stop          : {icon: null,                 position: null,      allowHide: true,   message: null}
};
