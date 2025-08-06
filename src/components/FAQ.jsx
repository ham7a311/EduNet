import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function FAQ() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  // Memoize the FAQ questions to prevent re-fetching on every render
  const faqQuestions = useMemo(() => t("faq.questions", { returnObjects: true }), [t]);

  const toggleFAQ = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index)); // Use functional update to avoid unnecessary re-renders
  };

  return (
    <section className="py-24" id="faq">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h6 className="text-lg text-indigo-600 font-medium mb-2">{t("faq.title")}</h6>
          <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] relative inline-block">
  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg opacity-30"></span>
  <span className="relative">{t("faq.heading")}</span>
</h2>
        </div>

        <div className="space-y-4">
          {faqQuestions.map((faq, index) => (
            <div
              key={index}
              className={`border border-gray-200 rounded-2xl overflow-hidden ${activeIndex === index ? "bg-indigo-50" : ""}`}
              style={{ transition: "background-color 0.3s" }} // Isolate transition to specific property
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex items-center justify-between w-full px-6 py-4 text-left text-gray-900 hover:text-indigo-600 focus:outline-none"
                aria-expanded={activeIndex === index}
              >
                <span className="font-medium">{faq.question}</span>
                <svg
                  className={`w-5 h-5 transform ${activeIndex === index ? "rotate-180 text-indigo-600" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-4 text-gray-700" style={{ transition: "opacity 0.3s" }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}