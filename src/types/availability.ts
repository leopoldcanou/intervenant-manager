export interface TimeSlot {
  days: string;
  from: string;
  to: string;
}

export interface Availabilities {
  default?: TimeSlot[];
  [key: string]: TimeSlot[] | undefined;
} 