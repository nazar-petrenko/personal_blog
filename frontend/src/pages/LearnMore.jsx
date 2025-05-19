import "../styles/LearnMore.css";
import { useTranslation, Trans } from "react-i18next";

export default function LearnMore() {
  const { t } = useTranslation();

  return (
    <div className="learn-more-wrapper">
      <main className="learn-more-page">
        <div className="learn-more-content">
          <h2 className="learn-more-heading">{t("purposeTitle")}</h2>
          <p>
            <Trans i18nKey="purposeParagraph1" components={[<strong />]} />
          </p>
          <p>
            <Trans i18nKey="purposeParagraph2" components={[<strong />]} />
          </p>
        </div>
      </main>
    </div>
  );
}

