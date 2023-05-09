import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

// navigation links
export default function Nav({ userEmail }) {
  const isLoggedIn = !!localStorage.getItem('refreshToken');
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      alert('Refresh token not found! User is not logged in!');
      return;
    }

    try {
      const response = await fetch('http://sefdb02.qut.edu.au:3000/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('bearerToken');
        alert("You have logged out successfully!");
        navigate('/');
      } else {
        const data = await response.json();
        if (data.message === "JWT token has expired") {
          alert("Your session has expired. Please log in again.");
          // remove refreshToken and bearerToken if there is an error and JWT authentication expires.
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('bearerToken');
          navigate("/login");
        }
        else {
          alert(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while logging out. Please try again.');
    }
  };
  console.log("username in nav", userEmail);

  return (
    <nav style={{ width: "100%", height: "50%" , marginRight: "30px"}}>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/movies">Movies</Link></li>

        {isLoggedIn ? (
          <>
            <li>
              <span>Welcome, {userEmail}</span>
            </li>
            <li>
              <button onClick={handleLogoutClick}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}

      </ul>
    </nav>
  );
}
