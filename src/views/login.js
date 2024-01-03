import React from "react";
import { useState } from "react";
import { url } from "../serevices/config";
import Form from "../components/form";

function Login() {
  const [inputs, setInputs] = useState([{
    name: 'email',
    key: 'email',
    type: 'email',
    label: 'אימייל',
    defaultValue: ''
  }, {
    name: 'password',
    key: 'password',
    type: 'password',
    label: 'סיסמא',
    defaultValue: ''
  }]);

  const [error, setError] = useState(null);
  const onSubmit = async (data) => {
    let error = false;
    try {
      const res = await fetch(url + 'auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })



      const resData = await res.json();

      if (!res.ok) {
        const err = new Error(resData.message);
        throw err;
      }
      localStorage.setItem('token', resData.token);
      window.location.assign('/');
    }
    catch (err) {
      console.log(err)
      setError(err.message);
    }
  }
  return (
    <Form
      error={error}
      inputs={inputs}
      onSubmit={onSubmit}
    ></Form>
  )

}
export default Login;