import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import WhoWeAre from "../pages/WhoWeAre.jsx";
import AboutProject from "../pages/AboutProject.jsx";
import LearnMore from "../pages/LearnMore.jsx";
import Navbar from "../components/Navbar.jsx";
import Articles from "../pages/Articles"; 
import AddArticle from "../pages/AddArticle"; 
import ArticleView from "../pages/ArticleView.jsx";
import { useAuth } from "../context/AuthContext";

export default function AppRouter() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/who-we-are" element={<WhoWeAre />} />
        <Route path="/about-project" element={<AboutProject />} />
        <Route path="/learn-more" element={<LearnMore />} />

        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleView />} />

        {/* Тільки для адміна */}
        {user?.role === "admin" && (
          <Route path="/admin/add-article" element={<AddArticle />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
