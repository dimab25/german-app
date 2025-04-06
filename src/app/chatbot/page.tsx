"use client";

import normalChat from "@/actions/chat";
import React, { useState } from "react";

export type ChatMessage = {
  role: string;
  content: string;
};

function NormalChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleChat = async () => {
    if (!inputMessage.trim()) {
      console.log("type a message first");
      return;
    }
    // creating user's message object and including it into the array of messages
    const userMessage: ChatMessage = { content: inputMessage, role: "user" };
    setMessages((prev) => {
      return [...prev, userMessage];
    });

    setInputMessage("");

    // normalChat is the function connecting with the API and it receives the user's message - if it comes back it means that it can only be the response from the AI
    const chatResult = await normalChat(inputMessage);
    if (chatResult) {
      setMessages((prev) => {
        return [...prev, { role: "assistant", content: chatResult }];
      });
    } else {
      console.error("Chat error:");
    }
  };
  const handleClearChat = () => {
    setMessages([]);
  };
  return (
    <div className="mt-4">
      <div className="border rounded p-2 mb-2 h-64 overflow-y-auto">
        {messages &&
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.role === "user" ? "text-left" : "text-right"
              }`}
            >
              <strong>{msg.role === "user" ? "You:" : "Assistant:"}</strong>{" "}
              {msg.content}
            </div>
          ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="border rounded p-2 mr-2 flex-grow"
        />
        <button
          onClick={handleChat}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send
        </button>
        <button
          onClick={handleClearChat}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
}

export default NormalChat;
