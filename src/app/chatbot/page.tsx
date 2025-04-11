"use client";

import React, { useEffect, useState } from "react";
import "@/styles/global.css";
import styles from "./page.module.css";
import "./page.module.css";
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { Chat } from "@google/genai";

export type ChatMessage = {
  role: string;
  content: string;
};

function NormalChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedWord, setSelectedWord] = useState<string | undefined>("");
  const [geminiDefinition, setGeminiDefinition] = useState<string | undefined>(
    ""
  );
  const [selectedSentence, setSelectedSentence] = useState<string | undefined>(
    ""
  );

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

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      message: inputMessage,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch(
      "http://localhost:3000/api/gemini-ai-model",
      requestOptions
    );

    if (!response.ok) {
      console.log("Error getting a response by the AI model");
    }

    if (response.ok) {
      const result = await response.json();
      const AIMessage: ChatMessage = {
        content: result.text,
        role: "assistant",
      };
      setMessages((prev) => {
        return [...prev, AIMessage];
      });
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setSelectedWord("");
  };

  const handleTextSelect = (msg: ChatMessage) => {
    console.log(msg);

    const selection = document.getSelection();
    const text = selection?.toString().trim();

    if (text && !text.includes(" ") && msg.role === "assistant") {
      setSelectedSentence(msg.content); // do I need this?
      setSelectedWord(text);
      fetchWordInfo(text, msg.content);
    }
  };

  // const selectText = async () => {
  //   // console.log(document.getSelection()?.toString());
  //   const selection = document.getSelection();
  //   const text = selection?.toString().trim();

  //   // setSelectedWord(document.getSelection()?.toString());
  //   if (text && !text.includes(" ")) {
  //     setSelectedWord(text);
  //     console.log(text);
  //     await fetchWordInfo(text);
  //   }
  // };

  // add the sentence here for context?
  const fetchWordInfo = async (text: string, selectedSentence: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      word: text,
      selectedSentence: selectedSentence,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/gemini-word-info",
        requestOptions
      );

      const result = await response.json();
      console.log(result);
      setGeminiDefinition(result.text);
    } catch (error) {
      console.log("error");
    }
  };

  // useEffect(() => {
  //   document.addEventListener("selectionchange", selectText);
  //   return () => {
  //     document.removeEventListener("selectionchange", selectText);
  //   };
  // }, []);

  return (
    <div>
      <div className={styles.chatContainer}>
        {messages &&
          messages.map((msg, index) => (
            <OverlayTrigger
              trigger="click"
              key={index}
              placement="bottom"
              rootClose
              overlay={
                <Popover>
                  <Popover.Header as="h3">
                    Word: {selectedWord ?? selectedWord}
                  </Popover.Header>

                  <Popover.Body>
                    {selectedWord ? geminiDefinition : ""}
                  </Popover.Body>
                </Popover>
              }
            >
              <div
                key={index}
                onClick={() => {
                  handleTextSelect(msg);
                }}
                className={`${styles.singleMessageContainer} ${
                  msg.role === "user" ? styles.userMessage : styles.otherMessage
                }`}
              >
                <strong>{msg.role === "user" ? "You:" : "Bot:"}</strong>{" "}
                {msg.content}
              </div>
            </OverlayTrigger>
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

            {messages.length > 1 ? (
              <Button onClick={handleClearChat}>Clear</Button>
            ) : (
              <Button disabled>Clear</Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}

export default NormalChat;
