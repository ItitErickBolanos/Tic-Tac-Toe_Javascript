var app = angular.module("TicTacToe", []);

app.controller("TTTController", ['$scope', function($scope){
    var ticTacGUI = new TTTGUI(3, PLAYERO, move_wrapper, 1, false);
    var board = new TTTBoard(3);
}]);

function move_wrapper(){
    return null;
}
