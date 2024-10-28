import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import "../styles/notification.css"; // Adjust according to your actual folder structure

function NotificationList({ token }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    const res = await fetch('http://localhost:8000/notification', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setNotifications(data);
  };

  const viewPost = (id) => {
    navigate(`/post/${id}`);
  };

  // Sort notifications by 'createdAt' to show recent notifications first
  const sortedNotifications = notifications
    .slice() // Create a shallow copy to avoid mutating the original array
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Most recent first

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {sortedNotifications.length ? (
        sortedNotifications.map(notification => (
          <div key={notification._id} className="notification-container">
            <p className="mr-4">{notification.message}</p>
            <p className="notification-email"><i>Posted by: {notification.email}</i></p>
            <p className="notification-created-at"><i>Posted at: {notification.createdAt}</i></p>
            <button
              onClick={() => viewPost(notification.postId)} // Redirect to the post
              className="notification-button"
            >
              View Post
            </button>
          </div>
        ))
      ) : (
        <p>No notifications available.</p>
      )}
    </div>
  );
}

NotificationList.propTypes = {
  token: PropTypes.string.isRequired,
};

export default NotificationList;
