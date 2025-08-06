import i18next from "i18next";
     import { initReactI18next } from "react-i18next";
     import LanguageDetector from "i18next-browser-languagedetector";
     import enTranslation from "./locales/en/translation.json";
     import arTranslation from "./locales/ar/translation.json";

     i18next
       .use(LanguageDetector)
       .use(initReactI18next)
       .init({
         resources: {
           en: { translation: enTranslation },
           ar: { translation: arTranslation },
         },
         fallbackLng: "en",
         supportedLngs: ["en", "ar"],
         detection: {
           order: ["localStorage", "navigator"],
           caches: ["localStorage"],
         },
         interpolation: {
           escapeValue: false, // React handles XSS
         },
       });

     // Set HTML direction based on language
     i18next.on("languageChanged", (lng) => {
       document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
       document.documentElement.lang = lng;
     });

     export default i18next;