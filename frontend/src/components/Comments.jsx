import React, { useEffect, useState } from "react";
import "../styles/Comments.css";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { useTranslation } from "react-i18next"; // ➕ додано переклад

export default function Comments({ articleId }) {
  const [comments, setComments] = useState([]);
  const [newContent, setNewContent] = useState("");
  const { user: currentUser } = useAuth();
  const api = useApi();
  const { t } = useTranslation(); // ➕ функція перекладу

  useEffect(() => {
    api
      .get(`/comments/${articleId}`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error("Failed to fetch comments:", err));
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/comments/${articleId}`, { content: newContent });
      setComments([res.data, ...comments]);
      setNewContent("");
    } catch (err) {
      alert(t("addCommentError")); 
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments(comments.filter((c) => c.id !== id));
    } catch (err) {
      alert(t("deleteErrorUser")); 
    }
  };

  return (
    <div className="comments">
      <h3>{t("commentsTitle")}</h3>

      {currentUser && (
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder={t("placeholderComment")}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button type="submit">{t("publish")}</button>
        </form>
      )}

      <ul>
        {Array.isArray(comments) &&
          comments.map((comment) => (
            <li key={comment.id}>
              <div>
                <strong>{comment.nickname || t("anonymous")}</strong>: {comment.content}
              </div>
              {currentUser &&
                ((currentUser.nickname === comment.nickname || currentUser.role === "admin")) && (
                  <button onClick={() => handleDelete(comment.id)}>{t("delete")}</button>
                )}
            </li>
          ))}
      </ul>
    </div>
  );
}
