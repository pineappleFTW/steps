export interface SumHealthData {
  date: string;
  totalSteps: number;
  totalDistances: number;
  steps: HealthValue[];
  distances: HealthValue[];
}

export interface HealthValue {
  startDate: string;
  endDate: string;
  value: number;
}
