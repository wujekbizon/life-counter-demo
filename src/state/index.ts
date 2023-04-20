import { configureStore } from '@reduxjs/toolkit';
import { modalReducer, openSideMenu, closeSideMenu } from './slices/modalSlice';
import {
  playersReducer,
  addLife,
  subtractLife,
  changeName,
  subtractLifeByAmount,
  addLifeByAmount,
  setGameOver,
  resetGame,
  setStartingLife,
  setNumberOfPlayers,
  setDefaultPlayers,
} from './slices/playersSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    player: playersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const actionCreators = {
  openSideMenu,
  closeSideMenu,
  addLife,
  subtractLife,
  changeName,
  subtractLifeByAmount,
  addLifeByAmount,
  setGameOver,
  resetGame,
  setStartingLife,
  setNumberOfPlayers,
  setDefaultPlayers,
};
