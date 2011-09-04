
/**
 * The model for the hex game.  The model includes the state for the players and the board.
 * @module hexgamemodel
 */
var Lang = Y.Lang;

/**
 * Constant map of number of players to the type of board to use.
 */
var PLAYERS_TO_BOARD = {
  "6" : {
    cells : [0,21,1,15,1,17,1,18,1,19,1,20,1,21,1,22,1,23,1,24,1,25,1,27,2,9,2,11,2,12,2,13,2,14,2,15,2,16,2,17,2,18,2,19,2,20,2,21,2,22,2,23,2,24,2,25,2,26,2,27,2,28,2,29,2,30,2,31,2,33,3,3,3,5,3,6,3,7,3,8,3,9,3,10,3,11,3,12,3,13,3,14,3,15,3,16,3,17,3,18,3,19,3,20,3,21,3,22,3,23,3,24,3,25,3,26,3,27,3,28,3,29,3,30,3,31,3,32,3,33,3,34,3,35,3,36,3,37,3,39,4,0,4,1,4,2,4,3,4,4,4,5,4,6,4,7,4,8,4,9,4,10,4,11,4,12,4,13,4,14,4,15,4,16,4,17,4,18,4,19,4,20,4,21,4,22,4,23,4,24,4,25,4,26,4,27,4,28,4,29,4,30,4,31,4,32,4,33,4,34,4,35,4,36,4,37,4,38,4,39,4,40,4,41,4,42,5,0,5,1,5,2,5,3,5,4,5,5,5,6,5,7,5,8,5,9,5,10,5,11,5,12,5,13,5,14,5,15,5,16,5,17,5,18,5,19,5,20,5,21,5,22,5,23,5,24,5,25,5,26,5,27,5,28,5,29,5,30,5,31,5,32,5,33,5,34,5,35,5,36,5,37,5,38,5,39,5,40,5,41,5,42,6,0,6,1,6,2,6,3,6,4,6,5,6,6,6,7,6,8,6,9,6,10,6,11,6,12,6,13,6,14,6,15,6,16,6,17,6,18,6,19,6,20,6,21,6,22,6,23,6,24,6,25,6,26,6,27,6,28,6,29,6,30,6,31,6,32,6,33,6,34,6,35,6,36,6,37,6,38,6,39,6,40,6,41,6,42,7,0,7,1,7,2,7,3,7,4,7,5,7,6,7,7,7,8,7,9,7,10,7,11,7,12,7,13,7,14,7,15,7,16,7,17,7,18,7,19,7,20,7,21,7,22,7,23,7,24,7,25,7,26,7,27,7,28,7,29,7,30,7,31,7,32,7,33,7,34,7,35,7,36,7,37,7,38,7,39,7,40,7,41,7,42,8,0,8,1,8,2,8,3,8,4,8,5,8,6,8,7,8,8,8,9,8,10,8,11,8,12,8,13,8,14,8,15,8,16,8,17,8,18,8,19,8,20,8,21,8,22,8,23,8,24,8,25,8,26,8,27,8,28,8,29,8,30,8,31,8,32,8,33,8,34,8,35,8,36,8,37,8,38,8,39,8,40,8,41,8,42,9,0,9,1,9,2,9,3,9,4,9,5,9,6,9,7,9,8,9,9,9,10,9,11,9,12,9,13,9,14,9,15,9,16,9,17,9,18,9,19,9,20,9,21,9,22,9,23,9,24,9,25,9,26,9,27,9,28,9,29,9,30,9,31,9,32,9,33,9,34,9,35,9,36,9,37,9,38,9,39,9,40,9,41,9,42,10,0,10,1,10,2,10,3,10,4,10,5,10,6,10,7,10,8,10,9,10,10,10,11,10,12,10,13,10,14,10,15,10,16,10,17,10,18,10,19,10,20,10,21,10,22,10,23,10,24,10,25,10,26,10,27,10,28,10,29,10,30,10,31,10,32,10,33,10,34,10,35,10,36,10,37,10,38,10,39,10,40,10,41,10,42,11,0,11,2,11,3,11,4,11,5,11,6,11,7,11,8,11,9,11,10,11,11,11,12,11,13,11,14,11,15,11,16,11,17,11,18,11,19,11,20,11,21,11,22,11,23,11,24,11,25,11,26,11,27,11,28,11,29,11,30,11,31,11,32,11,33,11,34,11,35,11,36,11,37,11,38,11,39,11,40,11,42,12,6,12,8,12,9,12,10,12,11,12,12,12,13,12,14,12,15,12,16,12,17,12,18,12,19,12,20,12,21,12,22,12,23,12,24,12,25,12,26,12,27,12,28,12,29,12,30,12,31,12,32,12,33,12,34,12,36,13,12,13,14,13,15,13,16,13,17,13,18,13,19,13,20,13,21,13,22,13,23,13,24,13,25,13,26,13,27,13,28,13,30,14,18,14,20,14,21,14,22,14,24],
    startingPoints : [0,21,4,0,4,42,11,0,11,42,14,21]
  }
};

