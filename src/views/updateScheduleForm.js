import React, { useState, useEffect } from 'react';
import styles from './set-schedule.module.css'; // ייבוא CSS Modules
import { url } from '../serevices/config';
import { useParams } from 'react-router-dom';

function UpdateScheduleForm() {
  let { scheduleId } = useParams();

  const initialSchedule = {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
  };

  const [schedule, setSchedule] = useState(initialSchedule);

  useEffect(() => {
    console.log(`${url}schedule/${scheduleId}`)
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`${url}schedule/${scheduleId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setSchedule(data);
        } else {
          console.error('Failed to fetch schedule');
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchSchedule();
  }, [scheduleId]);

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
    try {
      const response = await fetch(`${url}schedule/${scheduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(schedule)
      });

      if (response.ok) {
        console.log('Schedule updated successfully');
      } else {
        console.error('Failed to update schedule');
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const renderScheduleInput = (day) => {
    if (!Array.isArray(schedule[day])) {
      return null; // או כל טיפול אחר שתרצה
    }
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
      <h2>Update Schedule</h2>
      {Object.keys(schedule).map((day) => (
        day !== 'employee' && day !== '__v' && day !== '_id' && (
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

      <button type="submit" className={styles.button}>Update Schedule</button>
    </form>
  );
}

export default UpdateScheduleForm;
