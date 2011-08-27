
/**
 * The hexagon buffer where HEX_BUFFER is 1/2 the distance between the hexgaon's bounding box size minus vertical
 * length of the hexagon.
 */
var HEX_BUFFER = ((1 - Math.sin(Math.PI / 3)) / 2);

/**
 * An array of coordinates representing a regular hexagon.
 */
var REGULAR_HEX_PATH = [
  0, Math.sin(Math.PI / 3) / 2 + HEX_BUFFER,
  0.25, HEX_BUFFER,
  0.75, HEX_BUFFER,
  1, Math.sin(Math.PI / 3) / 2 + HEX_BUFFER,
  0.75, Math.sin(Math.PI / 3) + HEX_BUFFER,
  0.25, Math.sin(Math.PI / 3) + HEX_BUFFER
];

var HexDrawUtils = function() {};
  
HexDrawUtils.prototype = {
  /**
   * Helper method which draws a closed shape onto oBoard, where
   * shape is represented by an array of points aPath.  Returns the
   * path it created.
   */
  createShape : function(oCanvas, aPath) {
    var i;
    var pathString;
    for (i = 0; i < aPath.length; i += 2) {
      var x = aPath[i];
      var y = aPath[i + 1];
      if (i === 0) {
        pathString = "M " + x + " " + y;
      }
      pathString += " L " + x + " " + y;
    }
    
    pathString += " z";
    
    var path = oCanvas.path(pathString);
    return path;
  },
  
  /**
   * Returns a new scaled and transposed path, leaving the original unmodified.  
   * The path is represented as an array of points where even indexes are x 
   * coords and odd indexes are y coords.
   * 
   * @param scale {Number}
   * @param transpose {Array}
   */
  transform : function(aPath, nScale, aTranspose) {
    var aNewPath = aPath.slice(0);
    var i;
    
    var tX = 0, tY = 0;
    if (aTranspose) {
      tX += aTranspose[0];
      tY += aTranspose[1];
    }
          
    for (i = 0; i < aNewPath.length; i += 2) {
      aNewPath[i] = (aNewPath[i] * nScale) + tX;
      aNewPath[i + 1] = (aNewPath[i + 1] * nScale) + tY;
    }
    return aNewPath;
  },
  
  /**
   * Helper method which draws a hexagon on the canvas.
   */
  drawHex : function(cfg) {
    var oCanvas = cfg.canvas, x = cfg.x, y = cfg.y, scale = cfg.scale, offsetX = cfg.offsetX, offsetY = cfg.offsetY;
    var tX = offsetX + (((x * 1.5) + (0.75 * Math.abs(y % 2))) * scale);
    var tY = offsetY + ((Math.sin(Math.PI / 3) * 0.5 * y) * scale);
    return this.createShape(oCanvas, this.transform(REGULAR_HEX_PATH, scale, [tX, tY]));
  }
};

Y.HexDrawUtils = new HexDrawUtils();
var HexGamePiece = Y.Base.create("hexgamepiece", Y.Base, [/*Y.WidgetParent*/], {

  initializer: function() {
    this.resources = Y.Intl.get("hexgame");
  },

  destructor : function() {
  },

  /**
   * Override the default render method to make rendering the hex game piece synchronous.
   * We may want to make this asyncronous if rendering a pieces ends up taking too much time.
   */
  render : function() {
    var piece = this.get('piece');
    var shapes = [];
    Y.Array.each(piece.get('cells'), function(cell) {
      var shape = Y.HexDrawUtils.drawHex({
        x : cell[0],
        y : cell[1],
        canvas : this.get('canvas'),
        scale : this.get('scale'),
        offsetX : this.get('offsetX'),
        offsetY : this.get('offsetY')        
      });
      shapes.push(shape);
    }, this);
    this._set('shapes', shapes);
  },
  
  /**
   * Rotates the piece the given degrees around the point x, y.
   */
  rotate : function(rotation, x, y) {
    Y.Array.each(this.get('shapes'), function(shape) {
      if (rotation !== 0) {
        shape.rotate(rotation, x, y);
      }
    });
  }
},{
  //CSS_PREFIX: "hexgamepiece",
  ATTRS: {
    scale : {
      value : 30
    },
    canvas : {
      writeOnce : true
    },
    offsetX : {},
    offsetY : {},
    piece : {},
    shapes : {
      readOnly : true
    }
  }
});

Y.HexGamePiece = HexGamePiece;

/**
 * This module is the source for all things related to the hex game widget.
 * @module hexgame
 */

var NUM_PIECES_IN_ROW = 9;

