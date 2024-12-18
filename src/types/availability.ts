export interface TimeSlot {
  days: string;
  from: string;
  to: string;
}

export interface Availabilities {
  default?: TimeSlot[];
  [key: `S${number}`]: TimeSlot[];
} 