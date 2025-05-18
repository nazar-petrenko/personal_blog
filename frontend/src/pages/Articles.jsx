import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Articles.css";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [language, setLanguage] = useState("all");

  useEffect(() => {
    fetchArticles();
  }, [language]);

  const fetchArticles = async () => {
    try {
      const res = await axios.get(`/api/articles?lang=${language}`);
      setArticles(res.data);
    } catch (err) {
      console.error("Failed to fetch articles", err);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="articles-page">
      <h1>Articles</h1>

      <div className="language-filter">
        <label>Фільтр за мовою: </label>
        <select value={language} onChange={handleLanguageChange}>
          <option value="all">Усі</option>
          <option value="uk">Українська</option>
          <option value="en">English</option>
        </select>
      </div>

      {articles.length === 0 ? (
        <p>No articles yet.</p>
      ) : (
        <div className="articles-list">
          {articles.map((article) => (
            <div className="article-card" key={article.id}>
              {article.preview_image && (
                <img
                  src={article.preview_image}
                  alt="preview"
                  className="preview-image"
                />
              )}
              <h3>{article.title}</h3>
              <p>{article.content.slice(0, 150)}...</p>
              <p className="likes-count">❤️ {article.likeCount || 0} лайків</p>
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
