import Nav from "./Nav";

// the header
export default function Header({userEmail}) {
  console.log("userEmail in Header: ", userEmail);

  return (
    <header>
        <Nav userEmail={userEmail}/>
    </header>

  );
}
