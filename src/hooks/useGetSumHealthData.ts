import {isAfter, isSameDay, parseISO, sub} from 'date-fns';
import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {HealthData} from '../interface/health-data';
import {SumHealthData} from '../interface/sum-health-data';
import {RootState} from '../redux/store';
import {getDateBetweeenRange} from '../utils/date.utils';

const mergeSort = (s: HealthData[], d: HealthData[]): SumHealthData[] => {
  let steps = [...s];
  let distances = [...d];
  let temp: SumHealthData[] = [];

  while (steps.length !== 0 && distances.length !== 0) {
    const step = parseISO(steps[0].date);
    const distance = parseISO(distances[0].date);

    if (isSameDay(step, distance)) {
      const sumHealthData: SumHealthData = {
        date: isAfter(step, distance)
          ? step.toISOString()
          : distance.toISOString(),
        totalSteps: steps[0].total,
        totalDistances: distances[0].total,
        steps: steps[0].list,
        distances: distances[0].list,
      };

      temp.push(sumHealthData);
      steps.shift();
      distances.shift();
    } else if (isAfter(step, distance)) {
      const sumHealthData: SumHealthData = {
        date: step.toISOString(),
        totalSteps: steps[0].total,
        totalDistances: 0,
        steps: steps[0].list,
        distances: [],
      };

      temp.push(sumHealthData);
      steps.shift();
    } else {
      const sumHealthData: SumHealthData = {
        date: distance.toISOString(),
        totalSteps: 0,
        totalDistances: distances[0].total,
        steps: [],
        distances: distances[0].list,
      };

      temp.push(sumHealthData);
      distances.shift();
    }
  }

  while (steps.length !== 0) {
    const step = parseISO(steps[0].date);

    const sumHealthData: SumHealthData = {
      date: step.toISOString(),
      totalSteps: steps[0].total,
      totalDistances: 0,
      steps: steps[0].list,
      distances: [],
    };

    temp.push(sumHealthData);
    steps.shift();
  }

  while (distances.length !== 0) {
    const distance = parseISO(distances[0].date);

    const sumHealthData: SumHealthData = {
      date: distance.toISOString(),
      totalSteps: 0,
      totalDistances: distances[0].total,
      steps: [],
      distances: distances[0].list,
    };

    temp.push(sumHealthData);
    distances.shift();
  }

  return temp;
};

export const calculateSumHealthData = (
  steps: HealthData[],
  distances: HealthData[],
  getEachDay: boolean,
): SumHealthData[] => {
  const sumHealthData = mergeSort(steps, distances);

  if (getEachDay) {
    const currentDate = new Date();
    const past7DaysDate = sub(currentDate, {
      days: 7,
    });
    const dateRange = getDateBetweeenRange(past7DaysDate, currentDate);

    const pastWeekHealthData = dateRange.map(date => {
      const found = sumHealthData.find(healthData => {
        if (isSameDay(date, parseISO(healthData.date))) {
          return healthData;
        }
      });

      if (found) {
        return found;
      }

      return {
        date: date.toISOString(),
        totalSteps: 0,
        totalDistances: 0,
        steps: [],
        distances: [],
      };
    });

    return pastWeekHealthData;
  } else {
    return sumHealthData;
  }
};

export const useGetSumHealthData = (
  getEachDay: boolean = false,
): SumHealthData[] => {
  const steps = useSelector((state: RootState) => state.health.steps);
  const distances = useSelector((state: RootState) => state.health.distances);

  return useMemo(
    () => calculateSumHealthData(steps, distances, getEachDay),
    [steps, distances],
  );
};
