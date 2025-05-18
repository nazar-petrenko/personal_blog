import "../styles/AboutProject.css";
import { useTranslation, Trans } from "react-i18next";

export default function AboutProject() {
  const { t } = useTranslation();

  return (
    <main className="about-project-page">
      <div className="about-project-content">
        <h1 className="about-project-heading">{t("aboutProjectTitle")}</h1>
        <p>
          <Trans i18nKey="aboutProject1" components={[<strong />, <strong />, <strong />, <strong />]} />
        </p>
        <p>
          <Trans i18nKey="aboutProject2" components={[<strong />, <strong />, <strong />]} />
        </p>
      </div>
    </main>
  );
}
