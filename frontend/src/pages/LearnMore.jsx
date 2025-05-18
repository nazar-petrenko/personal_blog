import "../styles/LearnMore.css";
import { useTranslation, Trans } from "react-i18next";

export default function LearnMore() {
  const { t } = useTranslation();

  return (
    <main className="learn-more-page">
      <div className="learn-more-content">
        <h1 className="learn-more-heading">{t("learnMoreTitle")}</h1>
        <p>
          <Trans i18nKey="learnMore1" components={[<strong />, <strong />, <strong />]} />
        </p>
        <p>
          <Trans i18nKey="learnMore2" components={[<strong />]} />
        </p>
        <p>
          <Trans i18nKey="learnMore3" components={[<strong />]} />
        </p>
      </div>
    </main>
  );
}
