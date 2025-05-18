import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Articles.css";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi"

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [language, setLanguage] = useState("all");
  const { user: currentUser } = useAuth(); 
  const api = useApi(); 

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


   const handleDelete = async (id) => {
    const confirmed = window.confirm("Ви впевнені, що хочете видалити цю статтю?");
    if (!confirmed) return;

    try {
      await api.delete(`/articles/${id}`);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Помилка при видаленні статті.");
    }
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
          <option value="nl">Nederlands</option>
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
              <div className="article-content">
                <h3>{article.title}</h3>
                <p>{article.content.slice(0, 160)}...</p>
                <div className="article-footer">
                  <div className="likes-count">❤️ {article.likeCount || 0}</div>
                            
                  <div className="footer-buttons">
                    <Link to={`/articles/${article.id}`} className="read-more-btn">
                      Більше
                    </Link>
                    {currentUser?.role === "admin" && (
                      <button onClick={() => handleDelete(article.id)} className="delete-btn">
                        Видалити
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
