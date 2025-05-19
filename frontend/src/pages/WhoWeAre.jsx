import "../styles/WhoWeAre.css";
import { useTranslation, Trans } from "react-i18next";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WhoWeAre() {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/who-we-are/images");
        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.error("Failed to load images", error);
      }
    };

    fetchImages();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="who-we-are-wrapper">
      <main className="who-we-are-page">
        <div className="who-we-are-content">
          <h1 className="who-we-are-heading">{t("whoWeAreTitle")}</h1>

          <p>
            <Trans i18nKey="whoWeAreIntro1" components={[<strong />, <strong />, <strong />]} />
          </p>
          <p>
            <Trans i18nKey="whoWeAreIntro2" components={[<strong />]} />
          </p>

          <h2 className="who-we-are-heading">{t("whyWeDoItTitle")}</h2>
          <p>
            <Trans i18nKey="whyWeDoItText" components={[<strong />, <strong />, <strong />]} />
          </p>

          {images.length > 0 && (
            <div className="who-we-are-gallery-slider">
              <img
                className="slider-image"
                src={images[currentIndex].url}
                alt={images[currentIndex].alt || "Gallery Image"}
                loading="lazy"
              />
              <div className="gallery-nav-container">
                <button onClick={handlePrev} className="gallery-nav left">
                  <ChevronLeft size={24} color="currentColor" />
                </button>
                <button onClick={handleNext} className="gallery-nav right">
                  <ChevronRight size={24} color="currentColor" className="rightBtn"/>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
