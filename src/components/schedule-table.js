import React from 'react';
import styles from './schedule-table.module.css';

const daysTranslation = {
  'sunday': 'ראשון',
  'monday': 'שני',
  'tuesday': 'שלישי',
  'wednesday': 'רביעי',
  'thursday': 'חמישי',
  'friday': 'שישי',
  // אם יש צורך תוסיף 'saturday': 'שבת',
};

const ScheduleTable = ({ schedule }) => {
  const days = Object.keys(schedule).filter(day => Array.isArray(schedule[day]));

  const maxEventsPerDay = Math.max(...days.map(day => schedule[day].length));

  const scheduleRows = Array.from({ length: maxEventsPerDay }, (_, hourIndex) => {
    return days.map(day => schedule[day][hourIndex] || {});
  });

  return (
    <div className={styles.scheduleTableContainer}>
      <table className={styles.scheduleTable}>
        <thead>
          <tr>
            {days.map(day => (
              <th key={day} className={styles.scheduleHeader}>
                {daysTranslation[day.toLowerCase()] || day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scheduleRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((event, eventIndex) => (
                <td key={event._id || `${rowIndex}-${eventIndex}`} className={styles.scheduleCell}>
                  <div className={styles.eventName}>{event.name || ''}</div>
                  <div className={styles.eventHour}>{event.hour || ''}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
