## Overview
This tutorial demonstrates the usage of Enact components to create a typical calculator app for webOS OSE.

The Enact UI theme used:
 - Moonstone Theme

The features offered by the calculator app:
 - Basic arithmetic functions
 - Basic maths functions
 - Logarithmic functions
 - Trigonometric functions
 - Memory storage functions

You can use this calculator reference app as follows:

 - Install the app as-is on a webOS OSE target device.
 - Update the source code as required and then deploy on a webOS OSE target device.
 - Analyze the source code to understand the usage of the different Enact components.

## Folder Structure

The Calculator App project should look like this:

```
com.reference.app.calculator/
  README.md
  .gitignore
  node_modules/
  package.json
  resources/
  src/
    Actions/
    App/
      App.js
      App.less
      package.json
    Assets/
 components/
 data/
 Reducers/
 Store/
 styles/
 Util/
    views/
      MainPanel.js
    index.js
  resources/
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

Analyze the source code to get an understanding of the functionalities implemented in the calculator app.
Refer to the snippets provided in this section.

### Using Enact UI Components
The below code snippet uses the Moonstone theme on the Calculator.

Panels provide a way to manage the different screens of an app. Here header and calculator components are managed by Panels.
Button and Label are mainly used for UI development. Since Calculator app is the reference app that uses only UI components.

 ```js
 import { Panel } from "@enact/moonstone/Panels";
 ...
 <Panel {...props} style={{ backgroundColor: "black" }}>
   <Header onClose={handleClose}></Header>
   <Calculator />
 </Panel>
 ...
 import Label from "@enact/moonstone/LabeledItem";
 import Button from "@enact/moonstone/Button";
 ...
  <label className={css.result}> {result}</label>
  <Label className={css.history}> {history}</Label>
 ...
  <Button onClick={() => onClickHandler(Numbers.ONE)}>{Numbers.ONE}</Button>
  <Button onClick={() => onClickHandler(Numbers.TWO)}>{Numbers.TWO}</Button>
  <Button onClick={() => onClickHandler(Numbers.THREE)}>{Numbers.THREE}</Button>
 ...
 ```
###CSS Styles
The CSS-style grid list is used inside the calculator component for the KeyPad layout.

 ``` css
 .keypad {
   display: grid;
   background-color: rgb(172, 172, 172);
   font-family: "digital-clock-font";
   grid-template-columns: repeat(7, 6fr);
   grid-template-rows: repeat(9, 6fr);
   grid-column-gap: 5px;
   grid-row-gap: 10px;
   border: 5px solid #f93881;
   border-radius: 12px;
   padding: 20px;
   zoom: 110%;
 }
 ```
The result and history use the CSS style for the best appearance like the calculator.
 ```css
 ...
 .history {
   .common;
   font-size: 2rem;
   background-color: rgb(153, 153, 153);
   color: whitesmoke;
   font-weight: normal;
   direction: rtl;
 }
 .result {
   .common;
   font-size: 2.5rem;
   background-color: seashell;
   color: black;
 }
 ```
### Math JS library
Math.js is an extensive math library for JavaScript and Node.js. It features a flexible expression parser with support for symbolic computation, comes with a large set of built-in functions and constants, and offers an integrated solution to work with different data types like numbers, big numbers, complex numbers, fractions, units, and matrices.

The calculator app uses this library for parsing and evaluating the expressions.

 ```js
 import * as mathjs from "mathjs";
 ...
 const doEval = (expression) => {
   let answer = DISPLAY.ERROR;
   try {
     answer = mathjs.evaluate(expression);
   } catch (err) {
     answer = DISPLAY.ERROR;
   }
   return answer;
 };
 ```
### Validate Syntax
A simple parsing engine checks the parenthesis on user input. The parser takes the user input and returns an error if the input is invalid.

 ```js
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
 ...
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
 ```

## Installing the App on the Target Device
Go to the app folder and execute the following commands:

###Package the enact source code.
`enact pack` A dist folder will be created.

###Package the app to create an IPK.
`ares-package dist`
An IPK named com.reference.app.calculator_1.0.2_all.ipk is created.

###Install the IPK
`ares-install --device <TARGET_DEVICE> com.reference.app.calculator_1.0.2_all.ipk`