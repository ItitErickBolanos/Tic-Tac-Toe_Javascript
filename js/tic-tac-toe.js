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
    var board_copy, winner,
        scores_object = [], minimax_object,
        empty_squares = board.get_empty_squares();

    for (var i = 0; i < empty_squares.length; i++){
        board_copy = board.clone();
        board_copy.move(empty_squares[i][0], empty_squares[i][1], player);
        winner = board_copy.check_win();
        if (winner != null){
            scores_object.push({
                score: SCORES[winner],
                move: empty_squares[i]
            });
        } else {
            next_move = mm_move(board_copy, switch_player(player));
            scores_object.push({
                score: next_move.score,
                move: empty_squares[i]
            });
        }
    }

    if (player == PLAYERX) {
        minimax_object = {
            score: Number.NEGATIVE_INFINITY,
            move: [0, 0]
        };
        for (var i = 0; i < scores_object.length; i++){
            if (scores_object[i].score > minimax_object.score){
                minimax_object = scores_object[i];
            }
        }
    } else {
        minimax_object = {
            score: Number.POSITIVE_INFINITY,
            move: [0, 0]
        };
        for (var i = 0; i < scores_object.length; i++){
            if (scores_object[i].score < minimax_object.score){
                minimax_object = scores_object[i];
            }
        }
    }

    return minimax_object;
}

function move_wrapper(board, player, trials){
    //var a = performance.now();
    var move = mm_move(board, player);
    //var b = performance.now();
    //alert('Execution time: ' + (b - a) + ' ms.');
    return move.move;
}
