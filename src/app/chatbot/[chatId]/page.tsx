"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "../page.module.css";
import SidebarChat from "@/components/SidebarChat";

type MessagesType = {
  content: string;
  role: string;
};

function SingleChatPage() {
  const params = useParams();
  const chatId = params.chatId;
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
      {/* <SidebarChat /> */}
      <h1>Your saved chat</h1>

      <div className={styles.chatContainer}>
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
    </div>
  );
}

export default SingleChatPage;
