"use client";

import { ChatMessage } from "@/app/chatbot/page";
import { useSession } from "next-auth/react";
import React from "react";
import { Button } from "react-bootstrap";

type SaveChatButtonProps = {
  messages: ChatMessage[];
};

function SaveChatButton({ messages }: SaveChatButtonProps) {
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
  };
  return (
    <div>
      {messages.length > 1 ? (
        <Button onClick={handleSaveChat}>Save</Button>
      ) : (
        <Button disabled>Save</Button>
      )}
    </div>
  );
}

export default SaveChatButton;
