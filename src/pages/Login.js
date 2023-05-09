import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from './UserContext';

const API_URL = `http://sefdb02.qut.edu.au:3000`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUserEmail } = useContext(UserContext); // access setUserEmail function from UserContext

  const login = () => {
    const url = `${API_URL}/user/login`;
    return fetch(url, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email: email, password: password}),
    })
    .then((res) => {
      if (res.status === 401){
        alert("Invalid email or password");
      }
      return res.json()
    })
    .then((res) => {
      console.log(res);
      localStorage.setItem("bearerToken", res.bearerToken.token);
      localStorage.setItem("refreshToken", res.refreshToken.token);
      setUserEmail(email); // store user's email in context
      alert("Login successful! You will be directed to the home page...");
      navigate('/'); // navigate to the home page
    })
    .catch((error) => console.log(error));
  };

  const handleSubmit = event => {
    event.preventDefault();
    login();
  };

  const handleChange = event => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', marginLeft: "400px", marginRight: "100px", marginBottom: "100px", marginTop: "100px"}}>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: "50%"}}>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" value={email} onChange={handleChange} required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" value={password} onChange={handleChange} required />        
        <button type="submit" style={{ marginTop: '20px', width: "200px", marginLeft: "60px"}}>Login</button>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', marginRight: "300px"}}> 
        <p> Don't have an account yet? </p>
        <Link to="/register">Register Now!</Link>
      </div>
    </div>
  );
}


