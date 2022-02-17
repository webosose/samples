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

import React from "react";
import KeyPad from "./KeyPad";
import { OperFunc, Memory } from "../data/OperFunc";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import css from "./Calculator.module.less";

import {
  isValidResult,
  isArthimetic,
  isMemoryOp,
  isNumbers,
} from "../Util/Utils";

import {
  doReset,
  doBackSpace,
  setHistory,
  doEvaluate,
  doMemoryOp,
} from "../Actions/CalcActions";

function Calculator({
  history,
  memory,
  isHistory,
  isCalculated,
  isMemory,
  result,
  updateHistory,
  doMemory,
  reset,
  backSpace,
  evaluate,
}) {
  const handleMemory = (value) => {
    let memOp = result;
    if (value === Memory.MS) {
      if (result.length > 0) {
        doMemory(result, memOp, value);
      }
    } else if (isMemory === true) {
      if (value === Memory.MP) {
        memOp = memory + "+" + result;
      } else if (value === Memory.MM) {
        memOp = memory + "-" + result;
      } else if (value === Memory.MR) {
        memOp = memory;
      } else if (value === Memory.MC) {
        memOp = "";
      }
      doMemory(memOp, value);
    }
  };
  const onClickHandler = (value) => {
    if (value === OperFunc.EQUAL) {
      if (history.length > 0) {
        evaluate(history);
      }
    } else if (value === OperFunc.RESET) {
      reset();
    } else if (value === OperFunc.BACK) {
      if (isHistory === true) {
        backSpace(history);
      } else {
        reset();
      }
    } else if (isMemoryOp(value)) {
      handleMemory(value);
    } else {
      let isResult = false;
      if (
        isHistory === false &&
        isCalculated === true &&
        isValidResult(result) === true &&
        isArthimetic(value) === true &&
        isNumbers(value) === false
      ) {
        isResult = true;
      }
      if (isContainDot(value) !== true) {
        updateHistory(value, isResult);
      }
    }
  };

  function isContainDot(dot) {
    if (history.includes(dot) && dot === OperFunc.DOT) {
      return true;
    }
    return false;
  }

  return (
    <div className={css.calculator}>
      <KeyPad
        isHistory={isHistory}
        isMemory={isMemory}
        onClickHandler={onClickHandler}
      />
    </div>
  );
}

Calculator.propTypes = {
  history: PropTypes.string,
  memory: PropTypes.string,
  isHistory: PropTypes.bool,
  isCalculated: PropTypes.bool,
  isMemory: PropTypes.bool,
  result: PropTypes.string,
  updateHistory: PropTypes.func,
  doMemory: PropTypes.func,
  reset: PropTypes.func,
  backSpace: PropTypes.func,
  evaluate: PropTypes.func,
};

const mapStateToProps = ({ calc }) => {
  return {
    memory: calc.memory,
    history: calc.history,
    result: calc.result,
    isCalculated: calc.isCalculated,
    isHistory: calc.isHistory,
    isMemory: calc.isMemory,
  };
};
const mapDispatchToState = (dispatch) => {
  return {
    reset: () => dispatch(doReset()),
    updateHistory: (value, isResult) => dispatch(setHistory(value, isResult)),
    backSpace: (history) => dispatch(doBackSpace(history)),
    evaluate: (history) => dispatch(doEvaluate(history)),
    doMemory: (memory, value) => dispatch(doMemoryOp(memory, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToState)(Calculator);
