import {offline} from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import {combineReducers, configureStore, StoreEnhancer} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import {useDispatch} from 'react-redux';
import Reactotron from '../config/reactotron.config';
import {weatherApi} from '../service/weather.api';
import goalSlice from './goal.slice';
import healthSlice from './health.slice';
import syncSlice from './sync.slice';
import userSlice, {setHydrated} from './user.slice';
import weatherSlice from './weather.slice';

const enhancers = [
  Reactotron.createEnhancer!(),
  offline({
    ...offlineConfig,
    persistCallback: () => {
      store.dispatch(setHydrated(true));
    },
    persistOptions: {
      blacklist: [weatherApi.reducerPath],
    },
  }) as StoreEnhancer,
];

const combinedReducer = combineReducers({
  sync: syncSlice,
  health: healthSlice,
  goal: goalSlice,
  user: userSlice,
  weather: weatherSlice,
  [weatherApi.reducerPath]: weatherApi.reducer,
});

const rootReducer = (state: any, action: any) => {
  if (
    action.type == 'authApi/executeMutation/fulfilled' &&
    action.meta?.arg?.endpointName == 'logout'
  ) {
    //only working for slice now and rtk with param
    const {intro} = state;
    state = {intro};
  }

  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(weatherApi.middleware),
  enhancers: enhancers,
});

setupListeners(store.dispatch);

export const useAppDispatch: () => AppDispatch = useDispatch;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
