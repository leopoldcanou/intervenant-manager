import { Availabilities, TimeSlot } from "@/types/availability";
import { WorkWeek, WeekStatus } from "@/types/workweek";

export function calculateAvailableHours(availabilities: Availabilities, weekNumber: number): number {
  const weekKey = `S${weekNumber}`;
  const weekSlots = availabilities[weekKey] || [];
  
  let totalHours = 0;
  weekSlots.forEach((slot: TimeSlot) => {
    const [startHours, startMinutes] = slot.from.split(':').map(Number);
    const [endHours, endMinutes] = slot.to.split(':').map(Number);
    
    const startInMinutes = startHours * 60 + startMinutes;
    const endInMinutes = endHours * 60 + endMinutes;
    
    const durationInHours = (endInMinutes - startInMinutes) / 60;
    
    // Multiplier par le nombre de jours si le créneau est répété
    const numberOfDays = slot.days.split(/[,\s]+/).filter(Boolean).length;
    totalHours += durationInHours * numberOfDays;
  });

  return Math.round(totalHours * 10) / 10; // Arrondir à 1 décimale
}

export function getRemainingHours(availableHours: number, requiredHours: number): number {
  return Math.max(0, requiredHours - availableHours);
}

export function getWeekStatuses(workweek: WorkWeek[], availabilities: Availabilities): WeekStatus[] {
  return workweek.map(week => {
    const availableHours = calculateAvailableHours(availabilities, week.week);
    const remainingHours = getRemainingHours(availableHours, week.hours);
    
    let status: 'missing' | 'insufficient' | 'ok';
    if (availableHours === 0) {
      status = 'missing';
    } else if (availableHours < week.hours) {
      status = 'insufficient';
    } else {
      status = 'ok';
    }

    return {
      ...week,
      availableHours,
      remainingHours,
      status,
    };
  });
} 