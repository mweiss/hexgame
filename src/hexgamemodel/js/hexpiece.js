/**
 * Class encapsulating the state of a hex board player.
 * @class hexboard
 * @constructor
 */

/**
 * An array of arrays representing initial piece coordinates.
 */
var INITIAL_PIECES = [
  [[0, 0]],
  [[0, 0], [0, 1]],
  [[0, 0], [0, 2], [0, 4]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [0, 1], [0, 3]],
  [[0, 0], [0, 1], [0, 3], [1, 0]],
  [[0, 0], [0, 2], [0, 3], [0, 5]],
  [[0, 0], [0, 1], [0, 3], [0, 4]],
  [[0, 0], [0, 2], [0, 4], [0, 6]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [0, 2], [0, 4], [0, 5], [0, 7]],
  [[0, 0], [0, 2], [0, 3], [0, 4], [1, 2]],
  [[0, 0], [0, 2], [0, 3], [1, 4], [1, 6]],
  [[0, 0], [0, 2], [0, 3], [0, 5], [1, 2]],
  [[0, 0], [0, 1], [0, 3], [0, 5], [1, 0]],
  [[0, 0], [0, 2], [0, 4], [0, 6], [0, 8]],
  [[0, 0], [0, 2], [0, 4], [0, 5], [1, 6]],
  [[0, 0], [0, 2], [0, 3], [0, 5], [1, 6]]
];

var HexPiece = Y.Base.create("hexpiece", Y.Base, [], {
   initializer: function() {
   },
   
   destructor : function() {
   }
},{
  /**
   * Static helper method for creating the initial pieces.
   */
  createInitialPieces : function(player, totalNumPlayers) {
    var i;
    var pieces = [];
    for (i = 0; i < INITIAL_PIECES.length; i += 1) {
      pieces.push(new HexPiece({
        cells : INITIAL_PIECES[i],
        player : player
      }));
    }
    return pieces;
  },
  
  ATTRS: {
    cells : {},
    player : {}
  }
});

Y.HexPiece = HexPiece;