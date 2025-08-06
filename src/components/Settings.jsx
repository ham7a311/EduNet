import { useState, useEffect } from "react";
import { UserIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useUser } from "../context/useUser";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const { userName, setUserName, university, setUniversity } = useUser();
  const { i18n, t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [language, setLanguage] = useState("en"); // Default language set to English

  // Initialize temp states based on current language
  const getDefaultValue = () => (i18n.language === "ar" ? "مجهول" : "Anonymous");
  const [tempUserName, setTempUserName] = useState(userName || getDefaultValue());
  const [tempUniversity, setTempUniversity] = useState(university || getDefaultValue());

  // Set default language and sync defaults on mount and language change
  useEffect(() => {
    // Ensure language is set to English on mount if not already set
    if (!i18n.language) {
      i18n.changeLanguage("en");
    }
    // Update language state if i18n.language changes
    setLanguage(i18n.language || "en");

    // Set default values for userName and university if not set
    const defaultValue = i18n.language === "ar" ? "مجهول" : "Anonymous";
    if (!userName) setUserName(defaultValue);
    if (!university) setUniversity(defaultValue);

    // Sync temp states
    setTempUserName(userName || defaultValue);
    setTempUniversity(university || defaultValue);
  }, [i18n.language, userName, university, setUserName, setUniversity, i18n]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Reset user context to default values based on current language
        const defaultValue = i18n.language === "ar" ? "مجهول" : "Anonymous";
        setUserName(defaultValue);
        setUniversity(defaultValue);
        setTempUserName(defaultValue);
        setTempUniversity(defaultValue);
        setIsLogoutModalOpen(false);
        alert(t("settings.alerts.logout_success"));
      })
      .catch((err) => {
        console.error("Logout error:", err);
        alert(t("settings.alerts.logout_error"));
      });
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="w-full max-w-none sm:max-w-md mx-auto p-4 sm:p-6 bg-white dark:bg-black rounded-lg shadow-md mt-16 md:mt-0">
      {/* User Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-full flex-shrink-0">
          <UserIcon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white break-words">
            {userName} - {university}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("settings.user_info.regular_user")}</p>
        </div>
      </div>

      {/* Settings Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded-md space-y-2 sm:space-y-0">
          <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{t("settings.user_info.name_label")}</span>
          <input
            type="text"
            value={userName}
            disabled
            className="w-full sm:w-auto px-3 py-1 text-sm bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded cursor-not-allowed opacity-60"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded-md space-y-2 sm:space-y-0">
          <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{t("settings.user_info.university_label")}</span>
          <input
            type="text"
            value={university}
            disabled
            className="w-full sm:w-auto px-3 py-1 text-sm bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded cursor-not-allowed opacity-60"
          />
        </div>

        {/* Edit Button */}
        <div className="flex justify-center sm:justify-start">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-6 py-2 text-sm bg-black text-white rounded transition hover:bg-gray-800"
          >
            {t("settings.buttons.edit")}
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded-md space-y-2 sm:space-y-0">
          <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{t("settings.user_info.language_label")}</span>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full sm:w-auto px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
          >
            <option value="en">{t("settings.user_info.english")}</option>
            <option value="ar">{t("settings.user_info.arabic")}</option>
          </select>
        </div>
      </div>

      {/* Logout Button */}
      <div className="text-center mt-8 sm:mt-10">
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full sm:w-auto px-6 py-2 bg-red-700 text-white rounded-md transition hover:bg-red-800"
        >
          {t("settings.buttons.logout")}
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-sm mx-auto">
            <h3
              id="edit-modal-title"
              className="text-lg font-semibold text-gray-800 dark:text-white mb-4"
            >
              {t("settings.modals.edit_profile.title")}
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-black text-sm"
                placeholder={t("settings.modals.edit_profile.name_placeholder")}
              />
              <input
                type="text"
                value={tempUniversity}
                onChange={(e) => setTempUniversity(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-black text-sm"
                placeholder={t("settings.modals.edit_profile.university_placeholder")}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 sm:rtl:space-x-reverse mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 text-sm bg-transparent border border-black dark:bg-gray-600 text-black dark:text-gray-300 rounded dark:hover:bg-gray-500 transition"
              >
                {t("settings.buttons.cancel")}
              </button>
              <button
                onClick={() => {
                  const defaultValue = i18n.language === "ar" ? "مجهول" : "Anonymous";
                  setUserName(tempUserName || defaultValue);
                  setUniversity(tempUniversity || defaultValue);
                  setIsModalOpen(false);
                }}
                className="w-full sm:w-auto px-4 py-2 text-sm bg-black text-white rounded transition hover:bg-gray-800"
              >
                {t("settings.buttons.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setIsLogoutModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-sm mx-auto">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <ArrowRightOnRectangleIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>

            <div className="text-center">
              <h3
                id="logout-modal-title"
                className="text-lg font-semibold text-gray-800 dark:text-white mb-2"
              >
                {t("settings.modals.logout_confirm.title")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t("settings.modals.logout_confirm.message")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3 sm:rtl:space-x-reverse">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 text-sm bg-transparent border border-black dark:bg-gray-600 text-black dark:text-gray-300 rounded dark:hover:bg-gray-500 transition"
              >
                {t("settings.buttons.cancel")}
              </button>
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-4 py-2 text-sm bg-red-700 text-white rounded transition hover:bg-red-800"
              >
                {t("settings.buttons.logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}