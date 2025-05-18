import "../styles/Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home-page">
      <div className="home-content">
        <h1 className="home-heading">Together for Change</h1>
        <p className="home-description">
          We raise awareness of two crucial global goals: <strong>No Hunger</strong> and <strong>No Poverty</strong>.
        </p>
        <Link to="/learn-more" className="home-btn">
          Learn More
        </Link>
      </div>
    </main>
  );
}
