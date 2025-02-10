import React from "react";
import { useTranslation } from "react-i18next";

type Navigation = {
  title: string;
  children: {
    title: string;
    link: string;
  }[];
};

const navigation: Navigation[] = [
    {
        title: 'Transparency',
        children: [
            { title: 'Privacy', link: '/privacy' },
            { title: 'Use Policy', link: '/acceptable' },
            { title: 'Refund Policy', link: '/refund' },
            {
                title: 'About Us',
                link: '/aboutus',
            },
            {
                title: 'Saudi Founding Day Year Package Offer',
                link: '/saudi-founding-day-year-package-offer',
            },
        ],
    },
]

const Footer = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="w-full my-10">
      <div className="flex w-full justify-center md:items-center md:justify-start md:flex-row flex-col">
        <a
          target="_blank"
          href="https://qr.mc.gov.sa/info/review?lang=ar&q=wYaFuCU6rC9Ua2X627k6kA=="
        >
          <img alt="qrCode" width={120} height={120} src="/images/qrcode.png" />
        </a>
        <div className="mx-4 space-y-3 text-xs md:block hidden">
          <h1 className="w-52">
            {t("Bianat_is_an_innovative_platform").toString()}
          </h1>
          <h1>{t("Bianat_tech_for_information_technology").toString()}</h1>
          <h1>{t("Commercial Registeration").toString()} # 2062618782</h1>
        </div>

        {navigation.map((nav, index) => (
          <div key={index} className="md:flex flex-col h-full">
            <h1
              className={`text-lg mb-1 ${
                i18n.language == "en" ? "text-left" : "text-right"
              }`}
            >
              {t(nav.title).toString()}
            </h1>
            <div className="space-y-2">
              {nav.children.map((child, index) => (
                <a
                  key={index}
                  href={child.link}
                  className=" hover:text-blue-600 flex"
                >
                  {t(child.title).toString()}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 ${
                      i18n.language === "en" ? "ml-2 rotate-180" : "mr-2"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center w-full mt-5 md:flex-row flex-col">
        <div className="flex items-center ">
          <img
            src="/images/visa.png"
            width={35}
            className={i18n.language === "en" ? "mr-2" : "ml-2"}
          />
          <img
            src="/images/master-card.png"
            width={35}
            className={i18n.language === "en" ? "mr-2" : "ml-2"}
          />
          <img
            src="/images/mada.png"
            width={35}
            className={i18n.language === "en" ? "mr-2" : "ml-2"}
          />
          <h1 className="text-xs">
            &copy; {t("All_Rights_Reserved").toString()}
            {" 2023"}
          </h1>
        </div>
        <div className="flex items-center mt-2 md:mt-0">
          <h1
            className={`${
              i18n.language === "en" ? "mr-2 " : "ml-2 flex-row-reverse"
            } text-sm text-gray-300 cursor-pointer hover:text-blue-600 flex items-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
            0505841283
          </h1>
          <h1
            className={`${
              i18n.language === "en" ? "mr-2" : "ml-2 flex-row-reverse"
            } text-sm text-gray-300 cursor-pointer hover:text-blue-600 flex items-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            info@bianat.sa
          </h1>
          <Youtube />
          <Tiktok />
          <Twitter />
        </div>
      </div>
    </div>
  );
};

const Twitter = () => {
  const { i18n } = useTranslation();

  return (
    <a href="https://twitter.com/bianat_sa">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={`${
          i18n.language === "en" ? "mr-2" : "ml-2"
        } hover:text-blue-600 transition-all cursor-pointer`}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
      </svg>
    </a>
  );
};

const Youtube = () => {
  const { i18n } = useTranslation();
  return (
    <a href="https://www.youtube.com/@bianat1968">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={`${
          i18n.language === "en" ? "mr-2" : "ml-2"
        } hover:text-blue-600 transition-all cursor-pointer`}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z" />
        <path d="M10 9l5 3l-5 3z" />
      </svg>
    </a>
  );
};

const Tiktok = () => {
  const { i18n } = useTranslation();
  return (
    <a href="https://www.tiktok.com/@bianat.sa">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={`${
          i18n.language === "en" ? "mr-2" : "ml-2"
        } hover:text-blue-600 transition-all cursor-pointer`}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z"></path>
      </svg>
    </a>
  );
};

export default Footer;
