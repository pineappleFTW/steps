import * as Location from 'expo-location';
import {store} from '../redux/store';
import {setLocation} from '../redux/user.slice';

export const getLocation = async (
  callback?: (status: Location.PermissionStatus) => void,
) => {
  try {
    let {status} = await Location.requestForegroundPermissionsAsync();
    console.log(status);

    if (callback) {
      callback(status);
    }

    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      store.dispatch(
        setLocation({
          lat: location.coords.latitude,
          long: location.coords.longitude,
        }),
      );
    }
  } catch (err) {
    console.log(err);
  }
};

export const getPermission = async (
  callback?: (status: Location.PermissionStatus) => void,
) => {
  try {
    let {status} = await Location.getForegroundPermissionsAsync();
    console.log(status);
    if (callback) {
      callback(status);
    }
  } catch (err) {
    console.log(err);
  }
};
