
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
