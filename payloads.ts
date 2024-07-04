const scheduleForPermission = {
  name: 'schedule-for-permission',
  scheduleType: 'custom', // custom, 24/7, monday-friday
  customSchedule: {
    timeZone: 'America/New_York',
    Monday: { startTime: '09:00', endTime: '17:00' },
    Tuesday: { startTime: '09:00', endTime: '17:00' },
    Wednesday: { startTime: '09:00', endTime: '17:00' },
    Thursday: { startTime: '09:00', endTime: '17:00' },
    Friday: { startTime: '09:00', endTime: '17:00' },
    Saturday: { startTime: '10:00', endTime: '14:00' },
    Sunday: { startTime: '10:00', endTime: '14:00' },
  }, // null / undefined if not custom
};
