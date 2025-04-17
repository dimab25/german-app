"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type MessagesType = {
  content: string;
  role: string;
};

function SingleChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const [messages, setMessages] = useState<MessagesType[]>([]);

  const getSingleChat = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/chats/${chatId}`);
      const result = await response.json();
      setMessages(result.data[0].messages);
    } catch (error) {
      console.error("Error fetching single chat:", error);
    }
  };

  useEffect(() => {
    getSingleChat();
  }, [chatId]);

  return (
    <div>
      <h1>This is chat {chatId}</h1>
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.role}`}>
          <strong>{msg.role === "user" ? "You:" : "Bot:"}</strong>{" "}
          <span>{msg.content}</span>
        </div>
      ))}
    </div>
  );
}

export default SingleChatPage;
