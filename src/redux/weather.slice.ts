import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Weather} from '../interface/api/weather';

export interface WeatherState {
  lastObtainedWeather: Weather | undefined;
}

const initialState: WeatherState = {
  lastObtainedWeather: undefined,
};

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    updateWeather: (state, action: PayloadAction<Weather>) => {
      state.lastObtainedWeather = action.payload;
    },
  },
});

export const {updateWeather} = weatherSlice.actions;

export default weatherSlice.reducer;
