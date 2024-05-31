import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './student.css';

const UserList = () => {
  const { user } = useContext(Context);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/user/users-except-tpo", {
          withCredentials: true,
        });
        setUsers(response.data.users);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching users");
      }
    };
    
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:4000/api/v1/user/${userId}`, {
          withCredentials: true,
        });
        setUsers(users.filter((user) => user._id !== userId));
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting user");
      }
    }
  };

  // Calculate the users for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div id="profile">
      <section id="user-list" className="main">
        <div className="container">
          <h1>Registered Users</h1>
          {users.length <= 0 ? (
            <h4>No Users Found</h4>
          ) : (
            <div className="user-dashboard-info-box table-responsive mb-0 bg-white p-4 shadow-sm">
              <table className="table manage-candidates-top mb-0">
                <thead>
                  <tr>
                    <th>Candidate Name</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr className="candidates-list" key={user._id}>
                      <td className="title">
                        <div className="thumb">
                          <img className="img-fluid" src="demo.png" width={60} height={60} alt="Profile" />
                        </div>
                        <div className="candidate-list-details">
                          <div className="candidate-list-info">
                            <div className="candidate-list-title">
                              <h5 className="mb-0">{user.name}</h5>
                            </div>
                            <div className="candidate-list-option">
                              <ul className="list-unstyled">
                                <li><i className="fas fa-envelope pr-1"></i>{user.email}</li>
                                <li><i className="fas fa-user-tag pr-1"></i>{user.role}</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="candidate-list-favourite-time text-center">
                        <span className="candidate-list-time order-1">Active</span>
                      </td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-center mt-3 mt-sm-3">
                <ul className="pagination justify-content-center mb-0">
                  {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                      <a onClick={() => paginate(index + 1)} className="page-link" href="#">
                        {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserList;
