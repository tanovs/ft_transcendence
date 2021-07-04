import React, {useContext, createContext, useState} from "react";
import {RouteProps} from 'react-router';
import {websocket, friendWebSocket} from './websocket';
import axios from 'axios';
import IUser from './UserInterface';

type AuthContextType = {
  user: IUser | null
  authenticateUser: () => Promise<void>
  signout: () => void
  updateCurrentUser: () => Promise<void>
  toggleTwoFactAuth: () => void
  validateTwoFactAuth: (validationCodecode: string) => void
  setOnline: () => Promise<void>
}

const authContext = createContext<AuthContextType | null>(null);

export const ProvideAuth: React.FC<RouteProps> = ({children}) => {
  const auth = useProvideAuth();

  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return useContext(authContext) as AuthContextType;
}

function useProvideAuth() {

  const [user, setUser] = useState<IUser | null>(null);
  const updateCurrentUser = async () => {
    let currentUser;

    try {
      currentUser = await axios.get<IUser>('/api/auth/me');
      if (currentUser.data.username === "") {
        setUser(null);
      } else {
        setUser(currentUser.data);
      }
      await setOnline();
    }
    catch (err) {
      throw new Error('Failed to updateCurrentUser');
    }
  }

  const authenticateUser = async () => {
    if (user) {
      console.log(`user is ${user.username}`);
      await setOnline();
      return;
    }
    return updateCurrentUser();
  }

  const signout = async () => {
    try {
      await axios.get('/api/auth/logout');
      friendWebSocket.disconnect();
      websocket.disconnect();
      setUser(null);
    }
    catch (err) {
      throw new Error('Failed to set twoFactAuth');
    }
  }

  const toggleTwoFactAuth = async () => {
    if (user) {
      const value = !user.usesTwoFactAuth;
      try {
        await axios.patch(`/api/users/${user.id}`, {
          usesTwoFactAuth: value,
        });
      }
      catch (err) {
        throw new Error('Failed to set twoFactAuth');
      }
      setUser({
        ...user,
        usesTwoFactAuth: value,
      });
    }
  }

  const validateTwoFactAuth = async (validationCode: string) => {
    if (user) {
      try {
        await axios.post(`/api/auth/2fa/validate`, {
          code: validationCode
        });
      }
      catch (err) {
        throw new Error('validation failed');
      }
      setUser({
        ...user,
        isAuth: true
      });
    }
  }

  const setOnline = async () => {
    if (!user || !user.isAuth) {
      return;
    }
    friendWebSocket.emit('setOnline', {id: user.id, username: user.username});
  }

  return {
    user,
    authenticateUser,
    signout,
    updateCurrentUser,
    toggleTwoFactAuth,
    validateTwoFactAuth,
    setOnline
  };
}
