# Reversi_minimax_alpha_beta
Goal is to build an agent to play against the user in a Reversi game

# overview of Reversi game
Reversi is a two-player board game
One is the user(black) and other is the bot(white)
It contains 64 pieces.
 Board – board with 8 rows and 8 column
The game begins with four markers placed in a square in the middle of the grid, two bot sided facing up, two user sided up. The  user makes the first move.
A player can place a piece in a grid on the board, only if there is at least one straight line (horizontal, vertical, or diagonal) without spaces between his desired position, and another piece of his color, and it must have one or more pieces from the opponent between them.
Once a player makes a valid move, all the opponent's pieces laid on a straight line (horizontal, vertical or diagonal), along with the new piece and between the new piece, as well as any anchoring piece from the player who moved become all reversed. From that moment on, these pieces have their color changed into this player's color
The game ends when neither player can move. This occurs when the grid has filled up, or when all pieces have the same color facing up.
The player with the most pieces on the board at the end of the game wins.
If both players have the same amount of pieces, the game ends in a tie.

# Minimax Algorithm
It is a decision-making algorithm used in game theory. 
It considers two players min and max, and min always picks up a minimum value score from game and max always picks up maximum value score.
The value for each game move is decided based on some heuristics.

# Alpha-Beta Pruning
Alpha-beta pruning is a modified version of the minimax algorithm. It is an optimization technique for the minimax algorithm.
This involves two parameter Alpha and Beta for expansion, so it is called alpha-beta pruning.
The two-parameter can be defined as:
α = the value of the best (i.e.highest-value) choice we have found so far at any choice point along the path for MAX. The initial value of alpha is -∞.
β = the value of the best (i.e.,lowest-value) choice we have found so far at any choice point along the path for MIN. The initial value of beta is +∞.

# Instructions to run the project
To run the game, the INDEX HTML document file needs to be executed
The game will be displayed in the browser.
Then the turn-1 of the game will be played by the user .In the next turn bot will make a move
The player with the most pieces on the board at the end of the game wins.
You can reset the game with RESTART option
You can also change the setting using SETTINGS option to change the color of user and AI level








