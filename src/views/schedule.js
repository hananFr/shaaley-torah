import React, { useEffect, useState } from "react";
import { url } from "../serevices/config";
import ScheduleTable from "../components/schedule-table";
import ScheduleForm from "./set-schedule";
import { Link } from "react-router-dom";

function Schedule({ user }) {
  const [userParams, setUserParams] = useState(user._id);
  const [schedule, setSchedule] = useState();
  const [users, setUsers] = useState()
  const [countHour, setCountHour] = useState(0);



  const fetchSchedule = async () => {

    try {
      const response = await fetch(`${url}schedule/${userParams}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCountHour(0);
        setSchedule(data);
      } else {
        console.error('Failed to fetch schedule');
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };


  const setTheUsers = () => {
    if (user.admin) {
      fetch(url + 'auth', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(res => {

        return res.json();
      }).then(resUsers => {
        setUsers(resUsers.users);
      })
        .catch(err => console.log(err));
    }
  }


  useEffect(() => {
    setTheUsers();
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [userParams]);

  useEffect(() => {
    if (schedule) {
      Object.keys(schedule).map(key => {
        if (Array.isArray(schedule[key])) {
          setCountHour(prevCount => prevCount += schedule[key].length);
        };
      });
    };
  }, [schedule]);




  return <React.Fragment>
    {user.admin && <select onChange={(e) => {
      setUserParams(e.target.value);
    }}>
      <option>בחר עובד</option>
      {users && users.map(employee => <option value={employee._id}>{employee.name}</option>)}
    </select>}
    {schedule && <h1>סך הכל: {countHour} שעות</h1>}
    {schedule && <div>
      {!user.admin && <Link to={'/update-schedule/' + user._id}> <button>ערוך</button></Link>}
      <ScheduleTable schedule={schedule} />
    </div>}
    {!user.admin && !schedule && <ScheduleForm />}
  </React.Fragment>

}

export default Schedule;