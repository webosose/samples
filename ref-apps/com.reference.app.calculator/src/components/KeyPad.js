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

import Button from "@enact/moonstone/Button";
import React from "react";
import { OperFunc, Numbers, Memory } from "../data/OperFunc";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Label from "@enact/moonstone/LabeledItem";
import css from "./Calculator.module.less";

function KeyPad({ result, history, onClickHandler, isMemory, isHistory }) {
  return (
    <div className={css.keypad}>
      <label className={css.result}> {result}</label>
      <Label className={css.history}> {history}</Label>
      <hr className={css.hrule} />
      <Button onClick={() => onClickHandler(OperFunc.RESET)}>
        {OperFunc.RESET}
      </Button>
      <Button
        disabled={isHistory === false}
        onClick={() => onClickHandler(OperFunc.BACK)}
      >
        {OperFunc.BACK}
      </Button>
      <Button
        disabled={isMemory === false}
        color={isMemory === false ? "red" : "green"}
        onClick={() => onClickHandler(Memory.MC)}
      >
        {Memory.MC}
      </Button>
      <Button
        disabled={isMemory === false}
        color={isMemory === false ? "red" : "green"}
        onClick={() => onClickHandler(Memory.MR)}
      >
        {Memory.MR}
      </Button>
      <Button
        disabled={isMemory === false}
        color={isMemory === false ? "red" : "green"}
        onClick={() => onClickHandler(Memory.MP)}
      >
        M+
      </Button>
      <Button
        disabled={isMemory === false}
        color={isMemory === false ? "red" : "green"}
        onClick={() => onClickHandler(Memory.MM)}
      >
        M-
      </Button>
      <Button
        color={isMemory === false ? "red" : "green"}
        onClick={() => onClickHandler(Memory.MS)}
      >
        {Memory.MS}
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.XSQ)}>
        x<sup>2</sup>
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.ONEBYX)}>1/x</Button>
      <Button onClick={() => onClickHandler(OperFunc.TENX)}>
        10<sup>x</sup>
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.FACT)}>x!</Button>
      <Button onClick={() => onClickHandler(OperFunc.PERC)}>
        {OperFunc.PERC}
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.LEFTBRACK)}>(</Button>
      <Button onClick={() => onClickHandler(OperFunc.RIGHTBRACK)}>)</Button>
      <Button onClick={() => onClickHandler(OperFunc.ASIN + "(")}>
        {OperFunc.SIN}
        <sup>-1</sup>
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.SIN + "(")}>
        {OperFunc.SIN}
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.SQRT + "(")}>
        <span>&#8730;</span>
      </Button>
      <Button onClick={() => onClickHandler(Numbers.SEVEN)}>
        {Numbers.SEVEN}
      </Button>
      <Button onClick={() => onClickHandler(Numbers.EIGHT)}>
        {Numbers.EIGHT}
      </Button>
      <Button onClick={() => onClickHandler(Numbers.NINE)}>
        {Numbers.NINE}
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.DIV)}>÷</Button>
      <Button onClick={() => onClickHandler(OperFunc.ACOS + "(")}>
        {OperFunc.COS}
        <sup>-1</sup>
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.COS + "(")}>
        {OperFunc.COS}
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.LOG + "(")}>
        {OperFunc.LOG}
      </Button>
      <Button onClick={() => onClickHandler(Numbers.FOUR)}>
        {Numbers.FOUR}
      </Button>
      <Button onClick={() => onClickHandler(Numbers.FIVE)}>
        {Numbers.FIVE}
      </Button>
      <Button onClick={() => onClickHandler(Numbers.SIX)}>{Numbers.SIX}</Button>
      <Button onClick={() => onClickHandler(OperFunc.MUL)}>
        {OperFunc.MUL}
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.ATAN + "(")}>
        {OperFunc.TAN}
        <sup>-1</sup>
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.TAN + "(")}>
        {OperFunc.TAN}
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.LOG10 + "(")}>
        log <sub>10</sub>
      </Button>
      <Button onClick={() => onClickHandler(Numbers.ONE)}>{Numbers.ONE}</Button>
      <Button onClick={() => onClickHandler(Numbers.TWO)}>{Numbers.TWO}</Button>
      <Button onClick={() => onClickHandler(Numbers.THREE)}>
        {Numbers.THREE}
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.MINUS)}>
        {OperFunc.MINUS}
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.PI)}>
        <span>&#8511;</span>
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.EXP + "(")}>
        {OperFunc.EXP}
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.POW)}>
        x<sup>y</sup>
      </Button>
      <Button onClick={() => onClickHandler(Numbers.ZERO)}>
        {Numbers.ZERO}
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.DOT)}>
        {OperFunc.DOT}
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.EQUAL)}>
        {OperFunc.EQUAL}
      </Button>
      <Button onClick={() => onClickHandler(OperFunc.PLUS)}>
        {OperFunc.PLUS}
      </Button>
    </div>
  );
}
KeyPad.propTypes = {
  history: PropTypes.string,
  result: PropTypes.string,
};

const mapStateToProps = ({ calc }) => {
  return {
    history: calc.history,
    result: calc.result,
  };
};
export default connect(mapStateToProps, null)(React.memo(KeyPad));
