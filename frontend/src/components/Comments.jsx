import React, { useEffect, useState } from "react";
import "../styles/Comments.css";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";

export default function Comments({ articleId }) {
  const [comments, setComments] = useState([]);
  const [newContent, setNewContent] = useState("");
  const { user: currentUser, token } = useAuth();
  console.log("Token:", token);
  const api = useApi();
  
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
      const newComment = res.data;
      setComments([
        {
          id: newComment.id,
          content: newContent,
          authorEmail: currentUser.email,
        },
        ...comments,
      ]);
      setNewContent("");
    } catch (err) {
      alert("Не вдалося додати коментар.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments(comments.filter((c) => c.id !== id));
    } catch (err) {
      alert("Помилка видалення.");
    }
  };

  return (
    <div className="comments">
      <h3>Коментарі</h3>

      {currentUser && (
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Напишіть коментар..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button type="submit">Опублікувати</button>
        </form>
      )}

    <ul>
      {Array.isArray(comments) &&
        comments.map((comment) => (
          <li key={comment.id}>
            <div>
              <strong>{comment.authorEmail}</strong>: {comment.content}
            </div>
            {currentUser &&
              (currentUser.email === comment.authorEmail ||
                currentUser.role === "admin") && (
                <button onClick={() => handleDelete(comment.id)}>Видалити</button>
              )}
          </li>
        ))}
    </ul>
    </div>
  );
}
