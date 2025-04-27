"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { Button } from "react-bootstrap";
import { ChatMessage } from "../../types/customTypes";

type SaveChatButtonProps = {
  messages: ChatMessage[];
  getUserChats: () => Promise<void>;
};

function SaveChatButton({ messages, getUserChats }: SaveChatButtonProps) {
  const { data } = useSession();

  const handleSaveChat = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      user_id: data?.user?.id,
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
    getUserChats();
  };
  return (
    <div>
      {messages.length > 1 ? (
        <Button className="save-chat-btn" onClick={handleSaveChat}>
          Save
        </Button>
      ) : (
        <Button className="save-chat-btn" disabled>
          Save
        </Button>
      )}
    </div>
  );
}

export default SaveChatButton;
