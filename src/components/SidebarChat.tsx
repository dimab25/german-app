import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "../styles/Sidebar.css";

function SidebarChat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getUsersChat = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "http://localhost:3000/api/chats/67f7823eb57154d33c6dd249",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <Button className="sidebarToggle" onClick={toggleSidebar}>
        {sidebarOpen ? "Close Chats" : "Open Chats"}
      </Button>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h4>Your Saved Chats</h4>

        <ul>
          <li>Chat on April 1</li>
          <li>Grammar Practice</li>
          <li>Shopping Advice</li>
        </ul>
      </div>
    </div>
  );
}

export default SidebarChat;
