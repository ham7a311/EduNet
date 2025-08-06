import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useTranslation } from "react-i18next";

export default function UserProvider({ children }) {
  const { i18n } = useTranslation();

  // Determine default value based on language
  const getDefaultValue = () => (i18n.language === "ar" ? "مجهول" : "Anonymous");

  // Initialize state from localStorage or language-based default
  const [userName, setUserName] = useState(() => {
    const saved = localStorage.getItem("userName");
    return saved || getDefaultValue();
  });

  const [university, setUniversity] = useState(() => {
    const saved = localStorage.getItem("university");
    return saved || getDefaultValue();
  });

  // Update defaults when language changes
  useEffect(() => {
    const defaultValue = i18n.language === "ar" ? "مجهول" : "Anonymous";
    // Only update if the current value is the previous default
    const prevDefault = i18n.language === "ar" ? "Anonymous" : "مجهول";
    if (userName === prevDefault || !userName) {
      setUserName(defaultValue);
      localStorage.setItem("userName", defaultValue);
    }
    if (university === prevDefault || !university) {
      setUniversity(defaultValue);
      localStorage.setItem("university", defaultValue);
    }
  }, [i18n.language]);

  // Save to localStorage whenever userName changes
  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  // Save to localStorage whenever university changes
  useEffect(() => {
    localStorage.setItem("university", university);
  }, [university]);

  return (
    <UserContext.Provider value={{ userName, setUserName, university, setUniversity }}>
      {children}
    </UserContext.Provider>
  );
}