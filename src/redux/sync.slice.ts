import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface SyncState {
  lastSync: string | undefined;
}

const initialState: SyncState = {
  lastSync: undefined,
};

export const introSlice = createSlice({
  name: 'intro',
  initialState,
  reducers: {
    setLastSync: (state, action: PayloadAction<string>) => {
      state.lastSync = action.payload;
    },
  },
});

export const {setLastSync} = introSlice.actions;

export default introSlice.reducer;
