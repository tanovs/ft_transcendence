import React, {useEffect, useRef, useReducer} from 'react';
import {drawCanvas} from './Draw';
import {
  WIDTH,
  HEIGHT,
  PLAYER,
  BALL
} from './Constants';
import {websocket} from '../websocket'
import './Pong.css';
import CustomButton from '../CustomButton';
import {nanoid} from 'nanoid';
import {
  Menu,
  Loader,
  Dimmer,
  Icon,
} from 'semantic-ui-react';
import axios from 'axios';
import {useGame} from '../GameManager';
import {toast} from 'react-toastify';
import {useAuth} from '../ProvideAuth';
import {GameStage, PlayerNumber} from '../game.enum';

let playerNumber = PlayerNumber.None;

const toastAlert = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}

const Pong: React.FC<any> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStageRef = useRef<GameStage>(GameStage.Menu);
  const targetRef = useRef({id: 0});
  const roomIdRef = useRef("");
  const game = useGame();
  const auth = useAuth();

  const ballReducer = (state: any, action: any) => {
    switch (action.type.name) {
      case 'setBall':
        return action.type.newState;
      default:
    }
  }

  const playerReducer = (state: any, action: any) => {
    switch (action.type.name) {
      case 'setPlayerOne':
        return action.type.newState;
      case 'setPlayerTwo':
        return action.type.newState;
      default:
    }
  }

  const gameStageReducer = (state: any, action: {type: GameStage}) => {
    game.updateGameStage(action.type);
    gameStageRef.current = action.type;
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
  const [ball, dispatchBall] = useReducer(ballReducer, BALL);
  const [playerOne, dispatchPlayerOne] = useReducer(playerReducer, PLAYER);
  const [playerTwo, dispatchPlayerTwo] = useReducer(playerReducer, PLAYER);

  // Check for keypresses
  const checkKeys = (event: React.KeyboardEvent, down: boolean) => {
    event.preventDefault();
    const {key} = event;

    let keyEvent = {key: key, playerNumber: playerNumber, down: down}
    websocket.emit('keydown', JSON.stringify(keyEvent));
    return event;
  };

  // Reset keypresses
  const resetKeys = () => {
    websocket.emit('resetKeys', playerNumber);
  }

  const joinRandomGame = async () => {
    if (gameStageRef.current === GameStage.Playing) {
      return;
    }
    if (!auth) {
      return;
    }
    dispatchGameStage({type: GameStage.Waiting});
    const online = await axios.get(`/api/users/${auth.user!.id}/online`);
    if (!online.data.online) {
      await auth.updateCurrentUser();
    }
    websocket.emit('joinGame', {
      user: {
        id: auth.user!.id,
        username: auth.user!.username
      }
    });
  };

  const handleInit = (number: number) => {
    playerNumber = number;
  }

  function handleGameState(state: any) {
    state = JSON.parse(state);
    if (gameStageRef.current === GameStage.Playing) {
      dispatchPlayerOne({type: {name: 'setPlayerOne', newState: state.players[0]}});
      dispatchPlayerTwo({type: {name: 'setPlayerTwo', newState: state.players[1]}});
      dispatchBall({type: {name: 'setBall', newState: state.ball}});
    }
  }

  function handleCancel(data: any) {
    dispatchGameStage({type: GameStage.Menu});
  }

  const handleDuplicate = () => {
    toastAlert(`You are already joining/playing a game`);
    dispatchGameStage({type: GameStage.Menu});
  };

  //automatically join game if target is set by gameManager
  useEffect(() => {
    let isMounted = true;

    const joinGameWithTarget = () => {
      if (!game.target || !auth.user) {
        return;
      }
      if (targetRef.current.id === game.target.id
        && game.gameIdRef.current === roomIdRef.current) {
        return;
      }
      targetRef.current.id = game.target.id;
      console.log(`joining/creating game: target: ${game.target.id} ${game.target.username} roomId: ${game.gameIdRef}`);
      if (isMounted) {
        dispatchGameStage({type: GameStage.Waiting});
        websocket.emit('joinGame', {
          user: {
            id: auth.user!.id,
            username: auth.user!.username,
          },
          target: game.target,
          roomId: game.gameIdRef.current === "" ? null : game.gameIdRef.current
        });
      }
    }

    const watchGame = () => {
      console.log(`watching game: ${game.gameIdRef.current}`);
      if (isMounted) {
        websocket.emit('watchGame', {
          user: {
            id: auth.user!.id,
            username: auth.user!.username,
          },
          roomId: game.gameIdRef.current === "" ? null : game.gameIdRef.current
        });
      }
    }

    if (game.target) {
      if (game.target.watching) {
        watchGame();
      } else {
        joinGameWithTarget();
      }
    }
    return () => {
      isMounted = false
    }
  }, [game.target, auth.user, game.gameIdRef]);

  useEffect(() => {
    let isMounted = true;

    const resetDisplay = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx == null) throw new Error('Could not get context');
      ctx.fillRect(0, 0, 700, 600);
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.restore();
      if (isMounted) {
        dispatchGameStage({type: GameStage.Menu});
      }
    }

    const handleGameOver = (data: any) => {
      data = JSON.parse(data);
      if (playerNumber !== PlayerNumber.Spectator) {
        let message = data.reason ? data.reason + ': ' : '';
        message = data.winner === playerNumber ?
          message + 'You win!' :
          message + 'You lose!';
        alert(message);
      }
      resetDisplay();
      game.updateTarget(null);
    }

    const handleStart = (data: any) => {
      if (!isMounted) {
        return;
      }
      game.updateRoomId(data.roomId);
      dispatchGameStage({type: GameStage.Playing});
    }

    game.updateEmmitedGameREf("");
    websocket.on('init', handleInit);
    websocket.on('start', handleStart);
    websocket.on('duplicate', handleDuplicate);
    websocket.on('gamestate', handleGameState);
    websocket.on('gameover', handleGameOver);
    websocket.on('cancel', handleCancel);
    return () => {
      isMounted = false;
      if (gameStageRef.current === GameStage.Waiting) {
        game.cancelGame();
      } else if (gameStageRef.current === GameStage.Playing && playerNumber !== PlayerNumber.Spectator) {
        game.leaveGame()
      }
      websocket.off('init');
      websocket.off('gamestate');
      websocket.off('gameover');
      websocket.off('duplicate');
    }
  }, [game]);

  useEffect(() => {
    let isMounted = true;
    if (!isMounted) {
      return;
    }
    // Draw everything onto the canvas element
    drawCanvas(canvasRef, ball, playerOne, playerTwo, gameStageRef.current);
    return () => {
      isMounted = false;
    }
  }, [playerOne, playerTwo, ball]);

  const customIcon = (props: any) => {
    return <Icon {...props} />;
  }

  const gameMenu =
    <Menu secondary size='large' inverted
      items={[
        <CustomButton key={nanoid()}
          hidden="Join game"
          visible={customIcon({
            name: 'table tennis',
            fitted: true,
            size: 'large',
          })}
          props={{
            onClick: joinRandomGame,
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
          }} />
      ]}
      className='joinMenuStyle'
    />;

  const gameLoader = () => {
    return <Menu secondary size='large' inverted
      items={[
        <Dimmer key={nanoid()} active>
          <Loader key={nanoid()} size='huge' indeterminate>
            <CustomButton key={nanoid()}
              visible={`Waiting for ${game.target ? game.target.username : 'opponent'}`}
              hidden={customIcon({
                name: 'cancel',
                fitted: true,
                size: 'large',
              })}
              props={{
                onClick: () => {
                  dispatchGameStage({type: GameStage.Menu});
                  game.cancelGame();
                },
                fluid: true,
                size: 'small',
                inverted: false
              }} />
          </Loader>
        </Dimmer>
      ]}
      className='loaderStyle'
    />;
  }

  const gameInterface = (type: GameStage) => {
    switch (type) {
      case GameStage.Menu:
        return gameMenu;
      case GameStage.Waiting:
        return gameLoader();
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

export default Pong;
