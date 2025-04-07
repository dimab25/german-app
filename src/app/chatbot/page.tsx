"use client";

import normalChat from "@/actions/chat";
import React, { useState } from "react";
import "@/styles/global.css";
import styles from "./page.module.css";
import "./page.module.css";
import { Button, Form } from "react-bootstrap";

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
    <div>
      <div className={styles.chatContainer}>
        {messages &&
          messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.singleMessageContainer} ${
                msg.role === "user" ? styles.userMessage : styles.otherMessage
              }`}
            >
              <strong>
                {msg.role === "user" ? "You:" : "German teacher:"}
              </strong>{" "}
              {msg.content}
            </div>
          ))}
      </div>
      <div className={styles.inputChatContainer}>
        <Form id="form">
          <div className={styles.sendMessageContainer}>
            <Form.Group controlId="message-input">
              <Form.Control
                type="text"
                as="textarea"
                placeholder="Type a message"
                name="message"
                autoCapitalize="on"
                autoComplete="off"
                autoCorrect="on"
                onChange={(e) => setInputMessage(e.target.value)}
                value={inputMessage}
              />
            </Form.Group>
            {inputMessage.length > 0 ? (
              <Button onClick={handleChat} type="submit">
                Send
              </Button>
            ) : (
              <Button disabled>Send</Button>
            )}
            <Button onClick={handleClearChat}>Clear</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default NormalChat;
