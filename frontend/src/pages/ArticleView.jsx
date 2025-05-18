import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Comments from "../components/Comments";
import LikeButton from "../components/LikeButton";
import { useAuth } from "../context/AuthContext";

export default function ArticleView() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => setArticle(data));
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <div className="article-view">
      {article.preview_image && (
        <img
          src={article.preview_image}
          alt="preview"
          className="article-preview"
        />
      )}

      <ReactMarkdown>{article.content}</ReactMarkdown>

      {article.images?.length > 0 && (
        <div className="gallery">
          <h4>Галерея:</h4>
          <div className="gallery-grid">
            {article.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`gallery-${idx}`}
                className="gallery-image"
              />
            ))}
          </div>
        </div>
      )}
      {/* Лайки */}
      <LikeButton articleId={id} />
      {/* Коментарі */}
      <Comments articleId={id} currentUser={currentUser} />

    </div>
  );
}
