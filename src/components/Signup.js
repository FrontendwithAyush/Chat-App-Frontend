import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "./image.jpg";
import FloatingAlert from "./FloatingAlert";

const Signup = (props) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: "success", message: "" });
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  let history = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;
    props.setProgress(10);
    const responce = await fetch(
      "https://chat-app-backend-yloe.onrender.com/api/auth/createuser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );
    props.setProgress(35);
    const json = await responce.json();
    props.setProgress(75);
    if (json.success) {
      props.setUserId(json.user.id);
      props.setName(json.user.name);
      //save token and redirect
      localStorage.setItem("id", json.user.id);
      localStorage.setItem("name", json.user.name);
      localStorage.setItem("token", json.authtoken);
      setAlertInfo({
        type: "success",
        message: "Account Created  Successfully",
      });
      setShowAlert(true);
      setTimeout(() => {
        history("/"); // navigate after 2s
      }, 2000);
    } else {
      setAlertInfo({ type: "warning", message: "User already exists." });
      setShowAlert(true);
    }
    props.setProgress(100);
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleButton = () => {
    history("/login");
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
            id="signup-card"
            className="card "
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
                Create an account
              </h2>
              <div className="">
                <form onSubmit={handleSubmit}>
                  <div className="">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      aria-describedby="emailHelp"
                      onChange={onChange}
                      name="name"
                      required
                      minLength={3}
                    />
                  </div>
                  <div className="">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      aria-describedby="emailHelp"
                      onChange={onChange}
                      name="email"
                    />
                  </div>
                  <div className="">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      onChange={onChange}
                      name="password"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="my-1">
                    <label htmlFor="cpassword" className="form-label">
                      Conform Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="cpassword"
                      onChange={onChange}
                      name="cpassword"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="d-flex flex-column ">
                    <button
                      type="submit"
                      className="btn my-1"
                      style={{
                        background: "linear-gradient(#ff5f6d,#ffc371)",
                      }}
                    >
                      <span style={{ color: "white" }}>SignUp</span>
                    </button>
                  </div>
                </form>
                <span>Already have an account?</span>
                <button
                  className="my-1"
                  style={{
                    background: "linear-gradient(#ff5f6d,#ffc371)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    cursor: "pointer",
                    border: "none",
                  }}
                  onClick={handleButton}
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
