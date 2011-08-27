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