/**
 * The hex game consists of a set of players and a board.
 * 
 * @class Hexgame
 * @extends Widget
 * @constructor
 */
var HexGame = Y.Base.create("hexgame", Y.Widget, [/*Y.WidgetParent*/], {

  initializer: function() {
    this.resources = Y.Intl.get("hexgame");
  },

  destructor : function() {
  },

  renderUI : function() {
    var self = this;
    Y.Raphael({type: 'raw'}).use([], function(Raphael) {
      self._initializeCanvas(Raphael);
      self._renderHexBoardUI();
      self._renderHexPiecesUI();
      self._renderHexPlayerStageUI();
    });
  },

  /**
   * Sets the canvas attribute if it hasn't already been initialized.
   */
  _initializeCanvas : function(Raphael) {
    if (!this.get('canvas')) {
      var contextBox = this.get('contentBox');
      var oCanvas = Raphael(this.get('contentBox')._node, this.get('width'), this.get('height'));
      this._set('canvas', oCanvas);
    }
  },
  
  _renderHexBoardUI : function() {
    var boardOffsetX = this.get('boardOffsetX'), boardOffsetY = this.get('boardOffsetY');
    var cells = this.get('model').get('board').get('cells');
    var canvas = this.get('canvas');
    var scale = this.get('scale');
    var i, x, y;
    for (i = 0; i < cells.length; i += 2) {
      x = cells[i];
      y = cells[i + 1];
      Y.HexDrawUtils.drawHex({
        canvas : canvas,
        x : x,
        y : y,
        scale : scale,
        offsetX : boardOffsetX,
        offsetY : boardOffsetY
      });
    }
  },
  
  /**
   * Returns the dimensions of the board.
   */
  _getBoardRect : function() {
    var cells = this.get('model').get('board').get('cells');
    var i, maxX = 0, maxY = 0;
    for (i = 0; i < cells.length; i += 2) {
      maxX = Math.max(cells[i], maxX);
      maxY = Math.max(cells[i + 1], maxY);
    }
    var xOff = this.get('boardOffsetX');
    var yOff = this.get('boardOffsetY');
    var scale = this.get('scale');
    return {
      x: xOff, 
      y: yOff,
      width: scale * 1.5 * (maxX + 1),
      height: scale * (maxY / 2)
    };
  },
  
  /**
   * For each player, renders their pieces in the appropriate places on the board.
   */
  _renderHexPiecesUI : function() {
    // For now, render the pieces just for the top player
    var boardDimensions = this._getBoardRect(),
        xOff = this.get('boardOffsetX'),
        yOff = this.get('boardOffsetY'),
        canvas = this.get('canvas'),
        scale = this.get('scale') / 2,
        middleX = xOff + boardDimensions.width / 2,
        middleY = yOff / 2,
        players = this.get('model').get('players');
    
    Y.Array.each(players, function(player, pIndex) {       
      var pieces = player.get('pieces');
      var pieceWidth = 3 * scale, pieceHeight = 4 * scale;
      var topX = middleX - (NUM_PIECES_IN_ROW / 2) * pieceWidth;
      var topY = middleY - (pieces.length / NUM_PIECES_IN_ROW) * 0.5 * pieceHeight;
      var rotation = 60 * pIndex;
      Y.Array.each(pieces, function(piece, index) {
        var offsetX = topX + (index % NUM_PIECES_IN_ROW) * pieceWidth;
        var offsetY = topY + Math.floor(index / NUM_PIECES_IN_ROW) * pieceHeight;
        var piece = new Y.HexGamePiece({
          piece : piece,
          canvas : canvas,
          scale : scale,
          offsetX : offsetX,
          offsetY : offsetY
        });
        piece.render();
        piece.rotate(rotation, middleX, yOff + (boardDimensions.height / 2));
      }, this);
    });
  },
  
  _renderHexPlayerStageUI : function() {
    var x = this.get('playerStageX'),
        y = this.get('playerStageY'),
        canvas = this.get('canvas');
    
    // Render the frame
    var rect = canvas.rect(x, y, 300, 200);
    
    // Render each piece
    
    // Render the piece staging area
  },
  
  bindUI : function() {

  },

  syncUI : function() {
  }

},{

  //CSS_PREFIX: "hexgame",

  ATTRS: {
    scale : {
      value : 30
    },
    canvas : {
      readOnly : true
    },
    width : {
      value : 1200
    },
    height : {
      value : 1000
    },
    boardOffsetX : {
      value : 200
    },
    boardOffsetY : {
      value : 200
    },
    playerStageX : {
      value: 700
    },
    playerStageY : {
      value: 700
    },
    model : {}
  }
});

Y.HexGame = HexGame;
