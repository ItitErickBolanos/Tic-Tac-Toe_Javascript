var GUI_WIDTH = 400,
    GUI_HEIGHT = GUI_WIDTH,
    BAR_WIDTH = 5;

/*GUI for Tic Tac Toe game.*/
function TTTGUI(size, aiplayer, aifunction, ntrials, reverse=False){
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

        var FPS = 60;
        setInterval(function() {
          that.draw();
        }, 1000/FPS);


        // Set handlers
        $("#canvas").mousedown(function(event){
          that.click([event.clientX - $(this).offset().left, event.clientY - $(this).offset().top]);
        });

        $("#canvas").parent().append("<div class='row'><button id='new_game' class='btn btn-warning'>New game</button></div>");
        $("#new_game").click(function(){
            that.newgame();
        });
        //this.label = this.frame.add_label("");
    },

    /*
    Start new game.
    */
    newgame: function(){
        this.board = new TTTBoard(this.size, this.reverse);
        this.inprogress = true;
        this.wait = false;
        this.turn = PLAYERX;
    },
        //this.label.set_text("");

    /*
    Draw an X on the given canvas at the given position.
    */
    drawx: function(pos){
        halfsize = .4 * this.bar_spacing;
        this.frame.moveTo(pos[0] - halfsize, pos[1] - halfsize);
        this.frame.lineTo(pos[0] + halfsize, pos[1] + halfsize);
        this.frame.stroke();

        this.frame.moveTo(pos[0] + halfsize, pos[1] - halfsize);
        this.frame.lineTo(pos[0] - halfsize, pos[1] + halfsize);
        this.frame.stroke();
    },

    /*
    Draw an O on the given canvas at the given position.
    */
    drawo: function(pos){
        halfsize = .4 * this.bar_spacing;
        this.frame.beginPath();
        this.frame.arc(pos[0], pos[1], 50, 0, 2*Math.PI);
        this.frame.stroke();
    },
    /*
    Updates the tic-tac-toe GUI.
    */
    draw: function(){
        // Draw the '#' symbol
        for (var i = this.bar_spacing; i < GUI_WIDTH - 1; i += this.bar_spacing){

            this.frame.moveTo(i, 0);
            this.frame.lineTo(i, GUI_HEIGHT);
            this.frame.stroke();

            this.frame.moveTo(0, i);
            this.frame.lineTo(GUI_WIDTH, i);
            this.frame.stroke();
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
      /*x -= canvas.offsetLeft;
      y -= canvas.offsetTop;¨*/
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
            }
            this.turn = this.humanplayer;
            winner = this.board.check_win();
            if (winner != null){
                this.game_over(winner);
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
            this.label = "X Wins!";
          } else {
            if (winner == PLAYERO){
              this.label = "O Wins!";
            }
          }
        }

        // Game is no longer in progress
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
