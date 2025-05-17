import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AddArticle() {
  const { token, user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("en");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, language }),
    });

    if (res.ok) {
      alert("Article created!");
      setTitle("");
      setContent("");
      setLanguage("en");
    } else {
      alert("Failed to create");
    }
  };

  if (user?.role !== "admin") return <p>Only admin can add articles.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Article</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Markdown content"
        rows={10}
      />
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="uk">Українська</option>
        <option value="pl">Polski</option>
        {/* Додай інші мови за потреби */}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}
