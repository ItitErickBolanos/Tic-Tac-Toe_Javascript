var GUI_WIDTH = 400,
    GUI_HEIGHT = GUI_WIDTH,
    BAR_WIDTH = 5;

/*GUI for Tic Tac Toe game.*/
function TTTGUI(size, aiplayer, aifunction, ntrials, reverse=False){
    // Game board
    this.size = size;
    this.bar_spacing = GUI_WIDTH; // self._size
    this.turn = PLAYERX;
    this.reverse = reverse;

    // AI setup
    this.humanplayer = switch_player(aiplayer)
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
        $("#canvas").click(function(){
            this.click();
        });
        $("#canvas").parent().append("<button id='new_game' class='btn btn-warning'>New game</button>");
        $("#new_game").click(function(){
            this.newgame();
        });
        //this.label = this.frame.add_label("");
    },

    /*
    Updates the tic-tac-toe GUI.
    */
    draw: function(){
        // Draw the '#' symbol
        for (var i = GUI_WIDTH - 1; i < this.bar_spacing; i += ){
            this.frame.moveTo(i, 0);
            this.frame.lineTo(i, GUI_HEIGHT);
            this.frame.stroke();

            this.frame.moveTo(0, i);
            this.frame.lineTo(GUI_WIDTH, i);
            this.frame.stroke();
        }


        // Draw the current players' moves
        /*for row in range(self._size):
            for col in range(self._size):
                symbol = self._board.square(row, col)
                coords = self.get_coords_from_grid(row, col)
                if symbol == provided.PLAYERX:
                    self.drawx(canvas, coords)
                elif symbol == provided.PLAYERO:
                    self.drawo(canvas, coords)
        */
        // Run AI, if necessary
        /*if not self._wait
            self.aimove()
        else:
            self._wait = False*/
    }
}

/*

    def setup_frame(self):
        """
        Create GUI frame and add handlers.
        """
        self._frame = simplegui.create_frame("Tic-Tac-Toe",
                                             GUI_WIDTH,
                                             GUI_HEIGHT)
        self._frame.set_canvas_background('White')

        # Set handlers
        self._frame.set_draw_handler(self.draw)
        self._frame.set_mouseclick_handler(self.click)
        self._frame.add_button("New Game", self.newgame)
        self._label = self._frame.add_label("")

    def start(self):
        """
        Start the GUI.
        """
        self._frame.start()

    def newgame(self):
        """
        Start new game.
        """
        self._board = provided.TTTBoard(self._size, self._reverse)
        self._inprogress = True
        self._wait = False
        self._turn = provided.PLAYERX
        self._label.set_text("")

    def drawx(self, canvas, pos):
        """
        Draw an X on the given canvas at the given position.
        """
        halfsize = .4 * self._bar_spacing
        canvas.draw_line((pos[0]-halfsize, pos[1]-halfsize),
                         (pos[0]+halfsize, pos[1]+halfsize),
                         BAR_WIDTH, 'Black')
        canvas.draw_line((pos[0]+halfsize, pos[1]-halfsize),
                         (pos[0]-halfsize, pos[1]+halfsize),
                         BAR_WIDTH, 'Black')

    def drawo(self, canvas, pos):
        """
        Draw an O on the given canvas at the given position.
        """
        halfsize = .4 * self._bar_spacing
        canvas.draw_circle(pos, halfsize, BAR_WIDTH, 'Black')

    def draw(self, canvas):
        """
        Updates the tic-tac-toe GUI.
        """
        # Draw the '#' symbol
        for bar_start in range(self._bar_spacing,
                               GUI_WIDTH - 1,
                               self._bar_spacing):
            canvas.draw_line((bar_start, 0),
                             (bar_start, GUI_HEIGHT),
                             BAR_WIDTH,
                             'Black')
            canvas.draw_line((0, bar_start),
                             (GUI_WIDTH, bar_start),
                             BAR_WIDTH,
                             'Black')

        # Draw the current players' moves
        for row in range(self._size):
            for col in range(self._size):
                symbol = self._board.square(row, col)
                coords = self.get_coords_from_grid(row, col)
                if symbol == provided.PLAYERX:
                    self.drawx(canvas, coords)
                elif symbol == provided.PLAYERO:
                    self.drawo(canvas, coords)

        # Run AI, if necessary
        if not self._wait:
            self.aimove()
        else:
            self._wait = False

    def click(self, position):
        """
        Make human move.
        """
        if self._inprogress and (self._turn == self._humanplayer):
            row, col = self.get_grid_from_coords(position)
            if self._board.square(row, col) == provided.EMPTY:
                self._board.move(row, col, self._humanplayer)
                self._turn = self._aiplayer
                winner = self._board.check_win()
                if winner is not None:
                    self.game_over(winner)
                self._wait = True

    def aimove(self):
        """
        Make AI move.
        """
        if self._inprogress and (self._turn == self._aiplayer):
            row, col = self._aifunction(self._board,
                                        self._aiplayer,
                                        self._ntrials)
            if self._board.square(row, col) == provided.EMPTY:
                self._board.move(row, col, self._aiplayer)
            self._turn = self._humanplayer
            winner = self._board.check_win()
            if winner is not None:
                self.game_over(winner)

    def game_over(self, winner):
        """
        Game over
        """
        # Display winner
        if winner == provided.DRAW:
            self._label.set_text("It's a tie!")
        elif winner == provided.PLAYERX:
            self._label.set_text("X Wins!")
        elif winner == provided.PLAYERO:
            self._label.set_text("O Wins!")

        # Game is no longer in progress
        self._inprogress = False

    def get_coords_from_grid(self, row, col):
        """
        Given a grid position in the form (row, col), returns
        the coordinates on the canvas of the center of the grid.
        """
        # X coordinate = (bar spacing) * (col + 1/2)
        # Y coordinate = height - (bar spacing) * (row + 1/2)
        return (self._bar_spacing * (col + 1.0/2.0), # x
                self._bar_spacing * (row + 1.0/2.0)) # y

    def get_grid_from_coords(self, position):
        """
        Given coordinates on a canvas, gets the indices of
        the grid.
        """
        posx, posy = position
        return (posy // self._bar_spacing, # row
                posx // self._bar_spacing) # col
*/
