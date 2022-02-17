describe("Tic Tac Toe Engine AI", function() {
  var engine = require('../index');

 // determineTurn
 it("should return player turn",
    function() {
     let board = ['O', '', '', '', '', '', '', '', 'X']
     expect(engine.determineTurn(board)).toEqual('X');

   });
 it("should return player turn",
    function() {
     let board = ['O', 'X', '', '', '', '', '', '', 'X']
     expect(engine.determineTurn(board)).toEqual('O');

   });
 it("should return player turn",
    function() {
     let board = ['O', '', 'X', '', '', 'O', '', '', 'X']
     expect(engine.determineTurn(board)).toEqual('X');

   });

 // computePossibleMoves
 it("should return possible moves from position",
    function() {
     let board = ['O', '', '', '', '', '', '', '', 'X'];

     let possibleMoves = [
       ['O', 'X', '', '', '', '', '', '', 'X'],
       ['O', '', 'X', '', '', '', '', '', 'X'],
       ['O', '', '', 'X', '', '', '', '', 'X'],
       ['O', '', '', '', 'X', '', '', '', 'X'],
       ['O', '', '', '', '', 'X', '', '', 'X'],
       ['O', '', '', '', '', '', 'X', '', 'X'],
       ['O', '', '', '', '', '', '', 'X', 'X'],
     ]
     expect(engine.computePossibleMoves(board)).toEqual(possibleMoves);
   });

 it("should return possible moves from position",
    function() {
     let board = ['O', '', 'X', '', '', '', '', '', 'X'];

     let possibleMoves = [
       ['O', 'O', 'X', '', '', '', '', '', 'X'],
       ['O', '', 'X', 'O', '', '', '', '', 'X'],
       ['O', '', 'X', '', 'O', '', '', '', 'X'],
       ['O', '', 'X', '', '', 'O', '', '', 'X'],
       ['O', '', 'X', '', '', '', 'O', '', 'X'],
       ['O', '', 'X', '', '', '', '', 'O', 'X'],
     ]
     expect(engine.computePossibleMoves(board)).toEqual(possibleMoves);
   });

 // determineWinner
 it("should return the vertical winner of the passed in game state",
    function() {
     let board = ['O', 'O', 'X', '', '', 'X', '', '', 'X'];

     expect(engine.determineWinner(board)).toEqual('X');
   });

 it("should return the horizontal winner of the passed in game state",
    function() {
     let board = ['X', 'O', 'X', 'O', 'O', 'O', 'X', 'X', ''];

     expect(engine.determineWinner(board)).toEqual('O');
   });

 it("should return the cross from left winner of the passed in game state",
    function() {
     let board = ['O', 'O', 'X', '', 'O', 'X', 'X', 'X', 'O'];

     expect(engine.determineWinner(board)).toEqual('O');
   });

 it("should return the cross from right winner of the passed in game state",
    function() {
     let board = ['O', 'O', 'X', '', 'X', 'O', 'X', 'X', 'O'];

     expect(engine.determineWinner(board)).toEqual('X');
   });

 // computeMove
 it("should return the next best move",
    function() {
     let board = ['O', 'O', 'X', '', '', 'X', '', '', 'X'];

     expect(engine.computeMove(board)).toEqual({
       winner: 'X',
       depth: 0,
       nextBestGameState: ['O', 'O', 'X', '', '', 'X', '', '', 'X']});
   });

 it("should return the next best move",
    function() {
     let board = ['', 'O', 'X', '', 'O', 'X', '', '', 'X'];

     expect(engine.computeMove(board)).toEqual({
       winner: 'X',
       depth: 0,
       nextBestGameState: ['', 'O', 'X', '', 'O', 'X', '', '', 'X']});
   });

 it("should return the next best move",
    function() {
     let board = ['O', 'O', 'X', '', 'O', 'X', 'X', 'X', 'O'];

     expect(engine.computeMove(board)).toEqual({
       winner: 'O',
       depth: 0,
       nextBestGameState: ['O', 'O', 'X', '', 'O', 'X', 'X', 'X', 'O']});
   });

 it("should return the next best move",
    function() {
     let board = ['X', 'O', '', '', 'X', '', 'O', 'O', 'X'];

     expect(engine.computeMove(board)).toEqual({
       winner: 'X',
       depth: 0,
       nextBestGameState: ['X', 'O', '', '', 'X', '', 'O', 'O', 'X']});
   });

 it("should return the next best move",
    function() {
     let board = ['X', '', '', '', 'X', 'X', 'O', 'O', 'O'];

     expect(engine.computeMove(board)).toEqual({
       winner: 'O',
       depth: 0,
       nextBestGameState: ['X', '', '', '', 'X', 'X', 'O', 'O', 'O']});
   });

 it("should return the next best move",
    function() {
     let board = ['X', '', '', '', 'X', 'X', 'O', '', 'O'];

     expect(engine.computeMove(board)).toEqual({
       winner: 'O',
       depth: 1,
       nextBestGameState: ['X', '', '', '', 'X', 'X', 'O', 'O', 'O']});
   });

  it("should return the next best move",
     function() {
      let board = [ 'X', '', 'X', '', 'O', '', 'X', '', 'O' ];

      expect(engine.computeMove(board)).toEqual({
        winner: 'X',
        depth: 2,
        nextBestGameState: ['X', 'O', 'X', '', 'O', '', 'X', '', 'O']});
    });

  it("should return the next best move",
     function() {
      let board = [ 'X', '', 'X', '', 'O', '', 'X', '', 'O' ];

      expect(engine.computeMove(board)).toEqual({
        winner: 'X',
        depth: 2,
        nextBestGameState: ['X', 'O', 'X', '', 'O', '', 'X', '', 'O']});
    });

  it("should return the next best move",
     function() {
      let board = ['X', '', '', 'O', 'X', '', 'X', 'O', ''];

      expect(engine.computeMove(board)).toEqual({
        winner: 'X',
        depth: 2,
        nextBestGameState: ['X', 'O', '', 'O', 'X', '', 'X', 'O', '']});
    });

  it("should return the next best move",
     function() {
      let board = ['', '', 'X', '', 'O', '', 'X', '', 'O'];

      expect(engine.computeMove(board)).toEqual({
        winner: 'X',
        depth: 3,
        nextBestGameState: ['X', '', 'X', '', 'O', '', 'X', '', 'O']});
    });

  it("should return the next best move",
     function() {
      let board = ['X', '', '', 'O', '', '', 'X', 'O', ''];

      expect(engine.computeMove(board)).toEqual({
        winner: 'X',
        depth: 3,
        nextBestGameState: ['X', '', 'X', 'O', '', '', 'X', 'O', '']});
    });

  it("should return the next best move",
     function() {
      let board = ['X', 'X', '', 'O', '', '', 'X', 'O', ''];

      expect(engine.computeMove(board)).toEqual({
        winner: '',
        depth: 4,
        nextBestGameState: ['X', 'X', 'O', 'O', '', '', 'X', 'O', '']});
    });

  it("should return the next best move",
     function() {
      let board = ['X', '', '', '', '', '', 'X', 'O', ''];

      expect(engine.computeMove(board)).toEqual({
        winner: 'X',
        depth: 4,
        nextBestGameState: ['X', '', '', 'O', '', '', 'X', 'O', '']});
    });

  it("should return the next best move",
     function() {
      let board = ['', '', '', '', '', '', 'X', 'O', ''];

      expect(engine.computeMove(board)).toEqual({
        winner: 'X',
        depth: 5,
        nextBestGameState: ['X', '', '', '', '', '', 'X', 'O', '']});
    });

  it("should return the next best move",
     function() {;
      let board = ['X', 'O', '', '', '', '', '', '', ''];

      expect(engine.computeMove(board)).toEqual({
        winner: 'X',
        depth: 5,
        nextBestGameState: ['X', 'O', '', 'X', '', '', '', '', '']});
    });

  it("should return the next best move",
     function() {;
      let board = ['', '', '', '', '', '', '', '', ''];

      expect(engine.computeMove(board)).toEqual({
        winner: '',
        depth: 9,
        nextBestGameState: ['X', '', '', '', '', '', '', '', '']});
    });
});
