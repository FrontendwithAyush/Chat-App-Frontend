import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import Chat from "./Chat";
import Footer from "./Footer";

const Home = (props) => {
  const { userId, userName, setName, setUserId } = props;

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const id = localStorage.getItem("id");
    const name = localStorage.getItem("name");

    if (token && id && name) {
      setUserId(id);
      setName(name);
      socket.emit("join", id); // Join personal room
    } else {
      navigate("/login");
    }

    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    props.setProgress(10);
    localStorage.removeItem("token");
    props.setProgress(30);
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    props.setProgress(70);
    navigate("/login");
    props.setProgress(100);
  };
  const handleCopy = () => {
    props.setProgress(40);
    navigator.clipboard
      .writeText(userId)
      .then(() => {
        props.setProgress(100);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      <div className="App container">
        <div
          className="d-flex justify-content-between align-items-center"
          // style={{ background: "pink" }}
        >
          <div className="d-flex align-items-center " id="main-home">
            <h3
              style={{
                background: "linear-gradient(#ff5f6d,#ffc371)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "Georgia ",
                letterSpacing: ".1rem",
                cursor: "pointer",
              }}
            >
              ChitChat
            </h3>
            <p style={{ margin: "0rem 1rem" }}>Your Id : {userId}</p>
            <i
              onClick={handleCopy}
              className="fa-regular fa-copy"
              title="Copy"
              style={{
                background: "linear-gradient(#ff5f6d,#ffc371)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                cursor: "pointer",
              }}
            ></i>
          </div>
          <h2 id="home-h3" style={{ fontFamily: "Georgia " }}>
            Welcome, {userName}
          </h2>
          <abbr title="logout">
            <i
              className="fa-solid fa-arrow-right-from-bracket"
              onClick={handleLogout}
              style={{
                cursor: "pointer",
                background: "linear-gradient(#ff5f6d,#ffc371)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            ></i>
          </abbr>
        </div>
        <Chat userId={userId} setProgress={props.setProgress} />
        <div className="fixed-bottom" id="Footer">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
