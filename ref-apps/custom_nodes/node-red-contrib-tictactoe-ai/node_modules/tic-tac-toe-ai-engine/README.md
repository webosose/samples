[![Build Status](https://travis-ci.org/SysCoder/tic-tac-toe-ai-engine.svg?branch=master)](https://travis-ci.org/SysCoder/tic-tac-toe-ai-engine)
[![Build Status](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/SysCoder/tic-tac-toe-ai-engine/blob/master/LICENSE)

# tic-tac-toe-ai-engine
Stateless Tic Tac Toe engine. Given a position the engine will give next best
move, winner given perfect play, and the number of moves left with perfect play.

# Test in browser
[Tic Tac Toe AI Engine in Runkit](https://runkit.com/npm/tic-tac-toe-ai-engine)

# Example:
```js
var ticTacToeAiEngine = require("tic-tac-toe-ai-engine");

var gameState = ['X', '', '', 'O', '', '', 'X', 'O', ''];
console.log(ticTacToeAiEngine.computeMove(gameState));

/*
Output:
  { winner: 'X',
    depth: 3,
    nextBestGameState: [ 'X', '', 'X', 'O', '', '', 'X', 'O', '' ] }
*/
```
