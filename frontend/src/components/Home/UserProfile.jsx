import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/user/${id}`, {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching user details");
      }
    };
    fetchUser();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>User Profile</h1>
      <div className="profile-info">
        <img className="img-fluid" src="demo.png" width={100} height={100} alt="Profile" />
        <h2>{user.name}</h2>
        <p><i className="fas fa-envelope pr-1"></i>{user.email}</p>
        <p><i className="fas fa-user-tag pr-1"></i>{user.role}</p>
      </div>
    </div>
  );
};

export default UserProfile;
