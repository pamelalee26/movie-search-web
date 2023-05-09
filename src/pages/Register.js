import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = `http://sefdb02.qut.edu.au:3000`;

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const register = () => {
    const url = `${API_URL}/user/register`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.status === 409) {
          alert('User already exists.');
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
        alert('Registration successful! Please login with your new account!');
        navigate('/'); // navigate to the home page
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    register();
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', marginLeft: "400px", marginRight: "100px", marginBottom: "150px", marginTop: "100px"}}>
      <h1>Registration Page</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', width: "50%"}}>
          <label htmlFor="email">Email:</label>
          <input id="email" name="email" type="email" value={email} onChange={handleChange} required />
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
            required
          />
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" style={{ marginTop: '20px', width: "200px", marginLeft: "60px"}}>Register</button>
        </div>
      </form>
    </div>
  );
  

}
