var GUI_WIDTH = 400,
    GUI_HEIGHT = GUI_WIDTH,
    BAR_WIDTH = 5;

/*GUI for Tic Tac Toe game.*/
function TTTGUI(size, aiplayer, aifunction, ntrials, reverse = false){
    // Game board
    this.size = size;
    this.bar_spacing = Math.floor(GUI_WIDTH / this.size);
    this.turn = PLAYERX;
    this.reverse = reverse;

    // AI setup
    this.humanplayer = switch_player(aiplayer);
    this.aiplayer = aiplayer;
    this.aifunction = aifunction;
    this.ntrials = ntrials;

    // Set up data structures
    this.setup_frame();

    // Start new game
    this.newgame();
}

TTTGUI.prototype = {
    /*
    Create GUI frame and add handlers.
    */
    setup_frame: function(){
        var that = this;

        this.frame = document.getElementById("canvas").getContext("2d");

        var FPS = 30;
        setInterval(function() {
          that.draw();
        }, 1000/FPS);


        // Set handlers
        $("#canvas").mousedown(function(event){
            that.click([event.clientX - $(this).offset().left, event.pageY - $(this).offset().top]);
        });

        $("#canvas").parent().append("<div class='row'><button id='new_game' class='btn btn-success'>New game</button></div>");

        $("#new_game, #play_again").click(function(){
            if($(this).attr("id") == "play_again") {
              $('#myModal').modal('toggle');
            }
            that.newgame();
        });
    },

    /*
    Start new game.
    */
    newgame: function(){
        this.board = new TTTBoard(this.size, this.reverse);
        this.inprogress = true;
        this.wait = false;
        this.turn = PLAYERX;

        this.frame.clearRect(0, 0, $("#canvas").attr("width"), $("#canvas").attr("height"));
    },

    /*
    Draw an X on the given canvas at the given position.
    */
    drawx: function(pos){
        halfsize = .4 * this.bar_spacing;
        this.frame.beginPath();
        this.frame.moveTo(pos[0] - halfsize, pos[1] - halfsize);
        this.frame.lineTo(pos[0] + halfsize, pos[1] + halfsize);
        this.frame.stroke();
        this.frame.closePath();

        this.frame.beginPath();
        this.frame.moveTo(pos[0] + halfsize, pos[1] - halfsize);
        this.frame.lineTo(pos[0] - halfsize, pos[1] + halfsize);
        this.frame.stroke();
        this.frame.closePath();
    },

    /*
    Draw an O on the given canvas at the given position.
    */
    drawo: function(pos){
        var radius = GUI_WIDTH == 400 ? 50 : 40;
        halfsize = .4 * this.bar_spacing;
        this.frame.beginPath();
        this.frame.arc(pos[0], pos[1], radius, 0, 2*Math.PI);
        this.frame.stroke();
        this.frame.closePath();
    },

    /*
    Updates the tic-tac-toe GUI.
    */
    draw: function(){
        GUI_WIDTH = GUI_HEIGHT = $(document).width() > 800 ? 400 : 300;
        this.bar_spacing = Math.floor(GUI_WIDTH / this.size);

        $("#canvas").attr({
            "width" : GUI_WIDTH,
            "height" : GUI_HEIGHT
        });

        // Draw the '#' symbol

        for (var i = this.bar_spacing; i < GUI_WIDTH - 1; i += this.bar_spacing){

            this.frame.beginPath();
            this.frame.moveTo(i, 0);
            this.frame.lineTo(i, GUI_HEIGHT);
            this.frame.stroke();
            this.frame.closePath();

            this.frame.beginPath();
            this.frame.moveTo(0, i);
            this.frame.lineTo(GUI_WIDTH, i);
            this.frame.stroke();
            this.frame.closePath();
        }

        // Draw the current players' moves
        for (var row = 0; row < this.size; row++) {
            for (var col = 0; col < this.size; col++) {
                symbol = this.board.square(row, col);
                coords = this.get_coords_from_grid(row, col);
                if (symbol == PLAYERX){
                    this.drawx(coords);
                } else {
                  if (symbol == PLAYERO){
                    this.drawo(coords);
                  }
                }
            }
        }

        // Run AI, if necessary
        if (!this.wait){
          this.aimove();
        } else {
          this.wait = false;
        }
    },

    /*
    Make human move.
    */
    click: function(position){
      if (this.inprogress && (this.turn == this.humanplayer)){
          pos = this.get_grid_from_coords(position);
          if (this.board.square(pos[0], pos[1]) == EMPTY){
              this.board.move(pos[0], pos[1], this.humanplayer);
              this.turn = this.aiplayer;
              winner = this.board.check_win();
              if (winner != null){
                  this.game_over(winner);
              }
              this.wait = true;
          }
      }
    },

    /*
    Make AI move.
    */
    aimove: function(){
        if (this.inprogress && (this.turn == this.aiplayer)){
            pos = this.aifunction(this.board, this.aiplayer, this.ntrials);
            if (this.board.square(pos[0], pos[1]) == EMPTY){
                this.board.move(pos[0], pos[1], this.aiplayer);
                this.turn = this.humanplayer;
                winner = this.board.check_win();
                if (winner != null){
                    this.game_over(winner);
                }
            }
        }
    },

    /*
    Game over
    */
    game_over: function(winner){
        // Display winner
        if (winner == DRAW) {
            this.label = "It's a tie!";
        } else {
          if (winner == PLAYERX){
            /*var firstPoint = this.get_coords_from_grid(this.board.playerxmoves[0][0], this.board.playerxmoves[0][1]),
                secondPoint = this.get_coords_from_grid(this.board.playerxmoves[this.board.playerxmoves.length - 1][0], this.board.playerxmoves[this.board.playerxmoves.length - 1][1]);
            */
            this.label = "X Wins!";
          } else {
            if (winner == PLAYERO){
              /*Revisar a los vecinos para encontrar el punto hacia donde se dibujará la linea
              var firstPoint = this.get_coords_from_grid(this.board.playerymoves[0][0], this.board.playerymoves[0][1]),
                  secondPoint = this.get_coords_from_grid(this.board.playerymoves[this.board.playerymoves.length - 1][0], this.board.playerymoves[this.board.playerymoves.length - 1][1]);
              this.frame.beginPath();
              this.frame.moveTo(firstPoint[0], firstPoint[1]);
              this.frame.lineTo(secondPoint[0], secondPoint[1]);
              this.frame.stroke();
              this.frame.closePath();*/
              this.label = "O Wins!";
            }
          }
        }

        // Game is no longer in progress
        $("#label").html(this.label);
        $('#myModal').modal('toggle');
        this.inprogress = false;
    },

    get_coords_from_grid: function(row, col){
        /*
        Given a grid position in the form (row, col), returns
        the coordinates on the canvas of the center of the grid.
        */
        // X coordinate = (bar spacing) * (col + 1/2)
        // Y coordinate = height - (bar spacing) * (row + 1/2)
        return [this.bar_spacing * (col + 1/2), this.bar_spacing * (row + 1/2)]; // x, y
    },

    /*
    Given coordinates on a canvas, gets the indices of
    the grid.
    */
    get_grid_from_coords: function(position){
        coord = position;
        return [Math.floor(coord[1] / this.bar_spacing), Math.floor(coord[0] / this.bar_spacing)];
    }

}
