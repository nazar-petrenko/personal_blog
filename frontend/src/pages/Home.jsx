import "../styles/Home.css";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="home-wrapper">
      <main className="home-page">
        <div className="home-content">
          <h1 className="home-heading">{t("homeTitle")}</h1>
          <p className="home-description">
            <Trans i18nKey="homeDescription">
              We raise awareness of two crucial global goals: <strong>No Hunger</strong> and <strong>No Poverty</strong>.
            </Trans>
          </p>
          <Link to="/learn-more" className="home-btn">
            {t("learnMore")}
          </Link>
        </div>
      </main>
    </div>
    
  );
}
