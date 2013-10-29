// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  // A 2D array to keep track of all occupied tiles
  this.occupied = new Array(Game.map_grid.width);
  for (var i = 0; i < Game.map_grid.width; i++) {
    this.occupied[i] = new Array(Game.map_grid.height);
    for (var y = 0; y < Game.map_grid.height; y++) {
      this.occupied[i][y] = false;
    }
  }


 Crafty.e("2D, DOM, TiledMapBuilder").setMapDataSource( SOURCE_FROM_TILED_MAP_EDITOR )
 
  .createWorld( function( tiledmap ){                             
          //Fence
          for (var fence = 0; fence < tiledmap.getEntitiesInLayer('fence').length; fence++){
            tiledmap.getEntitiesInLayer('fence')[fence]
              .addComponent("Collision, Fence")
              .collision();             
          }
          
          //Obstacles
          for (var obstacle = 0; obstacle < tiledmap.getEntitiesInLayer('obstacles').length; obstacle++){
            tiledmap.getEntitiesInLayer('obstacles')[obstacle]
              .addComponent("Collision, Obstacle")
              .collision( new Crafty.polygon([5,5],[28,5],[28,28],[5,28]) );  //You can set the exact boundaries            
          } 
          
          //Water
          for (var water = 0; water < tiledmap.getEntitiesInLayer('water').length; water++){
            tiledmap.getEntitiesInLayer('water')[water]
              .addComponent("Collision, Water")
              .collision();             
          }
                                    
        });
}, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  this.unbind('VillageVisited', this.show_victory);
});


// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', function() {
  // Display some text in celebration of the victory
  Crafty.e('2D, DOM, Text')
    .text('You collected all the Halloween Candy!')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css($text_css);
  Crafty.e('2D, DOM, Text')
    .text('Press any key to restart')
    .attr({ x: 0, y: Game.height()/2, w: Game.width() })
    .css($text_css);

  // Give'em a round of applause!
  Crafty.audio.play('applause');

  // After a short delay, watch for the player to press a key, then restart
  // the game when a key is pressed
  var delay = true;
  setTimeout(function() { delay = false; }, 1000);
  this.restart_game = Crafty.bind('KeyDown', function() {
    if (!delay) {
      Crafty.scene('Game');
    }
  });
}, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  this.unbind('KeyDown', this.restart_game);
});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Trick or Treat! Loading; please wait...')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css($text_css);

   

   //Preload sprites first
           Crafty.load([
                        "img/grass-tiles-2-small.png",
                        "img/tree2-final.png",
                        "img/mummy.png",
                        "img/littleshrooms_0.png" 
                       ], function() {
             
             Crafty.sprite(32,32,"img/mummy.png", {
               spr_pc:[0,0]
             }); 
                                                                  
                // Now that our sprites are ready to draw, start the game
    Crafty.scene('Game');
            });         
    
  
});