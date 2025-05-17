// components/LikeButton.jsx
import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import "../styles/LikeButton.css";
export default function LikeButton({ articleId }) {
  const { user } = useAuth();
  const api = useApi();

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchLikes();
    checkIfLiked();
  }, [articleId]);

  const fetchLikes = async () => {
    try {
      const res = await api.get(`/likes/${articleId}`);
      setLikes(res.data.likes);
    } catch (err) {
      console.error("Failed to fetch likes:", err);
    }
  };

  const checkIfLiked = async () => {
    try {
      const res = await api.get(`/articles/${articleId}/isLiked`);
      setLiked(res.data.liked); // true/false
    } catch (err) {
      // якщо 401 або 404, просто не відображаємо liked
      setLiked(false);
    }
  };

  const handleClick = async () => {
    if (!user) {
      alert("Увійдіть, щоб ставити лайки");
      return;
    }

    try {
      if (liked) {
        await api.delete(`/likes/${articleId}`);
        setLikes((prev) => prev - 1);
        setLiked(false);
      } else {
        await api.post(`/likes/${articleId}`);
        setLikes((prev) => prev + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <button onClick={handleClick} className={`like-button ${liked ? "liked" : ""}`}>
      ❤️ {likes}
    </button>
  );
}
