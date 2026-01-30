export function isValidTimeRange(startTime: string, endTime: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    return false;
  }

  const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return toMinutes(startTime) < toMinutes(endTime);
}
