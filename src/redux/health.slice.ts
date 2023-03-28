import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {HealthData} from '../interface/health-data';

export interface HealthState {
  steps: HealthData[];
  distances: HealthData[];
}

const initialState: HealthState = {
  steps: [],
  distances: [],
};

export const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    syncSteps: (state, action: PayloadAction<HealthData[]>) => {
      state.steps = action.payload;
    },
    resetSteps: (state, action: PayloadAction<void>) => {
      state.steps = [];
    },
    syncDistances: (state, action: PayloadAction<HealthData[]>) => {
      state.distances = action.payload;
    },
    resetDistances: (state, action: PayloadAction<void>) => {
      state.distances = [];
    },
    resetAll: (state, action: PayloadAction<void>) => {
      state.steps = [];
      state.distances = [];
    },
  },
});

export const {syncSteps, resetSteps, syncDistances, resetDistances, resetAll} =
  healthSlice.actions;

export default healthSlice.reducer;
