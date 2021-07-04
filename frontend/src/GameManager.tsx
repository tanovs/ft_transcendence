import React, {useContext, createContext, useState, useEffect, useRef, MutableRefObject} from "react";
import {RouteProps} from 'react-router';
import {websocket} from './websocket';
import 'react-toastify/dist/ReactToastify.css';
import {useAuth} from "./ProvideAuth";
import {GameStage} from "./game.enum";
import IUser from './UserInterface';


type gameContextType = {
  target: IUser | null,
  gameIdRef: MutableRefObject<string>,
  emmitedGameRef: MutableRefObject<string>,
  gameStageRef: MutableRefObject<GameStage>,
  updateTarget: (user: IUser | null) => Promise<void>,
  updateRoomId: (id: string | null) => Promise<void>,
  updateGameStage: (gameStae: GameStage) => void,
  updateEmmitedGameREf: (data: string) => void,
  cancelGame: () => void,
  leaveGame: () => void,
}

const gameContext = createContext<gameContextType | null>(null);

export const ProvideGame: React.FC<RouteProps> = ({children}) => {
  const game = useProvideGame();

  return (
    <gameContext.Provider value={game} >
      {children}
    </gameContext.Provider>
  );
}

export function useGame() {
  return useContext(gameContext) as gameContextType;
}

function useProvideGame() {
  const [target, setTarget] = useState<IUser | null>(null);
  const gameStageRef = useRef(GameStage.Menu);
  const gameIdRef = useRef("");
  const emmitedGameRef = useRef("");
  const auth = useAuth();

  const updateTarget = async (user: IUser | null) => {
    if (user) {
      setTarget((target) => {return {...user};});
    } else {
      setTarget(target => null);
    }
  }

  const updateGameStage = async (gameStage: GameStage) => {
    gameStageRef.current = gameStage;
  }

  const updateEmmitedGameREf = (newGameRef: string) => {
    emmitedGameRef.current = newGameRef;
  }

  const updateRoomId = async (id: string | null) => {
    gameIdRef.current = id ? id : "";
  }

  async function handleGameCode(data: {gameCode: string, emmitedBy: number}) {
    console.log(data);
    await updateRoomId(data.gameCode);
    if (data.emmitedBy === auth.user!.id) {
      emmitedGameRef.current = data.gameCode;
    }
  }

  const cancelGame = () => {
    if (!auth.user) {
      console.log('!auth.user');
      return;
    }
    console.log('cancelGame ' + emmitedGameRef.current);
    if (emmitedGameRef.current !== "") {
      websocket.emit('cancelGame', {
        user: {
          id: auth.user!.id,
          username: auth.user!.username,
        },
        gameCode: emmitedGameRef.current,
        private: target !== null
      });
    }
    updateTarget(null);
  }

  const leaveGame = () => {
    if (!auth.user) {
      console.log('!auth.user');
      return;
    }
    websocket.emit('leftGame', {user: auth.user, gameCode: gameIdRef.current});
    updateRoomId(null);
    updateTarget(null);
  }

  useEffect(() => {
    websocket.on('gamecode', handleGameCode);
    return () => {
      websocket.off('gamecode');
    }
  });

  return {
    target,
    gameIdRef,
    emmitedGameRef,
    gameStageRef,
    updateTarget,
    updateRoomId,
    updateGameStage,
    updateEmmitedGameREf,
    cancelGame,
    leaveGame,
  };
}
