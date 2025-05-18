import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Articles.css";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { useTranslation } from "react-i18next";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [language, setLanguage] = useState("all");
  const { user: currentUser } = useAuth();
  const api = useApi();
  const { t } = useTranslation();

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
    const confirmed = window.confirm(t("confirmDelete"));
    if (!confirmed) return;

    try {
      await api.delete(`/articles/${id}`);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(t("deleteError"));
    }
  };

  return (
    <div className="articles-page">
      <h1>{t("articlesTitle")}</h1>

      <div className="language-filter">
        <label>{t("filterByLanguage")}</label>
        <select value={language} onChange={handleLanguageChange}>
          <option value="all">{t("allLanguages")}</option>
          <option value="en">{t("english")}</option>
          <option value="nl">{t("dutch")}</option>
        </select>
      </div>

      {articles.length === 0 ? (
        <p>{t("noArticles")}</p>
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
                <p>{article.content.slice(0, 80)}...</p>
                <div className="article-footer">
                  <div className="likes-count">❤️ {article.likeCount || 0}</div>

                  <div className="footer-buttons">
                    <Link to={`/articles/${article.id}`} className="read-more-btn">
                      {t("readMore")}
                    </Link>
                    {currentUser?.role === "admin" && (
                      <button onClick={() => handleDelete(article.id)} className="delete-btn">
                        {t("delete")}
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
