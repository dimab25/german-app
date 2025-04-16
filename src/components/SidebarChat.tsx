import React, { use, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "../styles/Sidebar.css";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
  const { data } = useSession();
  const userId = data?.user?.id;
  const [chats, setChats] = useState<ChatType[] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getUsersChat = async () => {
    const requestOptions = {
      method: "GET",
    };

    const response = await fetch(
      `http://localhost:3000/api/users/${userId}/chats`,
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

      {sidebarOpen && (
        <div className="sidebar">
          <h4>Your Saved Chats</h4>

          <ul>
            {chats &&
              chats.map((chat, index) => (
                <Link key={index} href={`chatbot/${chat._id}`}>
                  <li>ID: {chat._id}</li>
                </Link>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SidebarChat;
