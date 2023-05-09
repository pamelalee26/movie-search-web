import React from "react";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import Histogram from "./Histogram";

export default function Person(){
    const {principalID} = useParams();
    const [principal, setPrincipal] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const roles_columns = [
        { headerName: "Role", field: "category"},
        { headerName: "Movie", field: "movieName"},
        { headerName: "Rating", field: "imdbRating"},
    ];

    useEffect(() => {
        const token = localStorage.getItem("refreshToken");
        const apiUrl = `http://sefdb02.qut.edu.au:3000/people/${principalID}`;
        fetch(apiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
        })
          .then(res => res.json())
          .then((data) => {

            const principal_data = {
                name: data.name,
                birthYear: data.birthYear,
                deathYear: data.deathYear,
                roles: data.roles.join(","),
            };

            setPrincipal(principal_data);
            const rating = data.roles.map(role => role.imdbRating);
            setRatings(rating);

            const roles = data.roles.map(role => ({
                movieName: role.movieName,
                movieId: role.movieId,
                category: role.category,
                characters: role.characters.join(","),
                imdbRating: role.imdbRating
            }))
            setRowData(roles);

          })
          .catch(error => {
              console.log(error); // log any errors
              setError(error);
          });
      }, [principalID]);

   if (error) {
        return( 
            <div style={{textAlign: "center", marginTop: "100px", marginBottom: "300px"}}>
                <p>You are not able to view this information as you are not logged in.</p>
                <button onClick={() => navigate(`/login`)}>Login Here</button>
                <p>Don't have an account?</p>
                <button onClick={() => navigate(`/register`)}>Register Here</button>
            </div>
        );
      
    }
    if (!principal) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{marginLeft: '100px', marginRight: "100px", marginTop: "100px"}}>
            <p style={{ fontWeight: 'bold', fontSize: '2em' }}>{principal.name}</p>
            <p>{principal.birthYear} - {principal.deathYear}</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
                <div style={{ width: '600px', height: '300px', border: "1px solid black"}}>
                    <AgGridReact
                    columnDefs={roles_columns}
                    rowData={rowData}
                    pagination
                    onRowClicked={(event) => {
                        navigate(`/movies/${event.data.movieId}`);
                    }}
                    />
                </div>
            </div>
            <div style={{ width: '400px', height: '200px', marginBottom: "100px", marginLeft: "250px"}}>
                <Histogram ratings={ratings} />
            </div>
        </div>
    );
    
}