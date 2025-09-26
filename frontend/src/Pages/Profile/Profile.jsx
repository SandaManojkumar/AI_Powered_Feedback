import React, { useEffect, useState } from "react";
import Service from "../../utils/http";
import "./Profile.css";

const obj = new Service();

export default function Profile() {
  const [user, setUser] = useState({});

  const getProfileData = async () => {
    try {
      let data = await obj.get("user/me");
      setUser(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <div className="profile-container">
     
      <div className="avatar">
        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
      </div>

      
      <h1 className="profile-name">{user.name || "Loading..."}</h1>

      <p className="profile-email">{user.email || "Fetching email..."}</p>

      <p className="profile-detail">
        <span className="label">User ID:</span>{" "}
        {user._id || "Fetching user ID..."}
      </p>

      <p className="profile-detail">
        <span className="label">Account Created:</span>{" "}
        {user.createdAt || "Fetching date..."}
      </p>
    </div>
  );
}
