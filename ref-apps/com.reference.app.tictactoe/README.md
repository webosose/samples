Overview :
Note: Before going further, we recommend that you get an overview from https://www..webosose.org/docs/tools/sdk/workflow-designer/workflow-designer-user-guide/.

This app demonstrate the use of the Workflow Designer Toolkit to customize an app to make it context-aware.

This is done by making only minor changes to the app source code.
The major part of embedding artificial intelligence (AI) embedded is handled by the Workflow Designer Toolkit.
The webOS OSE Context Intent Manager service then interacts with the AI engine and the workflow to provide the required functionality.

We use a Tic-Tac-Toe game to demonstrate this functionality.

Tic-Tac-Toe is a two-player game, where one player marks an "X" and the other player marks an "O" in turn. The winner is the player who gets 3 entries in one line (horizontal, vertical, or diagonal).
In this sample project:
We start with a Tic-Tac-Toe game app, which is a manual two-player app.
Through Workflow Designer we add a 3rd party custom node to this app.
This makes player2 an AI Bot (player1 is a manual user).
The BOT reads the state of the game and accordingly makes a move.
Note: This sample app is useful to understand the scenario when you have a 3rd party custom node that provides the required AI functionality. If you want to create your own custom node, refer to Appendix B in the help embedded in the Workflow Designer Toolkit.

refer to developer site for more details.