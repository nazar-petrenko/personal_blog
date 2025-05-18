import "../styles/WhoWeAre.css";
import { useTranslation, Trans } from "react-i18next";

export default function WhoWeAre() {
  const { t } = useTranslation();

  return (
    <main className="who-we-are-page">
      <div className="who-we-are-content">
        <h1 className="who-we-are-heading">{t("whoWeAreTitle")}</h1>
        <p>
          <Trans i18nKey="whoWeAre1" components={[<strong />, <strong />, <strong />]} />
        </p>
        <p>
          <Trans i18nKey="whoWeAre2" components={[<strong />]} />
        </p>
      </div>
    </main>
  );
}
