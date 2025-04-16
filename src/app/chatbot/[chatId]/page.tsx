"use client";

import React, { useEffect, useState } from "react";
import { ChatMessage, RectangleSelection, SelectionStates } from "../page";
import { useSession } from "next-auth/react";
import styles from "../page.module.css";

type ComponentProps = {
  params: Promise<{ chatId: string }>;
};

async function SingleChatPage({ params }: ComponentProps) {
  console.log("params :>> ", await params);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const getSingleChat = async () => {
    const requestOptions = {
      method: "GET",
    };

    const response = await fetch(
      "http://localhost:3000/api/chats/67ff9c5fa4255c4c0df52d2b",
      requestOptions
    );

    const result = await response.json();
    console.log(result);
    setMessages(result.data[0].messages);
  };

  useEffect(() => {
    getSingleChat();
  }, []);

  return (
    <div>
      {messages &&
        messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.singleMessageContainer} ${
              msg.role === "user" ? styles.userMessage : styles.otherMessage
            }`}
          >
            <strong>{msg.role === "user" ? "You:" : "Bot:"}</strong>{" "}
            <span>{msg.content}</span>
          </div>
        ))}
    </div>
  );
}

export default SingleChatPage;
