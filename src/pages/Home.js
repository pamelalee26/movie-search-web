import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <section className="body">
        <div
          className="image"
          style={{
            height: "100vh",
            width: "100vw",
            backgroundImage: `url('/images/pink-cinema.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "4em", fontWeight: "bold", color: "white" }}>
            Movie Search
          </div>
          <div style={{ fontSize: "1em", color: "white", paddingBottom: "20px" }}>
            by Pamela Lee, for CAB230 Web Computing
          </div>
          <Link to="/movies">
            <button type="button">Start Searching!</button>
          </Link>
        </div>
      </section>
    </main>
  );
}