/**
 * Class encapsulating the state of the hex model.
 * @class hexgamemodel
 * @constructor
 */
var HexGameModel = Y.Base.create("hexgame", Y.Base, [], {
   initializer: function() {
     this._initBoard();
     this._initPlayers();
   },

   _initBoard: function() {
     this.set("board", new Y.HexBoard(PLAYERS_TO_BOARD[this.get('players').length]));
   },
   
   _initPlayers: function() {
     var players = this.get('players');
     var colorsUsed = {};
     var idsUsed = {};
     
     // Determine which colors have already been assigned.
     Y.each(players, function(player) {
       if (Lang.isNumber(player.color)) {
         colorsUsed[player.color] = true;
       }
       if (Lang.isString(player.id)) {
         idsUsed[player.id] = true;
       }
     });
     
     // Helper method to choose a unique color.
     var chooseUniqueColor = function() {
       var color;
       do {
         color = HexGameModel.VALID_COLORS[Math.floor(HexGameModel.VALID_COLORS.length * Math.random())];
       } while (colorsUsed[color]);
       colorsUsed[color] = true;
       return color;
     };
     
     // Helper method to choose a unique id.
     var chooseUniqueId = function() {
       var id;
       do {
         id = Y.guid();
       } while (idsUsed[id]);
       idsUsed[id] = true;
       return id;
     };
     
     var aPlayers = [];
     
     // Assign colors and ids to players that haven't been assigned, then instantiate the player
     Y.Array.each(players, function(player) {
       if (!Lang.isNumber(player.color)) {
         player.color = chooseUniqueColor();
       }
       if (!Lang.isString(player.id)) {
         player.id = chooseUniqueId();
       }
       
       var oPlayer = new Y.HexPlayer(player);

       if (!player.pieces) {
         oPlayer.set("pieces", Y.HexPiece.createInitialPieces(players.length));
       }
       aPlayers.push(oPlayer);
     });
     
     this.set("players", aPlayers);
   },
   
   destructor : function() {
   },
   
   _validatePlayers : function(value) {
     var i;
     if (!value || !PLAYERS_TO_BOARD[value.length]) {
       return false;
     }
     return true;
   }
},{
  VALID_COLORS : ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  
  ATTRS: {
    /**
     * An array of player configs.  Each config object can have the following properties:
     * {
     *   type : [computer|localuser|remoteuser] The type of player,
     *   id : a string unique to this game instance to identify this user.  If not specified, a unique key will be generated.
     *   color : the color associated with this user.  If not specified, a unique color will be assigned.
     * }
     */
    players : {
      validator : "_validatePlayers"
    },
    
    /**
     * The hex board, which is an instance of Y.HexBoard.
     */
    board : {
      readOnly: true
    }
  }
});

Y.HexGameModel = HexGameModel;