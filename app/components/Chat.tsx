"use client";
import { useState, useRef, useEffect } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { motion } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default function Chat() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

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
      // In a production app, place your API key in an environment variable.
      const apiKey = 'AIzaSyAh55-oTWkaaiMqzwZ4hJ_DuGINRkwkLoE';
      if (!apiKey) {
        throw new Error("Google API key is not defined");
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });
      const result = await model.generateContent(newUserMessage.text);

      // Assuming result.response.text() returns the response text
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

  return (
    <div className="flex flex-col h-screen bg-neutral-700 text-white overflow-hidden">
      {/* Header */}
      <header className="bg-neutral-800 p-8 text-center border-b border-neutral-600 shadow-lg">
        <motion.h1
          className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          AI Chat Assistant
        </motion.h1>
        <motion.p
          className="mt-2 text-xl text-gray-300"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        >
          Powered by Google Gemini AI
        </motion.p>
        <motion.p
          className="mt-1 text-sm text-gray-400 italic"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
        >
          Model: Gemini 2.0 flash Thinking Experimental 02-05
        </motion.p>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.17, 0.67, 0.83, 0.67],
            }}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <motion.div
              className={`px-7 py-4 rounded-3xl shadow-lg max-w-5xl break-words ${
                message.sender === "user"
                  ? "bg-neutral-600 text-white font-sans"
                  : "bg-neutral-800 text-gray-100 font-sans"
              } text-lg`}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <ReactMarkdown
                components={{
                  a: ({ href, children }) =>
                    href ? (
                      <Link href={href} className="text-blue-400 underline">
                        {children}
                      </Link>
                    ) : (
                      <>{children}</>
                    ),
                  p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
                  li: ({ children }) => <li className="my-1">{children}</li>,
                  code: ({ children }) => (
                    <code className="bg-gray-700 rounded-md p-1 font-mono text-sm">{children}</code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-400 pl-4  font-serif italic my-4">
                      {children}
                    </blockquote>
                  ),
                  h1: ({ children }) => <h1 className="text-2xl font-bold my-3">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold my-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-medium my-3">{children}</h3>,
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                }}
              >
                {message.text}
              </ReactMarkdown>
            </motion.div>
          </motion.div>
        ))}
        {typing && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-7 py-4 rounded-3xl shadow-lg max-w-2xl break-words bg-neutral-800 text-gray-100 text-base">
              Typing...
            </div>
          </motion.div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="flex items-center p-4 bg-neutral-700 border-t border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
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
          className="flex-grow px-4 py-3 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-800 bg-neutral-600 text-white placeholder-gray-300 text-base"
          ref={(inputElement) => {
            if (inputElement && !loading) {
              inputElement.focus();
            }
          }}
        />

        <motion.button
          type="submit"
          disabled={loading}
          className="ml-3 p-3 rounded-full bg-neutral-900 hover:bg-green-700 text-white disabled:opacity-50 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AiOutlineSend size={24} className="p-0.5" />
        </motion.button>
      </motion.form>

      {/* Footer */}
      <footer className="p-5 bg-neutral-700 text-center text-gray-400 border-t border-gray-700">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Developed by{" "}
          <Link
            href="https://smrehman.vercel.app/"
            className="text-purple-300 hover:underline"
          >
            Syed Minam Ur Rehman
          </Link>
          <p className="mt-1 text-sm italic text-gray-300">
            Innovated with precision by a passionate AI developer.
          </p>
          <motion.p
            className="mt-2 text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            © {new Date().getFullYear()} All rights reserved.
          </motion.p>
        </motion.div>
      </footer>
    </div>
  );
}
