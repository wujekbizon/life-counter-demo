import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  players: [
    {
      playerId: nanoid(),
      playerLife: 20,
      playerName: 'DefaultPlayer',
    },
    {
      playerId: nanoid(),
      playerLife: 20,
      playerName: 'DefaultPlayer',
    },
  ],
  isGameOver: false,
};

const playersSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setGameOver(state, { payload }) {
      const foundPlayer = state.players.find(
        (player) => player.playerId === payload.id
      );

      if (!foundPlayer) {
        return;
      }
      foundPlayer.playerLife = 0;
      state.isGameOver = true;
    },
    subtractLife(state, { payload }) {
      const foundPlayer = state.players.find(
        (player) => player.playerId === payload.id
      );

      if (!foundPlayer) {
        return;
      }
      foundPlayer.playerLife =
        foundPlayer.playerLife <= 0 ? 0 : foundPlayer.playerLife - 1;
    },
    subtractLifeByAmount(state, { payload }) {
      const foundPlayer = state.players.find(
        (player) => player.playerId === payload.id
      );

      if (!foundPlayer) {
        return;
      }

      foundPlayer.playerLife =
        foundPlayer.playerLife <= 0
          ? 0
          : foundPlayer.playerLife - payload.amount;
    },
    addLife(state, { payload }) {
      const foundPlayer = state.players.find(
        (player) => player.playerId === payload.id
      );

      if (!foundPlayer) {
        return;
      }
      foundPlayer.playerLife = foundPlayer.playerLife + 1;
    },
    addLifeByAmount(state, { payload }) {
      const foundPlayer = state.players.find(
        (player) => player.playerId === payload.id
      );

      if (!foundPlayer) {
        return;
      }

      foundPlayer.playerLife = foundPlayer.playerLife + payload.amount;
    },

    changeName(state, { payload }) {
      const foundPlayer = state.players.find(
        (player) => player.playerId === payload.id
      );

      if (!foundPlayer) {
        return;
      }
      foundPlayer.playerName = payload.name;
    },
    resetGame(state) {
      state.isGameOver = false;
      const resetPlayers = state.players.map((player) => ({
        ...player,
        playerLife: 20,
      }));

      state.players = resetPlayers;
    },

    setStartingLife(state, { payload }) {
      state.isGameOver = false;

      const newStartPlayers = state.players.map((player) => ({
        ...player,
        playerLife: payload.life,
      }));

      state.players = newStartPlayers;
    },

    setNumberOfPlayers(state, { payload }) {
      const { multiplier, player } = payload;

      for (let i = 2; i < multiplier; i++) {
        state.players.push({ ...player, playerId: nanoid() });
      }
    },

    setDefaultPlayers(state) {
      state.players = initialState.players;
    },
  },
});

export const {
  subtractLife,
  addLife,
  changeName,
  subtractLifeByAmount,
  addLifeByAmount,
  setGameOver,
  resetGame,
  setStartingLife,
  setNumberOfPlayers,
  setDefaultPlayers,
} = playersSlice.actions;
export const playersReducer = playersSlice.reducer;
