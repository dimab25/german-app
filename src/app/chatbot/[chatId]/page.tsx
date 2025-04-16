"use client";

import React, { useEffect, useState } from "react";
import { ChatMessage, RectangleSelection, SelectionStates } from "../page";
import { useSession } from "next-auth/react";
import styles from "../page.module.css";

function SingleChatPage() {
  const { data } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const [selectedText, setSelectedText] = useState<string | null>("");
  const [selectedMessage, setSelectedMessage] = useState<string | null>("");

  const [selectionState, setSelectionState] =
    useState<SelectionStates>("not-selecting");
  const [selectionPosition, setSelectionPosition] =
    useState<RectangleSelection>();

  const [geminiDefinition, setGeminiDefinition] = useState<string | undefined>(
    ""
  );

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

  // const handleChat = async () => {
  //   if (!inputMessage.trim()) {
  //     console.log("type a message first");
  //     return;
  //   }
  //   // creating user's message object and including it into the array of messages
  //   const userMessage: ChatMessage = { content: inputMessage, role: "user" };
  //   setMessages((prev) => {
  //     return [...prev, userMessage];
  //   });

  //   setInputMessage("");

  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   const raw = JSON.stringify({
  //     message: inputMessage,
  //   });

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //   };

  //   const response = await fetch(
  //     "http://localhost:3000/api/gemini-ai-model",
  //     requestOptions
  //   );

  //   if (!response.ok) {
  //     console.log("Error getting a response by the AI model");
  //   }

  //   if (response.ok) {
  //     const result = await response.json();
  //     const AIMessage: ChatMessage = {
  //       content: result.text,
  //       role: "assistant",
  //     };
  //     setMessages((prev) => {
  //       return [...prev, AIMessage];
  //     });
  //   }
  // };

  // const handleUpdateChat = async (
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) => {
  //   e.preventDefault();

  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   const raw = JSON.stringify({
  //     user_id: data?.user?.id,
  //     messages: messages,
  //   });

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //   };

  //   const response = await fetch(
  //     "http://localhost:3000/api/chats",
  //     requestOptions
  //   );

  //   const result = await response.json();
  //   console.log(result);
  // };

  // function handleSelectionStart() {
  //   setSelectionState("selecting");
  //   setSelectedText(null);
  // }

  // function handleSelectionStop() {
  //   //1. grab the active selection

  //   const currentSelection = document.getSelection();

  //   if (!currentSelection) return;

  //   //2. grab the text selected
  //   const text = currentSelection.toString();

  //   if (!text) {
  //     setSelectionState("not-selecting");
  //     setSelectedText(null);
  //     setSelectedMessage(null);
  //     return; // this is to avoid grabbing values if we don't have a text selected
  //   }

  //   //3. Get the rectangle position
  //   const selectedTextRectangle = currentSelection
  //     .getRangeAt(0)
  //     .getBoundingClientRect();
  //   //4. setting states
  //   setSelectedText(text);

  //   const halfRectWidth = selectedTextRectangle.width / 2;
  //   setSelectionPosition({
  //     x: selectedTextRectangle.left + selectedTextRectangle.width / 2,
  //     y:
  //       selectedTextRectangle.top +
  //       selectedTextRectangle.height +
  //       window.scrollY +
  //       8,
  //     width: selectedTextRectangle.width,
  //     height: selectedTextRectangle.height,
  //   });
  //   setSelectionState("text-selected");
  //   // 5. grab full context (message content)
  //   const anchorNode = currentSelection.anchorNode;
  //   // anchordNode referso to the DOM node where the text selection happens
  //   if (anchorNode) {
  //     // with .parentElement we access the element that holds the text node
  //     // .closest looks for the first parent element with the classname of a single chat msg
  //     const messageElement = anchorNode.parentElement?.closest("");
  //     if (messageElement) {
  //       // once we found the container, we extract the text with textContent
  //       const fullText = messageElement.textContent || "";
  //       setSelectedMessage(fullText.trim());
  //     }
  //   }
  // }

  useEffect(() => {
    getSingleChat();
  }, []);

  // useEffect(() => {
  //   document.addEventListener("selectstart", handleSelectionStart);
  //   document.addEventListener("mouseup", handleSelectionStop);

  //   return () => {
  //     document.removeEventListener("selectstart", handleSelectionStart);
  //     document.removeEventListener("mouseup", handleSelectionStop);
  //   };
  // }, []);
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
