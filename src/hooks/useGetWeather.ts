import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {updateWeather} from '../redux/weather.slice';
import {useGetWeatherQuery} from '../service/weather.api';

export const useGetWeather = () => {
  const dispatch = useDispatch();
  const weather = useSelector(
    (state: RootState) => state.weather.lastObtainedWeather,
  );
  const location = useSelector((state: RootState) => state.user.location);
  const {data, isError, ...props} = useGetWeatherQuery(
    {
      lat: location?.lat.toString() ?? '',
      lon: location?.long.toString() ?? '',
    },
    {skip: location === undefined},
  );

  useEffect(() => {
    if (data && data !== weather) {
      dispatch(updateWeather(data));
    }
  }, [data, weather]);

  if (isError && weather) {
    console.log('error');
    return {
      data: weather,
      isError,
      ...props,
    };
  }

  return {
    data,
    isError,
    ...props,
  };
};
