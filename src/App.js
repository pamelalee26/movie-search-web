import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Login from './pages/Login';
import Register from './pages/Register';
import MoviePage from './pages/MoviePage';
import Person from './pages/Person';
import UserContext from './pages/UserContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function App() {
  
  useEffect(() => {
    const fetchRefreshToken = async () => {
      try {
        const response = await fetch('http://sefdb02.qut.edu.au:3000/user/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: localStorage.getItem('refreshToken'),
          }),
        });
        
        // response did not fail
        if (response.ok) {
          const { bearerToken, refreshToken } = await response.json();
          localStorage.setItem('bearerToken', bearerToken.token);
          localStorage.setItem('refreshToken', refreshToken.token);
          console.log("Token has been successfully refreshed.");
        } else {
          const errorResponse = await response.json();
          if(errorResponse.message === "Request body incomplete, refresh token required"){
            console.log("USER IS NOT LOGGED IN. there is no need to refresh the token.");
          }
          else if(errorResponse.message === "JWT token has expired"){
            console.log("Your session has expired. Please log in again");
            alert("Your session has expired. Please log in again.");
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('bearerToken');
          }
          else{
            console.log(errorResponse.message);
          }
        }
      } catch (error) {
        // handle fetch error
        console.log(error);
        
      }
    };

    const refreshTokenTimer = setInterval(fetchRefreshToken, 9 * 60 * 1000); // Refresh token every 9 minutes

    return () => clearInterval(refreshTokenTimer);
  }, []);
    const [userEmail, setUserEmail] = useState('');
    console.log("email in App", userEmail);
    
    return (
    <BrowserRouter>
      <UserContext.Provider value={{ userEmail, setUserEmail }}>
        <div className="App">
          <Header userEmail={userEmail}/>
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/movies/*" element={<Movies />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/movies/:imdbID" element={<MoviePage />} />
              <Route path="/people/:principalID" element={<Person />} />
            </Routes>
          <Footer />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}