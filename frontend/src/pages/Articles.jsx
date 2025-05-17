import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Articles.css";

export default function Articles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios
      .get("/api/articles")
      .then((res) => setArticles(res.data))
      .catch((err) => console.error("Failed to fetch articles", err));
  }, []);

  return (
    <div className="articles-page">
      <h1>Articles</h1>
      {articles.length === 0 ? (
        <p>No articles yet.</p>
      ) : (
        <div className="articles-list">
          {articles.map((article) => (
            <div className="article-card" key={article.id}>
              <h3>{article.title}</h3>
              <p>{article.content.slice(0, 150)}...</p>
              <Link to={`/articles/${article.id}`} className="read-more-btn">
                Більше
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
