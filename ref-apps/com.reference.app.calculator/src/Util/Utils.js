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

import { OperFunc, Memory } from "../data/OperFunc";
import { DISPLAY } from "../data/Display";
import * as mathjs from "mathjs";

const isArthimetic = (value) => {
  let operators = OperFunc.PLUS + OperFunc.MINUS + OperFunc.MUL + OperFunc.DIV;
  console.log(operators);
  if (operators.indexOf(value) !== -1) {
    return true;
  }
  return false;
};

const isNumbers = (value) => {
  let special = "0123456789";
  if (special.indexOf(value) !== -1) {
    return true;
  }
  return false;
};

const isMemoryOp = (value) => {
  let memory = Memory.MC + Memory.MP + Memory.MM + Memory.MR + Memory.MS;
  if (memory.indexOf(value) !== -1) {
    return true;
  }
  return false;
};

const isValidResult = (result) => {
  let ret = true;
  if (
    result !== undefined &&
    result !== null &&
    result.indexOf("undefined") === -1
  ) {
    for (const status in DISPLAY) {
      if (result.indexOf(DISPLAY[status]) !== -1) {
        ret = false;
      }
    }
  }
  return ret;
};
const validateSyntax = (history) => {
  let leftParen = history.indexOf("(");
  let rightParen = history.indexOf(")");
  if (
    (leftParen === -1 && rightParen >= 0) ||
    (rightParen === -1 && leftParen >= 0)
  ) {
    console.log("Parenthesss missing -1 !!!!");
    return -1;
  } else {
    let counter = 0;
    let splitArr = history.split("");
    for (let i = 0; i < splitArr.length; i++) {
      if (splitArr[i] === "(") {
        counter++;
      } else if (splitArr[i] === ")") {
        counter--;
      }

      if (counter === -1) {
        console.log("Parenthesss missing -2 !!!!");
        return -1;
      }
    }
    if (counter < 0) {
      console.log("Parenthesss missing -3 !!!!");
      return -1;
    }
  }
  return 1;
};
const doEval = (expression) => {
  let answer = DISPLAY.ERROR;
  try {
    answer = mathjs.evaluate(expression);
  } catch (err) {
    answer = DISPLAY.ERROR;
  }
  return answer;
};

const doEvalUtil = (history) => {
  if (validateSyntax(history) === -1) {
    return DISPLAY.INVALID;
  } else if (history !== undefined && history.length > 0) {
    if (history.includes("--")) {
      history = history.replace("--", "+");
    }
    if (history.includes("%")) {
      history = history.replace("%", "/100");
    }
    return doEval(history);
  }
};
export {
  validateSyntax,
  isValidResult,
  isArthimetic,
  isMemoryOp,
  isNumbers,
  doEvalUtil,
};
