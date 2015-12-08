// get canvas
var canvas = document.querySelector( 'canvas' );
var ctx = canvas.getContext( '2d' );
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// define player
var player = {
  size: 20,
  position: {
    x: canvas.width/2,
    y: canvas.height/2
  },
  dead: false,
  score: {
    current: 0,
    high: window.localStorage.getItem( 'highscore' ) || 0
  },
  color: 'tomato'
};

var currentScore = document.getElementById( 'currentScore' );
var highScore = document.getElementById( 'highScore' );

// store obstacles
var obstacles = [];

// create obstacles on random timer
setTimeout( function generateObstacle() {
  var obstacleWidth = Math.random() * ( player.size * 2 );
  obstacles.push( {
    width: obstacleWidth,
    height: Math.random() * ( canvas.height * 0.8 ),
    position: -obstacleWidth,
    invert: ( Math.random() >= 0.5 ),
    color: '#eee'
  } );

  setTimeout( generateObstacle, 2000 - ( player.score.current / 20 ) );
}, 2000 );

// detect collisions
function collisionTest( obstacle ) {
  // obstacle top left
  var p1 = {
    x: obstacle.position,
    y: obstacle.invert ? canvas.height : obstacle.height
  };
  // obstacle bottom right
  var p2 = {
    x: obstacle.position + obstacle.width,
    y: obstacle.invert ? canvas.height - obstacle.height : 0
  };
  // player top left
  var p3 = {
    x: player.position.x - (player.size/2),
    y: player.position.y + (player.size/2)
  };
  // player bottom right
  var p4 = {
    x: player.position.x + (player.size/2),
    y: player.position.y - (player.size/2)
  };

  if( p1.x > p4.x || p3.x > p2.x ) {
    return false;
  }

  if( p1.y < p4.y || p3.y < p2.y ) {
    return false;
  }

  return true;
}

// main loop
(function animateLoop() {
  // clear canvas for redraw
  ctx.fillStyle = '#444';
  ctx.fillRect( 0, 0, canvas.width, canvas.height );

  // draw all obstacles
  obstacles.forEach( function( obstacle, idx ) {
    // move current obstacle fwd
    obstacle.position += player.score.current / 2000  + 1;

    // draw obstacle
    ctx.beginPath();
    ctx.fillStyle = obstacle.color;
    if( obstacle.invert ) {
      // obstacle on roof
      ctx.rect( obstacle.position, canvas.height, obstacle.width, -obstacle.height );
    }
    else {
      // obstacle on floor
      ctx.rect( obstacle.position, 0, obstacle.width, obstacle.height );
    }
    ctx.fill();
    ctx.closePath();

    // remove past obstacles
    if( obstacle.position - obstacle.width > canvas.width ) {
      obstacles.splice( idx, 1 );
    }

    // detect colision w/ player
    if( collisionTest( obstacle ) ) {
      player.dead = true;
    }
  } );

  // draw player
  ctx.beginPath();
  ctx.rect( player.position.x - player.size/2, player.position.y - player.size/2, player.size, player.size );
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();

  // update scores
  player.score.high = Math.max( player.score.high, ++player.score.current );
  currentScore.textContent = player.score.current;
  highScore.textContent = player.score.high;

  // determine if gameplay continues or ends
  if( !player.dead ) {
    window.requestAnimationFrame( animateLoop );
  }
  else {
    window.localStorage.setItem( 'highscore', player.score.high );
    window.alert( 'You are dead!' );
    player.score.current = 0;
    obstacles = [];
    player.position.y = 10;
    player.dead = false;
    window.requestAnimationFrame( animateLoop );
  }
}());
