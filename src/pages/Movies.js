import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "./Movies.css"; 

import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

/* SEARCH BAR FUNCTION */
function SearchBar({ onSearch }) {
  const [searchText, setSearchText] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    onSearch(searchText);
  }

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
    <p> Start searching from thousands of movies! </p>
      <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center" , marginTop: "10px", justifyContent: "center"}}>
        <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{width: "30%", padding: "0.5em"}}/>
        <button type="submit" style={{width: "5em", marginLeft: "0.5em"}}>Search</button>
      </form>
    </div>
  );
}

/*YEAR DROPDOWN FUNCTION*/
function YearSelection({ onSearch }) {
  const [year, setYear] = useState("");

  function handleSelection(e) {
    e.preventDefault();
    onSearch(year);
  }

  // generate the options for the year dropdown
  const yearOptions = [];
  for (let y = 2023; y >= 1990; y--) {
    yearOptions.push(<option key={y} value={y}>{y}</option>);
  }

  return (
    <div style={{ textAlign: "center"}}>
      <form onSubmit={handleSelection} style={{ display: "flex", alignItems: "center", marginTop: "10px", justifyContent: "center"}}>
        <select value={year} onChange={(e) => setYear(e.target.value)} style={{width: "10%", marginLeft: "0.5em", padding: "0.5em"}}>
          <option value="">Year</option>
          {yearOptions}
        </select>
        <button type="submit" style={{width: "100px", marginLeft: "0.5em", fontSize: "15px", textAlign: "center"}}>Confirm</button>
      </form>
    </div>
  );
}

export default function Movies() {
  const [rowData, setRowData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [imdbIDs, setImdbIDs] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [year, setYear] = useState("");

  const columns = [
    { headerName: "Title", field: "title", filter: true, width: 200, cellRenderer: renderTitleCell, sortable: true},
    { headerName: "Year", field: "year", width: 100, sortable: true},
    { headerName: "IMDB Rating", field: "imdbRating", width: 100, sortable: true},
    { headerName: "RottenTomatoes", field: "rottenTomatoesRating", width: 100, sortable: true},
    { headerName: "Metacritic", field: "metacriticRating", width: 100, sortable: true},
    { headerName: "Rated", field: "classification", width: 100, sortable: true},
  ];

  function renderTitleCell(params) {
    const imdbID = params.data.imdbID;
    const title = params.data.title;
    return (
      <Link to={`/movies/${imdbID}`}>{title}</Link>
    );
  }
  
  useEffect(() => {
    const API_URL = "http://sefdb02.qut.edu.au:3000/movies/search";
    let url = API_URL;
    
    if (searchText) {
      url += `?title=${searchText}`;
    }
    
    if (year) {
      url += `${searchText ? '&' : '?'}year=${year}`;
    }
    
    if (currentPage) {
      url += `${searchText || year ? '&' : '?'}page=${currentPage}`;
    }
  
    fetch(url)
      .then((res) => res.json())
      .then((data) => data.data)
      .then((data) =>
        data.map((movie) => {
          setImdbIDs((prevImdbIDs) => [...prevImdbIDs, movie.imdbID]);
          return {
            title: movie.title,
            year: movie.year,
            imdbRating: movie.imdbRating,
            rottenTomatoesRating: movie.rottenTomatoesRating,
            metacriticRating: movie.metacriticRating,
            classification: movie.classification,
            imdbID: movie.imdbID
          };
        })
      )
      .then((movie) => {
        setRowData(movie);
      });
  }, [searchText, currentPage, year]);
  

  function handleSearch(searchText) {
    setSearchText(searchText);
  }

  function handleSelection(year) {
    setYear(year);
  }
  

  function handleNextPage() {
    if (currentPage === 122){
      setCurrentPage(1);
    }
    else{
      setCurrentPage(currentPage + 1);
    }
  }

  
  
  return (
    <div className="container" style={{ margin: "auto" }}>
      <SearchBar onSearch={handleSearch} style={{ marginBottom: "20px"}} />  
      <YearSelection onSearch={handleSelection} />
      <div className="ag-theme-balham" style={{ height: "360px", width: "702px", marginTop: "10px", marginBottom: "10px"}} >
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          pagination={true}
          paginationPageSize={10}
          onRowClicked={(event) => {
            const index = event.rowIndex;
            const imdbID = imdbIDs[index];
            navigate(`/movies/${imdbID}`);
          }}
        />
      </div>
      <div style = {{marginLeft: "790px", marginBottom: "30px"}}>
        <button style={{ width: "120px", height: "40px", fontSize: "10px", alignContent: "center"}} onClick={handleNextPage}>Load Another Set of Movies</button>
      </div>
    </div>
  );
}