
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

var HEX_X_INCREMENT = 1.5;
var HALF_HEX_X_INCREMENT = HEX_X_INCREMENT / 2;
var HEX_Y_INCREMENT = -0.5 * Math.sin(Math.PI / 3);

var HexDrawUtils = function() {};
  
HexDrawUtils.prototype = {
  
  HEX_X_INCREMENT : HEX_X_INCREMENT,
  HALF_HEX_X_INCREMENT : HALF_HEX_X_INCREMENT,
  HEX_Y_INCREMENT : HEX_Y_INCREMENT,
  
  /**
   * Helper method which converts the hex grid coordinates to coordinates in the lower right 
   * quadrant of a cartesian grid.
   */
  convertHexGridCoordinatesToCartesian : function(aHexCoord) {
    var x = aHexCoord[0], y = aHexCoord[1], cartesianX, cartesianY;
    
    cartesianX = (y % 2 === 0) ? HEX_X_INCREMENT * x : HALF_HEX_X_INCREMENT + (HEX_X_INCREMENT * x);
    cartesianY = HEX_Y_INCREMENT * y;
    
    return [cartesianX, cartesianY];
  },
  
  /**
   * Helper method which converts coordinates in the lower right quadrant of a cartesian grid
   * to hex grid coordiantes.
   */
  convertCartesianCoordiantesToHexGrid : function(aCartesianCoord) {
    var x = aCartesianCoord[0], y = aCartesianCoord[1], hexX, hexY;
    
    hexY = Math.round(y / HEX_Y_INCREMENT);
    hexX = Math.round((hexY % 2 === 0) ? x / HEX_X_INCREMENT : (x - HALF_HEX_X_INCREMENT) / HEX_X_INCREMENT);
    return [hexX, hexY];
  },

  /**
   * Returns the x, y, width, and height dimensions.
   */
  getDimensions : function(cells) {
    var minX, minY, maxX, maxY;
    Y.Array.each(cells, function(cell) {
      var cartesianCoords = this.convertHexGridCoordinatesToCartesian(cell),
          x = cartesianCoords[0],
          y = cartesianCoords[1];
      minX = minX === undefined ? x - 0.5 : Math.min(minX, x - 0.5);
      minY = minY === undefined ? y + HEX_Y_INCREMENT : Math.min(minY, y + HEX_Y_INCREMENT);
      maxX = maxX === undefined ? x + 0.5 : Math.max(maxX, x + 0.5);
      maxY = maxY === undefined ? y - HEX_Y_INCREMENT : Math.max(maxY, y - HEX_Y_INCREMENT);
    }, this);
    return {
      x : minX,
      y : maxY,
      width : maxX - minX,
      height : maxY - minY
    };
  },
  
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