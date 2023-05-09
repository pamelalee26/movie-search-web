import React from "react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { Link } from 'react-router-dom';



export default function MoviePage(){
    const { imdbID } = useParams();
    const [movie, setMovie] = useState(null);
    const [ratings, setRatings] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [PrincipalsIDs, setPrincipalsIDs] = useState([]);
    const navigate = useNavigate();

    const principals_columns = [
        { headerName: "Role", field: "category"},
        { headerName: "Name", field: "name", cellRenderer: renderPrincipalsCell},
        { headerName: "Characters", field: "characters"}
    ];

    function renderPrincipalsCell(params) {
        const principal_id = PrincipalsIDs[params.rowIndex];
        const name = params.data.name;
        return (
          <Link to={`/people/${principal_id}`}>{name}</Link>
        );
    }

    useEffect(() => {
        const apiUrl = `http://sefdb02.qut.edu.au:3000/movies/data/${imdbID}`;
        fetch(apiUrl)
          .then(res => res.json())
          .then((data) => {

            const movie = {
                title: data.title,
                year: data.year,
                runtime: data.runtime,
                genre: data.genres.join(", "), // join the array of genres into a string
                country: data.country,
                boxoffice: data.boxoffice,
                poster: data.poster,
                plot: data.plot
            };
            setMovie(movie);

            const ratings = {
                ratings_source_1: data.ratings[0].source,
                ratings_value_1: data.ratings[0].value,

                ratings_source_2: data.ratings[1].source,
                ratings_value_2: data.ratings[1].value,

                ratings_source_3: data.ratings[2].source,
                ratings_value_3: data.ratings[2].value,
            }
            setRatings(ratings);

            const principalIDs = data.principals.map(principal => principal.id);
            setPrincipalsIDs((prevIDs) => [...prevIDs, ...principalIDs]);

            const principals = data.principals.map(principal => ({
                category: principal.category,
                name: principal.name,
                characters: principal.characters.join(', ')
            }));
            setRowData(principals);

          })
          .catch(error => console.log(error)); // log any errors
      }, [imdbID]);


    if (!movie) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "50px" }}>
          <div style={{ display: 'flex', width: '80%', marginTop: '20px' }}>
            <div style={{ flex: '1' }}>
                <p style={{ fontWeight: 'bold', fontSize: '2em' }}>{movie.title}</p>
                <p><strong>Release Year:</strong> {movie.year}</p>
                <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
                <p><strong>Genre(s):</strong> {movie.genre}</p>
                <p><strong>Country:</strong> {movie.country}</p>
                <p><strong>Box Office:</strong>  ${movie.boxoffice}</p>
                <p><strong>Synopsis:</strong> {movie.plot}</p>
            </div>
            <div style={{ marginLeft: '20px' }}>
                <img src={movie.poster} alt="Poster" />
            </div>
            </div>
            <div style={{ display: 'flex', marginTop: '20px', marginBottom: "50px"}}>
                <div style={{ flex: '1', width: "600px"  , marginRight: "100px"}}>
                    <div style={{ height: "301px", width: "600px", border: "1px solid black"}}>
                    <AgGridReact
                        columnDefs={principals_columns}
                        rowData={rowData}
                        pagination
                        onRowClicked={(event) => {
                        const index = event.rowIndex;
                        const PrincipalID = PrincipalsIDs[index];
                        navigate(`/people/${PrincipalID}`);
                        }}
                    />
                    </div>
                </div>
            <div style={{marginRight: "50px"}}>
                <p style={{ fontWeight: 'bold', fontSize: '1em' }}>Reviews</p>
                <p><strong>{ratings.ratings_source_1}</strong>: {ratings.ratings_value_1}</p>
                <p><strong>{ratings.ratings_source_2}</strong>: {ratings.ratings_value_2}</p>
                <p><strong>{ratings.ratings_source_3}</strong>: {ratings.ratings_value_3}</p>
            </div>
            </div>
        </div>
      );
}