// get canvas
var canvas = document.querySelector( 'canvas' );
var ctx = canvas.getContext( '2d' );
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// get score display elements
var currentScore = document.getElementById( 'currentScore' );
var highScore = document.getElementById( 'highScore' );

// define player and inital states
var player = {
  width: 20,
  position: {
    x: canvas.width / 2,
    y: canvas.height / 2
  },
  dead: false,
  highscore: window.localStorage.getItem( 'highscore' ) || 0,
  color: 'tomato'
};

// create obstacle store
var obstacles = [];

// define playing field and inital states
var field = {
  minGap: player.width * 2,
  maxGap: canvas.width * 0.25,
  speed: 1,
  distanceTravelled: 0,
  distanceToNextObstacle: 0
};

// // create obstacles on random timer
// setTimeout( function generateObstacle() {
//   var obstacleWidth = Math.random() * ( player.size * 2 );
//   obstacles.push( {
//     width: obstacleWidth,
//     height: Math.random() * ( canvas.height * 0.8 ),
//     position: -obstacleWidth,
//     invert: ( Math.random() >= 0.5 ),
//     color: '#eee'
//   } );
//
//   setTimeout( generateObstacle, 2000 - ( player.score.current / 20 ) );
// }, 2000 );

// detect collisions
function collisionTest( obstacle ) {
  // obstacle top left point
  var p1 = {
    x: obstacle.position,
    y: obstacle.invert ? canvas.height : obstacle.height
  };

  // obstacle bottom right point
  var p2 = {
    x: obstacle.position + obstacle.width,
    y: obstacle.invert ? canvas.height - obstacle.height : 0
  };

  // player top left point
  var p3 = {
    x: player.position.x - ( player.width / 2 ),
    y: player.position.y + ( player.width / 2 )
  };

  // player bottom right point
  var p4 = {
    x: player.position.x + ( player.width / 2 ),
    y: player.position.y - ( player.width / 2 )
  };

  // detect collision between two rectangles
  if( p1.x > p4.x || p3.x > p2.x ) {
    return false;
  }

  if( p1.y < p4.y || p3.y < p2.y ) {
    return false;
  }

  return true;
}

// main loop
(function loop() {
  // clear canvas for redraw
  ctx.fillStyle = '#444';
  ctx.fillRect( 0, 0, canvas.width, canvas.height );

  // decrease distance to next obstacle
  field.distanceToNextObstacle -= Math.floor( field.speed );

  // generate obstacle if needed
  if( field.distanceToNextObstacle <= 0 ) {
    var obstacleWidth = 2 + ( Math.random() * player.width * 2 );
    obstacles.push( {
      width: obstacleWidth,
      height: Math.random() * ( canvas.height * 0.8 ),
      position: -obstacleWidth,
      invert: ( Math.random() >= 0.5 ),
      color: '#eee'
    } );

    // gernetate a new distance for a new obstacle
    field.distanceToNextObstacle = Math.floor( Math.random() * ( field.maxGap - field.minGap + 1 ) ) + field.minGap + obstacleWidth;
  }

  // draw all current obstacles
  obstacles.forEach( function( obstacle, idx ) {
    // move current obstacle fwd
    obstacle.position += field.speed;

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
  ctx.rect( player.position.x - ( player.width / 2 ), player.position.y - ( player.width / 2 ), player.width, player.width );
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();

  // update player scores
  player.highscore = Math.max( player.highscore, ++field.distanceTravelled );
  currentScore.textContent = field.distanceTravelled;
  highScore.textContent = player.highscore;

  // increase field speed
  field.speed = 1 + ( field.distanceTravelled / 1000 );

  // determine if gameplay continues or ends
  if( !player.dead ) {
    // continue gameplay
    window.requestAnimationFrame( loop );
  }
  else {
    // end gameplay
    // store highscore
    window.localStorage.setItem( 'highscore', player.highscore );

    // reset the field
    field = {
      minGap: player.width * 2,
      maxGap: canvas.width * 0.25,
      speed: 1,
      distanceTravelled: 0,
      distanceToNextObstacle: ( canvas.width / 2 ) - ( player.width / 2 )
    };

    // clear all obstacles
    obstacles = [];

    // reset player status
    player.dead = false;

    // inform player of restart
    window.alert( 'You are dead! Game will now restart.');

    // start new game
    window.requestAnimationFrame( loop );
  }
}());
