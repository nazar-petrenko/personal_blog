import React, { useEffect, useState } from "react";
import "../styles/Comments.css";
import { useAuth } from "../context/AuthContext";

export default function Comments({ articleId }) {
  const [comments, setComments] = useState([]);
  const [newContent, setNewContent] = useState("");
  const { user: currentUser, token } = useAuth();
  console.log("Token:", token);
  useEffect(() => {
    
    fetch(`/api/comments/${articleId}`)
      .then((res) => res.json())
      .then(setComments)
      .catch((err) => console.error("Failed to fetch comments:", err));
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/comments/${articleId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newContent }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments([
        {
          id: newComment.id,
          content: newContent,
          authorEmail: currentUser.email,
        },
        ...comments,
      ]);
      setNewContent("");
    } else {
      alert("Не вдалося додати коментар.");
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setComments(comments.filter((c) => c.id !== id));
    } else {
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
