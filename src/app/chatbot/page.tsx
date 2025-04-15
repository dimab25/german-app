"use client";

import React, { Suspense, useEffect, useState } from "react";
import "@/styles/global.css";
import styles from "./page.module.css";
import "./page.module.css";
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { FaRobot } from "react-icons/fa";

export type ChatMessage = {
  role: string;
  content: string;
};

type RectangleSelection = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type SelectionStates = "not-selecting" | "selecting" | "text-selected";

function NormalChat() {
  const { data } = useSession();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const [selectedText, setSelectedText] = useState<string | null>("");

  const [selectionState, setSelectionState] =
    useState<SelectionStates>("not-selecting");
  const [selectionPosition, setSelectionPosition] =
    useState<RectangleSelection>();

  const [geminiDefinition, setGeminiDefinition] = useState<string | undefined>(
    ""
  );
  const [showPopover, setShowPopover] = useState(false);

  const tooltipStyle = {
    position: "absolute",
    transform: `translate(-50%, 0)`,
    left: `${selectionPosition?.x}px`,
    top: `${selectionPosition?.y}px`,
    zIndex: 9999,
  };

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
    setSelectedText("");
  };

  const fetchWordInfo = async (text: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      word: text,
      // selectedSentence: selectedSentence,
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
      console.log(result.text);

      setGeminiDefinition(result.text);
    } catch (error) {
      console.log("error");
    }
  };

  const handleSaveChat = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      user_id: data.user.id,
      messages: messages,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch(
      "http://localhost:3000/api/chats",
      requestOptions
    );

    const result = await response.json();
    console.log(result);
  };

  function handleSelectionStart() {
    setSelectionState("selecting");
    setSelectedText(null);
  }

  function handleSelectionStop() {
    //1. grab the active selection

    const currentSelection = document.getSelection();

    if (!currentSelection) return;

    //2. grab the text selected
    const text = currentSelection.toString(); // add trim

    if (!text) {
      setSelectionState("not-selecting");
      setSelectedText(null);
      return; // this is to avoid grabbing values if we don't have a text selected
    }
    //3. Get the rectangle position
    const selectedTextRectangle = currentSelection
      .getRangeAt(0)
      .getBoundingClientRect();
    //4. setting states
    setSelectedText(text);
    const halfRectWidth = selectedTextRectangle.width / 2;
    setSelectionPosition({
      x: selectedTextRectangle.left + selectedTextRectangle.width / 2,
      y:
        selectedTextRectangle.top +
        selectedTextRectangle.height +
        window.scrollY +
        8,
      width: selectedTextRectangle.width,
      height: selectedTextRectangle.height,
    });
    setSelectionState("text-selected");
  }

  const handleSendToChat = async () => {
    if (selectedText) {
      await fetchWordInfo(selectedText);
    }
    setShowPopover(true);
  };

  useEffect(() => {
    document.addEventListener("selectstart", handleSelectionStart);
    document.addEventListener("mouseup", handleSelectionStop);

    return () => {
      document.removeEventListener("selectstart", handleSelectionStart);
      document.removeEventListener("mouseup", handleSelectionStop);
    };
  }, []);

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
              <strong>{msg.role === "user" ? "You:" : "Bot:"}</strong>{" "}
              <span>{msg.content}</span>
            </div>
          ))}

        {selectedText && selectionPosition && (
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            rootClose
            overlay={
              <Popover>
                <Popover.Header as="h3">Word: {selectedText}</Popover.Header>
                <Popover.Body>
                  {geminiDefinition ?? geminiDefinition}
                </Popover.Body>
              </Popover>
            }
          >
            <p style={tooltipStyle}>
              <Button className={styles.buttonAI} onClick={handleSendToChat}>
                <span>ask AI</span>
                <FaRobot />
              </Button>
            </p>
          </OverlayTrigger>
        )}
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
          <button onClick={handleSaveChat}>Save</button>
        </Form>
      </div>
    </div>
  );
}

export default NormalChat;
