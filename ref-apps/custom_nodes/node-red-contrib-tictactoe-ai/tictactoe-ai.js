/*
  * Copyright (c) 2021 LG Electronics Inc.
  * SPDX-License-Identifier: LicenseRef-LGE-Proprietary
  */

var ticTacToeAiEngine = require("tic-tac-toe-ai-engine");

module.exports = function (RED) {
    function tictactoeHandler(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        node.on('input', function (msg) {
            let data = JSON.parse(msg.payload.data),
                gameState = data.currentGameState,
                result = ticTacToeAiEngine.computeMove(gameState);
                result.winner = ticTacToeAiEngine.determineWinner(result.nextBestGameState);
                msg.payload = result;
            node.send(msg);
        });
    }
    RED.nodes.registerType("tictactoe-ai", tictactoeHandler);
}