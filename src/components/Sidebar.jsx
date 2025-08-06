import { useState } from "react";
import {
  HomeIcon,
  CalendarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CogIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import Feed from "./feed/Feed";
import CalendarComponent from "./CalendarComponent";
import Settings from "./Settings";
import Chat from "./Chat";
import { useTranslation } from "react-i18next";

const menuItems = [
  { key: "feed", icon: <HomeIcon className="h-10 w-5" /> },
  { key: "calendar", icon: <CalendarIcon className="h-10 w-5" /> },
  { key: "chat", icon: <ChatBubbleOvalLeftEllipsisIcon className="h-10 w-5" /> },
  { key: "settings", icon: <CogIcon className="h-10 w-5" /> },
];

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("feed"); // Default is feed
  const { t } = useTranslation();

  const handleMenuItemClick = (itemKey) => {
    setActiveItem(itemKey);
    setIsOpen(false); // Close sidebar when menu item is clicked
  };

  const handleContentClick = () => {
    setIsOpen(false); // Close sidebar when content area is clicked
  };

  const renderActiveComponent = () => {
    switch (activeItem) {
      case "feed":
        return <Feed />;
      case "calendar":
        return <CalendarComponent isOpen={isOpen} />;
      case "chat":
        return <Chat />;
      case "settings":
        return <Settings />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white relative">
      {/* Mobile hamburger button - only visible on small screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 text-black focus:outline-none md:hidden bg-white p-2 rounded-md shadow-md"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Sidebar - hidden on small screens, normal behavior on large screens */}
      <div
        className={`
          fixed top-0 left-0 h-full z-50 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden
          hidden md:block
          ${isOpen ? "w-64" : "w-15"}
        `}
      >
        <div className="flex items-center justify-between p-4">
          <h1
            className={`font-bold text-xl text-black transition-all duration-300 ease-in-out ${
              isOpen ? "block opacity-100" : "hidden opacity-0"
            }`}
          >
            EduNet
          </h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-black focus:outline-none transition-transform duration-200 hover:scale-110"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleMenuItemClick(item.key)}
              className={`flex items-center gap-3 mt-2 px-4 py-2 w-full text-left transition-all duration-200 ease-in-out transform origin-left
                ${
                  activeItem === item.key
                    ? "bg-black text-white font-semibold scale-105"
                    : "text-black hover:bg-black hover:text-white hover:scale-105"
                }`}
            >
              {item.icon}
              {isOpen && <span className="transition-opacity duration-300 ease-in-out">{t(`sidebar.${item.key}`)}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile menu - only shows on small screens when hamburger is clicked */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        <div
          onClick={() => setIsOpen(false)}
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'bg-opacity-30' : 'bg-opacity-0'}`}
        />
        <div className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4">
            <h1 className="font-bold text-xl text-black">EduNet</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="text-black focus:outline-none"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-4">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleMenuItemClick(item.key)}
                className={`flex items-center gap-3 mt-2 px-4 py-2 w-full text-left transition-all duration-200 ease-in-out transform origin-left
                  ${
                    activeItem === item.key
                      ? "bg-black text-white font-semibold scale-105"
                      : "text-black hover:bg-black hover:text-white hover:scale-105"
                  }`}
              >
                {item.icon}
                <span className="transition-opacity duration-300 ease-in-out">{t(`sidebar.${item.key}`)}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div
        onClick={handleContentClick}
        className={`flex-1 p-6 transition-all duration-300 ease-in-out ml-0 md:${
          isOpen ? "ml-64" : "ml-15"
        }`}
      >
        {children || renderActiveComponent()}
      </div>
    </div>
  );
}