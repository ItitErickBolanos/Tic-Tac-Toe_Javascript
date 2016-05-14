var EMPTY = 1,
    PLAYERX = 2,
    PLAYERO = 3,
    DRAW = 4,
    STRMAP;

// Map player constants to letters for printing
STRMAP = {EMPTY: " ",
          PLAYERX: "X",
          PLAYERO: "O"}

//Logical represantation of the TicTacToe board
function TTTBoard(dim, reverse = false, board = null){

    this.dim = dim;
    this.reverse = reverse;
    this.playerxmoves = [];
    this.playerymoves = [];

    var arr = [];

    for (var i = 0; i < dim; i++){
        arr[i] = [];
    }

    if (board == null){
        // Create empty board
        for (var i = 0; i < arr.length; i++) {
            for(var j = 0; j < dim; j++) {
                arr[i][j] = EMPTY;
            }
        }

        this.board = arr;
        //self._board = [[EMPTY for dummycol in range(dim)]
        //               for dummyrow in range(dim)]
    } else {
        //Copy board grid
        for (var i = 0; i < arr.length; i++) {
            for(var j = 0; j < dim; j++) {
                arr[i][j] = board[i][j];
            }
        }

        this.board = arr;
    }
}

TTTBoard.prototype = {
    //Return the dimension of the board.
    get_dim: function(){
        return this.dim;
    },

    /*Returns one of the three constants EMPTY, PLAYERX, or PLAYERO
    that correspond to the contents of the board at position (row, col).*/
    square: function(row, col){
        return this.board[row][col];
    },

    //Return a list of (row, col) tuples for all empty squares
    get_empty_squares: function(){
        empty = [];
        for (var row = 0; row < this.dim; row++){
            for (var col = 0; col < this.dim; col++){
                if (this.board[row][col] == EMPTY) {
                    empty.push([row, col]);
                }
            }
        }
        return empty;
    },

    /*Place player on the board at position (row, col).
    player should be either the constant PLAYERX or PLAYERO.
    Does nothing if board square is not empty.*/
    move: function(row, col, player){
        if (this.board[row][col] == EMPTY) {
            this.board[row][col] = player;
        }
    },

    /*  Returns a constant associated with the state of the game
        If PLAYERX wins, returns PLAYERX.
        If PLAYERO wins, returns PLAYERO.
        If game is drawn, returns DRAW.
        If game is in progress, returns None.*/
    check_win: function(){
        var board = this.board,
            dim = this.dim,
            //dimrng = range(dim)
            lines = [];

        // rows
        for(var i = 0; i < board.length; i++){
            lines.push(board[i]);
        }

        // cols
        var cols = [];

        for(var i = 0; i < dim; i++){
            cols[i] = [];
            for(var j = 0; j < dim; j++){
                cols[i][j] = board[j][i];
            }
        }

        for (var i = 0; i < cols.length; i++){
            lines.push(cols[i]);
        }

        // diags
        var diag1 = [];

        for(var i = 0; i < dim; i++){
            diag1.push(board[i][i]);
        }

        lines.push(diag1);

        var diag2 = [];

        for(var i = 0; i < dim; i++){
            diag2.push(board[i][dim - i - 1]);
        }

        lines.push(diag2);

        // check all lines
        for (var i = 0; i < lines.length; i++) {
            var setLine = new Set(lines[i]);
            if (setLine.size == 1 && lines[i][0] != EMPTY){
                if (this.reverse){
                    return switch_player(lines[i][0]);
                    console.log(lines[i]);
                } else {
                    return lines[i][0];
                    console.log(lines[i]);
                }
            }
        }

        // no winner, check for draw
        if (this.get_empty_squares().length == 0) {
            return DRAW;
        }

        // game is still in progress
        return null;
    },

    /*
    Return a copy of the board.
    */
    clone: function(){
        return new TTTBoard(this.dim, this.reverse, this.board);
    }
};

/*
Convenience function to switch players.

Returns other player.
*/
function switch_player(player){
    if (player == PLAYERX) {
        return PLAYERO;
    } else {
        return PLAYERX;
    }
}

/*
Function to play a game with two MC players.
*/
function play_game(mc_move_function, ntrials, reverse = False){
    // Setup game
    board = new TTTBoard(3, reverse);
    curplayer = PLAYERX;
    winner = null;

    // Run game
    while (winner == null){
        // Move
        row, col = mc_move_function(board, curplayer, ntrials)
        board.move(row, col, curplayer)

        // Update state
        winner = board.check_win()
        curplayer = switch_player(curplayer)

        // Display board
        console.log(board);
    }

    // Print winner
    if (winner == PLAYERX) {
        console.log("X wins!");
    } else {
        if (winner == PLAYERO) {
            console.log("O wins!");
        } else {
            if (winner == DRAW) {
                console.log("Tie!");
            } else {
                console.log("Error: unknown winner");
            }
        }
    }
}
