import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../../main";
import "../Application/dj.css"

export default function Profile() {
  const { isAuthorized, setIsAuthorized, setUser, user } = useContext(Context);
  const [editingMode, setEditingMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [userId, setUserId] = useState(null); // State to store the user ID

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/getuser",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setUserId(response.data.user._id); // Set the user ID
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized, setUser, setIsAuthorized]);

  const handleEdit = () => {
    setEditingMode(true);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      // Add more fields as needed
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/v1/user/update/${userId}`,
        formData,
        {
          withCredentials: true,
        }
      );
      // Update the user state with the new data
      setUser({ ...user, ...formData });
      setEditingMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const deleteProfile = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/user/delete/${user._id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.message); // Log success message
      // Optionally, you can navigate to a different page or show a confirmation message
    } catch (error) {
      console.error("Error deleting profile:", error);
      console.log(error.response?.data?.message); // Log error message
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <>
      {user && (
        <section id="profile">
          <div className="container py-5">
            <div className="row">
              <div className="col-lg-4">
                <div className="card mb-4">
                  <div className="card-body text-center">
                    <img
                      src="demo.png"
                      alt="avatar"
                      className="rounded-circle img-fluid"
                      style={{ width: "150px" }}
                    />
                    <h5 className="mt-2">{user.name}</h5>
                    <p className="text-muted mb-1">{user.role || "User"}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="card mb-4">
                  <div className="card-body">
                    {editingMode ? (
                      <>
                        <div className="row mb-3">
                          <div className="col-sm-3">
                            <p className="mb-0">Name</p>
                          </div>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-sm-3">
                            <p className="mb-0">Email</p>
                          </div>
                          <div className="col-sm-9">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-sm-3">
                            <p className="mb-0">Phone</p>
                          </div>
                          <div className="col-sm-9">
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="d-flex justify-content-end">
                          <button onClick={handleSubmit} className="btn btn-primary">Save</button>
                          <button onClick={() => setEditingMode(false)} className="btn btn-outline-secondary ms-2">Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Full Name</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">{user.name}</p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Email</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">{user.email}</p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Role</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">{user.role || "User"}</p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Mobile</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">{user.phone}</p>
                          </div>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-center mb-2">
                          <button onClick={handleEdit} className="btn btn-primary">Edit</button>
                          {/* <button onClick={deleteProfile} className="btn btn-outline-primary ms-1">Delete</button> */}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
