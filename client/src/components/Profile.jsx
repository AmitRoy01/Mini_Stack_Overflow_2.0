
import React, { useEffect, useState } from "react";

const Profile = ({ token }) => {
  const [userEmail, setUserEmail] = useState("");

  const fetchUserEmail = async () => {
    const res = await fetch(`http://localhost:8000/Users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUserEmail(data.email); // Assuming the API returns an object with an email property
  };

  useEffect(() => {
    if (token) {
      fetchUserEmail(); // Fetch email when component mounts and token is present
    }
  }, [token]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">Profile</h2>
      {userEmail ? (
        <p className="text-green-600">User Email: {userEmail}</p>
      ) : (
        <p className="text-red-600">Loading...</p>
      )}
    </div>
  );
};

export default Profile;
