import Button from "@shared/ui/Button";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NoMatchPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full h-screen flex justify-center items-center font-cairo flex-col space-y-3">
      <h1 className="bg-red-200 p-1 px-2 rounded-md text-red-400">404</h1>
      <h1 className="text-xl md:text-4xl">{t("Page not found").toString()}</h1>
      <p>
        {t("Sorry, the page you are looking for cannot be found").toString()}
      </p>
      <div>
        <Link to="/">
          <Button>{t("Take me home").toString()}</Button>
        </Link>
      </div>
    </div>
  );
}
