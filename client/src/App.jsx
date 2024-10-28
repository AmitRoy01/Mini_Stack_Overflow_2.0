import { useState } from "react";
import "./App.css";
import Auth from "./components/Auth";
import PostList from "./components/PostList";
import SinglePost from "./components/SinglePost";
import NotificationList from "./components/NotificationList";
import Profile from "./components/Profile"; // Import Profile component
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [token, setToken] = useState(null);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <BrowserRouter>
        {!token ? (
          <Auth setToken={setToken} />
        ) : (
          <div className="container mx-auto">
            <header className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Welcome to Stack Overflow 2.0</h1>
              <div className="flex gap-2">
                <Link to="/notifications" className="notification-icon">
                  <FontAwesomeIcon icon={faBell} />
                </Link>
                <Link to="/profile" className="profile-button">
                  Profile
                </Link>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </header>
            <Routes>
              <Route path="/" element={<PostList token={token} />} />
              <Route path="/post/:postId" element={<SinglePost token={token} />} />
              <Route path="/notifications" element={<NotificationList token={token} />} />
              <Route path="/profile" element={<Profile token={token} />} /> {/* Add Profile route */}
            </Routes>
          </div>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
