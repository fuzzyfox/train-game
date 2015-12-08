var UP = 38;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;

window.addEventListener( 'keydown', function( event ) {
  if( event.keyCode === UP && player.position.y <= canvas.height ) {
    player.position.y += 4;
  }

  if( event.keyCode === DOWN && player.position.y >= 0 ) {
    player.position.y -= 4;
  }

  if( event.keyCode === LEFT && player.position.x >= 0 ) {
    player.position.x -= 4;
  }

  if( event.keyCode === RIGHT && player.position.x <= canvas.width ) {
    player.position.x += 4;
  }
} );

canvas.addEventListener( 'mousemove', function( event ) {
  player.position.y = event.offsetY;
  player.position.x = event.offsetX;
} );
