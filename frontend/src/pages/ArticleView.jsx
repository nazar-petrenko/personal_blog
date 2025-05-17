import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Comments from "../components/Comments";
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
      <h1>{article.title}</h1>
      <ReactMarkdown>{article.content}</ReactMarkdown>

      {/* Коментарі */}
      <Comments articleId={id} currentUser={currentUser} />
    </div>
  );
}
