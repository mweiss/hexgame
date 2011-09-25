var HexGamePiece = Y.Base.create("hexgamepiece", Y.Base, [/*Y.WidgetParent*/], {

  initializer: function() {
    this.resources = Y.Intl.get("hexgame");
  },

  destructor : function() {
    Y.Array.each(this.get('shapes'), function(shape) {
      shape.$node.remove();
    }, this);
  },

  /**
   * Override the default render method to make rendering the hex game piece synchronous.
   * We may want to make this asyncronous if rendering a pieces ends up taking too much time.
   */
  render : function() {
    var piece = this.get('piece');
    var canvas = this.get('canvas');
    var group = [];
    Y.Array.each(piece.get('cells'), function(cell) {
      var shape = Y.HexDrawUtils.drawHex({
        x : cell[0],
        y : cell[1],
        canvas : canvas,
        scale : this.get('scale'),
        offsetX : this.get('offsetX'),
        offsetY : this.get('offsetY')        
      });
      shape.attr({fill: this.get('color')});
      group.push(shape);
    }, this);
    this._set('shapes', group);
    this._addEventListeners();
  },
  
  _addEventListeners : function() {
    Y.Array.each(this.get('shapes'), function(shape) {
      shape.$node.on('click', this._clickShapeListener, this);
    }, this);
  },
  
  /**
   * Event listener when a shape is clicked.  This event listener triggers a new click event that's visible
   * for the piece widget.
   */
  _clickShapeListener : function(ev) {
    this.fire("click");
  },
  
  /**
   * Rotates the piece the given degrees around the point x, y.
   */
  rotate : function(rotation, x, y) {
    Y.Array.each(this.get('shapes'), function(shape) {
      if (rotation !== 0) {
        shape.rotate(rotation, x, y);
      }
    }, this);
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
    height : {
      readOnly : true,
      getter : function(val, name) {
        var dims = Y.HexDrawUtils.getDimensions(this.get('piece').get('cells'));
        return dims.height * this.get('scale');
      }
    },
    width : {
      readOnly : true,
      getter : function(val, name) {
        var dims = Y.HexDrawUtils.getDimensions(this.get('piece').get('cells'));
        return dims.width * this.get('scale');
      }
    },
    offsetX : {},
    offsetY : {},
    piece : {},
    shapes : {
      readOnly : true
    },
    color : {
      value : 0xffffff
    }
  }
});

Y.HexGamePiece = HexGamePiece;