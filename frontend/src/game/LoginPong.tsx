import React, {useState, useEffect, useRef, useReducer} from 'react';
import {useInterval} from './useInterval';
import {drawCanvas} from './Draw';
import {
  WIDTH,
  HEIGHT,
  GAMESPEED,
  PLAYER,
  BALL
} from './Constants';
import {
  positionPaddles,
  updatePlayerOne,
  updatePlayerTwo,
  updateBall,
  serveBall,
} from './Update';
import {
  Menu,
  Icon,
} from 'semantic-ui-react';
import './Pong.css';
import {GameStage} from '../game.enum';
import CustomButton from '../CustomButton';
import {nanoid} from 'nanoid';

const customIcon = (props: any) => {
  return <Icon {...props} />;
}

function LoginPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerOne, setPlayerOne] = useState(PLAYER);
  const [playerTwo, setPlayerTwo] = useState(PLAYER);
  const [ball, setBall] = useState(BALL);
  const [gameSpeed, setGameSpeed] = useState(0);
  const [keystate, setKeystate] = useState({'ArrowUp': false, 'ArrowDown': false, 'w': false, 's': false});
  const [playComputer, setPlayComputer] = useState(false);

  const gameStageReducer = (state: any, action: {type: GameStage}) => {
    switch (action.type) {
      case GameStage.Menu:
        return GameStage.Menu;
      case GameStage.Waiting:
        return GameStage.Waiting;
      case GameStage.Playing:
        return GameStage.Playing;
      default:
        return GameStage.Menu;
    }
  }

  const [gameStage, dispatchGameStage] = useReducer(gameStageReducer, GameStage.Menu);

  useInterval(() => gameLoop(), gameSpeed);

  // Update all values on every interval
  const gameLoop = () => {
    if (gameSpeed) {
      setBall(updateBall(ball, playerOne, playerTwo)); setPlayerOne(updatePlayerOne(playerOne, keystate)); setPlayerTwo(updatePlayerTwo(playerTwo, keystate, ball, playComputer));
    }
  }

  // Check for keypresses
  const checkKeys = (event: React.KeyboardEvent, down: boolean) => {
    event.preventDefault();
    const {key} = event;
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'w' || key === 's') {
      let newKeystate = {...keystate, [key]: down}
      setKeystate(newKeystate);
    }
  };

  // Reset keypresses
  const resetKeys = () => {
    setKeystate({'ArrowUp': false, 'ArrowDown': false, 'w': false, 's': false});
  }

  const startGame = (playComputer: boolean) => {
    dispatchGameStage({type: GameStage.Playing});
    // Set playComputer to true if play against computer is pressed
    setPlayComputer(playComputer);

    // Reset values
    setGameSpeed(0);
    setPlayerOne(PLAYER);
    setPlayerTwo(PLAYER);

    // Set ball position
    setBall(serveBall(1, ball, playerOne, playerTwo));

    // Set game speed to activate the game loop
    setGameSpeed(GAMESPEED);
  };

  useEffect(() => {
    // Position paddles on first render
    if (!playerOne.x) {
      let newPlayers = positionPaddles(playerOne, playerTwo);
      setPlayerOne(newPlayers[0]);
      setPlayerTwo(newPlayers[1]);
    }
    // Draw everything onto the canvas element
    drawCanvas(canvasRef, ball, playerOne, playerTwo, gameStage);
  }, [playerOne, playerTwo, ball, playComputer, gameStage]);

  const gameMenu =
    <Menu secondary size='large' inverted
      items={[
        <CustomButton key={nanoid()}
          hidden="Sign in with intra"
          visible={customIcon({
            name: 'table tennis',
            fitted: true,
            size: 'large',
          })}
          props={{
            fluid: false,
            size: 'massive',
          }} />,
        <CustomButton key={nanoid()}
          hidden="Play computer"
          visible={customIcon({
            name: 'computer',
            fitted: true,
            size: 'large',
          })}
          props={{
            fluid: false,
            size: 'massive',
            onClick: () => startGame(true),
          }} />
      ]}
      className='joinMenuStyle'
    />;

  const gameInterface = (type: GameStage) => {
    switch (type) {
      case GameStage.Menu:
        return gameMenu;
      // case GameStage.Waiting:
      //   return gameLoader();
      default:
    }
  }

  return (
    <div className="pong-div">
      {gameStage !== GameStage.Playing && gameInterface(gameStage)}
      <div
        onKeyDown={(event: React.KeyboardEvent) => checkKeys(event, true)}
        onKeyUp={(event: React.KeyboardEvent) => checkKeys(event, false)}
        onBlur={resetKeys}
        tabIndex={0}
        style={{outline: "none", width: 700}}
        id='Pong'>
        <br />
        <canvas style={{marginBottom: 30}} ref={canvasRef} width={WIDTH} height={HEIGHT} />
      </div>
    </div>
  )
}

export default LoginPong
