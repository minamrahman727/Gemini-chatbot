"use client";
import  Chat  from "./components/Chat";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-800 to-green-800 text-neutral-200">
      {/* Header Section */}
      {/* <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-indigo-400">
          Gemini Powered AI Assistant
        </h1>
        <h2 className="text-lg text-gray-400 mt-4">
          by <span className="text-indigo-500"><Link href="https://smrehman.vercel.app/ " className="hover:underline hover:text-gray-500 hover:shadow-xl shadow-white">Syed Minam Ur Rehman</Link></span>
        </h2>
        <h3 className="text-md text-gray-50 mt-2">
          Model Name: <span className="text-neutral-300 hover:text-white  hover:underline font-mono"><Link href="https://deepmind.google/technologies/gemini/pro/">Gemini 1.5 Pro</Link> </span>
        </h3>
      </header> */}

      {/* Chat Component */}
      <div className="flex-1 ">
        <Chat />
      </div>
    </div>
  );
}
