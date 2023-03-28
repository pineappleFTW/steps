import {add, format, isBefore, isEqual, parseISO} from 'date-fns';

export const getDateBetweeenRange = (startDate: Date, endDate: Date) => {
  const dateArray: Date[] = [];
  let currentDate = startDate;

  while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
    dateArray.push(currentDate);
    currentDate = add(currentDate, {days: 1});
  }

  return dateArray.reverse();
};

export const displayTimeOnlyFromString = (date: string) => {
  return format(parseISO(date), 'hh:mm aaa');
};
