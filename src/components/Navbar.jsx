import { useState, useEffect, useRef } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const mobileLangDropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target) &&
        mobileLangDropdownRef.current &&
        !mobileLangDropdownRef.current.contains(event.target)
      ) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const Links = [
    { key: "Features", href: "#features" },
    { key: "Faq", href: "#faq" },
    { key: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className="bg-white shadow-sm fixed w-full z-50"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo */}
          <div className="flex-shrink-0 font-bold text-xl text-black">
            {t("navbar.logo")}
          </div>

          {/* Center: Links */}
          <div className="hidden md:flex space-x-8 md:rtl:space-x-reverse items-center">
            {Links.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-gray-700 hover:underline hover:underline-offset-2 transition-colors duration-200"
              >
                {t(`navbar.links.${link.key}`)}
              </a>
            ))}
            {/* Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="text-gray-700 hover:underline hover:underline-offset-2 transition-colors duration-200 flex items-center"
              >
                {t("navbar.language")}
                <ChevronDownIcon className="h-5 w-5 ms-1" />
              </button>
              {isLangOpen && (
                <div className="absolute start-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg">
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`block w-full text-left px-4 py-2 ${
                      i18n.language === "en" 
                        ? "bg-black text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {t("navbar.languages.english")}
                  </button>
                  <button
                    onClick={() => changeLanguage("ar")}
                    className={`block w-full text-left px-4 py-2 ${
                      i18n.language === "ar" 
                        ? "bg-black text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {t("navbar.languages.arabic")}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sign In Button */}
          <div className="hidden md:flex">
            <a href="#auth">
              <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="py-2 px-10 text-lg inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 font-medium text-white backdrop-blur-3xl">
                  {t("navbar.sign_in")}
                </span>
              </button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden pr-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {Links.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="block text-gray-700 hover:text-underline px-3 py-2 rounded-md"
              >
                {t(`navbar.links.${link.key}`)}
              </a>
            ))}
            {/* Language Dropdown for Mobile */}
            <div className="relative" ref={mobileLangDropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="block text-gray-700 hover:text-underline px-3 py-2 rounded-md flex items-center"
              >
                {t("navbar.language")}
                <ChevronDownIcon className="h-5 w-5 ms-1" />
              </button>
              {isLangOpen && (
                <div className="ms-3 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg">
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`block w-full text-left px-4 py-2 ${
                      i18n.language === "en" 
                        ? "bg-black text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {t("navbar.languages.english")}
                  </button>
                  <button
                    onClick={() => changeLanguage("ar")}
                    className={`block w-full text-left px-4 py-2 ${
                      i18n.language === "ar" 
                        ? "bg-black text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {t("navbar.languages.arabic")}
                  </button>
                </div>
              )}
            </div>
            <a href="#auth">
              <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="py-2 px-10 text-lg inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 font-medium text-white backdrop-blur-3xl">
                  {t("navbar.sign_in")}
                </span>
              </button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;