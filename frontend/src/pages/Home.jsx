// src/pages/Home.jsx
import "../styles/Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page home">
      <div className="content">
        <h1>Welcome to Our Project</h1>
        <p>
          We are raising awareness about two SDGs: No Hunger and No Poverty.
        </p>
        <Link to="/learn-more" className="btn">Learn More</Link>
      </div>
    </div>
  );
}
