import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface UserState {
  hydrated: boolean;
  isFirstLaunched: boolean;
  name: string;
  location:
    | {
        lat: number;
        long: number;
      }
    | undefined;
}

const initialState: UserState = {
  hydrated: false,
  isFirstLaunched: false,
  name: '',
  location: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.hydrated = action.payload;
    },
    setIsFirstLaunched: (state, action: PayloadAction<boolean>) => {
      state.isFirstLaunched = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setLocation: (
      state,
      action: PayloadAction<{lat: number; long: number}>,
    ) => {
      state.location = action.payload;
    },
  },
});

export const {setHydrated, setIsFirstLaunched, setName, setLocation} =
  userSlice.actions;

export default userSlice.reducer;
