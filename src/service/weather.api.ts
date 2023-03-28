import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {WEATHER_API_KEY} from '../config/default';
import {Weather} from '../interface/api/weather';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery(),
  tagTypes: ['weather'],
  endpoints: build => ({
    getWeather: build.query<Weather, {lat: string; lon: string}>({
      query: args => ({
        url: `https://api.openweathermap.org/data/2.5/weather`,
        method: 'GET',
        params: {
          ...args,
          units: 'metric',
          appid: WEATHER_API_KEY,
        },
      }),
    }),
  }),
});

export const {useGetWeatherQuery} = weatherApi;
