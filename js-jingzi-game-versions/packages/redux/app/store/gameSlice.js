import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  history: [Array(9).fill(null)],
  currentMove: 0,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    handlePlay: (state, action) => {
      const nextHistory = [
        ...state.history.slice(0, state.currentMove + 1),
        action.payload,
      ];
      state.history = nextHistory;
      state.currentMove = nextHistory.length - 1;
    },
    jumpTo: (state, action) => {
      state.currentMove = action.payload;
    },
  },
});

export const { handlePlay, jumpTo } = gameSlice.actions;

export default gameSlice.reducer;