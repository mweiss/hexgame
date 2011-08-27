/**
 * Class encapsulating the state of a hex board player.
 * @class hexboard
 * @constructor
 */
var HexPlayer = Y.Base.create("hexplayer", Y.Base, [], {
   initializer: function() {
   },
   
   destructor : function() {
   }
},{
  ATTRS: {
    type : {},
    id : {},
    color : {},
    pieces : {}
  }
});

Y.HexPlayer = HexPlayer;