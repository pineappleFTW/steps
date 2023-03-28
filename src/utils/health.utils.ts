/* Permission options */
import {isSameDay, parseISO, sub} from 'date-fns';
import AppleHealthKit, {
  HealthKitPermissions,
  HealthValue,
} from 'react-native-health';
import {HealthData} from '../interface/health-data';
import {syncDistances, syncSteps} from '../redux/health.slice';
import {store} from '../redux/store';
import {setLastSync} from '../redux/sync.slice';

export const appleHealthPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
    ],
    write: [],
  },
} as HealthKitPermissions;

export const initiateAppleHealthKit = () => {
  AppleHealthKit.initHealthKit(
    appleHealthPermissions,
    (error: string, results: HealthValue) => {
      /* Called after we receive a response from the system */

      if (error) {
        console.log('[ERROR] Cannot grant permissions!');
      }
      console.log(results);
    },
  );
};

export const processHealthValue = (results: HealthValue[]): HealthData[] => {
  const transformed: HealthData[] = [];

  for (let i = 0; i < results.length; i++) {
    const date = parseISO(results[i].startDate);
    if (transformed.length === 0) {
      transformed.push({
        date: date.toISOString(),
        total: results[i].value,
        list: [results[i]],
      });
    } else {
      const latest = transformed[transformed.length - 1];
      if (isSameDay(parseISO(latest.date), date)) {
        const newTotal = latest.total + results[i].value;
        const newSteps = [...latest.list, results[i]];

        transformed[transformed.length - 1] = {
          ...latest,
          total: newTotal,
          list: newSteps,
        };
      } else {
        transformed.push({
          date: date.toISOString(),
          total: results[i].value,
          list: [results[i]],
        });
      }
    }
  }

  return transformed;
};

export const getSevenDayStepHistory = () => {
  const currentDate = new Date();
  const past7DaysDate = sub(currentDate, {
    days: 7,
  });

  const options = {
    startDate: past7DaysDate.toISOString(),
    endDate: new Date().toISOString(),
  };
  AppleHealthKit.getDailyDistanceWalkingRunningSamples(
    options,
    (err: Object, results: HealthValue[]) => {
      if (err) {
        return;
      }

      const processed = processHealthValue(results);
      store.dispatch(syncDistances(processed));
      store.dispatch(setLastSync(new Date().toISOString()));
    },
  );
  AppleHealthKit.getDailyStepCountSamples(
    options,
    (callbackError: string, results: HealthValue[]) => {
      if (callbackError) {
        return;
      }
      const processed = processHealthValue(results);
      store.dispatch(syncSteps(processed));
      store.dispatch(setLastSync(new Date().toISOString()));
    },
  );
};
