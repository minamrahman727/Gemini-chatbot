"use client";

import { useState, useRef, useEffect } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { motion } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Chat() {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newUserMessage: { text: string; sender: "user" } = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    try {
      const apiKey = 'AIzaSyAh55-oTWkaaiMqzwZ4hJ_DuGINRkwkLoE';
      if (!apiKey) {
        throw new Error("Google API key is not defined");
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(input);
      const response = result.response.text();

      const newBotMessage: { text: string; sender: "bot" } = { text: response, sender: "bot" };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Error:", error);
      const newBotMessage: { text: string; sender: "bot" } = { text: "Oops! Something went wrong. Please try again later.", sender: "bot" };
      setMessages((prev) => [...prev, newBotMessage]);
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-neutral-600 rounded-lg shadow-xl">
      <div className="flex-1 overflow-y-auto p-8 space-y-6 roounded-lg">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: message.sender === "user" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-6 py-4 rounded-lg shadow-md ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {message.text}
            </div>
          </motion.div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center p-6 bg-gray-900 border-t rounded-lg border-gray-800"
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          className="flex-grow px-6 py-4 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
        />
        <button
          type="submit"
          className="ml-4 p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:bg-indigo-700"
        >
          <AiOutlineSend size={20} />
        </button>
      </form>

      <footer className="p-6 bg-gray-800 text-center text-gray-400 rounded-b-lg">
        Developed by <a href="https://smrehman.vercel.app/" className="text-indigo-500 hover:underline">Syed Minam Ur Rehman</a>
      </footer>
    </div>
  );
}
