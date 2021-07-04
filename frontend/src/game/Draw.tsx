import React from 'react'
import {
  WIDTH,
  HEIGHT,
  GAMEFONT,
} from './Constants'

import {GameStage} from '../game.enum';

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

export function drawCanvas(canvasRef: React.RefObject<HTMLCanvasElement>, ball: BALL, playerOne: PLAYER, playerTwo: PLAYER, gameStage: GameStage) {

  const ctx = canvasRef.current?.getContext('2d');
  if (ctx == null) throw new Error('Could not get context');

  // Draw game canvas
  ctx.fillRect(0, 0, 700, 600);

  ctx.save();
  ctx.fillStyle = '#fff';

  // Draw players
  if (gameStage === GameStage.Playing) {
    ctx.fillRect(playerOne.x, playerOne.y, playerOne.width, playerOne.height);
    ctx.fillRect(playerTwo.x, playerTwo.y, playerTwo.width, playerTwo.height);
  }

  // Draw ball if game has started
  if (gameStage === GameStage.Playing) {
    ctx.fillRect(ball.x, ball.y, ball.side, ball.side);
  }

  // Draw net
  if (gameStage === GameStage.Playing) {
    let w = 4;
    let x = (WIDTH - w) / 2;
    let y = 0;
    let step = HEIGHT / 15;
    while (y < HEIGHT) {
      ctx.fillRect(x, y + step / 4, w, step / 2);
      y += step;
    }
  }

  // Draw scores if game has started (checked with ball values)
  if (gameStage === GameStage.Playing) {
    ctx.font = GAMEFONT;
    ctx.fillText(String(playerOne.score), WIDTH / 4, HEIGHT / 5);
    ctx.fillText(String(playerTwo.score), (3 * WIDTH) / 4, HEIGHT / 5);
  }

  ctx.restore();
}
