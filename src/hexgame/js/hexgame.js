
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
        yOff = this.get('boardOffsetY'),
        xOff = this.get('boardOffsetX'),
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
      var color = player.get('color');
      Y.Array.each(pieces, function(piece, index) {
        var offsetX = topX + (index % NUM_PIECES_IN_ROW) * pieceWidth;
        var offsetY = topY + Math.floor(index / NUM_PIECES_IN_ROW) * pieceHeight;
        var hgPiece = new Y.HexGamePiece({
          piece : piece,
          color : color,
          canvas : canvas,
          scale : scale,
          offsetX : offsetX,
          offsetY : offsetY
        });
        hgPiece.render();
        hgPiece.rotate(rotation, middleX, yOff + (boardDimensions.height / 2));
      }, this);
    });
  },
  
  /**
   * TODO: should return the current non-computer controlled player.
   */
  _getCurrentPlayer : function() {
    return this.get('model').get('players')[0];
  },
  
  /**
   * Renders the hex player stage area.
   */
  _renderHexPlayerStageUI : function() {
    var topX = this.get('playerStageX'),
        topY = this.get('playerStageY'),
        canvas = this.get('canvas'),
        currentPlayer = this._getCurrentPlayer(),
        pieces = currentPlayer.get('pieces'),
        scale = this.get('scale'),
        pieceWidth = 3 * scale, pieceHeight = 4 * scale,
        color = currentPlayer.get('color');
        
    // render each piece
    Y.Array.each(pieces, function(piece, index) {
      var offsetX = topX + (index % NUM_PIECES_IN_ROW) * pieceWidth;
      var offsetY = topY + Math.floor(index / NUM_PIECES_IN_ROW) * pieceHeight;
      var hgPiece = new Y.HexGamePiece({
        piece : piece,
        color : color,
        canvas : canvas,
        scale : scale,
        offsetX : offsetX,
        offsetY : offsetY
      });
      hgPiece.render();
      hgPiece.on('click', function(ev) {
        this._renderCurrentPiece(ev.target);
      }, this);
    }, this); 
  },
  
  _renderCurrentPiece : function(oPiece) {
    var selectedPiece = this.get('selectedPiece'),
        rSelectedPiece;
    var topX = this.get('playerStageX'),
        topY = this.get('playerStageY'),
        scale = this.get('scale'),
        offsetX = topX + scale * (NUM_PIECES_IN_ROW + 2) * 3,
        offsetY = topY + scale * 12,
        canvas;
    if (!selectedPiece || oPiece !== selectedPiece) {
      rSelectedPiece = this.get('renderedSelectedPiece');
      if (rSelectedPiece) {
        rSelectedPiece.destroy();
        if (this._renderedCircle) {
          this._renderedCircle.remove();
        }
      }
      canvas = oPiece.get('canvas');
      rSelectedPiece = new Y.HexGamePiece({
        piece : oPiece.get('piece'),
        color : oPiece.get('color'),
        canvas : oPiece.get('canvas'),
        scale : scale * 2,
        offsetX : offsetX,
        offsetY : offsetY
      });
      rSelectedPiece.render();
      var width = rSelectedPiece.get('width'),
          height = rSelectedPiece.get('height');
          
      var cX = offsetX + (width / 2), 
          cY = offsetY + (height / 2), 
          radius = (Math.max(width, height) + rSelectedPiece.get('scale')) / 2;
      var c = canvas.circle(cX, cY, radius);
      c.toBack(); 
      c.attr({"stroke-width" : 5, "stroke" : "red"});
      this._set('selectedPiece', selectedPiece);
      this._set('renderedSelectedPiece', rSelectedPiece);
      this._renderedCircle = c;
    }
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
      value : 1400
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
      value: 720
    },
    playerStageY : {
      value: 300
    },
    selectedPiece : {
      readOnly : true
    },
    renderedSelectedPiece : {
      readOnly : true
    },
    model : {}
  }
});

Y.HexGame = HexGame;
