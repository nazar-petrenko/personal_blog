import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/AddArticle.css";

export default function AddArticle() {
  const { token, user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("en");
  const [preview, setPreview] = useState(null);
  const [gallery, setGallery] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("language", language);
    if (preview) formData.append("preview", preview);
    gallery.forEach((file) => formData.append("gallery", file));

    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      alert("Article created!");
      setTitle("");
      setContent("");
      setLanguage("en");
      setPreview(null);
      setGallery([]);
    } else {
      alert("Failed to create");
    }
  };

  if (user?.role !== "admin") return <p className="no-access">Only admin can add articles.</p>;

  return (
    <form className="article-form" onSubmit={handleSubmit}>
      <h2>Create New Article</h2>

      <label>Title:</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Article title"
        required
      />

      <label>Content (Markdown):</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your markdown content here..."
        rows={8}
        required
      />

      <label>Language:</label>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="uk">Українська</option>
        <option value="nl">Nederlands</option>
      </select>

      <label>Preview Image:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPreview(e.target.files[0])}
      />

      <label>Gallery Images:</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setGallery([...e.target.files])}
      />

      <button type="submit">Submit Article</button>
    </form>
  );
}
