import {WIDTH, HEIGHT, PLAYERSPEED, COMPLEVEL} from './Constants'

type PLAYER = {
  x: number,
  y: number,
  width: number,
  height: number,
  score: number,
}
type BALL = {
  x: number,
  y: number,
  vel: {x: number, y: number},
  side: number,
  speed: number,
}
type KEYSTATE = {
  'ArrowUp': boolean,
  'ArrowDown': boolean,
  'w': boolean,
  's': boolean,
}

export function positionPaddles(playerOne: PLAYER, playerTwo: PLAYER) {
  // Position playerOne paddle
  let newPlayerOne = {...playerOne};
  newPlayerOne.x = newPlayerOne.width;
  newPlayerOne.y = (HEIGHT - newPlayerOne.height) / 2;

  // Position playerTwo paddle
  let newPlayerTwo = {...playerTwo};
  newPlayerTwo.x = WIDTH - (playerOne.width + newPlayerTwo.width);
  newPlayerTwo.y = (HEIGHT - newPlayerTwo.height) / 2;

  return [newPlayerOne, newPlayerTwo];
}

export function updatePlayerOne(player: PLAYER, keystate: KEYSTATE) {
  let newPlayer = {...player};

  // Check if key has been pressed
  if (keystate['ArrowUp']) {
    newPlayer.y -= PLAYERSPEED;
  }
  if (keystate['ArrowDown']) {
    newPlayer.y += PLAYERSPEED;
  }

  // Prevent ball going through floor/ceiling
  newPlayer.y = Math.max(Math.min(newPlayer.y, HEIGHT - newPlayer.height), 0);

  return newPlayer;
}

export function updatePlayerTwo(
  player: PLAYER,
  keystate: KEYSTATE,
  ball: BALL,
  playComputer: boolean) {
  let newPlayerTwo = {...player};

  if (playComputer) {
    // Basic computer movement
    var desty = ball.y - (newPlayerTwo.height - ball.side) / 2;
    newPlayerTwo.y += (desty - newPlayerTwo.y) * COMPLEVEL;
  } else {
    // Check if key is pressed
    if (keystate['w']) {
      newPlayerTwo.y -= PLAYERSPEED;
    }
    if (keystate['s']) {
      newPlayerTwo.y += PLAYERSPEED;
    }
  }

  // Prevent ball going through floor/ceiling
  newPlayerTwo.y = Math.max(Math.min(newPlayerTwo.y, HEIGHT - newPlayerTwo.height), 0);

  return newPlayerTwo;
}

export function updateBall(ball: BALL, playerOne: PLAYER, playerTwo: PLAYER) {
  let newBall = {...ball};
  newBall.x += newBall.vel.x;
  newBall.y += newBall.vel.y;

  // Make ball bounce on ceiling/floor
  if (0 > newBall.y || newBall.y + newBall.side > HEIGHT) {
    let offset =
      newBall.vel.y < 0 ? 0 - newBall.y : HEIGHT - (newBall.y + newBall.side);
    newBall.y += 2 * offset;
    newBall.vel.y *= -1;
  }

  let pdle = ball.vel.x < 0 ? playerOne : playerTwo;
  checkCollision(newBall, playerOne, playerTwo, pdle);

  return updateScore(newBall, playerOne, playerTwo, pdle);
}

function checkCollision(ball: BALL, playerOne: PLAYER, playerTwo: PLAYER, pdle: PLAYER) {
  if (
    pdle.x < ball.x + ball.side &&
    pdle.y < ball.y + ball.side &&
    ball.x < pdle.x + pdle.width &&
    ball.y < pdle.y + pdle.height
  ) {
    // Calculate offset
    if (pdle === playerOne) {
      ball.x = playerOne.x + playerOne.width;
    } else {
      ball.x = playerTwo.x - ball.side;
    }
    // Normalize value (increase ball angle depending on where it hit the paddle)
    let n = (ball.y + ball.side - pdle.y) / (pdle.height + ball.side);
    let phi = (2 * n - 1) * (Math.PI / 4);

    let smash = Math.abs(phi) > Math.PI / 5 ? 1.5 : 1;
    ball.vel.x =
      smash * (pdle === playerOne ? 1 : -1) * ball.speed * Math.cos(phi);
    ball.vel.y = smash * ball.speed * Math.sin(phi);
  }
}

function updateScore(ball: BALL, playerOne: PLAYER, playerTwo: PLAYER, pdle: PLAYER) {
  // Point scored
  if (0 > ball.x + ball.side || ball.x > WIDTH) {
    if (pdle === playerTwo) {
      playerOne.score++;
    } else {
      playerTwo.score++;
    }
    return serveBall(pdle === playerOne ? 1 : -1, ball, playerOne, playerTwo);
  } else {
    return ball;
  }
}

export function serveBall(side: number, ball: BALL, playerOne: PLAYER, playerTwo: PLAYER) {
  let newBall = {...ball};
  // Create random angle from which ball will serve
  let r = Math.random();
  newBall.x = side === 1 ? playerOne.x + playerOne.width : playerTwo.x - newBall.side;
  newBall.y = (HEIGHT - newBall.side) * r;

  let phi = (1 - 2 * r) * (Math.PI / 10);
  newBall.vel = {
    x: side * newBall.speed * Math.cos(phi),
    y: newBall.speed * Math.sin(phi),
  };
  return newBall;
}
