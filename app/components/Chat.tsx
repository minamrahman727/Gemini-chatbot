"use client";

import { useState, useRef, useEffect } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

const userAvatar = "/avatar.jpg";"use client";

import { useState, useRef, useEffect } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

const userAvatar = "/avatar.jpg";
const botAvatar = "/avatar.jpg";

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const slideIn = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { x: -50, opacity: 0, transition: { duration: 0.3 } },
};

const messageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3, ease: "easeIn" } },
};

export default function Chat() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("theme") || "system" : "system"
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (input.trim() === "" || loading) return;

    const newUserMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);
    setTyping(true);

    try {
      const apiKey = "AIzaSyAh55-oTWkaaiMqzwZ4hJ_DuGINRkwkLoE";
      if (!apiKey) {
        throw new Error("Google API key is not defined");
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });
      const result = await model.generateContent(newUserMessage.text);

      const responseText = await result.response.text();
      const newBotMessage = { text: responseText, sender: "bot" as const };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Error:", error);
      const newBotMessage = {
        text: "Oops! Something went wrong. Please try again later.",
        sender: "bot" as const,
      };
      setMessages((prev) => [...prev, newBotMessage]);
    }
    setLoading(false);
    setTyping(false);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderThemeChanger = () => {
    const currentTheme = theme === "system" ? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme;

    if (currentTheme === "dark") {
      return (
        <motion.button
          onClick={() => setTheme("light")}
          className="w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 disabled:opacity-50 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Switch to Light Mode"
        >
          ☀️
        </motion.button>
      );
    } else {
      return (
        <motion.button
          onClick={() => setTheme("dark")}
          className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Switch to Dark Mode"
        >
          🌙
        </motion.button>
      );
    }
  };

  const themeStyles = {
    bgColor: theme === "dark" ? "bg-gray-900" : "bg-white",
    textColor: theme === "dark" ? "text-gray-100" : "text-gray-900",
    headerBgColor: theme === "dark" ? "bg-gray-800" : "bg-white",
    headerBorderColor: theme === "dark" ? "border-gray-700" : "border-gray-200",
    messageUserBg: theme === "dark" ? "bg-blue-600 text-gray-50" : "bg-blue-100 text-gray-900",
    messageBotBg: theme === "dark" ? "bg-gray-700 text-gray-50" : "bg-gray-100 text-gray-900",
    inputBgColor: theme === "dark" ? "bg-gray-700" : "bg-gray-50",
    inputTextColor: theme === "dark" ? "text-gray-50" : "text-gray-900",
    inputBorderColor: theme === "dark" ? "border-gray-600" : "border-gray-300",
    footerBgColor: theme === "dark" ? "bg-gray-800" : "bg-white",
    footerTextColor: theme === "dark" ? "text-gray-400" : "text-gray-700",
    borderColor: theme === "dark" ? "border-gray-700" : "border-gray-300",
  };

  return (
    <motion.div
      className={`flex flex-col h-screen ${themeStyles.bgColor} ${themeStyles.textColor} overflow-hidden`}
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <motion.header
        className={`p-6 border-b ${themeStyles.headerBorderColor} shadow-md ${themeStyles.headerBgColor}`}
        variants={slideIn}
      >
        <div className="flex justify-end">{renderThemeChanger()}</div>
        <motion.h1
          className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-md"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          AI Chat Assistant
        </motion.h1>
        <motion.p
          className="mt-2 text-base text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        >
          Powered by Google Gemini AI
        </motion.p>
        <motion.p
          className="mt-1 text-xs text-gray-500 italic dark:text-gray-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
        >
          Model: Gemini 2.0 flash Thinking Experimental 02-05
        </motion.p>
      </motion.header>

      {/* Chat Messages */}
      <motion.div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" variants={fadeIn}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} items-start`}
            >
              {message.sender === "bot" && (
                <motion.img
                  src={botAvatar}
                  alt="Bot Avatar"
                  className="w-8 h-8 rounded-full mr-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}

              <motion.div
                className={`px-4 py-3 rounded-2xl shadow-md max-w-2xl break-words ${message.sender === "user" ? themeStyles.messageUserBg : themeStyles.messageBotBg} text-base`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <ReactMarkdown
                  components={{
                    a: ({ href, children }) =>
                      href ? (
                        <Link href={href} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </Link>
                      ) : (
                        <>{children}</>
                      ),
                    p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
                    li: ({ children }) => <li className="my-1">{children}</li>,
                    code: ({ children }) => (
                      <code className="bg-gray-800 dark:bg-gray-700 rounded-md p-1 font-mono text-sm text-gray-100">{children}</code>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-400 dark:border-gray-600 pl-4 italic my-2">
                        {children}
                      </blockquote>
                    ),
                    h1: ({ children }) => <h1 className="text-2xl font-bold my-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold my-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-medium my-2">{children}</h3>,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </motion.div>

              {message.sender === "user" && (
                <motion.img
                  src={userAvatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full ml-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <motion.div
            className="flex justify-start items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img src={botAvatar} alt="Bot Avatar" className="w-8 h-8 rounded-full mr-3" />
            <div className="px-4 py-3 rounded-2xl shadow-md max-w-2xl break-words bg-gray-700 text-gray-50 text-base">
              Typing...
            </div>
          </motion.div>
        )}
        <div ref={messageEndRef} />
      </motion.div>

      {/* Input Form */}
      <motion.form
        onSubmit={handleSubmit}
        className={`flex items-center p-3 border-t ${themeStyles.borderColor}`}
        variants={slideIn}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={loading}
          className={`flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyles.inputBgColor} ${themeStyles.inputTextColor} ${themeStyles.inputBorderColor} placeholder-gray-400 dark:placeholder-gray-500 text-base`}
          ref={(inputElement) => {
            if (inputElement && !loading) {
              inputElement.focus();
            }
          }}
        />

        <motion.button
          type="submit"
          disabled={loading}
          className="ml-3 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Send Message"
        >
          <AiOutlineSend size={20} className="p-0.5" />
        </motion.button>
      </motion.form>

      {/* Footer */}
      <motion.footer
        className={`p-4 text-center ${themeStyles.footerBgColor} ${themeStyles.footerTextColor} border-t ${themeStyles.borderColor}`}
        variants={slideIn}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Developed by
          <Link
            href="https://smrehman.vercel.app/"
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Syed Minam Ur Rehman
          </Link>
          <motion.p
            className="mt-1 text-xs text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            © {new Date().getFullYear()} All rights reserved.
          </motion.p>
        </motion.div>
      </motion.footer>
    </motion.div>
  );
}
const botAvatar = "/avatar.jpg";

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const slideIn = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { x: -50, opacity: 0, transition: { duration: 0.3 } },
};

const messageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3, ease: "easeIn" } },
};

export default function Chat() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("theme") || "system" : "system"
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (input.trim() === "" || loading) return;

    const newUserMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);
    setTyping(true);

    try {
      const apiKey = "AIzaSyAh55-oTWkaaiMqzwZ4hJ_DuGINRkwkLoE";
      if (!apiKey) {
        throw new Error("Google API key is not defined");
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });
      const result = await model.generateContent(newUserMessage.text);

      const responseText = await result.response.text();
      const newBotMessage = { text: responseText, sender: "bot" as const };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Error:", error);
      const newBotMessage = {
        text: "Oops! Something went wrong. Please try again later.",
        sender: "bot" as const,
      };
      setMessages((prev) => [...prev, newBotMessage]);
    }
    setLoading(false);
    setTyping(false);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderThemeChanger = () => {
    const currentTheme = theme === "system" ? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme;

    if (currentTheme === "dark") {
      return (
        <motion.button
          onClick={() => setTheme("light")}
          className="w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 disabled:opacity-50 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Switch to Light Mode"
        >
          ☀️
        </motion.button>
      );
    } else {
      return (
        <motion.button
          onClick={() => setTheme("dark")}
          className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Switch to Dark Mode"
        >
          🌙
        </motion.button>
      );
    }
  };

  const themeStyles = {
    bgColor: theme === "dark" ? "bg-gray-900" : "bg-white",
    textColor: theme === "dark" ? "text-gray-100" : "text-gray-900",
    headerBgColor: theme === "dark" ? "bg-gray-800" : "bg-white",
    headerBorderColor: theme === "dark" ? "border-gray-700" : "border-gray-200",
    messageUserBg: theme === "dark" ? "bg-blue-600 text-gray-50" : "bg-blue-100 text-gray-900",
    messageBotBg: theme === "dark" ? "bg-gray-700 text-gray-50" : "bg-gray-100 text-gray-900",
    inputBgColor: theme === "dark" ? "bg-gray-700" : "bg-gray-50",
    inputTextColor: theme === "dark" ? "text-gray-50" : "text-gray-900",
    inputBorderColor: theme === "dark" ? "border-gray-600" : "border-gray-300",
    footerBgColor: theme === "dark" ? "bg-gray-800" : "bg-white",
    footerTextColor: theme === "dark" ? "text-gray-400" : "text-gray-700",
    borderColor: theme === "dark" ? "border-gray-700" : "border-gray-300",
  };

  return (
    <motion.div
      className={`flex flex-col h-screen ${themeStyles.bgColor} ${themeStyles.textColor} overflow-hidden`}
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <motion.header
        className={`p-6 border-b ${themeStyles.headerBorderColor} shadow-md ${themeStyles.headerBgColor}`}
        variants={slideIn}
      >
        <div className="flex justify-end">{renderThemeChanger()}</div>
        <motion.h1
          className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-md"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          AI Chat Assistant
        </motion.h1>
        <motion.p
          className="mt-2 text-base text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        >
          Powered by Google Gemini AI
        </motion.p>
        <motion.p
          className="mt-1 text-xs text-gray-500 italic dark:text-gray-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
        >
          Model: Gemini 2.0 flash Thinking Experimental 02-05
        </motion.p>
      </motion.header>

      {/* Chat Messages */}
      <motion.div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" variants={fadeIn}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} items-start`}
            >
              {message.sender === "bot" && (
                <motion.img
                  src={botAvatar}
                  alt="Bot Avatar"
                  className="w-8 h-8 rounded-full mr-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}

              <motion.div
                className={`px-4 py-3 rounded-2xl shadow-md max-w-2xl break-words ${message.sender === "user" ? themeStyles.messageUserBg : themeStyles.messageBotBg} text-base`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <ReactMarkdown
                  components={{
                    a: ({ href, children }) =>
                      href ? (
                        <Link href={href} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </Link>
                      ) : (
                        <>{children}</>
                      ),
                    p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
                    li: ({ children }) => <li className="my-1">{children}</li>,
                    code: ({ children }) => (
                      <code className="bg-gray-800 dark:bg-gray-700 rounded-md p-1 font-mono text-sm text-gray-100">{children}</code>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-400 dark:border-gray-600 pl-4 italic my-2">
                        {children}
                      </blockquote>
                    ),
                    h1: ({ children }) => <h1 className="text-2xl font-bold my-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold my-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-medium my-2">{children}</h3>,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </motion.div>

              {message.sender === "user" && (
                <motion.img
                  src={userAvatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full ml-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <motion.div
            className="flex justify-start items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img src={botAvatar} alt="Bot Avatar" className="w-8 h-8 rounded-full mr-3" />
            <div className="px-4 py-3 rounded-2xl shadow-md max-w-2xl break-words bg-gray-700 text-gray-50 text-base">
              Typing...
            </div>
          </motion.div>
        )}
        <div ref={messageEndRef} />
      </motion.div>

      {/* Input Form */}
      <motion.form
        onSubmit={handleSubmit}
        className={`flex items-center p-3 border-t ${themeStyles.borderColor}`}
        variants={slideIn}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={loading}
          className={`flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyles.inputBgColor} ${themeStyles.inputTextColor} ${themeStyles.inputBorderColor} placeholder-gray-400 dark:placeholder-gray-500 text-base`}
          ref={(inputElement) => {
            if (inputElement && !loading) {
              inputElement.focus();
            }
          }}
        />

        <motion.button
          type="submit"
          disabled={loading}
          className="ml-3 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Send Message"
        >
          <AiOutlineSend size={20} className="p-0.5" />
        </motion.button>
      </motion.form>

      {/* Footer */}
      <motion.footer
        className={`p-4 text-center ${themeStyles.footerBgColor} ${themeStyles.footerTextColor} border-t ${themeStyles.borderColor}`}
        variants={slideIn}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Developed by
          <Link
            href="https://smrehman.vercel.app/"
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Syed Minam Ur Rehman
          </Link>
          <motion.p
            className="mt-1 text-xs text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            © {new Date().getFullYear()} All rights reserved.
          </motion.p>
        </motion.div>
      </motion.footer>
    </motion.div>
  );
}
