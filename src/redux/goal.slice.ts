import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface GoalPayload {
  date: string;
  steps: number;
}

export interface GoalState {
  goals: Record<string, {steps: number}>;
}

const initialState: GoalState = {
  goals: {},
};

export const goalSlice = createSlice({
  name: 'goal',
  initialState,
  reducers: {
    addOrUpdateStepGoals: (state, action: PayloadAction<GoalPayload>) => {
      state.goals[action.payload.date] = {steps: action.payload.steps};
    },
  },
});

export const {addOrUpdateStepGoals} = goalSlice.actions;

export default goalSlice.reducer;
