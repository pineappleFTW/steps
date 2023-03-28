export interface HealthData {
  date: string;
  total: number;
  list: {
    startDate: string;
    endDate: string;
    value: number;
  }[];
}
