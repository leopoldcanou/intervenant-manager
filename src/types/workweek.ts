export interface WorkWeek {
  week: number;
  hours: number;
}

export interface WeekStatus {
  week: number;
  hours: number;
  availableHours: number;
  remainingHours: number;
  status: 'missing' | 'insufficient' | 'ok';
} 