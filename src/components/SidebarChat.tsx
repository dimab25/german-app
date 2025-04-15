import React, { use, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "../styles/Sidebar.css";

export type ChatType = {
  created_at: string;
  messages: MessagesType[];
  updatedAt: string;
  user_id: string;
  _id: string;
};

export type MessagesType = {
  content: string;
  role: string;
};

function SidebarChat() {
  const [chats, setChats] = useState<ChatType[] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getUsersChat = async () => {
    const requestOptions = {
      method: "GET",
    };

    const response = await fetch(
      "http://localhost:3000/api/chats/67f7823eb57154d33c6dd249",
      requestOptions
    );

    const result = await response.json();

    console.log(result.data);
    setChats(result.data);
  };

  useEffect(() => {
    getUsersChat();
  }, []);

  return (
    <div className="toggle-container">
      <Button className="sidebarToggle" onClick={toggleSidebar}>
        {sidebarOpen ? "Close" : "Chats"}
      </Button>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h4>Your Saved Chats</h4>

        <ul>
          {chats &&
            chats.map((chat, index) => <li key={index}>ID: {chat._id}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default SidebarChat;
