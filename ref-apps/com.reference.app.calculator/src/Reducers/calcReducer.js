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

import { Types } from "../Actions/Types";

const initialState = {
  expression: [],
  history: "",
  result: "",
  memory: "",
  isMemory: false,
  isHistory: false,
  isCalculated: true,
};

const calcReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.RESULT: {
      return {
        ...state,
        result: action.result,
      };
    }
    case Types.EVALUATE: {
      return {
        ...state,
        result: action.result,
        isHistory: false,
        isCalculated: true,
      };
    }
    case Types.RESET:
      return {
        ...state,
        expression: [],
        history: "",
        result: "",
        isHistory: false,
        isCalculated: true,
      };
    case Types.BACKSPACE: {
      let expression = state.expression;
      if (expression && expression.length > 0) {
        expression.pop();
      }
      return {
        ...state,
        expression: expression,
        history: expression.join(""),
        isHistory: true,
      };
    }
    case Types.HISTORY: {
      let hist = [];
      if (
        state.history &&
        state.history.length > 0 &&
        state.isCalculated === false
      ) {
        hist = state.expression;
      }
      if (action.isResult === true) {
        hist.push(state.result);
      }
      hist.push(action.history);
      return {
        ...state,
        expression: hist,
        history: hist.join(""),
        isHistory: true,
        isCalculated: state.isCalculated === true ? false : state.isCalculated,
      };
    }
    case Types.MEMORY: {
      let mem = action.memory;
      let isMem = mem === "" ? false : mem && mem.length > 0 ? true : false;
      return {
        ...state,
        memory: mem && mem.length > 0 ? mem : "",
        isMemory: isMem,
      };
    }
    default:
      return state;
  }
};

export default calcReducer;
