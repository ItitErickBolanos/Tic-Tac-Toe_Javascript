//Default scores if the selected player is X
var SCORES = {
              2: 1,
              3: -1,
              4: 0
          };


var app = angular.module("TicTacToe", []);

app.controller("TTTController", ['$scope', function($scope){

    $("#choosePlayer").modal("toggle");

    $("#choose_x, #choose_o").click(function(){
        $("#choosePlayer").modal("toggle");
        var selectedPlayer = $(this).attr("playervalue"),
            ticTacGUI = new TTTGUI(3, parseInt(selectedPlayer), move_wrapper, 1, false),
            board = new TTTBoard(3);
    });

}]);

function mm_move(board, player){
    var scores = [[], []], moves = [], board_copy, winner,
        empty_squares = board.get_empty_squares();
    //console.log(board.get_empty_squares());
    for (var i = 0; i < empty_squares.length; i++){
        board_copy = board.clone();
        board_copy.move(empty_squares[i][0], empty_squares[i][1], player);
        winner = board_copy.check_win();
        if (winner != null){
            scores[0].push(SCORES[winner]);
            scores[1].push(empty_squares[i]);
        } else {
            next_move = mm_move(board_copy, switch_player(player));
            scores[0].push(next_move[0]);
            scores[1].push(empty_squares[i]);
        }
    }

    if (player == PLAYERX) {
        minimax = [Math.max(...scores[0]), scores[1][scores[0].indexOf(Math.max(...scores[0]))]];
    } else {
        minimax = [Math.min(...scores[0]), scores[1][scores[0].indexOf(Math.min(...scores[0]))]];
    }

    return minimax;
    //return [2, [0, 1]];
}

function move_wrapper(board, player, trials){
    var move = mm_move(board, player);
    return move[1];
}
