import "../styles/AboutProject.css";
import { useTranslation } from "react-i18next";

export default function AboutProject() {
  const { t } = useTranslation();

  return (
    <div className="about-project-wrapper">
      <main className="about-project-page">
        <div className="about-project-content">
          <h1 className="about-project-heading">{t("aboutProjectTitle")}</h1>

          <p>{t("aboutProject1")}</p>

          <p>{t("aboutProject2")}</p>

          <h2 className="about-project-heading" style={{ marginTop: "2rem" }}>{t("zeroHungerTitle")}</h2>
          <ul>
            <li>{t("zeroHunger1")}</li>
            <li>{t("zeroHunger2")}</li>
            <li>{t("zeroHunger3")}</li>
            <li>{t("zeroHunger4")}</li>
          </ul>

          <h2 className="about-project-heading" style={{ marginTop: "2rem" }}>{t("zeroPovertyTitle")}</h2>
          <ul>
            <li>{t("zeroPoverty1")}</li>
            <li>{t("zeroPoverty2")}</li>
            <li>{t("zeroPoverty3")}</li>
            <li>{t("zeroPoverty4")}</li>
          </ul>

          <h2 className="about-project-heading" style={{ marginTop: "2rem" }}>{t("hungerIncreaseTitle")}</h2>
          <p>{t("hungerIncreaseText")}</p>

          <h2 className="about-project-heading" style={{ marginTop: "2rem" }}>{t("causesTitle")}</h2>
          <ul>
            <li>{t("causes1")}</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
