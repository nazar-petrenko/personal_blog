import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Comments from "../components/Comments";
import LikeButton from "../components/LikeButton";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next"; // ➕ Додано
import "../styles/ArticleView.css";

export default function ArticleView() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const { user: currentUser } = useAuth();
  const [activeImage, setActiveImage] = useState(null);
  const { t } = useTranslation(); // ➕ Отримуємо функцію перекладу

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => setArticle(data));
  }, [id]);

  const closeModal = () => setActiveImage(null);

  if (!article) return <p>{t("loading")}</p>; // 🈯 Перекладено

  return (
    <div className="article-view-page">
      <h1 className="article-title">{article.title}</h1>

      {article.preview_image && (
        <img
          src={article.preview_image}
          alt="preview"
          className="article-preview"
        />
      )}

      <div className="article-markdown">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>

      {article.images?.length > 0 && (
        <div className="gallery">
          <h4>{t("gallery")}:</h4>
          <div className="gallery-grid">
            {article.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`gallery-${idx}`}
                className="gallery-image"
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>
        </div>
      )}

      {activeImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <img src={activeImage} alt="Enlarged view" className="modal-image" />
        </div>
      )}

      <div className="article-bottom">
        <div className="like-area">
          <LikeButton articleId={id} />
        </div>
      </div>

      <div className="comments-area">
        <Comments articleId={id} currentUser={currentUser} />
      </div>
    </div>
  );
}
