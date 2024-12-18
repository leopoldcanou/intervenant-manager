export function getDateOfWeekday(dayName: string, weekNumber: number, year: number) {
  const daysToWeek = (weekNumber - 1) * 7;
  
  const firstDayOfWeek = new Date(year, 0, 1 + daysToWeek);
  while (firstDayOfWeek.getDay() !== 1) {
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 1);
  }

  const dayOffset: { [key: string]: number } = {
    "Monday": 0,
    "Tuesday": 1,
    "Wednesday": 2,
    "Thursday": 3,
    "Friday": 4,
    "Saturday": 5,
    "Sunday": 6
  };

  const result = new Date(firstDayOfWeek);
  result.setDate(firstDayOfWeek.getDate() + dayOffset[dayName]);
  
  return result.toISOString().split('T')[0];
}

export function getWeekNumber(date: Date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
} 