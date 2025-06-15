import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useState } from "react";
import LoadingBar from "react-top-loading-bar";

function App() {
  // const { user } = useAuth(); // You must have userId
  const [userId, setUserId] = useState("");
  const [userName, setName] = useState("");
  const [progress, setProgress] = useState(0);

  return (
    <>
      <Router>
        <div className="">
          <LoadingBar color="#ff806a" progress={progress} />
          <Routes>
            <Route
              exact
              path="/"
              element={
                <Home
                  setUserId={setUserId}
                  setName={setName}
                  userId={userId}
                  userName={userName}
                  setProgress={setProgress}
                />
              }
            />
            <Route
              exact
              path="/login"
              element={
                <Login
                  setUserId={setUserId}
                  setName={setName}
                  setProgress={setProgress}
                />
              }
            />
            <Route
              exact
              path="/signup"
              element={
                <Signup
                  setUserId={setUserId}
                  setName={setName}
                  setProgress={setProgress}
                />
              }
            />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
