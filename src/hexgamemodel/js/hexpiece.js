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
  },
   
  /**
   * Returns a new hex piece that been rotated by nAngleInRadians.  Coordinates are rounded to the
   * nearest whole number.  It is assumed that nAngleInRadians is a multiple oRf Math.PI / 3.
   */
  rotate : function(nAngleInRadians) {
    
    var rotatedCoords = [], cartesianCoords = this._getCartesianCoords();
    var i, cartesianCoord, rotatedCartesianCoord;
    
    for (i = 0; i < cartesianCoords.length; i += 1) {
      cartesianCoord = cartesianCoords[i];
      rotatedCartesianCoord = [
        Math.cos(nAngleInRadians) * cartesianCoord[0] - Math.sin(nAngleInRadians) * cartesianCoord[1],
        Math.sin(nAngleInRadians) * cartesianCoord[0] + Math.cos(nAngleInRadians) * cartesianCoord[1]
      ];
      rotatedCoords.push(Y.HexDrawUtils.convertCartesianCoordiantesToHexGrid(rotatedCartesianCoord));
    }
    return new HexPiece({cells: rotatedCoords, player : this.get('player')});
  },
  
  _getCartesianCoords : function() {
    var oldCoords = this.get('cells'), cartesianCoords = [], i;
    for (i = 0; i < oldCoords.length; i += 1) {
      cartesianCoords.push(Y.HexDrawUtils.convertHexGridCoordinatesToCartesian(oldCoords[i]));
    }
    return cartesianCoords;
  },
  
  /**
   * Returns a new hex piece whose cell coordinates have been translated so that they are non-negative.
   */
  translateToPositiveCoords : function() {
    var translatedCoords = [], cartesianCoords = this._getCartesianCoords(), i, cartesianCoord, translatedCoord;
    // Find the min x and max y
    var minX, maxY;
    for (i = 0; i < cartesianCoords.length; i += 1) {
      cartesianCoord = cartesianCoords[i];
      minX = minX === undefined ? cartesianCoord[0] : Math.min(cartesianCoord[0], minX);
      maxY = maxY === undefined ? cartesianCoord[1] : Math.max(cartesianCoord[1], maxY);
    }
    
    var tX = 0, tY = 0;
    if (minX < 0 && maxY <= 0) {
      tX = Math.ceil(minX / Y.HexDrawUtils.HEX_X_INCREMENT) * Y.HexDrawUtils.HEX_X_INCREMENT;
    }
    else if (maxY > 0 && minX >= 0) {
      tY = Math.ceil(maxY / (2 * Y.HexDrawUtils.HEX_Y_INCREMENT)) * (2 * Y.HexDrawUtils.HEX_Y_INCREMENT);
    }
    else if (minX < 0 && maxY > 0) {
      var xAsInt = Math.ceil(minX / Y.HexDrawUtils.HALF_HEX_X_INCREMENT);
      var yAsInt = Math.ceil(maxY / Y.HexDrawUtils.HEX_Y_INCREMENT);
      if (yAsInt % 2 !== xAsInt % 2) {
        yAsInt += 1;
      }
      tX = xAsInt * Y.HexDrawUtils.HALF_HEX_X_INCREMENT;
      tY = yAsInt * Y.HexDrawUtils.HEX_Y_INCREMENT;
    }
    
    for (i = 0; i < cartesianCoords.length; i += 1) {
      cartesianCoord = cartesianCoords[i];
      translatedCoord = [cartesianCoord[0] - tX, cartesianCoord[1] - tY];
      translatedCoords.push(Y.HexDrawUtils.convertCartesianCoordiantesToHexGrid(translatedCoord));
    }
    
    return new HexPiece({cells: translatedCoords, player : this.get('player')});
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