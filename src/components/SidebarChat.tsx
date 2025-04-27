import React, { use, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "../styles/Sidebar.css";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChatType } from "../../types/customTypes";

type SidebarChatProps = {
  userChats: ChatType[] | null;
};

function SidebarChat({ userChats }: SidebarChatProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="sidebar-wrapper">
      <Button className="sidebarToggle" onClick={toggleSidebar}>
        {sidebarOpen ? "Close" : "Chats"}
      </Button>

      {sidebarOpen && (
        <div className="sidebar">
          <h4 className="sidebar-title">Your Saved Chats</h4>
          <ul>
            {userChats &&
              userChats.map((chat, index) => (
                <Link
                  className="list-element"
                  key={index}
                  href={`chatbot/${chat._id}`}
                >
                  <li>Date: {new Date(chat.created_at).toLocaleString()}</li>
                </Link>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SidebarChat;
