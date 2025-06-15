import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "./image.jpg";
import FloatingAlert from "./FloatingAlert";

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: "success", message: "" });
  let history = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    props.setProgress(10);
    const responce = await fetch(
      "https://chat-app-backend-yloe.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      }
    );
    props.setProgress(30);
    const json = await responce.json();
    props.setProgress(70);
    if (json.success) {
      props.setUserId(json.user.id);
      props.setName(json.user.name);
      //save token and redirect
      localStorage.setItem("id", json.user.id);
      localStorage.setItem("name", json.user.name);
      localStorage.setItem("token", json.authtoken);
      setAlertInfo({ type: "success", message: "Login successful!" });
      setShowAlert(true);
      setTimeout(() => {
        history("/"); // navigate after 2s
      }, 2000);
    } else {
      setAlertInfo({ type: "danger", message: "Invalid Credentials" });
      setShowAlert(true);
    }
    props.setProgress(100);
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleButton = () => {
    history("/signup");
  };
  return (
    <>
      <FloatingAlert
        show={showAlert}
        type={alertInfo.type}
        message={alertInfo.message}
        onClose={() => setShowAlert(false)}
      />
      <div className="card text-bg-dark" style={{ border: "none" }}>
        <img
          src={image}
          className="card-img"
          alt="..."
          style={{ height: "100vh" }}
        />
        <div className="card-img-overlay d-flex justify-content-center align-items-center">
          <div
            className="card "
            id="login-card"
            style={{
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h2
                style={{
                  background: "linear-gradient(#ff5f6d,#ffc371)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "Georgia ",
                  letterSpacing: ".1rem",
                }}
              >
                Welcome back{" "}
              </h2>
              <div className=" my-1">
                <form onSubmit={handleSubmit}>
                  <div className="my-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control "
                      id="email"
                      name="email"
                      aria-describedby="emailHelp"
                      value={credentials.email}
                      onChange={onChange}
                    />
                  </div>
                  <div className="my-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={onChange}
                    />
                  </div>
                  <div className="d-flex flex-column ">
                    <button
                      type="submit"
                      className="btn   my-1"
                      style={{
                        background: "linear-gradient(#ff5f6d,#ffc371)",
                      }}
                    >
                      <span style={{ color: "white" }}>Log In</span>
                    </button>
                  </div>
                </form>
                <span>Don't have an account?</span>
                <button
                  className="my-2"
                  style={{
                    background: "linear-gradient(#ff5f6d,#ffc371)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    cursor: "pointer",
                    border: "none",
                  }}
                  onClick={handleButton}
                >
                  Signup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
