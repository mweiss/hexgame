
/**
 * Class encapsulating the state of the hex board.
 * @class hexboard
 * @constructor
 */
var HexBoard = Y.Base.create("hexboard", Y.Base, [], {
   initializer: function() {
     this._cellsToPieces = this._initCellsToPieces();
   },
   
   _initCellsToPieces: function() {
     var c2P = {};
     var cells = this.get('cells');
     
     var x, y, i;
     for (i = 0; cells && i < cells.length; i += 2) {
       x = cells[i];
       y = cells[i + 1];
       c2P[this._getKey(x, y)] = HexBoard.EMPTY_PIECE; 
     }
     return c2P;
   },

   _getKey: function(x, y) {
     return x + "," + y;
   },
   
   destructor : function() {
   }
},{
  /**
   * Placeholder element for an empty piece in the _cellsToPieces map.
   */
  EMPTY_PIECE: "emptyPiece",
  
  ATTRS: {
    /**
     * An array of even length representing valid cell locations, where cell[i] = x coord and cell[i + 1] = y coord
     * where i is an even number.
     */
    cells : {
      writeOnce : true
    },
    
    /**
     * An array of even length representing valid starting points for players.  This array follows the same rules
     * as the cells array.
     */
    startingPoints : {
      writeOnce : true
    }
  }
});

Y.HexBoard = HexBoard;