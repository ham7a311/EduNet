
"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { functions } from "../firebaseConfig";
import { httpsCallable } from "firebase/functions";

export default function Chat() {
  const { t } = useTranslation();
  const placeholders = t("chat.placeholders", { returnObjects: true });
  const [messages, setMessages] = useState(() => {
    // Load messages from sessionStorage on initial render and convert timestamps to Date objects
    const savedMessages = sessionStorage.getItem("chatMessages");
    return savedMessages
      ? JSON.parse(savedMessages).map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          hasAnimated: msg.hasAnimated ?? true // Ensure existing messages don't re-animate
        }))
      : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Save messages to sessionStorage whenever messages change
  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Mark AI messages as animated after animation completes
  const markMessageAsAnimated = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId && msg.sender === "ai" && !msg.isError
          ? { ...msg, hasAnimated: true }
          : msg
      )
    );
  };

  const handleChange = (e) => {
    console.log("Input value:", e.target.value); // Debug input value
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userMessage = formData.get("message")?.toString() || "";

    console.log("FormData message:", userMessage); // Debug formData content

    if (!userMessage.trim()) return;

    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      sender: "user",
      timestamp: new Date(),
      hasAnimated: false // User messages don't animate
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Real API call
      console.log("Calling function...");
      const chatWithAI = httpsCallable(functions, "chatWithAI");
      const result = await chatWithAI({ message: userMessage });
      console.log("Function result:", result);
      const aiResponse = result.data.reply; // Use raw response, as formatting is handled server-side

      // Add AI response to chat
      const newAiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        hasAnimated: false // New AI messages should animate once
      };

      setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      console.error("Error calling chatWithAI:", error);

      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date(),
        isError: true,
        hasAnimated: false // Error messages don't animate
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const clearChat = () => {
    setMessages([]);
    sessionStorage.removeItem("chatMessages"); // Clear sessionStorage on clear chat
  };

  return (
    <div className="min-h-screen flex flex-col">
      <style jsx>{`
        @keyframes typewriter {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        .typewriter {
          white-space: pre-wrap; /* Preserve newlines */
          animation: typewriter 2s steps(40, end) forwards;
        }
        .message-line {
          margin-bottom: 0.5rem; /* Add space between lines */
        }
        .button-transition {
          transition: all 0.3s ease-in-out;
        }
      `}</style>
      {messages.length === 0 && !isLoading ? (
        // Original Design - Centered Title and Input
        <div className="h-[40rem] flex flex-col justify-center items-center px-4">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl text-center sm:text-5xl dark:text-white text-black">
              {t("chat.title")}
            </h2>
          </div>
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>
      ) : (
        // Chat Layout - Clear button at top, Messages, Input at bottom
        <div className="flex flex-col flex-grow px-4 py-8">
          <div className="max-w-4xl mx-auto w-full flex flex-col flex-grow">
            {/* Notice and Clear Button at Top */}
            <div className="flex flex-col items-center mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {t("chat.history")}
              </p>
              <button
                onClick={clearChat}
                className="button-transition px-6 py-3 text-lg font-semibold text-black border-2 border-black rounded-lg hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
              {t("chat.clear_chat")}
              </button>
            </div>
            {/* Chat Messages */}
            <div className="flex-grow space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-black text-white rounded-br-sm"
                        : message.isError
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-bl-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-sm"
                    }`}
                  >
                    {message.sender === "ai" && !message.isError
                      ? message.text.split("\n").map((line, index) => (
                          <p
                            key={index}
                            className={`text-sm sm:text-base leading-relaxed message-line ${
                              !message.hasAnimated ? "typewriter" : ""
                            }`}
                            onAnimationEnd={() => {
                              if (!message.hasAnimated) {
                                markMessageAsAnimated(message.id);
                              }
                            }}
                          >
                            {line}
                          </p>
                        ))
                      : <p
                          className={`text-sm sm:text-base leading-relaxed ${
                            message.sender === "ai" && !message.isError && !message.hasAnimated
                              ? "typewriter"
                              : ""
                          }`}
                          onAnimationEnd={() => {
                            if (message.sender === "ai" && !message.isError) {
                              markMessageAsAnimated(message.id);
                            }
                          }}
                        >
                          {message.text}
                        </p>}
                    <p
                      className={`text-xs mt-2 opacity-70 ${
                        message.sender === "user"
                          ? "text-blue-100"
                          : message.isError
                          ? "text-red-600 dark:text-red-300"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input at Bottom */}
            <div className="mt-4">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
