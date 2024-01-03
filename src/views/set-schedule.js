import React, { useState } from 'react';
import styles from './set-schedule.module.css'; // ייבוא CSS Modules
import { url } from '../serevices/config';

function ScheduleForm() {
  const initialDaySchedule = () => [{ name: '', hour: '' }];

  const initialSchedule = {
    sunday: initialDaySchedule(),
    monday: initialDaySchedule(),
    tuesday: initialDaySchedule(),
    wednesday: initialDaySchedule(),
    thursday: initialDaySchedule(),
    // friday: initialDaySchedule(),


  };

  const [schedule, setSchedule] = useState(initialSchedule);

  const handleInputChange = (day, index, event) => {
    const updatedDay = schedule[day].map((item, i) => {
      if (i === index) {
        return { ...item, [event.target.name]: event.target.value };
      }
      return item;
    });

    setSchedule({ ...schedule, [day]: updatedDay });
  };

  const handleAddSlot = (day) => {
    setSchedule({ ...schedule, [day]: [...schedule[day], { name: '', hour: '' }] });
  };

  const handleRemoveSlot = (day, index) => {
    setSchedule({ ...schedule, [day]: schedule[day].filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(schedule)
    try {
      console.log(`${url}schedule/create`)
      const response = await fetch(url + 'schedule/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(schedule)
      });

      if (response.ok) {
        console.log('Schedule submitted successfully');
      } else {
        console.error('Failed to submit schedule');
      }
    } catch (error) {
      console.error('Error submitting schedule:', error);
    }
  };

  const renderScheduleInput = (day) => {
    return schedule[day].map((slot, index) => (
      <div key={index} className={styles.daySchedule}>
        <input
          type="text"
          name="name"
          placeholder="studentName"
          value={slot.name}
          onChange={(e) => handleInputChange(day, index, e)}
          className={styles.input}
        />
        <input
          type="text"
          name="hour"
          placeholder="Hour"
          value={slot.hour}
          onChange={(e) => handleInputChange(day, index, e)}
          className={styles.input}
        />
        {schedule[day].length > 1 && (
          <button
            type="button"
            onClick={() => handleRemoveSlot(day, index)}
            className={`${styles.button} ${styles.removeBtn}`}
          >
            Remove
          </button>
        )}
      </div>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2>Schedule Form</h2>
      {Object.keys(schedule).map((day) => (
        day !== 'employee' && (
          <div key={day}>
            <h3 className={styles.dayTitle}>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
            {renderScheduleInput(day)}
            <button
              type="button"
              onClick={() => handleAddSlot(day)}
              className={`${styles.button} ${styles.addBtn}`}
            >
              Add Slot
            </button>
          </div>
        )
      ))}

      <button type="submit" className={styles.button}>Submit Schedule</button>
    </form>
  );
}

export default ScheduleForm;
