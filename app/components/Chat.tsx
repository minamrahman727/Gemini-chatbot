"use client";

import { useState, useRef, useEffect } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { motion } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import Link from "next/link";

export default function Chat() {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [typing, setTyping] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "" || loading) return;

    const newUserMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);
    setTyping(true);

    try {
      const apiKey = 'AIzaSyAh55-oTWkaaiMqzwZ4hJ_DuGINRkwkLoE';
      if (!apiKey) {
        throw new Error("Google API key is not defined");
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });

      const result = await model.generateContent(input);
      const response = await result.response.text();

      const newBotMessage = { text: response, sender: "bot" as const };
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
    <div className="flex flex-col min-h-dvh bg-gradient-to-r from-green-500 to-gray-800 text-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-gray-800 p-8 text-center border-b border-gray-700">
        <h1 className="text-4xl font-bold tracking-tight text-shadow-md">
          AI Chat Assistant
        </h1>
        <p className="mt-2 text-xl text-gray-200">
          Powered by Google Gemini AI
        </p>
        <p className="mt-1 text-sm text-gray-300 italic">
          Model: Gemini 2.0 flash Thinking Experimental 02-05
        </p>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: message.sender === "user" ? 50 : -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-7 py-4 rounded-3xl shadow-lg max-w-2xl break-words ${
                message.sender === "user"
                  ? "bg-gradient-to-br from-green-500 to-gray-800 text-white"
                  : "bg-gray-700 text-gray-100"
              } text-lg`}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="px-7 py-4 rounded-3xl shadow-lg max-w-2xl break-words bg-gray-700 text-gray-100 text-base">
              Typing...
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center p-6 bg-gradient-to-r from-green-500 to-gray-800 border-t border-gray-700"
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleSubmit(e);
        }
          }}
          disabled={loading}
          className="flex-grow px-5 py-4 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-800 text-white placeholder-gray-500 text-lg"
          ref={(inputElement) => {
        if (inputElement) {
          if (!loading) {
            inputElement.focus();
          }
        }
          }}
        />

        <button
          type="submit"
          disabled={loading}
          className="ml-4 p-4 rounded-full bg-gradient-to-r from-green-500 to-gray-800 text-white hover:from-gray-800 hover:to-green-500 disabled:opacity-50 transition-colors duration-300"
        >
          <AiOutlineSend size={32} className="p-1"/>
        </button>
      </form>

      {/* Footer */}
      <footer className="p-5 bg-gradient-to-r from-green-500 to-gray-800 text-center text-gray-400 border-t border-gray-700">
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
      </footer>
    </div>
  );
}
