import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

const Chat = (props) => {
  const { userId, setProgress } = props;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchId, setSearchId] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Setup socket on mount
  useEffect(() => {
    socket.emit("setup", userId);

    socket.on("receive_message", (data) => {
      if (data.senderId === selectedUser?._id) {
        setMessages((prev) => [
          ...prev,
          { sender: data.senderId, content: data.message },
        ]);
      }
    });

    return () => socket.off("receive_message");
  }, [userId, selectedUser]);

  // Load chat users on mount
  useEffect(() => {
    const fetchChatUsers = async () => {
      setProgress(10);
      try {
        const res = await axios.get(
          "https://chat-app-backend-yloe.onrender.com/api/messages/recent",
          {
            headers: { "auth-token": localStorage.getItem("token") },
          }
        );
        setChatUsers(res.data);
      } catch (error) {
        console.error("Failed to load chat users", error);
      }
      setProgress(100);
    };
    fetchChatUsers();
    // eslint-disable-next-line
  }, []);

  // Load messages when user selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      setProgress(10);
      try {
        const res = await axios.get(
          `https://chat-app-backend-yloe.onrender.com/api/messages/${selectedUser._id}`,
          {
            headers: { "auth-token": localStorage.getItem("token") },
          }
        );

        const formattedMessages = res.data.map((msg) => ({
          sender: msg.sender,
          content: msg.message, // 👈 rename `message` to `content`
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
      setProgress(100);
    };

    fetchMessages();
    // eslint-disable-next-line
  }, [selectedUser]);

  // Send message
  const handleSend = async () => {
    if (!message.trim() || !selectedUser) return;
    setProgress(10);
    try {
      await axios.post(
        "https://chat-app-backend-yloe.onrender.com/api/messages/send",
        { receiver: selectedUser._id, message },
        { headers: { "auth-token": localStorage.getItem("token") } }
      );

      socket.emit("send_message", {
        senderId: userId,
        receiverId: selectedUser._id,
        message,
      });

      setMessages((prev) => [...prev, { sender: userId, content: message }]);
      setMessage("");
    } catch (error) {
      console.error("Send message failed", error);
    }
    setProgress(100);
  };

  // Search new user by ID
  const handleSearch = async () => {
    setProgress(10);
    try {
      const res = await axios.get(
        `https://chat-app-backend-yloe.onrender.com/api/auth/user/${searchId}`,
        {
          headers: { "auth-token": localStorage.getItem("token") },
        }
      );
      setSelectedUser(res.data);
    } catch (err) {
      alert("User not found");
    }
    setProgress(100);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Chat User List */}
        <div className="col-md-4 border-end">
          <div className="mt-3 position-relative">
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search user ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <i
              className="fa-solid fa-magnifying-glass"
              onClick={handleSearch}
              style={{
                position: "absolute",
                top: "50%",
                right: "15px",
                transform: "translateY(-50%)",
                background: "linear-gradient(#ff5f6d, #ffc371)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                cursor: "pointer",
              }}
              title="Search"
            ></i>
          </div>

          <h5 className="my-3" style={{ fontFamily: "Georgia " }}>
            {" "}
            All Chats
          </h5>

          <ul className="list-group">
            {chatUsers.map((user) => (
              <li
                key={user._id}
                className={`list-group-item ${
                  selectedUser?._id === user._id ? "active" : ""
                }`}
                onClick={() => setSelectedUser(user)}
                style={{
                  cursor: "pointer",
                  fontWeight: "400",
                  fontFamily: "Georgia ",
                }}
              >
                {user.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Window */}
        <div className="col-md-8">
          {selectedUser ? (
            <>
              <h5 style={{ fontFamily: "Georgia " }}>
                Chat with {selectedUser.name || selectedUser._id}
              </h5>
              <div
                className="border p-2 mb-3"
                style={{ height: "300px", overflowY: "auto" }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      msg.sender === userId ? "text-end" : "text-start"
                    }`}
                  >
                    <span
                      style={{
                        fontSize: ".8rem",
                        fontWeight: "500",
                        fontFamily: "Georgia ",
                      }}
                      className={`badge ${
                        msg.sender === userId ? "bg-primary " : "bg-secondary "
                      }`}
                    >
                      {msg.content}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="input-group position-relative">
                <input
                  type="text"
                  className="form-control pe-5"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    borderTopRightRadius: ".4rem",
                    borderBottomRightRadius: ".4rem",
                  }} // ensures input doesn't overlap icon
                />

                <i
                  className="fa-regular fa-paper-plane"
                  onClick={handleSend}
                  title="Send"
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "15px",
                    transform: "translateY(-50%)",
                    background: "linear-gradient(#ff5f6d, #ffc371)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    cursor: "pointer",
                    zIndex: 2, // ensures icon is on top of input
                    pointerEvents: "auto", // ensures icon is clickable
                  }}
                ></i>
              </div>
            </>
          ) : (
            <p className="my-5" style={{ fontFamily: "Georgia " }}>
              Select a user to start chatting
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
