"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import "@/styles/global.css";
import styles from "./page.module.css";
import {
  Button,
  Form,
  OverlayTrigger,
  Popover,
  Tooltip,
} from "react-bootstrap";
import { useSession } from "next-auth/react";
import { FaRobot } from "react-icons/fa";
import SidebarChat from "@/components/SidebarChat";
import SaveChatButton from "@/components/SaveChatButton";
import { IoIosSend } from "react-icons/io";
import TooltipModal from "@/components/TooltipModal";
import {
  ChatMessage,
  ChatType,
  RectangleSelection,
  SelectionStates,
} from "../../../types/customTypes";
import { toast } from "react-toastify";

function NormalChat() {
  const { data, status } = useSession();
  const userId = data?.user?.id;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hallo! 👋 Schreibe etwas, um loszulegen.",
    },
  ]);
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
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(false);

  const [nativeLanguage, setNativeLanguage] = useState<string | null>("");
  const [showPopover, setShowPopover] = useState(false);
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [userChats, setUserChats] = useState<ChatType[] | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const tooltipStyle = {
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

    const userMessage: ChatMessage = { content: inputMessage, role: "user" };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInputMessage("");
    setIsChatLoading(true); // START loading

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      message: inputMessage,
      chatHistory: updatedHistory,
    });

    try {
      const response = await fetch(
        "http://localhost:3000/api/gemini-ai-model",
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
        }
      );

      if (!response.ok) {
        toast.error("AI model not available :( Try again!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const result = await response.json();
      const chunks: string[] = result.chunks;
      const updatedHistory: ChatMessage[] = result.chatHistory;

      let assistantMessage: ChatMessage = { content: "", role: "assistant" };
      setMessages([...updatedHistory.slice(0, -1), assistantMessage]);

      for (let i = 0; i < chunks.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastIndex = updatedMessages.length - 1;
          updatedMessages[lastIndex] = {
            ...updatedMessages[lastIndex],
            content: updatedMessages[lastIndex].content + chunks[i],
          };
          return updatedMessages;
        });
      }
    } catch (err) {
      console.error("Failed to fetch chat response", err);
    } finally {
      setIsChatLoading(false); // STOP loading
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hallo! 👋 Schreibe etwas, um loszulegen.",
      },
    ]);
    setSelectedText("");
  };

  const fetchWordInfo = async (
    text: string,
    context: string,
    language: string
  ) => {
    setIsLoadingDefinition(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        selectedText: text,
        context: context,
        language: language,
      });

      const response = await fetch(
        "http://localhost:3000/api/gemini-word-info",
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
        }
      );

      if (!response.ok) {
        console.log("Error fetching word information");
        toast.error("AI model not available :( Try again!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const result = await response.json();
      console.log(result.text);
      setGeminiDefinition(result.text);
    } catch (error) {
      console.log("error");
    } finally {
      setIsLoadingDefinition(false);
    }
  };

  function handleSelectionStart() {
    setSelectionState("selecting");
    setSelectedText(null);
  }

  function handleSelectionStop() {
    const currentSelection = document.getSelection();
    if (!currentSelection) return;

    const text = currentSelection.toString();

    if (!text) {
      setSelectionState("not-selecting");
      setSelectedText(null);
      setSelectedMessage(null);
      return;
    }

    const selectedTextRectangle = currentSelection
      .getRangeAt(0)
      .getBoundingClientRect();

    setSelectedText(text);

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

    // Get the starting point of the selected text
    const anchorNode = currentSelection.anchorNode;

    // Check if there is any selected text
    if (anchorNode) {
      // Go up from the selected text and find the nearest message container
      const messageElement = anchorNode.parentElement?.closest(
        `.${styles.singleMessageContainer}` // Look for an element with the class 'singleMessageContainer'
      );

      // If we found the message that was selected
      if (messageElement) {
        // Get the full text of that message
        const fullText = messageElement.textContent || ""; // If no text, use an empty string

        // Remove extra spaces at the beginning or end of the text and save it in the state
        setSelectedMessage(fullText.trim());
      }
    }
  }

  const handleSendToChat = async () => {
    if (selectedText && selectedMessage) {
      const language = nativeLanguage || "english";
      await fetchWordInfo(selectedText, selectedMessage, language);
      setShowPopover(true);
    }
  };

  const openFlashcardModal = () => {
    setShowPopover(false);
    setShowFlashcardModal(true);
  };

  const getUserLanguage = async () => {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`);
    const result = await response.json();
    setNativeLanguage(result.data.native_language);
  };

  const getUserChats = async () => {
    const requestOptions = {
      method: "GET",
    };

    const response = await fetch(
      `http://localhost:3000/api/users/${userId}/chats`,
      requestOptions
    );

    const result = await response.json();
    console.log(result.data);
    setUserChats(result.data);
  };

  useEffect(() => {
    if (status === "authenticated" && userId) {
      getUserLanguage();
      getUserChats();
    }
  }, [status, userId]);

  useEffect(() => {
    document.addEventListener("selectstart", handleSelectionStart);
    document.addEventListener("mouseup", handleSelectionStop);

    return () => {
      document.removeEventListener("selectstart", handleSelectionStart);
      document.removeEventListener("mouseup", handleSelectionStop);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div>
      <div className={styles.topButtonsContainer}>
        {data?.user ? <SidebarChat userChats={userChats} /> : ""}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {data?.user ? (
            <SaveChatButton getUserChats={getUserChats} messages={messages} />
          ) : (
            ""
          )}
          <Button
            className={
              messages.length > 1
                ? styles.clearButton
                : `${styles.clearButton} ${styles.disabled}`
            }
            onClick={handleClearChat}
            disabled={messages.length <= 1}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className={styles.chatContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.singleMessageContainer} ${
              msg.role === "user" ? styles.userMessage : styles.otherMessage
            }`}
          >
            {msg.role === "user" ? (
              <>
                <strong>You:</strong> <span>{msg.content}</span>
              </>
            ) : (
              <>
                <strong>
                  🤖
                  {msg.content === "" && (
                    <span style={{ marginLeft: "8px" }}>
                      <div
                        className="spinner-border spinner-border-sm text-secondary"
                        role="status"
                      />
                    </span>
                  )}
                </strong>
                <span>: {msg.content}</span>
              </>
            )}
          </div>
        ))}
        {selectedText && selectionPosition && !showFlashcardModal && (
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={
              <Popover>
                <Popover.Header className={styles.popoverHeader} as="h4">
                  {selectedText}
                  {data?.user ? (
                    <OverlayTrigger
                      overlay={<Tooltip>Create a new flashcard</Tooltip>}
                      placement="bottom"
                    >
                      {isLoadingDefinition ? (
                        <div></div>
                      ) : (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={openFlashcardModal}
                          className={styles.createFlashcardBtn}
                        >
                          +
                        </Button>
                      )}
                    </OverlayTrigger>
                  ) : (
                    ""
                  )}
                </Popover.Header>

                <Popover.Body style={{ padding: "1.4rem" }}>
                  {isLoadingDefinition ? (
                    <div className={styles.spinnerContainer}>
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      />
                    </div>
                  ) : (
                    geminiDefinition
                  )}
                </Popover.Body>
              </Popover>
            }
          >
            <p className={styles.tooltip} style={tooltipStyle}>
              <Button className={styles.buttonAI} onClick={handleSendToChat}>
                <span>ask AI</span>
                <FaRobot />
              </Button>
            </p>
          </OverlayTrigger>
        )}
        {/* This is basically creating a marker at the end of the chat container, so that whenever a messages is added to the chat it will scroll automatically to that message with the scrollIntoView method */}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputChatContainer}>
        <Form id="form">
          <div className={styles.sendMessageContainer}>
            <Form.Group controlId="message-input">
              <Form.Control
                className={styles.sendMessageInput}
                type="text"
                as="textarea"
                placeholder="Type a message"
                name="message"
                autoCapitalize="on"
                autoComplete="off"
                autoCorrect="on"
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleChat();
                  }
                }}
                value={inputMessage}
              />
            </Form.Group>
            {inputMessage.length > 0 ? (
              <Button onClick={handleChat} type="submit">
                <IoIosSend className={styles.icon} />
              </Button>
            ) : (
              <Button disabled>
                <IoIosSend className={styles.icon} />
              </Button>
            )}
          </div>
        </Form>
      </div>

      {geminiDefinition && (
        <TooltipModal
          selectedText={selectedText || ""}
          geminiDefinition={geminiDefinition || ""}
          show={showFlashcardModal}
          onHide={() => {
            setShowFlashcardModal(false);
            setSelectedText("");
            setGeminiDefinition("");
          }}
        />
      )}
    </div>
  );
}

export default NormalChat;
