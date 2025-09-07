import { initReactI18next } from "react-i18next";
import { createCookie } from "react-router";
import { unstable_createI18nextMiddleware } from "remix-i18next/middleware";
import en from "~/locales/en";
import el from "~/locales/el";
import { i18nCookie } from "~/lib/locale-cookie";

export const [i18nextMiddleware, getLocale, getInstance] =
  unstable_createI18nextMiddleware({
    detection: {
      supportedLanguages: ["en", "el"],
      fallbackLanguage: "el",
      cookie: i18nCookie,
    },
    i18next: {
      resources: { en: { translation: en }, el: { translation: el } },
    },
    plugins: [initReactI18next],
  });

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: typeof en;
    };
  }
}